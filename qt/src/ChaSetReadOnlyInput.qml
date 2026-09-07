// ChaSetReadOnlyInput.qml — Cross-Stack Read-Only Input Component
import QtQuick 6.10
import ChaSet

Item {
    id: root

    property string value: ""
    property int customRadius: 6

    implicitWidth: 260
    implicitHeight: 32

    Rectangle {
        anchors.fill: parent
        color: ThemeTokens.panel
        border.color: ThemeTokens.border
        border.width: 1
        radius: root.customRadius

        Row {
            anchors.fill: parent
            anchors.leftMargin: 10
            anchors.rightMargin: 4
            spacing: 8

            Text {
                id: valText
                anchors.verticalCenter: parent.verticalCenter
                width: parent.width - 36
                elide: Text.ElideRight
                text: root.value
                color: ThemeTokens.text
                font.pixelSize: 12
                font.family: "monospace"
            }

            ChaSetCopyButton {
                anchors.verticalCenter: parent.verticalCenter
                textToCopy: root.value
                size: "icon-xs"
                variant: "ghost"
            }
        }
    }
}
