// ChaSetTooltip.qml — Cross-stack Tooltip component for Qt Quick Desktop matching React Tooltip 1:1
import QtQuick 6.10
import QtQuick.Controls 6.10
import QtQuick.Shapes 6.10
import ChaSet

Item {
    id: root

    // Component API Contract per spec/components/tooltip.ts
    property string text: ""
    property string side: "top"        // "top" | "bottom" | "left" | "right"
    property bool avoidCollisions: true // false pins exact side placement with no viewport nudging
    property int delay: 200
    property bool active: false
    property bool disabled: false
    property string shortcut: ""
    property bool arrow: false
    property Component customContent: null
    property int sideOffset: 4
    readonly property int effectiveSideOffset: ThemeTokens.dp(root.sideOffset)


    // Optional explicit target item outside this container
    property Item target: null

    // Testing and visual state hooks
    property bool forceHover: false
    property bool hovered: false

    // Allow wrapping child components directly
    default property alias content: contentContainer.data

    readonly property Item wrappedItem: (contentContainer.children.length > 0) ? contentContainer.children[0] : null
    readonly property Item effectiveTarget: target ? target : (wrappedItem ? wrappedItem : parent)

    implicitWidth: wrappedItem ? wrappedItem.implicitWidth : (parent ? parent.width : 0)
    implicitHeight: wrappedItem ? wrappedItem.implicitHeight : (parent ? parent.height : 0)
    width: wrappedItem ? wrappedItem.width : (parent ? parent.width : 0)
    height: wrappedItem ? wrappedItem.height : (parent ? parent.height : 0)

    Item {
        id: contentContainer
        anchors.fill: parent
    }

    // Global layer: parent the bubble to the window Overlay so it renders above
    // every clipped ancestor (dialogs, draggable modals, preview stages) instead
    // of being cut off by `clip: true` containers. Falls back to local rendering
    // when no Overlay is available. Same idiom as ChaSetDialog's root parent.
    readonly property Item overlayLayer: (typeof Overlay !== "undefined" && Overlay.overlay) ? Overlay.overlay : null
    readonly property Item positionSpace: bubble.parent

    readonly property point targetPosInSpace: {
        if (!positionSpace || !effectiveTarget) return Qt.point(0, 0)
        var _depX = effectiveTarget.x
        var _depY = effectiveTarget.y
        var _depW = effectiveTarget.width
        var _depH = effectiveTarget.height
        var _depScale = ThemeTokens.uiScale
        var _depSpaceW = positionSpace.width
        var _depSpaceH = positionSpace.height
        var _rev = root.clampRevision
        var _show = root.shouldShow
        try {
            return positionSpace.mapFromItem(effectiveTarget, 0, 0)
        } catch (e) {
            return Qt.point(0, 0)
        }
    }

    readonly property real targetX: targetPosInSpace.x
    readonly property real targetY: targetPosInSpace.y
    readonly property real targetW: effectiveTarget ? effectiveTarget.width : root.width
    readonly property real targetH: effectiveTarget ? effectiveTarget.height : root.height

    readonly property real calculatedX: {
        switch (root.side) {
        case "top":
        case "bottom":
            return targetX + (targetW - bubble.width) / 2
        case "left":
            return targetX - bubble.width - effectiveSideOffset
        case "right":
            return targetX + targetW + effectiveSideOffset
        default:
            return targetX + (targetW - bubble.width) / 2
        }
    }

    readonly property real calculatedY: {
        switch (root.side) {
        case "top":
            return targetY - bubble.height - effectiveSideOffset
        case "bottom":
            return targetY + targetH + effectiveSideOffset
        case "left":
        case "right":
            return targetY + (targetH - bubble.height) / 2
        default:
            return targetY - bubble.height - effectiveSideOffset
        }
    }

    property int clampRevision: 0

    readonly property real clampedX: {
        var base = calculatedX
        if (!root.shouldShow) return base
        if (!root.avoidCollisions) return base
        var margin = ThemeTokens.dp(8)
        var _scale = ThemeTokens.uiScale
        var _tw = targetW
        var _bw = bubble.width
        var _rev = root.clampRevision
        if (root.overlayLayer) {
            // Coordinates are already in overlay space: clamp directly.
            var _ow = root.overlayLayer.width
            if (bubble.width > 0) {
                if (root.side === "top" || root.side === "bottom") {
                    if (base + bubble.width > _ow - margin) {
                        base -= (base + bubble.width - (_ow - margin))
                    }
                    if (base < margin) {
                        base += (margin - base)
                    }
                } else if (root.side === "left") {
                    if (base < margin) {
                        base += (margin - base)
                    }
                } else if (root.side === "right") {
                    if (base + bubble.width > _ow - margin) {
                        base -= (base + bubble.width - (_ow - margin))
                    }
                }
            }
            return base
        }
        var win = root.Window.window
        if (win && bubble.width > 0) {
            try {
                var mapped = root.mapToItem(null, base, 0)
                if (root.side === "top" || root.side === "bottom") {
                    if (mapped.x + bubble.width > win.width - margin) {
                        base -= (mapped.x + bubble.width - (win.width - margin))
                    }
                    if (mapped.x < margin) {
                        base += (margin - mapped.x)
                    }
                } else if (root.side === "left") {
                    if (mapped.x < margin) {
                        base += (margin - mapped.x)
                    }
                } else if (root.side === "right") {
                    if (mapped.x + bubble.width > win.width - margin) {
                        base -= (mapped.x + bubble.width - (win.width - margin))
                    }
                }
            } catch (e) {}
        }
        return base
    }

    readonly property real clampedY: {
        var base = calculatedY
        if (!root.shouldShow) return base
        if (!root.avoidCollisions) return base
        var margin = ThemeTokens.dp(8)
        var _scale = ThemeTokens.uiScale
        var _th = targetH
        var _bh = bubble.height
        var _rev = root.clampRevision
        if (root.overlayLayer) {
            // Coordinates are already in overlay space: clamp directly.
            var _oh = root.overlayLayer.height
            if (bubble.height > 0) {
                if (root.side === "left" || root.side === "right") {
                    if (base + bubble.height > _oh - margin) {
                        base -= (base + bubble.height - (_oh - margin))
                    }
                    if (base < margin) {
                        base += (margin - base)
                    }
                } else if (root.side === "top") {
                    if (base < margin) {
                        base += (margin - base)
                    }
                } else if (root.side === "bottom") {
                    if (base + bubble.height > _oh - margin) {
                        base -= (base + bubble.height - (_oh - margin))
                    }
                }
            }
            return base
        }
        var win = root.Window.window
        if (win && bubble.height > 0) {
            try {
                var mappedY = root.mapToItem(null, 0, base)
                if (root.side === "left" || root.side === "right") {
                    if (mappedY.y + bubble.height > win.height - margin) {
                        base -= (mappedY.y + bubble.height - (win.height - margin))
                    }
                    if (mappedY.y < margin) {
                        base += (margin - mappedY.y)
                    }
                } else if (root.side === "top") {
                    if (mappedY.y < margin) {
                        base += (margin - mappedY.y)
                    }
                } else if (root.side === "bottom") {
                    if (mappedY.y + bubble.height > win.height - margin) {
                        base -= (mappedY.y + bubble.height - (win.height - margin))
                    }
                }
            } catch (e) {}
        }
        return base
    }

    property bool internalActive: false

    readonly property var globalService: {
        if (typeof tooltipService !== "undefined" && tooltipService && typeof tooltipService.request === "function")
            return tooltipService
        if (typeof tooltip !== "undefined" && tooltip && typeof tooltip.request === "function")
            return tooltip
        return null
    }
    readonly property bool useGlobalService: (globalService !== null && root.customContent === null)

    readonly property bool effectiveHovered: (hoverHandler.hovered || root.hovered || root.forceHover) && !root.disabled && (root.text.length > 0 || root.customContent !== null)

    readonly property bool shouldShow: (root.active || root.internalActive || root.forceHover) && !root.disabled && (root.text.length > 0 || root.customContent !== null)

    function syncGlobalService() {
        if (!useGlobalService || !globalService) return
        var wantShow = (effectiveHovered || root.active) && !root.disabled && (root.text.length > 0 || root.customContent !== null)
        if (wantShow) {
            globalService.request({
                source: root,
                targetItem: root.effectiveTarget,
                text: root.text,
                shortcut: root.shortcut,
                placement: root.side,
                delay: root.delay
            })
        } else {
            globalService.cancel(root)
        }
    }

    onEffectiveHoveredChanged: root.syncGlobalService()
    onActiveChanged: root.syncGlobalService()
    onTextChanged: root.syncGlobalService()
    onEffectiveTargetChanged: root.syncGlobalService()

    Shortcut {
        sequence: "Escape"
        autoRepeat: false
        enabled: root.shouldShow && !root.disabled && ChaSetOverlayHub.count === 0
        onActivated: {
            root.internalActive = false
            if (useGlobalService && globalService) {
                globalService.cancel(root)
            }
        }
    }

    onShouldShowChanged: {
        root.clampRevision++
    }

    Component.onDestruction: {
        if (useGlobalService && globalService) {
            globalService.cancel(root)
        }
    }

    onHoveredChanged: {
        if (!useGlobalService) {
            if (hovered && !root.disabled) {
                if (root.delay <= 0) {
                    root.internalActive = true
                } else {
                    delayTimer.restart()
                }
            } else if (!hoverHandler.hovered) {
                delayTimer.stop()
                root.internalActive = false
            }
        }
    }

    HoverHandler {
        id: hoverHandler
        parent: root.effectiveTarget ? root.effectiveTarget : root
        enabled: !root.disabled
        onHoveredChanged: {
            root.hovered = hovered
            if (!root.useGlobalService) {
                if (hovered && !root.disabled) {
                    if (root.delay <= 0) {
                        root.internalActive = true
                    } else {
                        delayTimer.restart()
                    }
                } else if (!root.hovered) {
                    delayTimer.stop()
                    root.internalActive = false
                }
            }
        }
    }

    Timer {
        id: delayTimer
        interval: Math.max(0, root.delay)
        repeat: false
        onTriggered: {
            if (!root.disabled && (hoverHandler.hovered || root.hovered)) {
                root.internalActive = true
            }
        }
    }

    // Overlay-space coordinates go stale when an ancestor moves the trigger
    // (e.g. dragging the modal while its close tooltip is open): the local
    // bubble would follow its parent for free, the global one needs a refresh.
    Timer {
        id: followTimer
        interval: 50
        repeat: true
        running: root.shouldShow && root.overlayLayer !== null
        onTriggered: root.clampRevision++
    }

    onDisabledChanged: {
        if (disabled) {
            if (useGlobalService && globalService) {
                globalService.cancel(root)
            }
            delayTimer.stop()
            internalActive = false
        }
    }

    ChaSetSquircle {
        id: bubble
        parent: root.overlayLayer ? root.overlayLayer : root
        z: 999
        visible: !root.useGlobalService && root.shouldShow
        x: Math.round(root.clampedX)
        y: Math.round(root.clampedY)
        opacity: visible ? 1.0 : 0.0
        scale: visible ? 1.0 : 0.95

        Behavior on opacity {
            enabled: ThemeTokens.animationsEnabled && !root.forceHover && (typeof harnessMode === "undefined" || harnessMode === "")
            NumberAnimation { duration: ThemeTokens.motionShort; easing.type: ThemeTokens.easeStandard }
        }
        Behavior on scale {
            enabled: ThemeTokens.animationsEnabled && !root.forceHover && (typeof harnessMode === "undefined" || harnessMode === "")
            NumberAnimation { duration: ThemeTokens.motionShort; easing.type: ThemeTokens.easeStandard }
        }

        radius: ThemeTokens.dp(4)
        color: ThemeTokens.dark ? ThemeTokens.color("panelRaised") : "#ffffff"
        border.color: ThemeTokens.color("border")
        border.width: 1

        implicitWidth: Math.max(ThemeTokens.dp(24), contentRow.implicitWidth + ThemeTokens.dp(16))
        implicitHeight: Math.max(ThemeTokens.dp(20), contentRow.implicitHeight + ThemeTokens.dp(8))

        Row {
            id: contentRow
            anchors.centerIn: parent
            spacing: ThemeTokens.dp(6)

            Loader {
                id: customContentLoader
                visible: root.customContent !== null
                sourceComponent: root.customContent
                anchors.verticalCenter: parent.verticalCenter
            }

            Text {
                id: bubbleText
                visible: root.customContent === null && root.text.length > 0
                text: root.text
                color: ThemeTokens.color("text")
                font.pixelSize: Typography.sizeCaption
                font.weight: Font.Medium
                horizontalAlignment: Text.AlignHCenter
                verticalAlignment: Text.AlignVCenter
                anchors.verticalCenter: parent.verticalCenter
            }

            ChaSetKbd {
                id: shortcutBadge
                visible: root.shortcut.length > 0
                anchors.verticalCenter: parent ? parent.verticalCenter : undefined
                variant: "outline"
                size: "xs"
                compact: "never"
                shortcut: root.shortcut
            }
        }


        // Seamless triangle pointer — fill covers the bubble border segment,
        // angled strokes redraw only the two outer edges (open base).
        // Mirrors ChaSetPopover.qml arrowIndicator; rotated-square Rectangle
        // leaves the bubble border line visible between arrow and body.
        Shape {
            id: arrowIndicator
            visible: root.arrow
            z: 1
            readonly property int arrowW: ThemeTokens.dp(8)
            readonly property int arrowH: ThemeTokens.dp(4)
            width: (root.side === "left" || root.side === "right") ? (arrowH + 1) : arrowW
            height: (root.side === "left" || root.side === "right") ? arrowW : (arrowH + 1)
            x: {
                switch (root.side) {
                case "left": return bubble.width - 1
                case "right": return -arrowH
                default: return (bubble.width - width) / 2
                }
            }
            y: {
                switch (root.side) {
                case "top": return bubble.height - 1
                case "bottom": return -arrowH
                default: return (bubble.height - height) / 2
                }
            }

            // Fill triangle covering container border line
            ShapePath {
                strokeWidth: 0
                strokeColor: "transparent"
                fillColor: bubble.color
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
                strokeColor: bubble.border.color
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
}
