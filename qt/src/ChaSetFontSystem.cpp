#include "ChaSetFontSystem.h"
#include <QFontDatabase>
#include <QQuickWindow>
#include <QDebug>

namespace ChaSet {

namespace {

// CurveTextRendering runs on the graphics hardware, so it is unavailable under
// Qt's software scene graph adaptation.
bool isSoftwareRasterizerRequested()
{
    const QString quickBackend = qEnvironmentVariable("QT_QUICK_BACKEND").trimmed().toLower();
    if (quickBackend == QLatin1String("software")) {
        return true;
    }
    const QString rhiBackend = qEnvironmentVariable("QSG_RHI_BACKEND").trimmed().toLower();
    if (rhiBackend == QLatin1String("software")) {
        return true;
    }
    return !qEnvironmentVariableIsEmpty("QSG_RHI_PREFER_SOFTWARE_RENDERER");
}

} // namespace

QStringList FontSystem::s_customSansFamilies;
QStringList FontSystem::s_customMonoFamilies;
QString FontSystem::s_textRenderPolicyName = QStringLiteral("qt");

const char* FontSystem::textRenderEnvVar()
{
    return "CHASET_TEXT_RENDER";
}

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

void FontSystem::applyTextRenderType()
{
    const QString requested = qEnvironmentVariable(textRenderEnvVar()).trimmed().toLower();

    QQuickWindow::TextRenderType type = QQuickWindow::QtTextRendering;
    QString resolved = QStringLiteral("qt");

    if (requested.isEmpty() || requested == QLatin1String("qt")) {
        // Default: Qt's own rasterizer.
    } else if (requested == QLatin1String("native")) {
        type = QQuickWindow::NativeTextRendering;
        resolved = QStringLiteral("native");
    } else if (requested == QLatin1String("curve")) {
        if (isSoftwareRasterizerRequested()) {
            qWarning() << "[ChaSet][FontSystem]" << textRenderEnvVar()
                       << "= curve requires a hardware RHI backend, but a software rasterizer is active;"
                       << "falling back to the Qt default (QtTextRendering).";
        } else {
            type = QQuickWindow::CurveTextRendering;
            resolved = QStringLiteral("curve");
        }
    } else {
        qWarning() << "[ChaSet][FontSystem] Unknown" << textRenderEnvVar() << "value" << requested
                   << "- expected one of {qt, native, curve}; falling back to the Qt default (QtTextRendering).";
    }

    QQuickWindow::setTextRenderType(type);
    s_textRenderPolicyName = resolved;
    qInfo() << "[ChaSet][FontSystem] Text render type:" << resolved
            << "(QQuickWindow::TextRenderType =" << static_cast<int>(type) << ")";
}

QString FontSystem::activeTextRenderPolicyName()
{
    return s_textRenderPolicyName;
}

int FontSystem::activeTextRenderType()
{
    return static_cast<int>(QQuickWindow::textRenderType());
}

void FontSystem::initialize(QGuiApplication* /*app*/)
{
    // The global text rasterization path is owned by applyTextRenderType(), which
    // main() invokes before QGuiApplication so the choice precedes every window.

    // Register font substitution tables to eliminate SimSun fallback
    applySubstitutions();

    // Configure application-level default font with grayscale antialiasing
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
