// ChaSetSwitch.qml — Cross-Stack Switch (Toggle) Component
// 100% Pixel-Perfect & Behavioral Parity with React Switch.tsx
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root

    property bool checked: false
    property bool disabled: false
    property string size: "default" // "default" | "sm"
    property string label: ""
    property bool forceHover: false
    property bool forceFocus: false

    signal toggled(bool checked)

    readonly property bool isSm: root.size === "sm"
    readonly property bool isDark: ThemeTokens.dark
    readonly property bool isFocused: root.forceFocus || root.activeFocus
    readonly property bool isHovered: root.forceHover || mouseArea.containsMouse

    implicitWidth: root.label !== "" ? (track.width + 8 + labelText.implicitWidth) : track.width
    implicitHeight: Math.max(track.height, root.label !== "" ? labelText.implicitHeight : 0)

    opacity: root.disabled ? 0.5 : 1.0

    activeFocusOnTab: !root.disabled

    Keys.onSpacePressed: function(event) {
        if (!root.disabled) {
            root.checked = !root.checked
            root.toggled(root.checked)
            event.accepted = true
        }
    }

    Keys.onReturnPressed: function(event) {
        if (!root.disabled) {
            root.checked = !root.checked
            root.toggled(root.checked)
            event.accepted = true
        }
    }

    Rectangle {
        id: track
        width: root.isSm ? 28 : 36
        height: root.isSm ? 16 : 20
        radius: root.isSm ? 8 : 10
        anchors.left: parent.left
        anchors.verticalCenter: parent.verticalCenter

        color: root.checked
            ? (root.isDark ? Qt.rgba(48.0 / 255.0, 160.0 / 255.0, 255.0 / 255.0, 1.0) : Qt.rgba(29.0 / 255.0, 122.0 / 255.0, 224.0 / 255.0, 1.0))
            : (root.isDark ? Qt.rgba(30.0 / 255.0, 41.0 / 255.0, 59.0 / 255.0, 1.0) : Qt.rgba(226.0 / 255.0, 232.0 / 255.0, 240.0 / 255.0, 1.0))

        Behavior on color {
            ColorAnimation { duration: 120 }
        }

        // Outer focus ring: 1px offset Rectangle (margins: -1, radius + 1), visible when focused
        Rectangle {
            id: focusRing
            anchors.fill: parent
            anchors.margins: -1
            radius: track.radius + 1
            color: "transparent"
            border.width: 1
            border.color: root.isDark ? Qt.rgba(48.0 / 255.0, 160.0 / 255.0, 255.0 / 255.0, 1.0) : Qt.rgba(29.0 / 255.0, 122.0 / 255.0, 224.0 / 255.0, 1.0)
            visible: root.isFocused
        }

        // Thumb
        Rectangle {
            id: thumb
            width: root.isSm ? 12 : 16
            height: root.isSm ? 12 : 16
            radius: root.isSm ? 6 : 8
            y: (track.height - height) / 2
            x: root.checked ? (track.width - width - 2) : 2
            color: "#ffffff"
            border.width: 1
            border.color: Qt.rgba(0, 0, 0, 0.06)

            Behavior on x {
                NumberAnimation {
                    duration: 120
                    easing.type: Easing.InOutQuad
                }
            }
        }
    }

    Text {
        id: labelText
        anchors.left: track.right
        anchors.leftMargin: 8
        anchors.verticalCenter: parent.verticalCenter
        text: root.label
        visible: root.label !== ""
        font.pixelSize: root.isSm ? 12 : 14
        font.weight: Font.Medium
        color: ThemeTokens.text
    }

    MouseArea {
        id: mouseArea
        anchors.fill: parent
        hoverEnabled: !root.disabled
        enabled: !root.disabled
        cursorShape: root.disabled ? Qt.ForbiddenCursor : Qt.PointingHandCursor
        onClicked: {
            root.forceActiveFocus()
            root.checked = !root.checked
            root.toggled(root.checked)
        }
    }
}
