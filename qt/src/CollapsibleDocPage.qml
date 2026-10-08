// CollapsibleDocPage.qml — Documentation and interactive sandbox for ChaSetCollapsible
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Surfaces & Layout"
    pageTitle: "Collapsible"
    description: ChaSetI18n.tr("components.collapsible.description", "An interactive component which expands and collapses a panel of content.")

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
        title: ChaSetI18n.tr("desktopComposite.collapsible.sandboxTitle", "Collapsible Sandbox")
        reactCode: `<Collapsible open={${root.demoOpen}} disabled={${root.demoDisabled}} variant="${root.demoVariant}">\n  <CollapsibleTrigger>Toggle Details</CollapsibleTrigger>\n  <CollapsibleContent>\n    <div>Collapsible content panel</div>\n  </CollapsibleContent>\n</Collapsible>`
        qtCode: `ChaSetCollapsible {\n    width: 280\n    title: "Repository Details"\n    open: ${root.demoOpen}\n    disabled: ${root.demoDisabled}\n    variant: "${root.demoVariant}"\n\n    Column {\n        width: parent.width\n        spacing: 6\n        topPadding: 8\n\n        Rectangle {\n            width: parent.width\n            height: 32\n            radius: 4\n            color: ThemeTokens.hover\n            Text {\n                anchors.centerIn: parent\n                text: "@radix-ui/primitives"\n                color: ThemeTokens.text\n                font.pixelSize: 12\n            }\n        }\n    }\n}`

        stageData: [
            Column {
                anchors.centerIn: parent
                spacing: ThemeTokens.dp(8)
                width: ThemeTokens.dp(280)

                ChaSetCollapsible {
                    width: parent.width
                    title: ChaSetI18n.tr("surfaces.collapsible.starredRepos", "@peduarte starred 3 repositories")
                    open: root.demoOpen
                    disabled: root.demoDisabled
                    variant: root.demoVariant
                    onToggled: function(val) { root.demoOpen = val; }

                    Column {
                        width: parent.width
                        spacing: ThemeTokens.dp(6)
                        topPadding: ThemeTokens.dp(8)

                        Rectangle {
                            width: parent.width
                            height: ThemeTokens.dp(32)
                            radius: ThemeTokens.dp(4)
                            color: ThemeTokens.hover

                            DocText {
                                anchors.centerIn: parent
                                text: "@radix-ui/primitives"
                                color: ThemeTokens.text
                                font.pixelSize: Typography.sizeSmall
                            }
                        }

                        Rectangle {
                            width: parent.width
                            height: ThemeTokens.dp(32)
                            radius: ThemeTokens.dp(4)
                            color: ThemeTokens.hover

                            DocText {
                                anchors.centerIn: parent
                                text: "@stitches/react"
                                color: ThemeTokens.text
                                font.pixelSize: Typography.sizeSmall
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
                    DocText { text: ChaSetI18n.tr("surfaces.collapsible.state", "State:"); color: root.cMutedFg; font.pixelSize: Typography.sizeSmall; anchors.verticalCenter: parent.verticalCenter }
                    ChaSetSegmentedControl {
                        anchors.verticalCenter: parent.verticalCenter
                        size: "sm"
                        value: root.demoOpen ? "true" : "false"
                        options: [
                            { label: ChaSetI18n.tr("surfaces.collapsible.collapsed", "Collapsed"), value: "false" },
                            { label: ChaSetI18n.tr("surfaces.collapsible.expanded", "Expanded"), value: "true" }
                        ]
                        onValueSelected: function(v) { root.demoOpen = (String(v) === "true"); }
                    }
                }

                Row {
                    spacing: 8
                    DocText { text: ChaSetI18n.tr("showcase.variant", "Variant:"); color: root.cMutedFg; font.pixelSize: Typography.sizeSmall; anchors.verticalCenter: parent.verticalCenter }
                    ChaSetSegmentedControl {
                        anchors.verticalCenter: parent.verticalCenter
                        size: "sm"
                        value: root.demoVariant
                        options: [
                            { label: ChaSetI18n.tr("common.default", "Default"), value: "default" },
                            { label: ChaSetI18n.tr("surfaces.collapsible.card", "Card"), value: "card" },
                            { label: ChaSetI18n.tr("common.ghost", "Ghost"), value: "ghost" }
                        ]
                        onValueSelected: function(v) { root.demoVariant = String(v); }
                    }
                }

                Row {
                    spacing: 8
                    DocText { text: ChaSetI18n.tr("common.disabled", "Disabled:"); color: root.cMutedFg; font.pixelSize: Typography.sizeSmall; anchors.verticalCenter: parent.verticalCenter }
                    ChaSetSegmentedControl {
                        anchors.verticalCenter: parent.verticalCenter
                        size: "sm"
                        value: root.demoDisabled ? "true" : "false"
                        options: [
                            { label: ChaSetI18n.tr("desktopComposite.collapsible.falseLabel", "False"), value: "false" },
                            { label: ChaSetI18n.tr("desktopComposite.collapsible.trueLabel", "True"), value: "true" }
                        ]
                        onValueSelected: function(v) { root.demoDisabled = (String(v) === "true"); }
                    }
                }
            }
        ]
    }

    // Section 2: Anatomy
    DocAnatomy {
        sectionId: "anatomy"
        reactCode: `import { Collapsible, CollapsibleTrigger, CollapsibleContent, Button } from '@chahu/cha-set';

<Collapsible>
  <CollapsibleTrigger asChild>
    <Button variant="ghost">Toggle Details</Button>
  </CollapsibleTrigger>
  <CollapsibleContent>
    <div className="p-3 bg-muted rounded">Collapsible content panel</div>
  </CollapsibleContent>
</Collapsible>`
        qtCode: `import ChaSet

ChaSetCollapsible {
    width: 280
    title: "Toggle Details"
    open: false
}`
    }

    // Section 3: Default Open
    Column {
        property string sectionId: "default-open"
        width: parent.width
        spacing: 8
        DocText { text: ChaSetI18n.tr("desktopComposite.collapsible.defaultOpenHeading", "Default Open"); font.pixelSize: Typography.sizeTitleSm; font.weight: Typography.weightBold; color: root.cFg }
        DocText { text: ChaSetI18n.tr("desktopComposite.collapsible.defaultOpenDescQt", "Use defaultOpen to initialize the collapsible in an expanded state."); color: root.cMutedFg; font.pixelSize: Typography.sizeBody }

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
                    title: ChaSetI18n.tr("desktopComposite.collapsible.advancedOptionsQt", "Advanced System Options")
                    defaultOpen: true

                    Column {
                        width: parent.width
                        spacing: ThemeTokens.dp(6)
                        topPadding: ThemeTokens.dp(8)

                        Rectangle {
                            width: parent.width
                            height: ThemeTokens.dp(32)
                            radius: ThemeTokens.dp(4)
                            color: ThemeTokens.hover

                            DocText {
                                anchors.verticalCenter: parent.verticalCenter
                                anchors.left: parent.left
                                anchors.leftMargin: ThemeTokens.dp(8)
                                text: ChaSetI18n.tr("desktopComposite.collapsible.vulkanBadge", "Vulkan Validation Layers: Enabled")
                                color: ThemeTokens.subduedText
                                font.pixelSize: Typography.sizeSmall
                            }
                        }
                    }
                }
            }
        }
    }

    // Section 4: Disabled State
    Column {
        property string sectionId: "disabled"
        width: parent.width
        spacing: 8
        DocText { text: ChaSetI18n.tr("desktopComposite.collapsible.disabledHeading", "Disabled State"); font.pixelSize: Typography.sizeTitleSm; font.weight: Typography.weightBold; color: root.cFg }
        DocText { text: ChaSetI18n.tr("desktopComposite.collapsible.disabledDescQt", "Prevents clicking and interaction with a dimmed appearance."); color: root.cMutedFg; font.pixelSize: Typography.sizeBody }

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
                    title: ChaSetI18n.tr("desktopComposite.collapsible.protectedSettings", "Protected Developer Settings")
                    disabled: true
                }
            }
        }
    }

    // Section 5: Props Reference
    ComponentReference {
        name: "Collapsible"
        componentId: "collapsible"
        props: [
            { name: "open", type: "bool", defaultValue: "false", description: ChaSetI18n.tr("components.collapsible.openDescQt", "Whether the collapsible content is currently expanded.") },
            { name: "defaultOpen", type: "bool", defaultValue: "false", description: ChaSetI18n.tr("components.collapsible.defaultOpenDescQt", "Whether the collapsible is initially expanded on load.") },
            { name: "disabled", type: "bool", defaultValue: "false", description: ChaSetI18n.tr("components.collapsible.disabledDescQt", "Whether user interaction and toggling are disabled.") },
            { name: "variant", type: "string", defaultValue: "'default'", description: ChaSetI18n.tr("components.collapsible.variantDescQt", "Visual container styling variant: 'default' | 'card' | 'ghost'.") },
            { name: "title", type: "string", defaultValue: "''", description: ChaSetI18n.tr("components.collapsible.titleDesc", "Title text displayed in the header trigger bar.") },
            { name: "customRadius", type: "int", defaultValue: "6", description: ChaSetI18n.tr("components.collapsible.customRadiusDesc", "Corner radius of the header and container.") }
        ]
    }
}
