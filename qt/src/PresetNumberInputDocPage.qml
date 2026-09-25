// PresetNumberInputDocPage.qml — Living Documentation for ChaSetPresetNumberInput
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Forms & Inputs"
    pageTitle: "Preset Number Input"
    description: "High-density numeric input field with a quick-select dropdown panel for common dimension presets, unit tags, and optional clear action."

    ComponentPreview {
        title: "Preset Number Input Sandbox"
        reactCode: `<PresetNumberInput value="1024" onChange={(v) => console.log(v)} />`
        qtCode: `ChaSetPresetNumberInput {
    value: "1024"
}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: ThemeTokens.dp(16)

                Column {
                    spacing: ThemeTokens.dp(6)
                    DocText { text: "Texture Dimension:"; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeSmall }
                    ChaSetPresetNumberInput {
                        width: ThemeTokens.dp(220)
                        value: "1024"
                    }
                }

                Column {
                    spacing: ThemeTokens.dp(6)
                    DocText { text: "Custom Presets (Small):"; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeSmall }
                    ChaSetPresetNumberInput {
                        width: ThemeTokens.dp(220)
                        presets: [8, 16, 32, 64, 128]
                        value: "64"
                        clearLabel: "Auto"
                    }
                }
            }
        }
    }

    DocAnatomy {
        sectionId: "anatomy"
        width: parent.width
        qtCode: `import ChaSet

ChaSetPresetNumberInput {
    value: 100
    presets: [50, 100, 200]
}`
        reactCode: `import { PresetNumberInput } from '@chahu/cha-set';

<PresetNumberInput value={100} presets={[50, 100, 200]} onChange={(v) => console.log(v)} />`
    }

    // Section: Variants & Configurations
    Column {
        property string sectionId: "variants"
        width: parent.width
        spacing: ThemeTokens.dp(12)

        DocText {
            text: "Variants & Configurations"
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
            color: ThemeTokens.text
        }

        DocText {
            text: "Configure custom numeric presets, disable the clear option, or place the control in disabled state."
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
        }

        Grid {
            width: parent.width
            columns: 3
            spacing: ThemeTokens.dp(16)

            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(32)) / 3
                customRadius: ThemeTokens.dp(8)
                Column {
                    width: parent.width
                    padding: ThemeTokens.dp(14)
                    spacing: ThemeTokens.dp(8)
                    DocText { text: "Custom Presets (Small)"; color: ThemeTokens.text; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    ChaSetPresetNumberInput {
                        width: parent.width - ThemeTokens.dp(28)
                        presets: [8, 16, 32, 64, 128]
                        value: "64"
                        clearLabel: "Auto"
                    }
                }
            }

            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(32)) / 3
                customRadius: ThemeTokens.dp(8)
                Column {
                    width: parent.width
                    padding: ThemeTokens.dp(14)
                    spacing: ThemeTokens.dp(8)
                    DocText { text: "Disallow Clear (Mandatory)"; color: ThemeTokens.text; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    ChaSetPresetNumberInput {
                        width: parent.width - ThemeTokens.dp(28)
                        value: "256"
                        allowClear: false
                    }
                }
            }

            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(32)) / 3
                customRadius: ThemeTokens.dp(8)
                Column {
                    width: parent.width
                    padding: ThemeTokens.dp(14)
                    spacing: ThemeTokens.dp(8)
                    DocText { text: "Disabled State"; color: ThemeTokens.text; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    ChaSetPresetNumberInput {
                        width: parent.width - ThemeTokens.dp(28)
                        value: "2048"
                        disabled: true
                    }
                }
            }
        }
    }

    ComponentReference {
        name: "PresetNumberInput"
        componentId: "preset-number-input"
        propsModel: [
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
