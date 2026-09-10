// ChaSetSlider.qml — Cross-Stack Slider Component
// 100% Pixel-Perfect & Behavioral Parity with React Slider.tsx
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root

    property real value: 0
    property real min: 0
    property real max: 100
    property real step: 1
    property bool disabled: false
    property bool readOnly: false
    property string size: "default" // "default" | "sm"
    property string orientation: "horizontal" // "horizontal" | "vertical"
    property bool showTicks: false
    property var marks: []
    property bool showTooltip: false
    property var formatValue: null
    property bool forceHover: false
    property bool forceFocus: false

    signal valueMoved(real value)

    readonly property bool isDark: ThemeTokens.dark
    readonly property bool isHorizontal: root.orientation === "horizontal"
    readonly property bool isSm: root.size === "sm"
    readonly property bool isFocused: root.forceFocus || root.activeFocus
    readonly property bool isHovered: root.forceHover || mouseArea.containsMouse
    readonly property bool isDragging: mouseArea.pressed

    implicitWidth: root.isHorizontal ? 200 : (root.isSm ? 16 : 20)
    implicitHeight: root.isHorizontal ? (root.isSm ? 16 : 20) : 200

    opacity: root.disabled ? 0.5 : 1.0
    activeFocusOnTab: !root.disabled && !root.readOnly

    readonly property real progress: (root.max > root.min)
        ? Math.max(0.0, Math.min(1.0, (root.value - root.min) / (root.max - root.min)))
        : 0.0

    readonly property real maxTravelX: Math.max(0, root.width - thumb.width)
    readonly property real maxTravelY: Math.max(0, root.height - thumb.height)

    function quantize(rawVal) {
        var clamped = Math.max(root.min, Math.min(root.max, rawVal));
        if (root.step <= 0) return clamped;
        var steps = Math.round((clamped - root.min) / root.step);
        var stepped = root.min + steps * root.step;
        var decimals = 0;
        var parts = root.step.toString().split(".");
        if (parts.length > 1) {
            decimals = parts[1].length;
        }
        var fixed = parseFloat(Math.max(root.min, Math.min(root.max, stepped)).toFixed(decimals));
        return fixed;
    }

    function updateThumbFromValue() {
        if (root.isHorizontal) {
            thumb.x = Math.max(0, Math.min(root.maxTravelX, root.progress * root.maxTravelX));
        } else {
            thumb.y = Math.max(0, Math.min(root.maxTravelY, (1.0 - root.progress) * root.maxTravelY));
        }
    }

    function updateFromMouse(mouseX, mouseY) {
        if (root.disabled || root.readOnly) return;
        var ratio = 0.0;
        if (root.isHorizontal) {
            if (root.maxTravelX <= 0) return;
            var relX = mouseX - (thumb.width / 2);
            ratio = Math.max(0.0, Math.min(1.0, relX / root.maxTravelX));
            thumb.x = ratio * root.maxTravelX;
        } else {
            if (root.maxTravelY <= 0) return;
            var relY = mouseY - (thumb.height / 2);
            ratio = Math.max(0.0, Math.min(1.0, 1.0 - (relY / root.maxTravelY)));
            thumb.y = (1.0 - ratio) * root.maxTravelY;
        }
        var rawVal = root.min + ratio * (root.max - root.min);
        var nextVal = quantize(rawVal);
        if (nextVal !== root.value) {
            root.value = nextVal;
            root.valueMoved(nextVal);
        }
    }

    function stepUp() {
        if (root.disabled || root.readOnly) return;
        var next = quantize(root.value + root.step);
        if (next !== root.value) {
            root.value = next;
            root.valueMoved(next);
            updateThumbFromValue();
        }
    }

    function stepDown() {
        if (root.disabled || root.readOnly) return;
        var next = quantize(root.value - root.step);
        if (next !== root.value) {
            root.value = next;
            root.valueMoved(next);
            updateThumbFromValue();
        }
    }

    onProgressChanged: {
        if (!root.isDragging) {
            updateThumbFromValue();
        }
    }

    onWidthChanged: {
        if (!root.isDragging) {
            updateThumbFromValue();
        }
    }

    onHeightChanged: {
        if (!root.isDragging) {
            updateThumbFromValue();
        }
    }

    Component.onCompleted: {
        updateThumbFromValue();
    }

    // Keys interaction
    Keys.onLeftPressed: function(event) {
        if (!root.disabled && !root.readOnly && root.isHorizontal) {
            root.stepDown();
            event.accepted = true;
        }
    }

    Keys.onRightPressed: function(event) {
        if (!root.disabled && !root.readOnly && root.isHorizontal) {
            root.stepUp();
            event.accepted = true;
        }
    }

    Keys.onUpPressed: function(event) {
        if (!root.disabled && !root.readOnly) {
            root.stepUp();
            event.accepted = true;
        }
    }

    Keys.onDownPressed: function(event) {
        if (!root.disabled && !root.readOnly) {
            root.stepDown();
            event.accepted = true;
        }
    }

    Keys.onPressed: function(event) {
        if (root.disabled || root.readOnly) return;
        if (event.key === Qt.Key_PageUp) {
            for (var i = 0; i < 10; i++) root.stepUp();
            event.accepted = true;
        } else if (event.key === Qt.Key_PageDown) {
            for (var j = 0; j < 10; j++) root.stepDown();
            event.accepted = true;
        } else if (event.key === Qt.Key_Home) {
            root.value = root.min;
            event.accepted = true;
        } else if (event.key === Qt.Key_End) {
            root.value = root.max;
            event.accepted = true;
        }
    }

    // Track
    Rectangle {
        id: track
        anchors.left: root.isHorizontal ? parent.left : undefined
        anchors.right: root.isHorizontal ? parent.right : undefined
        anchors.leftMargin: root.isHorizontal ? (root.isSm ? 6 : 8) : 0
        anchors.rightMargin: root.isHorizontal ? (root.isSm ? 6 : 8) : 0
        anchors.top: !root.isHorizontal ? parent.top : undefined
        anchors.bottom: !root.isHorizontal ? parent.bottom : undefined
        anchors.topMargin: !root.isHorizontal ? (root.isSm ? 6 : 8) : 0
        anchors.bottomMargin: !root.isHorizontal ? (root.isSm ? 6 : 8) : 0
        anchors.verticalCenter: root.isHorizontal ? parent.verticalCenter : undefined
        anchors.horizontalCenter: !root.isHorizontal ? parent.horizontalCenter : undefined
        width: root.isHorizontal ? undefined : (root.isSm ? 4 : 6)
        height: root.isHorizontal ? (root.isSm ? 4 : 6) : undefined
        radius: root.isSm ? 2 : 3
        color: root.isDark
            ? Qt.rgba(30.0 / 255.0, 41.0 / 255.0, 59.0 / 255.0, 1.0)
            : Qt.rgba(241.0 / 255.0, 245.0 / 255.0, 249.0 / 255.0, 1.0)

        // Range fill
        Rectangle {
            id: rangeFill
            anchors.left: parent.left
            anchors.bottom: parent.bottom
            anchors.top: root.isHorizontal ? parent.top : undefined
            anchors.right: !root.isHorizontal ? parent.right : undefined
            width: root.isHorizontal
                ? Math.max(0, Math.min(track.width, thumb.x + (root.isSm ? 6 : 8) - track.x))
                : track.width
            height: !root.isHorizontal
                ? Math.max(0, Math.min(track.height, track.height - (thumb.y + (root.isSm ? 6 : 8) - track.y)))
                : track.height
            radius: root.isSm ? 2 : 3
            color: root.isDark
                ? Qt.rgba(48.0 / 255.0, 160.0 / 255.0, 255.0 / 255.0, 1.0)
                : Qt.rgba(29.0 / 255.0, 122.0 / 255.0, 224.0 / 255.0, 1.0)
        }

        // Ticks & Marks
        Item {
            id: ticksContainer
            anchors.fill: parent
            visible: root.showTicks || (root.marks && root.marks.length > 0)
            z: 1

            readonly property int tickCount: (root.marks && root.marks.length > 0)
                ? root.marks.length
                : (root.showTicks && root.step > 0 ? Math.min(21, Math.max(2, Math.round((root.max - root.min) / root.step) + 1)) : 0)

            Repeater {
                model: ticksContainer.tickCount

                Item {
                    id: tickItem
                    required property int index
                    readonly property real tickProgress: ticksContainer.tickCount > 1 ? (index / (ticksContainer.tickCount - 1)) : 0.0
                    x: root.isHorizontal ? Math.round(tickProgress * ticksContainer.width) - 2 : (ticksContainer.width - 4) / 2
                    y: root.isHorizontal ? (ticksContainer.height - 4) / 2 : Math.round((1.0 - tickProgress) * ticksContainer.height) - 2
                    width: 4
                    height: 4

                    Rectangle {
                        anchors.centerIn: parent
                        width: 4
                        height: 4
                        radius: 2
                        color: tickItem.tickProgress <= root.progress ? ThemeTokens.accent : (root.isDark ? Qt.rgba(1, 1, 1, 0.25) : Qt.rgba(0, 0, 0, 0.25))
                    }

                    Text {
                        visible: root.marks && index < root.marks.length && root.marks[index].length > 0
                        text: visible ? root.marks[index] : ""
                        color: ThemeTokens.subduedText
                        font.pixelSize: 10
                        anchors.horizontalCenter: parent.horizontalCenter
                        anchors.top: parent.bottom
                        anchors.topMargin: 4
                    }
                }
            }
        }
    }

    // Thumb: 16x16 (default) or 12x12 (sm) circle
    Rectangle {
        id: thumb
        width: root.isSm ? 12 : 16
        height: root.isSm ? 12 : 16
        radius: root.isSm ? 6 : 8
        z: 2

        anchors.verticalCenter: root.isHorizontal ? parent.verticalCenter : undefined
        anchors.horizontalCenter: !root.isHorizontal ? parent.horizontalCenter : undefined

        color: root.isDark
            ? Qt.rgba(2.0 / 255.0, 8.0 / 255.0, 23.0 / 255.0, 1.0)
            : "#ffffff"

        border.width: 2
        border.color: root.isDark
            ? Qt.rgba(48.0 / 255.0, 160.0 / 255.0, 255.0 / 255.0, 1.0)
            : Qt.rgba(29.0 / 255.0, 122.0 / 255.0, 224.0 / 255.0, 1.0)

        scale: root.isDragging && !root.readOnly ? 0.95 : (root.isHovered ? 1.05 : 1.0)
        Behavior on scale {
            NumberAnimation { duration: 100 }
        }

        // Focus ring
        Rectangle {
            id: focusRing
            anchors.fill: parent
            anchors.margins: -2
            radius: thumb.radius + 2
            color: "transparent"
            border.width: 1
            border.color: root.isDark
                ? Qt.rgba(48.0 / 255.0, 160.0 / 255.0, 255.0 / 255.0, 1.0)
                : Qt.rgba(29.0 / 255.0, 122.0 / 255.0, 224.0 / 255.0, 1.0)
            visible: root.isFocused
        }

        // Floating Tooltip Badge
        Rectangle {
            id: tooltipPopup
            visible: root.showTooltip && (root.isDragging || root.isHovered || root.forceHover || root.forceFocus)
            z: 10
            width: tooltipText.implicitWidth + 10
            height: tooltipText.implicitHeight + 4
            radius: 4
            color: ThemeTokens.panel
            border.color: ThemeTokens.border
            border.width: 1

            anchors.bottom: root.isHorizontal ? parent.top : undefined
            anchors.bottomMargin: root.isHorizontal ? 6 : 0
            anchors.horizontalCenter: root.isHorizontal ? parent.horizontalCenter : undefined

            anchors.left: !root.isHorizontal ? parent.right : undefined
            anchors.leftMargin: !root.isHorizontal ? 8 : 0
            anchors.verticalCenter: !root.isHorizontal ? parent.verticalCenter : undefined

            Text {
                id: tooltipText
                anchors.centerIn: parent
                text: (typeof root.formatValue === "function") ? root.formatValue(root.value) : root.value.toString()
                color: ThemeTokens.text
                font.pixelSize: 11
                font.family: "monospace"
                font.weight: Font.Medium
            }
        }
    }

    MouseArea {
        id: mouseArea
        anchors.fill: parent
        hoverEnabled: !root.disabled
        enabled: !root.disabled
        cursorShape: root.disabled
            ? Qt.ForbiddenCursor
            : (root.readOnly
                ? Qt.ArrowCursor
                : (mouseArea.pressed ? Qt.ClosedHandCursor : Qt.PointingHandCursor))

        onPressed: function(mouse) {
            root.forceActiveFocus();
            root.updateFromMouse(mouse.x, mouse.y);
        }

        onPositionChanged: function(mouse) {
            if (pressed) {
                root.updateFromMouse(mouse.x, mouse.y);
            }
        }

        onReleased: function() {
            root.updateThumbFromValue();
        }
    }
}
