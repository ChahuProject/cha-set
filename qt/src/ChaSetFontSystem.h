#pragma once

#include <QString>
#include <QStringList>
#include <QFont>
#include <QGuiApplication>

namespace ChaSet {

/**
 * @brief ChaSet::FontSystem
 *
 * Central cross-platform typography subsystem for ChaSet applications.
 *
 * Solves CJK fallback degradation (e.g. falling back to bitmap SimSun on Windows)
 * by configuring Qt font substitution tables, grayscale vector antialiasing,
 * vertical hinting, ordered font family fallback chains, and the global
 * QQuickWindow text rasterization path.
 */
class FontSystem {
public:
    /// Environment variable selecting the global text rasterization path.
    /// Accepted values: "qt" (default), "native", "curve".
    static const char* textRenderEnvVar();

    /**
     * @brief Resolve `CHASET_TEXT_RENDER` and apply it via
     *        QQuickWindow::setTextRenderType().
     *
     * Must be called before the first QQuickWindow is instantiated.
     *
     * - "qt"     (default) -> QQuickWindow::QtTextRendering. Qt's own glyph
     *                         rasterizer; smooth outline coverage without the
     *                         operating system's grid-fitting.
     * - "native"           -> QQuickWindow::NativeTextRendering. DirectWrite /
     *                         CoreText; crispest small upright text, but curves
     *                         are fitted to the pixel grid.
     * - "curve"            -> QQuickWindow::CurveTextRendering. Curve rasterizer
     *                         running on the graphics hardware; requires a
     *                         hardware RHI backend and falls back to "qt" when a
     *                         software rasterizer is active.
     *
     * Unknown values log a warning and fall back to the default ("qt").
     */
    static void applyTextRenderType();

    /// Resolved policy name after fallbacks: "qt" | "native" | "curve".
    static QString activeTextRenderPolicyName();

    /// Resolved QQuickWindow::TextRenderType matching the active policy.
    static int activeTextRenderType();

    /**
     * @brief Initialize the global ChaSet font system.
     *
     * Should be called in main() right after QGuiApplication app(argc, argv).
     * The text rasterization path is owned by applyTextRenderType(), which is
     * invoked earlier in main() (before QGuiApplication) and is deliberately not
     * repeated here.
     *
     * Actions performed:
     * 1. Injects font substitution tables into QFontDatabase:
     *    - "Segoe UI" -> [Segoe UI, Microsoft YaHei UI, Microsoft YaHei, PingFang SC, Noto Sans SC, sans-serif]
     *    - "Consolas" -> [Consolas, Cascadia Code, Microsoft YaHei UI, Microsoft YaHei, PingFang SC, Noto Sans SC, monospace]
     *    - "sans-serif" -> activeSansFamilies()
     *    - "monospace"  -> activeMonoFamilies()
     * 2. Configures QGuiApplication default font with:
     *    - Grayscale vector antialiasing (QFont::NoSubpixelAntialias | QFont::PreferQuality | QFont::PreferAntialias)
     *    - Vertical hinting preference (QFont::PreferVerticalHinting)
     *    - Ordered font families chain matching activeSansFamilies()
     *    - Standard 14px body size
     */
    static void initialize(QGuiApplication* app = nullptr);

    /// Default ordered sans-serif font families defined by spec tokens.
    static QStringList defaultSansFamilies();

    /// Default ordered monospace font families defined by spec tokens.
    static QStringList defaultMonoFamilies();

    /// Currently active sans-serif font families (custom or default).
    static QStringList activeSansFamilies();

    /// Currently active monospace font families (custom or default).
    static QStringList activeMonoFamilies();

    /// Override the active sans-serif font families at runtime.
    static void setSansFamilies(const QStringList& families);

    /// Override the active monospace font families at runtime.
    static void setMonoFamilies(const QStringList& families);

    /// Load an application font from file (.ttf / .otf / .woff2) via QFontDatabase.
    static int loadFontFromFile(const QString& filePath);

    /// Load an application font from in-memory byte buffer.
    static int loadFontFromData(const QByteArray& fontData);

    /// Query the font family names loaded under a specific fontId.
    static QStringList loadedFontFamilies(int fontId);

    /// Check if a specific font family is currently available in the system.
    static bool isFontAvailable(const QString& familyName);

    /// Re-apply font substitutions and refresh application font.
    static void applySubstitutions();

private:
    static QStringList s_customSansFamilies;
    static QStringList s_customMonoFamilies;
    static QString s_textRenderPolicyName;
};

} // namespace ChaSet
