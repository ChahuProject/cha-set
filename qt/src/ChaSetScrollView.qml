// ChaSet ScrollView for Qt (QML)
// High-level scrollable viewport container with integrated ChaSetScrollBar.
import QtQuick 6.10
import chaSet

Item {
    id: root

    default property alias contentData: flickable.contentData
    property alias contentWidth: flickable.contentWidth
    property alias contentHeight: flickable.contentHeight
    property alias contentX: flickable.contentX
    property alias contentY: flickable.contentY
    property alias flickableItem: flickable

    property bool showVerticalScrollBar: true
    property bool showHorizontalScrollBar: false
    property bool showButtons: true
    property int hitSize: 16
    property int collapsedSize: 6
    property int expandedSize: 12
    property real pageStepRatio: 0.85
    property bool smoothScroll: true

    clip: true

    Flickable {
        id: flickable
        anchors.fill: parent
        boundsBehavior: Flickable.StopAtBounds
        clip: true
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
