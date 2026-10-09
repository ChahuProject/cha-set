// ChaSetHoverPopover.qml — Cross-Stack Hover Popover / Flyout Component
// Designed for seamless hover-triggered interactive popover cards with zero leakage.
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root

    // —— Target & Anchor ——
    /** Explicit target anchor. If null, falls back to wrappedItem or parent. */
    property Item target: null
    default property alias contentData: popoverContent.data

    readonly property Item wrappedItem: (contentContainer.children.length > 0) ? contentContainer.children[0] : null
    readonly property Item effectiveTarget: target ? target : (wrappedItem ? wrappedItem : parent)

    // —— Visibility & State ——
    property bool open: false
    property int openDelay: 0
    property int closeDelay: 250
    property bool disabled: false

    /** Optional custom keep-alive predicate function. Returns true to prevent auto-hiding. */
    property var keepAlivePredicate: null

    // —— Geometry & Placement ——
    property string side: "top"         // "top" | "bottom" | "left" | "right"
    property string align: "center"     // "start" | "center" | "end"
    property int sideOffset: 8
    readonly property int effectiveSideOffset: ThemeTokens.dp(sideOffset)
    property int alignOffset: 0
    readonly property int effectiveAlignOffset: ThemeTokens.dp(alignOffset)
    property int popoverWidth: 0
    property int popoverHeight: 0

    readonly property Item contentItem: {
        var list = popoverContent.children
        for (var i = 0; i < list.length; ++i) {
            var ch = list[i]
            if (ch && ch.visible !== false) return ch
        }
        return list.length > 0 ? list[0] : null
    }

    readonly property real _inferredWidth: {
        if (contentItem && contentItem.implicitWidth > 0) return contentItem.implicitWidth
        if (popoverContent.implicitWidth > 0) return popoverContent.implicitWidth
        if (popoverContent.childrenRect.width > 0) return popoverContent.childrenRect.width
        return ThemeTokens.dp(200)
    }

    readonly property real _inferredHeight: {
        if (contentItem && contentItem.implicitHeight > 0) return contentItem.implicitHeight
        if (popoverContent.implicitHeight > 0) return popoverContent.implicitHeight
        if (popoverContent.childrenRect.height > 0) return popoverContent.childrenRect.height
        return ThemeTokens.dp(120)
    }

    readonly property int effectivePopoverWidth: root.popoverWidth > 0 ? ThemeTokens.dp(root.popoverWidth) : Math.round(_inferredWidth)
    readonly property int effectivePopoverHeight: root.popoverHeight > 0 ? ThemeTokens.dp(root.popoverHeight) : Math.round(_inferredHeight)
    property int customRadius: 8
    readonly property int effectiveRadius: ThemeTokens.dp(customRadius)

    // —— Styling ——
    property color panelColor: (typeof ThemeTokens !== "undefined" && ThemeTokens.panelRaised)
                               ? ThemeTokens.panelRaised : Qt.rgba(0.12, 0.12, 0.12, 0.96)
    property color borderColor: (typeof ThemeTokens !== "undefined" && ThemeTokens.border)
                                ? ThemeTokens.border : Qt.rgba(1, 1, 1, 0.22)

    signal opened()
    signal closed()

    function show() {
        closeTimer.stop()
        updateTargetPos()
        if (openDelay > 0 && !open) {
            openTimer.restart()
        } else {
            root.open = true
        }
    }

    function hide() {
        openTimer.stop()
        closeTimer.stop()
        root.open = false
    }

    function toggle() {
        if (root.open) hide()
        else show()
    }

    function keepAlive() {
        closeTimer.stop()
    }

    function _hasAnyHoveredChild(item) {
        if (!item) return false
        if (item.containsMouse === true || item.hovered === true) return true
        if (item.contentItem && _hasAnyHoveredChild(item.contentItem)) return true
        var ch = item.children
        if (ch) {
            for (var i = 0; i < ch.length; ++i) {
                if (_hasAnyHoveredChild(ch[i])) return true
            }
        }
        return false
    }

    function isHovered() {
        if (targetHover && targetHover.hovered) return true
        if (effectiveTarget && (effectiveTarget.containsMouse || effectiveTarget.hovered || _hasAnyHoveredChild(effectiveTarget))) return true
        if (popoverHover && popoverHover.hovered) return true
        if (popoverMouseArea && popoverMouseArea.containsMouse) return true
        if (_hasAnyHoveredChild(popoverContent)) return true
        if (bridgeHover && bridgeHover.hovered) return true
        if (bridgeMouseArea && bridgeMouseArea.containsMouse) return true
        if (keepAlivePredicate && keepAlivePredicate()) return true
        return false
    }

    property bool closeOnEscape: true

    function close(reason) {
        root.hide()
    }

    Shortcut {
        sequence: "Escape"
        autoRepeat: false
        enabled: root.open && root.closeOnEscape && ChaSetOverlayHub.isTop(root)
        onActivated: root.close("escape")
    }

    Keys.onEscapePressed: function(event) {
        if (root.closeOnEscape) {
            event.accepted = true
            root.close("escape")
        }
    }

    onOpenChanged: {
        if (open) {
            updateTargetPos()
            ChaSetOverlayHub.register(root)
            root.opened()
        } else {
            ChaSetOverlayHub.unregister(root)
            root.closed()
        }
    }

    onEffectiveTargetChanged: updateTargetPos()
    onWidthChanged: updateTargetPos()
    onHeightChanged: updateTargetPos()
    Component.onCompleted: updateTargetPos()

    // Optional container for wrapped trigger component
    Item {
        id: contentContainer
        anchors.fill: parent
    }

    // Target Hover Listener
    HoverHandler {
        id: targetHover
        parent: root.effectiveTarget ? root.effectiveTarget : root
        enabled: !root.disabled
        acceptedDevices: PointerDevice.Mouse | PointerDevice.TouchPad
        onHoveredChanged: {
            if (hovered && !root.disabled) {
                closeTimer.stop()
                root.updateTargetPos()
                if (root.openDelay <= 0) {
                    root.open = true
                } else {
                    openTimer.restart()
                }
            } else {
                openTimer.stop()
                if (root.open && !root.isHovered()) {
                    closeTimer.restart()
                }
            }
        }
    }

    Connections {
        target: root.effectiveTarget
        ignoreUnknownSignals: true
        function onXChanged() { root.updateTargetPos() }
        function onYChanged() { root.updateTargetPos() }
        function onWidthChanged() { root.updateTargetPos() }
        function onHeightChanged() { root.updateTargetPos() }
        function onContainsMouseChanged() {
            if (!root.disabled && root.effectiveTarget) {
                if (root.effectiveTarget.containsMouse) {
                    closeTimer.stop()
                    root.updateTargetPos()
                    if (root.openDelay <= 0) {
                        root.open = true
                    } else {
                        openTimer.restart()
                    }
                } else {
                    openTimer.stop()
                    if (root.open && !root.isHovered()) {
                        closeTimer.restart()
                    }
                }
            }
        }
    }

    Timer {
        id: openTimer
        interval: Math.max(0, root.openDelay)
        repeat: false
        onTriggered: {
            root.updateTargetPos()
            if (!root.disabled && root.isHovered()) {
                root.open = true
            }
        }
    }

    Timer {
        id: closeTimer
        interval: Math.max(0, root.closeDelay)
        repeat: false
        onTriggered: {
            if (root.isHovered()) return
            root.open = false
        }
    }

    // Anchor Coordinate Calculation
    property point targetPosInRoot: Qt.point(0, 0)

    function updateTargetPos() {
        if (!effectiveTarget || effectiveTarget === root) {
            targetPosInRoot = Qt.point(0, 0)
            return
        }
        try {
            targetPosInRoot = root.mapFromItem(effectiveTarget, 0, 0)
        } catch (e) {
            targetPosInRoot = Qt.point(0, 0)
        }
    }

    readonly property real targetX: targetPosInRoot.x
    readonly property real targetY: targetPosInRoot.y
    readonly property real targetW: effectiveTarget ? effectiveTarget.width : root.width
    readonly property real targetH: effectiveTarget ? effectiveTarget.height : root.height

    readonly property real calculatedX: {
        var bx = 0
        if (root.side === "left") {
            bx = targetX - root.effectivePopoverWidth - root.effectiveSideOffset
        } else if (root.side === "right") {
            bx = targetX + targetW + root.effectiveSideOffset
        } else {
            if (root.align === "start") bx = targetX
            else if (root.align === "end") bx = targetX + targetW - root.effectivePopoverWidth
            else bx = targetX + (targetW - root.effectivePopoverWidth) / 2
        }
        return bx + root.effectiveAlignOffset
    }

    readonly property real calculatedY: {
        var by = 0
        if (root.side === "top") {
            by = targetY - root.effectivePopoverHeight - root.effectiveSideOffset
        } else if (root.side === "bottom") {
            by = targetY + targetH + root.effectiveSideOffset
        } else {
            if (root.align === "start") by = targetY
            else if (root.align === "end") by = targetY + targetH - root.effectivePopoverHeight
            else by = targetY + (targetH - root.effectivePopoverHeight) / 2
        }
        return by + root.effectiveAlignOffset
    }

    // Clamped coordinates to stay inside parent/window boundary
    property Item boundaryItem: null
    readonly property Item effectiveBoundaryItem: {
        if (boundaryItem) return boundaryItem
        if (root.Window && root.Window.window && root.Window.window.contentItem) {
            return root.Window.window.contentItem
        }
        return root.parent
    }

    readonly property real clampedX: {
        var base = calculatedX
        var bItem = effectiveBoundaryItem
        if (!bItem) return base
        var margin = ThemeTokens.dp(4)
        try {
            var minX = root.mapFromItem(bItem, 0, 0).x + margin
            var maxX = root.mapFromItem(bItem, bItem.width, 0).x - root.effectivePopoverWidth - margin
            if (minX <= maxX) {
                if (base < minX) base = minX
                else if (base > maxX) base = maxX
            }
        } catch (e) {}
        return base
    }

    readonly property real clampedY: {
        var base = calculatedY
        var bItem = effectiveBoundaryItem
        if (!bItem) return base
        var margin = ThemeTokens.dp(4)
        try {
            var minY = root.mapFromItem(bItem, 0, 0).y + margin
            var maxY = root.mapFromItem(bItem, 0, bItem.height).y - root.effectivePopoverHeight - margin
            if (minY <= maxY) {
                if (base < minY) base = minY
                else if (base > maxY) base = maxY
            }
        } catch (e) {}
        return base
    }

    // Safe Corridor / Invisible Bridge between target and popover (spans gap only, does not occlude target)
    Item {
        id: safeBridge
        visible: root.open
        z: 99
        x: {
            if (root.side === "top" || root.side === "bottom") {
                return Math.min(root.targetX, popoverFrame.x)
            } else {
                return root.side === "left"
                    ? (popoverFrame.x + popoverFrame.width)
                    : (root.targetX + root.targetW)
            }
        }
        y: {
            if (root.side === "left" || root.side === "right") {
                return Math.min(root.targetY, popoverFrame.y)
            } else {
                return root.side === "top"
                    ? (popoverFrame.y + popoverFrame.height)
                    : (root.targetY + root.targetH)
            }
        }
        width: {
            if (root.side === "top" || root.side === "bottom") {
                return Math.max(root.targetX + root.targetW, popoverFrame.x + popoverFrame.width) - x
            } else {
                return root.side === "left"
                    ? Math.max(0, root.targetX - (popoverFrame.x + popoverFrame.width))
                    : Math.max(0, popoverFrame.x - (root.targetX + root.targetW))
            }
        }
        height: {
            if (root.side === "left" || root.side === "right") {
                return Math.max(root.targetY + root.targetH, popoverFrame.y + popoverFrame.height) - y
            } else {
                return root.side === "top"
                    ? Math.max(0, root.targetY - (popoverFrame.y + popoverFrame.height))
                    : Math.max(0, popoverFrame.y - (root.targetY + root.targetH))
            }
        }

        HoverHandler {
            id: bridgeHover
            acceptedDevices: PointerDevice.Mouse | PointerDevice.TouchPad
            onHoveredChanged: {
                if (hovered) {
                    closeTimer.stop()
                } else if (!root.isHovered()) {
                    closeTimer.restart()
                }
            }
        }

        MouseArea {
            id: bridgeMouseArea
            anchors.fill: parent
            hoverEnabled: true
            acceptedButtons: Qt.NoButton
            onEntered: closeTimer.stop()
            onExited: {
                if (!root.isHovered()) {
                    closeTimer.restart()
                }
            }
        }
    }

    Timer {
        id: hoverWatchdog
        interval: 120
        repeat: true
        running: root.open
        onTriggered: {
            if (!root.isHovered() && !closeTimer.running) {
                closeTimer.restart()
            }
        }
    }

    // Popover Panel Frame
    Item {
        id: popoverFrame
        z: 100
        x: Math.round(root.clampedX)
        y: Math.round(root.clampedY)
        width: root.effectivePopoverWidth
        height: root.effectivePopoverHeight
        visible: root.open || opacity > 0.001
        opacity: root.open ? 1.0 : 0.0

        Behavior on opacity {
            enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
            NumberAnimation { duration: ThemeTokens.motionShort; easing.type: ThemeTokens.easeStandard }
        }

        HoverHandler {
            id: popoverHover
            acceptedDevices: PointerDevice.Mouse | PointerDevice.TouchPad
            onHoveredChanged: {
                if (hovered) {
                    closeTimer.stop()
                } else if (!root.isHovered()) {
                    closeTimer.restart()
                }
            }
        }

        MouseArea {
            id: popoverMouseArea
            anchors.fill: parent
            hoverEnabled: true
            acceptedButtons: Qt.NoButton
            z: -1
            onEntered: closeTimer.stop()
            onExited: {
                if (!root.isHovered()) {
                    closeTimer.restart()
                }
            }
        }

        // Panel Background
        ChaSetSquircle {
            anchors.fill: parent
            radius: root.effectiveRadius
            color: root.panelColor
            border.color: root.borderColor
            border.width: 1
        }

        // Content Area
        Item {
            id: popoverContent
            anchors.fill: parent
        }
    }
}
