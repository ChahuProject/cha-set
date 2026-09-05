// ChaSetCard.qml — Cross-Stack Card Container Component
// 100% Pixel-Perfect & Behavioral Parity with React Card.tsx
import QtQuick 6.10
import ChaSet

Rectangle {
    id: root

    property string variant: "default" // "default" | "secondary" | "outline"
    property int customRadius: -1
    property bool isDark: ThemeTokens.dark

    readonly property color cCard: isDark ? Qt.rgba(15.0 / 255.0, 23.0 / 255.0, 42.0 / 255.0, 1.0) : Qt.rgba(1.0, 1.0, 1.0, 1.0)
    readonly property color cBorder: isDark ? Qt.rgba(30.0 / 255.0, 41.0 / 255.0, 59.0 / 255.0, 1.0) : Qt.rgba(226.0 / 255.0, 232.0 / 255.0, 240.0 / 255.0, 1.0)
    readonly property color cSecondary: isDark ? Qt.rgba(30.0 / 255.0, 41.0 / 255.0, 59.0 / 255.0, 1.0) : Qt.rgba(241.0 / 255.0, 245.0 / 255.0, 249.0 / 255.0, 1.0)

    radius: customRadius >= 0 ? customRadius : 12
    border.width: 1
    border.color: cBorder

    color: {
        if (root.variant === "secondary") {
            return cSecondary
        } else if (root.variant === "outline") {
            return "transparent"
        }
        return cCard
    }

    default property alias contentData: contentColumn.data

    implicitWidth: contentColumn.implicitWidth
    implicitHeight: contentColumn.implicitHeight

    Column {
        id: contentColumn
        width: root.width > 0 ? root.width : implicitWidth
        spacing: 0
    }
}
