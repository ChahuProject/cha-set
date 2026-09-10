// PresetNumberInputDocPage.qml — Living Documentation for ChaSetPresetNumberInput
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Interactive Controls"
    pageTitle: "Preset Number Input"
    description: "High-density numeric input field with a quick-select dropdown panel for common dimension presets, unit tags, and optional clear action."
    tocItems: [
        { id: "preview", title: "Interactive Preview" },
        { id: "installation", title: "Installation" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "API Reference" }
    ]

    ComponentPreview {
        title: "Preset Number Input Preview"
        reactCode: `<PresetNumberInput value="1024" onChange={(v) => console.log(v)} />`
        qtCode: `ChaSetPresetNumberInput {
    value: "1024"
}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: 16

                Column {
                    spacing: 6
                    Text { text: "Texture Dimension (px):"; color: ThemeTokens.subduedText; font.pixelSize: 12 }
                    ChaSetPresetNumberInput {
                        width: 220
                        value: "1024"
                    }
                }

                Column {
                    spacing: 6
                    Text { text: "Custom Presets (Small):"; color: ThemeTokens.subduedText; font.pixelSize: 12 }
                    ChaSetPresetNumberInput {
                        width: 220
                        presets: [8, 16, 32, 64, 128]
                        value: "64"
                        clearLabel: "Auto"
                    }
                }
            }
        }
    }

    CodeBlock {
        title: "Installation"
        code: "import ChaSet 1.0\n\nChaSetPresetNumberInput {\n    value: \"1024\"\n    presets: [64, 128, 256, 512, 1024, 2048, 4096]\n}"
        language: "qml"
    }

    
    KeyboardShortcutsTable {
        componentId: "preset-number-input"
    }

    PropsTable {
        title: "Props Reference"
        props: [
            { name: "value", type: "string", default: "''", description: "Current numeric value of the input." },
            { name: "presets", type: "array", default: "[64, 128, 256, 512, 1024, 2048, 4096, 8192]", description: "Array of preset numbers shown in dropdown." },
            { name: "placeholder", type: "string", default: "''", description: "Placeholder text displayed when empty." },
            { name: "disabled", type: "bool", default: "false", description: "Disables typing and dropdown interactions." },
            { name: "allowClear", type: "bool", default: "true", description: "Whether to show the reset/clear option." },
            { name: "clearLabel", type: "string", default: "'None'", description: "Label text for the clear option." },
            { name: "customRadius", type: "int", default: "6", description: "Corner radius of the input and popup." }
        ]
    }
}
