// ChaSetReadOnlyInput.qml — Cross-Stack Read-Only Input Component
import QtQuick 6.10
import ChaSet

Item {
    id: root

    property string value: ""
    property string placeholder: ""
    property string colorScheme: "default"
    property int customRadius: 6

    signal copiedToClipboard(string text)

    implicitWidth: 260
    implicitHeight: 32

    readonly property color borderColor: {
        if (hoverArea.containsMouse || copyBtn.hovered) return ThemeTokens.accent
        switch (root.colorScheme) {
        case "destructive": return ThemeTokens.danger
        case "warning":     return "#f59e0b"
        case "success":     return "#10b981"
        default:            return ThemeTokens.border
        }
    }

    Rectangle {
        anchors.fill: parent
        color: ThemeTokens.panel
        border.color: root.borderColor
        border.width: 1
        radius: root.customRadius

        Behavior on border.color {
            ColorAnimation { duration: 120 }
        }

        Item {
            anchors.fill: parent
            anchors.leftMargin: 10
            anchors.rightMargin: 4

            TextInput {
                id: valInput
                anchors.left: parent.left
                anchors.right: copyBtn.left
                anchors.rightMargin: 4
                anchors.verticalCenter: parent.verticalCenter
                readOnly: true
                selectByMouse: true
                clip: true
                text: root.value
                color: {
                    if (root.value.length === 0) return ThemeTokens.subduedText
                    switch (root.colorScheme) {
                    case "destructive": return ThemeTokens.danger
                    case "warning":     return "#f59e0b"
                    case "success":     return "#10b981"
                    default:            return ThemeTokens.text
                    }
                }
                font.pixelSize: 12
                font.family: "monospace"

                Text {
                    anchors.fill: parent
                    visible: root.value.length === 0 && root.placeholder.length > 0
                    text: root.placeholder
                    color: ThemeTokens.subduedText
                    font.pixelSize: 12
                    font.family: "monospace"
                    verticalAlignment: Text.AlignVCenter
                    elide: Text.ElideRight
                }
            }

            ChaSetCopyButton {
                id: copyBtn
                anchors.right: parent.right
                anchors.verticalCenter: parent.verticalCenter
                textToCopy: root.value
                size: "icon-xs"
                variant: "ghost"
                visible: hoverArea.containsMouse || copyBtn.hovered || copyBtn.copied
                onCopiedToClipboard: (t) => root.copiedToClipboard(t)
            }
        }

        MouseArea {
            id: hoverArea
            anchors.fill: parent
            hoverEnabled: true
            acceptedButtons: Qt.NoButton
        }
    }
}
