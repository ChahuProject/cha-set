// SwitchDocPage.qml — Documentation and interactive sandbox for ChaSetSwitch
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Forms & Inputs"
    pageTitle: "Switch"
    description: "A control that allows the user to toggle between checked and not checked states."
    tocItems: [
        { id: "overview", title: "Interactive Overview" },
        { id: "installation", title: "Installation" },
        { id: "anatomy", title: "Anatomy" },
        { id: "states", title: "Examples & States" },
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
                    DocText {
                        text: "Size:"
                        color: root.cMutedFg
                        font.pixelSize: Typography.sizeSmall
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

        DocText {
            text: "Installation"
            color: root.cFg
            font.pixelSize: Typography.sizeTitleSm
            font.weight: Typography.weightBold
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

        DocText {
            text: "Anatomy"
            color: root.cFg
            font.pixelSize: Typography.sizeTitleSm
            font.weight: Typography.weightBold
        }

        DocText {
            text: "Import and render ChaSetSwitch directly in your QML scene."
            color: root.cMutedFg
            font.pixelSize: Typography.sizeBody
        }

        ChaSetCodeBlock {
            width: parent.width
            language: "qml"
            code: `import ChaSet\n\nChaSetSwitch {\n    checked: false\n    label: "Enable notifications"\n    onToggled: function(checked) {\n        console.log("Switch state:", checked)\n    }\n}`
        }
    }

    // Section 4: Examples & States
    Column {
        width: parent.width
        spacing: 12

        DocText {
            text: "Examples & States"
            color: root.cFg
            font.pixelSize: Typography.sizeTitleSm
            font.weight: Typography.weightBold
        }

        DocText {
            text: "Visual matrix of common switch configurations and interactive states in Qt Quick."
            color: root.cMutedFg
            font.pixelSize: Typography.sizeBody
        }

        Grid {
            width: parent.width
            columns: 2
            spacing: ThemeTokens.dp(16)

            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(16)) / 2
                customRadius: ThemeTokens.dp(8)

                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(14)
                    bottomPadding: ThemeTokens.dp(14)
                    leftPadding: ThemeTokens.dp(14)
                    rightPadding: ThemeTokens.dp(14)
                    spacing: ThemeTokens.dp(8)
                    DocText { text: "Default Toggle"; color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    Row {
                        spacing: ThemeTokens.dp(20)
                        ChaSetSwitch { checked: false; label: "Off" }
                        ChaSetSwitch { checked: true; label: "On" }
                    }
                }
            }

            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(16)) / 2
                customRadius: ThemeTokens.dp(8)

                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(14)
                    bottomPadding: ThemeTokens.dp(14)
                    leftPadding: ThemeTokens.dp(14)
                    rightPadding: ThemeTokens.dp(14)
                    spacing: ThemeTokens.dp(8)
                    DocText { text: "Small Size (sm)"; color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    Row {
                        spacing: ThemeTokens.dp(20)
                        ChaSetSwitch { size: "sm"; checked: false; label: "Compact Off" }
                        ChaSetSwitch { size: "sm"; checked: true; label: "Compact On" }
                    }
                }
            }

            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(16)) / 2
                customRadius: ThemeTokens.dp(8)

                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(14)
                    bottomPadding: ThemeTokens.dp(14)
                    leftPadding: ThemeTokens.dp(14)
                    rightPadding: ThemeTokens.dp(14)
                    spacing: ThemeTokens.dp(8)
                    DocText { text: "Disabled State"; color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    Row {
                        spacing: ThemeTokens.dp(20)
                        ChaSetSwitch { disabled: true; checked: false; label: "Disabled Off" }
                        ChaSetSwitch { disabled: true; checked: true; label: "Disabled On" }
                    }
                }
            }

            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(16)) / 2
                customRadius: ThemeTokens.dp(8)

                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(14)
                    bottomPadding: ThemeTokens.dp(14)
                    leftPadding: ThemeTokens.dp(14)
                    rightPadding: ThemeTokens.dp(14)
                    spacing: ThemeTokens.dp(8)
                    DocText { text: "Async Loading State"; color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    Row {
                        spacing: ThemeTokens.dp(20)
                        ChaSetSwitch { loading: true; checked: false; label: "Connecting..." }
                        ChaSetSwitch { loading: true; checked: true; label: "Syncing..." }
                    }
                }
            }

            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(16)) / 2
                customRadius: ThemeTokens.dp(8)

                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(14)
                    bottomPadding: ThemeTokens.dp(14)
                    leftPadding: ThemeTokens.dp(14)
                    rightPadding: ThemeTokens.dp(14)
                    spacing: ThemeTokens.dp(8)
                    DocText { text: "Read-Only State"; color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    Row {
                        spacing: ThemeTokens.dp(20)
                        ChaSetSwitch { readOnly: true; checked: false; label: "Locked Off" }
                        ChaSetSwitch { readOnly: true; checked: true; label: "Locked On" }
                    }
                }
            }

            ChaSetCard {
                width: parent.width
                customRadius: ThemeTokens.dp(8)

                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(14)
                    bottomPadding: ThemeTokens.dp(14)
                    leftPadding: ThemeTokens.dp(14)
                    rightPadding: ThemeTokens.dp(14)
                    spacing: ThemeTokens.dp(8)
                    DocText { text: "With Helper Description"; color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
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

        DocText {
            text: "Props Reference"
            color: root.cFg
            font.pixelSize: Typography.sizeTitleSm
            font.weight: Typography.weightBold
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
