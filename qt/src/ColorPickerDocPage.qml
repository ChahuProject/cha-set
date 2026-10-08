// ColorPickerDocPage.qml — Documentation and interactive sandbox for ChaSetColorPicker
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Forms & Inputs"
    pageTitle: "ColorPicker"
    description: ChaSetI18n.tr("components.colorPicker.description", "An interactive color selection component featuring 4 selector panels (Square in HueRing, Circle Color Wheel, Triangle in HueRing, and Swatches), live hex input with copy button, and independent multi-channel sliders (RGB, HSV, CMYK, LAB).")

    property int customRadius: 8
    property color cFg: ThemeTokens.text
    property color cMutedFg: ThemeTokens.subduedText
    property color cCard: ThemeTokens.panel
    property color cBorder: ThemeTokens.border
    property color cPrimary: ThemeTokens.accent

    property string demoColor: "#1d7ae0"
    property string demoMode: "inline"
    property string demoSize: "default"
    property bool demoDisabled: false
    property bool demoMovable: false
    property bool demoShowPreview: true
    property bool demoShowHex: true
    property bool demoShowSwatches: true

    // Section 1: Overview
    ComponentPreview {
        id: heroPreview
        width: parent.width
        stageHeight: root.demoMode === "popover" ? 280 : 660
        title: ChaSetI18n.tr("desktopComposite.colorPicker.sandboxTitle", "ColorPicker Sandbox")
        reactCode: `<ColorPicker\n  value="${root.demoColor}"\n  mode="${root.demoMode}"\n  size="${root.demoSize}"\n  disabled={${root.demoDisabled}}\n  movable={${root.demoMovable}}\n  showPreview={${root.demoShowPreview}}\n  showHex={${root.demoShowHex}}\n  showSwatches={${root.demoShowSwatches}}\n  onChange={setColor}\n/>`
        qtCode: `ChaSetColorPicker {\n    value: "${root.demoColor}"\n    mode: "${root.demoMode}"\n    size: "${root.demoSize}"\n    disabled: ${root.demoDisabled}\n    movable: ${root.demoMovable}\n    showPreview: ${root.demoShowPreview}\n    showHex: ${root.demoShowHex}\n    showSwatches: ${root.demoShowSwatches}\n    onHexChanged: function(newHex) {\n        // handle color change\n    }\n}`

        stageData: [
            Item {
                anchors.centerIn: parent
                width: ThemeTokens.dp(320)
                height: root.demoMode === "popover" ? ThemeTokens.dp(100) : pickerCol.implicitHeight

                Column {
                    id: pickerCol
                    anchors.centerIn: parent
                    spacing: ThemeTokens.dp(12)

                    ChaSetColorPicker {
                        id: sandboxPicker
                        anchors.horizontalCenter: parent.horizontalCenter
                        value: root.demoColor
                        mode: root.demoMode
                        size: root.demoSize
                        disabled: root.demoDisabled
                        movable: root.demoMovable
                        showPreview: root.demoShowPreview
                        showHex: root.demoShowHex
                        showSwatches: root.demoShowSwatches
                        onHexChanged: {
                            root.demoColor = sandboxPicker.hex
                        }
                    }

                    Row {
                        anchors.horizontalCenter: parent.horizontalCenter
                        spacing: 8
                        DocText {
                            text: ChaSetI18n.tr("components.colorPicker.selectedColor", "Selected Color:")
                            color: root.cMutedFg
                            font.pixelSize: Typography.sizeSmall
                            anchors.verticalCenter: parent.verticalCenter
                        }
                        Rectangle {
                            width: ThemeTokens.dp(14); height: ThemeTokens.dp(14); radius: ThemeTokens.dp(3)
                            color: root.demoColor
                            border.color: root.cBorder
                            border.width: 1
                            anchors.verticalCenter: parent.verticalCenter
                        }
                        DocText {
                            text: root.demoColor
                            color: root.cFg
                            font.family: Typography.familyMono
                            font.pixelSize: Typography.sizeSmall
                            font.weight: Typography.weightSemibold
                            anchors.verticalCenter: parent.verticalCenter
                        }
                    }
                }
            }
        ]

        controlsData: [
            Row {
                spacing: 8
                DocText {
                    text: ChaSetI18n.tr("components.colorPicker.mode", "Mode:")
                    color: root.cMutedFg
                    font.pixelSize: Typography.sizeSmall
                    anchors.verticalCenter: parent.verticalCenter
                }
                ChaSetSegmentedControl {
                    anchors.verticalCenter: parent.verticalCenter
                    size: "sm"
                    value: root.demoMode
                    options: [
                        { label: ChaSetI18n.tr("components.colorPicker.modeInline", "Inline"), value: "inline" },
                        { label: ChaSetI18n.tr("components.colorPicker.modePopover", "Popover"), value: "popover" }
                    ]
                    onValueSelected: function(m) { root.demoMode = String(m); }
                }
            },

            Row {
                spacing: 8
                DocText {
                    text: ChaSetI18n.tr("components.colorPicker.size", "Size:")
                    color: root.cMutedFg
                    font.pixelSize: Typography.sizeSmall
                    anchors.verticalCenter: parent.verticalCenter
                }
                ChaSetSegmentedControl {
                    anchors.verticalCenter: parent.verticalCenter
                    size: "sm"
                    value: root.demoSize
                    options: [
                        { label: ChaSetI18n.tr("common.default", "Default"), value: "default" },
                        { label: ChaSetI18n.tr("components.colorPicker.sizeSm", "SM"), value: "sm" }
                    ]
                    onValueSelected: function(s) { root.demoSize = String(s); }
                }
            },

            ChaSetCheckbox {
                size: "sm"
                label: ChaSetI18n.tr("common.disabled", "Disabled")
                checked: root.demoDisabled
                onToggled: (val) => root.demoDisabled = val
            },

            ChaSetCheckbox {
                size: "sm"
                label: ChaSetI18n.tr("components.colorPicker.movable", "Movable")
                checked: root.demoMovable
                onToggled: (val) => root.demoMovable = val
            },

            ChaSetCheckbox {
                size: "sm"
                label: ChaSetI18n.tr("components.colorPicker.preview", "Preview")
                checked: root.demoShowPreview
                onToggled: (val) => root.demoShowPreview = val
            },

            ChaSetCheckbox {
                size: "sm"
                label: ChaSetI18n.tr("components.colorPicker.hexInput", "Hex Input")
                checked: root.demoShowHex
                onToggled: (val) => root.demoShowHex = val
            },

            ChaSetCheckbox {
                size: "sm"
                label: ChaSetI18n.tr("components.colorPicker.swatches", "Swatches")
                checked: root.demoShowSwatches
                onToggled: (val) => root.demoShowSwatches = val
            }
        ]
    }

    // Section 2: Anatomy
    DocAnatomy {
        width: parent.width
        qtCode: `import ChaSet\n\nChaSetColorPicker {\n    value: "#1d7ae0"\n    mode: "popover"\n    size: "default"\n    onColorChanged: accentColor = color\n}`
        reactCode: `import { ColorPicker } from '@chahu/cha-set';\n\n<ColorPicker\n  value={accentColor}\n  mode="popover"\n  onChange={setAccentColor}\n/>`
    }

    // Section 4: Examples & States
    Column {
        width: parent.width
        spacing: 12

        DocText {
            text: ChaSetI18n.tr("components.colorPicker.examplesTitle", "Examples & States")
            color: root.cFg
            font.pixelSize: Typography.sizeTitleSm
            font.weight: Typography.weightBold
        }

        DocText {
            text: ChaSetI18n.tr("components.colorPicker.examplesDesc", "Matrix of common color picker configurations, modes, and sizes.")
            color: root.cMutedFg
            font.pixelSize: Typography.sizeBody
        }

        Grid {
            width: parent.width
            columns: 2
            spacing: ThemeTokens.dp(16)

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
                    DocText { text: ChaSetI18n.tr("components.colorPicker.popoverTitle", "Popover Dropdown Mode"); color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    DocText { text: ChaSetI18n.tr("components.colorPicker.popoverDesc", "Compact trigger button showing current color and hex code with floating panel."); color: root.cMutedFg; font.pixelSize: Typography.sizeCaption }
                    ChaSetColorPicker {
                        mode: "popover"
                        value: "#ef4444"
                    }
                }
            }

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
                    DocText { text: ChaSetI18n.tr("components.colorPicker.compactTitle", "Compact Size (sm)"); color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    DocText { text: ChaSetI18n.tr("components.colorPicker.compactDesc", "Smaller dimensions and font size designed for tight sidebar panels."); color: root.cMutedFg; font.pixelSize: Typography.sizeCaption }
                    ChaSetColorPicker {
                        mode: "popover"
                        size: "sm"
                        value: "#22c55e"
                    }
                }
            }

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
                    DocText { text: ChaSetI18n.tr("components.colorPicker.disabledTitle", "Disabled State"); color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    DocText { text: ChaSetI18n.tr("components.colorPicker.disabledDesc", "Readonly display with 50% opacity and disabled pointer events."); color: root.cMutedFg; font.pixelSize: Typography.sizeCaption }
                    ChaSetColorPicker {
                        mode: "popover"
                        disabled: true
                        value: "#8b5cf6"
                    }
                }
            }

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
                    DocText { text: ChaSetI18n.tr("components.colorPicker.customPresetsTitle", "Custom Preset Swatches"); color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    DocText { text: ChaSetI18n.tr("components.colorPicker.customPresetsDesc", "Specific project palette supplied via the presetColors prop."); color: root.cMutedFg; font.pixelSize: Typography.sizeCaption }
                    ChaSetColorPicker {
                        mode: "popover"
                        value: "#f59e0b"
                        presetColors: ["#f59e0b", "#10b981", "#3b82f6", "#ec4899", "#6366f1"]
                    }
                }
            }
        }
    }

    // Section 4: Component Reference
    ComponentReference {
        name: "ColorPicker"
        componentId: "color-picker"
        propsModel: [
            {
                name: "value",
                type: "color",
                default: "\"#1d7ae0\"",
                description: ChaSetI18n.tr("components.colorPicker.valueColorDesc", "The selected color value.")
            },
            {
                name: "hex",
                type: "string",
                default: "\"#1D7AE0\"",
                description: ChaSetI18n.tr("components.colorPicker.hexDesc", "The selected hex color string (e.g. #1D7AE0).")
            },
            {
                name: "mode",
                type: "\"inline\" | \"popover\"",
                default: "\"inline\"",
                description: ChaSetI18n.tr("components.colorPicker.modeDesc", "Display mode: inline panel card or popover dropdown trigger.")
            },
            {
                name: "size",
                type: "\"default\" | \"sm\"",
                default: "\"default\"",
                description: ChaSetI18n.tr("components.colorPicker.sizeDesc", "Visual sizing scale for canvas, swatches, and inputs.")
            },
            {
                name: "disabled",
                type: "bool",
                default: "false",
                description: ChaSetI18n.tr("components.colorPicker.disabledPropDesc", "When true, prevents user interaction and applies muted opacity.")
            },
            {
                name: "movable",
                type: "bool",
                default: "false",
                description: ChaSetI18n.tr("components.colorPicker.movableDesc", "When true, allows dragging on empty background areas to reposition the component. Double-click resets position.")
            },
            {
                name: "showPreview",
                type: "bool",
                default: "true",
                description: ChaSetI18n.tr("components.colorPicker.showPreviewDesc", "Whether to show the top preview header swatch and hex label.")
            },
            {
                name: "showHex",
                type: "bool",
                default: "true",
                description: ChaSetI18n.tr("components.colorPicker.showHexDesc", "Whether to display the editable HEX text input row.")
            },
            {
                name: "showSwatches",
                type: "bool",
                default: "true",
                description: ChaSetI18n.tr("components.colorPicker.showSwatchesDesc", "Whether to show the quick preset color swatch row.")
            },
            {
                name: "presetColors",
                type: "var (string[])",
                default: "16 default colors",
                description: ChaSetI18n.tr("components.colorPicker.presetColorsDesc", "Array of preset hex color strings displayed in swatches panel.")
            },
            {
                name: "activePanel",
                type: "\"square\" | \"circle\" | \"triangle\" | \"swatches\"",
                default: "\"square\"",
                description: ChaSetI18n.tr("components.colorPicker.activePanelDesc", "Active color selector panel mode.")
            },
            {
                name: "showRgbSliders",
                type: "bool",
                default: "true",
                description: ChaSetI18n.tr("components.colorPicker.showRgbSlidersDesc", "Whether RGB channel sliders and numeric inputs are visible.")
            },
            {
                name: "showHsvSliders",
                type: "bool",
                default: "false",
                description: ChaSetI18n.tr("components.colorPicker.showHsvSlidersDesc", "Whether HSV channel sliders and numeric inputs are visible.")
            },
            {
                name: "showCmykSliders",
                type: "bool",
                default: "false",
                description: ChaSetI18n.tr("components.colorPicker.showCmykSlidersDesc", "Whether CMYK channel sliders and numeric inputs are visible.")
            },
            {
                name: "showLabSliders",
                type: "bool",
                default: "false",
                description: ChaSetI18n.tr("components.colorPicker.showLabSlidersDesc", "Whether CIELAB channel sliders and numeric inputs are visible.")
            }
        ]
    }
}
