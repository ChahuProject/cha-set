// ChaSet ScrollArea for Qt (QML)
// Native Flickable viewport with integrated ChaSetScrollBar,
// precision mouse wheel handling, smooth animated kinematics, and automatic childrenRect bounds.
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Flickable {
    id: root

    property alias flickableItem: root
    property alias verticalScrollBar: vScrollBar
    property alias horizontalScrollBar: hScrollBar

    property string size: "default" // "default" | "sm"
    property bool showVerticalScrollBar: true
    property bool showHorizontalScrollBar: false
    property bool showButtons: true
    property bool floating: true
    property int hitSize: ThemeTokens.dp(size === "sm" ? 10 : 14)
    property int collapsedSize: ThemeTokens.dp(size === "sm" ? 2 : 4)
    property int expandedSize: ThemeTokens.dp(size === "sm" ? 6 : 10)
    property real pageStepRatio: 0.85
    property bool smoothScroll: true
    property bool forceHover: false
    property bool forceActive: false
    property string forceButtonState: ""
    property var parentScrollArea: null
    property bool horizontalWheelWithVertical: false

    readonly property real availableWidth: width - ((!root.floating && vScrollBar.visible) ? vScrollBar.width : 0)
    readonly property real availableHeight: height - ((!root.floating && hScrollBar.visible) ? hScrollBar.height : 0)

    rightMargin: (!root.floating && vScrollBar.visible) ? vScrollBar.width : 0
    bottomMargin: (!root.floating && hScrollBar.visible) ? hScrollBar.height : 0

    onContentWidthChanged: {
        var maxX = Math.max(0, contentWidth - availableWidth)
        if (contentX > maxX) contentX = maxX
    }
    onContentHeightChanged: {
        var maxY = Math.max(0, contentHeight - availableHeight)
        if (contentY > maxY) contentY = maxY
    }

    readonly property bool isAtTop: root.contentY <= 1
    readonly property bool isAtBottom: root.contentHeight > root.availableHeight ? (root.contentY + root.availableHeight >= root.contentHeight - 2) : true
    readonly property bool isAtLeft: root.contentX <= 1
    readonly property bool isAtRight: root.contentWidth > root.availableWidth ? (root.contentX + root.availableWidth >= root.contentWidth - 2) : true

    boundsBehavior: Flickable.StopAtBounds
    clip: true
    interactive: false

    contentWidth: contentItem.childrenRect.width > 0 ? contentItem.childrenRect.width : availableWidth
    contentHeight: contentItem.childrenRect.height > 0 ? contentItem.childrenRect.height : availableHeight

    // Kinematic animations for smooth scrolling
    NumberAnimation {
        id: animY
        target: root
        property: "contentY"
        duration: 200
        easing.type: Easing.OutCubic
    }

    NumberAnimation {
        id: animX
        target: root
        property: "contentX"
        duration: 200
        easing.type: Easing.OutCubic
    }

    function scrollToTop(smooth) {
        var useSmooth = (typeof smooth !== "undefined") ? smooth : (root.smoothScroll && ThemeTokens.animationsEnabled)
        if (useSmooth && ThemeTokens.animationsEnabled) {
            animY.stop()
            animY.to = 0
            animY.start()
        } else {
            animY.stop()
            root.contentY = 0
        }
    }

    function scrollToBottom(smooth) {
        var useSmooth = (typeof smooth !== "undefined") ? smooth : (root.smoothScroll && ThemeTokens.animationsEnabled)
        var targetY = Math.max(0, root.contentHeight - root.availableHeight)
        if (useSmooth && ThemeTokens.animationsEnabled) {
            animY.stop()
            animY.to = targetY
            animY.start()
        } else {
            animY.stop()
            root.contentY = targetY
        }
    }

    function scrollToY(targetY, smooth) {
        if (typeof targetY !== "number" || isNaN(targetY)) return
        var useSmooth = (typeof smooth !== "undefined") ? smooth : (root.smoothScroll && ThemeTokens.animationsEnabled)
        var maxScrollY = Math.max(0, root.contentHeight - root.availableHeight)
        var clampedY = Math.max(0, Math.min(maxScrollY, targetY))
        if (useSmooth && ThemeTokens.animationsEnabled) {
            animY.stop()
            animY.to = clampedY
            animY.start()
        } else {
            animY.stop()
            root.contentY = clampedY
        }
    }

    function scrollToX(targetX, smooth) {
        if (typeof targetX !== "number" || isNaN(targetX)) return
        var useSmooth = (typeof smooth !== "undefined") ? smooth : (root.smoothScroll && ThemeTokens.animationsEnabled)
        var maxScrollX = Math.max(0, root.contentWidth - root.availableWidth)
        var clampedX = Math.max(0, Math.min(maxScrollX, targetX))
        if (useSmooth && ThemeTokens.animationsEnabled) {
            animX.stop()
            animX.to = clampedX
            animX.start()
        } else {
            animX.stop()
            root.contentX = clampedX
        }
    }

    function pageUp(smooth) {
        var useSmooth = (typeof smooth !== "undefined") ? smooth : root.smoothScroll
        var targetY = Math.max(0, root.contentY - root.availableHeight * root.pageStepRatio)
        if (useSmooth) {
            animY.stop()
            animY.to = targetY
            animY.start()
        } else {
            animY.stop()
            root.contentY = targetY
        }
    }

    function pageDown(smooth) {
        var useSmooth = (typeof smooth !== "undefined") ? smooth : root.smoothScroll
        var maxScrollY = Math.max(0, root.contentHeight - root.availableHeight)
        var targetY = Math.min(maxScrollY, root.contentY + root.availableHeight * root.pageStepRatio)
        if (useSmooth) {
            animY.stop()
            animY.to = targetY
            animY.start()
        } else {
            animY.stop()
            root.contentY = targetY
        }
    }

    function scrollToLeft(smooth) {
        var useSmooth = (typeof smooth !== "undefined") ? smooth : root.smoothScroll
        if (useSmooth) {
            animX.stop()
            animX.to = 0
            animX.start()
        } else {
            animX.stop()
            root.contentX = 0
        }
    }

    function scrollToRight(smooth) {
        var useSmooth = (typeof smooth !== "undefined") ? smooth : root.smoothScroll
        var targetX = Math.max(0, root.contentWidth - root.availableWidth)
        if (useSmooth) {
            animX.stop()
            animX.to = targetX
            animX.start()
        } else {
            animX.stop()
            root.contentX = targetX
        }
    }

    function pageLeft(smooth) {
        var useSmooth = (typeof smooth !== "undefined") ? smooth : root.smoothScroll
        var targetX = Math.max(0, root.contentX - root.availableWidth * root.pageStepRatio)
        if (useSmooth) {
            animX.stop()
            animX.to = targetX
            animX.start()
        } else {
            animX.stop()
            root.contentX = targetX
        }
    }

    function pageRight(smooth) {
        var useSmooth = (typeof smooth !== "undefined") ? smooth : root.smoothScroll
        var maxScrollX = Math.max(0, root.contentWidth - root.availableWidth)
        var targetX = Math.min(maxScrollX, root.contentX + root.availableWidth * root.pageStepRatio)
        if (useSmooth) {
            animX.stop()
            animX.to = targetX
            animX.start()
        } else {
            animX.stop()
            root.contentX = targetX
        }
    }

    function simulateThumbDrag(deltaPixels) {
        animY.stop()
        var maxScrollY = Math.max(0, root.contentHeight - root.availableHeight)
        root.contentY = Math.max(0, Math.min(maxScrollY, root.contentY + deltaPixels))
    }

    Keys.onUpPressed: function(event) {
        event.accepted = true
        root.simulateThumbDrag(-40)
    }
    Keys.onDownPressed: function(event) {
        event.accepted = true
        root.simulateThumbDrag(40)
    }
    Keys.onPressed: function(event) {
        if (event.key === Qt.Key_PageUp) {
            event.accepted = true
            root.pageUp()
        } else if (event.key === Qt.Key_PageDown) {
            event.accepted = true
            root.pageDown()
        } else if (event.key === Qt.Key_Home) {
            event.accepted = true
            root.scrollToTop()
        } else if (event.key === Qt.Key_End) {
            event.accepted = true
            root.scrollToBottom()
        }
    }

    function resolveParentScrollArea() {
        if (parentScrollArea && parentScrollArea !== root) return parentScrollArea
        var p = root.parent
        while (p) {
            if (p !== root && p.flickableItem && typeof p.handleVerticalWheel === "function") {
                parentScrollArea = p
                return p
            }
            p = p.parent
        }
        return null
    }

    function handleVerticalWheel(deltaY) {
        var maxScrollY = Math.max(0, root.contentHeight - root.availableHeight)
        if (maxScrollY <= 1.0) {
            var parentArea = resolveParentScrollArea()
            if (parentArea && typeof parentArea.handleVerticalWheel === "function") {
                return parentArea.handleVerticalWheel(deltaY)
            }
            return false
        }

        var scrollingDown = (deltaY < 0)
        var scrollingUp = (deltaY > 0)

        if ((scrollingUp && root.contentY <= 0) || (scrollingDown && root.contentY >= maxScrollY - 0.5)) {
            var parentArea = resolveParentScrollArea()
            if (parentArea && typeof parentArea.handleVerticalWheel === "function") {
                return parentArea.handleVerticalWheel(deltaY)
            }
            return false
        }

        animY.stop()
        var scrollPixels = (deltaY / 120.0) * 80.0
        var newY = Math.max(0, Math.min(maxScrollY, root.contentY - scrollPixels))
        if (newY === root.contentY) {
            var parentArea = resolveParentScrollArea()
            if (parentArea && typeof parentArea.handleVerticalWheel === "function") {
                return parentArea.handleVerticalWheel(deltaY)
            }
            return false
        }
        root.contentY = newY
        return true
    }

    function handleHorizontalWheel(deltaX) {
        var maxScrollX = Math.max(0, root.contentWidth - root.availableWidth)
        if (maxScrollX <= 1.0) {
            var parentArea = resolveParentScrollArea()
            if (parentArea && typeof parentArea.handleHorizontalWheel === "function") {
                return parentArea.handleHorizontalWheel(deltaX)
            }
            return false
        }

        var scrollingRight = (deltaX < 0)
        var scrollingLeft = (deltaX > 0)

        if ((scrollingLeft && root.contentX <= 0) || (scrollingRight && root.contentX >= maxScrollX - 0.5)) {
            var parentArea = resolveParentScrollArea()
            if (parentArea && typeof parentArea.handleHorizontalWheel === "function") {
                return parentArea.handleHorizontalWheel(deltaX)
            }
            return false
        }

        animX.stop()
        var scrollPixels = (deltaX / 120.0) * 80.0
        var newX = Math.max(0, Math.min(maxScrollX, root.contentX - scrollPixels))
        if (newX === root.contentX) {
            var parentArea = resolveParentScrollArea()
            if (parentArea && typeof parentArea.handleHorizontalWheel === "function") {
                return parentArea.handleHorizontalWheel(deltaX)
            }
            return false
        }
        root.contentX = newX
        return true
    }

    WheelHandler {
        id: vWheelHandler
        target: null
        orientation: Qt.Vertical
        acceptedDevices: PointerDevice.Mouse | PointerDevice.TouchPad
        enabled: (root.contentHeight - root.availableHeight) > 1.0 || (root.contentWidth - root.availableWidth) > 1.0
        onWheel: function(event) {
            if (event.modifiers & (Qt.ControlModifier | Qt.MetaModifier)) return
            var isShift = Boolean(event.modifiers & Qt.ShiftModifier)
            if (isShift) {
                var delta = event.angleDelta.y !== 0 ? event.angleDelta.y : event.angleDelta.x
                if (delta === 0) return
                var hHandled = root.handleHorizontalWheel(delta)
                if (hHandled) {
                    event.accepted = true
                }
                return
            }
            if (event.angleDelta.y === 0) return
            var handled = root.handleVerticalWheel(event.angleDelta.y)
            if (handled) {
                event.accepted = true
            }
        }
    }

    WheelHandler {
        id: hWheelHandler
        target: null
        orientation: Qt.Horizontal
        acceptedDevices: PointerDevice.Mouse | PointerDevice.TouchPad
        enabled: (root.contentWidth - root.availableWidth) > 1.0
        onWheel: function(event) {
            if (event.modifiers & (Qt.ControlModifier | Qt.MetaModifier)) return
            var delta = event.angleDelta.x !== 0 ? event.angleDelta.x : (root.horizontalWheelWithVertical ? event.angleDelta.y : 0)
            if (delta === 0) return
            var handled = root.handleHorizontalWheel(delta)
            if (handled) {
                event.accepted = true
            }
        }
    }


    ScrollBar.vertical: ChaSetScrollBar {
        id: vScrollBar
        scrollArea: root
        barSize: root.size
        floating: root.floating
        height: (hScrollBar.visible) ? (root.height - hScrollBar.height) : root.height
        visible: root.showVerticalScrollBar && (policy === ScrollBar.AlwaysOn || (policy === ScrollBar.AsNeeded && root.contentHeight > root.availableHeight))
        showButtons: root.showButtons
        collapsedSize: root.collapsedSize
        expandedSize: root.expandedSize
        hitSize: root.hitSize
        pageStepRatio: root.pageStepRatio
        smoothScroll: root.smoothScroll
        forceHover: root.forceHover
        forceActive: root.forceActive
        forceButtonState: root.forceButtonState
    }

    ScrollBar.horizontal: ChaSetScrollBar {
        id: hScrollBar
        scrollArea: root
        barSize: root.size
        floating: root.floating
        width: (vScrollBar.visible) ? (root.width - vScrollBar.width) : root.width
        visible: root.showHorizontalScrollBar && (policy === ScrollBar.AlwaysOn || (policy === ScrollBar.AsNeeded && root.contentWidth > root.availableWidth))
        showButtons: root.showButtons
        collapsedSize: root.collapsedSize
        expandedSize: root.expandedSize
        hitSize: root.hitSize
        pageStepRatio: root.pageStepRatio
        smoothScroll: root.smoothScroll
        forceHover: root.forceHover
        forceActive: root.forceActive
        forceButtonState: root.forceButtonState
    }

    // Dual-Axis Corner Piece
    Rectangle {
        id: corner
        parent: root
        visible: vScrollBar.visible && hScrollBar.visible
        z: 20
        anchors.right: parent.right
        anchors.bottom: parent.bottom
        width: vScrollBar.width
        height: hScrollBar.height
        color: !root.floating ? (ThemeTokens.dark ? Qt.rgba(30/255, 41/255, 59/255, 0.45) : Qt.rgba(241/255, 245/255, 249/255, 0.6)) : "transparent"

        Rectangle {
            visible: !root.floating
            width: parent.width; height: 1; x: 0; y: 0; color: ThemeTokens.border
        }
        Rectangle {
            visible: !root.floating
            width: 1; height: parent.height; x: 0; y: 0; color: ThemeTokens.border
        }
    }
}
