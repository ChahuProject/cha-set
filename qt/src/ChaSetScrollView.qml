// ChaSet ScrollView for Qt (QML)
// High-level scrollable viewport container with integrated ChaSetScrollBar,
// precision mouse wheel handling, smooth animated kinematics, and childrenRect dynamic bounds.
import QtQuick 6.10
import QtQuick.Controls 6.10
import chaSet

Item {
    id: root

    default property alias contentData: flickable.data
    property real contentWidth: 0
    property real contentHeight: 0
    property alias contentX: flickable.contentX
    property alias contentY: flickable.contentY
    property alias flickableItem: flickable

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

    readonly property bool isAtTop: flickable.contentY <= 1
    readonly property bool isAtBottom: flickable.contentHeight > flickable.height ? (flickable.contentY + flickable.height >= flickable.contentHeight - 2) : true
    readonly property bool isAtLeft: flickable.contentX <= 1
    readonly property bool isAtRight: flickable.contentWidth > flickable.width ? (flickable.contentX + flickable.width >= flickable.contentWidth - 2) : true

    // Kinematic animations for smooth scrolling
    NumberAnimation {
        id: animY
        target: flickable
        property: "contentY"
        duration: 200
        easing.type: Easing.OutCubic
    }

    NumberAnimation {
        id: animX
        target: flickable
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
            flickable.contentY = 0
        }
    }

    function scrollToBottom(smooth) {
        var useSmooth = (typeof smooth !== "undefined") ? smooth : root.smoothScroll
        var targetY = Math.max(0, flickable.contentHeight - flickable.height)
        if (useSmooth) {
            animY.stop()
            animY.to = targetY
            animY.start()
        } else {
            animY.stop()
            flickable.contentY = targetY
        }
    }

    function pageUp(smooth) {
        var useSmooth = (typeof smooth !== "undefined") ? smooth : root.smoothScroll
        var targetY = Math.max(0, flickable.contentY - flickable.height * root.pageStepRatio)
        if (useSmooth) {
            animY.stop()
            animY.to = targetY
            animY.start()
        } else {
            animY.stop()
            flickable.contentY = targetY
        }
    }

    function pageDown(smooth) {
        var useSmooth = (typeof smooth !== "undefined") ? smooth : root.smoothScroll
        var maxScrollY = Math.max(0, flickable.contentHeight - flickable.height)
        var targetY = Math.min(maxScrollY, flickable.contentY + flickable.height * root.pageStepRatio)
        if (useSmooth) {
            animY.stop()
            animY.to = targetY
            animY.start()
        } else {
            animY.stop()
            flickable.contentY = targetY
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
            flickable.contentX = 0
        }
    }

    function scrollToRight(smooth) {
        var useSmooth = (typeof smooth !== "undefined") ? smooth : root.smoothScroll
        var targetX = Math.max(0, flickable.contentWidth - flickable.width)
        if (useSmooth) {
            animX.stop()
            animX.to = targetX
            animX.start()
        } else {
            animX.stop()
            flickable.contentX = targetX
        }
    }

    function pageLeft(smooth) {
        var useSmooth = (typeof smooth !== "undefined") ? smooth : root.smoothScroll
        var targetX = Math.max(0, flickable.contentX - flickable.width * root.pageStepRatio)
        if (useSmooth) {
            animX.stop()
            animX.to = targetX
            animX.start()
        } else {
            animX.stop()
            flickable.contentX = targetX
        }
    }

    function pageRight(smooth) {
        var useSmooth = (typeof smooth !== "undefined") ? smooth : root.smoothScroll
        var maxScrollX = Math.max(0, flickable.contentWidth - flickable.width)
        var targetX = Math.min(maxScrollX, flickable.contentX + flickable.width * root.pageStepRatio)
        if (useSmooth) {
            animX.stop()
            animX.to = targetX
            animX.start()
        } else {
            animX.stop()
            flickable.contentX = targetX
        }
    }

    function simulateThumbDrag(deltaPixels) {
        animY.stop()
        var maxScrollY = Math.max(0, flickable.contentHeight - flickable.height)
        flickable.contentY = Math.max(0, Math.min(maxScrollY, flickable.contentY + deltaPixels))
    }

    clip: true

    Flickable {
        id: flickable
        anchors.fill: parent
        boundsBehavior: Flickable.StopAtBounds
        clip: true

        contentWidth: root.contentWidth > 0 ? root.contentWidth : (flickable.contentItem.childrenRect.width > 0 ? flickable.contentItem.childrenRect.width : root.width)
        contentHeight: root.contentHeight > 0 ? root.contentHeight : (flickable.contentItem.childrenRect.height > 0 ? flickable.contentItem.childrenRect.height : root.height)

        WheelHandler {
            target: flickable
            orientation: Qt.Vertical
            acceptedDevices: PointerDevice.Mouse | PointerDevice.TouchPad
            onWheel: function(event) {
                if (event.angleDelta.y === 0) return
                var maxScrollY = Math.max(0, flickable.contentHeight - flickable.height)
                if (maxScrollY <= 0) return
                animY.stop()
                var deltaY = event.angleDelta.y
                var scrollPixels = (deltaY / 120.0) * 80.0
                flickable.contentY = Math.max(0, Math.min(maxScrollY, flickable.contentY - scrollPixels))
                event.accepted = true
            }
        }

        WheelHandler {
            target: flickable
            orientation: Qt.Horizontal
            acceptedDevices: PointerDevice.Mouse | PointerDevice.TouchPad
            onWheel: function(event) {
                var delta = event.angleDelta.x !== 0 ? event.angleDelta.x : (!root.showVerticalScrollBar ? event.angleDelta.y : 0)
                if (delta === 0) return
                var maxScrollX = Math.max(0, flickable.contentWidth - flickable.width)
                if (maxScrollX <= 0) return
                animX.stop()
                var scrollPixels = (delta / 120.0) * 80.0
                flickable.contentX = Math.max(0, Math.min(maxScrollX, flickable.contentX - scrollPixels))
                event.accepted = true
            }
        }

        ScrollBar.vertical: ChaSetScrollBar {
            id: vScrollBar
            scrollView: root
            visible: root.showVerticalScrollBar && flickable.contentHeight > flickable.height
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
            visible: root.showHorizontalScrollBar && flickable.contentWidth > flickable.width
            showButtons: root.showButtons
            collapsedSize: root.collapsedSize
            expandedSize: root.expandedSize
            hitSize: root.hitSize
            pageStepRatio: root.pageStepRatio
            smoothScroll: root.smoothScroll
        }
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

