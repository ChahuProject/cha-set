// ChaSetVirtualGrid.qml — Cross-Stack Virtual Grid Component
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root

    property alias model: gridView.model
    property alias delegate: gridView.delegate
    property alias currentIndex: gridView.currentIndex
    property int cellWidth: 160
    property int cellHeight: 120
    property real minColumnWidthRem: 12
    property real gapRem: 0.75
    property int estimateSize: 180
    property int overscan: 4
    property int customRadius: 6

    readonly property int effectiveCellWidth: ThemeTokens.dp(root.cellWidth)
    readonly property int effectiveCellHeight: ThemeTokens.dp(root.cellHeight)
    readonly property int effectiveEstimateSize: ThemeTokens.dp(root.estimateSize)

    function scrollToIndex(index) {
        if (gridView) {
            gridView.positionViewAtIndex(index, GridView.Beginning)
            gridView.currentIndex = index
        }
    }

    implicitWidth: ThemeTokens.dp(360)
    implicitHeight: ThemeTokens.dp(280)
    activeFocusOnTab: true

    Keys.onUpPressed: function(event) {
        event.accepted = true
        gridView.moveCurrentIndexUp()
    }

    Keys.onDownPressed: function(event) {
        event.accepted = true
        gridView.moveCurrentIndexDown()
    }

    Keys.onLeftPressed: function(event) {
        event.accepted = true
        gridView.moveCurrentIndexLeft()
    }

    Keys.onRightPressed: function(event) {
        event.accepted = true
        gridView.moveCurrentIndexRight()
    }

    Rectangle {
        anchors.fill: parent
        color: ThemeTokens.panel
        border.color: root.activeFocus ? ThemeTokens.focus : ThemeTokens.border
        border.width: root.activeFocus ? 2 : 1
        radius: ThemeTokens.dp(root.customRadius)
        clip: true

        GridView {
            id: gridView
            anchors.fill: parent
            anchors.margins: ThemeTokens.dp(8)
            cellWidth: root.effectiveCellWidth
            cellHeight: root.effectiveCellHeight
            boundsBehavior: Flickable.StopAtBounds
            clip: true
            reuseItems: true
            cacheBuffer: root.overscan * (root.estimateSize > 0 ? ThemeTokens.dp(root.estimateSize) : root.effectiveCellHeight)

            ScrollBar.vertical: ChaSetScrollBar {
                orientation: Qt.Vertical
                policy: ScrollBar.AsNeeded
            }

            WheelHandler {
                target: gridView
                onWheel: function(event) {
                    gridView.flick(0, event.angleDelta.y * 5)
                }
            }
        }
    }
}
