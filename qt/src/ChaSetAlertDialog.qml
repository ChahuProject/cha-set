// ChaSetAlertDialog.qml — Cross-Stack Alert Dialog Component
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Rectangle {
    id: root
    anchors.fill: parent
    z: 250
    color: Qt.rgba(0, 0, 0, 0.6)

    property bool open: false
    property string size: "default"
    property string title: "Are you absolutely sure?"
    property string description: "This action cannot be undone. This will permanently delete your account and remove your data."
    property string confirmText: "Continue"
    property string cancelText: "Cancel"
    property bool destructive: true
    property string actionVariant: destructive ? "destructive" : "default"
    property int customRadius: 8
    property int dialogWidth: size === "sm" ? 400 : (size === "lg" ? 560 : 460)
    property bool closeOnEscape: true
    property bool closeOnOverlayClick: false

    signal confirmed()
    signal cancelled()

    opacity: root.open ? 1.0 : 0.0
    visible: opacity > 0.0
    focus: root.open

    Behavior on opacity {
        enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
        NumberAnimation { duration: ThemeTokens.motionMedium; easing.type: ThemeTokens.easeEmphasized }
    }

    onOpenChanged: {
        if (root.open) {
            root.forceActiveFocus()
        }
    }

    Shortcut {
        sequence: "Escape"
        enabled: root.open && root.closeOnEscape
        onActivated: {
            root.open = false
            root.cancelled()
        }
    }

    Keys.onEscapePressed: function(event) {
        if (root.closeOnEscape) {
            event.accepted = true
            root.open = false
            root.cancelled()
        }
    }

    MouseArea {
        anchors.fill: parent
        onClicked: {
            if (root.closeOnOverlayClick) {
                root.open = false
                root.cancelled()
            }
        }
    }

    Rectangle {
        id: card
        width: Math.min(parent.width - 40, root.dialogWidth)
        implicitHeight: cardCol.implicitHeight + 36
        anchors.centerIn: parent
        color: ThemeTokens.panel
        border.color: ThemeTokens.border
        border.width: 1
        radius: root.customRadius
        scale: root.open ? 1.0 : 0.95

        Behavior on scale {
            enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
            NumberAnimation { duration: ThemeTokens.motionMedium; easing.type: ThemeTokens.easeEmphasized }
        }

        MouseArea {
            anchors.fill: parent
            // prevent scrim dismiss when clicking inside dialog
        }

        Column {
            id: cardCol
            anchors.fill: parent
            anchors.margins: 20
            spacing: 16

            Column {
                width: parent.width
                spacing: 6

                Text {
                    text: root.title
                    color: ThemeTokens.text
                    font.pixelSize: 16
                    font.weight: Font.DemiBold
                }

                Text {
                    text: root.description
                    color: ThemeTokens.subduedText
                    font.pixelSize: 13
                    wrapMode: Text.WordWrap
                    width: parent.width
                }
            }

            Row {
                anchors.right: parent.right
                spacing: 8

                ChaSetButton {
                    text: root.cancelText
                    variant: "outline"
                    size: "sm"
                    onClicked: {
                        root.open = false
                        root.cancelled()
                    }
                }

                ChaSetButton {
                    text: root.confirmText
                    variant: root.actionVariant
                    size: "sm"
                    onClicked: {
                        root.open = false
                        root.confirmed()
                    }
                }
            }
        }
    }
}
