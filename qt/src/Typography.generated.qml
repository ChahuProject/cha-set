pragma Singleton
import QtQuick

// GENERATED FILE - DO NOT EDIT.
// Source: cha-set spec/tokens/primitives.json -> primitives.typography / primitives.fontWeight
//         (schemaVersion 1) via spec/generators/generate-qt.mjs
// Refresh: `pnpm gen:qt` regenerates this file in place.
//
// Cross-platform typography contract. The React side reads the SAME numbers
// from `--cs-font-*` / `--cs-text-*` / `--cs-leading-*` / `--cs-tracking-*`
// in packages/react/src/styles/tokens.css, so both stacks resolve identical
// families, sizes, weights, line heights and letter spacings.
//
// Two Qt-specific facts this singleton exists to encode:
//   1. `font.family` is a SINGLE family name here. Qt does not resolve
//      comma-separated lists the way CSS does, so the web fallback stacks are
//      deliberately absent — use `familySans`/`familyMono` verbatim.
//   2. Line heights are unitless RATIOS; Qt text items need absolute px.
//      Always convert through `lineHeightPx()` instead of multiplying inline,
//      so both engines land on the same rounded value.
QtObject {
    id: root

    // --- font families ---------------------------------------------------
    readonly property string familySans: "Segoe UI"
    // web stack: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans SC', 'WenQuanYi Micro Hei', 'Helvetica Neue', Arial, sans-serif
    readonly property string familyMono: "Consolas"
    // web stack: ui-monospace, SFMono-Regular, 'Cascadia Code', Menlo, Monaco, Consolas, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', 'Liberation Mono', 'Courier New', monospace

    // --- font fallback chains (Qt 6 font.families support) ----------------
    readonly property var familiesSans: ["Segoe UI","Microsoft YaHei UI","Microsoft YaHei","PingFang SC","Noto Sans SC","sans-serif"]
    readonly property var familiesMono: ["Consolas","Cascadia Code","Microsoft YaHei UI","Microsoft YaHei","PingFang SC","Noto Sans SC","monospace"]

    // --- font weights ----------------------------------------------------
    readonly property int weightRegular: 400 // Font.Normal
    readonly property int weightMedium: 500 // Font.Medium
    readonly property int weightSemibold: 600 // Font.DemiBold
    readonly property int weightBold: 700 // Font.Bold

    // --- font sizes (px; CSS emits the same numbers as rem at a 16px root) ---
    readonly property int sizeNano: 9
    readonly property int sizeMicro: 10
    readonly property int sizeCaption: 11
    readonly property int sizeSmall: 12
    readonly property int sizeBody: 14
    readonly property int sizeHeading: 16
    readonly property int sizeSubheading: 18
    readonly property int sizeTitleSm: 20
    readonly property int sizeTitleMd: 24
    readonly property int sizeTitle: 28
    readonly property int sizeDisplay: 36

    // --- line heights (unitless ratios, multiplied by the px font size) ---
    readonly property real leadingNone: 1
    readonly property real leadingTight: 1.25
    readonly property real leadingSnug: 1.375
    readonly property real leadingNormal: 1.5
    readonly property real leadingRelaxed: 1.625
    readonly property real leadingCode: 1.4
    readonly property real leadingNano: 1.7777778
    readonly property real leadingMicro: 1.6
    readonly property real leadingCaption: 1.4545455
    readonly property real leadingSmall: 1.3333333
    readonly property real leadingBody: 1.4285714
    readonly property real leadingHeading: 1.5
    readonly property real leadingSubheading: 1.5555556
    readonly property real leadingTitleSm: 1.4
    readonly property real leadingTitleMd: 1.3333333
    readonly property real leadingTitle: 1.25
    readonly property real leadingDisplay: 1.1111111

    // --- letter spacing (em ratios, multiplied by the px font size) ------
    readonly property real trackingTighter: -0.05
    readonly property real trackingTight: -0.025
    readonly property real trackingNormal: 0
    readonly property real trackingWide: 0.025
    readonly property real trackingWider: 0.05
    readonly property real trackingWidest: 0.1

    // --- named-role accessors (avoid re-typing the scale in QML) ---------
    function size(name) {
        switch (name) {
            case "nano": return 9
            case "micro": return 10
            case "caption": return 11
            case "small": return 12
            case "body": return 14
            case "heading": return 16
            case "subheading": return 18
            case "titleSm":
            case "title-sm": return 20
            case "titleMd":
            case "title-md": return 24
            case "title": return 28
            case "display": return 36
        }
        return 12
    }

    function leading(name) {
        switch (name) {
            case "none": return 1
            case "tight": return 1.25
            case "snug": return 1.375
            case "normal": return 1.5
            case "relaxed": return 1.625
            case "code": return 1.4
            case "nano": return 1.7777778
            case "micro": return 1.6
            case "caption": return 1.4545455
            case "small": return 1.3333333
            case "body": return 1.4285714
            case "heading": return 1.5
            case "subheading": return 1.5555556
            case "titleSm":
            case "title-sm": return 1.4
            case "titleMd":
            case "title-md": return 1.3333333
            case "title": return 1.25
            case "display": return 1.1111111
        }
        return 1.5
    }

    function weight(name) {
        switch (name) {
            case "regular": return 400
            case "medium": return 500
            case "semibold": return 600
            case "bold": return 700
        }
        return 400
    }

    function tracking(name) {
        switch (name) {
            case "tighter": return -0.05
            case "tight": return -0.025
            case "normal": return 0
            case "wide": return 0.025
            case "wider": return 0.05
            case "widest": return 0.1
        }
        return 0
    }

    // Absolute px line height for a (sizePx, leadingName) pair.
    // Snapped to 1/64 px — Qt's layout unit — so a Text with
    // `lineHeightMode: Text.FixedHeight` and a RichText `line-height: <px>px`
    // resolve the very same line box, and the same number CSS computes as
    // `font-size × line-height`.
    function lineHeightPx(sizePx, leadingName) {
        return Math.round(sizePx * root.leading(leadingName) * 64) / 64
    }

    // Absolute px letter spacing for a (sizePx, trackingName) pair.
    function trackingPx(sizePx, trackingName) {
        return sizePx * root.tracking(trackingName)
    }
}
