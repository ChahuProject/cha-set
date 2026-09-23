// ChaSetDialog.qml — Cross-Stack Modal Dialog Component
// 100% Behavioral and Visual Parity with React Dialog.tsx
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Rectangle {
    id: root
    anchors.fill: parent
    z: 200
    color: Qt.rgba(0, 0, 0, 0.6)

    property bool open: false
    property string size: "default"     // "sm" | "default" | "lg" | "xl" | "full"
    property string title: ""
    property string description: ""
    property int customRadius: 8
    property int dialogWidth: {
        switch (root.size) {
        case "sm": return ThemeTokens.dp(380)
        case "default": return ThemeTokens.dp(500)
        case "lg": return ThemeTokens.dp(680)
        case "xl": return ThemeTokens.dp(840)
        case "full": return Math.min(parent.width - ThemeTokens.dp(40), ThemeTokens.dp(1100))
        default: return ThemeTokens.dp(500)
        }
    }
    property bool showCloseButton: true
    property bool showEscBadge: false
    property bool draggable: true
    property bool closeOnEscape: true
    property bool closeOnOverlayClick: true

    signal opened()
    signal closed()
    signal accepted()
    signal rejected()

    default property alias contentData: bodyContent.data

    opacity: root.open ? 1.0 : 0.0
    visible: opacity > 0.0
    focus: root.open

    Behavior on opacity {
        enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
        NumberAnimation { duration: ThemeTokens.motionShort; easing.type: ThemeTokens.easeEntrance }
    }

    onOpenChanged: {
        if (root.open) {
            root.forceActiveFocus()
            root.opened()
        } else {
            root.closed()
        }
    }

    Shortcut {
        sequence: "Escape"
        enabled: root.open && root.closeOnEscape
        onActivated: {
            root.open = false
            root.rejected()
        }
    }

    Keys.onEscapePressed: function(event) {
        if (root.closeOnEscape) {
            event.accepted = true
            root.open = false
            root.rejected()
        }
    }

    // Overlay scrim click to dismiss
    MouseArea {
        anchors.fill: parent
        onClicked: {
            if (root.closeOnOverlayClick) {
                root.open = false
                root.rejected()
            }
        }
    }

    // Modal Card Container
    Rectangle {
        id: card
        width: Math.min(parent.width - ThemeTokens.dp(40), root.dialogWidth)
        implicitHeight: cardLayout.implicitHeight + ThemeTokens.dp(40)
        height: Math.min(parent.height - ThemeTokens.dp(40), implicitHeight)
        anchors.centerIn: parent
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

        // Intercept clicks to prevent dismissal when clicking inside the card
        MouseArea {
            anchors.fill: parent
            z: -1
            onClicked: {}
        }

        DragHandler {
            enabled: root.draggable
            target: card
        }

        Column {
            id: cardLayout
            width: parent.width - ThemeTokens.dp(40)
            anchors.centerIn: parent
            spacing: ThemeTokens.dp(16)

            // Dialog Header
            Column {
                width: parent.width
                spacing: ThemeTokens.dp(6)
                visible: root.title !== "" || root.description !== ""

                Row {
                    width: parent.width
                    spacing: ThemeTokens.dp(8)

                    HoverHandler {
                        enabled: root.draggable
                        cursorShape: Qt.SizeAllCursor
                    }

                    TextEdit {
                        id: titleText
                        width: parent.width - (headerActions.width + (headerActions.visible ? 8 : 0))
                        text: root.title
                        color: ThemeTokens.text
                        font.pixelSize: Typography.sizeHeading
                        font.weight: Font.Bold
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
                        anchors.verticalCenter: parent.verticalCenter

                        HoverHandler {
                            cursorShape: Qt.IBeamCursor
                        }

                        onSelectedTextChanged: {
                            if (selectedText.length > 0) SelectionHub.claim(titleText);
                            else if (SelectionHub.activeOwner === titleText) SelectionHub.clear(titleText);
                        }
                    }

                    Row {
                        id: headerActions
                        spacing: ThemeTokens.dp(6)
                        anchors.verticalCenter: parent.verticalCenter

                        Rectangle {
                            id: escBadge
                            visible: root.showEscBadge
                            width: ThemeTokens.dp(32)
                            height: ThemeTokens.dp(20)
                            radius: ThemeTokens.dp(4)
                            color: ThemeTokens.panelRaised
                            border.color: ThemeTokens.border
                            border.width: 1
                            anchors.verticalCenter: parent.verticalCenter

                            Text {
                                anchors.centerIn: parent
                                text: "ESC"
                                color: ThemeTokens.subduedText
                                font.pixelSize: Typography.sizeMicro
                                font.weight: Font.DemiBold
                            }
                        }

                        ChaSetButton {
                            id: closeBtn
                            visible: root.showCloseButton
                            width: ThemeTokens.dp(28)
                            height: ThemeTokens.dp(28)
                            size: "icon"
                            variant: "ghost"
                            icon: "x"
                            anchors.verticalCenter: parent.verticalCenter
                            onClicked: {
                                root.open = false
                                root.rejected()
                            }
                        }
                    }
                }

                TextEdit {
                    id: descText
                    width: parent.width
                    text: root.description
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeBody
                    wrapMode: TextEdit.WordWrap
                    height: contentHeight
                    visible: text !== ""
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
                        if (selectedText.length > 0) SelectionHub.claim(descText);
                        else if (SelectionHub.activeOwner === descText) SelectionHub.clear(descText);
                    }
                }
            }

            // Dialog Body Content Area
            Column {
                id: bodyContent
                width: parent.width
                spacing: ThemeTokens.dp(14)
            }
        }
    }

    function openDialog() {
        root.open = true
    }

    function closeDialog() {
        root.open = false
    }

    function accept() {
        root.open = false
        root.accepted()
    }

    function reject() {
        root.open = false
        root.rejected()
    }
}
