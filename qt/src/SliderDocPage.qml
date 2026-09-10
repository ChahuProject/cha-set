// SliderDocPage.qml — Documentation and interactive sandbox for ChaSetSlider
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Components"
    pageTitle: "Slider"
    description: "An interactive control that allows the user to select a numeric value along a track."
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

    property real demoValue: 50
    property real demoStep: 1
    property string demoSize: "default"
    property string demoOrientation: "horizontal"
    property bool demoDisabled: false
    property bool demoReadOnly: false
    property bool demoShowTooltip: true
    property bool demoShowTicks: false

    // Section 1: Overview
    ComponentPreview {
        id: heroPreview
        width: parent.width
        title: "Slider Sandbox"
        reactCode: `<div className="w-full max-w-xs flex flex-col gap-2">\n  <div className="flex justify-between text-xs text-muted-foreground">\n    <span>Value</span>\n    <span className="font-mono font-medium text-foreground">${root.demoValue}</span>\n  </div>\n  <Slider\n    value={${root.demoValue}}\n    min={0}\n    max={100}\n    step={${root.demoStep}}\n    size="${root.demoSize}"\n    disabled={${root.demoDisabled}}\n    readOnly={${root.demoReadOnly}}\n    showTooltip={${root.demoShowTooltip}}\n    showTicks={${root.demoShowTicks}}\n    orientation="${root.demoOrientation}"\n    onValueChange={setValue}\n  />\n</div>`
        qtCode: `ChaSetSlider {\n    width: 240\n    value: ${root.demoValue}\n    min: 0\n    max: 100\n    step: ${root.demoStep}\n    size: "${root.demoSize}"\n    disabled: ${root.demoDisabled}\n    readOnly: ${root.demoReadOnly}\n    showTooltip: ${root.demoShowTooltip}\n    showTicks: ${root.demoShowTicks}\n    orientation: "${root.demoOrientation}"\n    onValueMoved: function(val) {\n        // handle slider value update\n    }\n}`

        stageData: [
            Item {
                anchors.centerIn: parent
                width: root.demoOrientation === "horizontal" ? 260 : 60
                height: root.demoOrientation === "horizontal" ? 70 : 200

                Column {
                    anchors.centerIn: parent
                    spacing: 10
                    width: root.demoOrientation === "horizontal" ? 240 : undefined

                    Row {
                        visible: root.demoOrientation === "horizontal"
                        width: parent.width
                        Text {
                            text: "Value:"
                            color: root.cMutedFg
                            font.pixelSize: 12
                        }
                        Item { width: Math.max(0, parent.width - 80); height: 1 }
                        Text {
                            text: root.demoValue.toString()
                            color: root.cFg
                            font.pixelSize: 12
                            font.weight: Font.DemiBold
                        }
                    }

                    ChaSetSlider {
                        id: sandboxSlider
                        width: root.demoOrientation === "horizontal" ? 240 : 20
                        height: root.demoOrientation === "horizontal" ? 20 : 160
                        value: root.demoValue
                        min: 0
                        max: 100
                        step: root.demoStep
                        size: root.demoSize
                        orientation: root.demoOrientation
                        disabled: root.demoDisabled
                        readOnly: root.demoReadOnly
                        showTooltip: root.demoShowTooltip
                        showTicks: root.demoShowTicks
                        onValueMoved: function(val) {
                            root.demoValue = val
                        }
                    }
                }
            }
        ]

        controlsData: [
            Flow {
                width: parent.width
                spacing: 16

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
                            ChaSetTabsTrigger { value: "sm"; text: "Small (sm)" }
                        }
                    }
                }

                Row {
                    spacing: 8
                    Text {
                        text: "Step:"
                        color: root.cMutedFg
                        font.pixelSize: 12
                        anchors.verticalCenter: parent.verticalCenter
                    }
                    ChaSetTabs {
                        anchors.verticalCenter: parent.verticalCenter
                        currentValue: root.demoStep.toString()
                        onCurrentValueChanged: root.demoStep = parseFloat(currentValue)
                        ChaSetTabsList {
                            ChaSetTabsTrigger { value: "1"; text: "1" }
                            ChaSetTabsTrigger { value: "5"; text: "5" }
                            ChaSetTabsTrigger { value: "10"; text: "10" }
                            ChaSetTabsTrigger { value: "25"; text: "25" }
                        }
                    }
                }

                Row {
                    spacing: 8
                    Text {
                        text: "Orientation:"
                        color: root.cMutedFg
                        font.pixelSize: 12
                        anchors.verticalCenter: parent.verticalCenter
                    }
                    ChaSetTabs {
                        anchors.verticalCenter: parent.verticalCenter
                        currentValue: root.demoOrientation
                        onCurrentValueChanged: root.demoOrientation = currentValue
                        ChaSetTabsList {
                            ChaSetTabsTrigger { value: "horizontal"; text: "H" }
                            ChaSetTabsTrigger { value: "vertical"; text: "V" }
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
                    label: "Read-Only"
                    checked: root.demoReadOnly
                    onToggled: (val) => root.demoReadOnly = val
                    anchors.verticalCenter: parent.verticalCenter
                }

                ChaSetCheckbox {
                    size: "sm"
                    label: "Tooltip"
                    checked: root.demoShowTooltip
                    onToggled: (val) => root.demoShowTooltip = val
                    anchors.verticalCenter: parent.verticalCenter
                }

                ChaSetCheckbox {
                    size: "sm"
                    label: "Ticks"
                    checked: root.demoShowTicks
                    onToggled: (val) => root.demoShowTicks = val
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

        CodeBlock {
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
            text: "Import and render ChaSetSlider directly in your QML scene."
            color: root.cMutedFg
            font.pixelSize: 13
        }

        CodeBlock {
            width: parent.width
            language: "qml"
            code: `import ChaSet\n\nChaSetSlider {\n    width: 240\n    value: 50\n    min: 0\n    max: 100\n    step: 1\n    showTooltip: true\n    formatValue: function(v) {\n        return v + "%"\n    }\n    onValueMoved: function(val) {\n        console.log("Slider moved:", val)\n    }\n}`
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
            text: "Visual matrix of common slider configurations, size scales, tooltips, and interactive states in Qt Quick."
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
                    Text { text: "Floating Value Tooltip"; color: root.cFg; font.pixelSize: 12; font.weight: Font.DemiBold }
                    Text { text: "Interactive formatted indicator on thumb drag and hover"; color: root.cMutedFg; font.pixelSize: 11 }
                    Item { width: parent.width; height: 6 }
                    ChaSetSlider {
                        width: parent.width
                        value: 75
                        min: 0
                        max: 100
                        step: 1
                        showTooltip: true
                        formatValue: function(v) { return v + "%"; }
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
                    Text { text: "Reduced track thickness and thumb size for toolbars"; color: root.cMutedFg; font.pixelSize: 11 }
                    Item { width: parent.width; height: 6 }
                    ChaSetSlider {
                        width: parent.width
                        size: "sm"
                        value: 40
                        min: 0
                        max: 100
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
                    Text { text: "Read-Only State"; color: root.cFg; font.pixelSize: 12; font.weight: Font.DemiBold }
                    Text { text: "Locked value without dimmed 50% opacity"; color: root.cMutedFg; font.pixelSize: 11 }
                    Item { width: parent.width; height: 6 }
                    ChaSetSlider {
                        width: parent.width
                        readOnly: true
                        value: 60
                        min: 0
                        max: 100
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
                    Text { text: "Discrete Stops with Ticks"; color: root.cFg; font.pixelSize: 12; font.weight: Font.DemiBold }
                    Text { text: "Quantized stops with tick indicators and label marks"; color: root.cMutedFg; font.pixelSize: 11 }
                    Item { width: parent.width; height: 6 }
                    ChaSetSlider {
                        width: parent.width
                        value: 50
                        min: 0
                        max: 100
                        step: 25
                        showTicks: true
                        marks: ["0%", "25%", "50%", "75%", "100%"]
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
                    Text { text: "Non-interactive with dimmed opacity for disabled controls"; color: root.cMutedFg; font.pixelSize: 11 }
                    Item { width: parent.width; height: 6 }
                    ChaSetSlider {
                        width: parent.width
                        disabled: true
                        value: 45
                        min: 0
                        max: 100
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
                    Text { text: "Custom Range (20 to 80)"; color: root.cFg; font.pixelSize: 12; font.weight: Font.DemiBold }
                    Text { text: "Bounded custom minimum and maximum limits with step=5"; color: root.cMutedFg; font.pixelSize: 11 }
                    Item { width: parent.width; height: 6 }
                    ChaSetSlider {
                        width: parent.width
                        value: 50
                        min: 20
                        max: 80
                        step: 5
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
            text: "Keyboard Navigation"
            color: root.cFg
            font.pixelSize: 18
            font.weight: Font.Bold
        }

        KeyboardShortcutsTable {
            componentId: "slider"
        }

        Item { width: parent.width; height: 12 }

        Text {
            text: "Props Reference"
            color: root.cFg
            font.pixelSize: 18
            font.weight: Font.Bold
        }

        PropsTable {
            width: parent.width
            propsModel: [
                {
                    name: "value",
                    type: "real",
                    default: "0",
                    description: "The numeric value of the slider."
                },
                {
                    name: "min",
                    type: "real",
                    default: "0",
                    description: "The minimum allowable value."
                },
                {
                    name: "max",
                    type: "real",
                    default: "100",
                    description: "The maximum allowable value."
                },
                {
                    name: "step",
                    type: "real",
                    default: "1",
                    description: "The stepping granularity interval."
                },
                {
                    name: "size",
                    type: "\"default\" | \"sm\"",
                    default: "\"default\"",
                    description: "The size scale of the slider track and thumb."
                },
                {
                    name: "disabled",
                    type: "bool",
                    default: "false",
                    description: "Disables user interactions and applies muted opacity."
                },
                {
                    name: "readOnly",
                    type: "bool",
                    default: "false",
                    description: "Locks value changes while keeping active full visual contrast."
                },
                {
                    name: "showTooltip",
                    type: "bool",
                    default: "false",
                    description: "Displays a floating value indicator tooltip badge on hover or active dragging."
                },
                {
                    name: "formatValue",
                    type: "var",
                    default: "null",
                    description: "Optional formatting function for the floating tooltip text."
                },
                {
                    name: "showTicks",
                    type: "bool",
                    default: "false",
                    description: "Renders tick marks at step intervals along the track."
                },
                {
                    name: "marks",
                    type: "var",
                    default: "[]",
                    description: "Optional array of text mark labels rendered along the track."
                },
                {
                    name: "orientation",
                    type: "\"horizontal\" | \"vertical\"",
                    default: "\"horizontal\"",
                    description: "Orientation of the slider track."
                },
                {
                    name: "forceHover",
                    type: "bool",
                    default: "false",
                    description: "Visual testing aid to force hover state."
                },
                {
                    name: "forceFocus",
                    type: "bool",
                    default: "false",
                    description: "Visual testing aid to force focus ring."
                }
            ]
        }
    }
}
