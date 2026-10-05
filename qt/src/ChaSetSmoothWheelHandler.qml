// ChaSetSmoothWheelHandler.qml — Cross-Stack Kinematic Wheel Physics
// Provides smooth continuous damped scrolling with Shift+wheel horizontal mapping and drag/flick mutex.
import QtQuick 6.10
import ChaSet

Item {
    id: root
    anchors.fill: parent

    /// Target scroll item (Flickable, ListView, GridView, ChaSetScrollArea, etc.)
    property var targetItem: parent

    /// Scroll direction: Qt.Vertical (default, drives contentY) or Qt.Horizontal (drives contentX)
    property int scrollOrientation: Qt.Vertical

    /// Map vertical wheel rotation to horizontal scrolling
    property bool mapVerticalToHorizontal: false

    /// Speed multiplier applied to raw wheel delta
    property real speedMultiplier: 1.2

    /// Optional fixed step size per notch (<= 0 for dynamic angleDelta)
    property real fixedStepSize: 0

    /// Intercept and consume wheel event
    property bool consumeEvent: true

    /// Animation duration in milliseconds (defaults to ThemeTokens.motionMedium, 0 when animations disabled)
    property int duration: ThemeTokens.animationsEnabled ? ThemeTokens.motionMedium : 0

    /// Easing curve
    property int easingType: Easing.OutCubic

    /// Target accumulated position
    property real targetPos: 0

    /// Whether smooth scroll animation is actively running
    readonly property bool isAnimating: smoothAnim.running

    onTargetItemChanged: {
        if (smoothAnim.running) {
            smoothAnim.stop()
        }
        syncToCurrent()
    }

    WheelHandler {
        id: wheelHandler
        parent: root.targetItem ? root.targetItem : root.parent
        target: null
        acceptedDevices: PointerDevice.Mouse | PointerDevice.TouchPad
        orientation: (root.scrollOrientation === Qt.Horizontal || root.mapVerticalToHorizontal)
                     ? (Qt.Vertical | Qt.Horizontal)
                     : Qt.Vertical

        onWheel: function(event) {
            root.handleWheel(event);
        }
    }

    NumberAnimation {
        id: smoothAnim
        target: root.targetItem
        property: (root.scrollOrientation === Qt.Vertical && !root.mapVerticalToHorizontal) ? "contentY" : "contentX"
        duration: root.duration
        easing.type: root.easingType

        onFinished: {
            root.syncToCurrent()
        }
    }

    // Interaction Mutex: when user drags the scrollbar thumb or flicks with finger,
    // abort smooth animation immediately and resync targetPos to eliminate physical drag fight.
    // Programmatic sync: while idle, any external contentY/contentX change
    // (positionViewAtIndex, direct assignment, margin change side-effect)
    // is adopted into targetPos so the next wheel event starts from the true
    // position instead of a stale target (top-at-0-but-still-scrolls jump).
    Connections {
        target: root.targetItem
        ignoreUnknownSignals: true
        function onMovingChanged() {
            if (root.targetItem && root.targetItem.moving && smoothAnim.running) {
                smoothAnim.stop()
                root.syncToCurrent()
            }
        }
        function onFlickingChanged() {
            if (root.targetItem && root.targetItem.flicking && smoothAnim.running) {
                smoothAnim.stop()
                root.syncToCurrent()
            }
        }
        function onContentYChanged() {
            if (root.targetItem && !smoothAnim.running
                    && root.isVerticalTarget()) {
                root.syncToCurrent()
            }
        }
        function onContentXChanged() {
            if (root.targetItem && !smoothAnim.running
                    && !root.isVerticalTarget()) {
                root.syncToCurrent()
            }
        }
    }

    function syncToCurrent() {
        if (!targetItem) return
        const isVert = (scrollOrientation === Qt.Vertical && !mapVerticalToHorizontal)
        targetPos = isVert ? targetItem.contentY : targetItem.contentX
    }

    function isVerticalTarget() {
        return (scrollOrientation === Qt.Vertical && !mapVerticalToHorizontal)
    }

    // Flickable 真实滚动下界：origin - margin（无 margin 时为 0）。
    // 不含此项时，带 topMargin/leftMargin 的视图滚轮最小值与原生滚动条不一致。
    function calculateMinScroll() {
        if (!targetItem) return 0
        if (isVerticalTarget()) {
            var origin = (typeof targetItem.originY === "number") ? targetItem.originY : 0
            var top = (typeof targetItem.topMargin === "number") ? targetItem.topMargin : 0
            return origin - top
        } else {
            var originX = (typeof targetItem.originX === "number") ? targetItem.originX : 0
            var left = (typeof targetItem.leftMargin === "number") ? targetItem.leftMargin : 0
            return originX - left
        }
    }

    // Flickable 真实滚动上界：origin + content - viewport + margin。
    // 旧实现漏算 topMargin/bottomMargin（及 origin），导致带 bottomMargin
    // （如文件树锚定垫高）的视图滚轮到不了底，而原生滚动条可以到底。
    function calculateMaxScroll() {
        if (!targetItem) return 0
        var min = calculateMinScroll()
        if (isVerticalTarget()) {
            var topM = (typeof targetItem.topMargin === "number") ? targetItem.topMargin : 0
            var bottomM = (typeof targetItem.bottomMargin === "number") ? targetItem.bottomMargin : 0
            var range = targetItem.contentHeight - targetItem.height + topM + bottomM
            return Math.max(min, min + Math.max(0, range))
        } else {
            var leftM = (typeof targetItem.leftMargin === "number") ? targetItem.leftMargin : 0
            var rightM = (typeof targetItem.rightMargin === "number") ? targetItem.rightMargin : 0
            var rangeH = targetItem.contentWidth - targetItem.width + leftM + rightM
            return Math.max(min, min + Math.max(0, rangeH))
        }
    }

    function currentPos() {
        if (!targetItem) return 0
        return isVerticalTarget() ? targetItem.contentY : targetItem.contentX
    }

    function scrollBy(deltaAmount) {
        if (!targetItem) return
        const minScroll = calculateMinScroll()
        const maxScroll = calculateMaxScroll()
        const cur = currentPos()

        let base = cur
        if (smoothAnim.running) {
            if (Math.abs(targetPos - cur) <= Math.max(targetItem.width, targetItem.height) * 2) {
                base = targetPos
            }
            // 在途目标若因外部布局变化（展开/折叠、margin 变化）已越界，
            // 先收敛回合法区间再累加，避免顶部到顶仍能滚动/底部空一截。
            base = Math.max(minScroll, Math.min(maxScroll, base))
        }

        const nextTarget = Math.max(minScroll, Math.min(maxScroll, base + deltaAmount))
        targetPos = nextTarget

        const dur = root.duration
        if (dur > 0 && Math.abs(nextTarget - cur) > 0.5) {
            smoothAnim.stop()
            smoothAnim.from = cur
            smoothAnim.to = nextTarget
            smoothAnim.duration = dur
            smoothAnim.start()
        } else {
            smoothAnim.stop()
            if (isVerticalTarget()) {
                targetItem.contentY = nextTarget
            } else {
                targetItem.contentX = nextTarget
            }
        }
    }

    function scrollTo(absolutePos) {
        if (!targetItem) return
        const minScroll = calculateMinScroll()
        const maxScroll = calculateMaxScroll()
        const cur = currentPos()
        const nextTarget = Math.max(minScroll, Math.min(maxScroll, absolutePos))
        targetPos = nextTarget

        const dur = root.duration
        if (dur > 0 && Math.abs(nextTarget - cur) > 0.5) {
            smoothAnim.stop()
            smoothAnim.from = cur
            smoothAnim.to = nextTarget
            smoothAnim.duration = dur
            smoothAnim.start()
        } else {
            smoothAnim.stop()
            if (isVerticalTarget()) {
                targetItem.contentY = nextTarget
            } else {
                targetItem.contentX = nextTarget
            }
        }
    }

    function handleWheel(event) {
        if (event.modifiers & (Qt.ControlModifier | Qt.MetaModifier)) return
        if (!targetItem) return

        const dy = event.angleDelta.y
        const dx = event.angleDelta.x
        let delta = 0

        if (mapVerticalToHorizontal) {
            delta = Math.abs(dx) > Math.abs(dy) ? dx : dy
        } else if (scrollOrientation === Qt.Horizontal) {
            delta = dx !== 0 ? dx : dy
        } else {
            delta = dy
        }

        if (delta === 0) return

        const step = (fixedStepSize > 0)
            ? (delta > 0 ? -fixedStepSize : fixedStepSize)
            : (-delta * speedMultiplier)

        scrollBy(step)

        if (consumeEvent) {
            event.accepted = true
        }
    }
}
