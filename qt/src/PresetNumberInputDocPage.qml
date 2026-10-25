// PresetNumberInputDocPage.qml — Living Documentation for ChaSetPresetNumberInput
import QtQuick
import QtQuick.Controls
import ChaSet

DocLayout {
    id: root
    category: "Forms & Inputs"
    pageTitle: "Preset Number Input"
    description: ChaSetI18n.tr("components.preset-number-input.description", "High-density numeric input field with a quick-select dropdown panel for common dimension presets, unit tags, and optional clear action.")

    ComponentPreview {
        title: ChaSetI18n.tr("desktopComposite.presetNumberInput.sandboxTitle", "Preset Number Input Sandbox")
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
                    DocText { text: ChaSetI18n.tr("components.presetNumberInput.textureDimensionColon", "Texture Dimension:"); color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeSmall }
                    ChaSetPresetNumberInput {
                        width: ThemeTokens.dp(220)
                        value: "1024"
                    }
                }

                Column {
                    spacing: ThemeTokens.dp(6)
                    DocText { text: ChaSetI18n.tr("components.presetNumberInput.customPresetsSmallColon", "Custom Presets (Small):"); color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeSmall }
                    ChaSetPresetNumberInput {
                        width: ThemeTokens.dp(220)
                        presets: [8, 16, 32, 64, 128]
                        value: "64"
                        clearLabel: ChaSetI18n.tr("components.presetNumberInput.auto", "Auto")
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
            text: ChaSetI18n.tr("components.presetNumberInput.variantsTitle", "Variants & Configurations")
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
            color: ThemeTokens.text
        }

        DocText {
            text: ChaSetI18n.tr("components.presetNumberInput.variantsDesc", "Configure custom numeric presets, disable the clear option, or place the control in disabled state.")
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
        }

        Grid {
            width: parent.width
            columns: 3
            spacing: ThemeTokens.dp(16)

            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(32)) / 3
                customRadius: 8
                Column {
                    width: parent.width
                    padding: ThemeTokens.dp(14)
                    spacing: ThemeTokens.dp(8)
                    DocText { text: ChaSetI18n.tr("components.presetNumberInput.customPresetsSmall", "Custom Presets (Small)"); color: ThemeTokens.text; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    ChaSetPresetNumberInput {
                        width: parent.width - ThemeTokens.dp(28)
                        presets: [8, 16, 32, 64, 128]
                        value: "64"
                        clearLabel: ChaSetI18n.tr("components.presetNumberInput.auto", "Auto")
                    }
                }
            }

            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(32)) / 3
                customRadius: 8
                Column {
                    width: parent.width
                    padding: ThemeTokens.dp(14)
                    spacing: ThemeTokens.dp(8)
                    DocText { text: ChaSetI18n.tr("components.presetNumberInput.disallowClear", "Disallow Clear (Mandatory)"); color: ThemeTokens.text; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    ChaSetPresetNumberInput {
                        width: parent.width - ThemeTokens.dp(28)
                        value: "256"
                        allowClear: false
                    }
                }
            }

            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(32)) / 3
                customRadius: 8
                Column {
                    width: parent.width
                    padding: ThemeTokens.dp(14)
                    spacing: ThemeTokens.dp(8)
                    DocText { text: ChaSetI18n.tr("components.presetNumberInput.disabledTitle", "Disabled State"); color: ThemeTokens.text; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    ChaSetPresetNumberInput {
                        width: parent.width - ThemeTokens.dp(28)
                        value: "2048"
                        disabled: true
                    }
                }
            }
        }
    }

    DocMarkdown {
        width: parent.width
        docId: "preset-number-input"
        section: "keyboard"
    }

    DocMarkdown {
        width: parent.width
        docId: "preset-number-input"
        section: "props"
    }
}
