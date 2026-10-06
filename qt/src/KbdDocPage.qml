// KbdDocPage.qml — Living Documentation and Interactive Sandbox for ChaSetKbd & ChaSetShortcut
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Base Primitives"
    pageTitle: "Kbd"
    description: "Displays keyboard shortcuts, key combinations, and keycap badges with smart compact truncation."

    property color cFg: ThemeTokens.text
    property color cMutedFg: ThemeTokens.subduedText
    property color cCard: ThemeTokens.panel
    property color cBorder: ThemeTokens.border
    property color cPrimary: ThemeTokens.accent
    property color cAccentBg: ThemeTokens.hover

    property string demoVariant: "outline"
    property string demoSize: "default"
    property string demoCompact: "auto"
    property real playgroundWidth: 340

    // Section 1: Overview
    ComponentPreview {
        id: heroPreview
        width: parent.width
        title: "Kbd Sandbox"
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
                DocText { text: "Variant:"; color: root.cMutedFg; font.pixelSize: Typography.sizeSmall; anchors.verticalCenter: parent.verticalCenter }
                ChaSetSegmentedControl {
                    anchors.verticalCenter: parent.verticalCenter
                    size: "sm"
                    value: root.demoVariant
                    options: [
                        { label: "Outline", value: "outline" },
                        { label: "Solid", value: "solid" },
                        { label: "Subtle", value: "subtle" },
                        { label: "Inverted", value: "inverted" }
                    ]
                    onValueSelected: function(v) { root.demoVariant = String(v); }
                }
            },

            Row {
                width: childrenRect.width
                spacing: ThemeTokens.dp(8)
                DocText { text: "Size:"; color: root.cMutedFg; font.pixelSize: Typography.sizeSmall; anchors.verticalCenter: parent.verticalCenter }
                ChaSetSegmentedControl {
                    anchors.verticalCenter: parent.verticalCenter
                    size: "sm"
                    value: root.demoSize
                    options: [
                        { label: "Extra Small (xs)", value: "xs" },
                        { label: "Small (sm)", value: "sm" },
                        { label: "Default", value: "default" }
                    ]
                    onValueSelected: function(s) { root.demoSize = String(s); }
                }
            },

            Row {
                width: childrenRect.width
                spacing: ThemeTokens.dp(8)
                DocText { text: "Compact:"; color: root.cMutedFg; font.pixelSize: Typography.sizeSmall; anchors.verticalCenter: parent.verticalCenter }
                ChaSetSegmentedControl {
                    anchors.verticalCenter: parent.verticalCenter
                    size: "sm"
                    value: root.demoCompact
                    options: [
                        { label: "Auto", value: "auto" },
                        { label: "Always", value: "always" },
                        { label: "Never", value: "never" }
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
        property string sectionTitle: "Variants"

        DocText { text: "Variants"; font.pixelSize: Typography.sizeTitleSm; font.weight: Typography.weightBold; color: root.cFg }
        DocText { text: "Four distinct visual styles designed for menus, search fields, dialogs, and inverted tooltips."; color: root.cMutedFg; font.pixelSize: Typography.sizeBody }

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
                    DocText { text: "Outline (Default)"; color: root.cMutedFg; font.pixelSize: Typography.sizeCaption; anchors.horizontalCenter: parent.horizontalCenter }
                    ChaSetKbd { variant: "outline"; shortcut: "Ctrl+K"; compact: "never"; anchors.horizontalCenter: parent.horizontalCenter }
                }

                Column {
                    spacing: ThemeTokens.dp(8)
                    anchors.verticalCenter: parent.verticalCenter
                    DocText { text: "Solid"; color: root.cMutedFg; font.pixelSize: Typography.sizeCaption; anchors.horizontalCenter: parent.horizontalCenter }
                    ChaSetKbd { variant: "solid"; shortcut: "Ctrl+K"; compact: "never"; anchors.horizontalCenter: parent.horizontalCenter }
                }

                Column {
                    spacing: ThemeTokens.dp(8)
                    anchors.verticalCenter: parent.verticalCenter
                    DocText { text: "Subtle"; color: root.cMutedFg; font.pixelSize: Typography.sizeCaption; anchors.horizontalCenter: parent.horizontalCenter }
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
                        DocText { text: "Inverted (Tooltip)"; color: ThemeTokens.dark ? "#020817" : "#f8fafc"; font.pixelSize: Typography.sizeCaption; anchors.horizontalCenter: parent.horizontalCenter }
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
        property string sectionTitle: "Key Combinations & Symbols"

        DocText { text: "Key Combinations & Symbols"; font.pixelSize: Typography.sizeTitleSm; font.weight: Typography.weightBold; color: root.cFg }
        DocText { text: "Support for multi-key combinations, alternative choices, and compact modifier symbols."; color: root.cMutedFg; font.pixelSize: Typography.sizeBody }

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
                        text: "Compact Modifier Symbols:"
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
                        text: "Alternative Key Choices:"
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
                        text: "Multi-Modifier Sequence:"
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
        property string sectionTitle: "Menu Trailing Shortcuts"

        DocText { text: "Menu Trailing Shortcuts"; font.pixelSize: Typography.sizeTitleSm; font.weight: Typography.weightBold; color: root.cFg }
        DocText { text: "Dedicated Shortcut component with built-in right-alignment and non-shrinking behavior for menu items."; color: root.cMutedFg; font.pixelSize: Typography.sizeBody }

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
                        text: "New File"
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
                        text: "Save Document"
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
                        text: "Command Palette"
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
        property string sectionTitle: "Narrow Container Adaptation"

        DocText { text: "Narrow Container Adaptation"; font.pixelSize: Typography.sizeTitleSm; font.weight: Typography.weightBold; color: root.cFg }
        DocText { text: "When the parent container is squeezed, the label is truncated while the shortcut stays intact or compresses into symbols."; color: root.cMutedFg; font.pixelSize: Typography.sizeBody }

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
                        text: "Very Long Action Name That Truncates"
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
                        text: "Export Project as Archive"
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

        ChaSetCard {
            width: parent.width

            Column {
                width: parent.width - ThemeTokens.dp(24)
                anchors.horizontalCenter: parent.horizontalCenter
                topPadding: ThemeTokens.dp(14)
                bottomPadding: ThemeTokens.dp(14)
                spacing: ThemeTokens.dp(12)

                DocText {
                    text: "Interactive Multi-Stage Responsive Playground"
                    font.pixelSize: Typography.sizeBody
                    font.weight: Typography.weightBold
                    color: root.cFg
                }

                DocText {
                    text: "Drag the right handle or adjust the slider to observe how the shortcut bar progresses through 4 adaptive stages: Full scale → Squeezed micro-scale → Compact symbols → +N folded badge with floating popover."
                    font.pixelSize: Typography.sizeCaption
                    color: root.cMutedFg
                    wrapMode: Text.WordWrap
                    width: parent.width
                }

                // Controls: Slider & Quick Presets
                Row {
                    width: parent.width
                    spacing: ThemeTokens.dp(16)

                    Row {
                        spacing: ThemeTokens.dp(8)
                        anchors.verticalCenter: parent.verticalCenter

                        DocText {
                            text: "Width:"
                            font.pixelSize: Typography.sizeCaption
                            color: root.cMutedFg
                            anchors.verticalCenter: parent.verticalCenter
                        }

                        ChaSetSlider {
                            id: widthSlider
                            width: ThemeTokens.dp(160)
                            min: 160
                            max: 540
                            step: 1
                            value: root.playgroundWidth
                            onValueMoved: function(val) {
                                root.playgroundWidth = Math.round(val)
                            }
                            anchors.verticalCenter: parent.verticalCenter
                        }

                        Binding {
                            target: widthSlider
                            property: "value"
                            value: root.playgroundWidth
                        }
                    }

                    Row {
                        spacing: ThemeTokens.dp(6)
                        anchors.verticalCenter: parent.verticalCenter

                        DocText {
                            text: "Presets:"
                            font.pixelSize: Typography.sizeCaption
                            color: root.cMutedFg
                            anchors.verticalCenter: parent.verticalCenter
                        }

                        ChaSetButton {
                            size: "xs"
                            variant: Math.round(root.playgroundWidth) === 460 ? "secondary" : "outline"
                            text: "Full (460)"
                            onClicked: root.playgroundWidth = 460
                        }

                        ChaSetButton {
                            size: "xs"
                            variant: Math.round(root.playgroundWidth) === 330 ? "secondary" : "outline"
                            text: "Squeezed (330)"
                            onClicked: root.playgroundWidth = 330
                        }

                        ChaSetButton {
                            size: "xs"
                            variant: Math.round(root.playgroundWidth) === 250 ? "secondary" : "outline"
                            text: "Compact (250)"
                            onClicked: root.playgroundWidth = 250
                        }

                        ChaSetButton {
                            size: "xs"
                            variant: Math.round(root.playgroundWidth) === 180 ? "secondary" : "outline"
                            text: "Folded (180)"
                            onClicked: root.playgroundWidth = 180
                        }
                    }
                }

                // Live Telemetry Badges
                Row {
                    spacing: ThemeTokens.dp(8)

                    ChaSetBadge {
                        variant: "outline"
                        text: "Width: " + Math.round(root.playgroundWidth)
                    }

                    ChaSetBadge {
                        variant: "outline"
                        text: {
                            var s = playgroundShortcutBar.responsiveStage
                            if (s === "full") return "Stage 1: Full (完整文字)"
                            if (s === "squeezed") return "Stage 2: Squeezed (等比微缩)"
                            if (s === "compact") return "Stage 3: Compact (图标符号)"
                            if (s === "folded") return "Stage 4: Folded (+N 折叠)"
                            return "Stage: " + s
                        }
                    }
                }

                // Resizable Container Frame
                Rectangle {
                    id: playgroundFrame
                    clip: true
                    width: Math.max(ThemeTokens.dp(160), Math.min(ThemeTokens.dp(540), ThemeTokens.dp(root.playgroundWidth)))
                    height: ThemeTokens.dp(32)
                    radius: ThemeTokens.dp(6)
                    color: ThemeTokens.background
                    border.color: ThemeTokens.border
                    border.width: ThemeTokens.dp(1)

                    ChaSetShortcutBar {
                        id: playgroundShortcutBar
                        anchors.left: parent.left
                        anchors.right: playgroundResizeGrip.left
                        anchors.verticalCenter: parent.verticalCenter
                        preset: "address-bar"
                        additionalShortcuts: [
                            { "id": "tab", "keys": ["Tab"], "label": qsTr("补全"), "priority": 2 },
                            { "id": "copy", "keys": ["Ctrl", "C"], "label": qsTr("复制路径"), "priority": 4 }
                        ]
                    }

                    Rectangle {
                        id: playgroundResizeGrip
                        width: ThemeTokens.dp(14)
                        anchors.right: parent.right
                        anchors.top: parent.top
                        anchors.bottom: parent.bottom
                        color: gripMouse.containsMouse || gripMouse.pressed ? ThemeTokens.hover : "transparent"

                        Column {
                            anchors.centerIn: parent
                            spacing: ThemeTokens.dp(2)
                            Rectangle { width: ThemeTokens.dp(3); height: ThemeTokens.dp(3); radius: ThemeTokens.dp(1.5); color: ThemeTokens.subduedText }
                            Rectangle { width: ThemeTokens.dp(3); height: ThemeTokens.dp(3); radius: ThemeTokens.dp(1.5); color: ThemeTokens.subduedText }
                            Rectangle { width: ThemeTokens.dp(3); height: ThemeTokens.dp(3); radius: ThemeTokens.dp(1.5); color: ThemeTokens.subduedText }
                        }

                        MouseArea {
                            id: gripMouse
                            anchors.fill: parent
                            hoverEnabled: true
                            cursorShape: Qt.SizeHorCursor
                            property real startGlobalX: 0
                            property real startW: 0

                            onPressed: function(mouse) {
                                var pt = mapToGlobal(mouse.x, mouse.y)
                                startGlobalX = pt.x
                                startW = root.playgroundWidth
                            }

                            onPositionChanged: function(mouse) {
                                if (pressed) {
                                    var pt = mapToGlobal(mouse.x, mouse.y)
                                    var scale = (ThemeTokens.uiScale > 0) ? ThemeTokens.uiScale : 1.0
                                    var delta = (pt.x - startGlobalX) / scale
                                    var nw = Math.max(160, Math.min(540, Math.round(startW + delta)))
                                    root.playgroundWidth = nw
                                }
                            }
                        }
                    }
                }
            }
        }
    }


    // Section 7: Animations
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
            text: "Interactive state changes (hover and active) animate over duration-quick with standard easing curves. Durations and easing resolve from theme tokens; prefers-reduced-motion zeroes them automatically (governed by ThemeTokens.animationsEnabled)."
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }
    }

    // Section 8: Component Reference
    ComponentReference {
        name: "Kbd"
        componentId: "kbd"
        propsModel: [
            { name: "variant", type: "'outline' | 'solid' | 'subtle' | 'inverted'", defaultValue: "'outline'", desc: "Visual presentation variant matching container surfaces." },
            { name: "size", type: "'xs' | 'sm' | 'default' | 'md'", defaultValue: "'default'", desc: "Size scale controlling keycap height, padding, and font size." },
            { name: "compact", type: "'auto' | 'always' | 'never'", defaultValue: "'auto'", desc: "Whether to convert verbose modifiers to compact symbols (Ctrl to ⌃)." },
            { name: "overflow", type: "'collapse' | 'hide' | 'visible'", defaultValue: "'collapse'", desc: "Overflow strategy when space is constrained in narrow containers." },
            { name: "shortcut", type: "string", defaultValue: "''", desc: "Serialized shortcut combination string to parse automatically." },
            { name: "separator", type: "string", defaultValue: "'+'", desc: "Custom separator character between combination keys." },
            { name: "text", type: "string", defaultValue: "''", desc: "Direct single key text to display." }
        ]
    }
}
