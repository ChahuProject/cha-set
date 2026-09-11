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
            NumberAnimation { duration: ThemeTokens.motionShort; easing.type: Easing.OutQuad }
        }

        radius: 4
        color: ThemeTokens.dark ? "#f8fafc" : "#020817"
        border.color: ThemeTokens.dark ? Qt.rgba(0, 0, 0, 0.15) : Qt.rgba(255, 255, 255, 0.15)
        border.width: 1

        implicitWidth: Math.max(24, contentRow.implicitWidth + 16)
        implicitHeight: Math.max(20, contentRow.implicitHeight + 8)

        Row {
            id: contentRow
            anchors.centerIn: parent
            spacing: 6

            Text {
                id: bubbleText
                text: root.text
                color: ThemeTokens.dark ? "#020817" : "#f8fafc"
                font.pixelSize: 11
                font.weight: Font.Medium
                horizontalAlignment: Text.AlignHCenter
                verticalAlignment: Text.AlignVCenter
                anchors.verticalCenter: parent.verticalCenter
            }

            Rectangle {
                id: shortcutBadge
                visible: root.shortcut.length > 0
                anchors.verticalCenter: parent.verticalCenter
                radius: 3
                color: ThemeTokens.dark ? Qt.rgba(0, 0, 0, 0.1) : Qt.rgba(255, 255, 255, 0.2)
                border.color: ThemeTokens.dark ? Qt.rgba(0, 0, 0, 0.15) : Qt.rgba(255, 255, 255, 0.2)
                border.width: 1
                implicitWidth: shortcutText.implicitWidth + 8
                implicitHeight: shortcutText.implicitHeight + 4

                Text {
                    id: shortcutText
                    anchors.centerIn: parent
                    text: root.shortcut
                    color: ThemeTokens.dark ? "#020817" : "#f8fafc"
                    font.pixelSize: 10
                    font.family: "monospace"
                    font.weight: Font.Medium
                }
            }
        }

        Rectangle {
            id: arrowIndicator
            visible: root.arrow
            width: 6
            height: 6
            rotation: 45
            color: bubble.color
            z: -1
            x: {
                switch (root.side) {
                case "left": return bubble.width - 3
                case "right": return -3
                default: return (bubble.width - width) / 2
                }
            }
            y: {
                switch (root.side) {
                case "top": return bubble.height - 3
                case "bottom": return -3
                default: return (bubble.height - height) / 2
                }
            }
        }
    }
}
