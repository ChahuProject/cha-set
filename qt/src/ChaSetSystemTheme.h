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

    // Resolves the OS colour scheme without needing a QML engine or a live
    // singleton instance. The demo host calls this before the QML tree is
    // created so the first frame already uses the right token set.
    [[nodiscard]] static bool resolveSystemDark();

signals:
    void colorSchemeChanged();

private:
    void setupListener();
};
