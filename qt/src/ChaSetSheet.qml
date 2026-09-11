// ChaSetSheet.qml — Cross-Stack Sliding Sheet Component
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Rectangle {
    id: root
    anchors.fill: parent
    z: 220
    color: Qt.rgba(0, 0, 0, 0.6)

    property bool open: false
    property string title: "Edit profile"
    property string description: "Make changes to your profile here. Click save when you're done."
    property string side: "right" // "top" | "bottom" | "left" | "right"
    property string size: "default" // "sm" | "default" | "lg" | "xl" | "full"
    property bool closeOnOverlayClick: true
    property bool closeOnEscape: true
    property bool showCloseButton: true
    property int customSheetSize: 0
    property int sheetSize: {
        if (customSheetSize > 0) return customSheetSize
        var isHorizontal = (side === "left" || side === "right")
        if (isHorizontal) {
            if (size === "sm") return 280
            if (size === "lg") return 460
            if (size === "xl") return 640
            if (size === "full") return root.width
            return 360 // "default"
        } else {
            if (size === "sm") return 200
            if (size === "lg") return 440
            if (size === "xl") return 600
            if (size === "full") return root.height
            return 300 // "default"
        }
    }

    signal closed()

    default property alias contentData: sheetContent.data

    opacity: root.open ? 1.0 : 0.0
    visible: opacity > 0.0
    focus: root.open

    Behavior on opacity {
        NumberAnimation { duration: ThemeTokens.motionMedium; easing.type: Easing.OutQuad }
    }

    Shortcut {
        sequence: "Escape"
        enabled: root.open && root.closeOnEscape
        onActivated: {
            root.open = false
            root.closed()
        }
    }

    Keys.onEscapePressed: function(event) {
        if (root.closeOnEscape) {
            event.accepted = true
            root.open = false
            root.closed()
        }
    }

    MouseArea {
        anchors.fill: parent
        onClicked: {
            if (root.closeOnOverlayClick) {
                root.open = false
                root.closed()
            }
        }
    }

    Rectangle {
        id: panel
        color: ThemeTokens.panel
        border.color: ThemeTokens.border
        border.width: 1

        x: {
            if (root.side === "left") return root.open ? 0 : -width
            if (root.side === "right") return root.open ? (root.width - width) : root.width
            return 0
        }
        y: {
            if (root.side === "top") return root.open ? 0 : -height
            if (root.side === "bottom") return root.open ? (root.height - height) : root.height
            return 0
        }
        width: (root.side === "left" || root.side === "right") ? root.sheetSize : root.width
        height: (root.side === "top" || root.side === "bottom") ? root.sheetSize : root.height

        Behavior on x {
            NumberAnimation { duration: ThemeTokens.motionMedium; easing.type: Easing.OutCubic }
        }
        Behavior on y {
            NumberAnimation { duration: ThemeTokens.motionMedium; easing.type: Easing.OutCubic }
        }

        MouseArea {
            anchors.fill: parent
            // prevent dismissing sheet when clicking sheet interior
        }

        Column {
            anchors.fill: parent
            anchors.margins: 20
            spacing: 16

            Row {
                width: parent.width
                spacing: 8

                Column {
                    width: parent.width - 36
                    spacing: 4

                    Text {
                        text: root.title
                        color: ThemeTokens.text
                        font.pixelSize: 16
                        font.weight: Font.DemiBold
                    }

                    Text {
                        text: root.description
                        color: ThemeTokens.subduedText
                        font.pixelSize: 12
                        wrapMode: Text.WordWrap
                        width: parent.width
                    }
                }

                ChaSetButton {
                    text: "✕"
                    variant: "ghost"
                    size: "icon-xs"
                    visible: root.showCloseButton
                    anchors.verticalCenter: parent.verticalCenter
                    onClicked: {
                        root.open = false
                        root.closed()
                    }
                }
            }

            Rectangle {
                width: parent.width
                height: 1
                color: ThemeTokens.border
            }

            Item {
                id: sheetContent
                width: parent.width
                height: parent.height - 80
            }
        }
    }
}
