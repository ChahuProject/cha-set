// CheckboxDocPage.qml — Documentation and interactive sandbox for ChaSetCheckbox
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Forms & Inputs"
    pageTitle: "Checkbox"
    description: ChaSetI18n.tr("components.checkbox.description", "A control that allows the user to toggle between checked and not-checked states, with support for indeterminate states, sizes, helper descriptions, and companion labels.")

    property int customRadius: 6
    property color cFg: ThemeTokens.text
    property color cMutedFg: ThemeTokens.subduedText
    property color cCard: ThemeTokens.panel
    property color cBorder: ThemeTokens.border
    property color cPrimary: ThemeTokens.accent
    property color cAccentBg: ThemeTokens.hover

    property string demoSize: "default"
    property bool demoChecked: true
    property bool demoIndeterminate: false
    property bool demoDisabled: false
    property bool demoReadOnly: false
    property bool demoInvalid: false
    property bool demoShowDesc: true
    property string demoLabel: "Accept terms and conditions"
    property string demoDescription: "You agree to the automated billing policy and privacy guidelines."

    // Section 1: Overview
    ComponentPreview {
        id: heroPreview
        width: parent.width
        title: ChaSetI18n.tr("desktopComposite.checkbox.sandboxTitle", "Checkbox Sandbox")
        reactCode: `<Checkbox\n  size="${root.demoSize}"\n  checked={${root.demoIndeterminate ? 'false' : root.demoChecked}}\n  indeterminate={${root.demoIndeterminate}}\n  disabled={${root.demoDisabled}}\n  readOnly={${root.demoReadOnly}}\n  invalid={${root.demoInvalid}}\n  label="${root.demoLabel}"\n  ${root.demoShowDesc ? `description="${root.demoDescription}"\n  ` : ''}onCheckedChange={(val) => setChecked(val)}\n/>`
        qtCode: `ChaSetCheckbox {\n    size: "${root.demoSize}"\n    checked: ${root.demoIndeterminate ? 'false' : root.demoChecked}\n    indeterminate: ${root.demoIndeterminate}\n    disabled: ${root.demoDisabled}\n    readOnly: ${root.demoReadOnly}\n    invalid: ${root.demoInvalid}\n    label: "${root.demoLabel}"\n    ${root.demoShowDesc ? `description: "${root.demoDescription}"\n    ` : ''}onToggled: (val) => { /* handle toggle */ }\n}`

        stageData: [
            Item {
                anchors.centerIn: parent
                width: sandboxCheckbox.implicitWidth
                height: sandboxCheckbox.implicitHeight

                ChaSetCheckbox {
                    id: sandboxCheckbox
                    anchors.centerIn: parent
                    size: root.demoSize
                    checked: root.demoChecked
                    indeterminate: root.demoIndeterminate
                    disabled: root.demoDisabled
                    readOnly: root.demoReadOnly
                    invalid: root.demoInvalid
                    label: root.demoLabel === "Accept terms and conditions" ? ChaSetI18n.tr("formsA.checkbox.sandboxLabel", "Accept terms and conditions") : root.demoLabel
                    description: root.demoShowDesc ? (root.demoDescription === "You agree to the automated billing policy and privacy guidelines." ? ChaSetI18n.tr("formsA.checkbox.sandboxDescription", "You agree to the automated billing policy and privacy guidelines.") : root.demoDescription) : ""
                    onToggled: (val) => {
                        if (root.demoIndeterminate) root.demoIndeterminate = false;
                        root.demoChecked = val;
                    }
                }
            }
        ]

        controlsData: [
            Row {
                width: childrenRect.width
                spacing: 8
                DocText { text: ChaSetI18n.tr("showcase.size", "Size:"); color: root.cMutedFg; font.pixelSize: Typography.sizeSmall; anchors.verticalCenter: parent.verticalCenter }
                ChaSetSegmentedControl {
                    anchors.verticalCenter: parent.verticalCenter
                    size: "sm"
                    value: root.demoSize
                    options: [
                        { label: ChaSetI18n.tr("common.default", "Default"), value: "default" },
                        { label: ChaSetI18n.tr("formsA.checkbox.sizeSm", "Small (sm)"), value: "sm" }
                    ]
                    onValueSelected: function(s) { root.demoSize = String(s); }
                }
            },

            Row {
                width: childrenRect.width
                spacing: 12

                ChaSetCheckbox {
                    size: "sm"
                    label: ChaSetI18n.tr("formsA.checkbox.checked", "Checked")
                    checked: root.demoChecked && !root.demoIndeterminate
                    onToggled: (val) => {
                        root.demoChecked = val;
                        if (root.demoIndeterminate) root.demoIndeterminate = false;
                    }
                }

                ChaSetCheckbox {
                    size: "sm"
                    label: ChaSetI18n.tr("formsA.checkbox.indeterminate", "Indeterminate")
                    checked: root.demoIndeterminate
                    onToggled: (val) => root.demoIndeterminate = val
                }

                ChaSetCheckbox {
                    size: "sm"
                    label: ChaSetI18n.tr("common.disabled", "Disabled")
                    checked: root.demoDisabled
                    onToggled: (val) => root.demoDisabled = val
                }
            },

            Row {
                width: childrenRect.width
                spacing: 12

                ChaSetCheckbox {
                    size: "sm"
                    label: ChaSetI18n.tr("formsA.checkbox.readOnly", "Read-Only")
                    checked: root.demoReadOnly
                    onToggled: (val) => root.demoReadOnly = val
                }

                ChaSetCheckbox {
                    size: "sm"
                    label: ChaSetI18n.tr("formsA.checkbox.invalid", "Invalid")
                    checked: root.demoInvalid
                    onToggled: (val) => root.demoInvalid = val
                }

                ChaSetCheckbox {
                    size: "sm"
                    label: ChaSetI18n.tr("formsA.checkbox.descriptionLabel", "Description")
                    checked: root.demoShowDesc
                    onToggled: (val) => root.demoShowDesc = val
                }
            }
        ]
    }

    // Section 2: Anatomy
    DocAnatomy {
        width: parent.width
        qtCode: `import ChaSet\n\nChaSetCheckbox {\n    checked: agree\n    label: "Service agreement"\n    description: "I agree to the service agreement and terms of use."\n    onToggled: agree = checked\n}`
        reactCode: `import { Checkbox } from '@chahu/cha-set';\n\n<Checkbox\n  checked={agree}\n  onCheckedChange={setAgree}\n  label="Service agreement"\n  description="I agree to the service agreement and terms of use."\n/>`
    }

    // Section 4: Examples & States
    Column {
        width: parent.width
        spacing: 16

        DocText {
            text: ChaSetI18n.tr("showcase.examplesAndStates", "Examples & States")
            color: root.cFg
            font.pixelSize: Typography.sizeTitleSm
            font.weight: Typography.weightBold
        }

        DocText {
            text: ChaSetI18n.tr("formsA.checkbox.examplesSubtitle", "Visual showcase of common checkbox states, sizes, and hierarchical groupings.")
            color: root.cMutedFg
            font.pixelSize: Typography.sizeBody
        }

        Flow {
            width: parent.width
            spacing: ThemeTokens.dp(16)

            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(16)) / 2
                customRadius: root.customRadius

                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(16)
                    bottomPadding: ThemeTokens.dp(16)
                    leftPadding: ThemeTokens.dp(16)
                    rightPadding: ThemeTokens.dp(16)
                    spacing: ThemeTokens.dp(8)

                    DocText { text: ChaSetI18n.tr("formsA.checkbox.uncheckedCheckedTitle", "Unchecked & Checked"); font.pixelSize: Typography.sizeBody; font.weight: Typography.weightBold; color: root.cFg }
                    DocText { text: ChaSetI18n.tr("formsA.checkbox.uncheckedCheckedDesc", "Standard interactive toggle states"); font.pixelSize: Typography.sizeCaption; color: root.cMutedFg }

                    Column {
                        width: parent.width - ThemeTokens.dp(32)
                        spacing: ThemeTokens.dp(8)
                        ChaSetCheckbox { checked: false; label: ChaSetI18n.tr("formsA.checkbox.uncheckedByDefault", "Unchecked by default") }
                        ChaSetCheckbox { checked: true; label: ChaSetI18n.tr("formsA.checkbox.checkedByDefault", "Checked by default") }
                    }
                }
            }

            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(16)) / 2
                customRadius: root.customRadius

                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(16)
                    bottomPadding: ThemeTokens.dp(16)
                    leftPadding: ThemeTokens.dp(16)
                    rightPadding: ThemeTokens.dp(16)
                    spacing: ThemeTokens.dp(8)

                    DocText { text: ChaSetI18n.tr("formsA.checkbox.indeterminateTitle", "Indeterminate State"); font.pixelSize: Typography.sizeBody; font.weight: Typography.weightBold; color: root.cFg }
                    DocText { text: ChaSetI18n.tr("formsA.checkbox.indeterminateDesc", "Represents partially selected sub-options"); font.pixelSize: Typography.sizeCaption; color: root.cMutedFg }

                    Column {
                        width: parent.width - ThemeTokens.dp(32)
                        spacing: ThemeTokens.dp(6)
                        ChaSetCheckbox { indeterminate: true; label: ChaSetI18n.tr("formsA.checkbox.selectAllSubtasks", "Select all sub-tasks") }
                        Row {
                            spacing: ThemeTokens.dp(8)
                            Item { width: ThemeTokens.dp(14); height: 1 }
                            ChaSetCheckbox { size: "sm"; checked: true; label: ChaSetI18n.tr("formsA.checkbox.task1", "Task 1: Requirements") }
                        }
                    }
                }
            }

            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(16)) / 2
                customRadius: root.customRadius

                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(16)
                    bottomPadding: ThemeTokens.dp(16)
                    leftPadding: ThemeTokens.dp(16)
                    rightPadding: ThemeTokens.dp(16)
                    spacing: ThemeTokens.dp(8)

                    DocText { text: ChaSetI18n.tr("formsA.checkbox.helperDescTitle", "With Helper Description"); font.pixelSize: Typography.sizeBody; font.weight: Typography.weightBold; color: root.cFg }
                    DocText { text: ChaSetI18n.tr("formsA.checkbox.helperDescSubtitle", "Detailed multi-line label and subtext"); font.pixelSize: Typography.sizeCaption; color: root.cMutedFg }

                    ChaSetCheckbox {
                        checked: true
                        label: ChaSetI18n.tr("formsA.checkbox.autoSyncLabel", "Automatic background syncing")
                        description: ChaSetI18n.tr("formsA.checkbox.autoSyncDesc", "Sync data with remote servers when idle.")
                    }
                }
            }

            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(16)) / 2
                customRadius: root.customRadius

                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(16)
                    bottomPadding: ThemeTokens.dp(16)
                    leftPadding: ThemeTokens.dp(16)
                    rightPadding: ThemeTokens.dp(16)
                    spacing: ThemeTokens.dp(8)

                    DocText { text: ChaSetI18n.tr("formsA.checkbox.invalidTitle", "Invalid / Error State"); font.pixelSize: Typography.sizeBody; font.weight: Typography.weightBold; color: root.cFg }
                    DocText { text: ChaSetI18n.tr("formsA.checkbox.invalidDesc", "Highlights unchecked required confirmation"); font.pixelSize: Typography.sizeCaption; color: root.cMutedFg }

                    ChaSetCheckbox {
                        invalid: true
                        checked: false
                        label: ChaSetI18n.tr("formsA.checkbox.mandatoryLabel", "Mandatory compliance confirmation")
                        description: ChaSetI18n.tr("formsA.checkbox.mandatoryDesc", "Must be accepted before setup.")
                    }
                }
            }

            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(16)) / 2
                customRadius: root.customRadius

                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(16)
                    bottomPadding: ThemeTokens.dp(16)
                    leftPadding: ThemeTokens.dp(16)
                    rightPadding: ThemeTokens.dp(16)
                    spacing: ThemeTokens.dp(8)

                    DocText { text: ChaSetI18n.tr("formsA.checkbox.disabledReadOnlyTitle", "Disabled & Read-Only States"); font.pixelSize: Typography.sizeBody; font.weight: Typography.weightBold; color: root.cFg }
                    DocText { text: ChaSetI18n.tr("formsA.checkbox.disabledReadOnlyDesc", "Dimmed non-interactive vs locked presentation"); font.pixelSize: Typography.sizeCaption; color: root.cMutedFg }

                    Column {
                        width: parent.width - ThemeTokens.dp(32)
                        spacing: ThemeTokens.dp(8)
                        ChaSetCheckbox { disabled: true; checked: false; label: ChaSetI18n.tr("formsA.checkbox.disabledUnchecked", "Disabled unchecked") }
                        ChaSetCheckbox { readOnly: true; checked: true; label: ChaSetI18n.tr("formsA.checkbox.readOnlyChecked", "Read-only checked") }
                    }
                }
            }

            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(16)) / 2
                customRadius: root.customRadius

                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(16)
                    bottomPadding: ThemeTokens.dp(16)
                    leftPadding: ThemeTokens.dp(16)
                    rightPadding: ThemeTokens.dp(16)
                    spacing: ThemeTokens.dp(8)

                    DocText { text: ChaSetI18n.tr("formsA.checkbox.sizeVariantsTitle", "Size Variants"); font.pixelSize: Typography.sizeBody; font.weight: Typography.weightBold; color: root.cFg }
                    DocText { text: ChaSetI18n.tr("formsA.checkbox.sizeVariantsDesc", "Default vs Compact size"); font.pixelSize: Typography.sizeCaption; color: root.cMutedFg }

                    Column {
                        width: parent.width - ThemeTokens.dp(32)
                        spacing: ThemeTokens.dp(8)
                        ChaSetCheckbox { size: "default"; checked: true; label: ChaSetI18n.tr("formsA.checkbox.defaultSizeLabel", "Default size (text-sm)") }
                        ChaSetCheckbox { size: "sm"; checked: true; label: ChaSetI18n.tr("formsA.checkbox.smSizeLabel", "Small size (sm, text-xs)") }
                    }
                }
            }
        }
    }

    // Animations
    Column {
        width: parent.width
        spacing: 12

        DocText { text: ChaSetI18n.tr("showcase.animations", "Animations"); color: root.cFg; font.pixelSize: Typography.sizeTitleSm; font.weight: Typography.weightBold }

        DocText { text: ChaSetI18n.tr("desktopComposite.checkbox.animationsDesc", "Motion behavior and timing for the checked, indeterminate, and state transitions."); color: root.cMutedFg; font.pixelSize: Typography.sizeBody; wrapMode: TextEdit.WordWrap; width: parent.width }

        DocText { text: "• The check-mark SVG stays mounted and cross-fades its opacity and scale when checked, using ThemeTokens.motionQuick with the easeEntrance curve on opacity/scale and easeStandard on colors."; color: root.cFg; font.pixelSize: Typography.sizeBody; wrapMode: TextEdit.WordWrap; width: parent.width }
        DocText { text: "• " + ChaSetI18n.tr("desktopComposite.checkbox.animationsBullet2", "The box border color cross-fades on hover, focus, checked, and invalid state changes."); color: root.cFg; font.pixelSize: Typography.sizeBody; wrapMode: TextEdit.WordWrap; width: parent.width }
        DocText { text: "• All transitions are guarded by ThemeTokens.animationsEnabled; when disabled, durations resolve to zero and animations stop."; color: root.cFg; font.pixelSize: Typography.sizeBody; wrapMode: TextEdit.WordWrap; width: parent.width }
    }

    // Section 5: Component Reference (Keyboard + Props)
    ComponentReference {
        name: "Checkbox"
        componentId: "checkbox"
        propsModel: [
            { name: "checked", type: "bool", defaultValue: "false", description: ChaSetI18n.tr("components.checkbox.checkedDesc", "The controlled checked state of the checkbox.") },
            { name: "indeterminate", type: "bool", defaultValue: "false", description: ChaSetI18n.tr("components.checkbox.indeterminateDesc", "Whether the checkbox is in an indeterminate state (takes visual precedence over checked).") },
            { name: "disabled", type: "bool", defaultValue: "false", description: ChaSetI18n.tr("components.checkbox.disabledDesc", "Disables user interactions and applies 50% opacity.") },
            { name: "readOnly", type: "bool", defaultValue: "false", description: ChaSetI18n.tr("components.checkbox.readOnlyDesc", "Prevents toggling state while retaining focusability and full opacity.") },
            { name: "invalid", type: "bool", defaultValue: "false", description: ChaSetI18n.tr("components.checkbox.invalidDesc", "Applies destructive error styling and aria-invalid attribute.") },
            { name: "size", type: "'default' | 'sm'", defaultValue: "'default'", description: ChaSetI18n.tr("components.checkbox.sizeDesc", "The size variant: default or sm.") },
            { name: "label", type: "string", defaultValue: "''", description: ChaSetI18n.tr("components.checkbox.labelDesc", "Optional companion label rendered alongside the checkbox.") },
            { name: "description", type: "string", defaultValue: "''", description: ChaSetI18n.tr("components.checkbox.helperDesc", "Optional helper text rendered below the label.") },
            { name: "customRadius", type: "int", defaultValue: "-1", description: ChaSetI18n.tr("components.checkbox.customRadiusDesc", "Optional custom corner radius for the checkbox box (-1 uses default).") },
            { name: "forceHover", type: "bool", defaultValue: "false", description: ChaSetI18n.tr("components.checkbox.forceHoverDesc", "Visual testing aid to force hover state styles.") },
            { name: "forceFocus", type: "bool", defaultValue: "false", description: ChaSetI18n.tr("components.checkbox.forceFocusDesc", "Visual testing aid to force focus ring styles.") }
        ]
    }
}
