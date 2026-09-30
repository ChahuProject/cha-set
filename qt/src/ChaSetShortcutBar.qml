// qt/src/ChaSetShortcutBar.qml — Cross-Stack Responsive Shortcut Bar
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root

    property var items: []
    property string preset: ""
    property var additionalShortcuts: []
    property var overrides: ({})
    property var exclude: []
    property string compact: "auto"        // "auto" | "always" | "never"
    property string size: "xs"             // "xs" | "sm" | "default" | "md"
    property string variant: "outline"     // "outline" | "solid" | "subtle" | "inverted"
    property bool showOverflowCount: true
    property int maxVisibleItems: -1
    property bool forceCompact: false

    readonly property var defaultPresets: ({
        "dropdown": [
            { "id": "nav", "keys": ["Up", "Down"], "label": qsTr("导航"), "priority": 1 },
            { "id": "select", "keys": ["Enter"], "label": qsTr("选择"), "priority": 1 },
            { "id": "close", "keys": ["Esc"], "label": qsTr("关闭"), "priority": 2 }
        ],
        "dialog": [
            { "id": "confirm", "keys": ["Enter"], "label": qsTr("确认"), "priority": 1 },
            { "id": "cancel", "keys": ["Esc"], "label": qsTr("取消"), "priority": 1 }
        ],
        "tree": [
            { "id": "nav", "keys": ["Up", "Down"], "label": qsTr("导航"), "priority": 1 },
            { "id": "toggle", "keys": ["Left", "Right"], "label": qsTr("折叠/展开"), "priority": 2 },
            { "id": "select", "keys": ["Enter"], "label": qsTr("选择"), "priority": 1 },
            { "id": "close", "keys": ["Esc"], "label": qsTr("取消"), "priority": 3 }
        ],
        "table": [
            { "id": "nav", "keys": ["Up", "Down"], "label": qsTr("移动"), "priority": 1 },
            { "id": "select", "keys": ["Space"], "label": qsTr("选中"), "priority": 2 }
        ],
        "address-bar": [
            { "id": "nav", "keys": ["Up", "Down"], "label": qsTr("导航"), "priority": 1 },
            { "id": "open", "keys": ["Enter"], "label": qsTr("打开"), "priority": 1 },
            { "id": "close", "keys": ["Esc"], "label": qsTr("关闭"), "priority": 2 }
        ]
    })

    // Merged list of shortcut items
    readonly property var effectiveItems: {
        var baseList = []
        if (root.items && root.items.length > 0) {
            baseList = root.items
        } else if (root.preset && root.defaultPresets[root.preset]) {
            baseList = root.defaultPresets[root.preset]
        } else {
            baseList = root.defaultPresets["dropdown"]
        }

        var res = []
        var excludeSet = {}
        if (root.exclude) {
            for (var e = 0; e < root.exclude.length; ++e) {
                excludeSet[root.exclude[e]] = true
            }
        }

        for (var i = 0; i < baseList.length; ++i) {
            var item = baseList[i]
            if (excludeSet[item.id]) continue
            var merged = Object.assign({}, item)
            if (root.overrides && root.overrides[item.id]) {
                Object.assign(merged, root.overrides[item.id])
            }
            res.push(merged)
        }

        if (root.additionalShortcuts && root.additionalShortcuts.length > 0) {
            for (var a = 0; a < root.additionalShortcuts.length; ++a) {
                res.push(root.additionalShortcuts[a])
            }
        }
        return res
    }

    // Responsive width and progressive multi-stage calculations
    readonly property real availableWidth: Math.max(0, root.width - ThemeTokens.dp(16))

    function estimateItemWidth(item, mode) {
        var isComp = (mode === "compact")
        var numKeys = (item.keys && item.keys.length) ? item.keys.length : 1
        var keysW = 0
        for (var k = 0; k < numKeys; ++k) {
            var keyStr = String(item.keys[k] || "")
            var isSymbol = (keyStr === "Up" || keyStr === "Down" || keyStr === "Left" || keyStr === "Right" ||
                            keyStr === "ArrowUp" || keyStr === "ArrowDown" || keyStr === "ArrowLeft" || keyStr === "ArrowRight" ||
                            keyStr === "Enter" || keyStr === "Esc" || keyStr === "Escape" || keyStr === "Tab" || keyStr === "Space")
            var kw = (isComp && isSymbol)
                ? ThemeTokens.dp(16)
                : Math.max(ThemeTokens.dp(isComp ? 16 : 18), keyStr.length * ThemeTokens.dp(isComp ? 5 : 6) + ThemeTokens.dp(isComp ? 6 : 8))
            keysW += kw + (k > 0 ? ThemeTokens.dp(isComp ? 2 : 3) : 0)
        }
        var labelStr = isComp ? (item.shortLabel || "") : (item.label || "")
        var labelW = 0
        if (labelStr.length > 0) {
            for (var c = 0; c < labelStr.length; ++c) {
                var code = labelStr.charCodeAt(c)
                var isCjk = (code >= 0x4e00 && code <= 0x9fff)
                labelW += isCjk ? ThemeTokens.dp(isComp ? 10 : 11) : ThemeTokens.dp(isComp ? 5 : 6)
            }
            labelW += ThemeTokens.dp(isComp ? 2 : 4)
        }
        return keysW + labelW + ThemeTokens.dp(isComp ? 4 : 8)
    }

    // Optimal progressive multi-stage layout engine (parity with React ShortcutBar.tsx)
    // 1. Loops visible item count k from N down to 1 (maximizing visible count, eliminating premature +N badges).
    // 2. For the k visible items, loops compact count c from 0 to k:
    //    The rightmost c items are compact symbols, while leftmost (k - c) items remain full text.
    // 3. When an item folds into +1, remaining items immediately attempt larger/full sizes to eliminate blank space.
    readonly property var layoutResult: {
        if (!effectiveItems || effectiveItems.length === 0) {
            return { "visible": [], "overflow": [], "stage": "full" }
        }

        if (root.maxVisibleItems >= 0) {
            var visFixed = effectiveItems.slice(0, root.maxVisibleItems)
            var ovFixed = effectiveItems.slice(root.maxVisibleItems)
            var isCompFixed = (root.compact === "always" || root.forceCompact)
            var mappedVis = []
            for (var f = 0; f < visFixed.length; ++f) {
                var itm = Object.assign({}, visFixed[f])
                itm.isCompact = isCompFixed
                mappedVis.push(itm)
            }
            return {
                "visible": mappedVis,
                "overflow": ovFixed,
                "stage": ovFixed.length > 0 ? "folded" : "full"
            }
        }

        var N = effectiveItems.length
        var badgeW = ThemeTokens.dp(28)
        var gapNormal = ThemeTokens.dp(10)
        var gapCompact = ThemeTokens.dp(6)

        // Priority order for overflow folding: lowest priority / rightmost items fold first
        var priorityOrder = []
        for (var p = 0; p < N; ++p) {
            priorityOrder.push({
                "item": effectiveItems[p],
                "index": p,
                "priority": effectiveItems[p].priority || 1
            })
        }
        priorityOrder.sort((a, b) => {
            if (a.priority !== b.priority) return a.priority - b.priority
            return a.index - b.index
        })

        var normalWidths = []
        var compactWidths = []
        for (var w = 0; w < N; ++w) {
            normalWidths.push(estimateItemWidth(effectiveItems[w], "full"))
            compactWidths.push(estimateItemWidth(effectiveItems[w], "compact"))
        }

        var best = null

        // Try visible count k from N down to 1
        for (var k = N; k >= 1; --k) {
            var hasOverflow = (k < N)
            var badgeSpace = (hasOverflow && root.showOverflowCount) ? (badgeW + gapCompact) : 0
            var targetAvail = availableWidth - badgeSpace
            if (targetAvail < 0 && k > 1) continue

            // Visible items set (top k by priority, kept in original display order)
            var keptIndices = {}
            for (var s = 0; s < k; ++s) {
                keptIndices[priorityOrder[s].index] = true
            }

            var currentVisible = []
            var currentOverflow = []
            for (var i = 0; i < N; ++i) {
                if (keptIndices[i]) {
                    currentVisible.push(effectiveItems[i])
                } else {
                    currentOverflow.push(effectiveItems[i])
                }
            }

            // Try compact count c from 0 (all full) to k (all compact)
            // Rightmost c items are compact; leftmost (k - c) items are full text
            for (var c = 0; c <= k; ++c) {
                if ((root.compact === "always" || root.forceCompact) && c < k) continue
                if (root.compact === "never" && c > 0) continue

                var gap = (c === 0) ? gapNormal : gapCompact
                var totalW = Math.max(0, k - 1) * gap

                for (var vIdx = 0; vIdx < k; ++vIdx) {
                    var origIdx = effectiveItems.indexOf(currentVisible[vIdx])
                    var itemIsCompact = (vIdx >= k - c)
                    var iw = itemIsCompact ? compactWidths[origIdx] : normalWidths[origIdx]
                    totalW += iw
                }

                if (totalW <= targetAvail) {
                    var stage = hasOverflow
                        ? "folded"
                        : (c === k ? "compact" : (c > 0 ? "squeezed" : "full"))

                    var finalVis = []
                    for (var vi = 0; vi < k; ++vi) {
                        var itCopy = Object.assign({}, currentVisible[vi])
                        itCopy.isCompact = (vi >= k - c)
                        finalVis.push(itCopy)
                    }

                    best = {
                        "visible": finalVis,
                        "overflow": currentOverflow,
                        "stage": stage
                    }
                    break
                }
            }

            if (best) break
        }

        if (best) return best

        var fallbackItem = Object.assign({}, effectiveItems[0])
        fallbackItem.isCompact = true
        return {
            "visible": [fallbackItem],
            "overflow": effectiveItems.slice(1),
            "stage": "folded"
        }
    }

    readonly property string responsiveStage: layoutResult.stage
    readonly property var visibleItems: layoutResult.visible
    readonly property var overflowItems: layoutResult.overflow
    readonly property bool isCompact: responsiveStage === "compact" || root.compact === "always" || root.forceCompact

    readonly property string overflowTooltipText: {
        if (!overflowItems || overflowItems.length === 0) return ""
        var parts = []
        for (var i = 0; i < overflowItems.length; ++i) {
            var it = overflowItems[i]
            parts.push((it.keys ? it.keys.join("+") : "") + ": " + (it.label || ""))
        }
        return parts.join("\n")
    }

    readonly property string overflowBadgeText: (root.overflowItems && root.overflowItems.length > 0) ? ("+" + root.overflowItems.length) : ""

    implicitHeight: ThemeTokens.dp(26)

    implicitWidth: layoutRow.implicitWidth + ThemeTokens.dp(16)
    height: implicitHeight

    onVisibleItemsChanged: {
        if (!overflowItems || overflowItems.length === 0) {
            overflowPopup.close()
        }
        itemTooltipPopup.close()
    }

    Rectangle {
        id: bgRect
        anchors.fill: parent
        color: ThemeTokens.panelRaised
        z: -1
    }

    // Top border divider line
    Rectangle {
        anchors.top: parent.top
        anchors.left: parent.left
        anchors.right: parent.right
        height: 1
        color: ThemeTokens.border
    }

    Row {
        id: layoutRow
        anchors.left: parent.left
        anchors.leftMargin: ThemeTokens.dp(8)
        anchors.verticalCenter: parent.verticalCenter
        spacing: (root.responsiveStage === "full") ? ThemeTokens.dp(10) : ThemeTokens.dp(5)

        Repeater {
            model: root.visibleItems
            delegate: Row {
                id: itemDelegate
                required property var modelData
                required property int index
                spacing: itemDelegate.modelData.isCompact ? ThemeTokens.dp(2) : ThemeTokens.dp(4)
                anchors.verticalCenter: parent ? parent.verticalCenter : undefined

                HoverHandler {
                    id: itemHoverHandler
                    cursorShape: Qt.PointingHandCursor
                    onHoveredChanged: {
                        if (hovered) {
                            itemTooltipPopup.currentItem = itemDelegate.modelData
                            itemTooltipPopup.currentTarget = itemDelegate
                            itemTooltipPopup.open()
                        } else {
                            if (itemTooltipPopup.currentTarget === itemDelegate) {
                                itemTooltipPopup.close()
                            }
                        }
                    }
                }

                Repeater {
                    model: itemDelegate.modelData.keys || []
                    delegate: ChaSetKbd {
                        required property var modelData
                        size: itemDelegate.modelData.isCompact ? "xs" : (root.responsiveStage === "full" ? root.size : "xs")
                        variant: root.variant
                        compact: itemDelegate.modelData.isCompact ? "always" : "never"
                        text: modelData
                        height: itemDelegate.modelData.isCompact ? ThemeTokens.dp(16) : (root.responsiveStage === "full" ? ThemeTokens.dp(18) : ThemeTokens.dp(16))
                        anchors.verticalCenter: parent ? parent.verticalCenter : undefined
                    }
                }

                Text {
                    visible: !itemDelegate.modelData.isCompact || (itemDelegate.modelData.shortLabel && itemDelegate.modelData.shortLabel.length > 0)
                    text: (itemDelegate.modelData.isCompact && itemDelegate.modelData.shortLabel) ? itemDelegate.modelData.shortLabel : (itemDelegate.modelData.label || "")
                    color: ThemeTokens.subduedText
                    font.pixelSize: (root.responsiveStage === "full" && !itemDelegate.modelData.isCompact) ? Typography.sizeCaption : Typography.sizeMicro
                    verticalAlignment: Text.AlignVCenter
                    anchors.verticalCenter: parent ? parent.verticalCenter : undefined
                }
            }
        }

        // Overflow '+N' badge with interactive overlay Popup
        ChaSetBadge {
            id: overflowBadge
            visible: root.showOverflowCount && root.overflowItems && root.overflowItems.length > 0
            size: "sm"
            variant: "outline"
            text: root.overflowBadgeText
            height: ThemeTokens.dp(16)
            interactive: true
            anchors.verticalCenter: parent ? parent.verticalCenter : undefined

            onHoveredChanged: {
                if (hovered) {
                    closeTimer.stop()
                    overflowPopup.open()
                } else {
                    closeTimer.restart()
                }
            }

            onClicked: {
                if (overflowPopup.visible) {
                    overflowPopup.close()
                } else {
                    overflowPopup.open()
                }
            }

            Popup {
                id: overflowPopup
                parent: overflowBadge
                modal: false
                dim: false
                focus: false
                closePolicy: Popup.CloseOnEscape | Popup.CloseOnPressOutside

                x: {
                    var win = root.Window.window
                    if (!win) return (overflowBadge.width - implicitWidth) / 2
                    var mapped = overflowBadge.mapToItem(null, 0, 0)
                    var targetX = mapped.x + (overflowBadge.width - implicitWidth) / 2
                    var clampedX = Math.max(ThemeTokens.dp(8), Math.min(win.width - implicitWidth - ThemeTokens.dp(8), targetX))
                    return clampedX - mapped.x
                }
                y: {
                    var win = root.Window.window
                    var gap = ThemeTokens.dp(6)
                    if (!win) return -implicitHeight - gap
                    var mapped = overflowBadge.mapToItem(null, 0, 0)
                    if (mapped.y - implicitHeight - gap < ThemeTokens.dp(8)) {
                        return overflowBadge.height + gap
                    }
                    return -implicitHeight - gap
                }

                padding: ThemeTokens.dp(8)

                background: Rectangle {
                    color: ThemeTokens.panel
                    border.color: ThemeTokens.border
                    border.width: 1
                    radius: ThemeTokens.dp(6)
                }

                contentItem: Column {
                    spacing: ThemeTokens.dp(6)

                    HoverHandler {
                        id: popupHoverHandler
                        onHoveredChanged: {
                            if (hovered) {
                                closeTimer.stop()
                            } else {
                                closeTimer.restart()
                            }
                        }
                    }

                    Row {
                        width: parent.width
                        Text {
                            text: qsTr("更多快捷键")
                            color: ThemeTokens.subduedText
                            font.pixelSize: Typography.sizeCaption
                            font.weight: Font.Medium
                        }
                    }

                    Rectangle {
                        width: parent.width
                        height: 1
                        color: ThemeTokens.border
                    }

                    Repeater {
                        model: root.overflowItems
                        delegate: Row {
                            id: ovRow
                            required property var modelData
                            required property int index
                            spacing: ThemeTokens.dp(12)

                            Row {
                                spacing: ThemeTokens.dp(3)
                                anchors.verticalCenter: parent.verticalCenter
                                Repeater {
                                    model: ovRow.modelData.keys || []
                                    delegate: ChaSetKbd {
                                        required property var modelData
                                        size: "xs"
                                        variant: "outline"
                                        compact: "never"
                                        text: modelData
                                        height: ThemeTokens.dp(16)
                                    }
                                }
                            }

                            Text {
                                text: ovRow.modelData.label || ""
                                color: ThemeTokens.text
                                font.pixelSize: Typography.sizeCaption
                                verticalAlignment: Text.AlignVCenter
                                anchors.verticalCenter: parent.verticalCenter
                            }
                        }
                    }
                }
            }
        }
    }

    // Focused Item Tooltip on Hover
    Popup {
        id: itemTooltipPopup
        modal: false
        dim: false
        focus: false
        closePolicy: Popup.NoAutoClose

        property var currentItem: null
        property Item currentTarget: null

        x: {
            if (!currentTarget) return 0
            var win = root.Window.window
            var mapped = currentTarget.mapToItem(null, 0, 0)
            var targetCenterX = mapped.x + currentTarget.width / 2
            var clampedX = targetCenterX - implicitWidth / 2
            if (win) {
                clampedX = Math.max(ThemeTokens.dp(8), Math.min(win.width - implicitWidth - ThemeTokens.dp(8), clampedX))
            }
            var rootMapped = root.mapToItem(null, 0, 0)
            return clampedX - rootMapped.x
        }
        y: {
            if (!currentTarget) return 0
            var gap = ThemeTokens.dp(6)
            var mapped = currentTarget.mapToItem(null, 0, 0)
            var rootMapped = root.mapToItem(null, 0, 0)
            if (mapped.y - implicitHeight - gap < ThemeTokens.dp(8)) {
                return (mapped.y + currentTarget.height + gap) - rootMapped.y
            }
            return (mapped.y - implicitHeight - gap) - rootMapped.y
        }

        padding: ThemeTokens.dp(4)
        topPadding: ThemeTokens.dp(4)
        bottomPadding: ThemeTokens.dp(4)
        leftPadding: ThemeTokens.dp(8)
        rightPadding: ThemeTokens.dp(8)

        background: Rectangle {
            color: ThemeTokens.dark ? "#f8fafc" : "#020817"
            radius: ThemeTokens.dp(4)
            border.color: ThemeTokens.dark ? Qt.rgba(0, 0, 0, 0.15) : Qt.rgba(255, 255, 255, 0.15)
            border.width: 1
        }

        contentItem: Row {
            spacing: ThemeTokens.dp(6)

            Text {
                text: itemTooltipPopup.currentItem ? (itemTooltipPopup.currentItem.label || "") : ""
                color: ThemeTokens.dark ? "#020817" : "#f8fafc"
                font.pixelSize: Typography.sizeCaption
                font.weight: Font.Medium
                anchors.verticalCenter: parent.verticalCenter
            }

            ChaSetKbd {
                visible: itemTooltipPopup.currentItem && itemTooltipPopup.currentItem.keys && itemTooltipPopup.currentItem.keys.length > 0
                variant: "inverted"
                size: "xs"
                compact: "never"
                shortcut: {
                    if (!itemTooltipPopup.currentItem || !itemTooltipPopup.currentItem.keys) return ""
                    var ks = itemTooltipPopup.currentItem.keys
                    if (itemTooltipPopup.currentItem.id === "nav" || (ks.indexOf("Up") >= 0 && ks.indexOf("Down") >= 0)) {
                        return ks.join(" / ")
                    }
                    return ks.join("+")
                }
                anchors.verticalCenter: parent.verticalCenter
            }
        }
    }
}
