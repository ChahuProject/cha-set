// ChaSetSplitter.qml — Cross-Stack Splitter Component
import QtQuick 6.10
import ChaSet

Item {
    id: root

    property string orientation: "horizontal" // "horizontal" | "vertical"
    property real splitRatio: 0.5
    property real minRatio: 0.15
    property real maxRatio: 0.85
    property int gutterSize: 6

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
        color: gutterMouse.containsMouse || gutterMouse.drag.active ? ThemeTokens.accent : ThemeTokens.border

        MouseArea {
            id: gutterMouse
            anchors.fill: parent
            hoverEnabled: true
            cursorShape: root.isHorizontal ? Qt.SplitHCursor : Qt.SplitVCursor
            drag.target: gutter
            drag.axis: root.isHorizontal ? Drag.XAxis : Drag.YAxis

            onPositionChanged: {
                if (drag.active) {
                    if (root.isHorizontal) {
                        let ratio = (gutter.x + root.gutterSize / 2) / root.width
                        root.splitRatio = Math.max(root.minRatio, Math.min(root.maxRatio, ratio))
                    } else {
                        let ratio = (gutter.y + root.gutterSize / 2) / root.height
                        root.splitRatio = Math.max(root.minRatio, Math.min(root.maxRatio, ratio))
                    }
                }
            }

            onDoubleClicked: {
                root.splitRatio = 0.5
            }
        }
    }

    Item {
        id: secondPane
        x: root.isHorizontal ? (gutter.x + root.gutterSize) : 0
        y: root.isHorizontal ? 0 : (gutter.y + root.gutterSize)
        width: root.isHorizontal ? (root.width - x) : root.width
        height: root.isHorizontal ? root.height : (root.height - y)
        clip: true

        Loader {
            anchors.fill: parent
            sourceComponent: root.rightItem
        }
    }
}
