// BadgeDocPage.qml — Documentation and interactive sandbox for ChaSetBadge
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Components"
    pageTitle: "Badge"
    description: "Displays a badge or a component that looks like a badge to highlight status, tags, and counts."
    tocItems: [
        { id: "overview", title: "Interactive Overview" },
        { id: "installation", title: "Installation" },
        { id: "variants", title: "Variants" },
        { id: "sizes", title: "Sizes" },
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

    property string demoVariant: "default"
    property string demoSize: "default"

    // Section 1: Overview
    ComponentPreview {
        id: heroPreview
        width: parent.width
        title: "Badge Sandbox"
        reactCode: `<Badge variant="${root.demoVariant}" size="${root.demoSize}">\n  ${root.demoVariant.charAt(0).toUpperCase() + root.demoVariant.slice(1)} Badge\n</Badge>`
        qtCode: `ChaSetBadge {\n    variant: "${root.demoVariant}"\n    size: "${root.demoSize}"\n    text: "${root.demoVariant.charAt(0).toUpperCase() + root.demoVariant.slice(1)} Badge"\n}`

        stageData: [
            ChaSetBadge {
                anchors.centerIn: parent
                variant: root.demoVariant
                size: root.demoSize
                text: root.demoVariant.charAt(0).toUpperCase() + root.demoVariant.slice(1) + " Badge"
            }
        ]

        controlsData: [
            Row {
                spacing: 16

                Row {
                    spacing: 8
                    Text { text: "Variant:"; color: root.cMutedFg; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
                    ChaSetTabs {
                        anchors.verticalCenter: parent.verticalCenter
                        currentValue: root.demoVariant
                        onCurrentValueChanged: root.demoVariant = currentValue
                        ChaSetTabsList {
                            ChaSetTabsTrigger { value: "default"; text: "Default" }
                            ChaSetTabsTrigger { value: "secondary"; text: "Secondary" }
                            ChaSetTabsTrigger { value: "destructive"; text: "Destructive" }
                            ChaSetTabsTrigger { value: "outline"; text: "Outline" }
                        }
                    }
                }

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

    // Section 3: Variants
    Column {
        width: parent.width
        spacing: 8
        Text { text: "Variants"; font.pixelSize: 18; font.weight: Font.Bold; color: root.cFg }
        Text { text: "Four standard semantic variants aligned with the ChaSet design token system."; color: root.cMutedFg; font.pixelSize: 13 }

        ChaSetCard {
            width: parent.width
            height: 70
            customRadius: root.customRadius

            Item {
                width: parent.width
                height: 70

                Row {
                    anchors.centerIn: parent
                    spacing: 12
                    ChaSetBadge { variant: "default"; text: "Default" }
                    ChaSetBadge { variant: "secondary"; text: "Secondary" }
                    ChaSetBadge { variant: "destructive"; text: "Destructive" }
                    ChaSetBadge { variant: "outline"; text: "Outline" }
                }
            }
        }
    }

    // Section 4: Sizes
    Column {
        width: parent.width
        spacing: 8
        Text { text: "Sizes"; font.pixelSize: 18; font.weight: Font.Bold; color: root.cFg }
        Text { text: "Choose between standard pill height (22px) and compact micro badge (16px)."; color: root.cMutedFg; font.pixelSize: 13 }

        ChaSetCard {
            width: parent.width
            height: 70
            customRadius: root.customRadius

            Item {
                width: parent.width
                height: 70

                Row {
                    anchors.centerIn: parent
                    spacing: 20
                    Row {
                        spacing: 8
                        Text { anchors.verticalCenter: parent.verticalCenter; text: "Default:"; color: root.cMutedFg; font.pixelSize: 12 }
                        ChaSetBadge { size: "default"; text: "Badge Default" }
                    }
                    Row {
                        spacing: 8
                        Text { anchors.verticalCenter: parent.verticalCenter; text: "Small:"; color: root.cMutedFg; font.pixelSize: 12 }
                        ChaSetBadge { size: "sm"; text: "NEW" }
                    }
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
        componentId: "badge"
    }

    PropsTable {
            width: parent.width
            propsModel: [
                { name: "variant", type: "'default' | 'secondary' | 'destructive' | 'outline'", defaultValue: "'default'", desc: "Visual stylistic variant corresponding to core color tokens." },
                { name: "size", type: "'default' | 'sm'", defaultValue: "'default'", desc: "Size variant determining pill height, padding, and font metrics." },
                { name: "text", type: "string", defaultValue: "''", desc: "The label text to display inside the badge." }
            ]
        }
    }
}
