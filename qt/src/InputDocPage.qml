// InputDocPage.qml — Documentation and interactive sandbox for ChaSetInput
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Components"
    pageTitle: "Input"
    description: "Displays a form text input field or a component that looks like an input field."
    tocItems: [
        { id: "overview", title: "Interactive Overview" },
        { id: "installation", title: "Installation" },
        { id: "anatomy", title: "Anatomy" },
        { id: "examples", title: "Examples & States" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "Props Reference" }
    ]

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
            Column {
                anchors.centerIn: parent
                width: 320
                spacing: 8

                Row {
                    width: parent.width
                    Text {
                        text: "Email address"
                        color: root.cMutedFg
                        font.pixelSize: 12
                    }
                    Item { width: 1; height: 1 }
                }

                ChaSetInput {
                    id: sandboxInput
                    width: parent.width
                    size: root.demoSize
                    type: root.demoType
                    placeholderText: root.demoPlaceholder
                    text: root.demoText
                    disabled: root.demoDisabled
                    invalid: root.demoInvalid
                    clearable: root.demoClearable
                    passwordToggle: root.demoPasswordToggle
                    onTextEdited: root.demoText = text
                }

                Text {
                    text: root.demoInvalid ? "Please enter a valid corporate email address." : "We will never share your email with anyone else."
                    color: root.demoInvalid ? (ThemeTokens.dark ? Qt.rgba(248.0 / 255.0, 113.0 / 255.0, 113.0 / 255.0, 1.0) : Qt.rgba(239.0 / 255.0, 68.0 / 255.0, 68.0 / 255.0, 1.0)) : root.cMutedFg
                    font.pixelSize: 11
                }
            }
        ]

        controlsData: [
            Row {
                spacing: 16

                Row {
                    spacing: 8
                    Text { text: "Size:"; color: root.cMutedFg; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
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
                    Text { text: "Type:"; color: root.cMutedFg; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
                    ChaSetTabs {
                        anchors.verticalCenter: parent.verticalCenter
                        currentValue: root.demoType
                        onCurrentValueChanged: root.demoType = currentValue
                        ChaSetTabsList {
                            ChaSetTabsTrigger { value: "text"; text: "Text" }
                            ChaSetTabsTrigger { value: "password"; text: "Password" }
                        }
                    }
                }

                Row {
                    spacing: 12
                    anchors.verticalCenter: parent.verticalCenter

                    ChaSetCheckbox {
                        size: "sm"
                        label: "Disabled"
                        checked: root.demoDisabled
                        onToggled: (val) => root.demoDisabled = val
                    }

                    ChaSetCheckbox {
                        size: "sm"
                        label: "Invalid"
                        checked: root.demoInvalid
                        onToggled: (val) => root.demoInvalid = val
                    }

                    ChaSetCheckbox {
                        size: "sm"
                        label: "Clearable"
                        checked: root.demoClearable
                        onToggled: (val) => root.demoClearable = val
                    }

                    ChaSetCheckbox {
                        visible: root.demoType === "password"
                        size: "sm"
                        label: "Password Toggle"
                        checked: root.demoPasswordToggle
                        onToggled: (val) => root.demoPasswordToggle = val
                    }
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
            text: "Import and render ChaSetInput directly in your QML scene."
            color: root.cMutedFg
            font.pixelSize: 13
        }

        CodeBlock {
            width: parent.width
            language: "qml"
            code: `import ChaSet\n\nChaSetInput {\n    width: 240\n    placeholderText: "Enter email..."\n    onAccepted: console.log("Submitted:", text)\n}`
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
            text: "Visual matrix of common input configurations and states in Qt Quick."
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
                    Text { text: "Default Input"; color: root.cFg; font.pixelSize: 12; font.weight: Font.DemiBold }
                    ChaSetInput { width: parent.width; placeholderText: "Enter username..." }
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
                    ChaSetInput { width: parent.width; size: "sm"; placeholderText: "Compact input..." }
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
                    Text { text: "Invalid / Error State"; color: root.cFg; font.pixelSize: 12; font.weight: Font.DemiBold }
                    ChaSetInput { width: parent.width; invalid: true; text: "invalid-email@" }
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
                    Text { text: "Clearable Field"; color: root.cFg; font.pixelSize: 12; font.weight: Font.DemiBold }
                    ChaSetInput { width: parent.width; clearable: true; text: "Click cross to clear" }
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
                    Text { text: "Password with Toggle"; color: root.cFg; font.pixelSize: 12; font.weight: Font.DemiBold }
                    ChaSetInput { width: parent.width; type: "password"; passwordToggle: true; text: "supersecret123" }
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
                    ChaSetInput { width: parent.width; disabled: true; placeholderText: "Disabled input"; text: "preset value" }
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
        componentId: "input"
    }

    PropsTable {
            width: parent.width
            propsModel: [
                {
                    propName: "size",
                    propType: "\"default\" | \"sm\"",
                    propDefault: "\"default\"",
                    propDescription: "The height and padding scale of the input."
                },
                {
                    propName: "type",
                    propType: "string",
                    propDefault: "\"text\"",
                    propDescription: "Input type: \"text\" | \"password\" | \"email\" | \"search\" | \"number\"."
                },
                {
                    propName: "placeholderText",
                    propType: "string",
                    propDefault: "\"\"",
                    propDescription: "Placeholder hint text displayed when input is empty."
                },
                {
                    propName: "disabled",
                    propType: "bool",
                    propDefault: "false",
                    propDescription: "Disables user interactions and applies 50% opacity."
                },
                {
                    propName: "readOnly",
                    propType: "bool",
                    propDefault: "false",
                    propDescription: "Prevents editing text while keeping focusability."
                },
                {
                    propName: "invalid",
                    propType: "bool",
                    propDefault: "false",
                    propDescription: "Applies destructive error highlight to border and focus ring."
                },
                {
                    propName: "clearable",
                    propType: "bool",
                    propDefault: "false",
                    propDescription: "Renders an interactive clear button when text is present."
                },
                {
                    propName: "passwordToggle",
                    propType: "bool",
                    propDefault: "false",
                    propDescription: "Renders an eye toggle button to reveal or mask passwords."
                },
                {
                    propName: "leftIconSource",
                    propType: "string",
                    propDefault: "\"\"",
                    propDescription: "Image source URI rendered on the leading side of the input."
                },
                {
                    propName: "rightIconSource",
                    propType: "string",
                    propDefault: "\"\"",
                    propDescription: "Image source URI rendered on the trailing side of the input."
                },
                {
                    propName: "forceHover",
                    propType: "bool",
                    propDefault: "false",
                    propDescription: "Visual testing aid to force hover state."
                },
                {
                    propName: "forceFocus",
                    propType: "bool",
                    propDefault: "false",
                    propDescription: "Visual testing aid to force focus ring."
                }
            ]
        }
    }
}
