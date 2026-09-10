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

    // Section 1: Overview
    ComponentPreview {
        id: heroPreview
        width: parent.width
        title: "Label Sandbox"
        reactCode: `<div className="grid w-full max-w-sm items-center gap-1.5">\n  <Label htmlFor="email" size="${root.demoSize}"${root.demoDisabled ? ' disabled' : ''}${root.demoRequired ? ' required' : ''}>\n    Email address\n  </Label>\n  <Input type="email" id="email" placeholder="name@example.com" size="${root.demoSize}"${root.demoDisabled ? ' disabled' : ''} />\n</div>`
        qtCode: `Column {\n    spacing: 6\n    width: 260\n\n    ChaSetLabel {\n        text: "Email address"\n        size: "${root.demoSize}"\n        disabled: ${root.demoDisabled}\n        required: ${root.demoRequired}\n    }\n\n    ChaSetInput {\n        width: parent.width\n        placeholder: "name@example.com"\n        size: "${root.demoSize}"\n        disabled: ${root.demoDisabled}\n    }\n}`

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
                }

                ChaSetInput {
                    width: parent.width
                    placeholder: "name@example.com"
                    size: root.demoSize
                    disabled: root.demoDisabled
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
                            ChaSetTabsTrigger { value: "default"; text: "Default" }
                            ChaSetTabsTrigger { value: "sm"; text: "Small (sm)" }
                        }
                    }
                }

                Row {
                    spacing: 8
                    Text { text: "Disabled:"; color: root.cMutedFg; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
                    ChaSetTabs {
                        anchors.verticalCenter: parent.verticalCenter
                        currentValue: root.demoDisabled ? "true" : "false"
                        onCurrentValueChanged: root.demoDisabled = (currentValue === "true")
                        ChaSetTabsList {
                            ChaSetTabsTrigger { value: "false"; text: "False" }
                            ChaSetTabsTrigger { value: "true"; text: "True" }
                        }
                    }
                }

                Row {
                    spacing: 8
                    Text { text: "Required:"; color: root.cMutedFg; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
                    ChaSetTabs {
                        anchors.verticalCenter: parent.verticalCenter
                        currentValue: root.demoRequired ? "true" : "false"
                        onCurrentValueChanged: root.demoRequired = (currentValue === "true")
                        ChaSetTabsList {
                            ChaSetTabsTrigger { value: "false"; text: "False" }
                            ChaSetTabsTrigger { value: "true"; text: "True" }
                        }
                    }
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
        Text { text: "Choose between standard text size (14px) and compact high-density size (12px)."; color: root.cMutedFg; font.pixelSize: 13 }

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
                    ChaSetLabel { size: "default"; text: "Default Label (14px)" }
                }
                Row {
                    spacing: 16
                    Text { width: 80; text: "Small (sm):"; color: root.cMutedFg; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
                    ChaSetLabel { size: "sm"; text: "Small Label (12px)" }
                }
            }
        }
    }

    // Section 4: States
    Column {
        width: parent.width
        spacing: 8
        Text { text: "States"; font.pixelSize: 18; font.weight: Font.Bold; color: root.cFg }
        Text { text: "Standard visual states for label including required marker and disabled appearance."; color: root.cMutedFg; font.pixelSize: 13 }

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
                    Text { width: 80; text: "Standard:"; color: root.cMutedFg; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
                    ChaSetLabel { text: "Project Name" }
                }
                Row {
                    spacing: 16
                    Text { width: 80; text: "Required:"; color: root.cMutedFg; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
                    ChaSetLabel { text: "Required Field"; required: true }
                }
                Row {
                    spacing: 16
                    Text { width: 80; text: "Disabled:"; color: root.cMutedFg; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
                    ChaSetLabel { text: "Disabled Field"; disabled: true }
                }
            }
        }
    }

    // Section 5: Props Reference
    Column {
        width: parent.width
        spacing: 8
        Text { text: "Props Reference"; font.pixelSize: 18; font.weight: Font.Bold; color: root.cFg }

        
    KeyboardShortcutsTable {
        componentId: "label"
    }

    PropsTable {
            width: parent.width
            propsModel: [
                { name: "size", type: "'default' | 'sm'", defaultValue: "'default'", desc: "Text size variant (default = 14px, sm = 12px)." },
                { name: "disabled", type: "bool", defaultValue: "false", desc: "Whether the label is displayed in a disabled dimmed state." },
                { name: "required", type: "bool", defaultValue: "false", desc: "Displays a destructive colored asterisk marker." },
                { name: "text", type: "string", defaultValue: "''", desc: "The label text to display." }
            ]
        }
    }
}
