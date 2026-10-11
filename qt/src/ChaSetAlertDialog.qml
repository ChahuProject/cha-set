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
        width: Math.min(parent ? parent.width - ThemeTokens.dp(40) : ThemeTokens.dp(460), root.dialogWidth)
        readonly property real contentPreferredHeight: titleCol.implicitHeight + alertDescText.height + buttonRow.implicitHeight + ThemeTokens.dp(40) + ThemeTokens.dp(26)
        implicitHeight: contentPreferredHeight
        height: Math.min(parent ? Math.max(ThemeTokens.dp(120), parent.height - ThemeTokens.dp(40)) : ThemeTokens.dp(600), contentPreferredHeight)
        x: Math.max(ThemeTokens.dp(8), Math.min(parent ? parent.width - width - ThemeTokens.dp(8) : 0, Math.round((parent ? (parent.width - width) / 2 : 0))))
        y: Math.max(ThemeTokens.dp(8), Math.min(parent ? parent.height - height - ThemeTokens.dp(8) : 0, Math.round((parent ? (parent.height - height) / 2 : 0))))
        color: ThemeTokens.panel
        border.color: ThemeTokens.border
        border.width: 1
        radius: ThemeTokens.dp(root.customRadius)
        clip: true
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

        // Title Column (pinned at top)
        Column {
            id: titleCol
            anchors.top: parent.top
            anchors.topMargin: ThemeTokens.dp(20)
            anchors.left: parent.left
            anchors.leftMargin: ThemeTokens.dp(20)
            anchors.right: parent.right
            anchors.rightMargin: ThemeTokens.dp(20)
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
        }

        // Action Buttons Row (pinned at bottom)
        Row {
            id: buttonRow
            anchors.bottom: parent.bottom
            anchors.bottomMargin: ThemeTokens.dp(20)
            anchors.right: parent.right
            anchors.rightMargin: ThemeTokens.dp(20)
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

        // Description Flickable in the middle
        Flickable {
            id: alertDescFlickable
            anchors.top: titleCol.bottom
            anchors.topMargin: ThemeTokens.dp(10)
            anchors.bottom: buttonRow.top
            anchors.bottomMargin: ThemeTokens.dp(16)
            anchors.left: parent.left
            anchors.leftMargin: ThemeTokens.dp(20)
            anchors.right: parent.right
            anchors.rightMargin: ThemeTokens.dp(20)
            contentWidth: width
            contentHeight: alertDescText.height
            clip: true
            boundsBehavior: Flickable.StopAtBounds

            ScrollBar.vertical: ChaSetScrollBar {
                policy: ScrollBar.AsNeeded
            }

            TextEdit {
                id: alertDescText
                text: root.description
                color: ThemeTokens.subduedText
                font.pixelSize: Typography.sizeBody
                wrapMode: TextEdit.WordWrap
                width: alertDescFlickable.width
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
    }
}
