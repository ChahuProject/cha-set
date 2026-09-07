// ChaSetLabel.qml — Cross-Stack Accessible Label Component
// 100% Parity with React Label.tsx
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root

    property string text: ""
    property string size: "default"     // "default" | "sm"
    property bool disabled: false
    property bool required: false
    property bool forceHover: false
    property bool forceActive: false
    property alias horizontalAlignment: labelText.horizontalAlignment

    signal clicked()

    readonly property bool isSm: root.size === "sm"
    readonly property int pixelSize: isSm ? 12 : 14
    readonly property bool isDark: ThemeTokens.dark

    implicitWidth: contentRow.implicitWidth
    implicitHeight: Math.max(isSm ? 16 : 20, contentRow.implicitHeight)

    opacity: root.disabled ? 0.5 : (root.forceActive ? 0.7 : (root.forceHover ? 0.8 : 1.0))

    Row {
        id: contentRow
        spacing: 2
        anchors.verticalCenter: parent.verticalCenter

        Text {
            id: labelText
            text: root.text
            font.pixelSize: root.pixelSize
            font.weight: Font.Medium
            color: root.disabled ? ThemeTokens.disabledText : ThemeTokens.text
            verticalAlignment: Text.AlignVCenter
        }

        Text {
            id: requiredStar
            text: "*"
            font.pixelSize: root.pixelSize
            font.weight: Font.Medium
            color: ThemeTokens.danger
            visible: root.required
            verticalAlignment: Text.AlignVCenter
        }
    }

    MouseArea {
        id: mouseArea
        anchors.fill: parent
        enabled: !root.disabled
        cursorShape: root.disabled ? Qt.ForbiddenCursor : Qt.ArrowCursor
        onClicked: root.clicked()
    }
}
