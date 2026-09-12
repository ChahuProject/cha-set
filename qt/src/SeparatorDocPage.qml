// SeparatorDocPage.qml — Documentation and interactive sandbox for ChaSetSeparator
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Components"
    pageTitle: "Separator"
    description: "Visually or semantically separates content in a list or section."
    tocItems: [
        { id: "overview", title: "Interactive Overview" },
        { id: "installation", title: "Installation" },
        { id: "anatomy", title: "Anatomy" },
        { id: "states", title: "Examples & States" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "Props Reference" }
    ]

    property int customRadius: 8
    property color cFg: ThemeTokens.text
    property color cMutedFg: ThemeTokens.subduedText
    property color cCard: ThemeTokens.panel
    property color cBorder: ThemeTokens.border

    property string demoOrientation: "horizontal"
    property string demoVariant: "solid"
    property bool demoHasLabel: false
    property string demoLabelPosition: "center"

    // Section 1: Overview
    ComponentPreview {
        id: heroPreview
        width: parent.width
        title: "Separator Sandbox"
        reactCode: root.demoOrientation === "horizontal"
            ? (root.demoHasLabel
                ? `<div className="w-full max-w-sm space-y-4">\n  <Button className="w-full" size="sm">Sign in with SSO</Button>\n  <Separator orientation="horizontal" variant="${root.demoVariant}" label="Continue with" labelPosition="${root.demoLabelPosition}" />\n  <Button variant="outline" className="w-full" size="sm">Sign in with Email</Button>\n</div>`
                : `<div className="w-full max-w-sm space-y-4">\n  <div>\n    <h4 className="text-sm font-medium leading-none">ChaSet UI</h4>\n    <p className="text-sm text-muted-foreground">Cross-stack React & Qt Quick Design System.</p>\n  </div>\n  <Separator orientation="horizontal" variant="${root.demoVariant}" />\n  <div className="flex h-5 items-center space-x-4 text-sm">\n    <div>Docs</div>\n    <Separator orientation="vertical" variant="${root.demoVariant}" />\n    <div>Source</div>\n    <Separator orientation="vertical" variant="${root.demoVariant}" />\n    <div>Changelog</div>\n  </div>\n</div>`)
            : `<div className="flex h-8 items-center space-x-4 text-sm">\n  <span>Components</span>\n  <Separator orientation="vertical" variant="${root.demoVariant}" />\n  <span>Tokens</span>\n  <Separator orientation="vertical" variant="${root.demoVariant}" />\n  <span>Showcase</span>\n</div>`
        qtCode: root.demoOrientation === "horizontal"
            ? (root.demoHasLabel
                ? `Column {\n    width: 280\n    spacing: 12\n    ChaSetButton { text: "Sign in with SSO"; size: "sm"; width: parent.width }\n    ChaSetSeparator {\n        orientation: "horizontal"\n        variant: "${root.demoVariant}"\n        label: "Continue with"\n        labelPosition: "${root.demoLabelPosition}"\n        width: parent.width\n    }\n    ChaSetButton { variant: "outline"; text: "Sign in with Email"; size: "sm"; width: parent.width }\n}`
                : `Column {\n    width: 280\n    spacing: 12\n    Column {\n        spacing: 4\n        Text { text: "ChaSet UI"; font.bold: true; color: ThemeTokens.text }\n        Text { text: "Cross-stack React & Qt Quick Design System."; color: ThemeTokens.subduedText; font.pixelSize: 12 }\n    }\n    ChaSetSeparator { orientation: "horizontal"; variant: "${root.demoVariant}" }\n    Row {\n        spacing: 12\n        Text { text: "Docs"; color: ThemeTokens.text; font.pixelSize: 12 }\n        ChaSetSeparator { orientation: "vertical"; variant: "${root.demoVariant}"; height: 16 }\n        Text { text: "Source"; color: ThemeTokens.text; font.pixelSize: 12 }\n        ChaSetSeparator { orientation: "vertical"; variant: "${root.demoVariant}"; height: 16 }\n        Text { text: "Changelog"; color: ThemeTokens.text; font.pixelSize: 12 }\n    }\n}`)
            : `Row {\n    spacing: 12\n    Text { text: "Components"; color: ThemeTokens.text; font.pixelSize: 13 }\n    ChaSetSeparator { orientation: "vertical"; variant: "${root.demoVariant}"; height: 20 }\n    Text { text: "Tokens"; color: ThemeTokens.text; font.pixelSize: 13 }\n    ChaSetSeparator { orientation: "vertical"; variant: "${root.demoVariant}"; height: 20 }\n    Text { text: "Showcase"; color: ThemeTokens.text; font.pixelSize: 13 }\n}`

        stageData: [
            Item {
                anchors.centerIn: parent
                width: root.demoOrientation === "horizontal" ? 300 : 260
                height: root.demoOrientation === "horizontal" ? (root.demoHasLabel ? 120 : 110) : 40

                Column {
                    visible: root.demoOrientation === "horizontal" && root.demoHasLabel
                    anchors.fill: parent
                    spacing: 12

                    ChaSetButton {
                        text: "Sign in with SSO"
                        size: "sm"
                        width: parent.width
                    }

                    ChaSetSeparator {
                        orientation: "horizontal"
                        variant: root.demoVariant
                        label: "Continue with"
                        labelPosition: root.demoLabelPosition
                        width: parent.width
                    }

                    ChaSetButton {
                        text: "Sign in with Email"
                        variant: "outline"
                        size: "sm"
                        width: parent.width
                    }
                }

                Column {
                    visible: root.demoOrientation === "horizontal" && !root.demoHasLabel
                    anchors.fill: parent
                    spacing: 12

                    Column {
                        spacing: 4
                        Text {
                            text: "ChaSet UI"
                            font.bold: true
                            font.pixelSize: 14
                            color: root.cFg
                        }
                        Text {
                            text: "Cross-stack React & Qt Quick Design System."
                            color: root.cMutedFg
                            font.pixelSize: 12
                        }
                    }

                    ChaSetSeparator {
                        orientation: "horizontal"
                        variant: root.demoVariant
                        width: parent.width
                    }

                    Row {
                        spacing: 12
                        Text { text: "Docs"; color: root.cMutedFg; font.pixelSize: 12 }
                        ChaSetSeparator { orientation: "vertical"; variant: root.demoVariant; height: 14 }
                        Text { text: "Source"; color: root.cMutedFg; font.pixelSize: 12 }
                        ChaSetSeparator { orientation: "vertical"; variant: root.demoVariant; height: 14 }
                        Text { text: "Changelog"; color: root.cMutedFg; font.pixelSize: 12 }
                    }
                }

                Row {
                    visible: root.demoOrientation === "vertical"
                    anchors.centerIn: parent
                    spacing: 12

                    Text { text: "Components"; color: root.cFg; font.pixelSize: 13; anchors.verticalCenter: parent.verticalCenter }
                    ChaSetSeparator { orientation: "vertical"; variant: root.demoVariant; height: 18; anchors.verticalCenter: parent.verticalCenter }
                    Text { text: "Tokens"; color: root.cFg; font.pixelSize: 13; anchors.verticalCenter: parent.verticalCenter }
                    ChaSetSeparator { orientation: "vertical"; variant: root.demoVariant; height: 18; anchors.verticalCenter: parent.verticalCenter }
                    Text { text: "Showcase"; color: root.cFg; font.pixelSize: 13; anchors.verticalCenter: parent.verticalCenter }
                }
            }
        ]

        controlsData: [
            Row {
                spacing: 16

                Row {
                    spacing: 8
                    Text { text: "Orientation:"; color: root.cMutedFg; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
                    ChaSetTabs {
                        anchors.verticalCenter: parent.verticalCenter
                        currentValue: root.demoOrientation
                        onCurrentValueChanged: root.demoOrientation = currentValue
                        ChaSetTabsList {
                            ChaSetTabsTrigger { value: "horizontal"; text: "Horizontal" }
                            ChaSetTabsTrigger { value: "vertical"; text: "Vertical" }
                        }
                    }
                }

                Row {
                    spacing: 8
                    Text { text: "Style:"; color: root.cMutedFg; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
                    ChaSetTabs {
                        anchors.verticalCenter: parent.verticalCenter
                        currentValue: root.demoVariant
                        onCurrentValueChanged: root.demoVariant = currentValue
                        ChaSetTabsList {
                            ChaSetTabsTrigger { value: "solid"; text: "Solid" }
                            ChaSetTabsTrigger { value: "dashed"; text: "Dashed" }
                            ChaSetTabsTrigger { value: "dotted"; text: "Dotted" }
                        }
                    }
                }

                ChaSetCheckbox {
                    visible: root.demoOrientation === "horizontal"
                    size: "sm"
                    label: "Label"
                    checked: root.demoHasLabel
                    onToggled: (val) => root.demoHasLabel = val
                    anchors.verticalCenter: parent.verticalCenter
                }

                Row {
                    visible: root.demoOrientation === "horizontal" && root.demoHasLabel
                    spacing: 8
                    Text { text: "Position:"; color: root.cMutedFg; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
                    ChaSetTabs {
                        anchors.verticalCenter: parent.verticalCenter
                        currentValue: root.demoLabelPosition
                        onCurrentValueChanged: root.demoLabelPosition = currentValue
                        ChaSetTabsList {
                            ChaSetTabsTrigger { value: "left"; text: "Left" }
                            ChaSetTabsTrigger { value: "center"; text: "Center" }
                            ChaSetTabsTrigger { value: "right"; text: "Right" }
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
        ChaSetCodeBlock {
            width: parent.width
            language: "bash"
            code: "pnpm add @chahu/cha-set"
        }
    }

    // Section 3: Anatomy
    Column {
        width: parent.width
        spacing: 8
        Text { text: "Anatomy"; font.pixelSize: 18; font.weight: Font.Bold; color: root.cFg }
        Text { text: "Import and place ChaSetSeparator horizontally or vertically to segment content."; color: root.cMutedFg; font.pixelSize: 13 }

        ChaSetCodeBlock {
            width: parent.width
            language: "qml"
            code: "ChaSetSeparator {\n    orientation: \"horizontal\"\n    width: parent.width\n}"
        }
    }

    // Section 4: Examples & States
    Column {
        width: parent.width
        spacing: 12
        Text { text: "Examples & States"; font.pixelSize: 18; font.weight: Font.Bold; color: root.cFg }
        Text { text: "Common layout patterns using horizontal and vertical separators."; color: root.cMutedFg; font.pixelSize: 13 }

        Grid {
            width: parent.width
            columns: 2
            spacing: 16

            // Example 1: Horizontal Card Content Separation
            ChaSetCard {
                width: (parent.width - 16) / 2
                customRadius: root.customRadius

                ChaSetCardHeader {
                    ChaSetCardTitle { text: "Account Overview" }
                    ChaSetCardDescription { text: "Manage your workspace settings and profile." }
                }

                ChaSetSeparator {
                    orientation: "horizontal"
                    width: parent.width
                }

                ChaSetCardContent {
                    Column {
                        width: parent.width
                        spacing: 8

                        Item {
                            width: parent.width
                            implicitHeight: Math.max(tStatusLbl.implicitHeight, tStatusVal.implicitHeight)
                            Text { id: tStatusLbl; text: "Status"; color: root.cMutedFg; font.pixelSize: 13; anchors.left: parent.left; anchors.verticalCenter: parent.verticalCenter }
                            Text { id: tStatusVal; text: "Active"; color: root.cFg; font.weight: Font.DemiBold; font.pixelSize: 13; anchors.right: parent.right; anchors.verticalCenter: parent.verticalCenter }
                        }

                        Item {
                            width: parent.width
                            implicitHeight: Math.max(tPlanLbl.implicitHeight, tPlanVal.implicitHeight)
                            Text { id: tPlanLbl; text: "Plan"; color: root.cMutedFg; font.pixelSize: 13; anchors.left: parent.left; anchors.verticalCenter: parent.verticalCenter }
                            Text { id: tPlanVal; text: "Enterprise"; color: root.cFg; font.weight: Font.DemiBold; font.pixelSize: 13; anchors.right: parent.right; anchors.verticalCenter: parent.verticalCenter }
                        }
                    }
                }

                ChaSetSeparator {
                    orientation: "horizontal"
                    width: parent.width
                }

                ChaSetCardFooter {
                    Item {
                        width: parent.width
                        implicitHeight: manageBtn.implicitHeight
                        ChaSetButton {
                            id: manageBtn
                            size: "sm"
                            text: "Manage"
                            anchors.right: parent.right
                            anchors.verticalCenter: parent.verticalCenter
                        }
                    }
                }
            }

            // Example 3: Labeled Dividers
            ChaSetCard {
                width: (parent.width - 16) / 2
                height: 180
                customRadius: root.customRadius

                Item {
                    width: parent.width
                    height: 180

                    Column {
                        anchors.fill: parent
                        anchors.margins: 16
                        spacing: 12

                        Text {
                            text: "Labeled Dividers"
                            font.pixelSize: 15
                            font.weight: Font.Bold
                            color: root.cFg
                        }

                        Text {
                            text: "Embed section titles or auth splits with left, center, or right alignment."
                            font.pixelSize: 13
                            color: root.cMutedFg
                            wrapMode: Text.WordWrap
                            width: parent.width
                        }

                        Column {
                            width: parent.width
                            spacing: 10

                            ChaSetSeparator {
                                label: "Section Start"
                                labelPosition: "left"
                                width: parent.width
                            }
                            ChaSetSeparator {
                                label: "OR CONTINUE WITH"
                                labelPosition: "center"
                                width: parent.width
                            }
                            ChaSetSeparator {
                                label: "End of Category"
                                labelPosition: "right"
                                width: parent.width
                            }
                        }
                    }
                }
            }

            // Example 4: Border Styles (Solid, Dashed, Dotted)
            ChaSetCard {
                width: (parent.width - 16) / 2
                height: 180
                customRadius: root.customRadius

                Item {
                    width: parent.width
                    height: 180

                    Column {
                        anchors.fill: parent
                        anchors.margins: 16
                        spacing: 12

                        Text {
                            text: "Border Styles"
                            font.pixelSize: 15
                            font.weight: Font.Bold
                            color: root.cFg
                        }

                        Text {
                            text: "Choose between solid, dashed, or dotted dividers to distinguish hierarchy."
                            font.pixelSize: 13
                            color: root.cMutedFg
                            wrapMode: Text.WordWrap
                            width: parent.width
                        }

                        Column {
                            width: parent.width
                            spacing: 8

                            Text { text: "Solid (Default)"; color: root.cMutedFg; font.pixelSize: 11 }
                            ChaSetSeparator { variant: "solid"; width: parent.width }

                            Text { text: "Dashed"; color: root.cMutedFg; font.pixelSize: 11 }
                            ChaSetSeparator { variant: "dashed"; width: parent.width }

                            Text { text: "Dotted"; color: root.cMutedFg; font.pixelSize: 11 }
                            ChaSetSeparator { variant: "dotted"; width: parent.width }
                        }
                    }
                }
            }

            // Example 4: Vertical Navigation Divider
            ChaSetCard {
                width: (parent.width - 16) / 2
                height: 180
                customRadius: root.customRadius

                Item {
                    width: parent.width
                    height: 180

                    Column {
                        anchors.fill: parent
                        anchors.margins: 16
                        spacing: 12

                        Text {
                            text: "Navigation Divider"
                            font.pixelSize: 15
                            font.weight: Font.Bold
                            color: root.cFg
                        }

                        Text {
                            text: "Vertical dividers between inline list items or metadata tags."
                            font.pixelSize: 13
                            color: root.cMutedFg
                            wrapMode: Text.WordWrap
                            width: parent.width
                        }

                        Rectangle {
                            width: parent.width
                            height: 38
                            radius: 6
                            color: Qt.rgba(ThemeTokens.hover.r, ThemeTokens.hover.g, ThemeTokens.hover.b, ThemeTokens.hover.a * 0.6)
                            border.color: root.cBorder
                            border.width: 1

                            Row {
                                anchors.centerIn: parent
                                spacing: 12

                                Text {
                                    text: "v0.2.0"
                                    font.weight: Font.DemiBold
                                    font.pixelSize: 12
                                    color: root.cFg
                                    anchors.verticalCenter: parent.verticalCenter
                                }
                                ChaSetSeparator {
                                    orientation: "vertical"
                                    height: 16
                                    anchors.verticalCenter: parent.verticalCenter
                                }
                                Text {
                                    text: "MIT License"
                                    font.pixelSize: 12
                                    color: root.cMutedFg
                                    anchors.verticalCenter: parent.verticalCenter
                                }
                                ChaSetSeparator {
                                    orientation: "vertical"
                                    height: 16
                                    anchors.verticalCenter: parent.verticalCenter
                                }
                                Text {
                                    text: "React 19 & Qt 6"
                                    font.pixelSize: 12
                                    color: root.cMutedFg
                                    anchors.verticalCenter: parent.verticalCenter
                                }
                            }
                        }
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
            componentId: "separator"
        }

        PropsTable {
            width: parent.width
            propsModel: [
                {
                    name: "orientation",
                    type: "\"horizontal\" | \"vertical\"",
                    default: "\"horizontal\"",
                    description: "The orientation of the separator line."
                },
                {
                    name: "variant",
                    type: "\"solid\" | \"dashed\" | \"dotted\"",
                    default: "\"solid\"",
                    description: "The stroke style of the separator line."
                },
                {
                    name: "label",
                    type: "string",
                    default: "\"\"",
                    description: "Optional label text embedded in the divider line."
                },
                {
                    name: "labelPosition",
                    type: "\"left\" | \"center\" | \"right\"",
                    default: "\"center\"",
                    description: "Alignment for the embedded label text."
                },
                {
                    name: "decorative",
                    type: "bool",
                    default: "true",
                    description: "Whether the element is purely decorative or conveys semantic structure."
                },
                {
                    name: "customColor",
                    type: "color",
                    default: "\"transparent\"",
                    description: "Optional explicit override color for the divider line (defaults to ThemeTokens.border)."
                }
            ]
        }
    }
}
