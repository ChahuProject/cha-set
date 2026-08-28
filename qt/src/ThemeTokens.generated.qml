pragma Singleton
import QtQuick

// GENERATED FILE - DO NOT EDIT.
// Source: cha-set spec/tokens.json (schemaVersion 1)
//         via spec/generators/generate-qt.mjs
// Refresh: `pnpm gen:qt` regenerates this file in place.
// Flip `dark` at runtime to switch every bound color live.
QtObject {
    id: root

    property bool dark: true

    function color(name) {
        // qmlcachegen does not support object literals in property bindings; use switch-case direct returns.
        if (dark) {
            switch (name) {
            case "chrome":
                return Qt.rgba(0.035, 0.055, 0.1, 0.9)
            case "background":
                return Qt.rgba(10.0 / 255.0, 12.0 / 255.0, 20.0 / 255.0, 255.0 / 255.0)
            case "panel":
                return Qt.rgba(22.0 / 255.0, 27.0 / 255.0, 38.0 / 255.0, 255.0 / 255.0)
            case "panelRaised":
                return Qt.rgba(37.0 / 255.0, 45.0 / 255.0, 61.0 / 255.0, 255.0 / 255.0)
            case "border":
                return Qt.rgba(60.0 / 255.0, 72.0 / 255.0, 88.0 / 255.0, 255.0 / 255.0)
            case "accent":
                return Qt.rgba(48.0 / 255.0, 160.0 / 255.0, 255.0 / 255.0, 255.0 / 255.0)
            case "nestAccent":
                return Qt.rgba(0.72, 0.42, 0.98, 0.95)
            case "pendingAccent":
                return Qt.rgba(255.0 / 255.0, 0.72, 0.22, 0.95)
            case "blocked":
                return Qt.rgba(0.55, 0.58, 0.62, 0.95)
            case "text":
                return Qt.rgba(230.0 / 255.0, 240.0 / 255.0, 250.0 / 255.0, 255.0 / 255.0)
            case "subduedText":
                return Qt.rgba(160.0 / 255.0, 178.0 / 255.0, 198.0 / 255.0, 255.0 / 255.0)
            case "conflict":
                return Qt.rgba(240.0 / 255.0, 160.0 / 255.0, 58.0 / 255.0, 255.0 / 255.0)
            case "onAccent":
                return Qt.rgba(255.0 / 255.0, 255.0 / 255.0, 255.0 / 255.0, 255.0 / 255.0)
            case "selection":
                return Qt.rgba(30.0 / 255.0, 41.0 / 255.0, 59.0 / 255.0, 255.0 / 255.0)
            case "hover":
                return Qt.rgba(255.0 / 255.0, 255.0 / 255.0, 255.0 / 255.0, 0.09)
            case "pressed":
                return Qt.rgba(255.0 / 255.0, 255.0 / 255.0, 255.0 / 255.0, 0.14)
            case "disabled":
                return Qt.rgba(0.5, 0.55, 0.62, 102.0 / 255.0)
            case "disabledText":
                return Qt.rgba(107.0 / 255.0, 120.0 / 255.0, 144.0 / 255.0, 255.0 / 255.0)
            case "focus":
                return Qt.rgba(48.0 / 255.0, 160.0 / 255.0, 255.0 / 255.0, 255.0 / 255.0)
            case "overlayScrim":
                return Qt.rgba(0.0 / 255.0, 0.0 / 255.0, 0.0 / 255.0, 0.5)
            case "danger":
                return Qt.rgba(255.0 / 255.0, 0.23, 0.19, 0.9)
            case "dangerHover":
                return Qt.rgba(255.0 / 255.0, 0.23, 0.19, 0.5)
            case "infoBar":
                return Qt.rgba(0.0 / 255.0, 0.0 / 255.0, 0.0 / 255.0, 153.0 / 255.0)
            case "canvasMarquee":
                return Qt.rgba(102.0 / 255.0, 170.0 / 255.0, 255.0 / 255.0, 51.0 / 255.0)
            case "canvasMarqueeBorder":
                return Qt.rgba(204.0 / 255.0, 238.0 / 255.0, 255.0 / 255.0, 153.0 / 255.0)
            case "canvasLoadingBackdrop":
                return Qt.rgba(0.13, 0.16, 0.21, 0.85)
            case "canvasLoadingBorder":
                return Qt.rgba(0.45, 0.52, 0.62, 153.0 / 255.0)
            case "canvasLoadingText":
                return Qt.rgba(160.0 / 255.0, 178.0 / 255.0, 198.0 / 255.0, 255.0 / 255.0)
            case "canvasGrid":
                return Qt.rgba(255.0 / 255.0, 255.0 / 255.0, 255.0 / 255.0, 26.0 / 255.0)
            case "canvasGridMajor":
                return Qt.rgba(255.0 / 255.0, 255.0 / 255.0, 255.0 / 255.0, 41.0 / 255.0)
            case "chromeIcon":
                return Qt.rgba(255.0 / 255.0, 255.0 / 255.0, 255.0 / 255.0, 255.0 / 255.0)
            case "chromeHover":
                return Qt.rgba(255.0 / 255.0, 255.0 / 255.0, 255.0 / 255.0, 0.13)
            case "chromeDown":
                return Qt.rgba(255.0 / 255.0, 255.0 / 255.0, 255.0 / 255.0, 102.0 / 255.0)
            }
        } else {
            switch (name) {
            case "chrome":
                return Qt.rgba(0.94, 0.95, 0.97, 0.92)
            case "background":
                return Qt.rgba(244.0 / 255.0, 246.0 / 255.0, 250.0 / 255.0, 255.0 / 255.0)
            case "panel":
                return Qt.rgba(255.0 / 255.0, 255.0 / 255.0, 255.0 / 255.0, 255.0 / 255.0)
            case "panelRaised":
                return Qt.rgba(232.0 / 255.0, 236.0 / 255.0, 243.0 / 255.0, 255.0 / 255.0)
            case "border":
                return Qt.rgba(204.0 / 255.0, 212.0 / 255.0, 224.0 / 255.0, 255.0 / 255.0)
            case "accent":
                return Qt.rgba(29.0 / 255.0, 122.0 / 255.0, 224.0 / 255.0, 255.0 / 255.0)
            case "nestAccent":
                return Qt.rgba(0.62, 0.38, 0.94, 0.95)
            case "pendingAccent":
                return Qt.rgba(0.88, 153.0 / 255.0, 0.1, 0.95)
            case "blocked":
                return Qt.rgba(0.55, 0.58, 0.62, 0.95)
            case "text":
                return Qt.rgba(28.0 / 255.0, 36.0 / 255.0, 48.0 / 255.0, 255.0 / 255.0)
            case "subduedText":
                return Qt.rgba(92.0 / 255.0, 103.0 / 255.0, 121.0 / 255.0, 255.0 / 255.0)
            case "conflict":
                return Qt.rgba(178.0 / 255.0, 106.0 / 255.0, 0.0 / 255.0, 255.0 / 255.0)
            case "onAccent":
                return Qt.rgba(255.0 / 255.0, 255.0 / 255.0, 255.0 / 255.0, 255.0 / 255.0)
            case "selection":
                return Qt.rgba(219.0 / 255.0, 228.0 / 255.0, 245.0 / 255.0, 255.0 / 255.0)
            case "hover":
                return Qt.rgba(0.0 / 255.0, 0.0 / 255.0, 0.0 / 255.0, 0.06)
            case "pressed":
                return Qt.rgba(0.0 / 255.0, 0.0 / 255.0, 0.0 / 255.0, 0.08)
            case "disabled":
                return Qt.rgba(0.5, 0.55, 0.62, 102.0 / 255.0)
            case "disabledText":
                return Qt.rgba(154.0 / 255.0, 163.0 / 255.0, 179.0 / 255.0, 255.0 / 255.0)
            case "focus":
                return Qt.rgba(29.0 / 255.0, 122.0 / 255.0, 224.0 / 255.0, 255.0 / 255.0)
            case "overlayScrim":
                return Qt.rgba(0.0 / 255.0, 0.0 / 255.0, 0.0 / 255.0, 0.35)
            case "danger":
                return Qt.rgba(0.82, 0.18, 0.15, 0.9)
            case "dangerHover":
                return Qt.rgba(0.82, 0.18, 0.15, 0.5)
            case "infoBar":
                return Qt.rgba(0.0 / 255.0, 0.0 / 255.0, 0.0 / 255.0, 153.0 / 255.0)
            case "canvasMarquee":
                return Qt.rgba(102.0 / 255.0, 170.0 / 255.0, 255.0 / 255.0, 51.0 / 255.0)
            case "canvasMarqueeBorder":
                return Qt.rgba(204.0 / 255.0, 238.0 / 255.0, 255.0 / 255.0, 153.0 / 255.0)
            case "canvasLoadingBackdrop":
                return Qt.rgba(0.86, 0.89, 0.93, 0.85)
            case "canvasLoadingBorder":
                return Qt.rgba(0.55, 0.62, 0.72, 153.0 / 255.0)
            case "canvasLoadingText":
                return Qt.rgba(92.0 / 255.0, 103.0 / 255.0, 121.0 / 255.0, 255.0 / 255.0)
            case "canvasGrid":
                return Qt.rgba(0.0 / 255.0, 0.0 / 255.0, 0.0 / 255.0, 26.0 / 255.0)
            case "canvasGridMajor":
                return Qt.rgba(0.0 / 255.0, 0.0 / 255.0, 0.0 / 255.0, 41.0 / 255.0)
            case "chromeIcon":
                return Qt.rgba(0.11, 0.14, 0.19, 0.92)
            case "chromeHover":
                return Qt.rgba(0.0 / 255.0, 0.0 / 255.0, 0.0 / 255.0, 0.1)
            case "chromeDown":
                return Qt.rgba(0.0 / 255.0, 0.0 / 255.0, 0.0 / 255.0, 0.22)
            }
        }
        return Qt.rgba(0, 0, 0, 1)
    }

    readonly property color chrome: color("chrome")
    readonly property color background: color("background")
    readonly property color panel: color("panel")
    readonly property color panelRaised: color("panelRaised")
    readonly property color border: color("border")
    readonly property color accent: color("accent")
    readonly property color nestAccent: color("nestAccent")
    readonly property color pendingAccent: color("pendingAccent")
    readonly property color blocked: color("blocked")
    readonly property color text: color("text")
    readonly property color subduedText: color("subduedText")
    readonly property color conflict: color("conflict")
    readonly property color onAccent: color("onAccent")
    readonly property color selection: color("selection")
    readonly property color hover: color("hover")
    readonly property color pressed: color("pressed")
    readonly property color disabled: color("disabled")
    readonly property color disabledText: color("disabledText")
    readonly property color focus: color("focus")
    readonly property color overlayScrim: color("overlayScrim")
    readonly property color danger: color("danger")
    readonly property color dangerHover: color("dangerHover")
    readonly property color infoBar: color("infoBar")
    readonly property color canvasMarquee: color("canvasMarquee")
    readonly property color canvasMarqueeBorder: color("canvasMarqueeBorder")
    readonly property color canvasLoadingBackdrop: color("canvasLoadingBackdrop")
    readonly property color canvasLoadingBorder: color("canvasLoadingBorder")
    readonly property color canvasLoadingText: color("canvasLoadingText")
    readonly property color canvasGrid: color("canvasGrid")
    readonly property color canvasGridMajor: color("canvasGridMajor")
    readonly property color chromeIcon: color("chromeIcon")
    readonly property color chromeHover: color("chromeHover")
    readonly property color chromeDown: color("chromeDown")

    readonly property int space0: 0
    readonly property int space1: 2
    readonly property int space2: 4
    readonly property int space3: 8
    readonly property int space4: 12
    readonly property int space5: 16
    readonly property int space6: 24

    readonly property int motionQuick: 90
    readonly property int motionShort: 120
    readonly property int motionMedium: 180

    readonly property int radiusSmall: 2
    readonly property int controlHeight: 28
    readonly property int gap: 8
    readonly property int pageInset: 24
    readonly property int dockInset: 12
    readonly property int dividerThickness: 6
    readonly property int minimumPaneExtent: 160
    readonly property int panelRadius: 6
    readonly property int rowRadius: 4
    readonly property int radiusLarge: 10
    readonly property int radiusXl: 14
    readonly property int separatorHeight: 9
    readonly property int separatorLine: 1
    readonly property int checkCol: 18
    readonly property int iconCol: 18
    readonly property int cascadeGap: 2
    readonly property int chevronW: 14
    readonly property int fontSizeTitle: 28
    readonly property int fontSizeHeading: 16
    readonly property int fontSizeBody: 13
    readonly property int fontSizeSmall: 12
}
