// KbdDocPage.qml — Living Documentation and Interactive Sandbox for ChaSetKbd & ChaSetShortcut
import QtQuick
import QtQuick.Controls
import ChaSet

DocLayout {
    id: root
    category: "Base Primitives"
    pageTitle: "Kbd"
    description: ChaSetI18n.tr("components.kbd.description", "Displays keyboard shortcuts, key combinations, and keycap badges with smart compact truncation.")

    property color cFg: ThemeTokens.text
    property color cMutedFg: ThemeTokens.subduedText
    property color cCard: ThemeTokens.panel
    property color cBorder: ThemeTokens.border
    property color cPrimary: ThemeTokens.accent
    property color cAccentBg: ThemeTokens.hover

    property string demoVariant: "outline"
    property string demoSize: "default"
    property string demoCompact: "auto"

    // Section 1: Overview
    ComponentPreview {
        id: heroPreview
        width: parent.width
        title: ChaSetI18n.tr("desktopComposite.kbd.sandboxTitle", "Kbd Sandbox")
        reactCode: `<Kbd
  variant="${root.demoVariant}"
  size="${root.demoSize}"
  compact="${root.demoCompact}"
  shortcut="Ctrl+Shift+P"
/>`
        qtCode: `ChaSetKbd {
    variant: "${root.demoVariant}"
    size: "${root.demoSize}"
    compact: "${root.demoCompact}"
    shortcut: "Ctrl+Shift+P"
}`

        stageData: [
            Item {
                anchors.centerIn: parent
                width: kbdItem.width
                height: kbdItem.height

                ChaSetKbd {
                    id: kbdItem
                    anchors.centerIn: parent
                    variant: root.demoVariant
                    size: root.demoSize
                    compact: root.demoCompact
                    shortcut: "Ctrl+Shift+P"
                }
            }
        ]

        controlsData: [
            Row {
                width: childrenRect.width
                spacing: ThemeTokens.dp(8)
                DocText { text: ChaSetI18n.tr("common.variant", "Variant:"); color: root.cMutedFg; font.pixelSize: Typography.sizeSmall; anchors.verticalCenter: parent.verticalCenter }
                ChaSetSegmentedControl {
                    anchors.verticalCenter: parent.verticalCenter
                    size: "sm"
                    value: root.demoVariant
                    options: [
                        { label: ChaSetI18n.tr("desktopComposite.kbd.variantOutline", "Outline"), value: "outline" },
                        { label: ChaSetI18n.tr("desktopComposite.kbd.variantSolid", "Solid"), value: "solid" },
                        { label: ChaSetI18n.tr("desktopComposite.kbd.variantSubtle", "Subtle"), value: "subtle" },
                        { label: ChaSetI18n.tr("desktopComposite.kbd.variantInverted", "Inverted"), value: "inverted" }
                    ]
                    onValueSelected: function(v) { root.demoVariant = String(v); }
                }
            },

            Row {
                width: childrenRect.width
                spacing: ThemeTokens.dp(8)
                DocText { text: ChaSetI18n.tr("common.size", "Size:"); color: root.cMutedFg; font.pixelSize: Typography.sizeSmall; anchors.verticalCenter: parent.verticalCenter }
                ChaSetSegmentedControl {
                    anchors.verticalCenter: parent.verticalCenter
                    size: "sm"
                    value: root.demoSize
                    options: [
                        { label: ChaSetI18n.tr("desktopComposite.kbd.sizeXs", "Extra Small (xs)"), value: "xs" },
                        { label: ChaSetI18n.tr("desktopComposite.kbd.sizeSm", "Small (sm)"), value: "sm" },
                        { label: ChaSetI18n.tr("common.default", "Default"), value: "default" }
                    ]
                    onValueSelected: function(s) { root.demoSize = String(s); }
                }
            },

            Row {
                width: childrenRect.width
                spacing: ThemeTokens.dp(8)
                DocText { text: ChaSetI18n.tr("components.kbd.compact", "Compact:"); color: root.cMutedFg; font.pixelSize: Typography.sizeSmall; anchors.verticalCenter: parent.verticalCenter }
                ChaSetSegmentedControl {
                    anchors.verticalCenter: parent.verticalCenter
                    size: "sm"
                    value: root.demoCompact
                    options: [
                        { label: ChaSetI18n.tr("components.kbd.auto", "Auto"), value: "auto" },
                        { label: ChaSetI18n.tr("components.kbd.always", "Always"), value: "always" },
                        { label: ChaSetI18n.tr("components.kbd.never", "Never"), value: "never" }
                    ]
                    onValueSelected: function(c) { root.demoCompact = String(c); }
                }
            }
        ]
    }

    // Section 2: Anatomy
    DocAnatomy {
        id: anatomy
        reactCode: `import { Kbd, Shortcut } from '@chahu/cha-set';\n\n<Kbd shortcut="Ctrl+K" />`
        qtCode: `import ChaSet\n\nChaSetKbd {\n    shortcut: "Ctrl+K"\n}`
    }

    // Section 3: Variants
    Column {
        width: parent.width
        spacing: ThemeTokens.dp(8)
        property string sectionId: "variants"
        property string sectionTitle: ChaSetI18n.tr("components.kbd.variantsTitle", "Variants")

        DocText { text: ChaSetI18n.tr("components.kbd.variantsTitle", "Variants"); font.pixelSize: Typography.sizeTitleSm; font.weight: Typography.weightBold; color: root.cFg }
        DocText { text: ChaSetI18n.tr("components.kbd.variantsDesc", "Four distinct visual styles designed for menus, search fields, dialogs, and inverted tooltips."); color: root.cMutedFg; font.pixelSize: Typography.sizeBody }

        ChaSetCard {
            width: parent.width

            Row {
                anchors.horizontalCenter: parent.horizontalCenter
                spacing: ThemeTokens.dp(32)
                topPadding: ThemeTokens.dp(16)
                bottomPadding: ThemeTokens.dp(16)

                Column {
                    spacing: ThemeTokens.dp(8)
                    anchors.verticalCenter: parent.verticalCenter
                    DocText { text: ChaSetI18n.tr("desktopComposite.kbd.outlineDefault", "Outline (Default)"); color: root.cMutedFg; font.pixelSize: Typography.sizeCaption; anchors.horizontalCenter: parent.horizontalCenter }
                    ChaSetKbd { variant: "outline"; shortcut: "Ctrl+K"; compact: "never"; anchors.horizontalCenter: parent.horizontalCenter }
                }

                Column {
                    spacing: ThemeTokens.dp(8)
                    anchors.verticalCenter: parent.verticalCenter
                    DocText { text: ChaSetI18n.tr("desktopComposite.kbd.variantSolid", "Solid"); color: root.cMutedFg; font.pixelSize: Typography.sizeCaption; anchors.horizontalCenter: parent.horizontalCenter }
                    ChaSetKbd { variant: "solid"; shortcut: "Ctrl+K"; compact: "never"; anchors.horizontalCenter: parent.horizontalCenter }
                }

                Column {
                    spacing: ThemeTokens.dp(8)
                    anchors.verticalCenter: parent.verticalCenter
                    DocText { text: ChaSetI18n.tr("desktopComposite.kbd.variantSubtle", "Subtle"); color: root.cMutedFg; font.pixelSize: Typography.sizeCaption; anchors.horizontalCenter: parent.horizontalCenter }
                    ChaSetKbd { variant: "subtle"; shortcut: "Ctrl+K"; compact: "never"; anchors.horizontalCenter: parent.horizontalCenter }
                }

                Rectangle {
                    anchors.verticalCenter: parent.verticalCenter
                    color: ThemeTokens.dark ? "#f8fafc" : "#020817"
                    radius: ThemeTokens.dp(6)
                    implicitWidth: invertedCol.implicitWidth + ThemeTokens.dp(24)
                    implicitHeight: invertedCol.implicitHeight + ThemeTokens.dp(16)

                    Column {
                        id: invertedCol
                        anchors.centerIn: parent
                        spacing: ThemeTokens.dp(6)
                        DocText { text: ChaSetI18n.tr("desktopComposite.kbd.invertedTooltip", "Inverted (Tooltip)"); color: ThemeTokens.dark ? "#020817" : "#f8fafc"; font.pixelSize: Typography.sizeCaption; anchors.horizontalCenter: parent.horizontalCenter }
                        ChaSetKbd { variant: "inverted"; shortcut: "Ctrl+S"; compact: "never"; anchors.horizontalCenter: parent.horizontalCenter }
                    }
                }
            }
        }
    }

    // Section 4: Key Combinations & Symbols
    Column {
        width: parent.width
        spacing: ThemeTokens.dp(8)
        property string sectionId: "combinations"
        property string sectionTitle: ChaSetI18n.tr("desktopComposite.kbd.combinationsTitle", "Key Combinations & Symbols")

        DocText { text: ChaSetI18n.tr("desktopComposite.kbd.combinationsTitle", "Key Combinations & Symbols"); font.pixelSize: Typography.sizeTitleSm; font.weight: Typography.weightBold; color: root.cFg }
        DocText { text: ChaSetI18n.tr("desktopComposite.kbd.combinationsDesc", "Support for multi-key combinations, alternative choices, and compact modifier symbols."); color: root.cMutedFg; font.pixelSize: Typography.sizeBody }

        ChaSetCard {
            width: parent.width

            Column {
                width: parent.width - ThemeTokens.dp(32)
                anchors.horizontalCenter: parent.horizontalCenter
                topPadding: ThemeTokens.dp(16)
                bottomPadding: ThemeTokens.dp(16)
                spacing: ThemeTokens.dp(14)

                Item {
                    width: parent.width
                    height: Math.max(symbolsText.implicitHeight, symbolsKbd.implicitHeight)
                    DocText {
                        id: symbolsText
                        text: ChaSetI18n.tr("desktopComposite.kbd.compactSymbols", "Compact Modifier Symbols:")
                        color: root.cFg
                        font.pixelSize: Typography.sizeBody
                        anchors.left: parent.left
                        anchors.verticalCenter: parent.verticalCenter
                    }
                    ChaSetKbd {
                        id: symbolsKbd
                        anchors.right: parent.right
                        anchors.verticalCenter: parent.verticalCenter
                        shortcut: "Ctrl+Alt+Shift+P"
                        compact: "always"
                    }
                }

                Item {
                    width: parent.width
                    height: Math.max(altText.implicitHeight, altKbd.implicitHeight)
                    DocText {
                        id: altText
                        text: ChaSetI18n.tr("desktopComposite.kbd.altChoices", "Alternative Key Choices:")
                        color: root.cFg
                        font.pixelSize: Typography.sizeBody
                        anchors.left: parent.left
                        anchors.verticalCenter: parent.verticalCenter
                    }
                    ChaSetKbd {
                        id: altKbd
                        anchors.right: parent.right
                        anchors.verticalCenter: parent.verticalCenter
                        shortcut: "Space / Enter"
                        compact: "never"
                    }
                }

                Item {
                    width: parent.width
                    height: Math.max(seqText.implicitHeight, seqKbd.implicitHeight)
                    DocText {
                        id: seqText
                        text: ChaSetI18n.tr("desktopComposite.kbd.multiModifier", "Multi-Modifier Sequence:")
                        color: root.cFg
                        font.pixelSize: Typography.sizeBody
                        anchors.left: parent.left
                        anchors.verticalCenter: parent.verticalCenter
                    }
                    ChaSetKbd {
                        id: seqKbd
                        anchors.right: parent.right
                        anchors.verticalCenter: parent.verticalCenter
                        shortcut: "Ctrl + Shift + P"
                        compact: "never"
                    }
                }
            }
        }
    }

    // Section 5: Menu Trailing Shortcuts
    Column {
        width: parent.width
        spacing: ThemeTokens.dp(8)
        property string sectionId: "menu-shortcuts"
        property string sectionTitle: ChaSetI18n.tr("desktopComposite.kbd.menuTitle", "Menu Trailing Shortcuts")

        DocText { text: ChaSetI18n.tr("desktopComposite.kbd.menuTitle", "Menu Trailing Shortcuts"); font.pixelSize: Typography.sizeTitleSm; font.weight: Typography.weightBold; color: root.cFg }
        DocText { text: ChaSetI18n.tr("desktopComposite.kbd.menuDesc", "Dedicated Shortcut component with built-in right-alignment and non-shrinking behavior for menu items."); color: root.cMutedFg; font.pixelSize: Typography.sizeBody }

        ChaSetCard {
            width: ThemeTokens.dp(320)

            Column {
                width: parent.width - ThemeTokens.dp(16)
                anchors.horizontalCenter: parent.horizontalCenter
                topPadding: ThemeTokens.dp(10)
                bottomPadding: ThemeTokens.dp(10)
                spacing: ThemeTokens.dp(4)

                Rectangle {
                    width: parent.width
                    height: ThemeTokens.dp(32)
                    radius: ThemeTokens.dp(4)
                    color: "transparent"

                    DocText {
                        text: ChaSetI18n.tr("desktopComposite.kbd.newFile", "New File")
                        anchors.left: parent.left
                        anchors.leftMargin: ThemeTokens.dp(8)
                        anchors.verticalCenter: parent.verticalCenter
                        color: root.cFg
                        font.pixelSize: Typography.sizeSmall
                    }
                    ChaSetShortcut {
                        anchors.right: parent.right
                        anchors.rightMargin: ThemeTokens.dp(8)
                        anchors.verticalCenter: parent.verticalCenter
                        value: "Ctrl+N"
                    }
                }

                Rectangle {
                    width: parent.width
                    height: ThemeTokens.dp(32)
                    radius: ThemeTokens.dp(4)
                    color: "transparent"

                    DocText {
                        text: ChaSetI18n.tr("desktopComposite.kbd.saveDocument", "Save Document")
                        anchors.left: parent.left
                        anchors.leftMargin: ThemeTokens.dp(8)
                        anchors.verticalCenter: parent.verticalCenter
                        color: root.cFg
                        font.pixelSize: Typography.sizeSmall
                    }
                    ChaSetShortcut {
                        anchors.right: parent.right
                        anchors.rightMargin: ThemeTokens.dp(8)
                        anchors.verticalCenter: parent.verticalCenter
                        value: "Ctrl+S"
                    }
                }

                Rectangle {
                    width: parent.width
                    height: ThemeTokens.dp(32)
                    radius: ThemeTokens.dp(4)
                    color: "transparent"

                    DocText {
                        text: ChaSetI18n.tr("desktopComposite.kbd.commandPalette", "Command Palette")
                        anchors.left: parent.left
                        anchors.leftMargin: ThemeTokens.dp(8)
                        anchors.verticalCenter: parent.verticalCenter
                        color: root.cFg
                        font.pixelSize: Typography.sizeSmall
                    }
                    ChaSetShortcut {
                        anchors.right: parent.right
                        anchors.rightMargin: ThemeTokens.dp(8)
                        anchors.verticalCenter: parent.verticalCenter
                        value: "Ctrl+Shift+P"
                    }
                }
            }
        }
    }

    // Section 6: Narrow Container Adaptation
    Column {
        width: parent.width
        spacing: ThemeTokens.dp(8)
        property string sectionId: "narrow-container"
        property string sectionTitle: ChaSetI18n.tr("desktopComposite.kbd.narrowTitle", "Narrow Container Adaptation")

        DocText { text: ChaSetI18n.tr("desktopComposite.kbd.narrowTitle", "Narrow Container Adaptation"); font.pixelSize: Typography.sizeTitleSm; font.weight: Typography.weightBold; color: root.cFg }
        DocText { text: ChaSetI18n.tr("desktopComposite.kbd.narrowDesc", "When the parent container is squeezed, the label is truncated while the shortcut stays intact or compresses into symbols."); color: root.cMutedFg; font.pixelSize: Typography.sizeBody }

        ChaSetCard {
            width: ThemeTokens.dp(224)

            Column {
                width: parent.width - ThemeTokens.dp(16)
                anchors.horizontalCenter: parent.horizontalCenter
                topPadding: ThemeTokens.dp(10)
                bottomPadding: ThemeTokens.dp(10)
                spacing: ThemeTokens.dp(4)

                Row {
                    width: parent.width
                    spacing: ThemeTokens.dp(8)
                    Text {
                        text: ChaSetI18n.tr("desktopComposite.kbd.veryLongAction", "Very Long Action Name That Truncates")
                        width: parent.width - narrowKbd1.width - ThemeTokens.dp(12)
                        elide: Text.ElideRight
                        color: root.cFg
                        font.pixelSize: Typography.sizeSmall
                        font.family: Typography.familySans
                        anchors.verticalCenter: parent.verticalCenter
                    }
                    ChaSetShortcut {
                        id: narrowKbd1
                        anchors.verticalCenter: parent.verticalCenter
                        value: "Ctrl+P"
                        compact: "always"
                    }
                }

                Row {
                    width: parent.width
                    spacing: ThemeTokens.dp(8)
                    Text {
                        text: ChaSetI18n.tr("desktopComposite.kbd.exportProject", "Export Project as Archive")
                        width: parent.width - narrowKbd2.width - ThemeTokens.dp(12)
                        elide: Text.ElideRight
                        color: root.cFg
                        font.pixelSize: Typography.sizeSmall
                        font.family: Typography.familySans
                        anchors.verticalCenter: parent.verticalCenter
                    }
                    ChaSetShortcut {
                        id: narrowKbd2
                        anchors.verticalCenter: parent.verticalCenter
                        value: "Ctrl+Shift+E"
                        compact: "always"
                    }
                }
            }
        }

        // Responsive ShortcutBar Demonstration
        ChaSetCard {
            width: parent.width

            Column {
                width: parent.width - ThemeTokens.dp(24)
                anchors.horizontalCenter: parent.horizontalCenter
                topPadding: ThemeTokens.dp(12)
                bottomPadding: ThemeTokens.dp(12)
                spacing: ThemeTokens.dp(8)

                Item {
                    width: parent.width
                    height: Math.max(shortcutBarTitleText.implicitHeight, shortcutBarBadge.implicitHeight)

                    DocText {
                        id: shortcutBarTitleText
                        anchors.left: parent.left
                        anchors.verticalCenter: parent.verticalCenter
                        text: ChaSetI18n.tr("navigation.shortcut-bar", "Shortcut Bar")
                        font.pixelSize: Typography.sizeBody
                        font.weight: Typography.weightBold
                        color: root.cFg
                    }

                    ChaSetBadge {
                        id: shortcutBarBadge
                        anchors.right: parent.right
                        anchors.verticalCenter: parent.verticalCenter
                        variant: "outline"
                        text: ChaSetI18n.tr("desktopComposite.shortcutBar.modeAuto", "Auto (Responsive)")
                    }
                }

                DocText {
                    text: ChaSetI18n.tr("components.shortcutBar.description", "Interactive multi-stage responsive keyboard shortcut bar that progressively adapts from full text to compact symbols, overflow drawer, and keyboard icon.")
                    font.pixelSize: Typography.sizeCaption
                    color: root.cMutedFg
                    wrapMode: Text.WordWrap
                    width: parent.width
                }

                ChaSetShortcutBar {
                    width: parent.width
                    preset: "address-bar"
                    mode: "auto"
                }
            }
        }
    }


    // Section 7: Animations

    DocMarkdown {
        width: parent.width
        docId: "kbd"
        section: "animations"
    }

    DocMarkdown {
        width: parent.width
        docId: "kbd"
        section: "keyboard"
    }

    DocMarkdown {
        width: parent.width
        docId: "kbd"
        section: "props"
    }
}
