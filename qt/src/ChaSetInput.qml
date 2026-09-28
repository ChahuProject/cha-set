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
    property bool clearable: true
    property bool passwordToggle: false
    property bool showPassword: false
    property string leftIconSource: ""
    property string rightIconSource: ""
    property string icon: ""
    property string iconPosition: "left"
    property bool reserveIconSlot: false
    property bool bordered: true
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

    function selectAll() {
        inputInner.selectAll();
    }

    readonly property bool isSm: root.size === "sm"
    readonly property bool isFocused: root.forceFocus || inputInner.activeFocus
    readonly property bool isHovered: root.forceHover || containerClickArea.containsMouse
    readonly property bool isDark: ThemeTokens.dark
    readonly property color destructiveColor: isDark ? Qt.rgba(248.0 / 255.0, 113.0 / 255.0, 113.0 / 255.0, 1.0) : Qt.rgba(239.0 / 255.0, 68.0 / 255.0, 68.0 / 255.0, 1.0)

    implicitWidth: ThemeTokens.dp(200)
    implicitHeight: ThemeTokens.dp(isSm ? 28 : 32)
    radius: customRadius >= 0 ? customRadius : ThemeTokens.dp(6)
    color: "transparent"
    clip: true

    opacity: root.disabled ? 0.5 : 1.0

    border.width: root.bordered ? 1 : 0
    border.color: {
        if (!root.bordered) return "transparent";
        if (root.invalid) {
            return destructiveColor;
        }
        if (root.isFocused) {
            return isDark ? Qt.rgba(48.0 / 255.0, 160.0 / 255.0, 255.0 / 255.0, 1.0) : Qt.rgba(29.0 / 255.0, 122.0 / 255.0, 224.0 / 255.0, 1.0)
        }
        return isDark ? Qt.rgba(30.0 / 255.0, 41.0 / 255.0, 59.0 / 255.0, 1.0) : Qt.rgba(226.0 / 255.0, 232.0 / 255.0, 240.0 / 255.0, 1.0)
    }

    Behavior on border.color {
        enabled: ThemeTokens.animationsEnabled && !root.forceHover && !root.forceFocus && (typeof harnessMode === "undefined" || harnessMode === "")
        ColorAnimation { duration: ThemeTokens.motionQuick; easing.type: ThemeTokens.easeStandard }
    }

    // Win11-style bottom theme underline inside input
    Rectangle {
        id: bottomFocusUnderline
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.bottom: parent.bottom
        anchors.leftMargin: (root.bordered && root.radius > 0) ? ThemeTokens.dp(2) : 0
        anchors.rightMargin: (root.bordered && root.radius > 0) ? ThemeTokens.dp(2) : 0
        anchors.bottomMargin: 0
        height: ThemeTokens.dp(2)
        radius: ThemeTokens.dp(1)
        color: root.invalid ? root.destructiveColor : ThemeTokens.accent
        visible: root.isFocused
        z: 2
    }

    // Left Icon Slot
    Item {
        id: leftIcon
        readonly property bool hasIcon: root.leftIconSource !== "" || (root.icon !== "" && root.iconPosition === "left")
        visible: hasIcon || root.reserveIconSlot
        anchors.left: parent.left
        anchors.leftMargin: ThemeTokens.dp(root.isSm ? 8 : 10)
        anchors.verticalCenter: parent.verticalCenter
        width: ThemeTokens.dp(root.isSm ? 14 : 16)
        height: ThemeTokens.dp(root.isSm ? 14 : 16)

        Image {
            anchors.fill: parent
            visible: root.leftIconSource !== ""
            source: root.leftIconSource
            sourceSize.width: parent.width
            sourceSize.height: parent.height
            fillMode: Image.PreserveAspectFit
        }

        ChaSetIcon {
            anchors.centerIn: parent
            visible: root.leftIconSource === "" && root.icon !== "" && root.iconPosition === "left"
            name: root.icon
            size: root.isSm ? 14 : 16
            color: ThemeTokens.subduedText
        }
    }

    // Right Actions (Clear button, Password toggle, Right icon)
    Row {
        id: rightActions
        anchors.right: parent.right
        anchors.rightMargin: ThemeTokens.dp(root.isSm ? 6 : 8)
        anchors.verticalCenter: parent.verticalCenter
        spacing: ThemeTokens.dp(4)

        // Clear button
        Rectangle {
            id: clearBtn
            visible: root.clearable && !root.disabled && !root.readOnly && root.text.length > 0
            width: ThemeTokens.dp(root.isSm ? 16 : 18)
            height: ThemeTokens.dp(root.isSm ? 16 : 18)
            radius: width / 2
            color: clearMouse.containsMouse ? ThemeTokens.hover : "transparent"
            anchors.verticalCenter: parent.verticalCenter

            ChaSetIcon {
                anchors.centerIn: parent
                name: "x"
                size: root.isSm ? 12 : 14
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
            width: ThemeTokens.dp(root.isSm ? 16 : 18)
            height: ThemeTokens.dp(root.isSm ? 16 : 18)
            radius: ThemeTokens.dp(3)
            color: eyeMouse.containsMouse ? ThemeTokens.hover : "transparent"
            anchors.verticalCenter: parent.verticalCenter

            ChaSetIcon {
                anchors.centerIn: parent
                name: root.showPassword ? "eye" : "eye-off"
                size: root.isSm ? 12 : 14
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
        Item {
            id: rightIcon
            visible: root.rightIconSource !== "" || (root.icon !== "" && root.iconPosition === "right")
            width: ThemeTokens.dp(root.isSm ? 14 : 16)
            height: ThemeTokens.dp(root.isSm ? 14 : 16)
            anchors.verticalCenter: parent.verticalCenter

            Image {
                anchors.fill: parent
                visible: root.rightIconSource !== ""
                source: root.rightIconSource
                sourceSize.width: parent.width
                sourceSize.height: parent.height
                fillMode: Image.PreserveAspectFit
            }

            ChaSetIcon {
                anchors.centerIn: parent
                visible: root.rightIconSource === "" && root.icon !== "" && root.iconPosition === "right"
                name: root.icon
                size: root.isSm ? 14 : 16
                color: ThemeTokens.subduedText
            }
        }
    }

    TextInput {
        id: inputInner
        anchors.fill: parent
        anchors.leftMargin: leftIcon.visible ? (leftIcon.width + ThemeTokens.dp(root.isSm ? 12 : 14)) : ThemeTokens.dp(root.isSm ? 8 : 10)
        anchors.rightMargin: (clearBtn.visible || eyeBtn.visible || rightIcon.visible) ? (rightActions.width + ThemeTokens.dp(root.isSm ? 10 : 12)) : ThemeTokens.dp(root.isSm ? 8 : 10)
        verticalAlignment: TextInput.AlignVCenter

        text: root.text
        echoMode: (root.type === "password" && !root.showPassword) ? TextInput.Password : TextInput.Normal
        enabled: !root.disabled
        readOnly: root.readOnly

        selectByMouse: true

        font.pixelSize: root.isSm ? Typography.sizeSmall : Typography.sizeBody
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
            font.pixelSize: root.isSm ? Typography.sizeSmall : Typography.sizeBody
            color: isDark ? Qt.rgba(148.0 / 255.0, 163.0 / 255.0, 184.0 / 255.0, 1.0) : Qt.rgba(100.0 / 255.0, 116.0 / 255.0, 139.0 / 255.0, 1.0)
            visible: inputInner.text === "" && !inputInner.activeFocus
        }
    }

    // HoverHandler: sets IBeamCursor across the entire input geometry (including over TextInput)
    HoverHandler {
        id: hoverHandler
        cursorShape: root.disabled ? Qt.ForbiddenCursor : (root.readOnly ? Qt.ArrowCursor : Qt.IBeamCursor)
    }

    // Background click area: clicking container margins/padding focuses the input
    MouseArea {
        id: containerClickArea
        anchors.fill: parent
        z: -1
        hoverEnabled: false
        cursorShape: root.disabled ? Qt.ForbiddenCursor : (root.readOnly ? Qt.ArrowCursor : Qt.IBeamCursor)
        onClicked: {
            if (!root.disabled) {
                inputInner.forceActiveFocus();
            }
        }
    }

    // Disabled overlay: intercepts all hover and press events when disabled, enforcing ForbiddenCursor
    MouseArea {
        id: disabledOverlay
        anchors.fill: parent
        z: 99
        visible: root.disabled
        hoverEnabled: true
        cursorShape: Qt.ForbiddenCursor
        acceptedButtons: Qt.AllButtons
        onPressed: (mouse) => mouse.accepted = true
    }
}
