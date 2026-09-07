// ChaSetKeybindingRecorder.qml — Cross-Stack Keybinding Recorder Component
import QtQuick 6.10
import ChaSet

Item {
    id: root

    property string keybinding: "Ctrl+K"
    property bool recording: false
    property int customRadius: 6

    signal keybindingRecorded(string newBinding)

    implicitWidth: 200
    implicitHeight: 32

    Rectangle {
        anchors.fill: parent
        color: root.recording ? ThemeTokens.hover : ThemeTokens.panel
        border.color: root.recording ? ThemeTokens.accent : ThemeTokens.border
        border.width: root.recording ? 2 : 1
        radius: root.customRadius
        focus: root.recording

            Text {
                id: display
                anchors.left: parent.left
                anchors.leftMargin: 10
                anchors.right: recBtn.left
                anchors.rightMargin: 8
                anchors.verticalCenter: parent.verticalCenter
                text: root.recording ? "Press shortcut keys..." : root.keybinding
                color: root.recording ? ThemeTokens.accent : ThemeTokens.text
                font.pixelSize: 12
                font.family: "monospace"
                font.weight: root.recording ? Font.DemiBold : Font.Normal
                elide: Text.ElideRight
            }

            ChaSetButton {
                id: recBtn
                anchors.right: parent.right
                anchors.rightMargin: 8
                anchors.verticalCenter: parent.verticalCenter
                text: root.recording ? "Done" : "Record"
                variant: root.recording ? "default" : "outline"
                size: "xs"
                onClicked: {
                    root.recording = !root.recording
                }
            }

        Keys.onPressed: function(event) {
            if (!root.recording) return
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
                root.recording = false
                root.keybindingRecorded(root.keybinding)
            }
        }
    }
}
