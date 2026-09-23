// ChaSetDropdownMenu.qml — Cross-Stack Dropdown Menu Component
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root

    property bool open: false
    property var items: [] // [{ id, label, icon, shortcut, destructive, disabled, separator, isLabel, checked, onSelect }]
    property int menuWidth: 180
    property int customRadius: 6
    property string align: "start" // "start" | "end"
    property int sideOffset: 4
    property int highlightedIndex: -1
    property string modality: "pointer" // "pointer" | "keyboard"
    property real lastPointerSceneX: -1
    property real lastPointerSceneY: -1

    signal itemSelected(string itemId)
    signal opened()
    signal closed()

    function isItemDisabled(item) {
        return !item || item.disabled || item.separator || item.isLabel || item.header
    }

    function handlePointerMove(idx, sceneX, sceneY) {
        if (Math.abs(sceneX - lastPointerSceneX) < 1.5 && Math.abs(sceneY - lastPointerSceneY) < 1.5) {
            return
        }
        lastPointerSceneX = sceneX
        lastPointerSceneY = sceneY
        modality = "pointer"
        if (items && isItemDisabled(items[idx])) {
            return
        }
        highlightedIndex = idx
    }

    function findNextEnabledIndex(startIndex, direction) {
        if (!items || items.length === 0) return -1
        let count = items.length
        let idx = startIndex + direction
        for (let step = 0; step < count; step++) {
            if (idx < 0) idx = count - 1
            else if (idx >= count) idx = 0
            if (items[idx] && !isItemDisabled(items[idx])) {
                return idx
            }
            idx += direction
        }
        return -1
    }

    function findFirstEnabledIndex() {
        if (!items || items.length === 0) return -1
        for (let i = 0; i < items.length; i++) {
            if (items[i] && !isItemDisabled(items[i])) return i
        }
        return -1
    }

    function findLastEnabledIndex() {
        if (!items || items.length === 0) return -1
        for (let i = items.length - 1; i >= 0; i--) {
            if (items[i] && !isItemDisabled(items[i])) return i
        }
        return -1
    }

    function triggerHighlighted() {
        if (highlightedIndex >= 0 && highlightedIndex < items.length) {
            const item = items[highlightedIndex]
            if (item && !isItemDisabled(item)) {
                root.open = false
                if (typeof item.onSelect === "function") {
                    item.onSelect()
                }
                root.itemSelected(item.id || item.label)
            }
        }
    }

    function handleKeyEvent(event) {
        if (!root.open) {
            if (event.key === Qt.Key_Space || event.key === Qt.Key_Return || event.key === Qt.Key_Enter || event.key === Qt.Key_Down) {
                event.accepted = true
                root.open = true
            }
            return
        }

        if (event.key === Qt.Key_Down) {
            event.accepted = true
            modality = "keyboard"
            highlightedIndex = findNextEnabledIndex(highlightedIndex, 1)
        } else if (event.key === Qt.Key_Up) {
            event.accepted = true
            modality = "keyboard"
            highlightedIndex = findNextEnabledIndex(highlightedIndex, -1)
        } else if (event.key === Qt.Key_Home) {
            event.accepted = true
            modality = "keyboard"
            highlightedIndex = findFirstEnabledIndex()
        } else if (event.key === Qt.Key_End) {
            event.accepted = true
            modality = "keyboard"
            highlightedIndex = findLastEnabledIndex()
        } else if (event.key === Qt.Key_Return || event.key === Qt.Key_Enter || event.key === Qt.Key_Space) {
            event.accepted = true
            triggerHighlighted()
        } else if (event.key === Qt.Key_Escape) {
            event.accepted = true
            root.open = false
        }
    }

    Keys.onPressed: (event) => handleKeyEvent(event)

    default property alias triggerData: triggerContainer.data

    Item {
        id: triggerContainer
        anchors.fill: parent
    }

    Popup {
        id: menuPopup
        visible: root.open
        onVisibleChanged: {
            if (root.open !== visible) root.open = visible
            if (visible) {
                root.highlightedIndex = -1
                root.opened()
            } else {
                root.highlightedIndex = -1
                root.closed()
            }
        }
        onOpened: {
            menuPopup.contentItem.forceActiveFocus()
        }
        x: root.align === "end" ? (root.width - width) : 0
        y: root.height + ThemeTokens.dp(root.sideOffset)
        width: ThemeTokens.dp(root.menuWidth)
        padding: ThemeTokens.dp(4)
        modal: false
        focus: true
        closePolicy: Popup.CloseOnEscape | Popup.CloseOnPressOutside

        background: Rectangle {
            color: ThemeTokens.panel
            border.color: ThemeTokens.border
            border.width: 1
            radius: ThemeTokens.dp(root.customRadius)
            layer.enabled: true
            opacity: menuPopup.visible ? 1.0 : 0.0
            scale: menuPopup.visible ? 1.0 : 0.95

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
            spacing: ThemeTokens.dp(2)
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
                root.open = false
            }

            Repeater {
                model: root.items
                delegate: Item {
                    id: delegateItem
                    required property var modelData
                    required property int index
                    readonly property bool isSep: !!delegateItem.modelData && !!delegateItem.modelData.separator
                    readonly property bool isLbl: !!delegateItem.modelData && (!!delegateItem.modelData.isLabel || !!delegateItem.modelData.header)

                    width: parent ? parent.width : 0
                    height: isSep ? ThemeTokens.dp(9) : (isLbl ? ThemeTokens.dp(24) : ThemeTokens.dp(28))

                    // Separator line
                    Rectangle {
                        visible: delegateItem.isSep
                        anchors.centerIn: parent
                        width: parent.width - ThemeTokens.dp(8)
                        height: 1
                        color: ThemeTokens.border
                    }

                    // Label / Header
                    Text {
                        visible: delegateItem.isLbl
                        anchors.left: parent.left
                        anchors.leftMargin: ThemeTokens.dp(8)
                        anchors.right: parent.right
                        anchors.rightMargin: ThemeTokens.dp(8)
                        anchors.verticalCenter: parent.verticalCenter
                        text: (delegateItem.modelData && delegateItem.modelData.label) || ""
                        color: ThemeTokens.subduedText
                        font.pixelSize: Typography.sizeMicro
                        font.weight: Typography.weightMedium
                        elide: Text.ElideRight
                    }

                    // Interactive Item Container
                    Rectangle {
                        visible: !delegateItem.isSep && !delegateItem.isLbl
                        anchors.fill: parent
                        radius: ThemeTokens.dp(4)
                        readonly property bool isHighlighted: delegateItem.index === root.highlightedIndex
                        color: isHighlighted ? (delegateItem.modelData && delegateItem.modelData.destructive ? Qt.rgba(239/255, 68/255, 68/255, 0.15) : ThemeTokens.hover) : "transparent"
                        opacity: delegateItem.modelData && delegateItem.modelData.disabled ? 0.4 : 1.0

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
                                visible: !!delegateItem.modelData && !!delegateItem.modelData.icon
                                name: (delegateItem.modelData && delegateItem.modelData.icon) || ""
                                size: 14
                                color: delegateItem.modelData && delegateItem.modelData.destructive ? ThemeTokens.danger : (delegateItem.modelData && delegateItem.modelData.checked ? ThemeTokens.accent : ThemeTokens.subduedText)
                                anchors.verticalCenter: parent.verticalCenter
                            }

                            Text {
                                text: (delegateItem.modelData && delegateItem.modelData.label) || ""
                                color: delegateItem.modelData && delegateItem.modelData.destructive ? ThemeTokens.danger : (delegateItem.modelData && delegateItem.modelData.checked ? ThemeTokens.accent : ThemeTokens.text)
                                font.pixelSize: Typography.sizeSmall
                                font.weight: (delegateItem.modelData && delegateItem.modelData.checked) ? Typography.weightMedium : Typography.weightRegular
                                anchors.verticalCenter: parent.verticalCenter
                                elide: Text.ElideRight
                            }
                        }

                        Text {
                            id: shortcutText
                            anchors.right: parent.right
                            anchors.rightMargin: ThemeTokens.dp(8)
                            anchors.verticalCenter: parent.verticalCenter
                            visible: !!delegateItem.modelData && !!delegateItem.modelData.shortcut
                            text: (delegateItem.modelData && delegateItem.modelData.shortcut) || ""
                            color: ThemeTokens.subduedText
                            font.pixelSize: Typography.sizeMicro
                            font.family: Typography.familyMono
                        }

                        MouseArea {
                            id: itemMouse
                            anchors.fill: parent
                            enabled: !delegateItem.isSep && !delegateItem.isLbl
                            hoverEnabled: true
                            cursorShape: (delegateItem.modelData && delegateItem.modelData.disabled) ? Qt.ForbiddenCursor : Qt.PointingHandCursor
                            onPositionChanged: (mouse) => {
                                if (delegateItem.modelData && delegateItem.modelData.disabled) return
                                var p = itemMouse.mapToItem(null, mouse.x, mouse.y)
                                root.handlePointerMove(delegateItem.index, p.x, p.y)
                            }
                            onEntered: {
                                if (root.modality === "pointer" && delegateItem.modelData && !delegateItem.modelData.disabled) {
                                    root.highlightedIndex = delegateItem.index
                                }
                            }
                            onClicked: {
                                if (delegateItem.modelData && delegateItem.modelData.disabled) return
                                root.open = false
                                if (typeof delegateItem.modelData.onSelect === "function") {
                                    delegateItem.modelData.onSelect()
                                }
                                root.itemSelected(delegateItem.modelData.id || delegateItem.modelData.label)
                            }
                        }
                    }
                }
            }
        }
    }
}
