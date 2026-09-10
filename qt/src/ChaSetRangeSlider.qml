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
    property int activeThumb: 1 // 1: first thumb, 2: second thumb

    signal valuesChanged(real first, real second)

    implicitWidth: 240
    implicitHeight: 28
    opacity: root.disabled ? 0.4 : 1.0
    activeFocusOnTab: !root.disabled

    readonly property real span: Math.max(1, root.to - root.from)

    function posForVal(v) {
        return Math.max(0, Math.min(track.width, ((v - root.from) / root.span) * track.width))
    }

    function valForPos(p) {
        return root.from + (Math.max(0, Math.min(track.width, p)) / track.width) * root.span
    }

    function stepFirst(delta) {
        let newVal = Math.max(root.from, Math.min(root.secondValue, root.firstValue + delta))
        root.firstValue = Math.round(newVal / root.stepSize) * root.stepSize
        root.valuesChanged(root.firstValue, root.secondValue)
    }

    function stepSecond(delta) {
        let newVal = Math.max(root.firstValue, Math.min(root.to, root.secondValue + delta))
        root.secondValue = Math.round(newVal / root.stepSize) * root.stepSize
        root.valuesChanged(root.firstValue, root.secondValue)
    }

    Keys.onTabPressed: function(event) {
        root.activeThumb = (root.activeThumb === 1 ? 2 : 1)
        event.accepted = true
    }

    Keys.onBacktabPressed: function(event) {
        root.activeThumb = (root.activeThumb === 1 ? 2 : 1)
        event.accepted = true
    }

    Keys.onLeftPressed: function(event) {
        event.accepted = true
        if (root.activeThumb === 1) stepFirst(-root.stepSize)
        else stepSecond(-root.stepSize)
    }

    Keys.onDownPressed: function(event) {
        event.accepted = true
        if (root.activeThumb === 1) stepFirst(-root.stepSize)
        else stepSecond(-root.stepSize)
    }

    Keys.onRightPressed: function(event) {
        event.accepted = true
        if (root.activeThumb === 1) stepFirst(root.stepSize)
        else stepSecond(root.stepSize)
    }

    Keys.onUpPressed: function(event) {
        event.accepted = true
        if (root.activeThumb === 1) stepFirst(root.stepSize)
        else stepSecond(root.stepSize)
    }

    Keys.onPressed: function(event) {
        if (event.key === Qt.Key_Home) {
            event.accepted = true
            if (root.activeThumb === 1) {
                root.firstValue = root.from
            } else {
                root.secondValue = root.firstValue
            }
            root.valuesChanged(root.firstValue, root.secondValue)
        } else if (event.key === Qt.Key_End) {
            event.accepted = true
            if (root.activeThumb === 1) {
                root.firstValue = root.secondValue
            } else {
                root.secondValue = root.to
            }
            root.valuesChanged(root.firstValue, root.secondValue)
        }
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

        // Focus ring for thumb 1
        Rectangle {
            anchors.fill: parent
            anchors.margins: -3
            radius: 11
            color: "transparent"
            border.color: (root.activeFocus && root.activeThumb === 1) ? ThemeTokens.focus : "transparent"
            border.width: 2
            visible: root.activeFocus && root.activeThumb === 1
        }

        MouseArea {
            anchors.fill: parent
            enabled: !root.disabled
            cursorShape: Qt.PointingHandCursor
            drag.target: thumb1
            drag.axis: Drag.XAxis
            drag.minimumX: track.x - thumb1.width / 2
            drag.maximumX: track.x + track.width - thumb1.width / 2

            onPressed: {
                root.activeThumb = 1
                root.forceActiveFocus()
            }

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

        // Focus ring for thumb 2
        Rectangle {
            anchors.fill: parent
            anchors.margins: -3
            radius: 11
            color: "transparent"
            border.color: (root.activeFocus && root.activeThumb === 2) ? ThemeTokens.focus : "transparent"
            border.width: 2
            visible: root.activeFocus && root.activeThumb === 2
        }

        MouseArea {
            anchors.fill: parent
            enabled: !root.disabled
            cursorShape: Qt.PointingHandCursor
            drag.target: thumb2
            drag.axis: Drag.XAxis
            drag.minimumX: track.x - thumb2.width / 2
            drag.maximumX: track.x + track.width - thumb2.width / 2

            onPressed: {
                root.activeThumb = 2
                root.forceActiveFocus()
            }

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
