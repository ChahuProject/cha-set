// ShortcutBarDocPage.qml — Living Documentation and Interactive Sandbox for ChaSetShortcutBar
import QtQuick
import QtQuick.Controls
import ChaSet

DocLayout {
    id: root
    category: "Base Primitives"
    pageTitle: "Shortcut Bar"
    description: ChaSetI18n.tr("components.shortcutBar.description", "Interactive multi-stage responsive keyboard shortcut bar that progressively adapts from full text to compact symbols, overflow drawer, and keyboard icon.")

    property color cFg: ThemeTokens.text
    property color cMutedFg: ThemeTokens.subduedText
    property color cCard: ThemeTokens.panel
    property color cBorder: ThemeTokens.border
    property color cPrimary: ThemeTokens.accent
    property color cAccentBg: ThemeTokens.hover

    property string demoShortcutMode: "auto"
    property string demoPreset: "address-bar"
    property string demoSize: "xs"
    property string demoVariant: "outline"
    property real playgroundWidth: 340

    // Section 1: Overview
    ComponentPreview {
        id: heroPreview
        width: parent.width
        title: ChaSetI18n.tr("desktopComposite.shortcutBar.sandboxTitle", "Shortcut Bar Sandbox")
        reactCode: `<ShortcutBar
  mode="${root.demoShortcutMode}"
  preset="${root.demoPreset}"
  size="${root.demoSize}"
  variant="${root.demoVariant}"
/>`
        qtCode: `ChaSetShortcutBar {
    mode: "${root.demoShortcutMode}"
    preset: "${root.demoPreset}"
    size: "${root.demoSize}"
    variant: "${root.demoVariant}"
}`

        controlsData: [
            Row {
                width: childrenRect.width
                spacing: ThemeTokens.dp(8)
                DocText {
                    text: ChaSetI18n.tr("desktopComposite.shortcutBar.modeLabel", "Mode:")
                    color: root.cMutedFg
                    font.pixelSize: Typography.sizeSmall
                    anchors.verticalCenter: parent.verticalCenter
                }
                ChaSetSegmentedControl {
                    anchors.verticalCenter: parent.verticalCenter
                    size: "sm"
                    value: root.demoShortcutMode
                    options: [
                        { label: ChaSetI18n.tr("desktopComposite.shortcutBar.modeAuto", "Auto (Responsive)"), value: "auto" },
                        { label: ChaSetI18n.tr("desktopComposite.shortcutBar.modeIcon", "Icon (Compact)"), value: "icon" }
                    ]
                    onValueSelected: function(m) { root.demoShortcutMode = String(m); }
                }
            },

            Row {
                width: childrenRect.width
                spacing: ThemeTokens.dp(8)
                DocText {
                    text: ChaSetI18n.tr("desktopComposite.shortcutBar.presetLabel", "Preset:")
                    color: root.cMutedFg
                    font.pixelSize: Typography.sizeSmall
                    anchors.verticalCenter: parent.verticalCenter
                }
                ChaSetSegmentedControl {
                    anchors.verticalCenter: parent.verticalCenter
                    size: "sm"
                    value: root.demoPreset
                    options: [
                        { label: ChaSetI18n.tr("components.shortcutBar.presetAddressBar", "Address Bar"), value: "address-bar" },
                        { label: ChaSetI18n.tr("components.shortcutBar.presetDialog", "Dialog"), value: "dialog" },
                        { label: ChaSetI18n.tr("components.shortcutBar.presetDropdown", "Dropdown"), value: "dropdown" },
                        { label: ChaSetI18n.tr("components.shortcutBar.presetFilterPopup", "Filter Popup"), value: "filter-popup" },
                        { label: ChaSetI18n.tr("components.shortcutBar.presetTree", "Tree View"), value: "tree" },
                        { label: ChaSetI18n.tr("components.shortcutBar.presetTable", "Data Table"), value: "table" }
                    ]
                    onValueSelected: function(p) { root.demoPreset = String(p); }
                }
            },

            Row {
                width: childrenRect.width
                spacing: ThemeTokens.dp(8)
                DocText {
                    text: ChaSetI18n.tr("common.size", "Size:")
                    color: root.cMutedFg
                    font.pixelSize: Typography.sizeSmall
                    anchors.verticalCenter: parent.verticalCenter
                }
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
                DocText {
                    text: ChaSetI18n.tr("common.variant", "Variant:")
                    color: root.cMutedFg
                    font.pixelSize: Typography.sizeSmall
                    anchors.verticalCenter: parent.verticalCenter
                }
                ChaSetSegmentedControl {
                    anchors.verticalCenter: parent.verticalCenter
                    size: "sm"
                    value: root.demoVariant
                    options: [
                        { label: ChaSetI18n.tr("desktopComposite.kbd.variantOutline", "Outline"), value: "outline" },
                        { label: ChaSetI18n.tr("desktopComposite.kbd.variantSolid", "Solid"), value: "solid" },
                        { label: ChaSetI18n.tr("desktopComposite.kbd.variantSubtle", "Subtle"), value: "subtle" }
                    ]
                    onValueSelected: function(v) { root.demoVariant = String(v); }
                }
            }
        ]

        stageData: [
            Column {
                anchors.centerIn: parent
                width: parent.width - ThemeTokens.dp(48)
                spacing: ThemeTokens.dp(16)

                // Controls: Slider & Quick Presets
                Row {
                    width: parent.width
                    spacing: ThemeTokens.dp(16)

                    Row {
                        spacing: ThemeTokens.dp(8)
                        anchors.verticalCenter: parent.verticalCenter

                        DocText {
                            text: ChaSetI18n.tr("desktopComposite.shortcutBar.widthLabel", "Container Width:")
                            font.pixelSize: Typography.sizeCaption
                            color: root.cMutedFg
                            anchors.verticalCenter: parent.verticalCenter
                        }

                        ChaSetSlider {
                            id: widthSlider
                            width: ThemeTokens.dp(160)
                            min: 60
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
                            text: ChaSetI18n.tr("desktopComposite.shortcutBar.presetsLabel", "Width Presets:")
                            font.pixelSize: Typography.sizeCaption
                            color: root.cMutedFg
                            anchors.verticalCenter: parent.verticalCenter
                        }

                        ChaSetButton {
                            size: "xs"
                            variant: Math.round(root.playgroundWidth) === 460 ? "secondary" : "outline"
                            text: ChaSetI18n.tr("desktopComposite.shortcutBar.presetFull", "Full ({{value}})", { value: "460" })
                            onClicked: root.playgroundWidth = 460
                        }

                        ChaSetButton {
                            size: "xs"
                            variant: Math.round(root.playgroundWidth) === 330 ? "secondary" : "outline"
                            text: ChaSetI18n.tr("desktopComposite.shortcutBar.presetSqueezed", "Squeezed ({{value}})", { value: "330" })
                            onClicked: root.playgroundWidth = 330
                        }

                        ChaSetButton {
                            size: "xs"
                            variant: Math.round(root.playgroundWidth) === 250 ? "secondary" : "outline"
                            text: ChaSetI18n.tr("desktopComposite.shortcutBar.presetCompact", "Compact ({{value}})", { value: "250" })
                            onClicked: root.playgroundWidth = 250
                        }

                        ChaSetButton {
                            size: "xs"
                            variant: Math.round(root.playgroundWidth) === 180 ? "secondary" : "outline"
                            text: ChaSetI18n.tr("desktopComposite.shortcutBar.presetFolded", "Folded ({{value}})", { value: "180" })
                            onClicked: root.playgroundWidth = 180
                        }

                        ChaSetButton {
                            size: "xs"
                            variant: Math.round(root.playgroundWidth) === 60 ? "secondary" : "outline"
                            text: ChaSetI18n.tr("desktopComposite.shortcutBar.presetIcon", "Icon ({{value}})", { value: "60" })
                            onClicked: root.playgroundWidth = 60
                        }
                    }
                }

                // Live Telemetry Badges
                Row {
                    spacing: ThemeTokens.dp(8)

                    ChaSetBadge {
                        variant: "outline"
                        text: ChaSetI18n.tr("desktopComposite.shortcutBar.widthBadge", "Width: {{value}}", { value: Math.round(root.playgroundWidth) })
                    }

                    ChaSetBadge {
                        variant: "outline"
                        text: {
                            if (root.demoShortcutMode === "icon" || root.playgroundWidth < 80) {
                                return ChaSetI18n.tr("desktopComposite.shortcutBar.stageIcon", "Stage 5: Keyboard Icon (Ultra Narrow)")
                            }
                            var s = playgroundShortcutBar.responsiveStage
                            if (s === "full") return ChaSetI18n.tr("desktopComposite.shortcutBar.stageFull", "Stage 1: Full (Text Labels)")
                            if (s === "squeezed") return ChaSetI18n.tr("desktopComposite.shortcutBar.stageSqueezed", "Stage 2: Squeezed (Scaled Text)")
                            if (s === "compact") return ChaSetI18n.tr("desktopComposite.shortcutBar.stageCompact", "Stage 3: Compact (Symbols)")
                            if (s === "folded") return ChaSetI18n.tr("desktopComposite.shortcutBar.stageFolded", "Stage 4: Folded (+N Drawer)")
                            return "Stage: " + s
                        }
                    }
                }

                // Resizable Container Frame
                Item {
                    width: parent.width
                    height: ThemeTokens.dp(36)

                    Rectangle {
                        id: playgroundFrame
                        anchors.horizontalCenter: parent.horizontalCenter
                        anchors.verticalCenter: parent.verticalCenter
                        clip: true
                        width: Math.max(ThemeTokens.dp(60), Math.min(ThemeTokens.dp(540), ThemeTokens.dp(root.playgroundWidth)))
                        height: ThemeTokens.dp(32)
                        radius: ThemeTokens.dp(6)
                        color: ThemeTokens.background
                        border.color: ThemeTokens.border
                        border.width: ThemeTokens.dp(1)

                        ChaSetShortcutBar {
                            id: playgroundShortcutBar
                            mode: root.demoShortcutMode
                            preset: root.demoPreset
                            size: root.demoSize
                            variant: root.demoVariant
                            anchors.left: parent.left
                            anchors.right: playgroundResizeGrip.left
                            anchors.verticalCenter: parent.verticalCenter
                            additionalShortcuts: root.demoPreset === "address-bar" ? [
                                { "id": "tab", "keys": ["Tab"], "label": ChaSetI18n.tr("desktopComposite.shortcutBar.completeLabel", "Autocomplete"), "priority": 2 },
                                { "id": "copy", "keys": ["Ctrl", "C"], "label": ChaSetI18n.tr("desktopComposite.shortcutBar.copyPathLabel", "Copy Path"), "priority": 4 }
                            ] : []
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
                                        var nw = Math.max(60, Math.min(540, Math.round(startW + delta)))
                                        root.playgroundWidth = nw
                                    }
                                }
                            }
                        }
                    }
                }
            }
        ]
    }

    // Section 2: Anatomy
    DocAnatomy {
        sectionId: "anatomy"
        reactCode: `import { ShortcutBar } from '@chahu/cha-set';\n\n<ShortcutBar preset="address-bar" mode="auto" />`
        qtCode: `import ChaSet\n\nChaSetShortcutBar {\n    preset: "address-bar"\n    mode: "auto"\n}`
    }

    // Section 3: Animations
    DocMarkdown {
        width: parent.width
        docId: "shortcut-bar"
        section: "animations"
    }

    // Section 4: Keyboard Navigation
    DocMarkdown {
        width: parent.width
        docId: "shortcut-bar"
        section: "keyboard"
    }

    // Section 5: Props Reference
    DocMarkdown {
        width: parent.width
        docId: "shortcut-bar"
        section: "props"
    }
}
