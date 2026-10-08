// SwitchDocPage.qml — Documentation and interactive sandbox for ChaSetSwitch
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Forms & Inputs"
    pageTitle: "Switch"
    description: ChaSetI18n.tr("components.switch.description", "A control that allows the user to toggle between checked and not checked states, with support for async loading, read-only mode, and helper descriptions.")

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
        title: ChaSetI18n.tr("desktopComposite.switch.sandboxTitle", "Switch Sandbox")
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
                    label: ChaSetI18n.tr("formsA.switch.airplaneMode", "Airplane Mode")
                    description: root.demoDescription.length > 0 ? ChaSetI18n.tr("formsA.switch.airplaneModeDesc", "Disable cellular, Wi-Fi, and Bluetooth radios.") : ""
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
                        text: ChaSetI18n.tr("showcase.size", "Size:")
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
                            { label: ChaSetI18n.tr("formsA.switch.sizeSm", "Small (sm)"), value: "sm" }
                        ]
                        onValueSelected: function(s) { root.demoSize = String(s); }
                    }
                }

                ChaSetCheckbox {
                    size: "sm"
                    label: ChaSetI18n.tr("formsA.switch.checked", "Checked")
                    checked: root.demoChecked
                    onToggled: (val) => root.demoChecked = val
                    anchors.verticalCenter: parent.verticalCenter
                }

                ChaSetCheckbox {
                    size: "sm"
                    label: ChaSetI18n.tr("common.disabled", "Disabled")
                    checked: root.demoDisabled
                    onToggled: (val) => root.demoDisabled = val
                    anchors.verticalCenter: parent.verticalCenter
                }

                ChaSetCheckbox {
                    size: "sm"
                    label: ChaSetI18n.tr("formsA.switch.readOnly", "Read-Only")
                    checked: root.demoReadOnly
                    onToggled: (val) => root.demoReadOnly = val
                    anchors.verticalCenter: parent.verticalCenter
                }

                ChaSetCheckbox {
                    size: "sm"
                    label: ChaSetI18n.tr("common.loading", "Loading")
                    checked: root.demoLoading
                    onToggled: (val) => root.demoLoading = val
                    anchors.verticalCenter: parent.verticalCenter
                }

                ChaSetCheckbox {
                    size: "sm"
                    label: ChaSetI18n.tr("formsA.switch.descriptionLabel", "Description")
                    checked: root.demoDescription.length > 0
                    onToggled: (val) => root.demoDescription = val ? "Disable cellular, Wi-Fi, and Bluetooth radios." : ""
                    anchors.verticalCenter: parent.verticalCenter
                }
            }
        ]
    }

        // Section 3: Anatomy
    DocAnatomy {
        width: parent.width
        qtCode: `import ChaSet\n\nChaSetSwitch {\n    checked: enabled\n    label: "Enable Notifications"\n    description: "Receive daily push updates on this device."\n    onToggled: enabled = checked\n}`
        reactCode: `import { Switch } from '@chahu/cha-set';\n\n<Switch\n  checked={enabled}\n  onCheckedChange={setEnabled}\n  label="Enable Notifications"\n  description="Receive daily push updates on this device."\n/>`
    }

    // Section 4: Examples & States
    Column {
        width: parent.width
        spacing: 12

        DocText {
            text: ChaSetI18n.tr("showcase.examplesAndStates", "Examples & States")
            color: root.cFg
            font.pixelSize: Typography.sizeTitleSm
            font.weight: Typography.weightBold
        }

        DocText {
            text: ChaSetI18n.tr("formsA.switch.examplesSubtitle", "Visual matrix of common switch configurations and interactive states in Qt Quick.")
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
                    DocText { text: ChaSetI18n.tr("formsA.switch.standardToggleTitle", "Default Toggle"); color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    Row {
                        spacing: ThemeTokens.dp(20)
                        ChaSetSwitch { checked: false; label: ChaSetI18n.tr("formsA.switch.offLabel", "Off") }
                        ChaSetSwitch { checked: true; label: ChaSetI18n.tr("formsA.switch.onLabel", "On") }
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
                    DocText { text: ChaSetI18n.tr("formsA.switch.sizeVariantsTitle", "Small Size (sm)"); color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    Row {
                        spacing: ThemeTokens.dp(20)
                        ChaSetSwitch { size: "sm"; checked: false; label: ChaSetI18n.tr("formsA.switch.compactOff", "Compact Off") }
                        ChaSetSwitch { size: "sm"; checked: true; label: ChaSetI18n.tr("formsA.switch.compactOn", "Compact On") }
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
                    DocText { text: ChaSetI18n.tr("formsA.switch.disabledReadOnlyTitle", "Disabled State"); color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    Row {
                        spacing: ThemeTokens.dp(20)
                        ChaSetSwitch { disabled: true; checked: false; label: ChaSetI18n.tr("formsA.switch.disabledOff", "Disabled Off") }
                        ChaSetSwitch { disabled: true; checked: true; label: ChaSetI18n.tr("formsA.switch.disabledOn", "Disabled On") }
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
                    DocText { text: ChaSetI18n.tr("formsA.switch.asyncLoadingTitle", "Async Loading State"); color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    Row {
                        spacing: ThemeTokens.dp(20)
                        ChaSetSwitch { loading: true; checked: false; label: ChaSetI18n.tr("formsA.switch.connecting", "Connecting...") }
                        ChaSetSwitch { loading: true; checked: true; label: ChaSetI18n.tr("formsA.switch.syncing", "Syncing...") }
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
                    DocText { text: ChaSetI18n.tr("formsA.switch.disabledReadOnlyTitle", "Read-Only State"); color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    Row {
                        spacing: ThemeTokens.dp(20)
                        ChaSetSwitch { readOnly: true; checked: false; label: ChaSetI18n.tr("formsA.switch.readOnlyOff", "Locked Off") }
                        ChaSetSwitch { readOnly: true; checked: true; label: ChaSetI18n.tr("formsA.switch.readOnlyOn", "Locked On") }
                    }
                }
            }

            ChaSetCard {
                width: parent.width
                customRadius: 8
                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(14)
                    bottomPadding: ThemeTokens.dp(14)
                    leftPadding: ThemeTokens.dp(14)
                    rightPadding: ThemeTokens.dp(14)
                    spacing: ThemeTokens.dp(8)
                    DocText { text: ChaSetI18n.tr("formsA.switch.helperDescTitle", "With Helper Description"); color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    ChaSetSwitch {
                        checked: true
                        label: ChaSetI18n.tr("formsA.switch.airplaneMode", "Airplane Mode")
                        description: ChaSetI18n.tr("formsA.switch.airplaneModeDesc", "Disable cellular, Wi-Fi, and Bluetooth radios.")
                    }
                }
            }
        }
    }

        ComponentReference {
        name: "Switch"
        componentId: "switch"
        propsModel: [
                {
                    name: "checked",
                    type: "bool",
                    default: "false",
                    description: ChaSetI18n.tr("components.switch.checkedDesc", "Whether the switch is toggled on (checked).")
                },
                {
                    name: "size",
                    type: "\"default\" | \"sm\"",
                    default: "\"default\"",
                    description: ChaSetI18n.tr("components.switch.sizeDesc", "The size scale of the switch track and thumb.")
                },
                {
                    name: "disabled",
                    type: "bool",
                    default: "false",
                    description: ChaSetI18n.tr("components.switch.disabledDesc", "Disables user interactions and applies muted opacity.")
                },
                {
                    name: "readOnly",
                    type: "bool",
                    default: "false",
                    description: ChaSetI18n.tr("components.switch.readOnlyDesc", "Whether the switch is read-only (prevents interaction without muted opacity).")
                },
                {
                    name: "loading",
                    type: "bool",
                    default: "false",
                    description: ChaSetI18n.tr("components.switch.loadingDesc", "Shows an animated spinner inside the thumb and prevents toggling.")
                },
                {
                    name: "label",
                    type: "string",
                    default: "\"\"",
                    description: ChaSetI18n.tr("components.switch.labelDesc", "Optional companion label rendered alongside the switch.")
                },
                {
                    name: "description",
                    type: "string",
                    default: "\"\"",
                    description: ChaSetI18n.tr("components.switch.helperDesc", "Optional helper text displayed below the label.")
                },
                {
                    name: "forceHover",
                    type: "bool",
                    default: "false",
                    description: ChaSetI18n.tr("components.switch.forceHoverDesc", "Visual testing aid to force hover state.")
                },
                {
                    name: "forceFocus",
                    type: "bool",
                    default: "false",
                    description: ChaSetI18n.tr("components.switch.forceFocusDesc", "Visual testing aid to force focus ring.")
                }
            ]
    }
}