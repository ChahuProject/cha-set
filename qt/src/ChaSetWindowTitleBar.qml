// ChaSetWindowTitleBar.qml — Cross-Stack Window Title Bar Component
import QtQuick 6.10
import ChaSet

Rectangle {
    id: root

    property string title: "ChaSet Desktop Studio"
    property string icon: "logo"
    property bool maximized: false

    signal minimizeClicked()
    signal maximizeClicked()
    signal closeClicked()

    height: ThemeTokens.dp(36)
    color: ThemeTokens.hover
    border.color: ThemeTokens.border
    border.width: 1

    Row {
        anchors.left: parent.left
        anchors.leftMargin: ThemeTokens.dp(12)
        anchors.verticalCenter: parent.verticalCenter
        spacing: ThemeTokens.dp(8)

        ChaSetIcon {
            visible: root.icon !== ""
            name: root.icon
            size: 16
            color: ThemeTokens.accent
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
            width: ThemeTokens.dp(44)
            height: parent.height
            color: minMouse.containsMouse ? ThemeTokens.hover : "transparent"

            Behavior on color {
                enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
                ColorAnimation { duration: ThemeTokens.motionQuick; easing.type: ThemeTokens.easeStandard }
            }

            ChaSetIcon {
                anchors.centerIn: parent
                name: "minimize"
                size: 10
                color: ThemeTokens.text
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
            width: ThemeTokens.dp(44)
            height: parent.height
            color: maxMouse.containsMouse ? ThemeTokens.hover : "transparent"

            Behavior on color {
                enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
                ColorAnimation { duration: ThemeTokens.motionQuick; easing.type: ThemeTokens.easeStandard }
            }

            ChaSetIcon {
                anchors.centerIn: parent
                name: root.maximized ? "restore" : "maximize"
                size: 10
                color: ThemeTokens.text
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
            width: ThemeTokens.dp(44)
            height: parent.height
            color: closeMouse.containsMouse ? Qt.rgba(239/255, 68/255, 68/255, 0.85) : "transparent"

            Behavior on color {
                enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
                ColorAnimation { duration: ThemeTokens.motionQuick; easing.type: ThemeTokens.easeStandard }
            }

            ChaSetIcon {
                anchors.centerIn: parent
                name: "x"
                size: 10
                color: closeMouse.containsMouse ? "#ffffff" : ThemeTokens.text
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
