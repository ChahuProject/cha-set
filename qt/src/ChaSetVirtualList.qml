// ChaSetVirtualList.qml — Cross-Stack Virtual List Component
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root

    property alias model: listView.model
    property alias delegate: listView.delegate
    property int itemHeight: 36
    property int customRadius: 6

    implicitWidth: 320
    implicitHeight: 280
    activeFocusOnTab: true

    Keys.onUpPressed: function(event) {
        event.accepted = true
        listView.decrementCurrentIndex()
    }

    Keys.onDownPressed: function(event) {
        event.accepted = true
        listView.incrementCurrentIndex()
    }

    Keys.onPressed: function(event) {
        if (event.key === Qt.Key_PageUp) {
            event.accepted = true
            for (var i = 0; i < 5; i++) listView.decrementCurrentIndex()
        } else if (event.key === Qt.Key_PageDown) {
            event.accepted = true
            for (var j = 0; j < 5; j++) listView.incrementCurrentIndex()
        } else if (event.key === Qt.Key_Home) {
            event.accepted = true
            listView.currentIndex = 0
        } else if (event.key === Qt.Key_End) {
            event.accepted = true
            listView.currentIndex = Math.max(0, listView.count - 1)
        }
    }

    Rectangle {
        anchors.fill: parent
        color: ThemeTokens.panel
        border.color: root.activeFocus ? ThemeTokens.focus : ThemeTokens.border
        border.width: root.activeFocus ? 2 : 1
        radius: root.customRadius
        clip: true

        ListView {
            id: listView
            anchors.fill: parent
            boundsBehavior: Flickable.StopAtBounds
            clip: true
            reuseItems: true
            cacheBuffer: 200

            ScrollBar.vertical: ChaSetScrollBar {
                orientation: Qt.Vertical
                policy: ScrollBar.AsNeeded
            }

            WheelHandler {
                target: listView
                onWheel: function(event) {
                    listView.flick(0, event.angleDelta.y * 5)
                }
            }
        }
    }
}
