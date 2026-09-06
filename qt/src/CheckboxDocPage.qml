// CheckboxDocPage.qml — Documentation and interactive sandbox for ChaSetCheckbox
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Components"
    pageTitle: "Checkbox"
    description: "A control that allows the user to toggle between checked and not-checked states, with support for indeterminate states, sizes, and companion labels."
    tocItems: [
        { id: "overview", title: "Interactive Overview" },
        { id: "installation", title: "Installation" },
        { id: "anatomy", title: "Anatomy" },
        { id: "examples", title: "Examples & States" },
        { id: "props", title: "Props Reference" }
    ]

    property int customRadius: 6
    property color cFg: ThemeTokens.text
    property color cMutedFg: ThemeTokens.subduedText
    property color cCard: ThemeTokens.panel
    property color cBorder: ThemeTokens.border
    property color cPrimary: ThemeTokens.accent
    property color cAccentBg: ThemeTokens.hover

    property string demoSize: "default"
    property bool demoChecked: true
    property bool demoIndeterminate: false
    property bool demoDisabled: false
    property string demoLabel: "Accept terms and conditions"

    // Section 1: Overview
    ComponentPreview {
        id: heroPreview
        width: parent.width
        title: "Checkbox Sandbox"
        reactCode: `<Checkbox\n  size="${root.demoSize}"\n  checked={${root.demoIndeterminate ? 'false' : root.demoChecked}}\n  indeterminate={${root.demoIndeterminate}}\n  disabled={${root.demoDisabled}}\n  label="${root.demoLabel}"\n  onCheckedChange={(val) => setChecked(val)}\n/>`
        qtCode: `ChaSetCheckbox {\n    size: "${root.demoSize}"\n    checked: ${root.demoIndeterminate ? 'false' : root.demoChecked}\n    indeterminate: ${root.demoIndeterminate}\n    disabled: ${root.demoDisabled}\n    label: "${root.demoLabel}"\n    onToggled: (val) => { /* handle toggle */ }\n}`

        stageData: [
            Item {
                anchors.centerIn: parent
                width: sandboxCheckbox.implicitWidth
                height: sandboxCheckbox.implicitHeight

                ChaSetCheckbox {
                    id: sandboxCheckbox
                    anchors.centerIn: parent
                    size: root.demoSize
                    checked: root.demoChecked
                    indeterminate: root.demoIndeterminate
                    disabled: root.demoDisabled
                    label: root.demoLabel
                    onToggled: (val) => {
                        if (root.demoIndeterminate) root.demoIndeterminate = false;
                        root.demoChecked = val;
                    }
                }
            }
        ]

        controlsData: [
            Row {
                spacing: 16

                Row {
                    spacing: 8
                    Text { text: "Size:"; color: root.cMutedFg; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
                    ChaSetTabs {
                        anchors.verticalCenter: parent.verticalCenter
                        currentValue: root.demoSize
                        onCurrentValueChanged: root.demoSize = currentValue
                        ChaSetTabsList {
                            ChaSetTabsTrigger { value: "default"; text: "Default (16px)" }
                            ChaSetTabsTrigger { value: "sm"; text: "Small (14px)" }
                        }
                    }
                }

                ChaSetCheckbox {
                    size: "sm"
                    label: "Checked"
                    checked: root.demoChecked && !root.demoIndeterminate
                    onToggled: (val) => {
                        root.demoChecked = val;
                        if (root.demoIndeterminate) root.demoIndeterminate = false;
                    }
                    anchors.verticalCenter: parent.verticalCenter
                }

                ChaSetCheckbox {
                    size: "sm"
                    label: "Indeterminate"
                    checked: root.demoIndeterminate
                    onToggled: (val) => root.demoIndeterminate = val
                    anchors.verticalCenter: parent.verticalCenter
                }

                ChaSetCheckbox {
                    size: "sm"
                    label: "Disabled"
                    checked: root.demoDisabled
                    onToggled: (val) => root.demoDisabled = val
                    anchors.verticalCenter: parent.verticalCenter
                }
            }
        ]
    }

    // Section 2: Installation
    Column {
        width: parent.width
        spacing: 12

        Text {
            text: "Installation"
            color: root.cFg
            font.pixelSize: 18
            font.weight: Font.Bold
        }

        CodeBlock {
            width: parent.width
            language: "bash"
            code: "pnpm add @chahu/cha-set"
        }
    }

    // Section 3: Anatomy
    Column {
        width: parent.width
        spacing: 12

        Text {
            text: "Anatomy"
            color: root.cFg
            font.pixelSize: 18
            font.weight: Font.Bold
        }

        Text {
            text: "Import and render ChaSetCheckbox in your QML scene graph with declarative properties and signals."
            color: root.cMutedFg
            font.pixelSize: 13
        }

        CodeBlock {
            width: parent.width
            language: "qml"
            code: "import QtQuick 6.10\nimport ChaSet\n\nChaSetCheckbox {\n    label: \"Remember me\"\n    checked: true\n    onToggled: (checked) => console.log(\"Checkbox state:\", checked)\n}"
        }
    }

    // Section 4: Examples & States
    Column {
        width: parent.width
        spacing: 16

        Text {
            text: "Examples & States"
            color: root.cFg
            font.pixelSize: 18
            font.weight: Font.Bold
        }

        Text {
            text: "Visual showcase of common checkbox states, sizes, and hierarchical groupings."
            color: root.cMutedFg
            font.pixelSize: 13
        }

        Flow {
            width: parent.width
            spacing: 16

            ChaSetCard {
                width: (parent.width - 16) / 2
                height: 140
                customRadius: root.customRadius

                Item {
                    width: parent.width
                    height: 140

                    Column {
                        anchors.fill: parent
                        anchors.margins: 16
                        spacing: 8

                        Text { text: "Unchecked & Checked"; font.pixelSize: 13; font.weight: Font.Bold; color: root.cFg }
                        Text { text: "Standard interactive toggle states"; font.pixelSize: 11; color: root.cMutedFg }

                        Column {
                            spacing: 8
                            ChaSetCheckbox { checked: false; label: "Unchecked by default" }
                            ChaSetCheckbox { checked: true; label: "Checked by default" }
                        }
                    }
                }
            }

            ChaSetCard {
                width: (parent.width - 16) / 2
                height: 140
                customRadius: root.customRadius

                Item {
                    width: parent.width
                    height: 140

                    Column {
                        anchors.fill: parent
                        anchors.margins: 16
                        spacing: 8

                        Text { text: "Indeterminate State"; font.pixelSize: 13; font.weight: Font.Bold; color: root.cFg }
                        Text { text: "Represents partially selected sub-options"; font.pixelSize: 11; color: root.cMutedFg }

                        Column {
                            spacing: 6
                            ChaSetCheckbox { indeterminate: true; label: "Select all sub-tasks" }
                            Row {
                                spacing: 8
                                Item { width: 14; height: 1 }
                                ChaSetCheckbox { size: "sm"; checked: true; label: "Task 1: Requirements" }
                            }
                        }
                    }
                }
            }

            ChaSetCard {
                width: (parent.width - 16) / 2
                height: 140
                customRadius: root.customRadius

                Item {
                    width: parent.width
                    height: 140

                    Column {
                        anchors.fill: parent
                        anchors.margins: 16
                        spacing: 8

                        Text { text: "Disabled States"; font.pixelSize: 13; font.weight: Font.Bold; color: root.cFg }
                        Text { text: "Non-interactive with 50% opacity"; font.pixelSize: 11; color: root.cMutedFg }

                        Column {
                            spacing: 8
                            ChaSetCheckbox { disabled: true; checked: false; label: "Disabled unchecked" }
                            ChaSetCheckbox { disabled: true; checked: true; label: "Disabled checked" }
                        }
                    }
                }
            }

            ChaSetCard {
                width: (parent.width - 16) / 2
                height: 140
                customRadius: root.customRadius

                Item {
                    width: parent.width
                    height: 140

                    Column {
                        anchors.fill: parent
                        anchors.margins: 16
                        spacing: 8

                        Text { text: "Size Variants"; font.pixelSize: 13; font.weight: Font.Bold; color: root.cFg }
                        Text { text: "Default 16px vs Compact 14px box"; font.pixelSize: 11; color: root.cMutedFg }

                        Column {
                            spacing: 8
                            ChaSetCheckbox { size: "default"; checked: true; label: "Default size (16px box, text-sm)" }
                            ChaSetCheckbox { size: "sm"; checked: true; label: "Small size (14px box, text-xs)" }
                        }
                    }
                }
            }
        }
    }

    // Section 5: Props Reference
    Column {
        width: parent.width
        spacing: 12

        Text {
            text: "Props Reference"
            color: root.cFg
            font.pixelSize: 18
            font.weight: Font.Bold
        }

        PropsTable {
            width: parent.width
            propsModel: [
                { name: "checked", type: "bool", defaultValue: "false", desc: "Whether the checkbox is currently checked." },
                { name: "indeterminate", type: "bool", defaultValue: "false", desc: "Whether the checkbox is in an indeterminate state (takes visual precedence over checked)." },
                { name: "disabled", type: "bool", defaultValue: "false", desc: "Disables user interactions and applies 50% opacity." },
                { name: "size", type: "'default' | 'sm'", defaultValue: "'default'", desc: "The size variant: default (16px box) or sm (14px box)." },
                { name: "label", type: "string", defaultValue: "''", desc: "Companion label text displayed next to the checkbox." },
                { name: "customRadius", type: "int", defaultValue: "-1", desc: "Optional custom corner radius for the checkbox box (-1 uses default)." },
                { name: "forceHover", type: "bool", defaultValue: "false", desc: "Visual testing aid to force hover state styles." },
                { name: "forceFocus", type: "bool", defaultValue: "false", desc: "Visual testing aid to force focus ring styles." }
            ]
        }
    }
}
