// ChaSetKeybindingRecorder.qml — Cross-Stack Keybinding Recorder Component
import QtQuick 6.10
import ChaSet

Item {
    id: root

    property string keybinding: "Ctrl+K"
    property string value: keybinding
    property bool recording: false
    property int customRadius: ThemeTokens.dp(6)
    property bool clearable: true
    property string size: "default" // "default" | "sm"
    property bool disabled: false

    signal keybindingRecorded(string newBinding)

    readonly property bool isSm: root.size === "sm"

    implicitWidth: ThemeTokens.dp(200)
    implicitHeight: ThemeTokens.dp(root.isSm ? 26 : 32)
    opacity: root.disabled ? 0.5 : 1.0

    onValueChanged: {
        if (root.keybinding !== root.value) {
            root.keybinding = root.value
        }
    }

    onKeybindingChanged: {
        if (root.value !== root.keybinding) {
            root.value = root.keybinding
        }
    }

    Rectangle {
        anchors.fill: parent
        color: root.recording ? ThemeTokens.hover : ThemeTokens.panel
        border.color: root.recording ? ThemeTokens.accent : ThemeTokens.border
        border.width: root.recording ? 2 : 1
        radius: root.customRadius
        focus: root.recording

        Behavior on color {
            enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
            ColorAnimation { duration: ThemeTokens.motionQuick; easing.type: ThemeTokens.easeStandard }
        }
        Behavior on border.color {
            enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
            ColorAnimation { duration: ThemeTokens.motionQuick; easing.type: ThemeTokens.easeStandard }
        }

        Text {
            id: display
            anchors.left: parent.left
            anchors.leftMargin: ThemeTokens.dp(root.isSm ? 8 : 10)
            anchors.right: btnRow.left
            anchors.rightMargin: ThemeTokens.dp(6)
            anchors.verticalCenter: parent.verticalCenter
            text: root.recording ? "Press shortcut keys..." : (root.keybinding.length > 0 ? root.keybinding : "None")
            color: root.recording ? ThemeTokens.accent : (root.keybinding.length > 0 ? ThemeTokens.text : ThemeTokens.subduedText)
            font.pixelSize: root.isSm ? Typography.sizeCaption : Typography.sizeSmall
            font.family: Typography.familyMono
            font.weight: root.recording ? Font.DemiBold : Font.Normal
            elide: Text.ElideRight
        }

        Row {
            id: btnRow
            anchors.right: parent.right
            anchors.rightMargin: ThemeTokens.dp(root.isSm ? 4 : 6)
            anchors.verticalCenter: parent.verticalCenter
            spacing: 2

            ChaSetButton {
                id: clearBtn
                visible: root.clearable && !root.recording && root.keybinding.length > 0 && !root.disabled
                icon: "x"
                variant: "ghost"
                size: "icon-xs"
                height: ThemeTokens.dp(root.isSm ? 20 : 24)
                width: ThemeTokens.dp(root.isSm ? 20 : 24)
                onClicked: {
                    root.keybinding = ""
                    root.value = ""
                    root.keybindingRecorded("")
                }
            }

            ChaSetButton {
                id: recBtn
                text: root.recording ? "Done" : "Record"
                variant: root.recording ? "default" : "outline"
                size: root.isSm ? "icon-xs" : "xs"
                enabled: !root.disabled
                height: ThemeTokens.dp(root.isSm ? 20 : 24)
                onClicked: {
                    root.recording = !root.recording
                }
            }
        }

        MouseArea {
            id: recorderClickArea
            anchors.fill: parent
            anchors.rightMargin: btnRow.width + ThemeTokens.dp(10)
            hoverEnabled: true
            cursorShape: root.disabled ? Qt.ForbiddenCursor : Qt.PointingHandCursor
            onClicked: {
                if (!root.disabled) {
                    root.recording = !root.recording
                }
            }
        }

        Keys.onPressed: function(event) {
            if (!root.recording || root.disabled) return
            event.accepted = true

            let parts = []
            if (event.modifiers & Qt.ControlModifier) parts.push("Ctrl")
            if (event.modifiers & Qt.AltModifier) parts.push("Alt")
            if (event.modifiers & Qt.ShiftModifier) parts.push("Shift")
            if (event.modifiers & Qt.MetaModifier) parts.push("Cmd")

            let keyText = event.text.toUpperCase()
            if (event.key >= Qt.Key_F1 && event.key <= Qt.Key_F12) {
                keyText = "F" + (event.key - Qt.Key_F1 + 1)
            } else if (event.key === Qt.Key_Escape) {
                root.recording = false
                return
            } else if (event.key === Qt.Key_Return || event.key === Qt.Key_Enter) {
                root.recording = false
                return
            }

            if (keyText.length > 0) {
                parts.push(keyText)
                root.keybinding = parts.join("+")
                root.value = root.keybinding
                root.recording = false
                root.keybindingRecorded(root.keybinding)
            }
        }
    }

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
