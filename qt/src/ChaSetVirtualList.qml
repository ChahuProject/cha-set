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

    Rectangle {
        anchors.fill: parent
        color: ThemeTokens.panel
        border.color: ThemeTokens.border
        border.width: 1
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
