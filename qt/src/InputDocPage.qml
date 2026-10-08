// InputDocPage.qml — Documentation and interactive sandbox for ChaSetInput
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Forms & Inputs"
    pageTitle: "Input"
    description: ChaSetI18n.tr("components.input.description", "Displays a form text input field or a component that looks like an input field.")

    property int customRadius: 6
    property color cFg: ThemeTokens.text
    property color cMutedFg: ThemeTokens.subduedText
    property color cCard: ThemeTokens.panel
    property color cBorder: ThemeTokens.border
    property color cPrimary: ThemeTokens.accent
    property color cAccentBg: ThemeTokens.hover

    property string demoSize: "default"
    property string demoType: "text"
    property bool demoDisabled: false
    property bool demoInvalid: false
    property bool demoClearable: true
    property bool demoPasswordToggle: true
    property bool demoShowIcon: true
    property bool demoBordered: true
    property string demoText: "user@chahu.dev"
    property string demoPlaceholder: "Enter your email..."

    // Section 1: Overview
    ComponentPreview {
        id: heroPreview
        width: parent.width
        title: ChaSetI18n.tr("desktopComposite.input.sandboxTitle", "Input Sandbox")
        reactCode: `<Input\n  type="${root.demoType}"\n  size="${root.demoSize}"\n  placeholder="${root.demoPlaceholder}"\n  value="${root.demoText}"\n  disabled={${root.demoDisabled}}\n  invalid={${root.demoInvalid}}\n  clearable={${root.demoClearable}}\n  bordered={${root.demoBordered}}\n  passwordToggle={${root.demoPasswordToggle}}${root.demoShowIcon ? '\n  icon={<MailIcon className="size-4" />}' : ''}\n  onChange={(e) => setValue(e.target.value)}\n/>`
        qtCode: `ChaSetInput {\n    width: 280\n    size: "${root.demoSize}"\n    type: "${root.demoType}"\n    placeholderText: "${root.demoPlaceholder}"\n    text: "${root.demoText}"\n    disabled: ${root.demoDisabled}\n    invalid: ${root.demoInvalid}\n    clearable: ${root.demoClearable}\n    bordered: ${root.demoBordered}\n    passwordToggle: ${root.demoPasswordToggle}${root.demoShowIcon ? '\n    icon: "mail"' : ''}\n    onTextEdited: { /* handle text */ }\n}`

                stageData: [
            Column {
                anchors.centerIn: parent
                width: ThemeTokens.dp(320)
                spacing: ThemeTokens.dp(8)

                Row {
                    width: parent.width
                    DocText {
                        text: ChaSetI18n.tr("formsA.input.emailAddress", "Email address")
                        color: root.cMutedFg
                        font.pixelSize: Typography.sizeSmall
                    }
                    Item { width: 1; height: 1 }
                }

                ChaSetInput {
                    id: sandboxInput
                    width: parent.width
                    size: root.demoSize
                    type: root.demoType
                    placeholderText: ChaSetI18n.tr("formsA.input.emailPlaceholder", "Enter your email...")
                    text: root.demoText
                    disabled: root.demoDisabled
                    invalid: root.demoInvalid
                    clearable: root.demoClearable
                    bordered: root.demoBordered
                    icon: root.demoShowIcon ? "mail" : ""
                    passwordToggle: root.demoPasswordToggle
                    onTextEdited: root.demoText = text
                }

                DocText {
                    text: root.demoInvalid ? ChaSetI18n.tr("formsA.input.emailError", "Please enter a valid corporate email address.") : ChaSetI18n.tr("formsA.input.emailHint", "We will never share your email with anyone else.")
                    color: root.demoInvalid ? (ThemeTokens.dark ? Qt.rgba(248.0 / 255.0, 113.0 / 255.0, 113.0 / 255.0, 1.0) : Qt.rgba(239.0 / 255.0, 68.0 / 255.0, 68.0 / 255.0, 1.0)) : root.cMutedFg
                    font.pixelSize: Typography.sizeCaption
                }
            }
        ]

        controlsData: [
            Row {
                spacing: ThemeTokens.dp(8)
                DocText { text: ChaSetI18n.tr("showcase.size", "Size:"); color: root.cMutedFg; font.pixelSize: Typography.sizeSmall; anchors.verticalCenter: parent.verticalCenter }
                ChaSetSegmentedControl {
                    anchors.verticalCenter: parent.verticalCenter
                    size: "sm"
                    value: root.demoSize
                    options: [
                        { label: ChaSetI18n.tr("common.default", "Default"), value: "default" },
                        { label: ChaSetI18n.tr("formsA.input.sizeSm", "Small (sm)"), value: "sm" }
                    ]
                    onValueSelected: function(s) { root.demoSize = String(s); }
                }
            },

            Row {
                spacing: ThemeTokens.dp(8)
                DocText { text: ChaSetI18n.tr("formsA.input.typeLabel", "Type:"); color: root.cMutedFg; font.pixelSize: Typography.sizeSmall; anchors.verticalCenter: parent.verticalCenter }
                ChaSetSegmentedControl {
                    anchors.verticalCenter: parent.verticalCenter
                    size: "sm"
                    value: root.demoType
                    options: [
                        { label: ChaSetI18n.tr("formsA.input.typeText", "Text"), value: "text" },
                        { label: ChaSetI18n.tr("formsA.input.typePassword", "Password"), value: "password" }
                    ]
                    onValueSelected: function(t) { root.demoType = String(t); }
                }
            },

            Row {
                width: childrenRect.width
                spacing: ThemeTokens.dp(12)

                ChaSetCheckbox {
                    size: "sm"
                    label: ChaSetI18n.tr("common.disabled", "Disabled")
                    checked: root.demoDisabled
                    onToggled: (val) => root.demoDisabled = val
                }

                ChaSetCheckbox {
                    size: "sm"
                    label: ChaSetI18n.tr("formsA.input.invalid", "Invalid")
                    checked: root.demoInvalid
                    onToggled: (val) => root.demoInvalid = val
                }

                ChaSetCheckbox {
                    size: "sm"
                    label: ChaSetI18n.tr("formsA.input.clearable", "Clearable")
                    checked: root.demoClearable
                    onToggled: (val) => root.demoClearable = val
                }
            },

            Row {
                width: childrenRect.width
                spacing: ThemeTokens.dp(12)

                ChaSetCheckbox {
                    size: "sm"
                    label: ChaSetI18n.tr("formsA.input.showIcon", "Show Icon")
                    checked: root.demoShowIcon
                    onToggled: (val) => root.demoShowIcon = val
                }

                ChaSetCheckbox {
                    size: "sm"
                    label: ChaSetI18n.tr("formsA.input.bordered", "Bordered")
                    checked: root.demoBordered
                    onToggled: (val) => root.demoBordered = val
                }

                ChaSetCheckbox {
                    visible: root.demoType === "password"
                    size: "sm"
                    label: ChaSetI18n.tr("formsA.input.passwordToggle", "Password Toggle")
                    checked: root.demoPasswordToggle
                    onToggled: (val) => root.demoPasswordToggle = val
                }
            }
        ]
    }

    // Section 3: Anatomy
    DocAnatomy {
        width: parent.width
        qtCode: `import ChaSet\n\nChaSetInput {\n    type: "email"\n    placeholder: "Email"\n    clearable: true\n}`
        reactCode: `import { Input } from '@chahu/cha-set';\n\n<Input type="email" placeholder="Email" clearable />`
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
            text: ChaSetI18n.tr("formsA.input.examplesSubtitle", "Visual matrix of common input configurations and states in Qt Quick.")
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
                    DocText { text: ChaSetI18n.tr("formsA.input.defaultInputTitle", "Default Input"); color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    ChaSetInput { width: parent.width - ThemeTokens.dp(28); placeholderText: ChaSetI18n.tr("formsA.input.defaultInputPlaceholder", "Enter username...") }
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
                    DocText { text: ChaSetI18n.tr("formsA.input.smInputTitle", "Small Size (sm)"); color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    ChaSetInput { width: parent.width - ThemeTokens.dp(28); size: "sm"; placeholderText: ChaSetI18n.tr("formsA.input.smInputPlaceholder", "Compact input...") }
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
                    DocText { text: ChaSetI18n.tr("formsA.input.invalidInputTitle", "Invalid / Error State"); color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    ChaSetInput { width: parent.width - ThemeTokens.dp(28); invalid: true; text: "invalid-email@" }
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
                    DocText { text: ChaSetI18n.tr("formsA.input.clearableInputTitle", "Clearable Field"); color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    ChaSetInput { width: parent.width - ThemeTokens.dp(28); clearable: true; text: ChaSetI18n.tr("formsA.input.clearableInputVal", "Click cross to clear") }
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
                    DocText { text: ChaSetI18n.tr("formsA.input.passwordInputTitle", "Password with Toggle"); color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    ChaSetInput { width: parent.width - ThemeTokens.dp(28); type: "password"; passwordToggle: true; text: "supersecret123" }
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
                    DocText { text: ChaSetI18n.tr("formsA.input.disabledInputTitle", "Disabled State"); color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    ChaSetInput { width: parent.width - ThemeTokens.dp(28); disabled: true; placeholderText: ChaSetI18n.tr("formsA.input.disabledInputPlaceholder", "Disabled input"); text: ChaSetI18n.tr("formsA.input.disabledInputVal", "preset value") }
                }
            }
        }
    }

        ComponentReference {
        name: "Input"
        componentId: "input"
        propsModel: [
                {
                    name: "size",
                    type: "\"default\" | \"sm\"",
                    defaultValue: "\"default\"",
                    description: ChaSetI18n.tr("components.input.sizeDesc", "The height and padding scale of the input.")
                },
                {
                    name: "type",
                    type: "string",
                    defaultValue: "\"text\"",
                    description: ChaSetI18n.tr("components.input.typeDesc", "Standard HTML/Qt input type: \"text\" | \"password\" | \"email\" | \"search\" | \"number\".")
                },
                {
                    name: "placeholderText",
                    type: "string",
                    defaultValue: "\"\"",
                    description: ChaSetI18n.tr("components.input.placeholderDesc", "Placeholder hint text displayed when input is empty.")
                },
                {
                    name: "disabled",
                    type: "bool",
                    defaultValue: "false",
                    description: ChaSetI18n.tr("components.input.disabledDesc", "Disables user interactions and applies 50% opacity.")
                },
                {
                    name: "readOnly",
                    type: "bool",
                    defaultValue: "false",
                    description: ChaSetI18n.tr("components.input.readOnlyDesc", "Prevents editing value while keeping focusability.")
                },
                {
                    name: "invalid",
                    type: "bool",
                    defaultValue: "false",
                    description: ChaSetI18n.tr("components.input.invalidDesc", "Applies destructive error styling and aria-invalid attribute.")
                },
                {
                    name: "clearable",
                    type: "bool",
                    defaultValue: "false",
                    description: ChaSetI18n.tr("components.input.clearableDesc", "Renders a clear button when text is present to wipe content.")
                },
                {
                    name: "passwordToggle",
                    type: "bool",
                    defaultValue: "false",
                    description: ChaSetI18n.tr("components.input.passwordToggleDesc", "Renders an eye toggle button to reveal or mask passwords.")
                },
                {
                    name: "leftIconSource",
                    type: "string",
                    defaultValue: "\"\"",
                    description: ChaSetI18n.tr("components.input.leftIconDesc", "Icon element rendered on the leading side of the input.")
                },
                {
                    name: "rightIconSource",
                    type: "string",
                    defaultValue: "\"\"",
                    description: ChaSetI18n.tr("components.input.rightIconDesc", "Icon element rendered on the trailing side of the input.")
                },
                {
                    name: "forceHover",
                    type: "bool",
                    defaultValue: "false",
                    description: ChaSetI18n.tr("components.input.forceHoverDesc", "Visual testing aid to force hover state styles.")
                },
                {
                    name: "forceFocus",
                    type: "bool",
                    defaultValue: "false",
                    description: ChaSetI18n.tr("components.input.forceFocusDesc", "Visual testing aid to force focus ring styles.")
                }
            ]
    }
}