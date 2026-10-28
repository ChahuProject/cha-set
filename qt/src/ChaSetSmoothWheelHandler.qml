// ChaSetSmoothWheelHandler.qml — Cross-Stack Kinematic Wheel Physics
// Provides smooth continuous damped scrolling with Shift+wheel horizontal mapping and drag/flick mutex.
import QtQuick
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

    /// Easing curve (preserved for API compatibility)
    property int easingType: Easing.OutCubic

    /// Target accumulated position
    property real targetPos: 0

    /// Current kinematic velocity
    property real velocity: 0

    /// Whether smooth scroll animation is actively running
    readonly property bool isAnimating: frameAnim.running

    /// Kinetic friction coefficient derived from duration (0.70 ~ 0.94)
    readonly property real friction: {
        const d = root.duration
        if (d <= 50) return 0.70
        if (d >= 500) return 0.94
        return Math.max(0.70, Math.min(0.94, 1.0 - (24.0 / Math.max(80, d))))
    }

    onTargetItemChanged: {
        stopKineticAnimation()
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

    FrameAnimation {
        id: frameAnim
        running: false

        onTriggered: {
            if (!root.targetItem) {
                frameAnim.stop()
                root.velocity = 0
                return
            }

            const dt = frameTime > 0 ? (frameTime * 1000.0) : 16.6667
            const clampedDt = Math.max(1.0, Math.min(50.0, dt))
            const frameFactor = clampedDt / 16.6667
            const effectiveFriction = Math.pow(root.friction, frameFactor)

            const deltaMove = root.velocity * frameFactor
            const cur = root.currentPos()
            const minS = root.calculateMinScroll()
            const maxS = root.calculateMaxScroll()
            const next = cur + deltaMove

            // 边界吸附与碰撞检测
            if (next <= minS) {
                root.setPos(minS)
                root.velocity = 0
                root.targetPos = minS
                frameAnim.stop()
                root.syncToCurrent()
                return
            }
            if (next >= maxS) {
                root.setPos(maxS)
                root.velocity = 0
                root.targetPos = maxS
                frameAnim.stop()
                root.syncToCurrent()
                return
            }

            // 推进连续位移并衰减速度
            root.setPos(next)
            root.velocity *= effectiveFriction

            // 速度临界值吸附：当动量衰减殆尽或距终点不足半像素时干净停靠
            if (Math.abs(root.velocity) < 0.15 || Math.abs(root.targetPos - next) < 0.4) {
                root.setPos(root.targetPos)
                root.velocity = 0
                frameAnim.stop()
                root.syncToCurrent()
            }
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
            if (root.targetItem && root.targetItem.moving && frameAnim.running) {
                root.stopKineticAnimation()
            }
        }
        function onFlickingChanged() {
            if (root.targetItem && root.targetItem.flicking && frameAnim.running) {
                root.stopKineticAnimation()
            }
        }
        function onContentYChanged() {
            if (root.targetItem && !frameAnim.running
                    && root.isVerticalTarget()) {
                root.syncToCurrent()
            }
        }
        function onContentXChanged() {
            if (root.targetItem && !frameAnim.running
                    && !root.isVerticalTarget()) {
                root.syncToCurrent()
            }
        }
    }

    function stopKineticAnimation() {
        if (frameAnim.running) {
            frameAnim.stop()
        }
        velocity = 0
        syncToCurrent()
    }

    function syncToCurrent() {
        if (!targetItem) return
        const isVert = (scrollOrientation === Qt.Vertical && !mapVerticalToHorizontal)
        var pos = isVert ? targetItem.contentY : targetItem.contentX
        if (typeof pos === "number") {
            targetPos = pos
        }
    }

    function isVerticalTarget() {
        return (scrollOrientation === Qt.Vertical && !mapVerticalToHorizontal)
    }

    function setPos(val) {
        if (!targetItem) return
        if (isVerticalTarget()) {
            targetItem.contentY = val
        } else {
            targetItem.contentX = val
        }
    }

    // Flickable 真实滚动下界：origin - margin（无 margin 时为 0）。
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

        if (root.duration <= 0) {
            stopKineticAnimation()
            const cur = currentPos()
            const nextTarget = Math.max(minScroll, Math.min(maxScroll, cur + deltaAmount))
            setPos(nextTarget)
            syncToCurrent()
            return
        }

        if (!frameAnim.running) {
            syncToCurrent()
        }

        const baseTarget = frameAnim.running ? targetPos : currentPos()
        const nextTarget = Math.max(minScroll, Math.min(maxScroll, baseTarget + deltaAmount))
        const effectiveStep = nextTarget - baseTarget
        targetPos = nextTarget

        if (Math.abs(effectiveStep) > 0.01) {
            const f = root.friction
            const impulse = effectiveStep * ((1.0 - f) / f)
            const targetDim = isVerticalTarget() ? targetItem.height : targetItem.width
            const maxV = Math.max(120.0, targetDim * 1.5)

            // 同向冲量线性累加，反向冲量直接重构初速度消除迟滞
            if ((velocity >= 0 && impulse >= 0) || (velocity <= 0 && impulse <= 0)) {
                velocity = Math.max(-maxV, Math.min(maxV, velocity + impulse))
            } else {
                velocity = Math.max(-maxV, Math.min(maxV, impulse))
            }

            if (!frameAnim.running) {
                frameAnim.start()
            }
        }
    }

    function scrollTo(absolutePos) {
        if (!targetItem) return
        const minScroll = calculateMinScroll()
        const maxScroll = calculateMaxScroll()

        if (root.duration <= 0) {
            stopKineticAnimation()
            const nextTarget = Math.max(minScroll, Math.min(maxScroll, absolutePos))
            setPos(nextTarget)
            syncToCurrent()
            return
        }

        if (!frameAnim.running) {
            syncToCurrent()
        }

        const cur = currentPos()
        const nextTarget = Math.max(minScroll, Math.min(maxScroll, absolutePos))
        const step = nextTarget - cur
        targetPos = nextTarget

        if (Math.abs(step) > 0.5) {
            const f = root.friction
            const impulse = step * ((1.0 - f) / f)
            velocity = impulse
            if (!frameAnim.running) {
                frameAnim.start()
            }
        } else {
            setPos(nextTarget)
            stopKineticAnimation()
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
