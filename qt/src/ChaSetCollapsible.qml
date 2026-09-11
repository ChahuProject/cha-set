// ChaSetCollapsible.qml — Cross-Stack Collapsible Component
// 100% Parity with React Collapsible.tsx
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Rectangle {
    id: root

    property bool open: false
    property bool defaultOpen: false
    property bool disabled: false
    property string variant: "default" // "default" | "card" | "ghost"
    property string title: ""
    property int customRadius: 6
    property bool forceHover: false
    property bool forceActive: false

    default property alias contentData: contentArea.data

    signal toggled(bool open)

    Component.onCompleted: {
        if (defaultOpen) {
            open = true
        }
    }

    color: root.variant === "card" ? ThemeTokens.card : "transparent"
    border.color: root.variant === "card" ? ThemeTokens.border : "transparent"
    border.width: root.variant === "card" ? 1 : 0
    radius: root.customRadius
    clip: true

    implicitWidth: 320
    implicitHeight: headerBar.height + contentWrapper.height + (root.variant === "card" ? 16 : 0)

    activeFocusOnTab: !root.disabled

    Keys.onSpacePressed: function(event) {
        if (!root.disabled) {
            event.accepted = true
            root.open = !root.open
            root.toggled(root.open)
        }
    }
    Keys.onReturnPressed: function(event) {
        if (!root.disabled) {
            event.accepted = true
            root.open = !root.open
            root.toggled(root.open)
        }
    }
    Keys.onEnterPressed: function(event) {
        if (!root.disabled) {
            event.accepted = true
            root.open = !root.open
            root.toggled(root.open)
        }
    }

    opacity: root.disabled ? 0.5 : 1.0

    Column {
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.top: parent.top
        anchors.margins: root.variant === "card" ? 8 : 0
        spacing: 0

        // Header Bar (Trigger)
        Rectangle {
            id: headerBar
            width: parent.width
            height: 36
            radius: root.customRadius
            border.color: root.activeFocus ? ThemeTokens.accent : "transparent"
            border.width: root.activeFocus ? 1 : 0
            color: {
                if (root.forceActive || triggerMouseArea.pressed) {
                    return ThemeTokens.pressed
                }
                if (root.forceHover || triggerMouseArea.containsMouse) {
                    return ThemeTokens.hover
                }
                return "transparent"
            }

            Row {
                anchors.left: parent.left
                anchors.leftMargin: 8
                anchors.right: chevronText.left
                anchors.rightMargin: 8
                anchors.verticalCenter: parent.verticalCenter
                spacing: 8

                Text {
                    id: headerTitle
                    text: root.title
                    color: ThemeTokens.text
                    font.pixelSize: 14
                    font.weight: Font.Medium
                    elide: Text.ElideRight
                    anchors.verticalCenter: parent.verticalCenter
                    visible: root.title !== ""
                }
            }

            Text {
                id: chevronText
                anchors.right: parent.right
                anchors.rightMargin: 8
                anchors.verticalCenter: parent.verticalCenter
                text: "▼"
                font.pixelSize: 10
                color: ThemeTokens.subduedText
                rotation: root.open ? 180 : 0
                transformOrigin: Item.Center

                Behavior on rotation {
                    NumberAnimation { duration: ThemeTokens.motionMedium; easing.type: Easing.OutQuad }
                }
            }

            MouseArea {
                id: triggerMouseArea
                anchors.fill: parent
                hoverEnabled: true
                enabled: !root.disabled
                cursorShape: root.disabled ? Qt.ForbiddenCursor : Qt.PointingHandCursor
                onClicked: {
                    if (!root.disabled) {
                        root.forceActiveFocus()
                        root.open = !root.open
                        root.toggled(root.open)
                    }
                }
            }
        }

        // Content Wrapper with Smooth Height Animation
        Item {
            id: contentWrapper
            width: parent.width
            height: root.open ? contentArea.implicitHeight : 0
            clip: true
            visible: height > 0

            Behavior on height {
                NumberAnimation { duration: ThemeTokens.motionMedium; easing.type: Easing.OutQuad }
            }

            Item {
                id: contentArea
                width: parent.width
                implicitHeight: childrenRect.height
            }
        }
    }
}
