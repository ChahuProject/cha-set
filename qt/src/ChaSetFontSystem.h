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
 * by configuring DirectWrite / Qt font substitution tables, setting native grayscale
 * vector antialiasing, vertical hinting, and managing ordered font family fallback chains.
 */
class FontSystem {
public:
    /**
     * @brief Initialize the global ChaSet font system.
     *
     * Should be called in main() right after QGuiApplication app(argc, argv).
     *
     * Actions performed:
     * 1. Sets QQuickWindow::setTextRenderType(QQuickWindow::NativeTextRendering).
     * 2. Injects font substitution tables into QFontDatabase:
     *    - "Segoe UI" -> [Segoe UI, Microsoft YaHei UI, Microsoft YaHei, PingFang SC, Noto Sans SC, sans-serif]
     *    - "Consolas" -> [Consolas, Cascadia Code, Microsoft YaHei UI, Microsoft YaHei, PingFang SC, Noto Sans SC, monospace]
     *    - "sans-serif" -> activeSansFamilies()
     *    - "monospace"  -> activeMonoFamilies()
     * 3. Configures QGuiApplication default font with:
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
};

} // namespace ChaSet
