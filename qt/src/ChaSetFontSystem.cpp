#include "ChaSetFontSystem.h"
#include <QFontDatabase>
#include <QQuickWindow>

namespace ChaSet {

QStringList FontSystem::s_customSansFamilies;
QStringList FontSystem::s_customMonoFamilies;

QStringList FontSystem::defaultSansFamilies()
{
    return {
        QStringLiteral("Segoe UI"),
        QStringLiteral("Microsoft YaHei UI"),
        QStringLiteral("Microsoft YaHei"),
        QStringLiteral("PingFang SC"),
        QStringLiteral("Noto Sans SC"),
        QStringLiteral("sans-serif")
    };
}

QStringList FontSystem::defaultMonoFamilies()
{
    return {
        QStringLiteral("Consolas"),
        QStringLiteral("Cascadia Code"),
        QStringLiteral("Microsoft YaHei UI"),
        QStringLiteral("Microsoft YaHei"),
        QStringLiteral("PingFang SC"),
        QStringLiteral("Noto Sans SC"),
        QStringLiteral("monospace")
    };
}

QStringList FontSystem::activeSansFamilies()
{
    return !s_customSansFamilies.isEmpty() ? s_customSansFamilies : defaultSansFamilies();
}

QStringList FontSystem::activeMonoFamilies()
{
    return !s_customMonoFamilies.isEmpty() ? s_customMonoFamilies : defaultMonoFamilies();
}

void FontSystem::applySubstitutions()
{
    const QStringList sans = activeSansFamilies();
    const QStringList mono = activeMonoFamilies();

    // Map Western-primary fonts to CJK fallback chains in QFontDatabase
    QFont::insertSubstitutions(QStringLiteral("Segoe UI"), sans);
    QFont::insertSubstitutions(QStringLiteral("Consolas"), mono);
    QFont::insertSubstitutions(QStringLiteral("sans-serif"), sans);
    QFont::insertSubstitutions(QStringLiteral("monospace"), mono);
}

void FontSystem::initialize(QGuiApplication* /*app*/)
{
    // 1. Force native vector text rendering globally across all QML windows
    QQuickWindow::setTextRenderType(QQuickWindow::NativeTextRendering);

    // 2. Register font substitution tables to eliminate SimSun fallback
    applySubstitutions();

    // 3. Configure application-level default font with grayscale antialiasing
    const QStringList sans = activeSansFamilies();
    QFont appFont(sans.isEmpty() ? QStringLiteral("Segoe UI") : sans.first());
    appFont.setStyleStrategy(static_cast<QFont::StyleStrategy>(
        QFont::PreferAntialias | QFont::PreferQuality | QFont::NoSubpixelAntialias
    ));
    appFont.setHintingPreference(QFont::PreferVerticalHinting);
    appFont.setPixelSize(14);
    appFont.setWeight(QFont::Normal);
    appFont.setFamilies(sans);

    QGuiApplication::setFont(appFont);
}

void FontSystem::setSansFamilies(const QStringList& families)
{
    s_customSansFamilies = families;
    applySubstitutions();
    if (QGuiApplication::instance()) {
        QFont current = QGuiApplication::font();
        current.setFamilies(activeSansFamilies());
        QGuiApplication::setFont(current);
    }
}

void FontSystem::setMonoFamilies(const QStringList& families)
{
    s_customMonoFamilies = families;
    applySubstitutions();
}

int FontSystem::loadFontFromFile(const QString& filePath)
{
    return QFontDatabase::addApplicationFont(filePath);
}

int FontSystem::loadFontFromData(const QByteArray& fontData)
{
    return QFontDatabase::addApplicationFontFromData(fontData);
}

QStringList FontSystem::loadedFontFamilies(int fontId)
{
    return QFontDatabase::applicationFontFamilies(fontId);
}

bool FontSystem::isFontAvailable(const QString& familyName)
{
    return QFontDatabase::families().contains(familyName, Qt::CaseInsensitive);
}

} // namespace ChaSet
