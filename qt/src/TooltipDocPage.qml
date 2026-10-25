// TooltipDocPage.qml — Documentation and interactive sandbox for ChaSetTooltip
import QtQuick
import QtQuick.Controls
import ChaSet

DocLayout {
    id: root
    category: "Overlays & Feedback"
    pageTitle: "Tooltip"
    description: ChaSetI18n.tr("components.tooltip.description", "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.")

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
    Column {
        property string sectionId: "overview"
        width: parent.width
        spacing: 12

        DocText {
            text: ChaSetI18n.tr("desktopComposite.tooltip.overviewHeading", "Interactive Overview")
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
        }

        DocText {
            text: ChaSetI18n.tr("desktopComposite.tooltip.overviewDesc", "Test interactive hover delays, side positioning, keyboard shortcut badges, directional arrows, and disabled behavior across Web and Qt Quick Desktop. Placement policy: dense vertical lists (menu items, select options, sidebar nav, virtual rows) default to right so bubbles never cover the prev/next sibling; top-docked chrome defaults to bottom; bottom-docked chrome to top; modal close buttons to bottom; everything else to top.")
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }
    }

    ComponentPreview {
        id: heroPreview
        width: parent.width
        title: ChaSetI18n.tr("desktopComposite.tooltip.sandboxTitle", "Tooltip Sandbox")
        reactCode: `<Tooltip\n  content="${root.demoText}"\n  shortcut="${root.demoShortcut}"\n  arrow={${root.demoArrow}}\n  side="${root.demoSide}"\n  delayDuration={${root.demoDelay}}\n  disabled={${root.demoDisabled}}\n>\n  <Button variant="outline">Hover or Focus Me</Button>\n</Tooltip>`
        qtCode: `ChaSetTooltip {\n    text: "${root.demoText}"\n    shortcut: "${root.demoShortcut}"\n    arrow: ${root.demoArrow}\n    side: "${root.demoSide}"\n    delay: ${root.demoDelay}\n    disabled: ${root.demoDisabled}\n\n    ChaSetButton {\n        text: "Hover or Focus Me"\n        variant: "outline"\n    }\n}`

        stageData: [
            Item {
                anchors.centerIn: parent
                width: ThemeTokens.dp(320)
                height: ThemeTokens.dp(140)

                ChaSetTooltip {
                    anchors.centerIn: parent
                    text: root.demoText
                    shortcut: root.demoShortcut
                    arrow: root.demoArrow
                    side: root.demoSide
                    delay: root.demoDelay
                    disabled: root.demoDisabled

                    ChaSetButton {
                        text: ChaSetI18n.tr("overlays.tooltip.hoverOrFocus", "Hover or Focus Me")
                        variant: "outline"
                    }
                }
            }
        ]

        controlsData: [
            // Side Selector
            Row {
                spacing: 8
                DocText { text: ChaSetI18n.tr("overlays.tooltip.side", "Side:"); color: root.cMutedFg; font.pixelSize: Typography.sizeSmall; anchors.verticalCenter: parent.verticalCenter }
                ChaSetSegmentedControl {
                    anchors.verticalCenter: parent.verticalCenter
                    size: "sm"
                    value: root.demoSide
                    onValueSelected: function(v) { root.demoSide = String(v); }
                    options: [
                        { label: ChaSetI18n.tr("overlays.popover.sideTop", "Top"), value: "top" },
                        { label: ChaSetI18n.tr("overlays.popover.sideBottom", "Bottom"), value: "bottom" },
                        { label: ChaSetI18n.tr("overlays.popover.sideLeft", "Left"), value: "left" },
                        { label: ChaSetI18n.tr("overlays.popover.sideRight", "Right"), value: "right" }
                    ]
                }
            },

            // Delay Selector
            Row {
                spacing: 8
                DocText { text: ChaSetI18n.tr("overlays.tooltip.delay", "Delay:"); color: root.cMutedFg; font.pixelSize: Typography.sizeSmall; anchors.verticalCenter: parent.verticalCenter }
                ChaSetSegmentedControl {
                    anchors.verticalCenter: parent.verticalCenter
                    size: "sm"
                    value: String(root.demoDelay)
                    onValueSelected: function(v) { root.demoDelay = parseInt(v); }
                    options: [
                        { label: ChaSetI18n.tr("overlays.tooltip.delay0ms", "0ms"), value: "0" },
                        { label: ChaSetI18n.tr("overlays.tooltip.delay200ms", "200ms"), value: "200" },
                        { label: ChaSetI18n.tr("overlays.tooltip.delay500", "500ms"), value: "500" }
                    ]
                }
            },

            // Text Input
            Row {
                spacing: ThemeTokens.dp(8)
                DocText { text: ChaSetI18n.tr("overlays.tooltip.text", "Text:"); color: root.cMutedFg; font.pixelSize: Typography.sizeSmall; anchors.verticalCenter: parent.verticalCenter }
                ChaSetInput {
                    width: ThemeTokens.dp(140)
                    size: "sm"
                    text: root.demoText
                    onTextEdited: root.demoText = text
                }
            },

            // Shortcut Input
            Row {
                spacing: ThemeTokens.dp(8)
                DocText { text: ChaSetI18n.tr("overlays.tooltip.shortcut", "Shortcut:"); color: root.cMutedFg; font.pixelSize: Typography.sizeSmall; anchors.verticalCenter: parent.verticalCenter }
                ChaSetInput {
                    width: ThemeTokens.dp(90)
                    size: "sm"
                    text: root.demoShortcut
                    onTextEdited: root.demoShortcut = text
                }
            },

            // Arrow Toggle
            ChaSetCheckbox {
                size: "sm"
                label: ChaSetI18n.tr("overlays.tooltip.arrow", "Arrow")
                checked: root.demoArrow
                onToggled: (val) => root.demoArrow = val
            },

            // Disabled Toggle
            ChaSetCheckbox {
                size: "sm"
                label: ChaSetI18n.tr("overlays.tooltip.disabled", "Disabled")
                checked: root.demoDisabled
                onToggled: (val) => root.demoDisabled = val
            }
        ]
    }

        // Section 3: Anatomy
    DocAnatomy {
        width: parent.width
        qtCode: `import ChaSet\n\nChaSetTooltip {\n    text: "Add to library"\n    side: "top"\n    delay: 200\n    ChaSetButton { text: "Hover me"; variant: "outline" }\n}`
        reactCode: `import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, Button } from '@chahu/cha-set';\n\n<TooltipProvider delayDuration={200}>\n  <Tooltip>\n    <TooltipTrigger asChild>\n      <Button variant="outline">Hover me</Button>\n    </TooltipTrigger>\n    <TooltipContent side="top">Add to library</TooltipContent>\n  </Tooltip>\n</TooltipProvider>\n\n// Shorthand wrapper\n<Tooltip content="Add to library" side="top">\n  <Button variant="outline">Hover me</Button>\n</Tooltip>`
    }

    // Section 4: Examples & States
    Column {
        property string sectionId: "states"
        property string sectionTitle: ChaSetI18n.tr("showcase.examplesAndStates", "Examples & States")
        width: parent.width
        spacing: 12

        DocText {
            text: ChaSetI18n.tr("showcase.examplesAndStates", "Examples & States")
            color: root.cFg
            font.pixelSize: Typography.sizeTitleSm
            font.weight: Typography.weightBold
        }

        DocText {
            text: ChaSetI18n.tr("desktopComposite.tooltip.examplesDescQt", "Visual matrix of Tooltip directional placements in Qt Quick Desktop.")
            color: root.cMutedFg
            font.pixelSize: Typography.sizeBody
        }

        Grid {
            width: parent.width
            columns: 2
            spacing: ThemeTokens.dp(16)

            // Top Placement
            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(16)) / 2
                customRadius: 8
                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(14)
                    bottomPadding: ThemeTokens.dp(14)
                    leftPadding: ThemeTokens.dp(14)
                    rightPadding: ThemeTokens.dp(14)
                    spacing: ThemeTokens.dp(8)
                    DocText { text: ChaSetI18n.tr("overlays.tooltip.topPlacementTitle", "Top Placement (Default)"); color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    Item {
                        width: parent.width - ThemeTokens.dp(28)
                        height: ThemeTokens.dp(60)
                        ChaSetTooltip {
                            anchors.centerIn: parent
                            text: ChaSetI18n.tr("overlays.tooltip.topPlacementContent", "Tooltip above target")
                            side: "top"
                            delay: 0
                            ChaSetButton { size: "sm"; variant: "secondary"; text: ChaSetI18n.tr("overlays.tooltip.topPlacementButton", "Top Tooltip") }
                        }
                    }
                }
            }

            // Bottom Placement
            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(16)) / 2
                customRadius: 8
                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(14)
                    bottomPadding: ThemeTokens.dp(14)
                    leftPadding: ThemeTokens.dp(14)
                    rightPadding: ThemeTokens.dp(14)
                    spacing: ThemeTokens.dp(8)
                    DocText { text: ChaSetI18n.tr("overlays.tooltip.bottomPlacementTitle", "Bottom Placement"); color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    Item {
                        width: parent.width - ThemeTokens.dp(28)
                        height: ThemeTokens.dp(60)
                        ChaSetTooltip {
                            anchors.centerIn: parent
                            text: ChaSetI18n.tr("overlays.tooltip.bottomPlacementContent", "Tooltip below target")
                            side: "bottom"
                            delay: 0
                            ChaSetButton { size: "sm"; variant: "secondary"; text: ChaSetI18n.tr("overlays.tooltip.bottomPlacementButton", "Bottom Tooltip") }
                        }
                    }
                }
            }

            // Left Placement
            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(16)) / 2
                customRadius: 8
                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(14)
                    bottomPadding: ThemeTokens.dp(14)
                    leftPadding: ThemeTokens.dp(14)
                    rightPadding: ThemeTokens.dp(14)
                    spacing: ThemeTokens.dp(8)
                    DocText { text: ChaSetI18n.tr("overlays.tooltip.leftPlacementTitle", "Left Placement"); color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    Item {
                        width: parent.width - ThemeTokens.dp(28)
                        height: ThemeTokens.dp(60)
                        ChaSetTooltip {
                            anchors.centerIn: parent
                            text: ChaSetI18n.tr("overlays.tooltip.leftPlacementContent", "Tooltip on left")
                            side: "left"
                            delay: 0
                            ChaSetButton { size: "sm"; variant: "secondary"; text: ChaSetI18n.tr("overlays.tooltip.leftPlacementButton", "Left Tooltip") }
                        }
                    }
                }
            }

            // Right Placement
            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(16)) / 2
                customRadius: 8
                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(14)
                    bottomPadding: ThemeTokens.dp(14)
                    leftPadding: ThemeTokens.dp(14)
                    rightPadding: ThemeTokens.dp(14)
                    spacing: ThemeTokens.dp(8)
                    DocText { text: ChaSetI18n.tr("overlays.tooltip.rightPlacementTitle", "Right Placement"); color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    Item {
                        width: parent.width - ThemeTokens.dp(28)
                        height: ThemeTokens.dp(60)
                        ChaSetTooltip {
                            anchors.centerIn: parent
                            text: ChaSetI18n.tr("overlays.tooltip.rightPlacementContent", "Tooltip on right")
                            side: "right"
                            delay: 0
                            ChaSetButton { size: "sm"; variant: "secondary"; text: ChaSetI18n.tr("overlays.tooltip.rightPlacementButton", "Right Tooltip") }
                        }
                    }
                }
            }

            // Keyboard Shortcut Hint
            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(16)) / 2
                customRadius: 8
                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(14)
                    bottomPadding: ThemeTokens.dp(14)
                    leftPadding: ThemeTokens.dp(14)
                    rightPadding: ThemeTokens.dp(14)
                    spacing: ThemeTokens.dp(8)
                    DocText { text: ChaSetI18n.tr("overlays.tooltip.shortcutHintTitle", "Keyboard Shortcut Hint"); color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    Item {
                        width: parent.width - ThemeTokens.dp(28)
                        height: ThemeTokens.dp(60)
                        ChaSetTooltip {
                            anchors.centerIn: parent
                            text: ChaSetI18n.tr("overlays.tooltip.shortcutHintContent", "Save Document")
                            shortcut: "Ctrl+S"
                            side: "top"
                            delay: 0
                            ChaSetButton { size: "sm"; variant: "secondary"; text: ChaSetI18n.tr("overlays.tooltip.shortcutHintButton", "Save Action") }
                        }
                    }
                }
            }

            // Directional Arrow
            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(16)) / 2
                customRadius: 8
                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(14)
                    bottomPadding: ThemeTokens.dp(14)
                    leftPadding: ThemeTokens.dp(14)
                    rightPadding: ThemeTokens.dp(14)
                    spacing: ThemeTokens.dp(8)
                    DocText { text: ChaSetI18n.tr("overlays.tooltip.directionalArrowTitle", "Directional Arrow"); color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    Item {
                        width: parent.width - ThemeTokens.dp(28)
                        height: ThemeTokens.dp(60)
                        ChaSetTooltip {
                            anchors.centerIn: parent
                            text: ChaSetI18n.tr("overlays.tooltip.directionalArrowContent", "Anchored Pointer")
                            arrow: true
                            side: "top"
                            delay: 0
                            ChaSetButton { size: "sm"; variant: "secondary"; text: ChaSetI18n.tr("overlays.tooltip.directionalArrowButton", "With Arrow") }
                        }
                    }
                }
            }

            // Menu Items: Right Default (mirrors React DocPage)
            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(16)) / 2
                customRadius: 8
                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(14)
                    bottomPadding: ThemeTokens.dp(14)
                    leftPadding: ThemeTokens.dp(14)
                    rightPadding: ThemeTokens.dp(14)
                    spacing: ThemeTokens.dp(8)
                    DocText { text: ChaSetI18n.tr("overlays.tooltip.menuItemsRightTitle", "Menu Items (Right Default)"); color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    DocText { text: ChaSetI18n.tr("overlays.tooltip.menuItemsRightDesc", "Dense vertical lists use right so the bubble never covers the prev/next sibling item"); color: root.cMutedFg; font.pixelSize: Typography.sizeSmall }
                    Column {
                        width: parent.width - ThemeTokens.dp(28)
                        spacing: ThemeTokens.dp(4)
                        ChaSetTooltip {
                            width: parent.width
                            text: ChaSetI18n.tr("overlays.tooltip.menuItemsRightPinContent", "Pinned — keeps siblings visible")
                            side: "right"
                            delay: 0
                            ChaSetButton { width: parent.width; size: "sm"; variant: "ghost"; text: ChaSetI18n.tr("overlays.tooltip.menuItemsRightPinButton", "Pin tab") }
                        }
                        ChaSetTooltip {
                            width: parent.width
                            text: ChaSetI18n.tr("overlays.tooltip.menuItemsRightDuplicateContent", "Duplicate this row")
                            side: "right"
                            delay: 0
                            ChaSetButton { width: parent.width; size: "sm"; variant: "ghost"; text: ChaSetI18n.tr("overlays.tooltip.menuItemsRightDuplicateButton", "Duplicate") }
                        }
                        ChaSetTooltip {
                            width: parent.width
                            text: ChaSetI18n.tr("overlays.tooltip.menuItemsRightDeleteContent", "Remove permanently")
                            side: "right"
                            delay: 0
                            ChaSetButton { width: parent.width; size: "sm"; variant: "ghost"; text: ChaSetI18n.tr("overlays.tooltip.menuItemsRightDeleteButton", "Delete") }
                        }
                    }
                }
            }
        }
    }

    DocMarkdown {
        width: parent.width
        docId: "tooltip"
        section: "animations"
    }

    DocMarkdown {
            width: parent.width
            docId: "tooltip"
            section: "keyboard"
        }

        DocMarkdown {
            width: parent.width
            docId: "tooltip"
            section: "props"
        }
}