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

    /// Optional fixed pixel step size per notch (<= 0 for dynamic angleDelta)
    property real fixedStepSize: 0

    /// Intercept and consume wheel event
    property bool consumeEvent: true

    /// Animation duration in milliseconds
    property int duration: 200

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
        parent: root.parent
        target: null
        acceptedDevices: PointerDevice.Mouse | PointerDevice.TouchPad
        orientation: (root.scrollOrientation === Qt.Horizontal || root.mapVerticalToHorizontal)
                     ? (Qt.Vertical | Qt.Horizontal)
                     : Qt.Vertical

        onWheel: (event) => {
            root.handleWheel(event)
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
    }

    function syncToCurrent() {
        if (!targetItem) return
        const isVert = (scrollOrientation === Qt.Vertical && !mapVerticalToHorizontal)
        targetPos = isVert ? targetItem.contentY : targetItem.contentX
    }

    function isVerticalTarget() {
        return (scrollOrientation === Qt.Vertical && !mapVerticalToHorizontal)
    }

    function calculateMaxScroll() {
        if (!targetItem) return 0
        if (isVerticalTarget()) {
            return Math.max(0, targetItem.contentHeight - targetItem.height)
        } else {
            return Math.max(0, targetItem.contentWidth - targetItem.width)
        }
    }

    function currentPos() {
        if (!targetItem) return 0
        return isVerticalTarget() ? targetItem.contentY : targetItem.contentX
    }

    function scrollBy(deltaPixels) {
        if (!targetItem) return
        const maxScroll = calculateMaxScroll()
        const cur = currentPos()

        let base = cur
        if (smoothAnim.running) {
            if (Math.abs(targetPos - cur) <= Math.max(targetItem.width, targetItem.height) * 2) {
                base = targetPos
            }
        }

        const nextTarget = Math.max(0, Math.min(maxScroll, base + deltaPixels))
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
        const maxScroll = calculateMaxScroll()
        const cur = currentPos()
        const nextTarget = Math.max(0, Math.min(maxScroll, absolutePos))
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
