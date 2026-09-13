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
            font.pixelSize: Typography.sizeBody
            anchors.verticalCenter: parent.verticalCenter
        }

        Text {
            text: root.title
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeSmall
            font.weight: Font.DemiBold
            anchors.verticalCenter: parent.verticalCenter
        }
    }

    HoverHandler {
        id: dragHover
        cursorShape: Qt.SizeAllCursor
    }

    // Caption Action Buttons
    Row {
        id: captionButtons
        z: 10
        anchors.right: parent.right
        anchors.top: parent.top
        anchors.bottom: parent.bottom

        // Minimize
        Rectangle {
            width: 44
            height: parent.height
            color: minMouse.containsMouse ? ThemeTokens.hover : "transparent"

            Behavior on color {
                enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
                ColorAnimation { duration: ThemeTokens.motionQuick; easing.type: ThemeTokens.easeStandard }
            }

            Text {
                anchors.centerIn: parent
                text: "—"
                color: ThemeTokens.text
                font.pixelSize: Typography.sizeCaption
            }

            MouseArea {
                id: minMouse
                anchors.fill: parent
                hoverEnabled: true
                cursorShape: Qt.PointingHandCursor
                onClicked: root.minimizeClicked()
            }
        }

        // Maximize / Restore
        Rectangle {
            width: 44
            height: parent.height
            color: maxMouse.containsMouse ? ThemeTokens.hover : "transparent"

            Behavior on color {
                enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
                ColorAnimation { duration: ThemeTokens.motionQuick; easing.type: ThemeTokens.easeStandard }
            }

            Text {
                anchors.centerIn: parent
                text: root.maximized ? "❐" : "▢"
                color: ThemeTokens.text
                font.pixelSize: Typography.sizeSmall
            }

            MouseArea {
                id: maxMouse
                anchors.fill: parent
                hoverEnabled: true
                cursorShape: Qt.PointingHandCursor
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

            Behavior on color {
                enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
                ColorAnimation { duration: ThemeTokens.motionQuick; easing.type: ThemeTokens.easeStandard }
            }

            Text {
                anchors.centerIn: parent
                text: "✕"
                color: closeMouse.containsMouse ? "#ffffff" : ThemeTokens.text
                font.pixelSize: Typography.sizeSmall
            }

            MouseArea {
                id: closeMouse
                anchors.fill: parent
                hoverEnabled: true
                cursorShape: Qt.PointingHandCursor
                onClicked: root.closeClicked()
            }
        }
    }
}
