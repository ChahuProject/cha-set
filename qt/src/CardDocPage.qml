// CardDocPage.qml — Documentation and interactive sandbox for ChaSetCard
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Components"
    pageTitle: "Card"
    description: "Displays a card with header, title, description, content, and footer actions."
    tocItems: [
        { id: "overview", title: "Interactive Overview" },
        { id: "installation", title: "Installation" },
        { id: "anatomy", title: "Anatomy" },
        { id: "variants", title: "Variants" },
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

    // Section 1: Overview
    ComponentPreview {
        id: heroPreview
        width: parent.width
        title: "Card Sandbox"
        reactCode: `<Card variant="${root.demoVariant}" className="w-[350px]">\n  <CardHeader>\n    <div className="flex items-center justify-between">\n      <CardTitle>Create project</CardTitle>\n      <Badge variant="secondary">Pro</Badge>\n    </div>\n    <CardDescription>Deploy your new project in one-click.</CardDescription>\n  </CardHeader>\n  <CardContent>\n    <p className="text-sm text-muted-foreground">\n      Your project will be deployed to the edge network automatically.\n    </p>\n  </CardContent>\n  <CardFooter className="flex justify-between">\n    <Button variant="outline" size="sm">Cancel</Button>\n    <Button size="sm">Deploy</Button>\n  </CardFooter>\n</Card>`
        qtCode: `ChaSetCard {\n    width: 350\n    variant: "${root.demoVariant}"\n\n    ChaSetCardHeader {\n        Row {\n            width: parent.width\n            ChaSetCardTitle { text: "Create project" }\n            ChaSetBadge { variant: "secondary"; text: "Pro"; anchors.right: parent.right }\n        }\n        ChaSetCardDescription { text: "Deploy your new project in one-click." }\n    }\n    ChaSetCardContent {\n        Text {\n            text: "Your project will be deployed to the edge network automatically."\n            color: ThemeTokens.subduedText\n            font.pixelSize: 13\n        }\n    }\n    ChaSetCardFooter {\n        ChaSetButton { variant: "outline"; size: "sm"; text: "Cancel" }\n        ChaSetButton { size: "sm"; text: "Deploy" }\n    }\n}`

        stageData: [
            ChaSetCard {
                anchors.centerIn: parent
                width: 340
                variant: root.demoVariant

                ChaSetCardHeader {
                    Row {
                        width: parent.width
                        ChaSetCardTitle {
                            text: "Create project"
                        }
                        ChaSetBadge {
                            variant: "secondary"
                            text: "Pro"
                            anchors.right: parent.right
                        }
                    }
                    ChaSetCardDescription {
                        text: "Deploy your new project in one-click."
                    }
                }

                ChaSetCardContent {
                    Text {
                        text: "Your project will be deployed to the edge network automatically."
                        color: ThemeTokens.subduedText
                        font.pixelSize: 13
                        wrapMode: Text.WordWrap
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
                            ChaSetTabsTrigger { value: "outline"; text: "Outline" }
                        }
                    }
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
            text: "Card is composed of modular building blocks for flexible layouts."
            color: root.cMutedFg
            font.pixelSize: 13
        }

        CodeBlock {
            width: parent.width
            language: "qml"
            code: `ChaSetCard {\n    ChaSetCardHeader {\n        ChaSetCardTitle { text: "Card Title" }\n        ChaSetCardDescription { text: "Card Description" }\n    }\n    ChaSetCardContent {\n        Text { text: "Main content area" }\n    }\n    ChaSetCardFooter {\n        Text { text: "Footer actions" }\n    }\n}`
        }
    }

    // Section 4: Variants
    Column {
        width: parent.width
        spacing: 12

        Text {
            text: "Variants"
            color: root.cFg
            font.pixelSize: 18
            font.weight: Font.Bold
        }

        Text {
            text: "Three semantic variants styled with design tokens for consistent elevation and contrast."
            color: root.cMutedFg
            font.pixelSize: 13
        }

        Row {
            width: parent.width
            spacing: 12

            ChaSetCard {
                width: (parent.width - 24) / 3
                variant: "default"
                ChaSetCardHeader {
                    ChaSetCardTitle { text: "Default Card"; font.pixelSize: 15 }
                    ChaSetCardDescription { text: "Elevated surface with panel background" }
                }
            }

            ChaSetCard {
                width: (parent.width - 24) / 3
                variant: "secondary"
                ChaSetCardHeader {
                    ChaSetCardTitle { text: "Secondary Card"; font.pixelSize: 15 }
                    ChaSetCardDescription { text: "Subtle contrast for grouped items" }
                }
            }

            ChaSetCard {
                width: (parent.width - 24) / 3
                variant: "outline"
                ChaSetCardHeader {
                    ChaSetCardTitle { text: "Outline Card"; font.pixelSize: 15 }
                    ChaSetCardDescription { text: "Transparent background with crisp border" }
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
                {
                    propName: "variant",
                    propType: "\"default\" | \"secondary\" | \"outline\"",
                    propDefault: "\"default\"",
                    propDescription: "Visual presentation style of the card container."
                },
                {
                    propName: "customRadius",
                    propType: "int",
                    propDefault: "-1",
                    propDescription: "Explicit corner radius override in pixels (defaults to ThemeTokens.radius)."
                },
                {
                    propName: "contentData",
                    propType: "list<QtObject>",
                    propDefault: "[]",
                    propDescription: "Card composite subcomponents or custom elements."
                }
            ]
        }
    }
}
