// TooltipDocPage.qml — Documentation and interactive sandbox for ChaSetTooltip
import QtQuick 6.10
import QtQuick.Controls 6.10
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
        }
    }

    // Animations
    Column {
        width: parent.width
        spacing: 12

        DocText { text: ChaSetI18n.tr("showcase.animations", "Animations"); color: root.cFg; font.pixelSize: Typography.sizeTitleSm; font.weight: Typography.weightBold }

        DocText { text: ChaSetI18n.tr("desktopComposite.tooltip.animationsDescQt", "Motion behavior and timing driven by ThemeTokens for the tooltip bubble on open and close."); color: root.cMutedFg; font.pixelSize: Typography.sizeBody; wrapMode: TextEdit.WordWrap; width: parent.width }

        DocText { text: ChaSetI18n.tr("desktopComposite.tooltip.animationsBulletQt1", "• The bubble cross-fades its opacity and scales it slightly on entry and exit to signal appearance."); color: root.cFg; font.pixelSize: Typography.sizeBody; wrapMode: TextEdit.WordWrap; width: parent.width }
        DocText { text: ChaSetI18n.tr("desktopComposite.tooltip.animationsBulletQt2", "• Transitions use ThemeTokens.motionShort with the easeEntrance curve."); color: root.cFg; font.pixelSize: Typography.sizeBody; wrapMode: TextEdit.WordWrap; width: parent.width }
        DocText { text: ChaSetI18n.tr("desktopComposite.tooltip.animationsBulletQt3", "• All transitions are guarded by ThemeTokens.animationsEnabled; when disabled, durations resolve to zero and animations stop."); color: root.cFg; font.pixelSize: Typography.sizeBody; wrapMode: TextEdit.WordWrap; width: parent.width }
    }

        ComponentReference {
        name: "Tooltip"
        componentId: "tooltip"
        propsModel: [
                {
                    name: "text",
                    type: "string",
                    default: "\"\"",
                    description: ChaSetI18n.tr("components.tooltip.contentDesc", "The content rendered inside the floating tooltip bubble.")
                },
                {
                    name: "shortcut",
                    type: "string",
                    default: "\"\"",
                    description: ChaSetI18n.tr("components.tooltip.shortcutDesc", "Keyboard shortcut badge rendered inside the tooltip bubble.")
                },
                {
                    name: "arrow",
                    type: "bool",
                    default: "false",
                    description: ChaSetI18n.tr("components.tooltip.arrowDesc", "Whether to render a directional arrow pointing toward the trigger.")
                },
                {
                    name: "side",
                    type: "\"top\" | \"bottom\" | \"left\" | \"right\"",
                    default: "\"top\"",
                    description: ChaSetI18n.tr("components.tooltip.sideDesc", "The preferred placement relative to the trigger.")
                },
                {
                    name: "sideOffset",
                    type: "int",
                    default: "4",
                    description: "Distance between target item and tooltip bubble."
                },
                {
                    name: "delay",
                    type: "int",
                    default: "200",
                    description: ChaSetI18n.tr("components.tooltip.delayDesc", "Hover delay in milliseconds before the tooltip opens.")
                },
                {
                    name: "active",
                    type: "bool",
                    default: "false",
                    description: ChaSetI18n.tr("components.tooltip.activeDesc", "Whether the tooltip bubble is currently active and visible.")
                },
                {
                    name: "disabled",
                    type: "bool",
                    default: "false",
                    description: ChaSetI18n.tr("components.tooltip.disabledDesc", "Prevents the tooltip from opening when hovering or focusing.")
                },
                {
                    name: "target",
                    type: "Item",
                    default: "null",
                    description: ChaSetI18n.tr("components.tooltip.targetDesc", "Optional target item to attach the tooltip to when not wrapping children.")
                },
                {
                    name: "forceHover",
                    type: "bool",
                    default: "false",
                    description: ChaSetI18n.tr("components.tooltip.forceHoverDesc", "Visual testing hook to force active tooltip visibility.")
                }
            ]
    }
}