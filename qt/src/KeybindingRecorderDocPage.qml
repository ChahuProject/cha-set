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
        { id: "overview", title: "Interactive Overview" },
        { id: "variants", title: "Sizes & States" },
        { id: "installation", title: "Installation" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "Props Reference" }
    ]

    property string boundKey: "Ctrl+Shift+P"
    property string compactKey: "Ctrl+K"

    ComponentPreview {
        title: "Keybinding Recorder Sandbox"
        reactCode: `<KeybindingRecorder
  value={binding}
  onValueChange={setBinding}
  placeholder="Click to record shortcut..."
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
                    Text { text: "Click recorder box and press shortcut combination:"; color: ThemeTokens.subduedText; font.pixelSize: 12 }
                    ChaSetKeybindingRecorder {
                        width: 240
                        value: root.boundKey
                        clearable: true
                        onKeybindingRecorded: function(val) {
                            root.boundKey = val
                        }
                    }
                }

                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "Recorded accelerator: " + root.boundKey
                    color: ThemeTokens.text
                    font.pixelSize: 12
                    font.family: "monospace"
                }
            }
        }
    }

    ComponentPreview {
        title: "Sizes & States Preview"
        reactCode: `<KeybindingRecorder value="Ctrl+K" size="default" />
<KeybindingRecorder value="Ctrl+Shift+P" size="sm" />
<KeybindingRecorder value="Alt+F4" clearable={false} />
<KeybindingRecorder value="Ctrl+C" disabled />`
        qtCode: `ChaSetKeybindingRecorder { value: "Ctrl+K"; size: "default" }
ChaSetKeybindingRecorder { value: "Ctrl+Shift+P"; size: "sm" }
ChaSetKeybindingRecorder { value: "Alt+F4"; clearable: false }
ChaSetKeybindingRecorder { value: "Ctrl+C"; enabled: false }`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: 14
                width: 260

                Column {
                    spacing: 4
                    width: parent.width
                    Text { text: "Default Size (with Clear)"; color: ThemeTokens.subduedText; font.pixelSize: 11 }
                    ChaSetKeybindingRecorder { width: parent.width; value: "Ctrl+K"; size: "default"; clearable: true }
                }

                Column {
                    spacing: 4
                    width: parent.width
                    Text { text: "Compact sm Tier"; color: ThemeTokens.subduedText; font.pixelSize: 11 }
                    ChaSetKeybindingRecorder { width: parent.width; value: "Ctrl+Shift+P"; size: "sm"; clearable: true }
                }

                Column {
                    spacing: 4
                    width: parent.width
                    Text { text: "Without Clear Button"; color: ThemeTokens.subduedText; font.pixelSize: 11 }
                    ChaSetKeybindingRecorder { width: parent.width; value: "Alt+F4"; clearable: false }
                }

                Column {
                    spacing: 4
                    width: parent.width
                    Text { text: "Disabled State"; color: ThemeTokens.subduedText; font.pixelSize: 11 }
                    ChaSetKeybindingRecorder { width: parent.width; value: "Ctrl+C"; enabled: false }
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

