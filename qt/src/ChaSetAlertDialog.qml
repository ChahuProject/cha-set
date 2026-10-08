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
    property string title: ChaSetI18n.tr("components.alertDialog.title", "Are you absolutely sure?")
    property string description: ChaSetI18n.tr("components.alertDialog.description", "This action cannot be undone. This will permanently delete your account and remove your data.")
    property string confirmText: ChaSetI18n.tr("components.alertDialog.confirmText", "Continue")
    property string cancelText: ChaSetI18n.tr("common.cancel", "Cancel")
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

    // Registry / Escape contract — see ChaSetOverlayHub.
    function close(reason) {
        if (!root.open) return;
        root.open = false;
        if (reason === "escape") root.cancelled();
    }

    onOpenChanged: {
        if (root.open) {
            ChaSetOverlayHub.register(root)
            root.forceActiveFocus()
        } else {
            ChaSetOverlayHub.unregister(root)
        }
    }

    Shortcut {
        sequence: "Escape"
        autoRepeat: false
        enabled: root.open && root.closeOnEscape && ChaSetOverlayHub.isTop(root)
        onActivated: root.close("escape")
    }

    // Local Keys path: covers the focused dialog and consumers that deliver key semantics
    // programmatically instead of through the shortcut map. When the Shortcut above is
    // enabled it consumes the key, so this handler stays inert and Escape is never
    // double-handled.
    Keys.onEscapePressed: function(event) {
        if (root.closeOnEscape) {
            event.accepted = true
            root.close("escape")
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

    ChaSetSquircle {
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
                    activeFocusOnPress: true
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

                    Keys.onPressed: function(event) {
                        if (event.matches(StandardKey.Copy) || (event.key === Qt.Key_C && (event.modifiers & (Qt.ControlModifier | Qt.MetaModifier)))) {
                            SelectionHub.copyActiveSelection();
                            event.accepted = true;
                        }
                    }

                    TapHandler {
                        acceptedButtons: Qt.RightButton
                        onTapped: function(eventPoint) {
                            var scenePos = eventPoint.scenePosition;
                            SelectionHub.showContextMenu(scenePos.x, scenePos.y, alertTitleText);
                        }
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
                    activeFocusOnPress: true
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

                    Keys.onPressed: function(event) {
                        if (event.matches(StandardKey.Copy) || (event.key === Qt.Key_C && (event.modifiers & (Qt.ControlModifier | Qt.MetaModifier)))) {
                            SelectionHub.copyActiveSelection();
                            event.accepted = true;
                        }
                    }

                    TapHandler {
                        acceptedButtons: Qt.RightButton
                        onTapped: function(eventPoint) {
                            var scenePos = eventPoint.scenePosition;
                            SelectionHub.showContextMenu(scenePos.x, scenePos.y, alertDescText);
                        }
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
