// DurationInputDocPage.qml — Living Documentation for ChaSetDurationInput
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Forms & Inputs"
    pageTitle: "Duration Input"
    description: ChaSetI18n.tr("components.duration-input.description", "Segmented duration input control for hours, minutes, and seconds with stepper buttons, mouse wheel adjustments, keyboard arrow jumping, and preset menu.")

    ComponentPreview {
        title: ChaSetI18n.tr("desktopComposite.durationInput.sandboxTitle", "Duration Input Sandbox")
        reactCode: `<DurationInput value={3665} onChange={(v) => console.log(v)} />`
        qtCode: `ChaSetDurationInput {
    value: 3665
}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: 16

                Column {
                    spacing: 6
                    DocText { text: ChaSetI18n.tr("components.durationInput.timerDurationDefault", "Timer Duration (Default):"); color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeSmall }
                    ChaSetDurationInput {
                        value: 3665
                        hoursLabel: ChaSetI18n.tr("components.durationInput.hours", "Hours")
                        minutesLabel: ChaSetI18n.tr("components.durationInput.minutes", "Minutes")
                        secondsLabel: ChaSetI18n.tr("components.durationInput.seconds", "Seconds")
                        presetsLabel: ChaSetI18n.tr("components.durationInput.presets", "Presets")
                    }
                }

                Column {
                    spacing: 6
                    DocText { text: ChaSetI18n.tr("components.durationInput.compactSizeColon", "Compact Size (sm):"); color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeSmall }
                    ChaSetDurationInput {
                        size: "sm"
                        value: 300
                        hoursLabel: ChaSetI18n.tr("components.durationInput.hours", "Hours")
                        minutesLabel: ChaSetI18n.tr("components.durationInput.minutes", "Minutes")
                        secondsLabel: ChaSetI18n.tr("components.durationInput.seconds", "Seconds")
                        presetsLabel: ChaSetI18n.tr("components.durationInput.presets", "Presets")
                    }
                }

                Column {
                    spacing: 6
                    DocText { text: ChaSetI18n.tr("components.durationInput.disabledStateColon", "Disabled State:"); color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeSmall }
                    ChaSetDurationInput {
                        value: 900
                        disabled: true
                        hoursLabel: ChaSetI18n.tr("components.durationInput.hours", "Hours")
                        minutesLabel: ChaSetI18n.tr("components.durationInput.minutes", "Minutes")
                        secondsLabel: ChaSetI18n.tr("components.durationInput.seconds", "Seconds")
                        presetsLabel: ChaSetI18n.tr("components.durationInput.presets", "Presets")
                    }
                }
            }
        }
    }

    DocAnatomy {
        sectionId: "anatomy"
        width: parent.width
        qtCode: `import ChaSet

ChaSetDurationInput {
    value: 3600
    onValueChanged: (v) => console.log(v)
}`
        reactCode: `import { DurationInput } from '@chahu/cha-set';

<DurationInput value={3600} onChange={(v) => console.log(v)} />`
    }

    // Section: Variants & Configurations
    Column {
        property string sectionId: "variants"
        width: parent.width
        spacing: ThemeTokens.dp(12)

        DocText {
            text: ChaSetI18n.tr("components.durationInput.variantsTitle", "Variants & Configurations")
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
            color: ThemeTokens.text
        }

        DocText {
            text: ChaSetI18n.tr("components.durationInput.variantsDesc", "Supports compact and comfortable sizes, disabling presets or labels, and disabled states.")
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
                    DocText { text: ChaSetI18n.tr("components.durationInput.compactTitle", "Compact Size (sm)"); color: ThemeTokens.text; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    ChaSetDurationInput {
                        width: parent.width - ThemeTokens.dp(28)
                        size: "sm"
                        value: 300
                        hoursLabel: ChaSetI18n.tr("components.durationInput.hours", "Hours")
                        minutesLabel: ChaSetI18n.tr("components.durationInput.minutes", "Minutes")
                        secondsLabel: ChaSetI18n.tr("components.durationInput.seconds", "Seconds")
                        presetsLabel: ChaSetI18n.tr("components.durationInput.presets", "Presets")
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
                    DocText { text: ChaSetI18n.tr("components.durationInput.largeTitle", "Large Size (lg)"); color: ThemeTokens.text; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    ChaSetDurationInput {
                        width: parent.width - ThemeTokens.dp(28)
                        size: "lg"
                        value: 7200
                        hoursLabel: ChaSetI18n.tr("components.durationInput.hours", "Hours")
                        minutesLabel: ChaSetI18n.tr("components.durationInput.minutes", "Minutes")
                        secondsLabel: ChaSetI18n.tr("components.durationInput.seconds", "Seconds")
                        presetsLabel: ChaSetI18n.tr("components.durationInput.presets", "Presets")
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
                    DocText { text: ChaSetI18n.tr("components.durationInput.disabledTitle", "Disabled State"); color: ThemeTokens.text; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    ChaSetDurationInput {
                        width: parent.width - ThemeTokens.dp(28)
                        value: 900
                        disabled: true
                        hoursLabel: ChaSetI18n.tr("components.durationInput.hours", "Hours")
                        minutesLabel: ChaSetI18n.tr("components.durationInput.minutes", "Minutes")
                        secondsLabel: ChaSetI18n.tr("components.durationInput.seconds", "Seconds")
                        presetsLabel: ChaSetI18n.tr("components.durationInput.presets", "Presets")
                    }
                }
            }
        }
    }

    ComponentReference {
        name: "DurationInput"
        componentId: "duration-input"
        propsModel: [
            { name: "value", type: "int", defaultVal: "0", description: ChaSetI18n.tr("components.durationInput.valueDesc", "Total duration in seconds (controlled mode).") },
            { name: "maxHours", type: "int", defaultVal: "99", description: ChaSetI18n.tr("components.durationInput.maxHoursDesc", "Upper clamp limit for the hours segment.") },
            { name: "size", type: "string", defaultVal: "'default'", description: ChaSetI18n.tr("components.durationInput.sizeDesc", "Visual density and size variant.") },
            { name: "disabled", type: "bool", defaultVal: "false", description: ChaSetI18n.tr("components.durationInput.disabledDesc", "Whether the inputs, buttons, and preset dropdown are disabled.") },
            { name: "showPresets", type: "bool", defaultVal: "true", description: ChaSetI18n.tr("components.durationInput.showPresetsDesc", "Whether to display the preset dropdown button.") },
            { name: "showLabels", type: "bool", defaultVal: "true", description: ChaSetI18n.tr("components.durationInput.showLabelsDesc", "Whether to display the segment unit labels underneath.") },
            { name: "hoursLabel", type: "string", defaultVal: "'Hours'", description: ChaSetI18n.tr("components.durationInput.hoursLabelDesc", "Label text for hours segment.") },
            { name: "minutesLabel", type: "string", defaultVal: "'Minutes'", description: ChaSetI18n.tr("components.durationInput.minutesLabelDesc", "Label text for minutes segment.") },
            { name: "secondsLabel", type: "string", defaultVal: "'Seconds'", description: ChaSetI18n.tr("components.durationInput.secondsLabelDesc", "Label text for seconds segment.") },
            { name: "presetsLabel", type: "string", defaultVal: "'Presets'", description: ChaSetI18n.tr("components.durationInput.presetsLabelDesc", "Label text for the presets trigger button.") },
            { name: "customRadius", type: "int", defaultVal: "6", description: ChaSetI18n.tr("components.durationInput.customRadiusDesc", "Corner radius of segment boxes and popup.") }
        ]
    }
}
