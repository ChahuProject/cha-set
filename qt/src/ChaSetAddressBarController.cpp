// qt/src/ChaSetAddressBarController.cpp

#include "ChaSetAddressBarController.h"
#include "ChaSetPathUtil.h"
#include "ChaSetPathHistoryStore.h"

#include <QClipboard>
#include <QDir>
#include <QFileInfo>
#include <QGuiApplication>
#include <QStandardPaths>
#include <QStorageInfo>

namespace {
constexpr int kMaxSubfolderItems = 500;
constexpr int kMaxSuggestions = 12;
} // namespace

ChaSetAddressBarController::ChaSetAddressBarController(QObject *parent)
    : QObject(parent)
{
    connect(&ChaSetPathHistoryStore::instance(), &ChaSetPathHistoryStore::historyChanged,
            this, &ChaSetAddressBarController::historyChanged);
    rebuildSegments();
}

QStringList ChaSetAddressBarController::history() const {
    return ChaSetPathHistoryStore::instance().entries();
}

void ChaSetAddressBarController::setCurrentPath(const QString &path) {
    const QString cleaned = QDir::fromNativeSeparators(QDir::cleanPath(path));
    if (cleaned == m_currentPath)
        return;
    m_currentPath = cleaned;
    rebuildSegments();
    emit currentPathChanged();
}

void ChaSetAddressBarController::rebuildSegments() {
    m_segments.clear();
    const auto segs = chaset::splitPath(m_currentPath, knownFolders(), driveLabels());
    m_segments.reserve(static_cast<qsizetype>(segs.size()));
    const qsizetype lastIndex = static_cast<qsizetype>(segs.size()) - 1;
    for (qsizetype i = 0; i <= lastIndex; ++i) {
        chaset::Segment seg = segs[static_cast<std::size_t>(i)];
        if (i == lastIndex && m_currentPath.size() >= 3 && seg.icon == QLatin1String("folder")) {
            seg.icon = QStringLiteral("folder_open");
        }
        QVariantMap map = chaset::segmentToVariantMap(seg);
        if (i == lastIndex) {
            map.insert(QStringLiteral("hasSubfolders"), chaset::hasSubfolders(seg.realPath));
        }
        m_segments.append(map);
    }
    emit segmentsChanged();
}

void ChaSetAddressBarController::setEditing(bool editing) {
    if (m_editing == editing)
        return;
    m_editing = editing;
    emit editingChanged();
}

void ChaSetAddressBarController::enterEditMode() {
    setEditing(true);
}

void ChaSetAddressBarController::exitEditMode() {
    setEditing(false);
}

bool ChaSetAddressBarController::navigate(const QString &path) {
    return navigateValidated(path, true);
}

bool ChaSetAddressBarController::navigateValidated(const QString &rawPath, bool recordStack) {
    const QString expanded = chaset::expandEnvVars(rawPath.trimmed());
    if (expanded.isEmpty()) {
        if (recordStack && !m_currentPath.isEmpty() &&
            (m_backStack.isEmpty() || m_backStack.last() != m_currentPath)) {
            m_backStack.append(m_currentPath);
        }
        if (!m_forwardStack.isEmpty()) {
            m_forwardStack.clear();
            emit navigationStackChanged();
        }
        navigateToThisPc();
        return true;
    }

    const QString cleaned = QDir::cleanPath(expanded);
    const QFileInfo info(cleaned);
    if (!info.exists()) {
        return false;
    }

    if (info.isFile()) {
        const QString parentDir = QFileInfo(info.absolutePath()).absoluteFilePath();
        const QString selectionPath = info.absoluteFilePath();
        if (recordStack && !m_currentPath.isEmpty() &&
            (m_backStack.isEmpty() || m_backStack.last() != m_currentPath)) {
            m_backStack.append(m_currentPath);
        }
        if (!m_forwardStack.isEmpty()) {
            m_forwardStack.clear();
            emit navigationStackChanged();
        }
        ChaSetPathHistoryStore::instance().add(parentDir);
        setCurrentPath(parentDir);
        setEditing(false);
        emit navigateRequestedWithSelection(parentDir, selectionPath);
        return true;
    }

    if (!info.isDir()) {
        return false;
    }

    const QString abs = QFileInfo(info.absoluteFilePath()).absoluteFilePath();
    if (recordStack && !m_currentPath.isEmpty() &&
        (m_backStack.isEmpty() || m_backStack.last() != m_currentPath)) {
        m_backStack.append(m_currentPath);
    }
    if (!m_forwardStack.isEmpty()) {
        m_forwardStack.clear();
        emit navigationStackChanged();
    }
    ChaSetPathHistoryStore::instance().add(abs);
    setCurrentPath(abs);
    setEditing(false);
    emit navigateRequested(abs);
    return true;
}

void ChaSetAddressBarController::goBack() {
    if (m_backStack.isEmpty())
        return;
    const QString target = m_backStack.last();
    const QString expanded = chaset::expandEnvVars(target.trimmed());
    if (expanded.isEmpty()) {
        m_backStack.removeLast();
        if (!m_currentPath.isEmpty() &&
            (m_forwardStack.isEmpty() || m_forwardStack.last() != m_currentPath)) {
            m_forwardStack.append(m_currentPath);
        }
        emit navigationStackChanged();
        navigateToThisPc();
        return;
    }
    const QFileInfo info(QDir::cleanPath(expanded));
    if (!info.exists() || !info.isDir()) {
        return;
    }
    const QString abs = QFileInfo(info.absoluteFilePath()).absoluteFilePath();
    m_backStack.removeLast();
    if (m_forwardStack.isEmpty() || m_forwardStack.last() != m_currentPath) {
        m_forwardStack.append(m_currentPath);
    }
    emit navigationStackChanged();
    setEditing(false);
    setCurrentPath(abs);
    emit navigateRequested(abs);
}

void ChaSetAddressBarController::goForward() {
    if (m_forwardStack.isEmpty())
        return;
    const QString target = m_forwardStack.last();
    const QString expanded = chaset::expandEnvVars(target.trimmed());
    if (expanded.isEmpty()) {
        m_forwardStack.removeLast();
        if (!m_currentPath.isEmpty() &&
            (m_backStack.isEmpty() || m_backStack.last() != m_currentPath)) {
            m_backStack.append(m_currentPath);
        }
        emit navigationStackChanged();
        navigateToThisPc();
        return;
    }
    const QFileInfo info(QDir::cleanPath(expanded));
    if (!info.exists() || !info.isDir()) {
        return;
    }
    const QString abs = QFileInfo(info.absoluteFilePath()).absoluteFilePath();
    m_forwardStack.removeLast();
    if (m_backStack.isEmpty() || m_backStack.last() != m_currentPath) {
        m_backStack.append(m_currentPath);
    }
    emit navigationStackChanged();
    setEditing(false);
    setCurrentPath(abs);
    emit navigateRequested(abs);
}

void ChaSetAddressBarController::navigateUp() {
    if (m_currentPath.isEmpty())
        return;
    if (m_currentPath.size() == 3 && m_currentPath.endsWith(QLatin1Char('/'))) {
        navigateValidated(QString(), true);
        return;
    }
    const qsizetype idx = m_currentPath.lastIndexOf(QLatin1Char('/'));
    if (idx < 0)
        return;
    QString parent = m_currentPath.left(idx);
    if (parent.size() == 2 && parent.at(1) == QLatin1Char(':'))
        parent += QLatin1Char('/');
    navigateValidated(parent, true);
}

QVariantList ChaSetAddressBarController::subfolders(const QString &path) const {
    QVariantList out;
    if (path.isEmpty()) {
        const auto &labels = driveLabels();
        const auto &folders = knownFolders();
        for (auto it = labels.constBegin(); it != labels.constEnd(); ++it) {
            QVariantMap item;
            const QChar letter = it.key().at(0);
            item.insert(QStringLiteral("displayName"), chaset::formatDriveName(letter, it.value()));
            item.insert(QStringLiteral("realPath"), QStringLiteral("%1:/").arg(QString(letter)));
            item.insert(QStringLiteral("icon"), QStringLiteral("package"));
            out.append(item);
        }
        for (auto it = folders.constBegin(); it != folders.constEnd(); ++it) {
            QVariantMap item;
            item.insert(QStringLiteral("displayName"), it.value());
            item.insert(QStringLiteral("realPath"), it.key());
            item.insert(QStringLiteral("icon"), QStringLiteral("folder"));
            out.append(item);
        }
        return out;
    }

    const QDir dir(path);
    if (!dir.exists())
        return out;

    QStringList names = dir.entryList(QDir::Dirs | QDir::NoDotAndDotDot, QDir::NoSort);
    if (names.size() > kMaxSubfolderItems)
        names = names.mid(0, kMaxSubfolderItems);
    chaset::naturalSort(names);
    out.reserve(names.size());
    for (const QString &name : std::as_const(names)) {
        QVariantMap item;
        item.insert(QStringLiteral("displayName"), name);
        item.insert(QStringLiteral("realPath"), QDir::cleanPath(dir.filePath(name)));
        item.insert(QStringLiteral("icon"), QStringLiteral("folder"));
        out.append(item);
    }
    return out;
}

QVariantList ChaSetAddressBarController::suggestions(const QString &text) const {
    QVariantList out;
    const QString input = chaset::expandEnvVars(text.trimmed());
    if (input.isEmpty())
        return out;

    if (input.size() == 1 && input.at(0).isLetter()) {
        QVariantMap item;
        item.insert(QStringLiteral("displayName"), QStringLiteral("%1:/").arg(input.toUpper()));
        item.insert(QStringLiteral("realPath"), QStringLiteral("%1:/").arg(input.toUpper()));
        item.insert(QStringLiteral("icon"), QStringLiteral("package"));
        out.append(item);
    }

    QString parentDir;
    QString namePrefix;
    if (input.size() >= 2 && input.at(1) == QLatin1Char(':')) {
        parentDir = input.endsWith(QLatin1Char('/'))
                        ? input
                        : QFileInfo(input).absolutePath();
        namePrefix = input.endsWith(QLatin1Char('/')) ? QString()
                                                      : QFileInfo(input).fileName();
        if (namePrefix == input)
            namePrefix.clear();
    } else {
        parentDir = QFileInfo(input).absolutePath();
        namePrefix = QFileInfo(input).fileName();
    }
    if (parentDir.isEmpty())
        parentDir = QDir::rootPath();

    const QDir dir(parentDir);
    if (dir.exists()) {
        QStringList filters;
        if (!namePrefix.isEmpty())
            filters << (namePrefix + QLatin1String("*"));
        QStringList entries = dir.entryList(filters, QDir::Dirs | QDir::NoDotAndDotDot, QDir::Name);
        for (const QString &e : entries) {
            if (out.size() >= kMaxSuggestions)
                break;
            QVariantMap item;
            item.insert(QStringLiteral("displayName"), e);
            item.insert(QStringLiteral("realPath"), QDir::cleanPath(dir.filePath(e)));
            item.insert(QStringLiteral("icon"), QStringLiteral("folder"));
            out.append(item);
        }
    }

    const QStringList hist = history();
    for (const QString &entry : hist) {
        if (out.size() >= kMaxSuggestions)
            break;
        if (!entry.contains(input, Qt::CaseInsensitive))
            continue;
        bool dup = false;
        for (const QVariant &v : out) {
            if (v.toMap().value(QStringLiteral("realPath")) == entry) {
                dup = true;
                break;
            }
        }
        if (dup)
            continue;
        QVariantMap item;
        item.insert(QStringLiteral("displayName"), entry);
        item.insert(QStringLiteral("realPath"), entry);
        item.insert(QStringLiteral("icon"), QStringLiteral("clock"));
        out.append(item);
    }
    return out;
}

void ChaSetAddressBarController::navigateToThisPc() {
    setEditing(false);
    setCurrentPath(QString());
    emit navigateRequested(QString());
}

void ChaSetAddressBarController::copyPathToClipboard(const QString &path) {
    const QString cleaned = QDir::cleanPath(path);
    if (cleaned.isEmpty())
        return;
    QGuiApplication::clipboard()->setText(cleaned);
}

const QHash<QString, QString> &ChaSetAddressBarController::knownFolders() const {
    if (m_foldersDirty)
        buildFolderMaps();
    return m_knownFolders;
}

const QHash<QString, QString> &ChaSetAddressBarController::driveLabels() const {
    if (m_foldersDirty)
        buildFolderMaps();
    return m_driveLabels;
}

void ChaSetAddressBarController::buildFolderMaps() const {
    m_foldersDirty = false;
    m_knownFolders.clear();
    m_driveLabels.clear();

    struct KnownEntry {
        QStandardPaths::StandardLocation location;
        const char *displayName;
    };
    const KnownEntry known[] = {
        {QStandardPaths::DesktopLocation, "桌面"},
        {QStandardPaths::DocumentsLocation, "文档"},
        {QStandardPaths::DownloadLocation, "下载"},
        {QStandardPaths::PicturesLocation, "图片"},
        {QStandardPaths::MusicLocation, "音乐"},
        {QStandardPaths::MoviesLocation, "视频"},
    };
    for (const KnownEntry &entry : known) {
        const QString dir = QStandardPaths::writableLocation(entry.location);
        if (dir.isEmpty())
            continue;
        const QFileInfo info(dir);
        if (!info.isDir())
            continue;
        m_knownFolders.insert(info.absoluteFilePath(), tr(entry.displayName));
    }

    for (const QStorageInfo &volume : QStorageInfo::mountedVolumes()) {
        const QString root = volume.rootPath();
        if (root.size() >= 2 && root.at(0).isLetter() && root.at(1) == QLatin1Char(':')) {
            m_driveLabels.insert(QString(root.at(0)).toUpper(), volume.name());
        }
    }
}
