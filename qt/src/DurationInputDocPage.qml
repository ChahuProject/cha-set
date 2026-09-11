// DurationInputDocPage.qml — Living Documentation for ChaSetDurationInput
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Interactive Controls"
    pageTitle: "Duration Input"
    description: "Segmented duration input control for hours, minutes, and seconds with stepper buttons, mouse wheel adjustments, keyboard arrow jumping, and preset menu."
    tocItems: [
        { id: "preview", title: "Interactive Preview" },
        { id: "installation", title: "Installation" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "API Reference" }
    ]

    ComponentPreview {
        title: "Duration Input Preview"
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
                    Text { text: "Timer Duration (Default):"; color: ThemeTokens.subduedText; font.pixelSize: 12 }
                    ChaSetDurationInput {
                        value: 3665
                    }
                }

                Column {
                    spacing: 6
                    Text { text: "Compact Size (sm):"; color: ThemeTokens.subduedText; font.pixelSize: 12 }
                    ChaSetDurationInput {
                        size: "sm"
                        value: 300
                    }
                }

                Column {
                    spacing: 6
                    Text { text: "Disabled State:"; color: ThemeTokens.subduedText; font.pixelSize: 12 }
                    ChaSetDurationInput {
                        value: 900
                        disabled: true
                    }
                }
            }
        }
    }

    CodeBlock {
        title: "Installation"
        code: "import ChaSet 1.0\n\nChaSetDurationInput {\n    value: 3600\n    showPresets: true\n    showLabels: true\n}"
        language: "qml"
    }

    KeyboardShortcutsTable {
        componentId: "duration-input"
    }

    PropsTable {
        title: "Props Reference"
        props: [
            { name: "value", type: "int", default: "0", description: "Total duration in seconds." },
            { name: "maxHours", type: "int", default: "99", description: "Upper clamp limit for the hours segment." },
            { name: "size", type: "string", default: "'default'", description: "Visual density and size variant ('sm', 'default', 'lg')." },
            { name: "disabled", type: "bool", default: "false", description: "Whether editing, stepper buttons, and dropdown are disabled." },
            { name: "showPresets", type: "bool", default: "true", description: "Whether to display the preset dropdown button." },
            { name: "showLabels", type: "bool", default: "true", description: "Whether to display the segment unit labels underneath." },
            { name: "hoursLabel", type: "string", default: "'Hours'", description: "Label text for the hours segment." },
            { name: "minutesLabel", type: "string", default: "'Minutes'", description: "Label text for the minutes segment." },
            { name: "secondsLabel", type: "string", default: "'Seconds'", description: "Label text for the seconds segment." },
            { name: "presetsLabel", type: "string", default: "'Presets'", description: "Label text for the presets button." },
            { name: "customRadius", type: "int", default: "6", description: "Corner radius of segment boxes and popup." }
        ]
    }
}
