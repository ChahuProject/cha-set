// qt/src/ChaSetPathHistoryStore.cpp

#include "ChaSetPathHistoryStore.h"

#include <QCoreApplication>
#include <QDir>
#include <QFile>
#include <QFileInfo>
#include <QJsonArray>
#include <QJsonDocument>
#include <QJsonObject>
#include <QStandardPaths>

namespace {
constexpr const char *kHistoryFileName = "chaset-address-bar-history.json";
} // namespace

ChaSetPathHistoryStore &ChaSetPathHistoryStore::instance() {
    static ChaSetPathHistoryStore *store = new ChaSetPathHistoryStore;
    return *store;
}

ChaSetPathHistoryStore::ChaSetPathHistoryStore(QObject *parent)
    : QObject(parent)
{
    load();
}

QString ChaSetPathHistoryStore::storageFilePath() const {
    if (!m_customFilePath.isEmpty()) {
        return m_customFilePath;
    }
    if (!m_baseDir.isEmpty()) {
        return QDir(m_baseDir).filePath(QLatin1String(kHistoryFileName));
    }
    const QString base = QStandardPaths::writableLocation(QStandardPaths::AppDataLocation);
    if (base.isEmpty()) {
        return QDir::temp().filePath(QLatin1String(kHistoryFileName));
    }
    return QDir(base).filePath(QLatin1String(kHistoryFileName));
}

void ChaSetPathHistoryStore::setStorageFilePath(const QString &filePath) {
    if (m_customFilePath == filePath)
        return;
    m_customFilePath = filePath;
    load();
    emit historyChanged();
}

QString ChaSetPathHistoryStore::baseDir() const {
    return m_baseDir;
}

void ChaSetPathHistoryStore::setBaseDir(const QString &dir) {
    if (m_baseDir == dir)
        return;
    m_baseDir = dir;
    load();
    emit historyChanged();
}

void ChaSetPathHistoryStore::add(const QString &path) {
    const QString cleaned = QDir::cleanPath(path);
    const QFileInfo info(cleaned);
    if (cleaned.isEmpty() || !info.isDir())
        return;

    const QString abs = info.absoluteFilePath();
    m_entries.removeAll(abs);
    m_entries.prepend(abs);
    while (m_entries.size() > kCapacity)
        m_entries.removeLast();

    save();
    emit historyChanged();
}

void ChaSetPathHistoryStore::clear() {
    if (m_entries.isEmpty())
        return;
    m_entries.clear();
    const QString filePath = storageFilePath();
    if (QFile::exists(filePath)) {
        QFile::remove(filePath);
    }
    emit historyChanged();
}

void ChaSetPathHistoryStore::load() {
    m_entries.clear();
    const QString filePath = storageFilePath();
    QFile f(filePath);
    if (!f.open(QIODevice::ReadOnly))
        return;

    const QJsonDocument doc = QJsonDocument::fromJson(f.readAll());
    if (!doc.isObject())
        return;

    const QJsonArray arr = doc.object().value(QStringLiteral("entries")).toArray();
    for (const auto &val : arr) {
        const QString s = val.toString();
        if (!s.isEmpty()) {
            m_entries.append(s);
            if (m_entries.size() >= kCapacity)
                break;
        }
    }
}

void ChaSetPathHistoryStore::save() const {
    const QString filePath = storageFilePath();
    const QFileInfo fi(filePath);
    QDir().mkpath(fi.absolutePath());

    QFile f(filePath);
    if (!f.open(QIODevice::WriteOnly | QIODevice::Truncate))
        return;

    QJsonArray arr;
    for (const QString &s : m_entries) {
        arr.append(s);
    }
    QJsonObject obj;
    obj.insert(QStringLiteral("entries"), arr);
    f.write(QJsonDocument(obj).toJson(QJsonDocument::Compact));
}
