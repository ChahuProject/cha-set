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
    readonly property int sideOffset: 6

    readonly property real calculatedX: {
        switch (root.side) {
        case "top":
        case "bottom":
            return targetX + (targetW - bubble.width) / 2
        case "left":
            return targetX - bubble.width - sideOffset
        case "right":
            return targetX + targetW + sideOffset
        default:
            return targetX + (targetW - bubble.width) / 2
        }
    }

    readonly property real calculatedY: {
        switch (root.side) {
        case "top":
            return targetY - bubble.height - sideOffset
        case "bottom":
            return targetY + targetH + sideOffset
        case "left":
        case "right":
            return targetY + (targetH - bubble.height) / 2
        default:
            return targetY - bubble.height - sideOffset
        }
    }

    readonly property bool shouldShow: (root.active || root.forceHover) && !root.disabled && (root.text.length > 0)

    HoverHandler {
        id: hoverHandler
        parent: root.effectiveTarget ? root.effectiveTarget : root
        enabled: !root.disabled
        onHoveredChanged: {
            root.hovered = hovered
            if (hovered && !root.disabled) {
                if (root.delay <= 0) {
                    root.active = true
                } else {
                    delayTimer.restart()
                }
            } else {
                delayTimer.stop()
                root.active = false
            }
        }
    }

    Timer {
        id: delayTimer
        interval: Math.max(0, root.delay)
        repeat: false
        onTriggered: {
            if (!root.disabled && (hoverHandler.hovered || root.hovered)) {
                root.active = true
            }
        }
    }

    onDisabledChanged: {
        if (disabled) {
            delayTimer.stop()
            active = false
        }
    }

    Rectangle {
        id: bubble
        z: 999
        x: Math.round(root.calculatedX)
        y: Math.round(root.calculatedY)
        visible: root.shouldShow
        opacity: visible ? 1.0 : 0.0

        Behavior on opacity {
            NumberAnimation { duration: 150; easing.type: Easing.OutQuad }
        }

        radius: 4
        color: ThemeTokens.dark ? "#f8fafc" : "#020817"
        border.color: ThemeTokens.dark ? Qt.rgba(0, 0, 0, 0.15) : Qt.rgba(255, 255, 255, 0.15)
        border.width: 1

        implicitWidth: Math.max(24, bubbleText.implicitWidth + 16)
        implicitHeight: Math.max(20, bubbleText.implicitHeight + 8)

        Text {
            id: bubbleText
            anchors.centerIn: parent
            text: root.text
            color: ThemeTokens.dark ? "#020817" : "#f8fafc"
            font.pixelSize: 11
            font.weight: Font.Medium
            horizontalAlignment: Text.AlignHCenter
            verticalAlignment: Text.AlignVCenter
        }
    }
}
