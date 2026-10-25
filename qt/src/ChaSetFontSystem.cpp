#include "ChaSetFontSystem.h"
#include <QFontDatabase>
#include <QQuickWindow>
#include <QFile>
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
QString FontSystem::s_textRenderPolicyName = QStringLiteral("native");

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

    // Default is the platform rasterizer, not Qt's. Measured on 2x CJK body text, Qt's own
    // rasterizer leaves most of a stroke as half-lit fringe (core/edge 0.86) where DirectWrite
    // gives solid stems (1.88); next to the browser the page reads dim and out of focus, and
    // the earlier "smooth coverage" rationale only holds for large display text, not 14px CJK.
    // Cost of the switch: glyphs grid-fit horizontally, so letterforms stop being
    // position-independent. Documentation is static, so nothing animates through it.
    QQuickWindow::TextRenderType type = QQuickWindow::NativeTextRendering;
    QString resolved = QStringLiteral("native");

    if (requested.isEmpty() || requested == QLatin1String("native")) {
        // Default: the platform rasterizer (DirectWrite on Windows, CoreText on macOS).
    } else if (requested == QLatin1String("qt")) {
        type = QQuickWindow::QtTextRendering;
        resolved = QStringLiteral("qt");
    } else if (requested == QLatin1String("curve")) {
        if (isSoftwareRasterizerRequested()) {
            qWarning() << "[ChaSet][FontSystem]" << textRenderEnvVar()
                       << "= curve requires a hardware RHI backend, but a software rasterizer is active;"
                       << "falling back to the Qt default (QtTextRendering).";
            type = QQuickWindow::QtTextRendering;
            resolved = QStringLiteral("qt");
        } else {
            type = QQuickWindow::CurveTextRendering;
            resolved = QStringLiteral("curve");
        }
    } else {
        qWarning() << "[ChaSet][FontSystem] Unknown" << textRenderEnvVar() << "value" << requested
                   << "- expected one of {native, qt, curve}; falling back to the default (NativeTextRendering).";
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

    // Register Material Symbols Outlined variable font
    registerMaterialSymbolsFont();
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

bool FontSystem::registerMaterialSymbolsFont()
{
    const QString expected = materialSymbolsFamily();
    if (isFontAvailable(expected)) {
        return true;
    }

    const QStringList candidatePaths = {
        QStringLiteral(":/qt/qml/ChaSet/resources/fonts/MaterialSymbolsOutlined[FILL,GRAD,opsz,wght].ttf"),
        QStringLiteral(":/ChaSet/resources/fonts/MaterialSymbolsOutlined[FILL,GRAD,opsz,wght].ttf"),
        QStringLiteral("../third_party/material_symbols/MaterialSymbolsOutlined[FILL,GRAD,opsz,wght].ttf"),
        QStringLiteral("../../third_party/material_symbols/MaterialSymbolsOutlined[FILL,GRAD,opsz,wght].ttf"),
        QStringLiteral("third_party/material_symbols/MaterialSymbolsOutlined[FILL,GRAD,opsz,wght].ttf")
    };

    for (const QString& path : candidatePaths) {
        QFile file(path);
        if (file.open(QIODevice::ReadOnly)) {
            const QByteArray data = file.readAll();
            int id = QFontDatabase::addApplicationFontFromData(data);
            if (id >= 0) {
                qInfo() << "[ChaSet][FontSystem] Registered Material Symbols font from" << path
                        << "families:" << QFontDatabase::applicationFontFamilies(id);
                return true;
            }
        }
    }

    qWarning() << "[ChaSet][FontSystem] Could not register Material Symbols font!";
    return false;
}

bool FontSystem::isMaterialSymbolsAvailable()
{
    return isFontAvailable(materialSymbolsFamily());
}

QString FontSystem::materialSymbolsFamily()
{
    return QStringLiteral("Material Symbols Outlined");
}

} // namespace ChaSet
