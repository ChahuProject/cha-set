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
    property alias placeholder: root.placeholderText
    property bool disabled: false
    property bool readOnly: false
    property bool invalid: false
    property bool clearable: false
    property bool passwordToggle: false
    property bool showPassword: false
    property string leftIconSource: ""
    property string rightIconSource: ""
    property bool forceHover: false
    property bool forceFocus: false
    property int customRadius: -1

    signal textEdited()
    signal accepted()
    signal cleared()

    property alias inputItem: inputInner
    property alias selectByMouse: inputInner.selectByMouse

    function forceActiveFocus() {
        inputInner.forceActiveFocus();
    }

    readonly property bool isSm: root.size === "sm"
    readonly property bool isFocused: root.forceFocus || inputInner.activeFocus
    readonly property bool isHovered: root.forceHover || mouseArea.containsMouse
    readonly property bool isDark: ThemeTokens.dark
    readonly property color destructiveColor: isDark ? Qt.rgba(248.0 / 255.0, 113.0 / 255.0, 113.0 / 255.0, 1.0) : Qt.rgba(239.0 / 255.0, 68.0 / 255.0, 68.0 / 255.0, 1.0)

    implicitWidth: 200
    implicitHeight: isSm ? 28 : 32
    radius: customRadius >= 0 ? customRadius : 6
    color: "transparent"

    opacity: root.disabled ? 0.5 : 1.0

    border.width: 1
    border.color: {
        if (root.invalid) {
            return destructiveColor;
        }
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
        border.color: root.isFocused ? (root.invalid ? root.destructiveColor : (isDark ? Qt.rgba(48.0 / 255.0, 160.0 / 255.0, 255.0 / 255.0, 1.0) : Qt.rgba(29.0 / 255.0, 122.0 / 255.0, 224.0 / 255.0, 1.0))) : "transparent"
        visible: root.isFocused
    }

    // Left Icon
    Image {
        id: leftIcon
        visible: root.leftIconSource !== ""
        anchors.left: parent.left
        anchors.leftMargin: root.isSm ? 8 : 10
        anchors.verticalCenter: parent.verticalCenter
        width: root.isSm ? 14 : 16
        height: root.isSm ? 14 : 16
        source: root.leftIconSource
        sourceSize.width: root.isSm ? 14 : 16
        sourceSize.height: root.isSm ? 14 : 16
        fillMode: Image.PreserveAspectFit
    }

    // Right Actions (Clear button, Password toggle, Right icon)
    Row {
        id: rightActions
        anchors.right: parent.right
        anchors.rightMargin: root.isSm ? 6 : 8
        anchors.verticalCenter: parent.verticalCenter
        spacing: 4

        // Clear button
        Rectangle {
            id: clearBtn
            visible: root.clearable && !root.disabled && !root.readOnly && root.text.length > 0
            width: root.isSm ? 16 : 18
            height: root.isSm ? 16 : 18
            radius: width / 2
            color: clearMouse.containsMouse ? ThemeTokens.hover : "transparent"
            anchors.verticalCenter: parent.verticalCenter

            Text {
                anchors.centerIn: parent
                text: "×"
                font.pixelSize: root.isSm ? 12 : 14
                font.bold: true
                color: clearMouse.containsMouse ? ThemeTokens.text : ThemeTokens.subduedText
            }

            MouseArea {
                id: clearMouse
                anchors.fill: parent
                hoverEnabled: true
                cursorShape: Qt.PointingHandCursor
                onClicked: {
                    root.text = "";
                    inputInner.text = "";
                    root.textEdited();
                    root.cleared();
                    inputInner.forceActiveFocus();
                }
            }
        }

        // Password toggle button
        Rectangle {
            id: eyeBtn
            visible: root.type === "password" && root.passwordToggle && !root.disabled
            width: root.isSm ? 16 : 18
            height: root.isSm ? 16 : 18
            radius: 3
            color: eyeMouse.containsMouse ? ThemeTokens.hover : "transparent"
            anchors.verticalCenter: parent.verticalCenter

            Text {
                anchors.centerIn: parent
                text: root.showPassword ? "👁" : "🔒"
                font.pixelSize: root.isSm ? 10 : 12
                color: eyeMouse.containsMouse ? ThemeTokens.text : ThemeTokens.subduedText
            }

            MouseArea {
                id: eyeMouse
                anchors.fill: parent
                hoverEnabled: true
                cursorShape: Qt.PointingHandCursor
                onClicked: root.showPassword = !root.showPassword
            }
        }

        // Right icon
        Image {
            id: rightIcon
            visible: root.rightIconSource !== ""
            width: root.isSm ? 14 : 16
            height: root.isSm ? 14 : 16
            source: root.rightIconSource
            sourceSize.width: root.isSm ? 14 : 16
            sourceSize.height: root.isSm ? 14 : 16
            fillMode: Image.PreserveAspectFit
            anchors.verticalCenter: parent.verticalCenter
        }
    }

    TextInput {
        id: inputInner
        anchors.fill: parent
        anchors.leftMargin: leftIcon.visible ? (leftIcon.width + (root.isSm ? 12 : 14)) : (root.isSm ? 8 : 10)
        anchors.rightMargin: (clearBtn.visible || eyeBtn.visible || rightIcon.visible) ? (rightActions.width + (root.isSm ? 10 : 12)) : (root.isSm ? 8 : 10)
        verticalAlignment: TextInput.AlignVCenter

        text: root.text
        echoMode: (root.type === "password" && !root.showPassword) ? TextInput.Password : TextInput.Normal
        enabled: !root.disabled
        readOnly: root.readOnly

        font.pixelSize: root.isSm ? 12 : 14
        color: isDark ? Qt.rgba(248.0 / 255.0, 250.0 / 255.0, 252.0 / 255.0, 1.0) : Qt.rgba(2.0 / 255.0, 8.0 / 255.0, 23.0 / 255.0, 1.0)
        selectedTextColor: "#ffffff"
        selectionColor: isDark ? Qt.rgba(48.0 / 255.0, 160.0 / 255.0, 255.0 / 255.0, 1.0) : Qt.rgba(29.0 / 255.0, 122.0 / 255.0, 224.0 / 255.0, 1.0)
        cursorVisible: activeFocus

        Keys.onEscapePressed: {
            if (root.clearable && root.text.length > 0) {
                root.text = "";
                inputInner.text = "";
                root.textEdited();
                root.cleared();
            }
        }

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
        cursorShape: root.disabled ? Qt.ForbiddenCursor : (root.readOnly ? Qt.ArrowCursor : Qt.IBeamCursor)
    }
}
