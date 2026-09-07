// ChaSetWindowTitleBar.qml — Cross-Stack Window Title Bar Component
import QtQuick 6.10
import ChaSet

Rectangle {
    id: root

    property string title: "ChaSet Desktop Studio"
    property string icon: "🍵"
    property bool maximized: false

    signal minimizeClicked()
    signal maximizeClicked()
    signal closeClicked()

    height: 36
    color: ThemeTokens.hover
    border.color: ThemeTokens.border
    border.width: 1

    Row {
        anchors.left: parent.left
        anchors.leftMargin: 12
        anchors.verticalCenter: parent.verticalCenter
        spacing: 8

        Text {
            text: root.icon
            font.pixelSize: 14
            anchors.verticalCenter: parent.verticalCenter
        }

        Text {
            text: root.title
            color: ThemeTokens.text
            font.pixelSize: 12
            font.weight: Font.DemiBold
            anchors.verticalCenter: parent.verticalCenter
        }
    }

    // Caption Action Buttons
    Row {
        anchors.right: parent.right
        anchors.top: parent.top
        anchors.bottom: parent.bottom

        // Minimize
        Rectangle {
            width: 44
            height: parent.height
            color: minMouse.containsMouse ? ThemeTokens.hover : "transparent"

            Text {
                anchors.centerIn: parent
                text: "—"
                color: ThemeTokens.text
                font.pixelSize: 11
            }

            MouseArea {
                id: minMouse
                anchors.fill: parent
                hoverEnabled: true
                onClicked: root.minimizeClicked()
            }
        }

        // Maximize / Restore
        Rectangle {
            width: 44
            height: parent.height
            color: maxMouse.containsMouse ? ThemeTokens.hover : "transparent"

            Text {
                anchors.centerIn: parent
                text: root.maximized ? "❐" : "▢"
                color: ThemeTokens.text
                font.pixelSize: 12
            }

            MouseArea {
                id: maxMouse
                anchors.fill: parent
                hoverEnabled: true
                onClicked: {
                    root.maximized = !root.maximized
                    root.maximizeClicked()
                }
            }
        }

        // Close
        Rectangle {
            width: 44
            height: parent.height
            color: closeMouse.containsMouse ? Qt.rgba(239/255, 68/255, 68/255, 0.85) : "transparent"

            Text {
                anchors.centerIn: parent
                text: "✕"
                color: closeMouse.containsMouse ? "#ffffff" : ThemeTokens.text
                font.pixelSize: 12
            }

            MouseArea {
                id: closeMouse
                anchors.fill: parent
                hoverEnabled: true
                onClicked: root.closeClicked()
            }
        }
    }
}
