// ChaSetSwitch.qml — Cross-Stack Switch (Toggle) Component
// 100% Pixel-Perfect & Behavioral Parity with React Switch.tsx
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root

    property bool checked: false
    property bool disabled: false
    property bool readOnly: false
    property bool loading: false
    property string size: "default" // "default" | "sm"
    property string label: ""
    property string description: ""
    property bool forceHover: false
    property bool forceFocus: false

    signal toggled(bool checked)

    readonly property bool isSm: root.size === "sm"
    readonly property bool isDark: ThemeTokens.dark
    readonly property bool isFocused: (root.forceFocus || root.activeFocus) && !root.disabled
    readonly property bool isHovered: (root.forceHover || mouseArea.containsMouse) && !root.disabled && !root.readOnly && !root.loading
    readonly property bool hasCompanionContent: root.label !== "" || root.description !== ""

    implicitWidth: hasCompanionContent ? (track.width + 8 + labelColumn.implicitWidth) : track.width
    implicitHeight: Math.max(track.height, hasCompanionContent ? labelColumn.implicitHeight : 0)

    opacity: root.disabled ? 0.5 : 1.0

    activeFocusOnTab: !root.disabled

    Keys.onSpacePressed: function(event) {
        if (!root.disabled && !root.readOnly && !root.loading) {
            root.checked = !root.checked
            root.toggled(root.checked)
            event.accepted = true
        }
    }

    Keys.onReturnPressed: function(event) {
        if (!root.disabled && !root.readOnly && !root.loading) {
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
        anchors.verticalCenter: root.description !== "" ? undefined : parent.verticalCenter
        anchors.top: root.description !== "" ? parent.top : undefined
        anchors.topMargin: root.description !== "" ? 2 : 0

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

            // Spinner inside thumb when loading
            Text {
                id: loadingSpinner
                visible: root.loading
                anchors.centerIn: parent
                text: "◐"
                font.pixelSize: root.isSm ? 8 : 10
                color: ThemeTokens.subduedText
                rotation: 0

                NumberAnimation on rotation {
                    running: root.loading
                    from: 0
                    to: 360
                    duration: 800
                    loops: Animation.Infinite
                }
            }
        }
    }

    // Companion Label and Description
    Column {
        id: labelColumn
        anchors.left: track.right
        anchors.leftMargin: 8
        anchors.verticalCenter: root.description !== "" ? undefined : parent.verticalCenter
        anchors.top: root.description !== "" ? parent.top : undefined
        visible: root.hasCompanionContent
        spacing: 3

        Text {
            id: labelText
            visible: root.label !== ""
            text: root.label
            font.pixelSize: root.isSm ? 12 : 14
            font.weight: Font.Medium
            color: ThemeTokens.text
        }

        Text {
            id: descText
            visible: root.description !== ""
            text: root.description
            font.pixelSize: root.isSm ? 11 : 12
            color: ThemeTokens.subduedText
        }
    }

    MouseArea {
        id: mouseArea
        anchors.fill: parent
        hoverEnabled: !root.disabled && !root.readOnly && !root.loading
        enabled: !root.disabled && !root.readOnly && !root.loading
        cursorShape: root.disabled ? Qt.ForbiddenCursor : (root.readOnly || root.loading ? Qt.ArrowCursor : Qt.PointingHandCursor)
        onClicked: {
            root.forceActiveFocus()
            root.checked = !root.checked
            root.toggled(root.checked)
        }
    }
}
