// ChaSetCheckbox.qml — Cross-Stack Checkbox Component
// 100% Pixel-Perfect & Behavioral Parity with React Checkbox.tsx
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root

    property bool checked: false
    property bool indeterminate: false
    property bool disabled: false
    property string size: "default" // "default" | "sm"
    property string label: ""
    property bool forceHover: false
    property bool forceFocus: false
    property int customRadius: -1

    signal toggled(bool checked)

    function toggle() {
        if (root.disabled) return;
        if (root.indeterminate) {
            root.indeterminate = false;
            root.checked = true;
        } else {
            root.checked = !root.checked;
        }
        root.toggled(root.checked);
    }

    readonly property bool isSm: root.size === "sm"
    readonly property int boxSize: isSm ? 14 : 16
    readonly property int effectiveRadius: customRadius >= 0 ? customRadius : (isSm ? 3 : 4)
    readonly property bool isHovered: (root.forceHover || mouseArea.containsMouse) && !root.disabled
    readonly property bool isFocused: (root.forceFocus || root.activeFocus) && !root.disabled
    readonly property bool isDark: ThemeTokens.dark
    readonly property bool isCheckedOrIndeterminate: root.checked || root.indeterminate

    implicitWidth: box.width + (root.label !== "" ? 8 + labelText.implicitWidth : 0)
    implicitHeight: Math.max(box.height, root.label !== "" ? labelText.implicitHeight : 0)

    opacity: root.disabled ? 0.5 : 1.0

    Accessible.role: Accessible.CheckBox
    Accessible.name: root.label !== "" ? root.label : "Checkbox"
    Accessible.checked: root.checked
    activeFocusOnTab: !root.disabled

    // Focus ring (1px offset matching Tailwind ring-1: margins -1, radius + 1)
    Rectangle {
        id: focusRing
        x: box.x - 1
        y: box.y - 1
        width: box.width + 2
        height: box.height + 2
        radius: root.effectiveRadius + 1
        color: "transparent"
        border.width: 1
        border.color: root.isFocused
            ? (isDark ? Qt.rgba(48.0 / 255.0, 160.0 / 255.0, 255.0 / 255.0, 1.0) : Qt.rgba(29.0 / 255.0, 122.0 / 255.0, 224.0 / 255.0, 1.0))
            : "transparent"
        visible: root.isFocused
    }

    // Checkbox Box
    Rectangle {
        id: box
        width: root.boxSize
        height: root.boxSize
        radius: root.effectiveRadius
        anchors.verticalCenter: parent.verticalCenter
        anchors.left: parent.left

        color: {
            if (root.isCheckedOrIndeterminate) {
                if (root.isHovered) {
                    return Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.9)
                }
                return ThemeTokens.accent
            }
            return "transparent"
        }

        border.width: 1
        border.color: {
            if (root.isCheckedOrIndeterminate) {
                return ThemeTokens.accent
            }
            if (root.isHovered) {
                return isDark ? Qt.rgba(148.0 / 255.0, 163.0 / 255.0, 184.0 / 255.0, 0.4) : Qt.rgba(100.0 / 255.0, 116.0 / 255.0, 139.0 / 255.0, 0.4)
            }
            return ThemeTokens.border
        }

        // Indicator Canvas (Checkmark or Dash)
        Canvas {
            id: indicatorCanvas
            anchors.fill: parent
            antialiasing: true
            renderTarget: Canvas.Image
            visible: root.isCheckedOrIndeterminate

            onPaint: {
                var ctx = getContext("2d");
                ctx.reset();
                ctx.clearRect(0, 0, width, height);

                if (!root.checked && !root.indeterminate) {
                    return;
                }

                ctx.strokeStyle = ThemeTokens.onAccent;
                ctx.lineWidth = root.isSm ? 1.75 : 2.0;
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.beginPath();

                if (root.indeterminate) {
                    var cy = Math.round(height / 2);
                    var xPad = root.isSm ? 3.5 : 4.0;
                    ctx.moveTo(xPad, cy);
                    ctx.lineTo(width - xPad, cy);
                    ctx.stroke();
                } else if (root.checked) {
                    if (root.isSm) {
                        ctx.moveTo(3.0, 6.8);
                        ctx.lineTo(5.6, 9.6);
                        ctx.lineTo(11.0, 4.0);
                    } else {
                        ctx.moveTo(3.5, 8.0);
                        ctx.lineTo(6.5, 11.0);
                        ctx.lineTo(12.5, 4.5);
                    }
                    ctx.stroke();
                }
            }

            Connections {
                target: root
                function onCheckedChanged() { indicatorCanvas.requestPaint() }
                function onIndeterminateChanged() { indicatorCanvas.requestPaint() }
                function onSizeChanged() { indicatorCanvas.requestPaint() }
            }
            Connections {
                target: ThemeTokens
                function onDarkChanged() { indicatorCanvas.requestPaint() }
            }
            Component.onCompleted: indicatorCanvas.requestPaint()
        }
    }

    // Companion Label Text
    Text {
        id: labelText
        anchors.left: box.right
        anchors.leftMargin: 8
        anchors.verticalCenter: parent.verticalCenter
        visible: root.label !== ""
        text: root.label
        font.pixelSize: root.isSm ? 12 : 14
        font.weight: Font.Medium
        color: ThemeTokens.text
    }

    MouseArea {
        id: mouseArea
        anchors.fill: parent
        hoverEnabled: !root.disabled
        cursorShape: root.disabled ? Qt.ArrowCursor : Qt.PointingHandCursor
        onClicked: root.toggle()
    }

    Keys.onSpacePressed: (event) => {
        event.accepted = true;
        root.toggle();
    }
    Keys.onReturnPressed: (event) => {
        event.accepted = true;
        root.toggle();
    }
}
