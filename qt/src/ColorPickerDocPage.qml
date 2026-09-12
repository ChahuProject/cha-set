// ColorPickerDocPage.qml — Documentation and interactive sandbox for ChaSetColorPicker
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Components"
    pageTitle: "ColorPicker"
    description: "An interactive color selection component featuring 4 selector panels (Square in HueRing, Circle Color Wheel, Triangle in HueRing, and Swatches), live hex input with copy button, and independent multi-channel sliders (RGB, HSV, CMYK, LAB)."
    tocItems: [
        { id: "overview", title: "Interactive Overview" },
        { id: "installation", title: "Installation" },
        { id: "anatomy", title: "Anatomy" },
        { id: "examples", title: "Examples & States" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "Props Reference" }
    ]

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
        title: "ColorPicker Sandbox"
        reactCode: `<ColorPicker\n  value="${root.demoColor}"\n  mode="${root.demoMode}"\n  size="${root.demoSize}"\n  disabled={${root.demoDisabled}}\n  movable={${root.demoMovable}}\n  showPreview={${root.demoShowPreview}}\n  showHex={${root.demoShowHex}}\n  showSwatches={${root.demoShowSwatches}}\n  onChange={setColor}\n/>`
        qtCode: `ChaSetColorPicker {\n    value: "${root.demoColor}"\n    mode: "${root.demoMode}"\n    size: "${root.demoSize}"\n    disabled: ${root.demoDisabled}\n    movable: ${root.demoMovable}\n    showPreview: ${root.demoShowPreview}\n    showHex: ${root.demoShowHex}\n    showSwatches: ${root.demoShowSwatches}\n    onHexChanged: function(newHex) {\n        // handle color change\n    }\n}`

        stageData: [
            Item {
                anchors.centerIn: parent
                width: 320
                height: root.demoMode === "popover" ? 100 : 540

                Column {
                    anchors.centerIn: parent
                    spacing: 12

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
                        Text {
                            text: "Selected:"
                            color: root.cMutedFg
                            font.pixelSize: 12
                        }
                        Rectangle {
                            width: 14; height: 14; radius: 3
                            color: root.demoColor
                            border.color: root.cBorder
                            border.width: 1
                            anchors.verticalCenter: parent.verticalCenter
                        }
                        Text {
                            text: root.demoColor
                            color: root.cFg
                            font.family: "monospace"
                            font.pixelSize: 12
                            font.weight: Font.DemiBold
                            anchors.verticalCenter: parent.verticalCenter
                        }
                    }
                }
            }
        ]

        controlsData: [
            Row {
                spacing: 16

                Row {
                    spacing: 8
                    Text {
                        text: "Mode:"
                        color: root.cMutedFg
                        font.pixelSize: 12
                        anchors.verticalCenter: parent.verticalCenter
                    }
                    ChaSetTabs {
                        anchors.verticalCenter: parent.verticalCenter
                        currentValue: root.demoMode
                        onCurrentValueChanged: root.demoMode = currentValue
                        ChaSetTabsList {
                            ChaSetTabsTrigger { value: "inline"; text: "Inline" }
                            ChaSetTabsTrigger { value: "popover"; text: "Popover" }
                        }
                    }
                }

                Row {
                    spacing: 8
                    Text {
                        text: "Size:"
                        color: root.cMutedFg
                        font.pixelSize: 12
                        anchors.verticalCenter: parent.verticalCenter
                    }
                    ChaSetTabs {
                        anchors.verticalCenter: parent.verticalCenter
                        currentValue: root.demoSize
                        onCurrentValueChanged: root.demoSize = currentValue
                        ChaSetTabsList {
                            ChaSetTabsTrigger { value: "default"; text: "Default" }
                            ChaSetTabsTrigger { value: "sm"; text: "SM" }
                        }
                    }
                }

                ChaSetCheckbox {
                    size: "sm"
                    label: "Disabled"
                    checked: root.demoDisabled
                    onToggled: (val) => root.demoDisabled = val
                    anchors.verticalCenter: parent.verticalCenter
                }

                ChaSetCheckbox {
                    size: "sm"
                    label: "Movable"
                    checked: root.demoMovable
                    onToggled: (val) => root.demoMovable = val
                    anchors.verticalCenter: parent.verticalCenter
                }

                ChaSetCheckbox {
                    size: "sm"
                    label: "Preview"
                    checked: root.demoShowPreview
                    onToggled: (val) => root.demoShowPreview = val
                    anchors.verticalCenter: parent.verticalCenter
                }

                ChaSetCheckbox {
                    size: "sm"
                    label: "HEX"
                    checked: root.demoShowHex
                    onToggled: (val) => root.demoShowHex = val
                    anchors.verticalCenter: parent.verticalCenter
                }

                ChaSetCheckbox {
                    size: "sm"
                    label: "Swatches"
                    checked: root.demoShowSwatches
                    onToggled: (val) => root.demoShowSwatches = val
                    anchors.verticalCenter: parent.verticalCenter
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

        Text {
            text: "Anatomy"
            color: root.cFg
            font.pixelSize: 18
            font.weight: Font.Bold
        }

        Text {
            text: "Import and render ChaSetColorPicker directly in your QML scene."
            color: root.cMutedFg
            font.pixelSize: 13
        }

        ChaSetCodeBlock {
            width: parent.width
            language: "qml"
            code: `import ChaSet\n\nChaSetColorPicker {\n    value: "#1d7ae0"\n    mode: "inline"\n    onHexChanged: function(newHex) {\n        console.log("Color selected:", newHex)\n    }\n}`
        }
    }

    // Section 4: Examples & States
    Column {
        width: parent.width
        spacing: 12

        Text {
            text: "Examples & States"
            color: root.cFg
            font.pixelSize: 18
            font.weight: Font.Bold
        }

        Text {
            text: "Visual matrix of color picker configurations, modes, and states in Qt Quick."
            color: root.cMutedFg
            font.pixelSize: 13
        }

        Grid {
            width: parent.width
            columns: 2
            spacing: 16

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
                    Text { text: "Popover Dropdown Mode"; color: root.cFg; font.pixelSize: 12; font.weight: Font.DemiBold }
                    Text { text: "Compact swatch trigger opening floating overlay"; color: root.cMutedFg; font.pixelSize: 11 }
                    ChaSetColorPicker {
                        mode: "popover"
                        value: "#ef4444"
                    }
                }
            }

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
                    Text { text: "Compact Size (sm)"; color: root.cFg; font.pixelSize: 12; font.weight: Font.DemiBold }
                    Text { text: "Smaller footprint suitable for toolbars and palettes"; color: root.cMutedFg; font.pixelSize: 11 }
                    ChaSetColorPicker {
                        mode: "popover"
                        size: "sm"
                        value: "#22c55e"
                    }
                }
            }

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
                    Text { text: "Disabled State"; color: root.cFg; font.pixelSize: 12; font.weight: Font.DemiBold }
                    Text { text: "Non-interactive with 50% opacity"; color: root.cMutedFg; font.pixelSize: 11 }
                    ChaSetColorPicker {
                        mode: "popover"
                        disabled: true
                        value: "#8b5cf6"
                    }
                }
            }

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
                    Text { text: "Custom Swatches Palette"; color: root.cFg; font.pixelSize: 12; font.weight: Font.DemiBold }
                    Text { text: "Configured with specialized palette colors"; color: root.cMutedFg; font.pixelSize: 11 }
                    ChaSetColorPicker {
                        mode: "popover"
                        value: "#f59e0b"
                        presetColors: ["#f59e0b", "#10b981", "#3b82f6", "#ec4899", "#6366f1"]
                    }
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

        
    KeyboardShortcutsTable {
        componentId: "color-picker"
    }

    PropsTable {
            width: parent.width
            propsModel: [
                {
                    name: "value",
                    type: "color",
                    default: "\"#1d7ae0\"",
                    description: "The selected color value."
                },
                {
                    name: "hex",
                    type: "string",
                    default: "\"#1D7AE0\"",
                    description: "The selected hex color string (e.g. #1D7AE0)."
                },
                {
                    name: "mode",
                    type: "\"inline\" | \"popover\"",
                    default: "\"inline\"",
                    description: "Display mode: inline panel card or popover swatch button."
                },
                {
                    name: "size",
                    type: "\"default\" | \"sm\"",
                    default: "\"default\"",
                    description: "Visual scale size for the picker and its controls."
                },
                {
                    name: "disabled",
                    type: "bool",
                    default: "false",
                    description: "Disables user interactions and applies muted opacity."
                },
                {
                    name: "movable",
                    type: "bool",
                    default: "false",
                    description: "Allows dragging blank background areas to reposition the component. Double-click resets offset."
                },
                {
                    name: "showPreview",
                    type: "bool",
                    default: "true",
                    description: "Whether to show the top preview header swatch and hex label."
                },
                {
                    name: "showHex",
                    type: "bool",
                    default: "true",
                    description: "Whether to display the editable HEX text input row."
                },
                {
                    name: "showSwatches",
                    type: "bool",
                    default: "true",
                    description: "Whether to display the quick preset color chips row."
                },
                {
                    name: "presetColors",
                    type: "var (string[])",
                    default: "16 default colors",
                    description: "Array of hex color strings displayed as preset swatches."
                },
                {
                    name: "activePanel",
                    type: "\"square\" | \"circle\" | \"triangle\" | \"swatches\"",
                    default: "\"square\"",
                    description: "Active color selector panel mode."
                },
                {
                    name: "showRgbSliders",
                    type: "bool",
                    default: "true",
                    description: "Whether RGB channel sliders and numeric inputs are visible."
                },
                {
                    name: "showHsvSliders",
                    type: "bool",
                    default: "false",
                    description: "Whether HSV channel sliders and numeric inputs are visible."
                },
                {
                    name: "showCmykSliders",
                    type: "bool",
                    default: "false",
                    description: "Whether CMYK channel sliders and numeric inputs are visible."
                },
                {
                    name: "showLabSliders",
                    type: "bool",
                    default: "false",
                    description: "Whether CIELAB channel sliders and numeric inputs are visible."
                }
            ]
        }
    }
}
