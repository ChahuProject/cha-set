// LabelDocPage.qml — Documentation and interactive sandbox for ChaSetLabel
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Components"
    pageTitle: "Label"
    description: "Renders an accessible label associated with form controls."
    tocItems: [
        { id: "overview", title: "Interactive Overview" },
        { id: "installation", title: "Installation" },
        { id: "sizes", title: "Sizes" },
        { id: "states", title: "States" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "Props Reference" }
    ]

    property int customRadius: 8
    property color cFg: ThemeTokens.text
    property color cMutedFg: ThemeTokens.subduedText
    property color cCard: ThemeTokens.panel
    property color cBorder: ThemeTokens.border
    property color cPrimary: ThemeTokens.accent
    property color cAccentBg: ThemeTokens.hover

    property string demoSize: "default"
    property bool demoDisabled: false
    property bool demoRequired: false
    property bool demoOptional: false
    property bool demoInvalid: false

    // Section 1: Overview
    ComponentPreview {
        id: heroPreview
        width: parent.width
        title: "Label Sandbox"
        reactCode: `<div className="grid w-full max-w-sm items-center gap-1.5">\n  <Label htmlFor="email" size="${root.demoSize}"${root.demoDisabled ? ' disabled' : ''}${root.demoRequired ? ' required' : ''}${root.demoOptional ? ' optional' : ''}${root.demoInvalid ? ' invalid' : ''}>\n    Email address\n  </Label>\n  <Input type="email" id="email" placeholder="name@example.com" size="${root.demoSize}"${root.demoDisabled ? ' disabled' : ''}${root.demoInvalid ? ' invalid' : ''} />\n</div>`
        qtCode: `Column {\n    spacing: 6\n    width: 260\n\n    ChaSetLabel {\n        text: "Email address"\n        size: "${root.demoSize}"\n        disabled: ${root.demoDisabled}\n        required: ${root.demoRequired}\n        optional: ${root.demoOptional}\n        invalid: ${root.demoInvalid}\n    }\n\n    ChaSetInput {\n        width: parent.width\n        placeholder: "name@example.com"\n        size: "${root.demoSize}"\n        disabled: ${root.demoDisabled}\n        invalid: ${root.demoInvalid}\n    }\n}`

        stageData: [
            Column {
                anchors.centerIn: parent
                spacing: 6
                width: 260

                ChaSetLabel {
                    text: "Email address"
                    size: root.demoSize
                    disabled: root.demoDisabled
                    required: root.demoRequired
                    optional: root.demoOptional
                    invalid: root.demoInvalid
                }

                ChaSetInput {
                    width: parent.width
                    placeholder: "name@example.com"
                    size: root.demoSize
                    disabled: root.demoDisabled
                    invalid: root.demoInvalid
                }
            }
        ]

        controlsData: [
            Flow {
                width: parent.width
                spacing: 16

                Row {
                    spacing: 8
                    Text { text: "Size:"; color: root.cMutedFg; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
                    ChaSetTabs {
                        anchors.verticalCenter: parent.verticalCenter
                        currentValue: root.demoSize
                        onCurrentValueChanged: root.demoSize = currentValue
                        ChaSetTabsList {
                            ChaSetTabsTrigger { value: "default"; text: "Default" }
                            ChaSetTabsTrigger { value: "sm"; text: "Small (sm)" }
                        }
                    }
                }

                ChaSetCheckbox {
                    size: "sm"
                    label: "Disabled"
                    checked: root.demoDisabled
                    onToggled: (val) => root.demoDisabled = val
                    anchors.verticalCenter: parent.verticalCenter
                }

                ChaSetCheckbox {
                    size: "sm"
                    label: "Required"
                    checked: root.demoRequired
                    onToggled: (val) => root.demoRequired = val
                    anchors.verticalCenter: parent.verticalCenter
                }

                ChaSetCheckbox {
                    size: "sm"
                    label: "Optional"
                    checked: root.demoOptional
                    onToggled: (val) => root.demoOptional = val
                    anchors.verticalCenter: parent.verticalCenter
                }

                ChaSetCheckbox {
                    size: "sm"
                    label: "Invalid"
                    checked: root.demoInvalid
                    onToggled: (val) => root.demoInvalid = val
                    anchors.verticalCenter: parent.verticalCenter
                }
            }
        ]
    }

    // Section 2: Installation
    Column {
        width: parent.width
        spacing: 8
        Text { text: "Installation"; font.pixelSize: 18; font.weight: Font.Bold; color: root.cFg }
        CodeBlock {
            width: parent.width
            language: "bash"
            code: "pnpm add @chahu/cha-set"
        }
    }

    // Section 3: Sizes
    Column {
        width: parent.width
        spacing: 8
        Text { text: "Sizes"; font.pixelSize: 18; font.weight: Font.Bold; color: root.cFg }
        Text { text: "Choose between standard text size and compact high-density size for dense layouts."; color: root.cMutedFg; font.pixelSize: 13 }

        ChaSetCard {
            width: parent.width
            customRadius: root.customRadius

            Column {
                anchors.horizontalCenter: parent.horizontalCenter
                topPadding: 16
                bottomPadding: 16
                spacing: 12
                width: parent.width - 48

                Row {
                    spacing: 16
                    Text { width: 80; text: "Default:"; color: root.cMutedFg; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
                    ChaSetLabel { size: "default"; text: "Default Label" }
                }
                Row {
                    spacing: 16
                    Text { width: 80; text: "Small (sm):"; color: root.cMutedFg; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
                    ChaSetLabel { size: "sm"; text: "Small Label" }
                }
            }
        }
    }

    // Section 4: States
    Column {
        width: parent.width
        spacing: 8
        Text { text: "States & Variants"; font.pixelSize: 18; font.weight: Font.Bold; color: root.cFg }
        Text { text: "Visual matrix of label states including required asterisk, optional tag, validation error, helper description, and tooltips."; color: root.cMutedFg; font.pixelSize: 13 }

        Grid {
            width: parent.width
            columns: 2
            spacing: 16

            Rectangle {
                width: (parent.width - 16) / 2
                height: 100
                radius: 8
                color: root.cCard
                border.color: root.cBorder

                Column {
                    anchors.fill: parent
                    anchors.margins: 14
                    spacing: 6
                    Text { text: "Required Indicator"; color: root.cFg; font.pixelSize: 12; font.weight: Font.DemiBold }
                    Text { text: "Destructive asterisk denoting mandatory input fields"; color: root.cMutedFg; font.pixelSize: 11 }
                    ChaSetLabel { text: "Work Email"; required: true }
                }
            }

            Rectangle {
                width: (parent.width - 16) / 2
                height: 100
                radius: 8
                color: root.cCard
                border.color: root.cBorder

                Column {
                    anchors.fill: parent
                    anchors.margins: 14
                    spacing: 6
                    Text { text: "Optional Indicator"; color: root.cFg; font.pixelSize: 12; font.weight: Font.DemiBold }
                    Text { text: "Muted tag denoting non-mandatory optional fields"; color: root.cMutedFg; font.pixelSize: 11 }
                    ChaSetLabel { text: "Alternative Phone"; optional: true }
                }
            }

            Rectangle {
                width: (parent.width - 16) / 2
                height: 100
                radius: 8
                color: root.cCard
                border.color: root.cBorder

                Column {
                    anchors.fill: parent
                    anchors.margins: 14
                    spacing: 6
                    Text { text: "Validation Error (Invalid)"; color: root.cFg; font.pixelSize: 12; font.weight: Font.DemiBold }
                    Text { text: "Destructive text color highlighting validation error"; color: root.cMutedFg; font.pixelSize: 11 }
                    ChaSetLabel { text: "Account Password"; invalid: true }
                }
            }

            Rectangle {
                width: (parent.width - 16) / 2
                height: 100
                radius: 8
                color: root.cCard
                border.color: root.cBorder

                Column {
                    anchors.fill: parent
                    anchors.margins: 14
                    spacing: 6
                    Text { text: "With Info Tooltip"; color: root.cFg; font.pixelSize: 12; font.weight: Font.DemiBold }
                    Text { text: "Help icon with contextual explanation on hover"; color: root.cMutedFg; font.pixelSize: 11 }
                    ChaSetLabel { text: "Recovery Email"; tooltip: "Used for two-factor authentication recovery codes" }
                }
            }

            Rectangle {
                width: (parent.width - 16) / 2
                height: 100
                radius: 8
                color: root.cCard
                border.color: root.cBorder

                Column {
                    anchors.fill: parent
                    anchors.margins: 14
                    spacing: 6
                    Text { text: "With Helper Description"; color: root.cFg; font.pixelSize: 12; font.weight: Font.DemiBold }
                    Text { text: "Supporting guidance subtitle directly below label"; color: root.cMutedFg; font.pixelSize: 11 }
                    ChaSetLabel { text: "Legal Entity Name"; description: "Enter your official company legal name" }
                }
            }

            Rectangle {
                width: (parent.width - 16) / 2
                height: 100
                radius: 8
                color: root.cCard
                border.color: root.cBorder

                Column {
                    anchors.fill: parent
                    anchors.margins: 14
                    spacing: 6
                    Text { text: "Disabled State"; color: root.cFg; font.pixelSize: 12; font.weight: Font.DemiBold }
                    Text { text: "Dimmed opacity for non-interactive form elements"; color: root.cMutedFg; font.pixelSize: 11 }
                    ChaSetLabel { text: "Archived Record ID"; disabled: true }
                }
            }
        }
    }

    // Section 5: Props Reference
    Column {
        width: parent.width
        spacing: 8
        Text { text: "Keyboard Navigation"; font.pixelSize: 18; font.weight: Font.Bold; color: root.cFg }

        KeyboardShortcutsTable {
            componentId: "label"
        }

        Item { width: parent.width; height: 12 }

        Text { text: "Props Reference"; font.pixelSize: 18; font.weight: Font.Bold; color: root.cFg }

        PropsTable {
            width: parent.width
            propsModel: [
                { name: "size", type: "'default' | 'sm'", defaultValue: "'default'", desc: "Text size variant (default or compact sm)." },
                { name: "disabled", type: "bool", defaultValue: "false", desc: "Whether the label is displayed in a disabled dimmed state." },
                { name: "required", type: "bool", defaultValue: "false", desc: "Displays a destructive colored asterisk marker." },
                { name: "optional", type: "bool", defaultValue: "false", desc: "Displays a muted optional text indicator." },
                { name: "invalid", type: "bool", defaultValue: "false", desc: "Displays destructive text color indicating validation error." },
                { name: "description", type: "string", defaultValue: "''", desc: "Supporting helper text rendered beneath the label." },
                { name: "tooltip", type: "string", defaultValue: "''", desc: "Contextual help tooltip text displayed on hovering the info icon." },
                { name: "text", type: "string", defaultValue: "''", desc: "The label text to display." }
            ]
        }
    }
}
