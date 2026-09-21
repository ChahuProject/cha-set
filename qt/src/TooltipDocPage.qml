// TooltipDocPage.qml — Documentation and interactive sandbox for ChaSetTooltip
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Overlays & Feedback"
    pageTitle: "Tooltip"
    description: "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it."
    tocItems: [
        { id: "overview", title: "Interactive Overview" },
        { id: "installation", title: "Installation" },
        { id: "anatomy", title: "Anatomy" },
        { id: "examples", title: "Examples & States" },
        { id: "animations", title: "Animations" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "Props Reference" }
    ]

    property int customRadius: 6
    property color cFg: ThemeTokens.text
    property color cMutedFg: ThemeTokens.subduedText
    property color cCard: ThemeTokens.panel
    property color cBorder: ThemeTokens.border
    property color cPrimary: ThemeTokens.accent
    property color cAccentBg: ThemeTokens.hover

    property string demoSide: "top"
    property string demoText: "Save document"
    property string demoShortcut: "Ctrl+S"
    property bool demoArrow: true
    property int demoDelay: 200
    property bool demoDisabled: false

    // Section 1: Interactive Overview
    ComponentPreview {
        id: heroPreview
        width: parent.width
        title: "Tooltip Sandbox"
        reactCode: `<Tooltip\n  content="${root.demoText}"\n  shortcut="${root.demoShortcut}"\n  arrow={${root.demoArrow}}\n  side="${root.demoSide}"\n  delayDuration={${root.demoDelay}}\n  disabled={${root.demoDisabled}}\n>\n  <Button variant="outline">Hover or Focus Me</Button>\n</Tooltip>`
        qtCode: `ChaSetTooltip {\n    text: "${root.demoText}"\n    shortcut: "${root.demoShortcut}"\n    arrow: ${root.demoArrow}\n    side: "${root.demoSide}"\n    delay: ${root.demoDelay}\n    disabled: ${root.demoDisabled}\n\n    ChaSetButton {\n        text: "Hover or Focus Me"\n        variant: "outline"\n    }\n}`

        stageData: [
            Item {
                anchors.centerIn: parent
                width: 320
                height: 140

                ChaSetTooltip {
                    anchors.centerIn: parent
                    text: root.demoText
                    shortcut: root.demoShortcut
                    arrow: root.demoArrow
                    side: root.demoSide
                    delay: root.demoDelay
                    disabled: root.demoDisabled

                    ChaSetButton {
                        text: "Hover or Focus Me"
                        variant: "outline"
                    }
                }
            }
        ]

        controlsData: [
            // Side Selector
            Row {
                spacing: 8
                DocText { text: "Side:"; color: root.cMutedFg; font.pixelSize: Typography.sizeSmall; anchors.verticalCenter: parent.verticalCenter }
                ChaSetTabs {
                    anchors.verticalCenter: parent.verticalCenter
                    currentValue: root.demoSide
                    onCurrentValueChanged: root.demoSide = currentValue
                    ChaSetTabsList {
                        ChaSetTabsTrigger { value: "top"; text: "Top" }
                        ChaSetTabsTrigger { value: "bottom"; text: "Bottom" }
                        ChaSetTabsTrigger { value: "left"; text: "Left" }
                        ChaSetTabsTrigger { value: "right"; text: "Right" }
                    }
                }
            },

            // Delay Selector
            Row {
                spacing: 8
                DocText { text: "Delay:"; color: root.cMutedFg; font.pixelSize: Typography.sizeSmall; anchors.verticalCenter: parent.verticalCenter }
                ChaSetTabs {
                    anchors.verticalCenter: parent.verticalCenter
                    currentValue: String(root.demoDelay)
                    onCurrentValueChanged: root.demoDelay = parseInt(currentValue)
                    ChaSetTabsList {
                        ChaSetTabsTrigger { value: "0"; text: "0ms" }
                        ChaSetTabsTrigger { value: "200"; text: "200ms" }
                        ChaSetTabsTrigger { value: "500"; text: "500ms" }
                    }
                }
            },

            // Text Input
            Row {
                spacing: 8
                DocText { text: "Text:"; color: root.cMutedFg; font.pixelSize: Typography.sizeSmall; anchors.verticalCenter: parent.verticalCenter }
                ChaSetInput {
                    width: 140
                    size: "sm"
                    text: root.demoText
                    onTextEdited: root.demoText = text
                }
            },

            // Shortcut Input
            Row {
                spacing: 8
                DocText { text: "Shortcut:"; color: root.cMutedFg; font.pixelSize: Typography.sizeSmall; anchors.verticalCenter: parent.verticalCenter }
                ChaSetInput {
                    width: 90
                    size: "sm"
                    text: root.demoShortcut
                    onTextEdited: root.demoShortcut = text
                }
            },

            // Arrow Toggle
            ChaSetCheckbox {
                size: "sm"
                label: "Arrow"
                checked: root.demoArrow
                onToggled: (val) => root.demoArrow = val
            },

            // Disabled Toggle
            ChaSetCheckbox {
                size: "sm"
                label: "Disabled"
                checked: root.demoDisabled
                onToggled: (val) => root.demoDisabled = val
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
    Column {
        width: parent.width
        spacing: 12

        DocText {
            text: "Anatomy"
            color: root.cFg
            font.pixelSize: Typography.sizeTitleSm
            font.weight: Typography.weightBold
        }

        DocText {
            text: "ChaSetTooltip can wrap child items directly or attach to an existing parent item."
            color: root.cMutedFg
            font.pixelSize: Typography.sizeBody
        }

        ChaSetCodeBlock {
            width: parent.width
            language: "qml"
            code: `import ChaSet\n\n// Option 1: Wrap children directly\nChaSetTooltip {\n    text: "Save document"\n    side: "top"\n\n    ChaSetButton {\n        text: "Save"\n    }\n}\n\n// Option 2: Attach inside a parent item\nChaSetButton {\n    text: "Submit"\n    ChaSetTooltip {\n        text: "Submit form"\n        side: "bottom"\n    }\n}`
        }
    }

    // Section 4: Examples & States
    Column {
        width: parent.width
        spacing: 12

        DocText {
            text: "Examples & States"
            color: root.cFg
            font.pixelSize: Typography.sizeTitleSm
            font.weight: Typography.weightBold
        }

        DocText {
            text: "Visual matrix of Tooltip directional placements in Qt Quick Desktop."
            color: root.cMutedFg
            font.pixelSize: Typography.sizeBody
        }

        Grid {
            width: parent.width
            columns: 2
            spacing: 16

            // Top Placement
            Rectangle {
                width: (parent.width - 16) / 2
                height: 120
                radius: 8
                color: root.cCard
                border.color: root.cBorder

                Column {
                    anchors.fill: parent
                    anchors.margins: 14
                    spacing: 8
                    DocText { text: "Top Placement (Default)"; color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    Item {
                        width: parent.width
                        height: 60
                        ChaSetTooltip {
                            anchors.centerIn: parent
                            text: "Tooltip above target"
                            side: "top"
                            delay: 0
                            ChaSetButton { size: "sm"; variant: "secondary"; text: "Top Tooltip" }
                        }
                    }
                }
            }

            // Bottom Placement
            Rectangle {
                width: (parent.width - 16) / 2
                height: 120
                radius: 8
                color: root.cCard
                border.color: root.cBorder

                Column {
                    anchors.fill: parent
                    anchors.margins: 14
                    spacing: 8
                    DocText { text: "Bottom Placement"; color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    Item {
                        width: parent.width
                        height: 60
                        ChaSetTooltip {
                            anchors.centerIn: parent
                            text: "Tooltip below target"
                            side: "bottom"
                            delay: 0
                            ChaSetButton { size: "sm"; variant: "secondary"; text: "Bottom Tooltip" }
                        }
                    }
                }
            }

            // Left Placement
            Rectangle {
                width: (parent.width - 16) / 2
                height: 120
                radius: 8
                color: root.cCard
                border.color: root.cBorder

                Column {
                    anchors.fill: parent
                    anchors.margins: 14
                    spacing: 8
                    DocText { text: "Left Placement"; color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    Item {
                        width: parent.width
                        height: 60
                        ChaSetTooltip {
                            anchors.centerIn: parent
                            text: "Tooltip on left"
                            side: "left"
                            delay: 0
                            ChaSetButton { size: "sm"; variant: "secondary"; text: "Left Tooltip" }
                        }
                    }
                }
            }

            // Right Placement
            Rectangle {
                width: (parent.width - 16) / 2
                height: 120
                radius: 8
                color: root.cCard
                border.color: root.cBorder

                Column {
                    anchors.fill: parent
                    anchors.margins: 14
                    spacing: 8
                    DocText { text: "Right Placement"; color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    Item {
                        width: parent.width
                        height: 60
                        ChaSetTooltip {
                            anchors.centerIn: parent
                            text: "Tooltip on right"
                            side: "right"
                            delay: 0
                            ChaSetButton { size: "sm"; variant: "secondary"; text: "Right Tooltip" }
                        }
                    }
                }
            }

            // Keyboard Shortcut Hint
            Rectangle {
                width: (parent.width - 16) / 2
                height: 120
                radius: 8
                color: root.cCard
                border.color: root.cBorder

                Column {
                    anchors.fill: parent
                    anchors.margins: 14
                    spacing: 8
                    DocText { text: "Keyboard Shortcut Hint"; color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    Item {
                        width: parent.width
                        height: 60
                        ChaSetTooltip {
                            anchors.centerIn: parent
                            text: "Save Document"
                            shortcut: "Ctrl+S"
                            side: "top"
                            delay: 0
                            ChaSetButton { size: "sm"; variant: "secondary"; text: "Save Action" }
                        }
                    }
                }
            }

            // Directional Arrow
            Rectangle {
                width: (parent.width - 16) / 2
                height: 120
                radius: 8
                color: root.cCard
                border.color: root.cBorder

                Column {
                    anchors.fill: parent
                    anchors.margins: 14
                    spacing: 8
                    DocText { text: "Directional Arrow"; color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    Item {
                        width: parent.width
                        height: 60
                        ChaSetTooltip {
                            anchors.centerIn: parent
                            text: "Anchored Pointer"
                            arrow: true
                            side: "top"
                            delay: 0
                            ChaSetButton { size: "sm"; variant: "secondary"; text: "With Arrow" }
                        }
                    }
                }
            }
        }
    }

    // Animations
    Column {
        width: parent.width
        spacing: 12

        DocText { text: "Animations"; color: root.cFg; font.pixelSize: Typography.sizeTitleSm; font.weight: Typography.weightBold }

        DocText { text: "Motion behavior and timing driven by ThemeTokens for the tooltip bubble on open and close."; color: root.cMutedFg; font.pixelSize: Typography.sizeBody; wrapMode: TextEdit.WordWrap; width: parent.width }

        DocText { text: "• The bubble cross-fades its opacity and scales it slightly on entry and exit to signal appearance."; color: root.cFg; font.pixelSize: Typography.sizeBody; wrapMode: TextEdit.WordWrap; width: parent.width }
        DocText { text: "• Transitions use ThemeTokens.motionShort with the easeEntrance curve."; color: root.cFg; font.pixelSize: Typography.sizeBody; wrapMode: TextEdit.WordWrap; width: parent.width }
        DocText { text: "• All transitions are guarded by ThemeTokens.animationsEnabled; when disabled, durations resolve to zero and animations stop."; color: root.cFg; font.pixelSize: Typography.sizeBody; wrapMode: TextEdit.WordWrap; width: parent.width }
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
        componentId: "tooltip"
    }

    PropsTable {
            width: parent.width
            propsModel: [
                {
                    name: "text",
                    type: "string",
                    default: "\"\"",
                    description: "The content text rendered inside the floating tooltip bubble."
                },
                {
                    name: "shortcut",
                    type: "string",
                    default: "\"\"",
                    description: "Keyboard shortcut hint badge rendered inside the tooltip bubble."
                },
                {
                    name: "arrow",
                    type: "bool",
                    default: "false",
                    description: "Whether to render a directional arrow pointing toward the trigger item."
                },
                {
                    name: "side",
                    type: "\"top\" | \"bottom\" | \"left\" | \"right\"",
                    default: "\"top\"",
                    description: "The placement side of the tooltip relative to the target item."
                },
                {
                    name: "delay",
                    type: "int",
                    default: "200",
                    description: "Hover delay duration in milliseconds before tooltip appears."
                },
                {
                    name: "active",
                    type: "bool",
                    default: "false",
                    description: "Whether the tooltip bubble is currently active and visible."
                },
                {
                    name: "disabled",
                    type: "bool",
                    default: "false",
                    description: "Disables hover trigger and suppresses the tooltip."
                },
                {
                    name: "target",
                    type: "Item",
                    default: "null",
                    description: "Optional target Item to attach the tooltip to when not wrapping children."
                },
                {
                    name: "forceHover",
                    type: "bool",
                    default: "false",
                    description: "Visual testing hook to force active tooltip visibility."
                }
            ]
        }
    }
}
