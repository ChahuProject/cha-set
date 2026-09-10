// SwitchDocPage.qml — Documentation and interactive sandbox for ChaSetSwitch
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Components"
    pageTitle: "Switch"
    description: "A control that allows the user to toggle between checked and not checked states."
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

    property string demoSize: "default"
    property bool demoChecked: true
    property bool demoDisabled: false
    property bool demoReadOnly: false
    property bool demoLoading: false
    property string demoDescription: ""

    // Section 1: Overview
    ComponentPreview {
        id: heroPreview
        width: parent.width
        title: "Switch Sandbox"
        reactCode: `<Switch\n  size="${root.demoSize}"\n  checked={${root.demoChecked}}\n  disabled={${root.demoDisabled}}\n  readOnly={${root.demoReadOnly}}\n  loading={${root.demoLoading}}\n  label="Airplane Mode"${root.demoDescription ? `\n  description="${root.demoDescription}"` : ""}\n  onCheckedChange={setChecked}\n/>`
        qtCode: `ChaSetSwitch {\n    size: "${root.demoSize}"\n    checked: ${root.demoChecked}\n    disabled: ${root.demoDisabled}\n    readOnly: ${root.demoReadOnly}\n    loading: ${root.demoLoading}\n    label: "Airplane Mode"${root.demoDescription ? `\n    description: "${root.demoDescription}"` : ""}\n    onToggled: function(checked) {\n        // handle toggle\n    }\n}`

        stageData: [
            Item {
                anchors.centerIn: parent
                width: sandboxSwitch.implicitWidth
                height: sandboxSwitch.implicitHeight

                ChaSetSwitch {
                    id: sandboxSwitch
                    size: root.demoSize
                    checked: root.demoChecked
                    disabled: root.demoDisabled
                    readOnly: root.demoReadOnly
                    loading: root.demoLoading
                    label: "Airplane Mode"
                    description: root.demoDescription
                    onToggled: function(val) {
                        root.demoChecked = val
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

                ChaSetCheckbox {
                    size: "sm"
                    label: "Checked"
                    checked: root.demoChecked
                    onToggled: (val) => root.demoChecked = val
                    anchors.verticalCenter: parent.verticalCenter
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
                    label: "Loading"
                    checked: root.demoLoading
                    onToggled: (val) => root.demoLoading = val
                    anchors.verticalCenter: parent.verticalCenter
                }

                ChaSetCheckbox {
                    size: "sm"
                    label: "Description"
                    checked: root.demoDescription.length > 0
                    onToggled: (val) => root.demoDescription = val ? "Disables all wireless connections including Wi-Fi and Bluetooth" : ""
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
            text: "Import and render ChaSetSwitch directly in your QML scene."
            color: root.cMutedFg
            font.pixelSize: 13
        }

        CodeBlock {
            width: parent.width
            language: "qml"
            code: `import ChaSet\n\nChaSetSwitch {\n    checked: false\n    label: "Enable notifications"\n    onToggled: function(checked) {\n        console.log("Switch state:", checked)\n    }\n}`
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
            text: "Visual matrix of common switch configurations and interactive states in Qt Quick."
            color: root.cMutedFg
            font.pixelSize: 13
        }

        Grid {
            width: parent.width
            columns: 2
            spacing: 16

            Rectangle {
                width: (parent.width - 16) / 2
                height: 100
                radius: 8
                color: root.cCard
                border.color: root.cBorder

                Column {
                    anchors.fill: parent
                    anchors.margins: 14
                    spacing: 8
                    Text { text: "Default Toggle"; color: root.cFg; font.pixelSize: 12; font.weight: Font.DemiBold }
                    Row {
                        spacing: 20
                        ChaSetSwitch { checked: false; label: "Off" }
                        ChaSetSwitch { checked: true; label: "On" }
                    }
                }
            }

            Rectangle {
                width: (parent.width - 16) / 2
                height: 100
                radius: 8
                color: root.cCard
                border.color: root.cBorder

                Column {
                    anchors.fill: parent
                    anchors.margins: 14
                    spacing: 8
                    Text { text: "Small Size (sm)"; color: root.cFg; font.pixelSize: 12; font.weight: Font.DemiBold }
                    Row {
                        spacing: 20
                        ChaSetSwitch { size: "sm"; checked: false; label: "Compact Off" }
                        ChaSetSwitch { size: "sm"; checked: true; label: "Compact On" }
                    }
                }
            }

            Rectangle {
                width: (parent.width - 16) / 2
                height: 100
                radius: 8
                color: root.cCard
                border.color: root.cBorder

                Column {
                    anchors.fill: parent
                    anchors.margins: 14
                    spacing: 8
                    Text { text: "Disabled State"; color: root.cFg; font.pixelSize: 12; font.weight: Font.DemiBold }
                    Row {
                        spacing: 20
                        ChaSetSwitch { disabled: true; checked: false; label: "Disabled Off" }
                        ChaSetSwitch { disabled: true; checked: true; label: "Disabled On" }
                    }
                }
            }

            Rectangle {
                width: (parent.width - 16) / 2
                height: 100
                radius: 8
                color: root.cCard
                border.color: root.cBorder

                Column {
                    anchors.fill: parent
                    anchors.margins: 14
                    spacing: 8
                    Text { text: "Async Loading State"; color: root.cFg; font.pixelSize: 12; font.weight: Font.DemiBold }
                    Row {
                        spacing: 20
                        ChaSetSwitch { loading: true; checked: false; label: "Connecting..." }
                        ChaSetSwitch { loading: true; checked: true; label: "Syncing..." }
                    }
                }
            }

            Rectangle {
                width: (parent.width - 16) / 2
                height: 100
                radius: 8
                color: root.cCard
                border.color: root.cBorder

                Column {
                    anchors.fill: parent
                    anchors.margins: 14
                    spacing: 8
                    Text { text: "Read-Only State"; color: root.cFg; font.pixelSize: 12; font.weight: Font.DemiBold }
                    Row {
                        spacing: 20
                        ChaSetSwitch { readOnly: true; checked: false; label: "Locked Off" }
                        ChaSetSwitch { readOnly: true; checked: true; label: "Locked On" }
                    }
                }
            }

            Rectangle {
                width: parent.width
                height: 100
                radius: 8
                color: root.cCard
                border.color: root.cBorder

                Column {
                    anchors.fill: parent
                    anchors.margins: 14
                    spacing: 8
                    Text { text: "With Helper Description"; color: root.cFg; font.pixelSize: 12; font.weight: Font.DemiBold }
                    ChaSetSwitch {
                        checked: true
                        label: "Airplane Mode"
                        description: "Disables all wireless connections including Wi-Fi, Cellular, and Bluetooth"
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
            componentId: "switch"
        }

        PropsTable {
            width: parent.width
            propsModel: [
                {
                    name: "checked",
                    type: "bool",
                    default: "false",
                    description: "Whether the switch is toggled on (checked)."
                },
                {
                    name: "size",
                    type: "\"default\" | \"sm\"",
                    default: "\"default\"",
                    description: "The size scale of the switch track and thumb (default, sm)."
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
                    description: "Whether the switch is read-only (prevents interaction without muted opacity)."
                },
                {
                    name: "loading",
                    type: "bool",
                    default: "false",
                    description: "Shows an animated spinner inside the thumb and prevents toggling."
                },
                {
                    name: "label",
                    type: "string",
                    default: "\"\"",
                    description: "Optional companion label text beside the switch."
                },
                {
                    name: "description",
                    type: "string",
                    default: "\"\"",
                    description: "Optional descriptive helper text displayed below the label."
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
