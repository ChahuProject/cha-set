// BadgeDocPage.qml — Documentation and interactive sandbox for ChaSetBadge
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Base Primitives"
    pageTitle: "Badge"
    description: "Displays a badge or a component that looks like a badge to highlight status, tags, and counts."

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
                    text: ChaSetI18n.tr("components.badge.resetRemoved", "Reset Removed Badge")
                    onClicked: root.demoRemoved = false
                }
            }
        ]

        controlsData: [
            Row {
                width: childrenRect.width
                spacing: 8
                DocText { text: ChaSetI18n.tr("common.variant", "Variant:"); color: root.cMutedFg; font.pixelSize: Typography.sizeSmall; anchors.verticalCenter: parent.verticalCenter }
                ChaSetSegmentedControl {
                    anchors.verticalCenter: parent.verticalCenter
                    size: "sm"
                    value: root.demoVariant
                    options: [
                        { label: "Default", value: "default" },
                        { label: "Secondary", value: "secondary" },
                        { label: "Destructive", value: "destructive" },
                        { label: "Outline", value: "outline" },
                        { label: "Ghost", value: "ghost" },
                        { label: "Link", value: "link" }
                    ]
                    onValueSelected: function(v) { root.demoVariant = String(v); }
                }
            },

            Row {
                width: childrenRect.width
                spacing: 8
                DocText { text: ChaSetI18n.tr("common.size", "Size:"); color: root.cMutedFg; font.pixelSize: Typography.sizeSmall; anchors.verticalCenter: parent.verticalCenter }
                ChaSetSegmentedControl {
                    anchors.verticalCenter: parent.verticalCenter
                    size: "sm"
                    value: root.demoSize
                    options: [
                        { label: "Default", value: "default" },
                        { label: "Small (sm)", value: "sm" }
                    ]
                    onValueSelected: function(s) { root.demoSize = String(s); }
                }
            },

            Row {
                width: childrenRect.width
                spacing: 12

                ChaSetCheckbox {
                    size: "sm"
                    label: ChaSetI18n.tr("components.badge.statusDot", "Status Dot")
                    checked: root.demoDot
                    onToggled: (v) => root.demoDot = v
                }

                ChaSetCheckbox {
                    size: "sm"
                    label: ChaSetI18n.tr("components.badge.removable", "Removable")
                    checked: root.demoRemovable
                    onToggled: (v) => {
                        root.demoRemovable = v
                        root.demoRemoved = false
                    }
                }
            }
        ]
    }

    // Section 2: Anatomy
    DocAnatomy {
        width: parent.width
        qtCode: "import ChaSet\n\nChaSetBadge {\n    text: \"Badge\"\n}"
        reactCode: "import { Badge } from '@chahu/cha-set';\n\n<Badge>Badge</Badge>"
    }

    // Section 3: Variants
    Column {
        property string sectionId: "variants"
        property string sectionTitle: "Variants"
        width: parent.width
        spacing: 8
        DocText { text: ChaSetI18n.tr("components.badge.variantsTitle", "Variants"); font.pixelSize: Typography.sizeTitleSm; font.weight: Typography.weightBold; color: root.cFg }
        DocText { text: ChaSetI18n.tr("components.badge.variantsDesc", "All six standard semantic variants aligned with the ChaSet design token system."); color: root.cMutedFg; font.pixelSize: Typography.sizeBody }

        ChaSetCard {
            width: parent.width
            customRadius: root.customRadius

            Column {
                width: parent.width
                topPadding: ThemeTokens.dp(20)
                bottomPadding: ThemeTokens.dp(20)

                Row {
                    anchors.horizontalCenter: parent.horizontalCenter
                    spacing: ThemeTokens.dp(12)
                    ChaSetBadge { variant: "default"; text: ChaSetI18n.tr("common.default", "Default") }
                    ChaSetBadge { variant: "secondary"; text: ChaSetI18n.tr("common.secondary", "Secondary") }
                    ChaSetBadge { variant: "destructive"; text: ChaSetI18n.tr("common.destructive", "Destructive") }
                    ChaSetBadge { variant: "outline"; text: ChaSetI18n.tr("common.outline", "Outline") }
                    ChaSetBadge { variant: "ghost"; text: ChaSetI18n.tr("common.ghost", "Ghost") }
                    ChaSetBadge { variant: "link"; text: ChaSetI18n.tr("common.link", "Link") }
                }
            }
        }
    }

    // Section 4: Sizes
    Column {
        property string sectionId: "sizes"
        property string sectionTitle: "Sizes"
        width: parent.width
        spacing: ThemeTokens.dp(8)
        DocText { text: ChaSetI18n.tr("components.badge.sizesTitle", "Sizes"); font.pixelSize: Typography.sizeTitleSm; font.weight: Typography.weightBold; color: root.cFg }
        DocText { text: ChaSetI18n.tr("components.badge.sizesDesc", "Choose between standard pill scale (default) and compact micro badge (sm)."); color: root.cMutedFg; font.pixelSize: Typography.sizeBody }

        ChaSetCard {
            width: parent.width
            customRadius: root.customRadius

            Column {
                width: parent.width
                topPadding: ThemeTokens.dp(20)
                bottomPadding: ThemeTokens.dp(20)

                Row {
                    anchors.horizontalCenter: parent.horizontalCenter
                    spacing: ThemeTokens.dp(20)
                    Row {
                        spacing: ThemeTokens.dp(8)
                        DocText { anchors.verticalCenter: parent.verticalCenter; text: ChaSetI18n.tr("components.badge.defaultLabel", "Default:"); color: root.cMutedFg; font.pixelSize: Typography.sizeSmall }
                        ChaSetBadge { size: "default"; text: ChaSetI18n.tr("components.badge.badgeDefault", "Badge Default") }
                    }
                    Row {
                        spacing: ThemeTokens.dp(8)
                        DocText { anchors.verticalCenter: parent.verticalCenter; text: ChaSetI18n.tr("components.badge.smallLabel", "Small:"); color: root.cMutedFg; font.pixelSize: Typography.sizeSmall }
                        ChaSetBadge { size: "sm"; text: ChaSetI18n.tr("components.badge.badgeNew", "NEW") }
                    }
                }
            }
        }
    }

    // Section 5: Status & Removable Badges
    Column {
        property string sectionId: "status-removable-tags"
        property string sectionTitle: "Status & Removable Tags"
        width: parent.width
        spacing: ThemeTokens.dp(8)
        DocText { text: ChaSetI18n.tr("components.badge.statusTitle", "Status & Removable Tags"); font.pixelSize: Typography.sizeTitleSm; font.weight: Typography.weightBold; color: root.cFg }
        DocText { text: ChaSetI18n.tr("components.badge.statusDesc", "Badges support live status indicator dots and dismissible action buttons for filter tags."); color: root.cMutedFg; font.pixelSize: Typography.sizeBody }

        ChaSetCard {
            width: parent.width
            customRadius: root.customRadius

            Column {
                width: parent.width
                topPadding: ThemeTokens.dp(20)
                bottomPadding: ThemeTokens.dp(20)

                Row {
                    anchors.horizontalCenter: parent.horizontalCenter
                    spacing: ThemeTokens.dp(16)
                    ChaSetBadge { dot: true; dotColor: "#10b981"; variant: "outline"; text: ChaSetI18n.tr("components.badge.online", "Online") }
                    ChaSetBadge { dot: true; dotColor: "#f59e0b"; variant: "outline"; text: ChaSetI18n.tr("components.badge.away", "Away") }
                    ChaSetBadge { dot: true; dotColor: "#ef4444"; variant: "destructive"; text: ChaSetI18n.tr("components.badge.error", "Error") }
                    ChaSetBadge { removable: true; text: ChaSetI18n.tr("components.badge.reactTag", "React Tag"); onRemoved: console.log("Removed React Tag") }
                    ChaSetBadge { removable: true; variant: "secondary"; text: ChaSetI18n.tr("components.badge.qtQuick", "Qt Quick"); onRemoved: console.log("Removed Qt Quick") }
                }
            }
        }
    }

    // Section 6: Footer Sections (Animations, Keyboard, Props)
        // Animations
    Column {
        width: parent.width
        spacing: ThemeTokens.dp(8)

        DocText {
            text: "Animations"
            font.pixelSize: Typography.sizeTitleSm
            font.weight: Typography.weightBold
            color: ThemeTokens.text
        }

        DocText {
            text: "State changes (hover, press, focus) animate over duration-quick with standard easing curves. Durations and easing resolve from theme tokens; prefers-reduced-motion zeroes them automatically (governed by ThemeTokens.animationsEnabled)."
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }
    }

    ComponentReference {
        name: "Badge"
        componentId: "badge"
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