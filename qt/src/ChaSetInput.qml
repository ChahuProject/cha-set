// ChaSetInput.qml — Cross-Stack Text Input Component
// 100% Pixel-Perfect & Behavioral Parity with React Input.tsx
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Rectangle {
    id: root

    property string type: "text" // "text" | "password" | "email" | "search" | "number"
    property string size: "default" // "default" | "sm"
    property string text: ""
    property string placeholderText: ""
    property bool disabled: false
    property bool readOnly: false
    property bool forceHover: false
    property bool forceFocus: false
    property int customRadius: -1

    signal textEdited()
    signal accepted()

    property alias inputItem: inputInner
    property alias selectByMouse: inputInner.selectByMouse

    function forceActiveFocus() {
        inputInner.forceActiveFocus();
    }

    readonly property bool isSm: root.size === "sm"
    readonly property bool isFocused: root.forceFocus || inputInner.activeFocus
    readonly property bool isHovered: root.forceHover || mouseArea.containsMouse
    readonly property bool isDark: ThemeTokens.dark

    implicitWidth: 200
    implicitHeight: isSm ? 28 : 32
    radius: customRadius >= 0 ? customRadius : 6
    color: "transparent"

    opacity: root.disabled ? 0.5 : 1.0

    border.width: 1
    border.color: {
        if (root.isFocused) {
            return isDark ? Qt.rgba(48.0 / 255.0, 160.0 / 255.0, 255.0 / 255.0, 1.0) : Qt.rgba(29.0 / 255.0, 122.0 / 255.0, 224.0 / 255.0, 1.0)
        }
        return isDark ? Qt.rgba(30.0 / 255.0, 41.0 / 255.0, 59.0 / 255.0, 1.0) : Qt.rgba(226.0 / 255.0, 232.0 / 255.0, 240.0 / 255.0, 1.0)
    }

    // Focus ring (1px offset matching Tailwind ring-1)
    Rectangle {
        id: focusRing
        anchors.fill: root
        anchors.margins: -1
        radius: (root.customRadius >= 0 ? root.customRadius : 6) + 1
        color: "transparent"
        border.width: 1
        border.color: root.isFocused ? (isDark ? Qt.rgba(48.0 / 255.0, 160.0 / 255.0, 255.0 / 255.0, 1.0) : Qt.rgba(29.0 / 255.0, 122.0 / 255.0, 224.0 / 255.0, 1.0)) : "transparent"
        visible: root.isFocused
    }

    TextInput {
        id: inputInner
        anchors.fill: parent
        anchors.leftMargin: root.isSm ? 8 : 10
        anchors.rightMargin: root.isSm ? 8 : 10
        verticalAlignment: TextInput.AlignVCenter

        text: root.text
        echoMode: root.type === "password" ? TextInput.Password : TextInput.Normal
        enabled: !root.disabled
        readOnly: root.readOnly

        font.pixelSize: root.isSm ? 12 : 14
        color: isDark ? Qt.rgba(248.0 / 255.0, 250.0 / 255.0, 252.0 / 255.0, 1.0) : Qt.rgba(2.0 / 255.0, 8.0 / 255.0, 23.0 / 255.0, 1.0)
        selectedTextColor: "#ffffff"
        selectionColor: isDark ? Qt.rgba(48.0 / 255.0, 160.0 / 255.0, 255.0 / 255.0, 1.0) : Qt.rgba(29.0 / 255.0, 122.0 / 255.0, 224.0 / 255.0, 1.0)
        cursorVisible: activeFocus

        onTextEdited: {
            root.text = inputInner.text;
            root.textEdited();
        }
        onAccepted: root.accepted()

        Text {
            anchors.fill: parent
            verticalAlignment: Text.AlignVCenter
            text: root.placeholderText
            font.pixelSize: root.isSm ? 12 : 14
            color: isDark ? Qt.rgba(148.0 / 255.0, 163.0 / 255.0, 184.0 / 255.0, 1.0) : Qt.rgba(100.0 / 255.0, 116.0 / 255.0, 139.0 / 255.0, 1.0)
            visible: inputInner.text === "" && !inputInner.activeFocus
        }
    }

    MouseArea {
        id: mouseArea
        anchors.fill: parent
        hoverEnabled: !root.disabled
        acceptedButtons: Qt.NoButton
        cursorShape: root.disabled ? Qt.ForbiddenCursor : Qt.IBeamCursor
    }
}
