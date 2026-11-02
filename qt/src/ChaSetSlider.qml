// ChaSetSlider.qml — Cross-Stack Slider Component
// 100% Pixel-Perfect & Behavioral Parity with React Slider.tsx
// Supports Single value, Range interval (dual thumbs), Snap stops with labels, and Commit-on-Release.
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import ChaSet

Item {
    id: root

    property bool range: false
    property real value: 0
    property real firstValue: 0
    property real secondValue: 100
    property real min: 0
    property real max: 100
    property real step: 1
    property real minStepsBetweenThumbs: 0
    property bool commitOnRelease: false
    property bool disabled: false
    property bool readOnly: false
    property string size: "default" // "default" | "sm"
    property string orientation: "horizontal" // "horizontal" | "vertical"
    property bool showTicks: false
    property var marks: []
    property bool showTooltip: false
    property var formatValue: null
    property int count: 0
    property var labels: []
    property string leftLabel: ""
    property string rightLabel: ""
    property bool forceHover: false
    property bool forceFocus: false
    property int activeThumb: 1 // 1: first/low, 2: second/high

    signal valueMoved(real value)
    signal valuesChanged(real first, real second)
    signal valueCommitted(real value)
    signal valuesCommitted(real first, real second)

    readonly property bool isDark: ThemeTokens.dark
    readonly property bool isHorizontal: root.orientation === "horizontal"
    readonly property bool isSm: root.size === "sm"
    readonly property bool isFocused: root.forceFocus || root.activeFocus
    readonly property bool isHovered: root.forceHover || mouseArea.containsMouse
    readonly property bool isDragging: mouseArea.pressed
    readonly property real span: Math.max(0.0001, root.max - root.min)
    readonly property real minGap: root.minStepsBetweenThumbs * root.step

    readonly property bool hasLabels: root.leftLabel !== "" || root.rightLabel !== "" || (root.labels && root.labels.length > 0)

    implicitWidth: root.isHorizontal ? ThemeTokens.dp(320) : ThemeTokens.dp(root.isSm ? 16 : 20)
    implicitHeight: (root.isHorizontal ? ThemeTokens.dp(root.isSm ? 16 : 20) : ThemeTokens.dp(240)) + (root.hasLabels && root.isHorizontal ? ThemeTokens.dp(22) : 0)

    opacity: root.disabled ? 0.5 : 1.0
    activeFocusOnTab: !root.disabled && !root.readOnly

    // Transient values during active dragging
    property real transientSingle: root.value
    property real transientFirst: root.firstValue
    property real transientSecond: root.secondValue

    // Active displayed values (transient while dragging with commitOnRelease, otherwise committed)
    readonly property real displaySingle: (root.isDragging && root.commitOnRelease) ? root.transientSingle : root.value
    readonly property real displayFirst: (root.isDragging && root.commitOnRelease) ? root.transientFirst : root.firstValue
    readonly property real displaySecond: (root.isDragging && root.commitOnRelease) ? root.transientSecond : root.secondValue

    readonly property real progress: Math.max(0.0, Math.min(1.0, (root.displaySingle - root.min) / root.span))
    readonly property real firstProgress: Math.max(0.0, Math.min(1.0, (root.displayFirst - root.min) / root.span))
    readonly property real secondProgress: Math.max(0.0, Math.min(1.0, (root.displaySecond - root.min) / root.span))

    readonly property real trackLength: root.isHorizontal ? Math.max(1, track.width) : Math.max(1, track.height)

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

    function valueForPos(pos) {
        var ratio = Math.max(0.0, Math.min(1.0, pos / root.trackLength));
        if (!root.isHorizontal) ratio = 1.0 - ratio;
        return quantize(root.min + ratio * root.span);
    }

    function posForValue(val) {
        var r = Math.max(0.0, Math.min(1.0, (val - root.min) / root.span));
        if (!root.isHorizontal) r = 1.0 - r;
        return r * root.trackLength;
    }

    function updateFromMouse(mouseX, mouseY) {
        if (root.disabled || root.readOnly) return;
        var p = root.isHorizontal ? (mouseX - track.x) : (mouseY - track.y);
        var clickedVal = valueForPos(p);

        if (!root.range) {
            var nextVal = clickedVal;
            root.transientSingle = nextVal;
            if (!root.commitOnRelease) {
                if (nextVal !== root.value) {
                    root.value = nextVal;
                    root.valueMoved(nextVal);
                }
            }
        } else {
            if (root.activeThumb === 1) {
                var maxFirst = (root.commitOnRelease ? root.transientSecond : root.secondValue) - root.minGap;
                var newFirst = Math.min(clickedVal, maxFirst);
                root.transientFirst = newFirst;
                if (!root.commitOnRelease) {
                    if (newFirst !== root.firstValue) {
                        root.firstValue = newFirst;
                        root.valuesChanged(root.firstValue, root.secondValue);
                    }
                }
            } else {
                var minSecond = (root.commitOnRelease ? root.transientFirst : root.firstValue) + root.minGap;
                var newSecond = Math.max(clickedVal, minSecond);
                root.transientSecond = newSecond;
                if (!root.commitOnRelease) {
                    if (newSecond !== root.secondValue) {
                        root.secondValue = newSecond;
                        root.valuesChanged(root.firstValue, root.secondValue);
                    }
                }
            }
        }
    }

    function stepSingle(delta) {
        if (root.disabled || root.readOnly) return;
        var next = quantize(root.value + delta);
        if (next !== root.value) {
            root.value = next;
            root.transientSingle = next;
            root.valueMoved(next);
            root.valueCommitted(next);
        }
    }

    function stepRangeFirst(delta) {
        if (root.disabled || root.readOnly) return;
        var maxFirst = root.secondValue - root.minGap;
        var next = Math.min(maxFirst, quantize(root.firstValue + delta));
        if (next !== root.firstValue) {
            root.firstValue = next;
            root.transientFirst = next;
            root.valuesChanged(root.firstValue, root.secondValue);
            root.valuesCommitted(root.firstValue, root.secondValue);
        }
    }

    function stepRangeSecond(delta) {
        if (root.disabled || root.readOnly) return;
        var minSecond = root.firstValue + root.minGap;
        var next = Math.max(minSecond, quantize(root.secondValue + delta));
        if (next !== root.secondValue) {
            root.secondValue = next;
            root.transientSecond = next;
            root.valuesChanged(root.firstValue, root.secondValue);
            root.valuesCommitted(root.firstValue, root.secondValue);
        }
    }

    onValueChanged: {
        if (!root.isDragging) root.transientSingle = root.value;
    }
    onFirstValueChanged: {
        if (!root.isDragging) root.transientFirst = root.firstValue;
    }
    onSecondValueChanged: {
        if (!root.isDragging) root.transientSecond = root.secondValue;
    }

    // Keyboard interaction
    Keys.onTabPressed: function(event) {
        if (root.range) {
            root.activeThumb = (root.activeThumb === 1 ? 2 : 1);
            event.accepted = true;
        }
    }

    Keys.onBacktabPressed: function(event) {
        if (root.range) {
            root.activeThumb = (root.activeThumb === 1 ? 2 : 1);
            event.accepted = true;
        }
    }

    Keys.onLeftPressed: function(event) {
        if (!root.disabled && !root.readOnly && root.isHorizontal) {
            event.accepted = true;
            if (!root.range) root.stepSingle(-root.step);
            else if (root.activeThumb === 1) root.stepRangeFirst(-root.step);
            else root.stepRangeSecond(-root.step);
        }
    }

    Keys.onRightPressed: function(event) {
        if (!root.disabled && !root.readOnly && root.isHorizontal) {
            event.accepted = true;
            if (!root.range) root.stepSingle(root.step);
            else if (root.activeThumb === 1) root.stepRangeFirst(root.step);
            else root.stepRangeSecond(root.step);
        }
    }

    Keys.onDownPressed: function(event) {
        if (!root.disabled && !root.readOnly) {
            event.accepted = true;
            if (!root.range) root.stepSingle(-root.step);
            else if (root.activeThumb === 1) root.stepRangeFirst(-root.step);
            else root.stepRangeSecond(-root.step);
        }
    }

    Keys.onUpPressed: function(event) {
        if (!root.disabled && !root.readOnly) {
            event.accepted = true;
            if (!root.range) root.stepSingle(root.step);
            else if (root.activeThumb === 1) root.stepRangeFirst(root.step);
            else root.stepRangeSecond(root.step);
        }
    }

    Keys.onPressed: function(event) {
        if (root.disabled || root.readOnly) return;
        var largeStep = Math.max(root.step * 10, root.span / 10);
        if (event.key === Qt.Key_PageUp) {
            event.accepted = true;
            if (!root.range) root.stepSingle(largeStep);
            else if (root.activeThumb === 1) root.stepRangeFirst(largeStep);
            else root.stepRangeSecond(largeStep);
        } else if (event.key === Qt.Key_PageDown) {
            event.accepted = true;
            if (!root.range) root.stepSingle(-largeStep);
            else if (root.activeThumb === 1) root.stepRangeFirst(-largeStep);
            else root.stepRangeSecond(-largeStep);
        } else if (event.key === Qt.Key_Home) {
            event.accepted = true;
            if (!root.range) {
                root.value = root.min;
                root.transientSingle = root.min;
                root.valueMoved(root.min);
                root.valueCommitted(root.min);
            } else if (root.activeThumb === 1) {
                root.firstValue = root.min;
                root.transientFirst = root.min;
                root.valuesChanged(root.firstValue, root.secondValue);
                root.valuesCommitted(root.firstValue, root.secondValue);
            } else {
                root.secondValue = root.firstValue + root.minGap;
                root.transientSecond = root.secondValue;
                root.valuesChanged(root.firstValue, root.secondValue);
                root.valuesCommitted(root.firstValue, root.secondValue);
            }
        } else if (event.key === Qt.Key_End) {
            event.accepted = true;
            if (!root.range) {
                root.value = root.max;
                root.transientSingle = root.max;
                root.valueMoved(root.max);
                root.valueCommitted(root.max);
            } else if (root.activeThumb === 2) {
                root.secondValue = root.max;
                root.transientSecond = root.max;
                root.valuesChanged(root.firstValue, root.secondValue);
                root.valuesCommitted(root.firstValue, root.secondValue);
            } else {
                root.firstValue = root.secondValue - root.minGap;
                root.transientFirst = root.firstValue;
                root.valuesChanged(root.firstValue, root.secondValue);
                root.valuesCommitted(root.firstValue, root.secondValue);
            }
        }
    }

    // Interactive Slider Container
    Item {
        id: sliderArea
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.top: parent.top
        height: root.isHorizontal ? ThemeTokens.dp(root.isSm ? 16 : 20) : parent.height

        // Track
        Rectangle {
            id: track
            anchors.left: root.isHorizontal ? parent.left : undefined
            anchors.right: root.isHorizontal ? parent.right : undefined
            anchors.leftMargin: root.isHorizontal ? ThemeTokens.dp(root.isSm ? 6 : 8) : 0
            anchors.rightMargin: root.isHorizontal ? ThemeTokens.dp(root.isSm ? 6 : 8) : 0
            anchors.top: !root.isHorizontal ? parent.top : undefined
            anchors.bottom: !root.isHorizontal ? parent.bottom : undefined
            anchors.topMargin: !root.isHorizontal ? ThemeTokens.dp(root.isSm ? 6 : 8) : 0
            anchors.bottomMargin: !root.isHorizontal ? ThemeTokens.dp(root.isSm ? 6 : 8) : 0
            anchors.verticalCenter: root.isHorizontal ? parent.verticalCenter : undefined
            anchors.horizontalCenter: !root.isHorizontal ? parent.horizontalCenter : undefined
            width: root.isHorizontal ? undefined : ThemeTokens.dp(root.isSm ? 4 : 6)
            height: root.isHorizontal ? ThemeTokens.dp(root.isSm ? 4 : 6) : undefined
            radius: ThemeTokens.dp(root.isSm ? 2 : 3)
            color: root.isDark
                ? Qt.rgba(30.0 / 255.0, 41.0 / 255.0, 59.0 / 255.0, 1.0)
                : Qt.rgba(241.0 / 255.0, 245.0 / 255.0, 249.0 / 255.0, 1.0)

            // Active Range Fill
            Rectangle {
                id: rangeFill
                radius: ThemeTokens.dp(root.isSm ? 2 : 3)
                color: root.isDark
                    ? Qt.rgba(48.0 / 255.0, 160.0 / 255.0, 255.0 / 255.0, 1.0)
                    : Qt.rgba(29.0 / 255.0, 122.0 / 255.0, 224.0 / 255.0, 1.0)

                x: !root.range
                    ? 0
                    : (root.isHorizontal ? root.firstProgress * track.width : 0)
                y: !root.range
                    ? (root.isHorizontal ? 0 : (1.0 - root.progress) * track.height)
                    : (root.isHorizontal ? 0 : (1.0 - root.secondProgress) * track.height)
                width: !root.range
                    ? (root.isHorizontal ? root.progress * track.width : track.width)
                    : (root.isHorizontal ? Math.max(0, (root.secondProgress - root.firstProgress) * track.width) : track.width)
                height: !root.range
                    ? (root.isHorizontal ? track.height : root.progress * track.height)
                    : (root.isHorizontal ? track.height : Math.max(0, (root.secondProgress - root.firstProgress) * track.height))
            }

            // Ticks & Marks
            Item {
                id: ticksContainer
                anchors.fill: parent
                visible: root.showTicks || (root.marks && root.marks.length > 0)
                z: 1

                readonly property int tickCount: (root.marks && root.marks.length > 0)
                    ? root.marks.length
                    : (root.count > 1 ? root.count : (root.showTicks && root.step > 0 ? Math.min(21, Math.max(2, Math.round(root.span / root.step) + 1)) : 0))

                Repeater {
                    model: ticksContainer.tickCount

                    Item {
                        id: tickItem
                        required property int index
                        readonly property real tickProgress: ticksContainer.tickCount > 1 ? (index / (ticksContainer.tickCount - 1)) : 0.0
                        x: root.isHorizontal ? Math.round(tickProgress * ticksContainer.width) - 2 : (ticksContainer.width - ThemeTokens.dp(4)) / 2
                        y: root.isHorizontal ? (ticksContainer.height - ThemeTokens.dp(4)) / 2 : Math.round((1.0 - tickProgress) * ticksContainer.height) - 2
                        width: ThemeTokens.dp(4)
                        height: ThemeTokens.dp(4)

                        readonly property bool isInside: !root.range
                            ? tickItem.tickProgress <= root.progress
                            : (tickItem.tickProgress >= root.firstProgress && tickItem.tickProgress <= root.secondProgress)

                        Rectangle {
                            anchors.centerIn: parent
                            width: ThemeTokens.dp(4)
                            height: ThemeTokens.dp(4)
                            radius: ThemeTokens.dp(2)
                            color: tickItem.isInside ? ThemeTokens.accent : (root.isDark ? Qt.rgba(1, 1, 1, 0.25) : Qt.rgba(0, 0, 0, 0.25))
                        }

                        Text {
                            visible: root.marks && index < root.marks.length && root.marks[index].length > 0
                            text: visible ? root.marks[index] : ""
                            color: ThemeTokens.subduedText
                            font.pixelSize: Typography.sizeMicro
                            anchors.horizontalCenter: parent.horizontalCenter
                            anchors.top: parent.bottom
                            anchors.topMargin: ThemeTokens.dp(4)
                        }
                    }
                }
            }
        }

        // Thumb 0 (Single Thumb or Low Thumb in Range)
        Rectangle {
            id: thumb0
            width: ThemeTokens.dp(root.isSm ? 12 : 16)
            height: ThemeTokens.dp(root.isSm ? 12 : 16)
            radius: ThemeTokens.dp(root.isSm ? 6 : 8)
            z: 2

            x: root.isHorizontal ? (track.x + (!root.range ? root.progress : root.firstProgress) * track.width - width / 2) : (parent.width - width) / 2
            y: root.isHorizontal ? (parent.height - height) / 2 : (track.y + (1.0 - (!root.range ? root.progress : root.firstProgress)) * track.height - height / 2)

            color: root.isDark
                ? Qt.rgba(2.0 / 255.0, 8.0 / 255.0, 23.0 / 255.0, 1.0)
                : "#ffffff"

            border.width: 2
            border.color: root.isDark
                ? Qt.rgba(48.0 / 255.0, 160.0 / 255.0, 255.0 / 255.0, 1.0)
                : Qt.rgba(29.0 / 255.0, 122.0 / 255.0, 224.0 / 255.0, 1.0)

            scale: (root.isDragging && (!root.range || root.activeThumb === 1) && !root.readOnly) ? 0.95 : (root.isHovered ? 1.05 : 1.0)
            Behavior on scale {
                enabled: ThemeTokens.animationsEnabled && !root.forceHover && !root.forceFocus && (typeof harnessMode === "undefined" || harnessMode === "")
                NumberAnimation { duration: ThemeTokens.motionQuick; easing.type: ThemeTokens.easeStandard }
            }

            Rectangle {
                anchors.fill: parent
                anchors.margins: -2
                radius: thumb0.radius + 2
                color: "transparent"
                border.width: 1
                border.color: ThemeTokens.accent
                visible: root.isFocused && (!root.range || root.activeThumb === 1)
            }

            // Floating Tooltip Badge
            Rectangle {
                visible: root.showTooltip && (root.isDragging || root.isHovered || root.forceHover || root.forceFocus)
                z: 10
                width: tooltipText0.implicitWidth + ThemeTokens.dp(10)
                height: tooltipText0.implicitHeight + ThemeTokens.dp(4)
                radius: ThemeTokens.dp(4)
                color: ThemeTokens.panel
                border.color: ThemeTokens.border
                border.width: 1

                anchors.bottom: root.isHorizontal ? parent.top : undefined
                anchors.bottomMargin: root.isHorizontal ? ThemeTokens.dp(6) : 0
                anchors.horizontalCenter: root.isHorizontal ? parent.horizontalCenter : undefined
                anchors.left: !root.isHorizontal ? parent.right : undefined
                anchors.leftMargin: !root.isHorizontal ? ThemeTokens.dp(8) : 0
                anchors.verticalCenter: !root.isHorizontal ? parent.verticalCenter : undefined

                Text {
                    id: tooltipText0
                    anchors.centerIn: parent
                    readonly property real curVal: !root.range ? root.displaySingle : root.displayFirst
                    text: (typeof root.formatValue === "function") ? root.formatValue(curVal) : curVal.toString()
                    color: ThemeTokens.text
                    font.pixelSize: Typography.sizeCaption
                    font.family: Typography.familyMono
                    font.weight: Font.Medium
                }
            }
        }

        // Thumb 1 (High Thumb for Range mode)
        Rectangle {
            id: thumb1
            visible: root.range
            width: ThemeTokens.dp(root.isSm ? 12 : 16)
            height: ThemeTokens.dp(root.isSm ? 12 : 16)
            radius: ThemeTokens.dp(root.isSm ? 6 : 8)
            z: 2

            x: root.isHorizontal ? (track.x + root.secondProgress * track.width - width / 2) : (parent.width - width) / 2
            y: root.isHorizontal ? (parent.height - height) / 2 : (track.y + (1.0 - root.secondProgress) * track.height - height / 2)

            color: root.isDark
                ? Qt.rgba(2.0 / 255.0, 8.0 / 255.0, 23.0 / 255.0, 1.0)
                : "#ffffff"

            border.width: 2
            border.color: root.isDark
                ? Qt.rgba(48.0 / 255.0, 160.0 / 255.0, 255.0 / 255.0, 1.0)
                : Qt.rgba(29.0 / 255.0, 122.0 / 255.0, 224.0 / 255.0, 1.0)

            scale: (root.isDragging && root.activeThumb === 2 && !root.readOnly) ? 0.95 : (root.isHovered ? 1.05 : 1.0)
            Behavior on scale {
                enabled: ThemeTokens.animationsEnabled && !root.forceHover && !root.forceFocus && (typeof harnessMode === "undefined" || harnessMode === "")
                NumberAnimation { duration: ThemeTokens.motionQuick; easing.type: ThemeTokens.easeStandard }
            }

            Rectangle {
                anchors.fill: parent
                anchors.margins: -2
                radius: thumb1.radius + 2
                color: "transparent"
                border.width: 1
                border.color: ThemeTokens.accent
                visible: root.isFocused && root.activeThumb === 2
            }

            Rectangle {
                visible: root.range && root.showTooltip && (root.isDragging || root.isHovered || root.forceHover || root.forceFocus)
                z: 10
                width: tooltipText1.implicitWidth + ThemeTokens.dp(10)
                height: tooltipText1.implicitHeight + ThemeTokens.dp(4)
                radius: ThemeTokens.dp(4)
                color: ThemeTokens.panel
                border.color: ThemeTokens.border
                border.width: 1

                anchors.bottom: root.isHorizontal ? parent.top : undefined
                anchors.bottomMargin: root.isHorizontal ? ThemeTokens.dp(6) : 0
                anchors.horizontalCenter: root.isHorizontal ? parent.horizontalCenter : undefined
                anchors.left: !root.isHorizontal ? parent.right : undefined
                anchors.leftMargin: !root.isHorizontal ? ThemeTokens.dp(8) : 0
                anchors.verticalCenter: !root.isHorizontal ? parent.verticalCenter : undefined

                Text {
                    id: tooltipText1
                    anchors.centerIn: parent
                    text: (typeof root.formatValue === "function") ? root.formatValue(root.displaySecond) : root.displaySecond.toString()
                    color: ThemeTokens.text
                    font.pixelSize: Typography.sizeCaption
                    font.family: Typography.familyMono
                    font.weight: Font.Medium
                }
            }
        }

        MouseArea {
            id: mouseArea
            anchors.fill: parent
            hoverEnabled: true
            preventStealing: true
            cursorShape: root.disabled
                ? Qt.ForbiddenCursor
                : (root.readOnly
                    ? Qt.ArrowCursor
                    : (mouseArea.pressed ? Qt.ClosedHandCursor : Qt.PointingHandCursor))

            onPressed: function(mouse) {
                if (root.disabled || root.readOnly) return;
                root.forceActiveFocus();
                if (root.range) {
                    var clickVal = root.valueForPos(root.isHorizontal ? (mouse.x - track.x) : (mouse.y - track.y));
                    var d1 = Math.abs(clickVal - root.firstValue);
                    var d2 = Math.abs(clickVal - root.secondValue);
                    root.activeThumb = (d1 <= d2) ? 1 : 2;
                }
                root.updateFromMouse(mouse.x, mouse.y);
            }

            onPositionChanged: function(mouse) {
                if (root.disabled || root.readOnly) return;
                if (pressed) {
                    root.updateFromMouse(mouse.x, mouse.y);
                }
            }

            onReleased: function() {
                if (root.disabled || root.readOnly) return;
                if (!root.range) {
                    if (root.commitOnRelease) {
                        root.value = root.transientSingle;
                        root.valueMoved(root.value);
                    }
                    root.valueCommitted(root.value);
                } else {
                    if (root.commitOnRelease) {
                        root.firstValue = root.transientFirst;
                        root.secondValue = root.transientSecond;
                        root.valuesChanged(root.firstValue, root.secondValue);
                    }
                    root.valuesCommitted(root.firstValue, root.secondValue);
                }
            }
        }
    }

    // Annotation / Labels row below slider (for snap mode / discrete stops)
    Item {
        id: labelsRow
        visible: root.hasLabels && root.isHorizontal
        anchors.top: sliderArea.bottom
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.topMargin: ThemeTokens.dp(2)
        height: ThemeTokens.dp(18)

        Text {
            anchors.left: parent.left
            anchors.verticalCenter: parent.verticalCenter
            text: root.leftLabel
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeCaption
        }

        Text {
            anchors.centerIn: parent
            text: {
                if (root.labels && root.labels.length > 0) {
                    var idx = Math.round(root.displaySingle);
                    if (idx >= 0 && idx < root.labels.length) return root.labels[idx];
                }
                if (root.range) {
                    var s1 = (typeof root.formatValue === "function") ? root.formatValue(root.displayFirst) : root.displayFirst.toString();
                    var s2 = (typeof root.formatValue === "function") ? root.formatValue(root.displaySecond) : root.displaySecond.toString();
                    return s1 + " - " + s2;
                }
                return (typeof root.formatValue === "function") ? root.formatValue(root.displaySingle) : root.displaySingle.toString();
            }
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeSmall
            font.weight: Font.DemiBold
            elide: Text.ElideMiddle
        }

        Text {
            anchors.right: parent.right
            anchors.verticalCenter: parent.verticalCenter
            text: root.rightLabel
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeCaption
        }
    }
}
