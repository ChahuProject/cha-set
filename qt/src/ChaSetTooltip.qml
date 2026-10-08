// ChaSetTooltip.qml — Cross-stack Tooltip component for Qt Quick Desktop matching React Tooltip 1:1
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root

    // Component API Contract per spec/components/tooltip.ts
    property string text: ""
    property string side: "top"        // "top" | "bottom" | "left" | "right"
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

    readonly property point targetPosInRoot: {
        if (!effectiveTarget) return Qt.point(0, 0)
        if (effectiveTarget === root) return Qt.point(0, 0)
        var _depX = effectiveTarget.x
        var _depY = effectiveTarget.y
        var _depW = effectiveTarget.width
        var _depH = effectiveTarget.height
        var _depScale = ThemeTokens.uiScale
        var _depRootX = root.x
        var _depRootY = root.y
        try {
            return root.mapFromItem(effectiveTarget, 0, 0)
        } catch (e) {
            return Qt.point(0, 0)
        }
    }

    readonly property real targetX: targetPosInRoot.x
    readonly property real targetY: targetPosInRoot.y
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

    readonly property real clampedX: {
        var base = calculatedX
        var win = root.Window.window
        var margin = ThemeTokens.dp(8)
        var _scale = ThemeTokens.uiScale
        var _tw = targetW
        var _bw = bubble.width
        if (win) {
            try {
                var mapped = root.mapToItem(null, base, 0)
                if (mapped.x + bubble.width > win.width - margin) {
                    base -= (mapped.x + bubble.width - (win.width - margin))
                }
                if (mapped.x < margin) {
                    base += (margin - mapped.x)
                }
            } catch (e) {}
        }
        return base
    }

    readonly property real clampedY: {
        var base = calculatedY
        var win = root.Window.window
        var margin = ThemeTokens.dp(8)
        var _scale = ThemeTokens.uiScale
        var _th = targetH
        var _bh = bubble.height
        if (win) {
            try {
                var mappedY = root.mapToItem(null, 0, base)
                if (mappedY.y + bubble.height > win.height - margin) {
                    base -= (mappedY.y + bubble.height - (win.height - margin))
                }
                if (mappedY.y < margin) {
                    base += (margin - mappedY.y)
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

    readonly property bool shouldShow: (root.active || root.internalActive || root.forceHover) && !root.disabled && (root.text.length > 0 || root.customContent !== null)

    onShouldShowChanged: {
        if (useGlobalService && globalService) {
            if (shouldShow) {
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
    }

    Component.onDestruction: {
        if (useGlobalService && globalService) {
            globalService.cancel(root)
        }
    }

    onHoveredChanged: {
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

    HoverHandler {
        id: hoverHandler
        parent: root.effectiveTarget ? root.effectiveTarget : root
        enabled: !root.disabled
        onHoveredChanged: {
            root.hovered = hovered
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

    onDisabledChanged: {
        if (disabled) {
            delayTimer.stop()
            internalActive = false
        }
    }

    ChaSetSquircle {
        id: bubble
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


        Rectangle {
            id: arrowIndicator
            visible: root.arrow
            width: ThemeTokens.dp(6)
            height: ThemeTokens.dp(6)
            rotation: 45
            color: bubble.color
            z: -1
            x: {
                switch (root.side) {
                case "left": return bubble.width - ThemeTokens.dp(3)
                case "right": return -ThemeTokens.dp(3)
                default: return (bubble.width - width) / 2
                }
            }
            y: {
                switch (root.side) {
                case "top": return bubble.height - ThemeTokens.dp(3)
                case "bottom": return -ThemeTokens.dp(3)
                default: return (bubble.height - height) / 2
                }
            }
        }
    }
}
