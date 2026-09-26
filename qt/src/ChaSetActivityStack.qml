// ChaSetActivityStack.qml — internal floating host for activity cards.
//
// Mirrors packages/react/src/activity-stack/ActivityStack.tsx: it owns the mechanics
// that the Task HUD and the Notification Stack would otherwise each re-implement —
// anchoring across the eight placements, newest-nearest-the-anchor ordering, the
// overflow pill, expansion into a scrollable list, collapse into a summary row,
// hover reporting and keyboard traversal.
//
// It is NOT a spec component. Entries are read as "tail is newest".
import QtQuick 6.10
import ChaSet

Item {
    id: root

    // ---- Inputs -----------------------------------------------------------
    /**
     * Entry descriptors, oldest first. One flat object per card:
     * `{ id, tone, statusKey, iconName, title, detail, meta, progress,
     *    indeterminate, dismissible, dismissLabel, actions }`.
     */
    property var entries: []
    /** Viewport anchor. */
    property string placement: "bottom-right"
    /** Inset from the anchored edges, in logical units. */
    property int offset: 16
    /** Cards rendered before the stack overflows into its "show all" pill. */
    property int maxVisible: 3
    /** Offers the collapse-to-summary-row control. */
    property bool collapsible: true
    /** Renders collapsed on first paint. */
    property bool defaultCollapsed: false
    /** Accessible name of the region. */
    property string label: ""
    /** Noun appended to the collapsed count, e.g. `进行中` renders `3 项进行中`. */
    property string summaryLabel: ""
    /**
     * Anchor rectangle. Defaults to the parent item, so a sandbox can host the
     * stack inside a dashed box while a real host points it at `Overlay.overlay`.
     */
    property Item anchorItem: null

    // ---- Outputs ----------------------------------------------------------
    signal dismissed(string id)
    signal actionTriggered(string id, string actionId)
    /** Notified when the pointer enters or leaves the stack, so hosts can pause timers. */
    signal hoverChanged(bool hovered)

    // ---- State ------------------------------------------------------------
    property bool collapsed: root.collapsible && root.defaultCollapsed
    property bool expanded: false

    property var _live: []      // [{ id, obj }] in display order
    property var _ghosts: []    // [{ id, obj, slot }] kept alive for one exit animation
    property var _display: []   // live cards with ghosts spliced into their old slot
    property var _summaryBadges: []
    property int _focusIndex: -1
    property real _wellContentHeight: 1

    readonly property color amber: "#f59e0b"

    readonly property bool isTop: root.placement.indexOf("top") === 0
    /** Side-anchored stacks pin the left/right inset and centre vertically. */
    readonly property bool isHorizontal: root.placement.indexOf("left") === 0
        || root.placement.indexOf("right") === 0
    readonly property int gap: ThemeTokens.dp(10)
    readonly property int stripPad: root.expanded ? ThemeTokens.dp(10) : 0
    readonly property int cap: Math.max(1, Math.floor(root.maxVisible))
    /**
     * Unit vector pointing away from the anchored edge. Cards enter from there and
     * retreat back to it, so the travel always reads as "out of the edge".
     */
    readonly property real slideX: root.isHorizontal
        ? (root.placement.indexOf("left") === 0 ? -1 : 1)
        : 0
    readonly property real slideY: root.isHorizontal ? 0 : (root.isTop ? -1 : 1)

    readonly property Item anchor: root.anchorItem ? root.anchorItem : root.parent

    readonly property int cardWidth: {
        var anchorW = root.anchor ? root.anchor.width : 0
        var preferred = (anchorW > ThemeTokens.dp(32)) ? anchorW - ThemeTokens.dp(32) : ThemeTokens.dp(352)
        return Math.max(ThemeTokens.dp(240), Math.min(ThemeTokens.dp(352), preferred))
    }

    readonly property real maxWellHeight: {
        var anchorH = root.anchor ? root.anchor.height : 0
        var ceiling = anchorH > 0 ? anchorH * 0.6 : ThemeTokens.dp(512)
        return Math.max(ThemeTokens.dp(120), Math.min(ThemeTokens.dp(512), ceiling))
    }

    // Tail of the array is newest: bottom anchors render as-is (newest last, i.e.
    // nearest the bottom edge), top anchors reverse so newest sits nearest the top.
    readonly property var orderedAll: {
        var list = root.entries ? Array.prototype.slice.call(root.entries) : []
        if (root.isTop) list.reverse()
        return list
    }

    readonly property var orderedVisible: root.expanded
        ? root.orderedAll
        : root.orderedAll.slice(-root.cap)

    readonly property int hiddenCount: root.orderedAll.length - root.orderedVisible.length
    readonly property bool hasContent: root._display.length > 0 || root.collapsed

    readonly property string alignMode: {
        var p = root.placement
        if (p === "top-left" || p === "bottom-left" || p === "left-center") return "left"
        if (p === "top-right" || p === "bottom-right" || p === "right-center") return "right"
        return "center"
    }

    implicitWidth: root.cardWidth
    implicitHeight: frame.implicitHeight
    width: implicitWidth
    height: implicitHeight

    x: root.anchorX()
    y: root.anchorY()

    opacity: root.hasContent ? 1 : 0
    visible: opacity > 0.01
    activeFocusOnTab: true

    Behavior on opacity {
        enabled: ThemeTokens.animationsEnabled
        NumberAnimation { duration: ThemeTokens.motionMedium; easing.type: ThemeTokens.easeStandard }
    }

    onActiveFocusChanged: {
        if (!root.activeFocus) {
            root._focusIndex = -1
            root._applyFocus()
        }
    }

    onEntriesChanged: root.rebuild()
    onExpandedChanged: root.rebuild()
    onCollapsedChanged: root.rebuild()
    onMaxVisibleChanged: root.rebuild()
    onPlacementChanged: root.rebuild()
    onWidthChanged: {
        root.layout()
        Qt.callLater(root.layout)
    }

    Component.onCompleted: root.rebuild()

    // ---- Placement --------------------------------------------------------

    function anchorX() {
        var anchorW = root.anchor ? root.anchor.width : 0
        if (anchorW <= 0) return 0
        if (root.alignMode === "left") return ThemeTokens.dp(root.offset)
        if (root.alignMode === "right") return anchorW - ThemeTokens.dp(root.offset) - root.width
        return (anchorW - root.width) / 2
    }

    function anchorY() {
        var anchorH = root.anchor ? root.anchor.height : 0
        if (anchorH <= 0) return 0
        if (root.isTop) return ThemeTokens.dp(root.offset)
        if (root.placement.indexOf("bottom") === 0) return anchorH - ThemeTokens.dp(root.offset) - root.height
        return (anchorH - root.height) / 2
    }

    function alignOffset(childWidth) {
        if (root.alignMode === "left") return 0
        if (root.alignMode === "right") return root.width - childWidth
        return (root.width - childWidth) / 2
    }

    function badgeColorFor(tone) {
        if (tone === "warning") return root.amber
        if (tone === "danger") return ThemeTokens.danger
        if (tone === "success") return ThemeTokens.accent
        return ThemeTokens.subduedText
    }

    // ---- Card lifecycle ---------------------------------------------------

    function findLive(id) {
        for (var i = 0; i < root._live.length; i++) {
            if (String(root._live[i].id) === String(id)) return root._live[i].obj
        }
        return null
    }

    function applyEntry(card, entry) {
        card.itemId = entry.id !== undefined ? String(entry.id) : ""
        card.tone = entry.tone !== undefined ? String(entry.tone) : "neutral"
        card.statusKey = entry.statusKey !== undefined ? String(entry.statusKey) : "queued"
        card.iconName = entry.iconName !== undefined ? String(entry.iconName) : ""
        card.title = entry.title !== undefined ? String(entry.title) : ""
        card.detail = entry.detail !== undefined ? String(entry.detail) : ""
        card.meta = entry.meta !== undefined ? String(entry.meta) : ""
        card.progress = (typeof entry.progress === "number") ? entry.progress : -1
        card.indeterminate = Boolean(entry.indeterminate)
        card.dismissible = Boolean(entry.dismissible)
        card.dismissLabel = entry.dismissLabel !== undefined ? String(entry.dismissLabel) : ""
        card.actions = entry.actions ? entry.actions : []
    }

    function createCard(entry) {
        var card = cardComp.createObject(cardsHost, {
            revealed: false,
            slideOffset: root.slideY * ThemeTokens.dp(10),
            slideOffsetX: root.slideX * ThemeTokens.dp(10),
            width: root.cardWidth
        })
        if (!card) return null
        root.applyEntry(card, entry)
        card.dismissRequested.connect(function () {
            root.dismissed(card.itemId)
        })
        card.actionTriggered.connect(function (actionId) {
            root.actionTriggered(card.itemId, actionId)
        })
        Qt.callLater(function () {
            try {
                card.revealed = true
                card.slideOffset = 0
                card.slideOffsetX = 0
            } catch (err) {
                // Card was retired before it finished entering.
            }
        })
        return card
    }

    function retireCard(card, slot) {
        var ghost = { id: card.id, obj: card.obj, slot: slot }
        root._ghosts.push(ghost)
        ghost.obj.revealed = false
        ghost.obj.enabled = false
        ghost.obj.focused = false
        ghost.obj.slideOffset = root.slideY * ThemeTokens.dp(10)
        ghost.obj.slideOffsetX = root.slideX * ThemeTokens.dp(10)
        ghostTimerComp.createObject(root, { ghost: ghost })
    }

    function composeDisplay() {
        var display = root._live.slice()
        for (var g = 0; g < root._ghosts.length; g++) {
            var ghost = root._ghosts[g]
            display.splice(Math.max(0, Math.min(display.length, ghost.slot)), 0, {
                id: ghost.id,
                obj: ghost.obj,
                ghost: true
            })
        }
        root._display = display
    }

    function rebuild() {
        var visible = root.orderedVisible || []
        var ids = []
        for (var i = 0; i < visible.length; i++) ids.push(String(visible[i].id))

        // 1. Anything that left the visible window becomes an exit ghost.
        for (var k = root._live.length - 1; k >= 0; k--) {
            if (ids.indexOf(String(root._live[k].id)) < 0) {
                root.retireCard(root._live.splice(k, 1)[0], k)
            }
        }

        // 2. Create what is new, refresh what is already mounted.
        var next = []
        for (var j = 0; j < visible.length; j++) {
            var entry = visible[j]
            var id = String(entry.id)
            var card = root.findLive(id)
            if (!card) card = root.createCard(entry)
            else root.applyEntry(card, entry)
            next.push({ id: id, obj: card })
        }
        root._live = next
        root.composeDisplay()

        // 3. Up to five tiny glyphs echoed in the collapsed summary row.
        var all = root.orderedAll || []
        root._summaryBadges = all.slice(Math.max(0, all.length - 5))

        // 4. Focus bookkeeping.
        if (root._focusIndex >= next.length) root._focusIndex = next.length - 1
        root._applyFocus()

        root.layout()
        Qt.callLater(root.layout)
    }

    function layout() {
        var pad = root.stripPad
        var y = pad
        for (var i = 0; i < root._display.length; i++) {
            var item = root._display[i]
            if (!item || !item.obj) continue
            if (item.obj.width !== root.cardWidth) item.obj.width = root.cardWidth
            if (item.obj.y !== y) item.obj.y = y
            y += item.obj.height + root.gap
        }
        root._wellContentHeight = Math.max(1, y - root.gap) + pad
    }

    // ---- Focus & activation ----------------------------------------------

    function _applyFocus() {
        for (var i = 0; i < root._live.length; i++) {
            root._live[i].obj.focused = (i === root._focusIndex)
        }
    }

    function moveFocus(direction) {
        var count = root._live.length
        if (count === 0) return
        if (direction === "first") root._focusIndex = 0
        else if (direction === "last") root._focusIndex = count - 1
        else if (direction === 1) root._focusIndex = root._focusIndex < 0 ? 0 : Math.min(count - 1, root._focusIndex + 1)
        else root._focusIndex = root._focusIndex < 0 ? count - 1 : Math.max(0, root._focusIndex - 1)
        root._applyFocus()
    }

    function activateFocused() {
        if (root._focusIndex < 0 || root._focusIndex >= root._live.length) return
        var entry = root._live[root._focusIndex]
        var card = entry.obj
        if (card.actions && card.actions.length > 0) root.actionTriggered(entry.id, card.actions[0].id)
        else if (card.dismissible) root.dismissed(entry.id)
    }

    Keys.onPressed: function (event) {
        if (event.key === Qt.Key_Escape) {
            // Peel one layer at a time: expanded -> capped -> collapsed.
            if (root.expanded) root.expanded = false
            else if (root.collapsible && !root.collapsed) root.collapsed = true
            else return
            event.accepted = true
            return
        }
        if (event.key === Qt.Key_Down) {
            root.moveFocus(1)
            event.accepted = true
        } else if (event.key === Qt.Key_Up) {
            root.moveFocus(-1)
            event.accepted = true
        } else if (event.key === Qt.Key_Home) {
            root.moveFocus("first")
            event.accepted = true
        } else if (event.key === Qt.Key_End) {
            root.moveFocus("last")
            event.accepted = true
        } else if (event.key === Qt.Key_Return || event.key === Qt.Key_Enter || event.key === Qt.Key_Space) {
            root.activateFocused()
            event.accepted = true
        }
    }

    HoverHandler {
        id: stackHover
        onHoveredChanged: root.hoverChanged(stackHover.hovered)
    }

    // ---- Visual tree ------------------------------------------------------

    Item {
        id: frame
        x: 0
        y: 0
        width: root.width

        readonly property bool pillVisible: !root.collapsed && !root.expanded && root.hiddenCount > 0
        readonly property real pillExtent: pill.visible ? pill.height + root.gap : 0
        readonly property real topInset: (frame.pillVisible && !root.isTop) ? frame.pillExtent : 0
        readonly property real bottomInset: (frame.pillVisible && root.isTop) ? frame.pillExtent : 0

        implicitHeight: root.collapsed
            ? summaryRow.height
            : frame.topInset + well.height + frame.bottomInset

        // Collapsed summary row: up to five glyphs, the count, a chevron away from the anchor.
        Rectangle {
            id: summaryRow
            y: 0
            width: frame.width
            height: ThemeTokens.dp(32)
            visible: root.collapsed
            radius: height / 2
            color: Qt.rgba(ThemeTokens.panel.r, ThemeTokens.panel.g, ThemeTokens.panel.b, 0.95)
            border.width: 1
            border.color: Qt.rgba(ThemeTokens.border.r, ThemeTokens.border.g, ThemeTokens.border.b, 0.6)
            opacity: root.collapsed ? 1 : 0

            Behavior on opacity {
                enabled: ThemeTokens.animationsEnabled
                NumberAnimation { duration: ThemeTokens.motionMedium; easing.type: ThemeTokens.easeStandard }
            }

            Item {
                id: summaryContent
                anchors.fill: parent
                anchors.leftMargin: ThemeTokens.dp(12)
                anchors.rightMargin: ThemeTokens.dp(12)

                Row {
                    id: badgeRow
                    anchors.left: parent.left
                    anchors.verticalCenter: parent.verticalCenter
                    spacing: ThemeTokens.dp(4)

                    Repeater {
                        model: root._summaryBadges

                        delegate: Item {
                            required property var modelData
                            width: ThemeTokens.dp(14)
                            height: ThemeTokens.dp(14)

                            ChaSetStatusIcon {
                                visible: !!modelData && (modelData.iconName === undefined || modelData.iconName === "")
                                anchors.centerIn: parent
                                size: 12
                                status: (modelData && modelData.statusKey) ? modelData.statusKey : "queued"
                                overrideColor: root.badgeColorFor(modelData && modelData.tone ? modelData.tone : "neutral")
                            }

                            ChaSetIcon {
                                visible: !!modelData && modelData.iconName !== undefined && modelData.iconName !== ""
                                anchors.centerIn: parent
                                name: (modelData && modelData.iconName) ? modelData.iconName : ""
                                size: 12
                                color: root.badgeColorFor(modelData && modelData.tone ? modelData.tone : "neutral")
                            }

                            Rectangle {
                                visible: !modelData
                                anchors.centerIn: parent
                                width: ThemeTokens.dp(6)
                                height: width
                                radius: width / 2
                                color: Qt.rgba(ThemeTokens.subduedText.r, ThemeTokens.subduedText.g, ThemeTokens.subduedText.b, 0.7)
                            }
                        }
                    }
                }

                Text {
                    id: summaryText
                    anchors.left: badgeRow.right
                    anchors.leftMargin: ThemeTokens.dp(8)
                    anchors.right: summaryChevron.left
                    anchors.rightMargin: ThemeTokens.dp(4)
                    anchors.verticalCenter: parent.verticalCenter
                    text: root.orderedAll.length + " 项" + root.summaryLabel
                    color: ThemeTokens.text
                    font.pixelSize: Typography.sizeSmall
                    font.weight: Typography.weightMedium
                    font.family: Typography.familySans
                    elide: Text.ElideRight
                    maximumLineCount: 1
                }

                ChaSetIcon {
                    id: summaryChevron
                    anchors.right: parent.right
                    anchors.verticalCenter: parent.verticalCenter
                    name: root.isTop ? "chevron-down" : "chevron-up"
                    size: 14
                    color: ThemeTokens.subduedText
                }
            }

            Accessible.role: Accessible.Button
            Accessible.name: root.label !== "" ? root.label : "Activity stack"

            HoverHandler {
                cursorShape: Qt.PointingHandCursor
            }

            TapHandler {
                onTapped: root.collapsed = false
            }
        }

        // The card well: a ChaSetScrollArea so the expanded list scrolls with the
        // native WheelHandler and the collapsed list sizes exactly to its content.
        ChaSetScrollArea {
            id: well
            y: frame.topInset
            width: frame.width
            visible: !root.collapsed
            showVerticalScrollBar: root.expanded
            showHorizontalScrollBar: false
            height: root.expanded ? Math.min(root._wellContentHeight, root.maxWellHeight) : root._wellContentHeight

            Item {
                id: cardsHost
                width: root.cardWidth
                height: root._wellContentHeight
            }
        }

        // Overflow pill, placed at the end furthest from the anchor.
        Rectangle {
            id: pill
            visible: frame.pillVisible
            x: root.alignOffset(pill.width)
            y: root.isTop ? (frame.topInset + well.height + root.gap) : 0
            width: pillText.implicitWidth + ThemeTokens.dp(4) + ThemeTokens.dp(12) + ThemeTokens.dp(24)
            height: ThemeTokens.dp(24)
            radius: height / 2
            color: Qt.rgba(ThemeTokens.panelRaised.r, ThemeTokens.panelRaised.g, ThemeTokens.panelRaised.b, 0.9)
            border.width: 1
            border.color: Qt.rgba(ThemeTokens.border.r, ThemeTokens.border.g, ThemeTokens.border.b, 0.6)

            Item {
                anchors.fill: parent
                anchors.leftMargin: ThemeTokens.dp(12)
                anchors.rightMargin: ThemeTokens.dp(12)

                Text {
                    id: pillText
                    anchors.left: parent.left
                    anchors.verticalCenter: parent.verticalCenter
                    text: "还有 " + root.hiddenCount + " 项"
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeSmall
                    font.weight: Typography.weightMedium
                    font.family: Typography.familySans
                }

                ChaSetIcon {
                    anchors.left: pillText.right
                    anchors.leftMargin: ThemeTokens.dp(4)
                    anchors.verticalCenter: parent.verticalCenter
                    name: root.isTop ? "chevron-down" : "chevron-up"
                    size: 12
                    color: ThemeTokens.subduedText
                }
            }

            Accessible.role: Accessible.Button
            Accessible.name: pillText.text

            HoverHandler {
                cursorShape: Qt.PointingHandCursor
            }

            TapHandler {
                onTapped: root.expanded = true
            }
        }
    }

    // ---- Factories --------------------------------------------------------

    Component {
        id: cardComp

        ChaSetActivityCard {
        }
    }

    Component {
        id: ghostTimerComp

        Timer {
            id: ghostTimer
            property var ghost
            running: true
            repeat: false
            interval: ThemeTokens.animationsEnabled ? ThemeTokens.motionDuration(180) : 1

            onTriggered: {
                var target = ghostTimer.ghost
                if (target) {
                    var index = root._ghosts.indexOf(target)
                    if (index >= 0) root._ghosts.splice(index, 1)
                    root._ghosts = root._ghosts.slice()
                    if (target.obj) {
                        try {
                            target.obj.destroy()
                        } catch (err) {
                            // Already torn down.
                        }
                    }
                }
                root.composeDisplay()
                root.layout()
                ghostTimer.destroy()
            }
        }
    }
}
