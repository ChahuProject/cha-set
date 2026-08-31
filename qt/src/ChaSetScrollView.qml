// ChaSet ScrollView for Qt (QML)
// High-level scrollable viewport container with integrated ChaSetScrollBar and desktop mouse wheel support.
import QtQuick 6.10
import chaSet

Item {
    id: root

    default property alias contentData: flickable.data
    property alias contentWidth: flickable.contentWidth
    property alias contentHeight: flickable.contentHeight
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

    function scrollToTop() { if (vScrollBar) vScrollBar.scrollToStart() }
    function scrollToBottom() { if (vScrollBar) vScrollBar.scrollToEnd() }
    function scrollToLeft() { if (hScrollBar) hScrollBar.scrollToStart() }
    function scrollToRight() { if (hScrollBar) hScrollBar.scrollToEnd() }
    function pageUp() { if (vScrollBar) vScrollBar.scrollPageUp() }
    function pageDown() { if (vScrollBar) vScrollBar.scrollPageDown() }
    function pageLeft() { if (hScrollBar) hScrollBar.scrollPageUp() }
    function pageRight() { if (hScrollBar) hScrollBar.scrollPageDown() }
    function simulateThumbDrag(deltaPixels) { if (vScrollBar) vScrollBar.simulateThumbDrag(deltaPixels) }

    clip: true

    Flickable {
        id: flickable
        anchors.fill: parent
        boundsBehavior: Flickable.StopAtBounds
        clip: true

        WheelHandler {
            id: wheelVertical
            target: flickable
            orientation: Qt.Vertical
            acceptedDevices: PointerDevice.Mouse | PointerDevice.TouchPad
            onWheel: function(event) {
                var delta = event.angleDelta.y !== 0 ? event.angleDelta.y : event.angleDelta.x
                var maxScrollY = Math.max(0, flickable.contentHeight - flickable.height)
                if (maxScrollY > 0 && delta !== 0) {
                    var step = 100
                    var targetY = Math.max(0, Math.min(maxScrollY, flickable.contentY - (delta > 0 ? step : -step)))
                    if (root.smoothScroll && vScrollBar && vScrollBar.scrollAnimY) vScrollBar.scrollAnimY.startTo(targetY)
                    else flickable.contentY = targetY
                }
            }
        }

        WheelHandler {
            id: wheelHorizontal
            target: flickable
            orientation: Qt.Horizontal
            acceptedDevices: PointerDevice.Mouse | PointerDevice.TouchPad
            onWheel: function(event) {
                var delta = event.angleDelta.x
                var maxScrollX = Math.max(0, flickable.contentWidth - flickable.width)
                if (maxScrollX > 0 && delta !== 0) {
                    var step = 100
                    var targetX = Math.max(0, Math.min(maxScrollX, flickable.contentX - (delta > 0 ? step : -step)))
                    if (root.smoothScroll && hScrollBar && hScrollBar.scrollAnimX) hScrollBar.scrollAnimX.startTo(targetX)
                    else flickable.contentX = targetX
                }
            }
        }
    }

    ChaSetScrollBar {
        id: vScrollBar
        orientation: Qt.Vertical
        flickable: flickable
        visible: root.showVerticalScrollBar && flickable.contentHeight > flickable.height
        showButtons: root.showButtons
        hitSize: root.hitSize
        collapsedSize: root.collapsedSize
        expandedSize: root.expandedSize
        pageStepRatio: root.pageStepRatio
        smoothScroll: root.smoothScroll

        anchors.right: parent.right
        anchors.top: parent.top
        anchors.bottom: root.showHorizontalScrollBar && hScrollBar.visible ? hScrollBar.top : parent.bottom
    }

    ChaSetScrollBar {
        id: hScrollBar
        orientation: Qt.Horizontal
        flickable: flickable
        visible: root.showHorizontalScrollBar && flickable.contentWidth > flickable.width
        showButtons: root.showButtons
        hitSize: root.hitSize
        collapsedSize: root.collapsedSize
        expandedSize: root.expandedSize
        pageStepRatio: root.pageStepRatio
        smoothScroll: root.smoothScroll

        anchors.left: parent.left
        anchors.right: root.showVerticalScrollBar && vScrollBar.visible ? vScrollBar.left : parent.right
        anchors.bottom: parent.bottom
    }
}
