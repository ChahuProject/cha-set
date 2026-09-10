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
    property bool readOnly: false
    property string size: "default" // "default" | "sm"
    property bool showTooltip: false
    property var formatValue: null
    property real minStepsBetweenThumbs: 0
    property int activeThumb: 1 // 1: first thumb, 2: second thumb

    signal valuesChanged(real first, real second)

    readonly property bool isSm: root.size === "sm"
    readonly property real minGap: root.minStepsBetweenThumbs * root.stepSize

    implicitWidth: 240
    implicitHeight: root.isSm ? 16 : 28
    opacity: root.disabled ? 0.4 : 1.0
    activeFocusOnTab: !root.disabled && !root.readOnly

    readonly property real span: Math.max(1, root.to - root.from)

    function posForVal(v) {
        return Math.max(0, Math.min(track.width, ((v - root.from) / root.span) * track.width))
    }

    function valForPos(p) {
        return root.from + (Math.max(0, Math.min(track.width, p)) / track.width) * root.span
    }

    function stepFirst(delta) {
        if (root.disabled || root.readOnly) return
        let maxAllowed = root.secondValue - root.minGap
        let newVal = Math.max(root.from, Math.min(maxAllowed, root.firstValue + delta))
        root.firstValue = Math.round(newVal / root.stepSize) * root.stepSize
        root.valuesChanged(root.firstValue, root.secondValue)
    }

    function stepSecond(delta) {
        if (root.disabled || root.readOnly) return
        let minAllowed = root.firstValue + root.minGap
        let newVal = Math.max(minAllowed, Math.min(root.to, root.secondValue + delta))
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
        if (root.disabled || root.readOnly) return
        if (event.key === Qt.Key_Home) {
            event.accepted = true
            if (root.activeThumb === 1) {
                root.firstValue = root.from
            } else {
                root.secondValue = Math.max(root.to, root.firstValue + root.minGap)
            }
            root.valuesChanged(root.firstValue, root.secondValue)
        } else if (event.key === Qt.Key_End) {
            event.accepted = true
            if (root.activeThumb === 1) {
                root.firstValue = Math.min(root.secondValue - root.minGap, root.secondValue)
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
        height: root.isSm ? 4 : 6
        radius: root.isSm ? 2 : 3
        color: ThemeTokens.hover

        // Active range highlight
        Rectangle {
            x: Math.min(posForVal(root.firstValue), posForVal(root.secondValue))
            width: Math.abs(posForVal(root.secondValue) - posForVal(root.firstValue))
            height: parent.height
            radius: parent.radius
            color: ThemeTokens.accent
        }
    }

    // Thumb 1
    Rectangle {
        id: thumb1
        width: root.isSm ? 12 : 16
        height: root.isSm ? 12 : 16
        radius: root.isSm ? 6 : 8
        color: ThemeTokens.panel
        border.color: ThemeTokens.accent
        border.width: 2
        x: track.x + posForVal(root.firstValue) - width / 2
        anchors.verticalCenter: track.verticalCenter

        // Focus ring for thumb 1
        Rectangle {
            anchors.fill: parent
            anchors.margins: -2
            radius: thumb1.radius + 2
            color: "transparent"
            border.color: (root.activeFocus && root.activeThumb === 1) ? ThemeTokens.focus : "transparent"
            border.width: 1
            visible: root.activeFocus && root.activeThumb === 1
        }

        // Floating Tooltip Badge for thumb 1
        Rectangle {
            id: tooltip1
            visible: root.showTooltip && (thumb1Mouse.pressed || thumb1Mouse.containsMouse || (root.activeFocus && root.activeThumb === 1))
            z: 10
            width: tooltipText1.implicitWidth + 8
            height: tooltipText1.implicitHeight + 4
            radius: 4
            color: ThemeTokens.panel
            border.color: ThemeTokens.border
            border.width: 1
            anchors.bottom: parent.top
            anchors.bottomMargin: 6
            anchors.horizontalCenter: parent.horizontalCenter

            Text {
                id: tooltipText1
                anchors.centerIn: parent
                text: (typeof root.formatValue === "function") ? root.formatValue(root.firstValue) : Math.round(root.firstValue).toString()
                color: ThemeTokens.text
                font.pixelSize: 11
                font.family: "monospace"
                font.weight: Font.Medium
            }
        }

        WheelHandler {
            enabled: !root.disabled && !root.readOnly
            onWheel: function(event) {
                if (event.angleDelta.y > 0) {
                    root.stepFirst(root.stepSize)
                } else if (event.angleDelta.y < 0) {
                    root.stepFirst(-root.stepSize)
                }
            }
        }

        MouseArea {
            id: thumb1Mouse
            anchors.fill: parent
            hoverEnabled: !root.disabled
            enabled: !root.disabled && !root.readOnly
            cursorShape: root.readOnly ? Qt.ArrowCursor : Qt.PointingHandCursor
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
                    let maxAllowed = root.secondValue - root.minGap
                    let newVal = Math.min(maxAllowed, root.valForPos(thumb1.x + thumb1.width / 2 - track.x))
                    newVal = Math.max(root.from, newVal)
                    root.firstValue = Math.round(newVal / root.stepSize) * root.stepSize
                    root.valuesChanged(root.firstValue, root.secondValue)
                }
            }
        }
    }

    // Thumb 2
    Rectangle {
        id: thumb2
        width: root.isSm ? 12 : 16
        height: root.isSm ? 12 : 16
        radius: root.isSm ? 6 : 8
        color: ThemeTokens.panel
        border.color: ThemeTokens.accent
        border.width: 2
        x: track.x + posForVal(root.secondValue) - width / 2
        anchors.verticalCenter: track.verticalCenter

        // Focus ring for thumb 2
        Rectangle {
            anchors.fill: parent
            anchors.margins: -2
            radius: thumb2.radius + 2
            color: "transparent"
            border.color: (root.activeFocus && root.activeThumb === 2) ? ThemeTokens.focus : "transparent"
            border.width: 1
            visible: root.activeFocus && root.activeThumb === 2
        }

        // Floating Tooltip Badge for thumb 2
        Rectangle {
            id: tooltip2
            visible: root.showTooltip && (thumb2Mouse.pressed || thumb2Mouse.containsMouse || (root.activeFocus && root.activeThumb === 2))
            z: 10
            width: tooltipText2.implicitWidth + 8
            height: tooltipText2.implicitHeight + 4
            radius: 4
            color: ThemeTokens.panel
            border.color: ThemeTokens.border
            border.width: 1
            anchors.bottom: parent.top
            anchors.bottomMargin: 6
            anchors.horizontalCenter: parent.horizontalCenter

            Text {
                id: tooltipText2
                anchors.centerIn: parent
                text: (typeof root.formatValue === "function") ? root.formatValue(root.secondValue) : Math.round(root.secondValue).toString()
                color: ThemeTokens.text
                font.pixelSize: 11
                font.family: "monospace"
                font.weight: Font.Medium
            }
        }

        WheelHandler {
            enabled: !root.disabled && !root.readOnly
            onWheel: function(event) {
                if (event.angleDelta.y > 0) {
                    root.stepSecond(root.stepSize)
                } else if (event.angleDelta.y < 0) {
                    root.stepSecond(-root.stepSize)
                }
            }
        }

        MouseArea {
            id: thumb2Mouse
            anchors.fill: parent
            hoverEnabled: !root.disabled
            enabled: !root.disabled && !root.readOnly
            cursorShape: root.readOnly ? Qt.ArrowCursor : Qt.PointingHandCursor
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
                    let minAllowed = root.firstValue + root.minGap
                    let newVal = Math.max(minAllowed, root.valForPos(thumb2.x + thumb2.width / 2 - track.x))
                    newVal = Math.min(root.to, newVal)
                    root.secondValue = Math.round(newVal / root.stepSize) * root.stepSize
                    root.valuesChanged(root.firstValue, root.secondValue)
                }
            }
        }
    }
}
