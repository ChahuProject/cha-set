// ChaSetContextMenu.qml — Cross-Stack Context Menu Component
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root

    property var items: [] // [{ id, label, icon, shortcut, destructive, disabled, onSelect }]
    property int menuWidth: ThemeTokens.dp(180)
    property int customRadius: ThemeTokens.dp(6)
    property int highlightedIndex: -1
    property string modality: "pointer" // "pointer" | "keyboard"
    property real lastPointerSceneX: -1
    property real lastPointerSceneY: -1

    signal itemSelected(string itemId)

    function handlePointerMove(idx, sceneX, sceneY) {
        if (Math.abs(sceneX - lastPointerSceneX) < 1.5 && Math.abs(sceneY - lastPointerSceneY) < 1.5) {
            return
        }
        lastPointerSceneX = sceneX
        lastPointerSceneY = sceneY
        modality = "pointer"
        highlightedIndex = idx
    }

    function findNextEnabledIndex(startIndex, direction) {
        if (!items || items.length === 0) return -1
        let count = items.length
        let idx = startIndex + direction
        for (let step = 0; step < count; step++) {
            if (idx < 0) idx = count - 1
            else if (idx >= count) idx = 0
            if (items[idx] && !items[idx].disabled) {
                return idx
            }
            idx += direction
        }
        return -1
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

    function openAt(sceneX, sceneY) {
        var localPos = mapFromItem(null, sceneX, sceneY)
        var targetX = localPos.x
        var targetY = localPos.y
        var winW = (root.Window && root.Window.window) ? root.Window.window.width : (parent ? parent.width : 1000)
        var winH = (root.Window && root.Window.window) ? root.Window.window.height : (parent ? parent.height : 800)
        var menuW = root.menuWidth
        var estimatedMenuH = ((root.items && root.items.length > 0) ? root.items.length : 3) * ThemeTokens.dp(28) + ThemeTokens.dp(16)
        if (sceneX + menuW > winW) {
            targetX = Math.max(0, targetX - menuW)
        }
        if (sceneY + estimatedMenuH > winH) {
            targetY = Math.max(0, targetY - estimatedMenuH)
        }
        contextPopup.x = targetX
        contextPopup.y = targetY
        contextPopup.open()
    }

    function close() {
        contextPopup.close()
    }

    default property alias targetData: targetContainer.data

    Item {
        id: targetContainer
        anchors.fill: parent
    }

    MouseArea {
        anchors.fill: parent
        acceptedButtons: Qt.RightButton
        enabled: targetContainer.children.length > 0
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
        padding: ThemeTokens.dp(4)
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
            opacity: contextPopup.visible ? 1.0 : 0.0
            scale: contextPopup.visible ? 1.0 : 0.95

            Behavior on opacity {
                enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
                NumberAnimation { duration: ThemeTokens.motionShort; easing.type: ThemeTokens.easeEntrance }
            }
            Behavior on scale {
                enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
                NumberAnimation { duration: ThemeTokens.motionShort; easing.type: ThemeTokens.easeEntrance }
            }
        }

        contentItem: Column {
            id: menuCol
            spacing: 2
            width: parent.width
            focus: true

            Keys.onDownPressed: (event) => {
                event.accepted = true
                root.modality = "keyboard"
                root.highlightedIndex = root.findNextEnabledIndex(root.highlightedIndex, 1)
            }
            Keys.onUpPressed: (event) => {
                event.accepted = true
                root.modality = "keyboard"
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
                    width: parent ? parent.width : 0
                    height: ThemeTokens.dp(28)
                    radius: ThemeTokens.dp(4)
                    readonly property bool isHighlighted: index === root.highlightedIndex
                    color: isHighlighted ? (modelData.destructive ? Qt.rgba(239/255, 68/255, 68/255, 0.15) : ThemeTokens.hover) : "transparent"
                    opacity: modelData.disabled ? 0.4 : 1.0

                    Behavior on color {
                        enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
                        ColorAnimation { duration: ThemeTokens.motionQuick; easing.type: ThemeTokens.easeStandard }
                    }

                    Row {
                        anchors.left: parent.left
                        anchors.leftMargin: ThemeTokens.dp(8)
                        anchors.right: shortcutText.visible ? shortcutText.left : parent.right
                        anchors.rightMargin: ThemeTokens.dp(8)
                        anchors.verticalCenter: parent.verticalCenter
                        spacing: ThemeTokens.dp(6)

                        ChaSetIcon {
                            id: vectorIcon
                            visible: !!parent.parent.modelData.icon && (String(parent.parent.modelData.icon).length <= 16 && !/[^\x00-\x7F]/.test(String(parent.parent.modelData.icon)))
                            name: String(parent.parent.modelData.icon || "")
                            size: 14
                            color: parent.parent.modelData.destructive ? ThemeTokens.danger : (parent.parent.modelData.disabled ? ThemeTokens.subduedText : ThemeTokens.text)
                            anchors.verticalCenter: parent.verticalCenter
                        }

                        Text {
                            visible: !!parent.parent.modelData.icon && !vectorIcon.visible
                            text: parent.parent.modelData.icon || ""
                            color: parent.parent.modelData.destructive ? ThemeTokens.danger : (parent.parent.modelData.disabled ? ThemeTokens.subduedText : ThemeTokens.text)
                            font.pixelSize: Typography.sizeSmall
                            anchors.verticalCenter: parent.verticalCenter
                        }

                        Text {
                            text: parent.parent.modelData.label || ""
                            color: parent.parent.modelData.destructive ? ThemeTokens.danger : ThemeTokens.text
                            font.pixelSize: Typography.sizeSmall
                            anchors.verticalCenter: parent.verticalCenter
                        }
                    }

                    Text {
                        id: shortcutText
                        anchors.right: parent.right
                        anchors.rightMargin: ThemeTokens.dp(8)
                        anchors.verticalCenter: parent.verticalCenter
                        visible: !!parent.modelData.shortcut
                        text: parent.modelData.shortcut || ""
                        color: ThemeTokens.subduedText
                        font.pixelSize: Typography.sizeMicro
                        font.family: Typography.familyMono
                    }

                    MouseArea {
                        id: itemMouse
                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: (parent && parent.modelData && parent.modelData.disabled) ? Qt.ForbiddenCursor : Qt.PointingHandCursor
                        onPositionChanged: (mouse) => {
                            if (parent && parent.modelData && parent.modelData.disabled) return
                            var p = itemMouse.mapToItem(null, mouse.x, mouse.y)
                            root.handlePointerMove(parent.index, p.x, p.y)
                        }
                        onEntered: {
                            if (root.modality === "pointer" && parent && parent.modelData && !parent.modelData.disabled) {
                                root.highlightedIndex = parent.index
                            }
                        }
                        onClicked: {
                            if (parent && parent.modelData && parent.modelData.disabled) return
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
