// ChaSet ScrollView for Qt (QML)
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

    property bool showVerticalScrollBar: true
    property bool showHorizontalScrollBar: false
    property bool showButtons: true
    property int hitSize: 8
    property int collapsedSize: 4
    property int expandedSize: 8
    property real pageStepRatio: 0.85
    property bool smoothScroll: true

    readonly property bool isAtTop: root.contentY <= 1
    readonly property bool isAtBottom: root.contentHeight > root.height ? (root.contentY + root.height >= root.contentHeight - 2) : true
    readonly property bool isAtLeft: root.contentX <= 1
    readonly property bool isAtRight: root.contentWidth > root.width ? (root.contentX + root.width >= root.contentWidth - 2) : true

    boundsBehavior: Flickable.StopAtBounds
    clip: true

    contentWidth: contentItem.childrenRect.width > 0 ? contentItem.childrenRect.width : width
    contentHeight: contentItem.childrenRect.height > 0 ? contentItem.childrenRect.height : height

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
        var useSmooth = (typeof smooth !== "undefined") ? smooth : root.smoothScroll
        if (useSmooth) {
            animY.stop()
            animY.to = 0
            animY.start()
        } else {
            animY.stop()
            root.contentY = 0
        }
    }

    function scrollToBottom(smooth) {
        var useSmooth = (typeof smooth !== "undefined") ? smooth : root.smoothScroll
        var targetY = Math.max(0, root.contentHeight - root.height)
        if (useSmooth) {
            animY.stop()
            animY.to = targetY
            animY.start()
        } else {
            animY.stop()
            root.contentY = targetY
        }
    }

    function pageUp(smooth) {
        var useSmooth = (typeof smooth !== "undefined") ? smooth : root.smoothScroll
        var targetY = Math.max(0, root.contentY - root.height * root.pageStepRatio)
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
        var maxScrollY = Math.max(0, root.contentHeight - root.height)
        var targetY = Math.min(maxScrollY, root.contentY + root.height * root.pageStepRatio)
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
        var targetX = Math.max(0, root.contentWidth - root.width)
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
        var targetX = Math.max(0, root.contentX - root.width * root.pageStepRatio)
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
        var maxScrollX = Math.max(0, root.contentWidth - root.width)
        var targetX = Math.min(maxScrollX, root.contentX + root.width * root.pageStepRatio)
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
        var maxScrollY = Math.max(0, root.contentHeight - root.height)
        root.contentY = Math.max(0, Math.min(maxScrollY, root.contentY + deltaPixels))
    }

    WheelHandler {
        target: null
        orientation: Qt.Vertical
        acceptedDevices: PointerDevice.Mouse | PointerDevice.TouchPad
        onWheel: function(event) {
            if (event.angleDelta.y === 0) return
            var maxScrollY = Math.max(0, root.contentHeight - root.height)
            if (maxScrollY <= 0) return
            animY.stop()
            var deltaY = event.angleDelta.y
            var scrollPixels = (deltaY / 120.0) * 80.0
            root.contentY = Math.max(0, Math.min(maxScrollY, root.contentY - scrollPixels))
            event.accepted = true
        }
    }

    WheelHandler {
        target: null
        orientation: Qt.Horizontal
        acceptedDevices: PointerDevice.Mouse | PointerDevice.TouchPad
        onWheel: function(event) {
            var delta = event.angleDelta.x !== 0 ? event.angleDelta.x : (!root.showVerticalScrollBar ? event.angleDelta.y : 0)
            if (delta === 0) return
            var maxScrollX = Math.max(0, root.contentWidth - root.width)
            if (maxScrollX <= 0) return
            animX.stop()
            var scrollPixels = (delta / 120.0) * 80.0
            root.contentX = Math.max(0, Math.min(maxScrollX, root.contentX - scrollPixels))
            event.accepted = true
        }
    }

    ScrollBar.vertical: ChaSetScrollBar {
        id: vScrollBar
        scrollView: root
        visible: root.showVerticalScrollBar && (policy === ScrollBar.AlwaysOn || (policy === ScrollBar.AsNeeded && root.contentHeight > root.height))
        showButtons: root.showButtons
        collapsedSize: root.collapsedSize
        expandedSize: root.expandedSize
        hitSize: root.hitSize
        pageStepRatio: root.pageStepRatio
        smoothScroll: root.smoothScroll
    }

    ScrollBar.horizontal: ChaSetScrollBar {
        id: hScrollBar
        scrollView: root
        visible: root.showHorizontalScrollBar && (policy === ScrollBar.AlwaysOn || (policy === ScrollBar.AsNeeded && root.contentWidth > root.width))
        showButtons: root.showButtons
        collapsedSize: root.collapsedSize
        expandedSize: root.expandedSize
        hitSize: root.hitSize
        pageStepRatio: root.pageStepRatio
        smoothScroll: root.smoothScroll
    }

    // Dual-Axis Corner Piece
    Rectangle {
        id: corner
        visible: vScrollBar.visible && hScrollBar.visible
        z: 20
        anchors.right: parent.right
        anchors.bottom: parent.bottom
        width: root.expandedSize
        height: root.expandedSize
        color: "transparent"
    }
}


