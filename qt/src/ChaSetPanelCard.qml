// ChaSetPanelCard.qml — Cross-Stack Panel Card Component
import QtQuick 6.10
import ChaSet

Rectangle {
    id: root

    property string title: "Panel Title"
    property string description: ""
    property string badgeText: ""
    property bool collapsible: false
    property bool collapsed: false
    property int customRadius: 8

    default property alias contentData: bodyContent.data

    color: ThemeTokens.panel
    border.color: ThemeTokens.border
    border.width: 1
    radius: root.customRadius
    implicitWidth: 360
    implicitHeight: headerRow.height + (root.collapsed ? 0 : bodyContent.implicitHeight + 20)
    clip: true

    Behavior on implicitHeight {
        NumberAnimation { duration: 180; easing.type: Easing.OutQuad }
    }

    Column {
        anchors.fill: parent

        // Tinted Header
        Rectangle {
            id: headerRow
            width: parent.width
            height: 40
            color: ThemeTokens.hover

            Row {
                anchors.left: parent.left
                anchors.leftMargin: 12
                anchors.right: collapseBtn.visible ? collapseBtn.left : parent.right
                anchors.rightMargin: 8
                anchors.verticalCenter: parent.verticalCenter
                spacing: 8

                Text {
                    text: root.title
                    color: ThemeTokens.text
                    font.pixelSize: 13
                    font.weight: Font.DemiBold
                    anchors.verticalCenter: parent.verticalCenter
                }

                ChaSetBadge {
                    visible: root.badgeText !== ""
                    text: root.badgeText
                    variant: "secondary"
                    size: "sm"
                    anchors.verticalCenter: parent.verticalCenter
                }
            }

            ChaSetButton {
                id: collapseBtn
                visible: root.collapsible
                variant: "ghost"
                size: "icon-xs"
                text: root.collapsed ? "▾" : "▴"
                anchors.right: parent.right
                anchors.rightMargin: 12
                anchors.verticalCenter: parent.verticalCenter
                onClicked: root.collapsed = !root.collapsed
            }
        }

        Rectangle {
            width: parent.width
            height: 1
            color: ThemeTokens.border
        }

        Item {
            id: bodyContent
            visible: !root.collapsed
            width: parent.width
            implicitHeight: childrenRect.height
            anchors.margins: 12
        }
    }
}
