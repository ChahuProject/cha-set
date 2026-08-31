// ChaSet ScrollView for Qt (QML)
// High-level scrollable viewport container with integrated ChaSetScrollBar and desktop mouse wheel support.
import QtQuick 6.10
import QtQuick.Controls 6.10
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
    property bool showButtons: false
    property int hitSize: 8
    property int collapsedSize: 4
    property int expandedSize: 8
    property real pageStepRatio: 0.85
    property bool smoothScroll: true

    function scrollToTop() { flickable.contentY = 0 }
    function scrollToBottom() { flickable.contentY = Math.max(0, flickable.contentHeight - flickable.height) }
    function scrollToLeft() { flickable.contentX = 0 }
    function scrollToRight() { flickable.contentX = Math.max(0, flickable.contentWidth - flickable.width) }
    function pageUp() { flickable.contentY = Math.max(0, flickable.contentY - flickable.height * root.pageStepRatio) }
    function pageDown() { flickable.contentY = Math.min(Math.max(0, flickable.contentHeight - flickable.height), flickable.contentY + flickable.height * root.pageStepRatio) }
    function pageLeft() { flickable.contentX = Math.max(0, flickable.contentX - flickable.width * root.pageStepRatio) }
    function pageRight() { flickable.contentX = Math.min(Math.max(0, flickable.contentWidth - flickable.width), flickable.contentX + flickable.width * root.pageStepRatio) }
    function simulateThumbDrag(deltaPixels) { flickable.contentY = Math.max(0, Math.min(flickable.contentHeight - flickable.height, flickable.contentY + deltaPixels)) }

    clip: true

    Flickable {
        id: flickable
        anchors.fill: parent
        boundsBehavior: Flickable.StopAtBounds
        clip: true

        WheelHandler {
            target: flickable
            orientation: Qt.Vertical
            acceptedDevices: PointerDevice.Mouse | PointerDevice.TouchPad
            onWheel: function(event) {
                var delta = event.angleDelta.y !== 0 ? event.angleDelta.y : event.angleDelta.x
                var maxScrollY = Math.max(0, flickable.contentHeight - flickable.height)
                if (maxScrollY > 0 && delta !== 0) {
                    var step = 100
                    flickable.contentY = Math.max(0, Math.min(maxScrollY, flickable.contentY - (delta > 0 ? step : -step)))
                }
            }
        }

        WheelHandler {
            target: flickable
            orientation: Qt.Horizontal
            acceptedDevices: PointerDevice.Mouse | PointerDevice.TouchPad
            onWheel: function(event) {
                var delta = event.angleDelta.x
                var maxScrollX = Math.max(0, flickable.contentWidth - flickable.width)
                if (maxScrollX > 0 && delta !== 0) {
                    var step = 100
                    flickable.contentX = Math.max(0, Math.min(maxScrollX, flickable.contentX - (delta > 0 ? step : -step)))
                }
            }
        }

        ScrollBar.vertical: ChaSetScrollBar {
            id: vScrollBar
            visible: root.showVerticalScrollBar && flickable.contentHeight > flickable.height
            collapsedSize: root.collapsedSize
            expandedSize: root.expandedSize
        }

        ScrollBar.horizontal: ChaSetScrollBar {
            id: hScrollBar
            visible: root.showHorizontalScrollBar && flickable.contentWidth > flickable.width
            collapsedSize: root.collapsedSize
            expandedSize: root.expandedSize
        }
    }
}
