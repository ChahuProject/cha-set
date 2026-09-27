// qt/src/ChaSetPathHistoryStore.h
//
// Typed paths history store for ChaSetAddressBar (LRU semantics, capacity 50, persistent JSON).
#pragma once

#include <QObject>
#include <QString>
#include <QStringList>
#include <QtQml/qqmlregistration.h>

class ChaSetPathHistoryStore : public QObject {
    Q_OBJECT
    QML_ELEMENT
    QML_SINGLETON

    Q_PROPERTY(QStringList entries READ entries NOTIFY historyChanged)
    Q_PROPERTY(int capacity READ capacity CONSTANT)

public:
    static ChaSetPathHistoryStore &instance();
    explicit ChaSetPathHistoryStore(QObject *parent = nullptr);
    ~ChaSetPathHistoryStore() override = default;

    [[nodiscard]] QStringList entries() const { return m_entries; }
    [[nodiscard]] int capacity() const { return kCapacity; }

    Q_INVOKABLE void add(const QString &path);
    Q_INVOKABLE void clear();

    [[nodiscard]] QString storageFilePath() const;
    Q_INVOKABLE void setStorageFilePath(const QString &path);
    [[nodiscard]] QString baseDir() const;
    Q_INVOKABLE void setBaseDir(const QString &dir);

signals:
    void historyChanged();

private:
    void load();
    void save() const;

    static constexpr int kCapacity = 50;
    QStringList m_entries;
    QString m_customFilePath;
    QString m_baseDir;
};
