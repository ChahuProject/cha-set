// KeybindingRecorderDocPage.qml — Living Documentation for ChaSetKeybindingRecorder
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Interactive Controls"
    pageTitle: "Keybinding Recorder"
    description: "Interactive keyboard accelerator recorder that captures modifier sequences (Ctrl, Shift, Alt, Cmd) and hotkeys for desktop applications."
    tocItems: [
        { id: "preview", title: "Interactive Preview" },
        { id: "installation", title: "Installation" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "API Reference" }
    ]

    property string boundKey: "Ctrl+Shift+P"
    property string compactKey: "Ctrl+K"

    ComponentPreview {
        title: "Keybinding Recorder Preview"
        reactCode: `<KeybindingRecorder
  value={binding}
  size="default"
  clearable
  onChange={(val) => setBinding(val)}
/>`
        qtCode: `ChaSetKeybindingRecorder {
    width: 240
    value: "Ctrl+Shift+P"
    size: "default"
    clearable: true
    onKeybindingRecorded: function(b) { console.log(b) }
}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: 16

                Column {
                    spacing: 6
                    anchors.horizontalCenter: parent.horizontalCenter
                    Text { text: "Default Size:"; color: ThemeTokens.subduedText; font.pixelSize: 12 }
                    ChaSetKeybindingRecorder {
                        width: 240
                        value: root.boundKey
                        clearable: true
                        onKeybindingRecorded: function(val) {
                            root.boundKey = val
                        }
                    }
                }

                Column {
                    spacing: 6
                    anchors.horizontalCenter: parent.horizontalCenter
                    Text { text: "Compact Size (sm):"; color: ThemeTokens.subduedText; font.pixelSize: 12 }
                    ChaSetKeybindingRecorder {
                        width: 200
                        size: "sm"
                        value: root.compactKey
                        clearable: true
                        onKeybindingRecorded: function(val) {
                            root.compactKey = val
                        }
                    }
                }

                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "Active Desktop Accelerator: " + root.boundKey
                    color: ThemeTokens.text
                    font.pixelSize: 12
                    font.family: "monospace"
                }
            }
        }
    }

    ChaSetCodeBlock {
        title: "Installation"
        code: "import ChaSet 1.0\n\nChaSetKeybindingRecorder {\n    value: \"Ctrl+S\"\n    clearable: true\n}"
        language: "qml"
    }

    KeyboardShortcutsTable {
        componentId: "keybinding-recorder"
    }

    PropsTable {
        title: "Props Reference"
        props: [
            { name: "value", type: "string", default: "'Ctrl+K'", description: "The serialized shortcut string representation (e.g. 'Ctrl+Shift+P')." },
            { name: "keybinding", type: "string", default: "'Ctrl+K'", description: "Alias for value." },
            { name: "size", type: "'default' | 'sm'", default: "'default'", description: "Size preset variant for regular or compact density." },
            { name: "clearable", type: "bool", default: "true", description: "Whether to display a clear button when a shortcut is set." },
            { name: "recording", type: "bool", default: "false", description: "Whether the recorder is actively listening for key combinations." },
            { name: "disabled", type: "bool", default: "false", description: "Whether the recorder is disabled." },
            { name: "customRadius", type: "int", default: "6", description: "Corner radius of the input container." }
        ]
    }
}

