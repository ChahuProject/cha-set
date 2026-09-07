// ChaSetRangeSlider.qml — Cross-Stack Range Slider Component
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root

    property real from: 0.0
    property real to: 100.0
    property real firstValue: 20.0
    property real secondValue: 80.0
    property real stepSize: 1.0
    property bool disabled: false

    signal valuesChanged(real first, real second)

    implicitWidth: 240
    implicitHeight: 28
    opacity: root.disabled ? 0.4 : 1.0

    readonly property real span: Math.max(1, root.to - root.from)

    function posForVal(v) {
        return Math.max(0, Math.min(track.width, ((v - root.from) / root.span) * track.width))
    }

    function valForPos(p) {
        return root.from + (Math.max(0, Math.min(track.width, p)) / track.width) * root.span
    }

    // Slider Track
    Rectangle {
        id: track
        anchors.verticalCenter: parent.verticalCenter
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.margins: 8
        height: 6
        radius: 3
        color: ThemeTokens.hover

        // Active range highlight
        Rectangle {
            x: Math.min(posForVal(root.firstValue), posForVal(root.secondValue))
            width: Math.abs(posForVal(root.secondValue) - posForVal(root.firstValue))
            height: parent.height
            radius: 3
            color: ThemeTokens.accent
        }
    }

    // Thumb 1
    Rectangle {
        id: thumb1
        width: 16
        height: 16
        radius: 8
        color: ThemeTokens.panel
        border.color: ThemeTokens.accent
        border.width: 2
        x: track.x + posForVal(root.firstValue) - width / 2
        anchors.verticalCenter: track.verticalCenter

        MouseArea {
            anchors.fill: parent
            enabled: !root.disabled
            cursorShape: Qt.PointingHandCursor
            drag.target: thumb1
            drag.axis: Drag.XAxis
            drag.minimumX: track.x - thumb1.width / 2
            drag.maximumX: track.x + track.width - thumb1.width / 2

            onPositionChanged: {
                if (drag.active) {
                    let newVal = Math.min(root.secondValue, root.valForPos(thumb1.x + thumb1.width / 2 - track.x))
                    root.firstValue = Math.round(newVal / root.stepSize) * root.stepSize
                    root.valuesChanged(root.firstValue, root.secondValue)
                }
            }
        }
    }

    // Thumb 2
    Rectangle {
        id: thumb2
        width: 16
        height: 16
        radius: 8
        color: ThemeTokens.panel
        border.color: ThemeTokens.accent
        border.width: 2
        x: track.x + posForVal(root.secondValue) - width / 2
        anchors.verticalCenter: track.verticalCenter

        MouseArea {
            anchors.fill: parent
            enabled: !root.disabled
            cursorShape: Qt.PointingHandCursor
            drag.target: thumb2
            drag.axis: Drag.XAxis
            drag.minimumX: track.x - thumb2.width / 2
            drag.maximumX: track.x + track.width - thumb2.width / 2

            onPositionChanged: {
                if (drag.active) {
                    let newVal = Math.max(root.firstValue, root.valForPos(thumb2.x + thumb2.width / 2 - track.x))
                    root.secondValue = Math.round(newVal / root.stepSize) * root.stepSize
                    root.valuesChanged(root.firstValue, root.secondValue)
                }
            }
        }
    }
}
