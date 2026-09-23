// ChaSetSplitter.qml — Cross-Stack Splitter Component
import QtQuick 6.10
import ChaSet

Item {
    id: root

    // Orientation follows spec/components/splitter.ts:
    // "vertical" (default): vertical divider line, separating left & right panes
    // "horizontal": horizontal divider line, separating top & bottom panes
    property string orientation: "vertical"
    property real splitRatio: 0.5
    property real minRatio: 0.05
    property real maxRatio: 0.95
    property int initialSize: 50
    property int minSize: Math.round(minRatio * 100)
    property int maxSize: Math.round(maxRatio * 100)
    property int gutterSize: 8
    readonly property int effectiveGutterSize: ThemeTokens.dp(root.gutterSize)

    property real size: Math.round(splitRatio * 100)
    signal change(real newSize)

    onSizeChanged: {
        var targetRatio = Math.max(minRatio, Math.min(maxRatio, root.size / 100.0))
        if (Math.abs(splitRatio - targetRatio) > 0.005) {
            splitRatio = targetRatio
        }
    }

    onSplitRatioChanged: {
        var computedSize = Math.round(splitRatio * 100)
        if (Math.round(root.size) !== computedSize) {
            root.size = computedSize
            root.change(computedSize)
        }
    }

    function reset() {
        splitRatio = initialSize / 100.0
    }

    property Component leftItem: null
    property Component rightItem: null

    implicitWidth: ThemeTokens.dp(400)
    implicitHeight: ThemeTokens.dp(240)

    readonly property bool isVertical: root.orientation === "vertical"

    Item {
        id: firstPane
        x: 0
        y: 0
        width: root.isVertical ? Math.max(0, root.width * root.splitRatio - root.effectiveGutterSize / 2) : root.width
        height: root.isVertical ? root.height : Math.max(0, root.height * root.splitRatio - root.effectiveGutterSize / 2)
        clip: true

        Loader {
            anchors.fill: parent
            sourceComponent: root.leftItem
        }
    }

    // Gutter Separator
    Rectangle {
        id: gutter
        x: root.isVertical ? firstPane.width : 0
        y: root.isVertical ? 0 : firstPane.height
        width: root.isVertical ? root.effectiveGutterSize : root.width
        height: root.isVertical ? root.height : root.effectiveGutterSize
        color: "transparent"
        activeFocusOnTab: true

        Rectangle {
            id: gutterIndicator
            anchors.horizontalCenter: root.isVertical ? parent.horizontalCenter : undefined
            anchors.verticalCenter: !root.isVertical ? parent.verticalCenter : undefined
            anchors.top: root.isVertical ? parent.top : undefined
            anchors.bottom: root.isVertical ? parent.bottom : undefined
            anchors.left: !root.isVertical ? parent.left : undefined
            anchors.right: !root.isVertical ? parent.right : undefined
            width: root.isVertical ? 2 : parent.width
            height: root.isVertical ? parent.height : 2
            radius: 1
            color: ThemeTokens.accent
            opacity: gutterMouse.dragging ? 1.0 : (gutterMouse.containsMouse || gutter.activeFocus ? 0.7 : 0.0)

            Behavior on opacity {
                enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
                NumberAnimation { duration: ThemeTokens.motionQuick; easing.type: ThemeTokens.easeStandard }
            }
        }

        Keys.onLeftPressed: function(event) {
            if (root.isVertical) {
                event.accepted = true
                root.splitRatio = Math.max(root.minRatio, Math.min(root.maxRatio, root.splitRatio - 0.02))
            }
        }

        Keys.onRightPressed: function(event) {
            if (root.isVertical) {
                event.accepted = true
                root.splitRatio = Math.max(root.minRatio, Math.min(root.maxRatio, root.splitRatio + 0.02))
            }
        }

        Keys.onUpPressed: function(event) {
            if (!root.isVertical) {
                event.accepted = true
                root.splitRatio = Math.max(root.minRatio, Math.min(root.maxRatio, root.splitRatio - 0.02))
            }
        }

        Keys.onDownPressed: function(event) {
            if (!root.isVertical) {
                event.accepted = true
                root.splitRatio = Math.max(root.minRatio, Math.min(root.maxRatio, root.splitRatio + 0.02))
            }
        }

        Keys.onPressed: function(event) {
            if (event.key === Qt.Key_Home) {
                event.accepted = true
                root.splitRatio = root.minRatio
            } else if (event.key === Qt.Key_End) {
                event.accepted = true
                root.splitRatio = root.maxRatio
            }
        }

        Keys.onReturnPressed: function(event) {
            event.accepted = true
            root.reset()
        }

        Keys.onEnterPressed: function(event) {
            event.accepted = true
            root.reset()
        }

        MouseArea {
            id: gutterMouse
            anchors.fill: parent
            hoverEnabled: true
            cursorShape: root.isVertical ? Qt.SizeHorCursor : Qt.SizeVerCursor
            property bool dragging: false
            property real dragOffset: 0

            onPressed: function(mouse) {
                gutter.forceActiveFocus()
                dragging = true
                var pt = mapToItem(root, mouse.x, mouse.y)
                dragOffset = root.isVertical ? (pt.x - gutter.x) : (pt.y - gutter.y)
            }

            onReleased: {
                dragging = false
            }

            onCanceled: {
                dragging = false
            }

            onPositionChanged: function(mouse) {
                if (dragging) {
                    var pt = mapToItem(root, mouse.x, mouse.y)
                    if (root.isVertical) {
                        var targetX = pt.x - dragOffset + root.effectiveGutterSize / 2
                        var ratio = targetX / root.width
                        root.splitRatio = Math.max(root.minRatio, Math.min(root.maxRatio, ratio))
                    } else {
                        var targetY = pt.y - dragOffset + root.effectiveGutterSize / 2
                        var ratio = targetY / root.height
                        root.splitRatio = Math.max(root.minRatio, Math.min(root.maxRatio, ratio))
                    }
                }
            }

            onDoubleClicked: {
                root.reset()
            }
        }
    }

    Item {
        id: secondPane
        x: root.isVertical ? (gutter.x + root.effectiveGutterSize) : 0
        y: root.isVertical ? 0 : (gutter.y + root.effectiveGutterSize)
        width: root.isVertical ? Math.max(0, root.width - x) : root.width
        height: root.isVertical ? root.height : Math.max(0, root.height - y)
        clip: true

        Loader {
            anchors.fill: parent
            sourceComponent: root.rightItem
        }
    }
}
