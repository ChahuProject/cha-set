// ChaSetDraggableModal.qml — Cross-Stack Draggable Modal Component
import QtQuick 6.10
import ChaSet

Rectangle {
    id: root

    property bool open: true
    property string title: "Inspector Window"
    property int customRadius: 8

    default property alias contentData: bodyContent.data

    width: 320
    height: 220
    color: ThemeTokens.panel
    border.color: ThemeTokens.border
    border.width: 1
    radius: root.customRadius
    visible: root.open
    clip: true

    Column {
        anchors.fill: parent

        // Drag Bar Header
        Rectangle {
            id: titleBar
            width: parent.width
            height: 36
            color: ThemeTokens.hover

            Row {
                anchors.fill: parent
                anchors.leftMargin: 12
                anchors.rightMargin: 8
                spacing: 8

                Text {
                    anchors.verticalCenter: parent.verticalCenter
                    text: root.title
                    color: ThemeTokens.text
                    font.pixelSize: 13
                    font.weight: Font.DemiBold
                }

                Item { width: 1; height: 1; Layout.fillWidth: true }

                ChaSetButton {
                    text: "✕"
                    variant: "ghost"
                    size: "icon-xs"
                    anchors.verticalCenter: parent.verticalCenter
                    onClicked: root.open = false
                }
            }

            MouseArea {
                id: dragArea
                anchors.fill: parent
                drag.target: root
                drag.axis: Drag.XAndYAxis
                drag.minimumX: 0
                drag.maximumX: parent.parent ? parent.parent.parent.width - root.width : 500
                drag.minimumY: 0
                drag.maximumY: parent.parent ? parent.parent.parent.height - root.height : 500
                cursorShape: Qt.SizeAllCursor
            }
        }

        Rectangle {
            width: parent.width
            height: 1
            color: ThemeTokens.border
        }

        Item {
            id: bodyContent
            width: parent.width
            height: parent.height - 37
        }
    }
}
