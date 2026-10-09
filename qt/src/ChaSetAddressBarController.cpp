// qt/src/ChaSetAddressBarController.cpp

#include "ChaSetAddressBarController.h"
#include "ChaSetPathHistoryStore.h"
#include "ChaSetPathUtil.h"

#include <QClipboard>
#include <QDir>
#include <QFileInfo>
#include <QGuiApplication>
#include <QStandardPaths>
#include <QStorageInfo>

namespace {
constexpr int kMaxSubfolderItems = 500;
constexpr int kMaxSuggestions = 12;

struct KnownSpec {
  QStandardPaths::StandardLocation loc;
  const char *id;
  const char *zhName;
  const char *enName;
  const char *aliases[7];
  const char *icon;
};

const KnownSpec kKnownSpecs[] = {
    {QStandardPaths::DesktopLocation,
     "desktop",
     "桌面",
     "Desktop",
     {"桌面", "desktop", "shell:desktop", nullptr},
     "desktop_windows"},
    {QStandardPaths::DocumentsLocation,
     "documents",
     "文档",
     "Documents",
     {"文档", "documents", "document", "my documents", "shell:personal",
      nullptr},
     "description"},
    {QStandardPaths::DownloadLocation,
     "downloads",
     "下载",
     "Downloads",
     {"下载", "downloads", "download", "shell:downloads", nullptr},
     "download"},
    {QStandardPaths::PicturesLocation,
     "pictures",
     "图片",
     "Pictures",
     {"图片", "pictures", "picture", "my pictures", "photos", nullptr},
     "image"},
    {QStandardPaths::MusicLocation,
     "music",
     "音乐",
     "Music",
     {"音乐", "music", "my music", "shell:mymusic", nullptr},
     "music_note"},
    {QStandardPaths::MoviesLocation,
     "videos",
     "视频",
     "Videos",
     {"视频", "videos", "video", "movies", "my videos", nullptr},
     "movie"}};

} // namespace

ChaSetAddressBarController::ChaSetAddressBarController(QObject *parent)
    : QObject(parent) {
  connect(&ChaSetPathHistoryStore::instance(),
          &ChaSetPathHistoryStore::historyChanged, this,
          &ChaSetAddressBarController::historyChanged);
  rebuildSegments();
}

ChaSetAddressBarController::~ChaSetAddressBarController() {
  if (qGuiApp) {
    qGuiApp->removeEventFilter(this);
  }
}

void ChaSetAddressBarController::setVisualItem(QQuickItem *item) {
  if (m_visualItem != item) {
    m_visualItem = item;
    emit visualItemChanged();
  }
}

void ChaSetAddressBarController::setSuggestPopup(QObject *popup) {
  if (m_suggestPopup != popup) {
    m_suggestPopup = popup;
    emit suggestPopupChanged();
  }
}

void ChaSetAddressBarController::setSubfolderPopup(QObject *popup) {
  if (m_subfolderPopup != popup) {
    m_subfolderPopup = popup;
    emit subfolderPopupChanged();
  }
}

bool ChaSetAddressBarController::eventFilter(QObject *watched, QEvent *event) {
  if (m_editing && (event->type() == QEvent::MouseButtonPress ||
                    event->type() == QEvent::TouchBegin)) {
    if (m_visualItem && m_visualItem->window()) {
      QPointF globalPos;
      if (event->type() == QEvent::MouseButtonPress) {
        globalPos = static_cast<QMouseEvent *>(event)->globalPosition();
      } else if (event->type() == QEvent::TouchBegin) {
        auto *touch = static_cast<QTouchEvent *>(event);
        if (!touch->points().isEmpty()) {
          globalPos = touch->points().first().globalPosition();
        }
      }

      const QPointF localPos = m_visualItem->mapFromGlobal(globalPos);
      bool inside = m_visualItem->boundingRect().contains(localPos);

      if (!inside && m_suggestPopup &&
          m_suggestPopup->property("opened").toBool()) {
        const qreal px = m_suggestPopup->property("x").toReal();
        const qreal py = m_suggestPopup->property("y").toReal();
        const qreal pw = m_suggestPopup->property("width").toReal();
        const qreal ph = m_suggestPopup->property("height").toReal();
        if (QRectF(px, py, pw, ph).contains(localPos)) {
          inside = true;
        }
      }

      if (!inside && m_subfolderPopup &&
          m_subfolderPopup->property("opened").toBool()) {
        const qreal px = m_subfolderPopup->property("x").toReal();
        const qreal py = m_subfolderPopup->property("y").toReal();
        const qreal pw = m_subfolderPopup->property("width").toReal();
        const qreal ph = m_subfolderPopup->property("height").toReal();
        if (QRectF(px, py, pw, ph).contains(localPos)) {
          inside = true;
        }
      }

      if (!inside) {
        exitEditMode();
      }
    }
  }
  return QObject::eventFilter(watched, event);
}

QStringList ChaSetAddressBarController::history() const {
  return ChaSetPathHistoryStore::instance().entries();
}

QString ChaSetAddressBarController::editingText() const {
  if (m_currentPath == QLatin1String("recycle-bin:")) {
    return QCoreApplication::translate("ChaSet", "回收站");
  }
  if (m_currentPath.isEmpty()) {
    return QCoreApplication::translate("ChaSet", "此电脑");
  }
  if (!m_virtualBase.isEmpty()) {
    const QString cleanBase =
        QDir::fromNativeSeparators(QDir::cleanPath(m_virtualBase));
    const QString cleanCur =
        QDir::fromNativeSeparators(QDir::cleanPath(m_currentPath));
    if (cleanCur.startsWith(cleanBase, Qt::CaseInsensitive)) {
      const QString relative = cleanCur.mid(cleanBase.size());
      if (relative.isEmpty()) {
        return m_virtualName;
      }
      QString nativeRel = QDir::toNativeSeparators(relative);
      if (nativeRel.startsWith(QLatin1Char('\\')) ||
          nativeRel.startsWith(QLatin1Char('/'))) {
        nativeRel.remove(0, 1);
      }
      return QStringLiteral("%1\\%2").arg(m_virtualName, nativeRel);
    }
  }
  return QDir::toNativeSeparators(m_currentPath);
}

void ChaSetAddressBarController::setCurrentPath(const QString &path) {
  QString trimmed = path.trimmed();
  if (trimmed == QLatin1String("recycle-bin:")) {
    m_virtualBase.clear();
    m_virtualName.clear();
    m_virtualIcon.clear();
    if (m_currentPath == trimmed)
      return;
    m_currentPath = trimmed;
    rebuildSegments();
    emit currentPathChanged();
    emit editingTextChanged();
    return;
  }
  if (trimmed.length() == 2 && trimmed.at(1) == QLatin1Char(':')) {
    trimmed.append(QLatin1Char('/'));
  }
  const QString cleaned =
      trimmed.isEmpty() ? QString()
                        : QDir::fromNativeSeparators(QDir::cleanPath(trimmed));
  if (cleaned == m_currentPath)
    return;

  // 若新路径跳出虚拟基准目录，清除虚拟模式
  if (!m_virtualBase.isEmpty()) {
    const QString cleanBase =
        QDir::fromNativeSeparators(QDir::cleanPath(m_virtualBase));
    if (!cleaned.startsWith(cleanBase, Qt::CaseInsensitive)) {
      m_virtualBase.clear();
      m_virtualName.clear();
      m_virtualIcon.clear();
    }
  }

  m_currentPath = cleaned;
  rebuildSegments();
  emit currentPathChanged();
  emit editingTextChanged();
}

void ChaSetAddressBarController::rebuildSegments() {
  m_segments.clear();
  const auto segs =
      chaset::splitPath(m_currentPath, knownFolders(), driveLabels(),
                        m_virtualBase, m_virtualName, m_virtualIcon);
  m_segments.reserve(static_cast<qsizetype>(segs.size()));
  const qsizetype lastIndex = static_cast<qsizetype>(segs.size()) - 1;
  for (qsizetype i = 0; i <= lastIndex; ++i) {
    chaset::Segment seg = segs[static_cast<std::size_t>(i)];
    if (i == lastIndex && m_currentPath.size() >= 3 &&
        seg.icon == QLatin1String("folder")) {
      seg.icon = QStringLiteral("folder_open");
    }
    QVariantMap map = chaset::segmentToVariantMap(seg);
    if (i == lastIndex && !seg.isTopRoot) {
      map.insert(QStringLiteral("hasSubfolders"),
                 chaset::hasSubfolders(seg.realPath));
    }
    m_segments.append(map);
  }
  emit segmentsChanged();
}

void ChaSetAddressBarController::setEditing(bool editing) {
  if (m_editing == editing)
    return;
  m_editing = editing;
  if (qGuiApp) {
    if (m_editing) {
      qGuiApp->installEventFilter(this);
    } else {
      qGuiApp->removeEventFilter(this);
    }
  }
  emit editingChanged();
}

void ChaSetAddressBarController::enterEditMode() { setEditing(true); }

void ChaSetAddressBarController::exitEditMode() { setEditing(false); }

bool ChaSetAddressBarController::navigate(const QString &path) {
  return navigateValidated(path, true);
}

bool ChaSetAddressBarController::navigateValidated(const QString &rawPath,
                                                   bool recordStack) {
  const QString trimmed = rawPath.trimmed();

  // 1. 回收站输入
  const bool isRecycleBinInput =
      (trimmed == QLatin1String("recycle-bin:") ||
       trimmed == QLatin1String("recycle-bin") ||
       trimmed.compare(QLatin1String("shell:RecycleBinFolder"),
                       Qt::CaseInsensitive) == 0 ||
       trimmed.compare(QString::fromUtf8("回收站"), Qt::CaseInsensitive) == 0 ||
       trimmed.compare(QLatin1String("Recycle Bin"), Qt::CaseInsensitive) ==
           0 ||
       trimmed.compare(QLatin1String("Trash"), Qt::CaseInsensitive) == 0);
  if (isRecycleBinInput) {
    m_virtualBase.clear();
    m_virtualName.clear();
    m_virtualIcon.clear();
    const QString target = QStringLiteral("recycle-bin:");
    if (recordStack && target != m_currentPath) {
      if (m_backStack.isEmpty() || m_backStack.last() != m_currentPath) {
        m_backStack.append(m_currentPath);
      }
      if (!m_forwardStack.isEmpty()) {
        m_forwardStack.clear();
      }
      emit navigationStackChanged();
    }
    ChaSetPathHistoryStore::instance().add(target);
    setCurrentPath(target);
    setEditing(false);
    emit navigateRequested(target);
    return true;
  }

  // 2. 此电脑 / 顶层输入
  const bool isThisPcInput =
      (trimmed.isEmpty() || trimmed == QLatin1String("::root") ||
       trimmed.compare(QString::fromUtf8("此电脑"), Qt::CaseInsensitive) == 0 ||
       trimmed.compare(QLatin1String("This PC"), Qt::CaseInsensitive) == 0 ||
       trimmed.compare(QLatin1String("Computer"), Qt::CaseInsensitive) == 0 ||
       trimmed.compare(QLatin1String("shell:MyComputerFolder"),
                       Qt::CaseInsensitive) == 0);
  if (isThisPcInput) {
    m_virtualBase.clear();
    m_virtualName.clear();
    m_virtualIcon.clear();
    if (recordStack && !m_currentPath.isEmpty()) {
      if (m_backStack.isEmpty() || m_backStack.last() != m_currentPath) {
        m_backStack.append(m_currentPath);
      }
      if (!m_forwardStack.isEmpty()) {
        m_forwardStack.clear();
      }
      emit navigationStackChanged();
    }
    navigateToThisPc();
    return true;
  }

  // 3. 虚拟/已知文件夹匹配（桌面/文档/下载/图片/音乐/视频 等）
  QString matchFirst;
  QString matchSub;
  QString normInput = trimmed;
  if (normInput.startsWith(QLatin1String("virtual:"), Qt::CaseInsensitive)) {
    normInput = normInput.mid(8);
  }
  const int slashIdx = normInput.indexOf(QLatin1Char('/'));
  const int backslashIdx = normInput.indexOf(QLatin1Char('\\'));
  int sepIdx = -1;
  if (slashIdx >= 0 && backslashIdx >= 0)
    sepIdx = std::min(slashIdx, backslashIdx);
  else if (slashIdx >= 0)
    sepIdx = slashIdx;
  else if (backslashIdx >= 0)
    sepIdx = backslashIdx;

  if (sepIdx >= 0) {
    matchFirst = normInput.left(sepIdx).trimmed();
    matchSub = normInput.mid(sepIdx + 1).trimmed();
  } else {
    matchFirst = normInput;
  }

  const KnownSpec *matchedSpec = nullptr;
  for (const auto &spec : kKnownSpecs) {
    for (int i = 0; spec.aliases[i] != nullptr; ++i) {
      if (matchFirst.compare(QString::fromUtf8(spec.aliases[i]),
                             Qt::CaseInsensitive) == 0) {
        matchedSpec = &spec;
        break;
      }
    }
    if (matchedSpec)
      break;
  }

  if (matchedSpec) {
    const QString baseDir = QDir::fromNativeSeparators(
        QStandardPaths::writableLocation(matchedSpec->loc));
    if (!baseDir.isEmpty()) {
      QString targetPath = baseDir;
      if (!matchSub.isEmpty()) {
        targetPath = QDir::cleanPath(baseDir + QLatin1Char('/') +
                                     QDir::fromNativeSeparators(matchSub));
      }
      const QFileInfo targetInfo(targetPath);
      if (targetInfo.exists() && targetInfo.isDir()) {
        m_virtualBase = baseDir;
        m_virtualName =
            QCoreApplication::translate("ChaSet", matchedSpec->zhName);
        m_virtualIcon = QString::fromLatin1(matchedSpec->icon);

        if (recordStack && targetPath != m_currentPath) {
          if (m_backStack.isEmpty() || m_backStack.last() != m_currentPath) {
            m_backStack.append(m_currentPath);
          }
          if (!m_forwardStack.isEmpty()) {
            m_forwardStack.clear();
          }
          emit navigationStackChanged();
        }
        ChaSetPathHistoryStore::instance().add(targetPath);
        setCurrentPath(targetPath);
        setEditing(false);
        emit navigateRequested(targetPath);
        return true;
      }
    }
  }

  // 4. 真实物理绝对路径输入（带有盘符或UNC），清空虚拟模式以按真实物理路径展示
  QString expanded = chaset::expandEnvVars(trimmed);
  if (expanded.size() >= 2 && expanded.at(1) == QLatin1Char(':')) {
    m_virtualBase.clear();
    m_virtualName.clear();
    m_virtualIcon.clear();
  }

  if (expanded.length() == 2 && expanded.at(1) == QLatin1Char(':')) {
    expanded.append(QLatin1Char('/'));
  }

  const QString cleaned = QDir::cleanPath(expanded);
  const QFileInfo info(cleaned);
  if (!info.exists()) {
    return false;
  }

  QString target = QFileInfo(info.absoluteFilePath()).absoluteFilePath();
  QString selectPath;
  if (!info.isDir()) {
    selectPath = target;
    target = QFileInfo(target).absolutePath();
  }

  if (recordStack && target != m_currentPath) {
    if (m_backStack.isEmpty() || m_backStack.last() != m_currentPath) {
      m_backStack.append(m_currentPath);
    }
    if (!m_forwardStack.isEmpty()) {
      m_forwardStack.clear();
    }
    emit navigationStackChanged();
  }

  ChaSetPathHistoryStore::instance().add(target);
  setCurrentPath(target);
  setEditing(false);
  if (selectPath.isEmpty()) {
    emit navigateRequested(target);
  } else {
    emit navigateRequestedWithSelection(target, selectPath);
  }
  return true;
}

void ChaSetAddressBarController::goBack() {
  if (m_backStack.isEmpty())
    return;
  const QString target = m_backStack.last();
  const QString expanded = chaset::expandEnvVars(target.trimmed());
  if (expanded.isEmpty()) {
    m_backStack.removeLast();
    if (m_forwardStack.isEmpty() || m_forwardStack.last() != m_currentPath) {
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
    if (m_backStack.isEmpty() || m_backStack.last() != m_currentPath) {
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
  if (m_currentPath == QLatin1String("recycle-bin:")) {
    navigateToThisPc();
    return;
  }
  if (!m_virtualBase.isEmpty()) {
    const QString cleanBase =
        QDir::fromNativeSeparators(QDir::cleanPath(m_virtualBase));
    const QString cleanCur =
        QDir::fromNativeSeparators(QDir::cleanPath(m_currentPath));
    if (cleanCur.compare(cleanBase, Qt::CaseInsensitive) == 0) {
      navigateToThisPc();
      return;
    }
    const qsizetype idx = cleanCur.lastIndexOf(QLatin1Char('/'));
    if (idx > 0) {
      const QString parent = cleanCur.left(idx);
      navigateValidated(parent, true);
      return;
    }
    navigateToThisPc();
    return;
  }
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
  if (path == QLatin1String("::root")) {
    // 1. 此电脑
    {
      QVariantMap item;
      const QString name = QCoreApplication::translate("ChaSet", "此电脑");
      item.insert(QStringLiteral("displayName"), name);
      item.insert(QStringLiteral("label"), name);
      item.insert(QStringLiteral("realPath"), QString());
      item.insert(QStringLiteral("path"), QString());
      item.insert(QStringLiteral("icon"), QStringLiteral("computer"));
      out.append(item);
    }
    // 2. 回收站
    {
      QVariantMap item;
      const QString name = QCoreApplication::translate("ChaSet", "回收站");
      item.insert(QStringLiteral("displayName"), name);
      item.insert(QStringLiteral("label"), name);
      item.insert(QStringLiteral("realPath"), QStringLiteral("recycle-bin:"));
      item.insert(QStringLiteral("path"), QStringLiteral("recycle-bin:"));
      item.insert(QStringLiteral("icon"), QStringLiteral("recycling"));
      out.append(item);
    }
    // 3. 桌面、文档、下载、图片、音乐、视频
    for (const auto &spec : kKnownSpecs) {
      const QString locName =
          QCoreApplication::translate("ChaSet", spec.zhName);
      QVariantMap item;
      item.insert(QStringLiteral("displayName"), locName);
      item.insert(QStringLiteral("label"), locName);
      item.insert(QStringLiteral("realPath"),
                  QStringLiteral("virtual:%1").arg(locName));
      item.insert(QStringLiteral("path"),
                  QStringLiteral("virtual:%1").arg(locName));
      item.insert(QStringLiteral("icon"), QString::fromLatin1(spec.icon));
      out.append(item);
    }
    return out;
  }
  if (path.isEmpty()) {
    const auto &labels = driveLabels();
    const auto &folders = knownFolders();
    for (auto it = labels.constBegin(); it != labels.constEnd(); ++it) {
      QVariantMap item;
      const QChar letter = it.key().at(0);
      item.insert(QStringLiteral("displayName"),
                  chaset::formatDriveName(letter, it.value()));
      item.insert(QStringLiteral("realPath"),
                  QStringLiteral("%1:/").arg(QString(letter)));
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

  QStringList names =
      dir.entryList(QDir::Dirs | QDir::NoDotAndDotDot, QDir::NoSort);
  if (names.size() > kMaxSubfolderItems)
    names = names.mid(0, kMaxSubfolderItems);
  chaset::naturalSort(names);
  out.reserve(names.size());
  for (const QString &name : std::as_const(names)) {
    QVariantMap item;
    item.insert(QStringLiteral("displayName"), name);
    item.insert(QStringLiteral("realPath"),
                QDir::cleanPath(dir.filePath(name)));
    item.insert(QStringLiteral("icon"), QStringLiteral("folder"));
    out.append(item);
  }
  return out;
}

QVariantList
ChaSetAddressBarController::suggestions(const QString &text) const {
  QVariantList out;
  const QString input = chaset::expandEnvVars(text.trimmed());
  if (input.isEmpty())
    return out;

  // 匹配回收站
  const QString binName = QCoreApplication::translate("ChaSet", "回收站");
  if (binName.startsWith(input, Qt::CaseInsensitive) ||
      QStringLiteral("recycle").startsWith(input, Qt::CaseInsensitive) ||
      QStringLiteral("trash").startsWith(input, Qt::CaseInsensitive)) {
    QVariantMap item;
    item.insert(QStringLiteral("displayName"), binName);
    item.insert(QStringLiteral("realPath"), QStringLiteral("recycle-bin:"));
    item.insert(QStringLiteral("icon"), QStringLiteral("recycling"));
    out.append(item);
  }

  // 匹配此电脑
  const QString thisPcName = QCoreApplication::translate("ChaSet", "此电脑");
  if (thisPcName.startsWith(input, Qt::CaseInsensitive) ||
      QStringLiteral("this pc").startsWith(input, Qt::CaseInsensitive) ||
      QStringLiteral("computer").startsWith(input, Qt::CaseInsensitive)) {
    QVariantMap item;
    item.insert(QStringLiteral("displayName"), thisPcName);
    item.insert(QStringLiteral("realPath"), QString());
    item.insert(QStringLiteral("icon"), QStringLiteral("computer"));
    out.append(item);
  }

  // 匹配已知文件夹
  for (const auto &spec : kKnownSpecs) {
    bool matches = false;
    const QString locName = QCoreApplication::translate("ChaSet", spec.zhName);
    if (locName.startsWith(input, Qt::CaseInsensitive))
      matches = true;
    for (int i = 0; !matches && spec.aliases[i] != nullptr; ++i) {
      if (QString::fromUtf8(spec.aliases[i])
              .startsWith(input, Qt::CaseInsensitive)) {
        matches = true;
      }
    }
    if (matches) {
      QVariantMap item;
      item.insert(QStringLiteral("displayName"), locName);
      item.insert(QStringLiteral("realPath"),
                  QStringLiteral("virtual:%1").arg(locName));
      item.insert(QStringLiteral("icon"), QString::fromLatin1(spec.icon));
      out.append(item);
    }
  }

  if (input.size() == 1 && input.at(0).isLetter()) {
    QVariantMap item;
    item.insert(QStringLiteral("displayName"),
                QStringLiteral("%1:/").arg(input.toUpper()));
    item.insert(QStringLiteral("realPath"),
                QStringLiteral("%1:/").arg(input.toUpper()));
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
    QStringList entries =
        dir.entryList(filters, QDir::Dirs | QDir::NoDotAndDotDot, QDir::Name);
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

const QHash<QString, QString> &
ChaSetAddressBarController::knownFolders() const {
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
    if (root.size() >= 2 && root.at(0).isLetter() &&
        root.at(1) == QLatin1Char(':')) {
      m_driveLabels.insert(QString(root.at(0)).toUpper(), volume.name());
    }
  }
}
