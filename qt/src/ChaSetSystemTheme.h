#pragma once

#include <QObject>
#include <QGuiApplication>
#include <QStyleHints>
#include <QtQml/qqmlregistration.h>
#if defined(Q_OS_WIN)
#include <QSettings>
#endif

class ChaSetSystemTheme : public QObject {
    Q_OBJECT
    QML_ELEMENT
    QML_SINGLETON

    Q_PROPERTY(bool isDark READ isDark NOTIFY colorSchemeChanged)
    Q_PROPERTY(QString colorScheme READ colorScheme NOTIFY colorSchemeChanged)

public:
    explicit ChaSetSystemTheme(QObject *parent = nullptr);
    ~ChaSetSystemTheme() override = default;

    [[nodiscard]] bool isDark() const;
    [[nodiscard]] QString colorScheme() const;

signals:
    void colorSchemeChanged();

private:
    void setupListener();
};
