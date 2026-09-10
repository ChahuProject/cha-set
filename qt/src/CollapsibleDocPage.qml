// CollapsibleDocPage.qml — Documentation and interactive sandbox for ChaSetCollapsible
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Components"
    pageTitle: "Collapsible"
    description: "An interactive component which expands and collapses a panel of content."
    tocItems: [
        { id: "overview", title: "Interactive Overview" },
        { id: "installation", title: "Installation" },
        { id: "default-open", title: "Default Open" },
        { id: "disabled", title: "Disabled State" },
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

    property bool demoOpen: false
    property bool demoDisabled: false
    property string demoVariant: "default"

    // Section 1: Overview
    ComponentPreview {
        id: heroPreview
        width: parent.width
        title: "Collapsible Sandbox"
        reactCode: `<Collapsible open={${root.demoOpen}} disabled={${root.demoDisabled}} variant="${root.demoVariant}">\n  <CollapsibleTrigger>Toggle Details</CollapsibleTrigger>\n  <CollapsibleContent>\n    <div>Collapsible content panel</div>\n  </CollapsibleContent>\n</Collapsible>`
        qtCode: `ChaSetCollapsible {\n    width: 280\n    title: "Repository Details"\n    open: ${root.demoOpen}\n    disabled: ${root.demoDisabled}\n    variant: "${root.demoVariant}"\n\n    Column {\n        width: parent.width\n        spacing: 6\n        topPadding: 8\n\n        Rectangle {\n            width: parent.width\n            height: 32\n            radius: 4\n            color: ThemeTokens.hover\n            Text {\n                anchors.centerIn: parent\n                text: "@radix-ui/primitives"\n                color: ThemeTokens.text\n                font.pixelSize: 12\n            }\n        }\n    }\n}`

        stageData: [
            Column {
                anchors.centerIn: parent
                spacing: 8
                width: 280

                ChaSetCollapsible {
                    width: parent.width
                    title: "Repository Details"
                    open: root.demoOpen
                    disabled: root.demoDisabled
                    variant: root.demoVariant
                    onToggled: function(val) { root.demoOpen = val; }

                    Column {
                        width: parent.width
                        spacing: 6
                        topPadding: 8

                        Rectangle {
                            width: parent.width
                            height: 32
                            radius: 4
                            color: ThemeTokens.hover

                            Text {
                                anchors.centerIn: parent
                                text: "@radix-ui/primitives"
                                color: ThemeTokens.text
                                font.pixelSize: 12
                            }
                        }

                        Rectangle {
                            width: parent.width
                            height: 32
                            radius: 4
                            color: ThemeTokens.hover

                            Text {
                                anchors.centerIn: parent
                                text: "@stitches/react"
                                color: ThemeTokens.text
                                font.pixelSize: 12
                            }
                        }
                    }
                }
            }
        ]

        controlsData: [
            Row {
                spacing: 16

                Row {
                    spacing: 8
                    Text { text: "State:"; color: root.cMutedFg; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
                    ChaSetTabs {
                        anchors.verticalCenter: parent.verticalCenter
                        currentValue: root.demoOpen ? "true" : "false"
                        onCurrentValueChanged: root.demoOpen = (currentValue === "true")
                        ChaSetTabsList {
                            ChaSetTabsTrigger { value: "false"; text: "Collapsed" }
                            ChaSetTabsTrigger { value: "true"; text: "Expanded" }
                        }
                    }
                }

                Row {
                    spacing: 8
                    Text { text: "Variant:"; color: root.cMutedFg; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
                    ChaSetTabs {
                        anchors.verticalCenter: parent.verticalCenter
                        currentValue: root.demoVariant
                        onCurrentValueChanged: root.demoVariant = currentValue
                        ChaSetTabsList {
                            ChaSetTabsTrigger { value: "default"; text: "Default" }
                            ChaSetTabsTrigger { value: "card"; text: "Card" }
                            ChaSetTabsTrigger { value: "ghost"; text: "Ghost" }
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

    // Section 3: Default Open
    Column {
        width: parent.width
        spacing: 8
        Text { text: "Default Open"; font.pixelSize: 18; font.weight: Font.Bold; color: root.cFg }
        Text { text: "Use defaultOpen to initialize the collapsible in an expanded state."; color: root.cMutedFg; font.pixelSize: 13 }

        ChaSetCard {
            width: parent.width
            customRadius: root.customRadius

            Column {
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.margins: 16
                spacing: 8

                ChaSetCollapsible {
                    width: parent.width
                    title: "Advanced System Options"
                    defaultOpen: true

                    Column {
                        width: parent.width
                        spacing: 6
                        topPadding: 8

                        Rectangle {
                            width: parent.width
                            height: 32
                            radius: 4
                            color: ThemeTokens.hover

                            Text {
                                anchors.verticalCenter: parent.verticalCenter
                                anchors.left: parent.left
                                anchors.leftMargin: 8
                                text: "Vulkan Validation Layers: Enabled"
                                color: ThemeTokens.subduedText
                                font.pixelSize: 12
                            }
                        }
                    }
                }
            }
        }
    }

    // Section 4: Disabled State
    Column {
        width: parent.width
        spacing: 8
        Text { text: "Disabled State"; font.pixelSize: 18; font.weight: Font.Bold; color: root.cFg }
        Text { text: "Prevents clicking and interaction with a dimmed appearance."; color: root.cMutedFg; font.pixelSize: 13 }

        ChaSetCard {
            width: parent.width
            customRadius: root.customRadius

            Column {
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.margins: 16
                spacing: 8

                ChaSetCollapsible {
                    width: parent.width
                    title: "Protected Developer Settings"
                    disabled: true
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
        componentId: "collapsible"
    }

    PropsTable {
            width: parent.width
            propsModel: [
                { name: "open", type: "bool", defaultValue: "false", desc: "Whether the collapsible content is currently expanded." },
                { name: "defaultOpen", type: "bool", defaultValue: "false", desc: "Whether the collapsible is initially expanded on load." },
                { name: "disabled", type: "bool", defaultValue: "false", desc: "Whether user interaction and toggling are disabled." },
                { name: "variant", type: "string", defaultValue: "'default'", desc: "Visual container styling variant: 'default' | 'card' | 'ghost'." },
                { name: "title", type: "string", defaultValue: "''", desc: "Title text displayed in the header trigger bar." },
                { name: "customRadius", type: "int", defaultValue: "6", desc: "Corner radius of the header and container." }
            ]
        }
    }
}
