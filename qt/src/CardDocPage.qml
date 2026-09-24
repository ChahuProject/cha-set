// CardDocPage.qml — Documentation and interactive sandbox for ChaSetCard
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Surfaces & Layout"
    pageTitle: "Card"
    description: "Displays a card with header, title, description, content, and footer actions."
    tocItems: [
        { id: "overview", title: "Interactive Overview" },
        { id: "installation", title: "Installation" },
        { id: "anatomy", title: "Anatomy" },
        { id: "variants", title: "Variants" },
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
    property bool demoInteractive: false

    // Section 1: Overview
    ComponentPreview {
        id: heroPreview
        width: parent.width
        title: "Card Sandbox"
        reactCode: `<Card variant="${root.demoVariant}" size="${root.demoSize}"${root.demoInteractive ? ' interactive' : ''} className="w-full max-w-sm">\n  <CardHeader>\n    <div className="flex items-center justify-between">\n      <CardTitle>Create project</CardTitle>\n      <Badge variant="secondary">Pro</Badge>\n    </div>\n    <CardDescription>Deploy your new project in one-click.</CardDescription>\n  </CardHeader>\n  <CardContent>\n    <p className="text-sm text-muted-foreground">\n      Your project will be deployed to the edge network automatically.\n    </p>\n  </CardContent>\n  <CardFooter className="flex justify-between">\n    <Button variant="outline" size="sm">Cancel</Button>\n    <Button size="sm">Deploy</Button>\n  </CardFooter>\n</Card>`
        qtCode: `ChaSetCard {\n    width: 340\n    variant: "${root.demoVariant}"\n    size: "${root.demoSize}"\n    interactive: ${root.demoInteractive}\n\n    ChaSetCardHeader {\n        Item {\n            width: parent.width\n            implicitHeight: Math.max(cardTitle.implicitHeight, badge.implicitHeight)\n            ChaSetCardTitle { id: cardTitle; text: "Create project"; anchors.left: parent.left; anchors.verticalCenter: parent.verticalCenter }\n            ChaSetBadge { id: badge; variant: "secondary"; text: "Pro"; anchors.right: parent.right; anchors.verticalCenter: parent.verticalCenter }\n        }\n        ChaSetCardDescription { text: "Deploy your new project in one-click." }\n    }\n    ChaSetCardContent {\n        Text {\n            text: "Your project will be deployed to the edge network automatically."\n            color: ThemeTokens.subduedText\n            font.pixelSize: 13\n        }\n    }\n    ChaSetCardFooter {\n        ChaSetButton { variant: "outline"; size: "sm"; text: "Cancel" }\n        ChaSetButton { size: "sm"; text: "Deploy" }\n    }\n}`

        stageData: [
            ChaSetCard {
                anchors.centerIn: parent
                width: ThemeTokens.dp(340)
                variant: root.demoVariant
                size: root.demoSize
                interactive: root.demoInteractive

                ChaSetCardHeader {
                    Item {
                        width: parent.width
                        implicitHeight: Math.max(heroCardTitle.implicitHeight, heroBadge.implicitHeight)
                        ChaSetCardTitle {
                            id: heroCardTitle
                            anchors.left: parent.left
                            anchors.verticalCenter: parent.verticalCenter
                            text: "Create project"
                        }
                        ChaSetBadge {
                            id: heroBadge
                            anchors.right: parent.right
                            anchors.verticalCenter: parent.verticalCenter
                            variant: "secondary"
                            text: "Pro"
                        }
                    }
                    ChaSetCardDescription {
                        text: "Deploy your new project in one-click."
                    }
                }

                ChaSetCardContent {
                    DocText {
                        text: "Your project will be deployed to the edge network automatically."
                        color: ThemeTokens.subduedText
                        font.pixelSize: Typography.sizeBody
                        wrapMode: TextEdit.WordWrap
                        width: parent.width
                    }
                }

                ChaSetCardFooter {
                    ChaSetButton {
                        variant: "outline"
                        size: "sm"
                        text: "Cancel"
                    }
                    ChaSetButton {
                        size: "sm"
                        text: "Deploy"
                    }
                }
            }
        ]

        controlsData: [
            Row {
                spacing: ThemeTokens.dp(16)

                Row {
                    spacing: ThemeTokens.dp(8)
                    DocText { text: "Variant:"; color: root.cMutedFg; font.pixelSize: Typography.sizeSmall; anchors.verticalCenter: parent.verticalCenter }
                    ChaSetTabs {
                        anchors.verticalCenter: parent.verticalCenter
                        currentValue: root.demoVariant
                        onCurrentValueChanged: root.demoVariant = currentValue
                        ChaSetTabsList {
                            ChaSetTabsTrigger { value: "default"; text: "Default" }
                            ChaSetTabsTrigger { value: "secondary"; text: "Secondary" }
                            ChaSetTabsTrigger { value: "outline"; text: "Outline" }
                        }
                    }
                }

                Row {
                    spacing: 8
                    DocText { text: "Size:"; color: root.cMutedFg; font.pixelSize: Typography.sizeSmall; anchors.verticalCenter: parent.verticalCenter }
                    ChaSetTabs {
                        anchors.verticalCenter: parent.verticalCenter
                        currentValue: root.demoSize
                        onCurrentValueChanged: root.demoSize = currentValue
                        ChaSetTabsList {
                            ChaSetTabsTrigger { value: "default"; text: "Default" }
                            ChaSetTabsTrigger { value: "sm"; text: "Compact (sm)" }
                        }
                    }
                }

                ChaSetCheckbox {
                    anchors.verticalCenter: parent.verticalCenter
                    label: "Interactive"
                    checked: root.demoInteractive
                    onToggled: (val) => root.demoInteractive = val
                }
            }
        ]
    }

    // Section 2: Installation
    Column {
        width: parent.width
        spacing: 12

        DocText {
            text: "Installation"
            color: root.cFg
            font.pixelSize: Typography.sizeTitleSm
            font.weight: Typography.weightBold
        }

        ChaSetCodeBlock {
            width: parent.width
            language: "bash"
            code: "pnpm add @chahu/cha-set"
        }
    }

    // Section 3: Anatomy
    DocAnatomy {
        width: parent.width
        qtCode: `import ChaSet\n\nChaSetCard {\n    variant: "default"\n    ChaSetCardHeader {\n        ChaSetCardTitle { text: "Card Title" }\n        ChaSetCardDescription { text: "Card Description" }\n    }\n    ChaSetCardContent {\n        ChaSetLabel { text: "Main content area" }\n    }\n    ChaSetCardFooter {\n        ChaSetButton { size: "sm"; text: "Footer action" }\n    }\n}`
        reactCode: `import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@chahu/cha-set';\n\n<Card>\n  <CardHeader>\n    <CardTitle>Card Title</CardTitle>\n    <CardDescription>Card Description</CardDescription>\n  </CardHeader>\n  <CardContent>Main content area</CardContent>\n  <CardFooter>Footer actions</CardFooter>\n</Card>`
    }

    // Section 4: Variants
    Column {
        width: parent.width
        spacing: 12

        DocText {
            text: "Variants"
            color: root.cFg
            font.pixelSize: Typography.sizeTitleSm
            font.weight: Typography.weightBold
        }

        DocText {
            text: "Three semantic variants styled with design tokens for consistent elevation and contrast."
            color: root.cMutedFg
            font.pixelSize: Typography.sizeBody
        }

        Row {
            width: parent.width
            spacing: 12

            ChaSetCard {
                width: (parent.width - 24) / 3
                variant: "default"
                ChaSetCardHeader {
                    ChaSetCardTitle { text: "Default Card"; font.pixelSize: Typography.sizeHeading }
                    ChaSetCardDescription { text: "Elevated surface with panel background" }
                }
            }

            ChaSetCard {
                width: (parent.width - 24) / 3
                variant: "secondary"
                ChaSetCardHeader {
                    ChaSetCardTitle { text: "Secondary Card"; font.pixelSize: Typography.sizeHeading }
                    ChaSetCardDescription { text: "Subtle contrast for grouped items" }
                }
            }

            ChaSetCard {
                width: (parent.width - 24) / 3
                variant: "outline"
                ChaSetCardHeader {
                    ChaSetCardTitle { text: "Outline Card"; font.pixelSize: Typography.sizeHeading }
                    ChaSetCardDescription { text: "Transparent background with crisp border" }
                }
            }
        }

        DocText {
            text: "Interactive Feedback & Density"
            color: root.cFg
            font.pixelSize: Typography.sizeHeading
            font.weight: Typography.weightSemibold
        }

        DocText {
            text: "Enable interactive hover/press elevation feedback, or use compact density for constrained spaces."
            color: root.cMutedFg
            font.pixelSize: Typography.sizeBody
        }

        Row {
            width: parent.width
            spacing: 12

            ChaSetCard {
                width: (parent.width - 12) / 2
                interactive: true
                ChaSetCardHeader {
                    ChaSetCardTitle { text: "Interactive Card"; font.pixelSize: Typography.sizeHeading }
                    ChaSetCardDescription { text: "Hover over me to see cursor and elevation changes" }
                }
                ChaSetCardContent {
                    DocText {
                        text: "Clickable surface for dashboards and selectable items."
                        color: ThemeTokens.subduedText
                        font.pixelSize: Typography.sizeSmall
                    }
                }
            }

            ChaSetCard {
                width: (parent.width - 12) / 2
                size: "sm"
                ChaSetCardHeader {
                    ChaSetCardTitle { text: "Compact Card (sm)"; font.pixelSize: Typography.sizeHeading }
                    ChaSetCardDescription { text: "Reduced padding for tight sidebars and sheets" }
                }
                ChaSetCardContent {
                    DocText {
                        text: "Streamlined layout with denser inner padding."
                        color: ThemeTokens.subduedText
                        font.pixelSize: Typography.sizeSmall
                    }
                }
            }
        }
    }

    // Section 5: Props Reference
    Column {
        width: parent.width
        spacing: 12

        DocText {
            text: "Props Reference"
            color: root.cFg
            font.pixelSize: Typography.sizeTitleSm
            font.weight: Typography.weightBold
        }

        KeyboardShortcutsTable {
            componentId: "card"
        }

        PropsTable {
            width: parent.width
            propsModel: [
                {
                    name: "variant",
                    type: "\"default\" | \"secondary\" | \"outline\"",
                    defaultValue: "\"default\"",
                    description: "Visual presentation style of the card container."
                },
                {
                    name: "size",
                    type: "\"default\" | \"sm\"",
                    defaultValue: "\"default\"",
                    description: "Density and spacing scale of the card."
                },
                {
                    name: "interactive",
                    type: "bool",
                    defaultValue: "false",
                    description: "Whether the card exhibits hover and press feedback with click interaction."
                },
                {
                    name: "customRadius",
                    type: "int",
                    defaultValue: "-1",
                    description: "Explicit corner radius override (defaults to ThemeTokens.radius)."
                },
                {
                    name: "contentData",
                    type: "list<QtObject>",
                    defaultValue: "[]",
                    description: "Card composite subcomponents or custom elements."
                }
            ]
        }
    }
}
