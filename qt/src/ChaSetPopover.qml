// ChaSetPopover.qml — Cross-Stack Popover Component
import QtQuick 6.10
import QtQuick.Controls 6.10
import QtQuick.Shapes 6.10
import ChaSet

Item {
    id: root

    property bool open: false
    property string side: "bottom"      // "top" | "bottom" | "left" | "right"
    property string align: "start"      // "start" | "center" | "end"
    property int sideOffset: 8
    property int popoverWidth: 260
    property int popoverHeight: 160
    readonly property int effectiveSideOffset: ThemeTokens.dp(sideOffset)
    readonly property int effectivePopoverWidth: ThemeTokens.dp(popoverWidth)
    readonly property int effectivePopoverHeight: ThemeTokens.dp(popoverHeight)
    property int customRadius: 8
    readonly property int effectiveRadius: ThemeTokens.dp(customRadius)
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
                baseX = -root.effectivePopoverWidth - root.effectiveSideOffset
            } else if (root.side === "right") {
                baseX = root.width + root.effectiveSideOffset
            } else {
                if (root.align === "start") baseX = 0
                else if (root.align === "end") baseX = root.width - root.effectivePopoverWidth
                else baseX = (root.width - root.effectivePopoverWidth) / 2
            }
            return baseX + root.dragOffsetX
        }
        y: {
            var baseY = 0
            if (root.side === "top") {
                baseY = -root.effectivePopoverHeight - root.effectiveSideOffset
            } else if (root.side === "bottom") {
                baseY = root.height + root.effectiveSideOffset
            } else {
                if (root.align === "start") baseY = 0
                else if (root.align === "end") baseY = root.height - root.effectivePopoverHeight
                else baseY = (root.height - root.effectivePopoverHeight) / 2
            }
            return baseY + root.dragOffsetY
        }
        width: root.effectivePopoverWidth
        height: root.effectivePopoverHeight
        padding: ThemeTokens.dp(12)
        topPadding: root.movable ? ThemeTokens.dp(28) : ThemeTokens.dp(12)
        bottomPadding: ThemeTokens.dp(12)
        leftPadding: ThemeTokens.dp(12)
        rightPadding: ThemeTokens.dp(12)
        modal: root.modal
        dim: root.modal
        focus: true
        closePolicy: Popup.CloseOnEscape | Popup.CloseOnPressOutside

        background: ChaSetSquircle {
            color: ThemeTokens.panel
            border.color: ThemeTokens.border
            border.width: 1
            radius: root.effectiveRadius
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

            // Seamless triangle pointer arrow indicator
            Shape {
                id: arrowIndicator
                visible: root.arrow
                z: 1
                readonly property int arrowW: ThemeTokens.dp(12)
                readonly property int arrowH: ThemeTokens.dp(6)
                width: (root.side === "left" || root.side === "right") ? (arrowH + 1) : arrowW
                height: (root.side === "left" || root.side === "right") ? arrowW : (arrowH + 1)
                x: {
                    switch (root.side) {
                    case "left": return parent.width - 1
                    case "right": return -arrowH
                    default:
                        if (root.align === "start") return ThemeTokens.dp(16)
                        if (root.align === "end") return parent.width - ThemeTokens.dp(16) - width
                        return (parent.width - width) / 2
                    }
                }
                y: {
                    switch (root.side) {
                    case "top": return parent.height - 1
                    case "bottom": return -arrowH
                    default:
                        if (root.align === "start") return ThemeTokens.dp(16)
                        if (root.align === "end") return parent.height - ThemeTokens.dp(16) - height
                        return (parent.height - height) / 2
                    }
                }

                // Fill triangle covering container border line
                ShapePath {
                    strokeWidth: 0
                    strokeColor: "transparent"
                    fillColor: ThemeTokens.panel
                    startX: {
                        if (root.side === "bottom" || root.side === "top" || root.side === "left") return 0
                        return arrowIndicator.arrowH + 1 // right
                    }
                    startY: {
                        if (root.side === "bottom") return arrowIndicator.arrowH + 1
                        return 0
                    }
                    PathLine {
                        x: {
                            if (root.side === "bottom" || root.side === "top") return arrowIndicator.arrowW / 2
                            if (root.side === "right") return 0
                            return arrowIndicator.arrowH + 1 // left
                        }
                        y: {
                            if (root.side === "bottom") return 0
                            if (root.side === "top") return arrowIndicator.arrowH + 1
                            return arrowIndicator.arrowW / 2
                        }
                    }
                    PathLine {
                        x: {
                            if (root.side === "bottom" || root.side === "top") return arrowIndicator.arrowW
                            if (root.side === "right") return arrowIndicator.arrowH + 1
                            return 0 // left
                        }
                        y: {
                            if (root.side === "bottom") return arrowIndicator.arrowH + 1
                            if (root.side === "top") return 0
                            return arrowIndicator.arrowW
                        }
                    }
                    PathLine {
                        x: {
                            if (root.side === "bottom" || root.side === "top" || root.side === "left") return 0
                            return arrowIndicator.arrowH + 1 // right
                        }
                        y: {
                            if (root.side === "bottom") return arrowIndicator.arrowH + 1
                            return 0
                        }
                    }
                }

                // Angled border strokes with open base
                ShapePath {
                    strokeWidth: 1
                    strokeColor: ThemeTokens.border
                    fillColor: "transparent"
                    startX: {
                        if (root.side === "bottom" || root.side === "top" || root.side === "left") return 0
                        return arrowIndicator.arrowH + 1 // right
                    }
                    startY: {
                        if (root.side === "bottom") return arrowIndicator.arrowH + 1
                        return 0
                    }
                    PathLine {
                        x: {
                            if (root.side === "bottom" || root.side === "top") return arrowIndicator.arrowW / 2
                            if (root.side === "right") return 0
                            return arrowIndicator.arrowH + 1 // left
                        }
                        y: {
                            if (root.side === "bottom") return 0
                            if (root.side === "top") return arrowIndicator.arrowH + 1
                            return arrowIndicator.arrowW / 2
                        }
                    }
                    PathLine {
                        x: {
                            if (root.side === "bottom" || root.side === "top") return arrowIndicator.arrowW
                            if (root.side === "right") return arrowIndicator.arrowH + 1
                            return 0 // left
                        }
                        y: {
                            if (root.side === "bottom") return arrowIndicator.arrowH + 1
                            if (root.side === "top") return 0
                            return arrowIndicator.arrowW
                        }
                    }
                }
            }
        }

        contentItem: Item {
            // Move Handle if movable is enabled
            Rectangle {
                id: dragHandle
                visible: root.movable
                anchors.top: parent.top
                anchors.topMargin: -ThemeTokens.dp(16)
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
