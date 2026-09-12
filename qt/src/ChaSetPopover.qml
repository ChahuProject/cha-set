// ChaSetPopover.qml — Cross-Stack Popover Component
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root

    property bool open: false
    property string side: "bottom"      // "top" | "bottom" | "left" | "right"
    property string align: "start"      // "start" | "center" | "end"
    property int sideOffset: 8
    property int popoverWidth: 260
    property int popoverHeight: 160
    property int customRadius: 8
    property bool modal: false
    property bool movable: false
    property string moveLabel: "Drag to move"
    property bool arrow: false

    property real dragOffsetX: 0
    property real dragOffsetY: 0

    signal opened()
    signal closed()

    default property alias contentData: popoverContent.data

    onOpenChanged: {
        if (!open) {
            dragOffsetX = 0
            dragOffsetY = 0
        }
    }

    Popup {
        id: popup
        visible: root.open
        onVisibleChanged: {
            if (root.open !== visible) root.open = visible
            if (visible) root.opened()
            else root.closed()
        }
        x: {
            var baseX = 0
            if (root.side === "left") {
                baseX = -root.popoverWidth - root.sideOffset
            } else if (root.side === "right") {
                baseX = root.width + root.sideOffset
            } else {
                if (root.align === "start") baseX = 0
                else if (root.align === "end") baseX = root.width - root.popoverWidth
                else baseX = (root.width - root.popoverWidth) / 2
            }
            return baseX + root.dragOffsetX
        }
        y: {
            var baseY = 0
            if (root.side === "top") {
                baseY = -root.popoverHeight - root.sideOffset
            } else if (root.side === "bottom") {
                baseY = root.height + root.sideOffset
            } else {
                if (root.align === "start") baseY = 0
                else if (root.align === "end") baseY = root.height - root.popoverHeight
                else baseY = (root.height - root.popoverHeight) / 2
            }
            return baseY + root.dragOffsetY
        }
        width: root.popoverWidth
        height: root.popoverHeight
        padding: 12
        topPadding: root.movable ? 22 : 12
        modal: root.modal
        dim: root.modal
        focus: true
        closePolicy: Popup.CloseOnEscape | Popup.CloseOnPressOutside

        background: Rectangle {
            color: ThemeTokens.panel
            border.color: ThemeTokens.border
            border.width: 1
            radius: root.customRadius
            opacity: popup.visible ? 1.0 : 0.0
            scale: popup.visible ? 1.0 : 0.95

            Behavior on opacity {
                enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
                NumberAnimation { duration: ThemeTokens.motionShort; easing.type: ThemeTokens.easeEntrance }
            }
            Behavior on scale {
                enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
                NumberAnimation { duration: ThemeTokens.motionShort; easing.type: ThemeTokens.easeEntrance }
            }

            Rectangle {
                id: arrowIndicator
                visible: root.arrow
                width: 10
                height: 10
                rotation: 45
                color: ThemeTokens.panel
                border.color: ThemeTokens.border
                border.width: 1
                z: -1
                x: {
                    switch (root.side) {
                    case "left": return parent.width - 5
                    case "right": return -5
                    default:
                        if (root.align === "start") return 16
                        if (root.align === "end") return parent.width - 26
                        return (parent.width - width) / 2
                    }
                }
                y: {
                    switch (root.side) {
                    case "top": return parent.height - 5
                    case "bottom": return -5
                    default:
                        if (root.align === "start") return 16
                        if (root.align === "end") return parent.height - 26
                        return (parent.height - height) / 2
                    }
                }
            }
        }

        contentItem: Item {
            anchors.fill: parent

            // Move Handle if movable is enabled
            Rectangle {
                id: dragHandle
                visible: root.movable
                anchors.top: parent.top
                anchors.topMargin: -14
                anchors.horizontalCenter: parent.horizontalCenter
                width: parent.width
                height: 14
                color: "transparent"
                radius: 4

                Row {
                    anchors.centerIn: parent
                    spacing: 3
                    Repeater {
                        model: 5
                        Rectangle {
                            width: 3
                            height: 3
                            radius: 1.5
                            color: ThemeTokens.subduedText
                        }
                    }
                }

                MouseArea {
                    anchors.fill: parent
                    cursorShape: Qt.OpenHandCursor
                    property real startMouseX: 0
                    property real startMouseY: 0
                    onPressed: (mouse) => {
                        startMouseX = mouse.x
                        startMouseY = mouse.y
                        cursorShape = Qt.ClosedHandCursor
                    }
                    onPositionChanged: (mouse) => {
                        if (pressed) {
                            root.dragOffsetX += (mouse.x - startMouseX)
                            root.dragOffsetY += (mouse.y - startMouseY)
                        }
                    }
                    onReleased: cursorShape = Qt.OpenHandCursor
                    onDoubleClicked: {
                        root.dragOffsetX = 0
                        root.dragOffsetY = 0
                    }
                }
            }

            Item {
                id: popoverContent
                anchors.fill: parent
            }
        }
    }
}
