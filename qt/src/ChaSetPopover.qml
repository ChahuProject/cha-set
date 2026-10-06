// ChaSetPopover.qml — Cross-Stack Popover Component
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root

    property bool open: false
    property string side: "bottom"      // "top" | "bottom" | "left" | "right"
    property string align: "start"      // "start" | "center" | "end"
    property int sideOffset: ThemeTokens.dp(8)
    property int popoverWidth: ThemeTokens.dp(260)
    property int popoverHeight: ThemeTokens.dp(160)
    property int customRadius: ThemeTokens.dp(8)
    property bool modal: false
    property bool movable: false
    property string moveLabel: "Drag to move"
    property bool arrow: false
    /// Set false to keep this overlay out of Escape dismissal (custom Escape semantics).
    property bool closeOnEscape: true

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

    // Registry / Escape contract — see ChaSetOverlayHub. Escape dismisses only the topmost
    // layer and must never leak through to host key bindings.
    //
    // Escape is served by two complementary layers (see docs, "overlay Escape"):
    //  - this window-level Shortcut reaches overlays that never hold focus, and is gated on
    //    Hub.isTop() so exactly one layer responds at a time;
    //  - the popup below declares focus: true, so its own
    //    `closePolicy: Popup.CloseOnEscape` already covers the focused case. No extra Keys
    //    branch is needed here because the popover has no key semantics of its own.
    function close(reason) {
        if (!root.open) return;
        root.open = false;
    }

    Shortcut {
        sequence: "Escape"
        autoRepeat: false
        enabled: root.open && root.closeOnEscape && ChaSetOverlayHub.isTop(root)
        onActivated: root.close("escape")
    }

    Popup {
        id: popup
        visible: root.open
        onVisibleChanged: {
            if (root.open !== visible) root.open = visible
            if (visible) {
                ChaSetOverlayHub.register(root)
                root.opened()
            } else {
                ChaSetOverlayHub.unregister(root)
                root.closed()
            }
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
        padding: ThemeTokens.dp(12)
        topPadding: root.movable ? ThemeTokens.dp(22) : ThemeTokens.dp(12)
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
                width: ThemeTokens.dp(10)
                height: ThemeTokens.dp(10)
                rotation: 45
                color: ThemeTokens.panel
                border.color: ThemeTokens.border
                border.width: 1
                z: -1
                x: {
                    switch (root.side) {
                    case "left": return parent.width - ThemeTokens.dp(5)
                    case "right": return -ThemeTokens.dp(5)
                    default:
                        if (root.align === "start") return ThemeTokens.dp(16)
                        if (root.align === "end") return parent.width - ThemeTokens.dp(26)
                        return (parent.width - width) / 2
                    }
                }
                y: {
                    switch (root.side) {
                    case "top": return parent.height - ThemeTokens.dp(5)
                    case "bottom": return -ThemeTokens.dp(5)
                    default:
                        if (root.align === "start") return ThemeTokens.dp(16)
                        if (root.align === "end") return parent.height - ThemeTokens.dp(26)
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
                anchors.topMargin: -ThemeTokens.dp(14)
                anchors.horizontalCenter: parent.horizontalCenter
                width: parent.width
                height: ThemeTokens.dp(14)
                color: "transparent"
                radius: ThemeTokens.dp(4)

                Row {
                    anchors.centerIn: parent
                    spacing: ThemeTokens.dp(3)
                    Repeater {
                        model: 5
                        Rectangle {
                            width: ThemeTokens.dp(3)
                            height: ThemeTokens.dp(3)
                            radius: ThemeTokens.dp(1.5)
                            color: ThemeTokens.subduedText
                        }
                    }
                }

                MouseArea {
                    anchors.fill: parent
                    cursorShape: pressed ? Qt.ClosedHandCursor : Qt.OpenHandCursor

                    // 场景坐标基准：手柄随 Popup 一起位移，若用自身局部坐标求差，
                    // 位移量会（负反馈）被吃回一半并抖动 —— 即常见的「浮层跟不上
                    // 鼠标」。mapToItem(null, …) 取窗口坐标，与自身变换无关。
                    property real startSceneX: 0
                    property real startSceneY: 0
                    property real startOffsetX: 0
                    property real startOffsetY: 0

                    onPressed: (mouse) => {
                        var p = mapToItem(null, mouse.x, mouse.y)
                        startSceneX = p.x
                        startSceneY = p.y
                        startOffsetX = root.dragOffsetX
                        startOffsetY = root.dragOffsetY
                    }
                    onPositionChanged: (mouse) => {
                        if (!pressed) return
                        var p = mapToItem(null, mouse.x, mouse.y)
                        root.dragOffsetX = startOffsetX + (p.x - startSceneX)
                        root.dragOffsetY = startOffsetY + (p.y - startSceneY)
                    }
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
