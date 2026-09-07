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
        { id: "props", title: "API Reference" }
    ]

    property string boundKey: "Ctrl+Shift+P"

    ComponentPreview {
        title: "Keybinding Recorder Preview"
        reactCode: `<KeybindingRecorder
  value={binding}
  onChange={(val) => setBinding(val)}
/>`
        qtCode: `ChaSetKeybindingRecorder {
    keybinding: "Ctrl+Shift+P"
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
                    Text { text: "Quick Command Palette Shortcut:"; color: ThemeTokens.subduedText; font.pixelSize: 12 }
                    ChaSetKeybindingRecorder {
                        width: 240
                        keybinding: root.boundKey
                        onKeybindingRecorded: function(val) {
                            root.boundKey = val
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

    CodeBlock {
        title: "Installation"
        code: "import ChaSet 1.0\n\nChaSetKeybindingRecorder { keybinding: \"Ctrl+S\" }"
        language: "qml"
    }

    PropsTable {
        title: "Props Reference"
        props: [
            { name: "keybinding", type: "string", default: "'Ctrl+K'", description: "The serialized shortcut string representation (e.g. 'Ctrl+Shift+P')." },
            { name: "recording", type: "bool", default: "false", description: "Whether the recorder is actively listening for key combinations." },
            { name: "customRadius", type: "int", default: "6", description: "Corner radius of the input container." }
        ]
    }
}
