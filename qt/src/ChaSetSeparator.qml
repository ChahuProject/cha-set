// ChaSetSeparator.qml — Cross-Stack Separator / Divider Component
// 100% Pixel-Perfect & Behavioral Parity with React Separator.tsx
import QtQuick 6.10
import ChaSet

Rectangle {
    id: root

    property string orientation: "horizontal" // "horizontal" | "vertical"
    property color customColor: "transparent"
    property bool decorative: true

    readonly property bool isVertical: orientation === "vertical"
    readonly property bool isDark: ThemeTokens.dark

    implicitWidth: isVertical ? 1 : 100
    implicitHeight: isVertical ? 100 : 1

    width: isVertical ? 1 : (parent ? parent.width : implicitWidth)
    height: isVertical ? (parent ? parent.height : implicitHeight) : 1

    color: customColor.a > 0
        ? customColor
        : (isDark ? Qt.rgba(30.0 / 255.0, 41.0 / 255.0, 59.0 / 255.0, 1.0) : Qt.rgba(226.0 / 255.0, 232.0 / 255.0, 240.0 / 255.0, 1.0))
}
