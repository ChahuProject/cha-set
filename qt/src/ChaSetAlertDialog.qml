// ChaSetAlertDialog.qml — Cross-Stack Alert Dialog Component
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Rectangle {
    id: root
    parent: (Window.window && Window.window.contentItem)
            ? Window.window.contentItem
            : ((typeof Overlay !== "undefined" && Overlay.overlay && Overlay.overlay.width > 0)
               ? Overlay.overlay
               : undefined)
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
    property Item footer: null
    property Component footerComponent: null

    default property alias contentData: alertCustomBody.data

    signal confirmed()
    signal cancelled()

    opacity: root.open ? 1.0 : 0.0
    visible: opacity > 0.0
    focus: root.open

    Behavior on opacity {
        enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
        NumberAnimation { duration: ThemeTokens.motionShort; easing.type: ThemeTokens.easeEntrance }
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

    function clampCardPosition() {
        if (!root || root.width <= 0 || root.height <= 0) return;
        var minX = ThemeTokens.dp(8);
        var minY = ThemeTokens.dp(8);
        var maxX = Math.max(minX, root.width - card.width - minX);
        var maxY = Math.max(minY, root.height - card.height - minY);
        card.x = Math.max(minX, Math.min(card.x, maxX));
        card.y = Math.max(minY, Math.min(card.y, maxY));
    }

    Connections {
        target: root
        function onWidthChanged() { root.clampCardPosition(); }
        function onHeightChanged() { root.clampCardPosition(); }
    }

    onFooterChanged: {
        if (root.footer) {
            root.footer.parent = footerContainer;
        }
    }

    Component.onCompleted: {
        if (root.footer) {
            root.footer.parent = footerContainer;
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
        hoverEnabled: true
        acceptedButtons: Qt.AllButtons
        preventStealing: true
        onWheel: (wheel) => { wheel.accepted = true; }
        onClicked: (mouse) => {
            if (mouse.button === Qt.LeftButton && root.closeOnOverlayClick) {
                root.open = false
                root.cancelled()
            }
        }
    }

    ChaSetSquircle {
        id: card
        width: Math.min(parent ? parent.width - ThemeTokens.dp(40) : ThemeTokens.dp(460), root.dialogWidth)
        readonly property real maxSafeHeight: Math.max(ThemeTokens.dp(120), (parent ? parent.height : ThemeTokens.dp(800)) - ThemeTokens.dp(40))
        readonly property real contentPreferredHeight: titleCol.implicitHeight + alertBodyCol.implicitHeight + footerContainer.implicitHeight + ThemeTokens.dp(40) + ThemeTokens.dp(28)
        implicitHeight: contentPreferredHeight
        height: Math.min(maxSafeHeight, contentPreferredHeight)
        x: (root.width > 0 && width > 0) ? Math.max(ThemeTokens.dp(8), Math.round((root.width - width) / 2)) : 0
        y: (root.height > 0 && height > 0) ? Math.max(ThemeTokens.dp(8), Math.round((root.height - height) / 2)) : 0
        color: ThemeTokens.panel
        border.color: ThemeTokens.border
        border.width: 1
        radius: ThemeTokens.dp(root.customRadius)
        clip: true
        scale: root.open ? 1.0 : 0.95

        Behavior on scale {
            enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
            NumberAnimation { duration: ThemeTokens.motionShort; easing.type: ThemeTokens.easeEntrance }
        }

        MouseArea {
            anchors.fill: parent
            z: -1
            hoverEnabled: true
            acceptedButtons: Qt.AllButtons
            preventStealing: true
            onWheel: (wheel) => { wheel.accepted = true; }
            onClicked: {}
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

        // Action Buttons Footer (pinned at bottom)
        Item {
            id: footerContainer
            anchors.bottom: parent.bottom
            anchors.bottomMargin: ThemeTokens.dp(20)
            anchors.left: parent.left
            anchors.leftMargin: ThemeTokens.dp(20)
            anchors.right: parent.right
            anchors.rightMargin: ThemeTokens.dp(20)
            height: (root.footer ? root.footer.height : (footerLoader.item ? footerLoader.item.height : defaultButtonRow.implicitHeight))
            implicitHeight: height

            Loader {
                id: footerLoader
                anchors.fill: parent
                visible: !root.footer && root.footerComponent !== null
                sourceComponent: root.footerComponent
            }

            Row {
                id: defaultButtonRow
                anchors.right: parent.right
                anchors.verticalCenter: parent.verticalCenter
                spacing: ThemeTokens.dp(8)
                visible: !root.footer && !root.footerComponent

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

        // Description & Body Flickable in the middle
        Flickable {
            id: alertBodyFlickable
            anchors.top: titleCol.bottom
            anchors.topMargin: ThemeTokens.dp(10)
            anchors.bottom: footerContainer.top
            anchors.bottomMargin: ThemeTokens.dp(16)
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.rightMargin: ThemeTokens.dp(2)
            contentWidth: width
            contentHeight: alertBodyCol.implicitHeight
            clip: true
            boundsBehavior: Flickable.StopAtBounds

            ScrollBar.vertical: ChaSetScrollBar {
                policy: ScrollBar.AsNeeded
            }

            Column {
                id: alertBodyCol
                x: ThemeTokens.dp(20)
                width: Math.max(0, alertBodyFlickable.width - ThemeTokens.dp(40))
                spacing: ThemeTokens.dp(12)

                TextEdit {
                    id: alertDescText
                    text: root.description
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeBody
                    wrapMode: TextEdit.WordWrap
                    width: parent.width
                    height: contentHeight
                    visible: text !== ""
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

                Column {
                    id: alertCustomBody
                    width: parent.width
                    spacing: ThemeTokens.dp(12)
                }
            }
        }
    }
}
