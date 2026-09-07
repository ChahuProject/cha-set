// ChaSetPopover.qml — Cross-Stack Popover Component
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root

    property bool open: false
    property string side: "bottom" // "top" | "bottom" | "left" | "right"
    property int popoverWidth: 260
    property int popoverHeight: 160
    property int customRadius: 8

    signal opened()
    signal closed()

    default property alias contentData: popoverContent.data

    Popup {
        id: popup
        visible: root.open
        onVisibleChanged: {
            if (root.open !== visible) root.open = visible
            if (visible) root.opened()
            else root.closed()
        }
        x: {
            if (root.side === "left") return -root.popoverWidth - 6
            if (root.side === "right") return root.width + 6
            return (root.width - root.popoverWidth) / 2
        }
        y: {
            if (root.side === "top") return -root.popoverHeight - 6
            if (root.side === "bottom") return root.height + 6
            return (root.height - root.popoverHeight) / 2
        }
        width: root.popoverWidth
        height: root.popoverHeight
        padding: 12
        modal: false
        focus: true
        closePolicy: Popup.CloseOnEscape | Popup.CloseOnPressOutside

        background: Rectangle {
            color: ThemeTokens.panel
            border.color: ThemeTokens.border
            border.width: 1
            radius: root.customRadius
        }

        contentItem: Item {
            id: popoverContent
            anchors.fill: parent
        }
    }
}
