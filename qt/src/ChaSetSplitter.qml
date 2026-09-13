// ChaSetSplitter.qml — Cross-Stack Splitter Component
import QtQuick 6.10
import ChaSet

Item {
    id: root

    property string orientation: "horizontal" // "horizontal" | "vertical"
    property real splitRatio: 0.5
    property real minRatio: 0.05
    property real maxRatio: 0.95
    property int initialSize: 50
    property int minSize: Math.round(minRatio * 100)
    property int maxSize: Math.round(maxRatio * 100)
    property int gutterSize: 6

    function reset() {
        splitRatio = initialSize / 100.0
    }

    property Component leftItem: null
    property Component rightItem: null

    implicitWidth: 400
    implicitHeight: 240

    readonly property bool isHorizontal: root.orientation === "horizontal"

    Item {
        id: firstPane
        x: 0
        y: 0
        width: root.isHorizontal ? (root.width * root.splitRatio - root.gutterSize / 2) : root.width
        height: root.isHorizontal ? root.height : (root.height * root.splitRatio - root.gutterSize / 2)
        clip: true

        Loader {
            anchors.fill: parent
            sourceComponent: root.leftItem
        }
    }

    // Gutter Separator
    Rectangle {
        id: gutter
        x: root.isHorizontal ? firstPane.width : 0
        y: root.isHorizontal ? 0 : firstPane.height
        width: root.isHorizontal ? root.gutterSize : root.width
        height: root.isHorizontal ? root.height : root.gutterSize
        color: gutterMouse.containsMouse || gutterMouse.dragging || gutter.activeFocus ? ThemeTokens.accent : ThemeTokens.border
        border.color: gutter.activeFocus ? ThemeTokens.focus : "transparent"
        border.width: gutter.activeFocus ? 1 : 0
        activeFocusOnTab: true

        Behavior on color {
            enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
            ColorAnimation { duration: ThemeTokens.motionQuick; easing.type: ThemeTokens.easeStandard }
        }

        Keys.onLeftPressed: function(event) {
            if (root.isHorizontal) {
                event.accepted = true
                root.splitRatio = Math.max(root.minRatio, Math.min(root.maxRatio, root.splitRatio - 0.02))
            }
        }

        Keys.onRightPressed: function(event) {
            if (root.isHorizontal) {
                event.accepted = true
                root.splitRatio = Math.max(root.minRatio, Math.min(root.maxRatio, root.splitRatio + 0.02))
            }
        }

        Keys.onUpPressed: function(event) {
            if (!root.isHorizontal) {
                event.accepted = true
                root.splitRatio = Math.max(root.minRatio, Math.min(root.maxRatio, root.splitRatio - 0.02))
            }
        }

        Keys.onDownPressed: function(event) {
            if (!root.isHorizontal) {
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
            cursorShape: root.isHorizontal ? Qt.SplitHCursor : Qt.SplitVCursor
            property bool dragging: false
            property real dragOffset: 0

            onPressed: function(mouse) {
                gutter.forceActiveFocus()
                dragging = true
                var pt = mapToItem(root, mouse.x, mouse.y)
                dragOffset = root.isHorizontal ? (pt.x - gutter.x) : (pt.y - gutter.y)
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
                    if (root.isHorizontal) {
                        var targetX = pt.x - dragOffset + root.gutterSize / 2
                        var ratio = targetX / root.width
                        root.splitRatio = Math.max(root.minRatio, Math.min(root.maxRatio, ratio))
                    } else {
                        var targetY = pt.y - dragOffset + root.gutterSize / 2
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
        x: root.isHorizontal ? (gutter.x + root.gutterSize) : 0
        y: root.isHorizontal ? 0 : (gutter.y + root.gutterSize)
        width: root.isHorizontal ? Math.max(0, root.width - x) : root.width
        height: root.isHorizontal ? root.height : Math.max(0, root.height - y)
        clip: true

        Loader {
            anchors.fill: parent
            sourceComponent: root.rightItem
        }
    }
}
