// ChaSetContextMenu.qml — Cross-Stack Context Menu Component
import QtQuick
import QtQuick.Controls
import ChaSet

Item {
    id: root

    property var items: [] // [{ id, label, icon, shortcut, destructive, disabled, onSelect }]
    property int menuWidth: 180
    readonly property int effectiveMenuWidth: ThemeTokens.dp(menuWidth)
    property int customRadius: 6
    readonly property int effectiveRadius: ThemeTokens.dp(customRadius)
    property int highlightedIndex: -1
    property string modality: "pointer" // "pointer" | "keyboard"
    property real lastPointerSceneX: -1
    property real lastPointerSceneY: -1

    signal itemSelected(string itemId)

    // Registry / Escape contract — see ChaSetOverlayHub.
    property bool closeOnEscape: true

    Shortcut {
        sequence: "Escape"
        autoRepeat: false
        enabled: contextPopup.opened && root.closeOnEscape && ChaSetOverlayHub.isTop(contextPopup)
        onActivated: contextPopup.close()
    }

    function handlePointerMove(idx, sceneX, sceneY) {
        if (Math.abs(sceneX - lastPointerSceneX) < 1.5 && Math.abs(sceneY - lastPointerSceneY) < 1.5) {
            return
        }
        lastPointerSceneX = sceneX
        lastPointerSceneY = sceneY
        modality = "pointer"
        highlightedIndex = idx
    }

    function isItemDisabled(item) {
        if (!item) return true
        if (item.status === "intermediate" || item.intermediate) return false
        return !!item.disabled
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
            if (!items[i] || !isItemDisabled(items[i])) return i
        }
        return -1
    }

    function findLastEnabledIndex() {
        if (!items || items.length === 0) return -1
        for (let i = items.length - 1; i >= 0; i--) {
            if (!items[i] || !isItemDisabled(items[i])) return i
        }
        return -1
    }

    function triggerHighlighted() {
        if (highlightedIndex >= 0 && highlightedIndex < items.length) {
            const item = items[highlightedIndex]
            if (item && !isItemDisabled(item)) {
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
        var menuW = root.effectiveMenuWidth
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
        width: root.effectiveMenuWidth
        padding: ThemeTokens.dp(4)
        modal: false
        focus: true
        closePolicy: Popup.CloseOnEscape | Popup.CloseOnPressOutside

        onOpened: {
            ChaSetOverlayHub.register(contextPopup)
            root.highlightedIndex = -1
            contextPopup.contentItem.forceActiveFocus()
        }
        onClosed: {
            ChaSetOverlayHub.unregister(contextPopup)
            root.highlightedIndex = -1
        }

        background: ChaSetSquircle {
            color: ThemeTokens.panel
            border.color: ThemeTokens.border
            border.width: 1
            radius: root.effectiveRadius
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
                if (root.closeOnEscape) contextPopup.close()
            }
            Repeater {
                model: root.items
                delegate: ChaSetSquircle {
                    required property var modelData
                    required property int index
                    width: parent ? parent.width : 0
                    height: ThemeTokens.dp(28)
                    radius: ThemeTokens.innerRadius(root.customRadius, contextPopup.padding)
                    readonly property bool isHighlighted: index === root.highlightedIndex
                    readonly property bool isIntermediate: !!(modelData && (modelData.status === "intermediate" || modelData.intermediate))
                    readonly property bool isActuallyDisabled: !!(modelData && modelData.disabled && !isIntermediate)
                    color: isHighlighted ? (modelData.destructive ? Qt.rgba(239/255, 68/255, 68/255, 0.15) : (isIntermediate ? Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.15) : ThemeTokens.hover)) : "transparent"
                    opacity: isActuallyDisabled ? 0.4 : 1.0

                    Behavior on color {
                        enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
                        ColorAnimation { duration: ThemeTokens.motionQuick; easing.type: ThemeTokens.easeStandard }
                    }

                    Row {
                        anchors.left: parent.left
                        anchors.leftMargin: ThemeTokens.dp(8)
                        anchors.right: trailingItem.left
                        anchors.rightMargin: ThemeTokens.dp(8)
                        anchors.verticalCenter: parent.verticalCenter
                        spacing: ThemeTokens.dp(6)

                        ChaSetIcon {
                            id: vectorIcon
                            visible: !!parent.parent.modelData.icon && (String(parent.parent.modelData.icon).length <= 16 && !/[^\x00-\x7F]/.test(String(parent.parent.modelData.icon)))
                            name: String(parent.parent.modelData.icon || "")
                            size: 14
                            color: parent.parent.modelData.destructive ? ThemeTokens.danger : (parent.parent.isActuallyDisabled ? ThemeTokens.subduedText : (parent.parent.isIntermediate ? ThemeTokens.subduedText : ThemeTokens.text))
                            anchors.verticalCenter: parent.verticalCenter
                        }

                        Text {
                            visible: !!parent.parent.modelData.icon && !vectorIcon.visible
                            text: parent.parent.modelData.icon || ""
                            color: parent.parent.modelData.destructive ? ThemeTokens.danger : (parent.parent.isActuallyDisabled ? ThemeTokens.subduedText : (parent.parent.isIntermediate ? ThemeTokens.subduedText : ThemeTokens.text))
                            font.pixelSize: Typography.sizeSmall
                            anchors.verticalCenter: parent.verticalCenter
                        }

                        Text {
                            text: parent.parent.modelData.label || ""
                            color: parent.parent.modelData.destructive ? ThemeTokens.danger : (parent.parent.isActuallyDisabled ? ThemeTokens.subduedText : (parent.parent.isIntermediate ? ThemeTokens.subduedText : ThemeTokens.text))
                            font.pixelSize: Typography.sizeSmall
                            anchors.verticalCenter: parent.verticalCenter
                        }
                    }

                    Row {
                        id: trailingItem
                        anchors.right: parent.right
                        anchors.rightMargin: ThemeTokens.dp(8)
                        anchors.verticalCenter: parent.verticalCenter
                        spacing: ThemeTokens.dp(6)

                        ChaSetSquircle {
                            id: badgeBox
                            visible: parent.parent.isIntermediate
                            height: ThemeTokens.dp(16)
                            implicitWidth: badgeLabel.implicitWidth + ThemeTokens.dp(8)
                            radius: ThemeTokens.dp(3)
                            color: Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.12)
                            border.color: Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.28)
                            border.width: 1
                            anchors.verticalCenter: parent.verticalCenter

                            Text {
                                id: badgeLabel
                                anchors.centerIn: parent
                                text: (parent.parent.parent.modelData && parent.parent.parent.modelData.intermediateBadge) ? parent.parent.parent.modelData.intermediateBadge : ChaSetI18n.tr("common.opened", "已打开")
                                color: ThemeTokens.accent
                                font.pixelSize: Typography.sizeMicro
                            }
                        }

                        ChaSetShortcut {
                            id: shortcutText
                            anchors.verticalCenter: parent.verticalCenter
                            visible: !!parent.parent.modelData.shortcut
                            value: parent.parent.modelData.shortcut || ""
                        }
                    }

                    MouseArea {
                        id: itemMouse
                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: parent.isActuallyDisabled ? Qt.ForbiddenCursor : Qt.PointingHandCursor
                        onPositionChanged: (mouse) => {
                            if (parent.isActuallyDisabled) return
                            var p = itemMouse.mapToItem(null, mouse.x, mouse.y)
                            root.handlePointerMove(parent.index, p.x, p.y)
                        }
                        onEntered: {
                            if (root.modality === "pointer" && !parent.isActuallyDisabled) {
                                root.highlightedIndex = parent.index
                            }
                        }
                        onClicked: {
                            if (parent.isActuallyDisabled) return
                            contextPopup.close()
                            if (typeof parent.modelData.onSelect === "function") {
                                parent.modelData.onSelect()
                            }
                            root.itemSelected(parent.modelData.id || parent.modelData.label)
                        }
                    }

                    ChaSetTooltip {
                        id: itemTooltip
                        visible: !!(parent.modelData && parent.modelData.tooltip)
                        target: parent
                        text: (parent.modelData && parent.modelData.tooltip) || ""
                        side: (parent.modelData && parent.modelData.tooltipSide) ? parent.modelData.tooltipSide : "right"
                        disabled: !contextPopup.visible || !parent.modelData || !parent.modelData.tooltip
                        hovered: contextPopup.visible && itemMouse.containsMouse
                    }
                }
            }
        }
    }
}
