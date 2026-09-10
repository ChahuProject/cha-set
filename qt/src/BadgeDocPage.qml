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
        { id: "status-and-tags", title: "Status & Removable" },
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
    property bool demoDot: false
    property bool demoRemovable: false
    property bool demoRemoved: false

    // Section 1: Overview
    ComponentPreview {
        id: heroPreview
        width: parent.width
        title: "Badge Sandbox"
        reactCode: `<Badge
  variant="${root.demoVariant}"
  size="${root.demoSize}"${root.demoDot ? '\n  dot' : ''}${root.demoRemovable ? '\n  removable\n  onRemove={() => console.log("removed")}' : ''}
>
  ${root.demoVariant.charAt(0).toUpperCase() + root.demoVariant.slice(1)} Badge
</Badge>`
        qtCode: `ChaSetBadge {
    variant: "${root.demoVariant}"
    size: "${root.demoSize}"
    text: "${root.demoVariant.charAt(0).toUpperCase() + root.demoVariant.slice(1)} Badge"${root.demoDot ? '\n    dot: true' : ''}${root.demoRemovable ? '\n    removable: true\n    onRemoved: console.log("removed")' : ''}
}`

        stageData: [
            Item {
                anchors.centerIn: parent
                width: badgeItem.width
                height: badgeItem.height

                ChaSetBadge {
                    id: badgeItem
                    anchors.centerIn: parent
                    visible: !root.demoRemoved
                    variant: root.demoVariant
                    size: root.demoSize
                    dot: root.demoDot
                    removable: root.demoRemovable
                    text: root.demoVariant.charAt(0).toUpperCase() + root.demoVariant.slice(1) + " Badge"
                    onRemoved: root.demoRemoved = true
                }

                ChaSetButton {
                    anchors.centerIn: parent
                    visible: root.demoRemoved
                    variant: "ghost"
                    size: "sm"
                    text: "Reset Removed Badge"
                    onClicked: root.demoRemoved = false
                }
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
                            ChaSetTabsTrigger { value: "ghost"; text: "Ghost" }
                            ChaSetTabsTrigger { value: "link"; text: "Link" }
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

                ChaSetCheckbox {
                    size: "sm"
                    label: "Status Dot"
                    checked: root.demoDot
                    onToggled: (v) => root.demoDot = v
                }

                ChaSetCheckbox {
                    size: "sm"
                    label: "Removable"
                    checked: root.demoRemovable
                    onToggled: (v) => {
                        root.demoRemovable = v
                        root.demoRemoved = false
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
        Text { text: "All six standard semantic variants aligned with the ChaSet design token system."; color: root.cMutedFg; font.pixelSize: 13 }

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
                    ChaSetBadge { variant: "ghost"; text: "Ghost" }
                    ChaSetBadge { variant: "link"; text: "Link" }
                }
            }
        }
    }

    // Section 4: Sizes
    Column {
        width: parent.width
        spacing: 8
        Text { text: "Sizes"; font.pixelSize: 18; font.weight: Font.Bold; color: root.cFg }
        Text { text: "Choose between standard pill scale (default) and compact micro badge (sm)."; color: root.cMutedFg; font.pixelSize: 13 }

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

    // Section 5: Status & Removable Badges
    Column {
        width: parent.width
        spacing: 8
        Text { text: "Status & Removable Tags"; font.pixelSize: 18; font.weight: Font.Bold; color: root.cFg }
        Text { text: "Badges support live status indicator dots and dismissible action buttons for filter tags."; color: root.cMutedFg; font.pixelSize: 13 }

        ChaSetCard {
            width: parent.width
            height: 70
            customRadius: root.customRadius

            Item {
                width: parent.width
                height: 70

                Row {
                    anchors.centerIn: parent
                    spacing: 16
                    ChaSetBadge { dot: true; dotColor: "#10b981"; variant: "outline"; text: "Online" }
                    ChaSetBadge { dot: true; dotColor: "#f59e0b"; variant: "outline"; text: "Away" }
                    ChaSetBadge { dot: true; dotColor: "#ef4444"; variant: "destructive"; text: "Error" }
                    ChaSetBadge { removable: true; text: "React Tag"; onRemoved: console.log("Removed React Tag") }
                    ChaSetBadge { removable: true; variant: "secondary"; text: "Qt Quick"; onRemoved: console.log("Removed Qt Quick") }
                }
            }
        }
    }

    // Section 6: Props Reference
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
                { name: "variant", type: "'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'", defaultValue: "'default'", desc: "Visual stylistic variant corresponding to core color tokens." },
                { name: "size", type: "'default' | 'sm'", defaultValue: "'default'", desc: "Size variant determining pill height, padding, and font metrics scale." },
                { name: "dot", type: "bool", defaultValue: "false", desc: "Whether to display a leading status indicator dot." },
                { name: "dotColor", type: "color", defaultValue: "accent", desc: "Custom color for the status indicator dot." },
                { name: "removable", type: "bool", defaultValue: "false", desc: "Whether to display an inline dismiss/remove action button." },
                { name: "interactive", type: "bool", defaultValue: "false", desc: "Whether the badge responds with interactive cursor and click effects." },
                { name: "iconSource", type: "string", defaultValue: "''", desc: "Optional leading icon image source URL." },
                { name: "text", type: "string", defaultValue: "''", desc: "The label text to display inside the badge." }
            ]
        }
    }
}
