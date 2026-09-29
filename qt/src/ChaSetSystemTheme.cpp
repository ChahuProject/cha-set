#include "ChaSetSystemTheme.h"

ChaSetSystemTheme::ChaSetSystemTheme(QObject *parent)
    : QObject(parent)
{
    setupListener();
}

void ChaSetSystemTheme::setupListener()
{
    if (auto *hints = QGuiApplication::styleHints()) {
        connect(hints, &QStyleHints::colorSchemeChanged, this, [this](Qt::ColorScheme /*scheme*/) {
            emit colorSchemeChanged();
        });
    }
}

bool ChaSetSystemTheme::isDark() const
{
#if defined(Q_OS_WIN)
    // On Windows 10/11, check registry Personalize\AppsUseLightTheme for 100% accuracy
    QSettings settings(
        QStringLiteral("HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize"),
        QSettings::NativeFormat);
    QVariant val = settings.value(QStringLiteral("AppsUseLightTheme"));
    if (val.isValid()) {
        return val.toInt() == 0;
    }
#endif

    if (auto *hints = QGuiApplication::styleHints()) {
        return hints->colorScheme() == Qt::ColorScheme::Dark;
    }
    return false;
}

QString ChaSetSystemTheme::colorScheme() const
{
    return isDark() ? QStringLiteral("dark") : QStringLiteral("light");
}
