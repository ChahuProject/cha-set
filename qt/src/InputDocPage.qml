// InputDocPage.qml — Documentation and interactive sandbox for ChaSetInput
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Forms & Inputs"
    pageTitle: "Input"
    description: "Displays a form text input field or a component that looks like an input field."

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
    property string demoText: "user@chahu.dev"
    property string demoPlaceholder: "Enter your email..."

    // Section 1: Overview
    ComponentPreview {
        id: heroPreview
        width: parent.width
        title: "Input Sandbox"
        reactCode: `<Input\n  type="${root.demoType}"\n  size="${root.demoSize}"\n  placeholder="${root.demoPlaceholder}"\n  value="${root.demoText}"\n  disabled={${root.demoDisabled}}\n  invalid={${root.demoInvalid}}\n  clearable={${root.demoClearable}}\n  passwordToggle={${root.demoPasswordToggle}}\n  onChange={(e) => setValue(e.target.value)}\n/>`
        qtCode: `ChaSetInput {\n    width: 280\n    size: "${root.demoSize}"\n    type: "${root.demoType}"\n    placeholderText: "${root.demoPlaceholder}"\n    text: "${root.demoText}"\n    disabled: ${root.demoDisabled}\n    invalid: ${root.demoInvalid}\n    clearable: ${root.demoClearable}\n    passwordToggle: ${root.demoPasswordToggle}\n    onTextEdited: { /* handle text */ }\n}`

        stageData: [
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
            text: "Examples & States"
            color: root.cFg
            font.pixelSize: Typography.sizeTitleSm
            font.weight: Typography.weightBold
        }

        DocText {
            text: "Visual matrix of common input configurations and states in Qt Quick."
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
                    DocText { text: "Default Input"; color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    ChaSetInput { width: parent.width - ThemeTokens.dp(28); placeholderText: "Enter username..." }
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
                    ChaSetInput { width: parent.width - ThemeTokens.dp(28); size: "sm"; placeholderText: "Compact input..." }
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
                    DocText { text: "Invalid / Error State"; color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    ChaSetInput { width: parent.width - ThemeTokens.dp(28); invalid: true; text: "invalid-email@" }
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
                    DocText { text: "Clearable Field"; color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    ChaSetInput { width: parent.width - ThemeTokens.dp(28); clearable: true; text: "Click cross to clear" }
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
                    DocText { text: "Password with Toggle"; color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    ChaSetInput { width: parent.width - ThemeTokens.dp(28); type: "password"; passwordToggle: true; text: "supersecret123" }
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
                    ChaSetInput { width: parent.width - ThemeTokens.dp(28); disabled: true; placeholderText: "Disabled input"; text: "preset value" }
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
                    description: "The height and padding scale of the input."
                },
                {
                    name: "type",
                    type: "string",
                    defaultValue: "\"text\"",
                    description: "Input type: \"text\" | \"password\" | \"email\" | \"search\" | \"number\"."
                },
                {
                    name: "placeholderText",
                    type: "string",
                    defaultValue: "\"\"",
                    description: "Placeholder hint text displayed when input is empty."
                },
                {
                    name: "disabled",
                    type: "bool",
                    defaultValue: "false",
                    description: "Disables user interactions and applies 50% opacity."
                },
                {
                    name: "readOnly",
                    type: "bool",
                    defaultValue: "false",
                    description: "Prevents editing text while keeping focusability."
                },
                {
                    name: "invalid",
                    type: "bool",
                    defaultValue: "false",
                    description: "Applies destructive error highlight to border and focus ring."
                },
                {
                    name: "clearable",
                    type: "bool",
                    defaultValue: "false",
                    description: "Renders an interactive clear button when text is present."
                },
                {
                    name: "passwordToggle",
                    type: "bool",
                    defaultValue: "false",
                    description: "Renders an eye toggle button to reveal or mask passwords."
                },
                {
                    name: "leftIconSource",
                    type: "string",
                    defaultValue: "\"\"",
                    description: "Image source URI rendered on the leading side of the input."
                },
                {
                    name: "rightIconSource",
                    type: "string",
                    defaultValue: "\"\"",
                    description: "Image source URI rendered on the trailing side of the input."
                },
                {
                    name: "forceHover",
                    type: "bool",
                    defaultValue: "false",
                    description: "Visual testing aid to force hover state."
                },
                {
                    name: "forceFocus",
                    type: "bool",
                    defaultValue: "false",
                    description: "Visual testing aid to force focus ring."
                }
            ]
    }
}
}
