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

    // Responsive width and compact calculations
    readonly property real availableWidth: Math.max(0, root.width - ThemeTokens.dp(16))

    function estimateItemWidth(item, isComp) {
        var numKeys = (item.keys && item.keys.length) ? item.keys.length : 1
        var keysW = 0
        for (var k = 0; k < numKeys; ++k) {
            var keyStr = String(item.keys[k] || "")
            var kw = isComp ? ThemeTokens.dp(16) : Math.max(ThemeTokens.dp(16), keyStr.length * ThemeTokens.dp(7) + ThemeTokens.dp(6))
            keysW += kw + (k > 0 ? ThemeTokens.dp(3) : 0)
        }
        var labelStr = (isComp && item.shortLabel) ? item.shortLabel : (item.label || "")
        var labelW = labelStr.length * ThemeTokens.dp(11)
        return keysW + ThemeTokens.dp(4) + labelW
    }

    readonly property bool isCompact: {
        if (root.forceCompact || root.compact === "always") return true
        if (root.compact === "never") return false
        var totalW = 0
        var gap = ThemeTokens.dp(10)
        for (var i = 0; i < effectiveItems.length; ++i) {
            totalW += estimateItemWidth(effectiveItems[i], false) + (i > 0 ? gap : 0)
        }
        return totalW > availableWidth
    }

    readonly property var partitionedItems: {
        if (effectiveItems.length === 0) return { "visible": [], "overflow": [] }
        if (root.maxVisibleItems >= 0) {
            return {
                "visible": effectiveItems.slice(0, root.maxVisibleItems),
                "overflow": effectiveItems.slice(root.maxVisibleItems)
            }
        }

        var badgeW = ThemeTokens.dp(28)
        var gap = ThemeTokens.dp(10)
        var isComp = root.isCompact
        var avail = availableWidth - (root.showOverflowCount ? (badgeW + gap) : 0)

        var totalW = 0
        var itemWidths = []
        for (var i = 0; i < effectiveItems.length; ++i) {
            var w = estimateItemWidth(effectiveItems[i], isComp)
            itemWidths.push(w)
            totalW += w + (i > 0 ? gap : 0)
        }

        if (totalW <= availableWidth) {
            return { "visible": effectiveItems, "overflow": [] }
        }

        // Rank by priority ascending (1 = highest priority kept)
        var indexed = []
        for (var j = 0; j < effectiveItems.length; ++j) {
            indexed.push({
                "item": effectiveItems[j],
                "index": j,
                "priority": effectiveItems[j].priority || 1,
                "width": itemWidths[j]
            })
        }
        indexed.sort((a, b) => a.priority - b.priority)

        var accW = 0
        var acceptedIndices = {}
        for (var k = 0; k < indexed.length; ++k) {
            var needed = indexed[k].width + (Object.keys(acceptedIndices).length > 0 ? gap : 0)
            if (accW + needed <= avail) {
                accW += needed
                acceptedIndices[indexed[k].index] = true
            } else if (Object.keys(acceptedIndices).length === 0 && availableWidth > ThemeTokens.dp(60)) {
                accW += indexed[k].width
                acceptedIndices[indexed[k].index] = true
            }
        }

        var vis = []
        var ov = []
        for (var m = 0; m < effectiveItems.length; ++m) {
            if (acceptedIndices[m]) {
                vis.push(effectiveItems[m])
            } else {
                ov.push(effectiveItems[m])
            }
        }
        return { "visible": vis.length > 0 ? vis : effectiveItems.slice(0, 1), "overflow": vis.length > 0 ? ov : effectiveItems.slice(1) }
    }

    readonly property var visibleItems: partitionedItems.visible
    readonly property var overflowItems: partitionedItems.overflow

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
    clip: true

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
        spacing: ThemeTokens.dp(10)

        Repeater {
            model: root.visibleItems
            delegate: Row {
                id: itemDelegate
                required property var modelData
                required property int index
                spacing: ThemeTokens.dp(4)
                anchors.verticalCenter: parent ? parent.verticalCenter : undefined

                Repeater {
                    model: itemDelegate.modelData.keys || []
                    delegate: ChaSetKbd {
                        required property var modelData
                        size: root.size
                        variant: root.variant
                        compact: root.isCompact ? "always" : "never"
                        text: modelData
                        height: ThemeTokens.dp(16)
                        anchors.verticalCenter: parent ? parent.verticalCenter : undefined
                    }
                }

                Text {
                    text: (root.isCompact && itemDelegate.modelData.shortLabel) ? itemDelegate.modelData.shortLabel : (itemDelegate.modelData.label || "")
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeCaption
                    verticalAlignment: Text.AlignVCenter
                    anchors.verticalCenter: parent ? parent.verticalCenter : undefined
                }
            }
        }

        // Overflow '+N' badge with tooltip
        ChaSetTooltip {
            visible: root.showOverflowCount && root.overflowItems && root.overflowItems.length > 0
            text: root.overflowTooltipText
            side: "top"
            anchors.verticalCenter: parent ? parent.verticalCenter : undefined


            ChaSetBadge {
                id: overflowBadge
                size: "sm"
                variant: "outline"
                text: root.overflowBadgeText
                height: ThemeTokens.dp(16)
                anchors.verticalCenter: parent.verticalCenter


                HoverHandler {
                    cursorShape: Qt.PointingHandCursor
                }
            }
        }
    }
}
