// ChaSetContextMenu.qml — Cross-Stack Context Menu Component
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root

    property var items: [] // [{ id, label, icon, shortcut, destructive, disabled, onSelect }]
    property int menuWidth: 180
    property int customRadius: 6
    property int highlightedIndex: -1

    signal itemSelected(string itemId)

    function findNextEnabledIndex(startIndex, direction) {
        if (!items || items.length === 0) return -1
        let idx = startIndex + direction
        while (idx >= 0 && idx < items.length) {
            if (!items[idx] || !items[idx].disabled) {
                return idx
            }
            idx += direction
        }
        if (startIndex >= 0 && startIndex < items.length && (!items[startIndex] || !items[startIndex].disabled)) {
            return startIndex
        }
        return findFirstEnabledIndex()
    }

    function findFirstEnabledIndex() {
        if (!items || items.length === 0) return -1
        for (let i = 0; i < items.length; i++) {
            if (!items[i] || !items[i].disabled) return i
        }
        return -1
    }

    function findLastEnabledIndex() {
        if (!items || items.length === 0) return -1
        for (let i = items.length - 1; i >= 0; i--) {
            if (!items[i] || !items[i].disabled) return i
        }
        return -1
    }

    function triggerHighlighted() {
        if (highlightedIndex >= 0 && highlightedIndex < items.length) {
            const item = items[highlightedIndex]
            if (item && !item.disabled) {
                contextPopup.close()
                if (typeof item.onSelect === "function") {
                    item.onSelect()
                }
                root.itemSelected(item.id || item.label)
            }
        }
    }

    default property alias targetData: targetContainer.data

    Item {
        id: targetContainer
        anchors.fill: parent
    }

    MouseArea {
        anchors.fill: parent
        acceptedButtons: Qt.RightButton
        onClicked: function(mouse) {
            if (mouse.button === Qt.RightButton) {
                contextPopup.x = mouse.x
                contextPopup.y = mouse.y
                contextPopup.open()
            }
        }
    }

    Popup {
        id: contextPopup
        width: root.menuWidth
        padding: 4
        modal: false
        focus: true
        closePolicy: Popup.CloseOnEscape | Popup.CloseOnPressOutside

        onOpened: {
            root.highlightedIndex = -1
            contextPopup.contentItem.forceActiveFocus()
        }
        onClosed: {
            root.highlightedIndex = -1
        }

        background: Rectangle {
            color: ThemeTokens.panel
            border.color: ThemeTokens.border
            border.width: 1
            radius: root.customRadius
        }

        contentItem: Column {
            id: menuCol
            spacing: 2
            width: parent.width
            focus: true

            Keys.onDownPressed: (event) => {
                event.accepted = true
                root.highlightedIndex = root.findNextEnabledIndex(root.highlightedIndex, 1)
            }
            Keys.onUpPressed: (event) => {
                event.accepted = true
                root.highlightedIndex = root.findNextEnabledIndex(root.highlightedIndex, -1)
            }
            Keys.onReturnPressed: (event) => {
                event.accepted = true
                root.triggerHighlighted()
            }
            Keys.onEnterPressed: (event) => {
                event.accepted = true
                root.triggerHighlighted()
            }
            Keys.onSpacePressed: (event) => {
                event.accepted = true
                root.triggerHighlighted()
            }
            Keys.onEscapePressed: (event) => {
                event.accepted = true
                contextPopup.close()
            }

            Repeater {
                model: root.items
                delegate: Rectangle {
                    required property var modelData
                    required property int index
                    width: parent.width
                    height: 28
                    radius: 4
                    readonly property bool isHighlighted: index === root.highlightedIndex
                    color: (isHighlighted || itemMouse.containsMouse) ? (modelData.destructive ? Qt.rgba(239/255, 68/255, 68/255, 0.15) : ThemeTokens.hover) : "transparent"
                    opacity: modelData.disabled ? 0.4 : 1.0

                    Row {
                        anchors.left: parent.left
                        anchors.leftMargin: 8
                        anchors.right: shortcutText.visible ? shortcutText.left : parent.right
                        anchors.rightMargin: 8
                        anchors.verticalCenter: parent.verticalCenter
                        spacing: 6

                        Text {
                            visible: !!parent.parent.modelData.icon
                            text: parent.parent.modelData.icon || ""
                            color: parent.parent.modelData.destructive ? ThemeTokens.danger : ThemeTokens.text
                            font.pixelSize: 12
                            anchors.verticalCenter: parent.verticalCenter
                        }

                        Text {
                            text: parent.parent.modelData.label || ""
                            color: parent.parent.modelData.destructive ? ThemeTokens.danger : ThemeTokens.text
                            font.pixelSize: 12
                            anchors.verticalCenter: parent.verticalCenter
                        }
                    }

                    Text {
                        id: shortcutText
                        anchors.right: parent.right
                        anchors.rightMargin: 8
                        anchors.verticalCenter: parent.verticalCenter
                        visible: !!parent.modelData.shortcut
                        text: parent.modelData.shortcut || ""
                        color: ThemeTokens.subduedText
                        font.pixelSize: 10
                        font.family: "monospace"
                    }

                    MouseArea {
                        id: itemMouse
                        anchors.fill: parent
                        hoverEnabled: !parent.modelData.disabled
                        cursorShape: parent.modelData.disabled ? Qt.ArrowCursor : Qt.PointingHandCursor
                        onEntered: {
                            if (!parent.modelData.disabled) root.highlightedIndex = parent.index
                        }
                        onClicked: {
                            if (parent.modelData.disabled) return
                            contextPopup.close()
                            if (typeof parent.modelData.onSelect === "function") {
                                parent.modelData.onSelect()
                            }
                            root.itemSelected(parent.modelData.id || parent.modelData.label)
                        }
                    }
                }
            }
        }
    }
}
