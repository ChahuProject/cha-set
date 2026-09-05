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
    property string demoText: ""
    property string demoPlaceholder: "Enter your email..."

    // Section 1: Overview
    ComponentPreview {
        id: heroPreview
        width: parent.width
        title: "Input Sandbox"
        reactCode: `<Input\n  type="${root.demoType}"\n  size="${root.demoSize}"\n  placeholder="${root.demoPlaceholder}"\n  value="${root.demoText}"\n  disabled={${root.demoDisabled}}\n  onChange={(e) => setValue(e.target.value)}\n/>`
        qtCode: `ChaSetInput {\n    width: 280\n    size: "${root.demoSize}"\n    type: "${root.demoType}"\n    placeholderText: "${root.demoPlaceholder}"\n    text: "${root.demoText}"\n    disabled: ${root.demoDisabled}\n    onTextEdited: { /* handle text */ }\n}`

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
                    onTextEdited: root.demoText = text
                }

                Text {
                    text: "We will never share your email with anyone else."
                    color: root.cMutedFg
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
                            ChaSetTabsTrigger { value: "default"; text: "Default (36px)" }
                            ChaSetTabsTrigger { value: "sm"; text: "Small (32px)" }
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

                CheckBox {
                    text: "Disabled"
                    checked: root.demoDisabled
                    onToggled: root.demoDisabled = checked
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
                    Text { text: "Disabled State"; color: root.cFg; font.pixelSize: 12; font.weight: Font.DemiBold }
                    ChaSetInput { width: parent.width; disabled: true; placeholderText: "Disabled input"; text: "preset value" }
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
                    Text { text: "Password Field"; color: root.cFg; font.pixelSize: 12; font.weight: Font.DemiBold }
                    ChaSetInput { width: parent.width; type: "password"; placeholderText: "Enter password..."; text: "supersecret" }
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

        PropsTable {
            width: parent.width
            propsModel: [
                {
                    propName: "size",
                    propType: "\"default\" | \"sm\"",
                    propDefault: "\"default\"",
                    propDescription: "The height and padding scale of the input (default: 36px, sm: 32px)."
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
