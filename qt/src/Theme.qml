pragma Singleton
import QtQuick 6.10

// Design tokens mirroring spec/tokens.json for the Qt implementation.

// Keep in sync with React's packages/react/src/styles/tokens.css.
QtObject {
    readonly property color colorPrimary: "#4B3FE3"
    readonly property color colorPrimaryHover: "#3C2ECA"
    readonly property color colorPrimaryActive: "#3527B8"
    readonly property color colorPrimaryForeground: "#FFFFFF"
    readonly property color colorSecondary: "#F4F4F5"
    readonly property color colorSecondaryHover: "#E4E4E7"
    readonly property color colorSecondaryForeground: "#18181B"
    readonly property color colorGhostHover: "#F4F4F5"
    readonly property color colorDanger: "#DC2626"
    readonly property color colorDangerHover: "#B91C1C"
    readonly property color colorDangerForeground: "#FFFFFF"
    readonly property color colorBorder: "#E4E4E7"
    readonly property color colorText: "#18181B"
    readonly property color colorTextMuted: "#71717A"

    readonly property real spacingGapSm: 4
    readonly property real paddingSmH: 12
    readonly property real paddingSmV: 6
    readonly property real paddingMdH: 16
    readonly property real paddingMdV: 8
    readonly property real paddingLgH: 20
    readonly property real paddingLgV: 10

    readonly property real radiusControl: 8

    readonly property int fontSm: 12
    readonly property int fontMd: 14
    readonly property int fontLg: 16
    readonly property int fontWeightMedium: 500
    readonly property int fontWeightSemibold: 600
}