// DurationInputDocPage.qml — Living Documentation for ChaSetDurationInput
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Forms & Inputs"
    pageTitle: "Duration Input"
    description: "Segmented duration input control for hours, minutes, and seconds with stepper buttons, mouse wheel adjustments, keyboard arrow jumping, and preset menu."

    ComponentPreview {
        title: "Duration Input Sandbox"
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
                    DocText { text: "Timer Duration (Default):"; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeSmall }
                    ChaSetDurationInput {
                        value: 3665
                    }
                }

                Column {
                    spacing: 6
                    DocText { text: "Compact Size (sm):"; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeSmall }
                    ChaSetDurationInput {
                        size: "sm"
                        value: 300
                    }
                }

                Column {
                    spacing: 6
                    DocText { text: "Disabled State:"; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeSmall }
                    ChaSetDurationInput {
                        value: 900
                        disabled: true
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
            text: "Variants & Configurations"
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
            color: ThemeTokens.text
        }

        DocText {
            text: "Supports compact and comfortable sizes, disabling presets or labels, and disabled states."
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
                    anchors.fill: parent
                    anchors.margins: ThemeTokens.dp(14)
                    spacing: ThemeTokens.dp(8)
                    DocText { text: "Compact Size (sm)"; color: ThemeTokens.text; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    ChaSetDurationInput {
                        width: parent.width
                        size: "sm"
                        value: 300
                    }
                }
            }

            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(32)) / 3
                customRadius: ThemeTokens.dp(8)
                Column {
                    anchors.fill: parent
                    anchors.margins: ThemeTokens.dp(14)
                    spacing: ThemeTokens.dp(8)
                    DocText { text: "Large Size (lg)"; color: ThemeTokens.text; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    ChaSetDurationInput {
                        width: parent.width
                        size: "lg"
                        value: 7200
                    }
                }
            }

            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(32)) / 3
                customRadius: ThemeTokens.dp(8)
                Column {
                    anchors.fill: parent
                    anchors.margins: ThemeTokens.dp(14)
                    spacing: ThemeTokens.dp(8)
                    DocText { text: "Disabled State"; color: ThemeTokens.text; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    ChaSetDurationInput {
                        width: parent.width
                        value: 900
                        disabled: true
                    }
                }
            }
        }
    }

    ComponentReference {
        name: "DurationInput"
        componentId: "duration-input"
        propsModel: [
            { name: "value", type: "int", defaultVal: "0", description: "Total duration in seconds." },
            { name: "maxHours", type: "int", defaultVal: "99", description: "Upper clamp limit for the hours segment." },
            { name: "size", type: "string", defaultVal: "'default'", description: "Visual density and size variant ('sm', 'default', 'lg')." },
            { name: "disabled", type: "bool", defaultVal: "false", description: "Whether editing, stepper buttons, and dropdown are disabled." },
            { name: "showPresets", type: "bool", defaultVal: "true", description: "Whether to display the preset dropdown button." },
            { name: "showLabels", type: "bool", defaultVal: "true", description: "Whether to display the segment unit labels underneath." },
            { name: "hoursLabel", type: "string", defaultVal: "'Hours'", description: "Label text for the hours segment." },
            { name: "minutesLabel", type: "string", defaultVal: "'Minutes'", description: "Label text for the minutes segment." },
            { name: "secondsLabel", type: "string", defaultVal: "'Seconds'", description: "Label text for the seconds segment." },
            { name: "presetsLabel", type: "string", defaultVal: "'Presets'", description: "Label text for the presets button." },
            { name: "customRadius", type: "int", defaultVal: "6", description: "Corner radius of segment boxes and popup." }
        ]
    }
}
