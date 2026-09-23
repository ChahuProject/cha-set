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
    property int dialogWidth: ThemeTokens.dp(size === "sm" ? 400 : (size === "lg" ? 560 : 460))
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
        width: Math.min(parent.width - ThemeTokens.dp(40), root.dialogWidth)
        implicitHeight: cardCol.implicitHeight + ThemeTokens.dp(36)
        anchors.centerIn: parent
        color: ThemeTokens.panel
        border.color: ThemeTokens.border
        border.width: 1
        radius: ThemeTokens.dp(root.customRadius)
        scale: root.open ? 1.0 : 0.95

        Behavior on scale {
            enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
            NumberAnimation { duration: ThemeTokens.motionMedium; easing.type: ThemeTokens.easeEmphasized }
        }

        MouseArea {
            anchors.fill: parent
            z: -1
            // prevent scrim dismiss when clicking inside dialog
        }

        Column {
            id: cardCol
            anchors.fill: parent
            anchors.margins: ThemeTokens.dp(20)
            spacing: ThemeTokens.dp(16)

            Column {
                width: parent.width
                spacing: ThemeTokens.dp(6)

                TextEdit {
                    id: alertTitleText
                    text: root.title
                    color: ThemeTokens.text
                    font.pixelSize: Typography.sizeHeading
                    font.weight: Font.DemiBold
                    width: parent.width
                    height: contentHeight
                    readOnly: true
                    selectByMouse: true
                    selectByKeyboard: true
                    cursorVisible: false
                    activeFocusOnPress: false
                    textMargin: 0
                    padding: 0
                    selectionColor: ThemeTokens.accent
                    selectedTextColor: "#ffffff"

                    HoverHandler {
                        cursorShape: Qt.IBeamCursor
                    }

                    onSelectedTextChanged: {
                        if (selectedText.length > 0) SelectionHub.claim(alertTitleText);
                        else if (SelectionHub.activeOwner === alertTitleText) SelectionHub.clear(alertTitleText);
                    }
                }

                TextEdit {
                    id: alertDescText
                    text: root.description
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeBody
                    wrapMode: TextEdit.WordWrap
                    width: parent.width
                    height: contentHeight
                    readOnly: true
                    selectByMouse: true
                    selectByKeyboard: true
                    cursorVisible: false
                    activeFocusOnPress: false
                    textMargin: 0
                    padding: 0
                    selectionColor: ThemeTokens.accent
                    selectedTextColor: "#ffffff"

                    HoverHandler {
                        cursorShape: Qt.IBeamCursor
                    }

                    onSelectedTextChanged: {
                        if (selectedText.length > 0) SelectionHub.claim(alertDescText);
                        else if (SelectionHub.activeOwner === alertDescText) SelectionHub.clear(alertDescText);
                    }
                }
            }

            Row {
                anchors.right: parent.right
                spacing: ThemeTokens.dp(8)

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
