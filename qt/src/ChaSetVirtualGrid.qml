// ChaSetVirtualGrid.qml — Cross-Stack Virtual Grid Component
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root

    property alias model: gridView.model
    property alias delegate: gridView.delegate
    property int cellWidth: 160
    property int cellHeight: 120
    property int customRadius: 6

    implicitWidth: 360
    implicitHeight: 280
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
        radius: root.customRadius
        clip: true

        GridView {
            id: gridView
            anchors.fill: parent
            anchors.margins: 8
            cellWidth: root.cellWidth
            cellHeight: root.cellHeight
            boundsBehavior: Flickable.StopAtBounds
            clip: true
            reuseItems: true
            cacheBuffer: 200

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
