// ButtonDocPage.qml — Comprehensive Button Documentation matching React 1:1
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Components"
    pageTitle: "Button"
    description: "Displays a button or a component that looks like a button with multiple variants, sizes, and states."
    tocItems: [
        { id: "preview", title: "Interactive Preview" },
        { id: "installation", title: "Installation" },
        { id: "examples", title: "Examples" },
        { id: "variants", title: "Variants" },
        { id: "sizes", title: "Sizes" },
        { id: "states", title: "States" },
        { id: "props", title: "API Reference" }
    ]

    property string btnVariant: "default"
    property string btnSize: "default"
    property string btnLabel: "Button"
    property bool btnLoading: false
    property bool btnDisabled: false
    property bool btnFullWidth: false
    property int customRadius: 8
    property color cFg: ThemeTokens.text
    property color cMutedFg: ThemeTokens.subduedText
    property color cCard: ThemeTokens.panel
    property color cBorder: ThemeTokens.border
    property color cPrimary: ThemeTokens.accent
    property color cAccentBg: ThemeTokens.hover

    signal logAction(string msg)

    // 1. Interactive Preview Hero
    ComponentPreview {
        title: "Interactive Button Sandbox"
        reactCode: `<Button
  variant="${root.btnVariant}"
  size="${root.btnSize}"${root.btnLoading ? '\n  loading' : ''}${root.btnDisabled ? '\n  disabled' : ''}${root.btnFullWidth ? '\n  fullWidth' : ''}
>
  ${root.btnSize === 'icon' ? '⚙' : root.btnLabel}
</Button>`
        qtCode: `ChaSetButton {
    variant: "${root.btnVariant}"
    size: "${root.btnSize}"
    text: "${root.btnSize === 'icon' ? '' : root.btnLabel}"
    loading: ${root.btnLoading}
    disabled: ${root.btnDisabled}
    fullWidth: ${root.btnFullWidth}
    onClicked: console.log("clicked")
}`

        // Stage Container
        Rectangle {
            anchors.fill: parent
            color: "transparent"

            ChaSetButton {
                anchors.centerIn: parent
                variant: root.btnVariant
                size: root.btnSize
                text: root.btnSize === "icon" ? "" : root.btnLabel
                loading: root.btnLoading
                disabled: root.btnDisabled
                width: root.btnFullWidth ? Math.min(parent.width - 48, 360) : implicitWidth
            }
        }

        // Bottom Controls Bar
        controlsData: [
            Row {
                spacing: 6
                Text { text: "Variant:"; color: ThemeTokens.subduedText; font.pixelSize: 11; anchors.verticalCenter: parent.verticalCenter }
                Repeater {
                    model: ["default", "secondary", "outline", "ghost", "destructive", "link"]
                    delegate: Rectangle {
                        required property var modelData
                        width: btnText.implicitWidth + 14
                        height: 24
                        radius: 4
                        color: root.btnVariant === modelData ? ThemeTokens.accent : ThemeTokens.hover
                        border.color: root.btnVariant === modelData ? ThemeTokens.accent : ThemeTokens.border
                        Text { id: btnText; anchors.centerIn: parent; text: modelData; color: root.btnVariant === modelData ? "#ffffff" : ThemeTokens.text; font.pixelSize: 11; font.weight: Font.Medium }
                        MouseArea { anchors.fill: parent; cursorShape: Qt.PointingHandCursor; onClicked: root.btnVariant = modelData }
                    }
                }
            },
            Row {
                spacing: 6
                Text { text: "Size:"; color: ThemeTokens.subduedText; font.pixelSize: 11; anchors.verticalCenter: parent.verticalCenter }
                Repeater {
                    model: ["sm", "default", "lg", "icon"]
                    delegate: Rectangle {
                        required property var modelData
                        width: sizeText.implicitWidth + 12
                        height: 24
                        radius: 4
                        color: root.btnSize === modelData ? ThemeTokens.accent : ThemeTokens.hover
                        border.color: root.btnSize === modelData ? ThemeTokens.accent : ThemeTokens.border
                        Text { id: sizeText; anchors.centerIn: parent; text: modelData.toUpperCase(); color: root.btnSize === modelData ? "#ffffff" : ThemeTokens.text; font.pixelSize: 10; font.weight: Font.Medium }
                        MouseArea { anchors.fill: parent; cursorShape: Qt.PointingHandCursor; onClicked: root.btnSize = modelData }
                    }
                }
            },
            Row {
                spacing: 12
                CheckBox {
                    text: "Loading"
                    checked: root.btnLoading
                    onToggled: root.btnLoading = checked
                }
                CheckBox {
                    text: "Disabled"
                    checked: root.btnDisabled
                    onToggled: root.btnDisabled = checked
                }
                CheckBox {
                    text: "Full Width"
                    checked: root.btnFullWidth
                    onToggled: root.btnFullWidth = checked
                }
            },
            Row {
                visible: root.btnSize !== "icon"
                spacing: 6
                Text { text: "Label:"; color: ThemeTokens.subduedText; font.pixelSize: 11; anchors.verticalCenter: parent.verticalCenter }
                Rectangle {
                    width: 100; height: 24; radius: 4
                    color: ThemeTokens.background
                    border.color: ThemeTokens.border
                    TextInput {
                        anchors.fill: parent
                        anchors.margins: 4
                        text: root.btnLabel
                        color: ThemeTokens.text
                        font.pixelSize: 11
                        onTextEdited: root.btnLabel = text
                    }
                }
            }
        ]
    }

    // 2. Installation
    Column {
        width: parent.width
        spacing: 10

        Text { text: "Installation"; color: ThemeTokens.text; font.pixelSize: 18; font.weight: Font.Bold }
        CodeBlock { width: parent.width; language: "bash"; code: "pnpm add @chahu/cha-set" }
        Text { text: "Import component in your application entry:"; color: ThemeTokens.subduedText; font.pixelSize: 12 }
        CodeBlock {
            width: parent.width
            language: "qml"
            code: "import QtQuick 6.10\nimport ChaSet\n\nChaSetButton {\n    variant: \"default\"\n    size: \"default\"\n    text: \"Create Project\"\n    onClicked: console.log(\"Clicked!\")\n}"
        }
    }

    // 3. Examples
    Column {
        width: parent.width
        spacing: 20

        Text { text: "Examples"; color: ThemeTokens.text; font.pixelSize: 18; font.weight: Font.Bold }

        // Variants Example
        Column {
            width: parent.width
            spacing: 8
            Text { text: "Variants"; color: ThemeTokens.text; font.pixelSize: 15; font.weight: Font.DemiBold }
            Text { text: "Use the variant prop to change the visual hierarchy."; color: ThemeTokens.subduedText; font.pixelSize: 12 }
            Rectangle {
                width: parent.width
                height: 72
                radius: 8
                color: ThemeTokens.panel
                border.color: ThemeTokens.border
                Row {
                    anchors.centerIn: parent
                    spacing: 10
                    ChaSetButton { variant: "default"; text: "Default" }
                    ChaSetButton { variant: "secondary"; text: "Secondary" }
                    ChaSetButton { variant: "outline"; text: "Outline" }
                    ChaSetButton { variant: "ghost"; text: "Ghost" }
                    ChaSetButton { variant: "destructive"; text: "Destructive" }
                    ChaSetButton { variant: "link"; text: "Link" }
                }
            }
            CodeBlock {
                width: parent.width
                language: "qml"
                code: "ChaSetButton { variant: \"default\"; text: \"Default\" }\nChaSetButton { variant: \"secondary\"; text: \"Secondary\" }\nChaSetButton { variant: \"outline\"; text: \"Outline\" }\nChaSetButton { variant: \"ghost\"; text: \"Ghost\" }\nChaSetButton { variant: \"destructive\"; text: \"Destructive\" }\nChaSetButton { variant: \"link\"; text: \"Link\" }"
            }
        }

        // Sizes Example
        Column {
            width: parent.width
            spacing: 8
            Text { text: "Sizes"; color: ThemeTokens.text; font.pixelSize: 15; font.weight: Font.DemiBold }
            Text { text: "Available in four standardized sizes: sm (32px), default (36px), lg (40px), and icon (36×36px)."; color: ThemeTokens.subduedText; font.pixelSize: 12 }
            Rectangle {
                width: parent.width
                height: 72
                radius: 8
                color: ThemeTokens.panel
                border.color: ThemeTokens.border
                Row {
                    anchors.centerIn: parent
                    spacing: 10
                    ChaSetButton { size: "sm"; text: "Small (32px)" }
                    ChaSetButton { size: "default"; text: "Default (36px)" }
                    ChaSetButton { size: "lg"; text: "Large (40px)" }
                    ChaSetButton { size: "icon"; text: "⚙" }
                }
            }
            CodeBlock {
                width: parent.width
                language: "qml"
                code: "ChaSetButton { size: \"sm\"; text: \"Small\" }\nChaSetButton { size: \"default\"; text: \"Default\" }\nChaSetButton { size: \"lg\"; text: \"Large\" }\nChaSetButton { size: \"icon\"; text: \"⚙\" }"
            }
        }

        // States Example
        Column {
            width: parent.width
            spacing: 8
            Text { text: "States & Loading"; color: ThemeTokens.text; font.pixelSize: 15; font.weight: Font.DemiBold }
            Text { text: "Buttons handle loading and disabled states automatically, preserving width and blocking pointer events."; color: ThemeTokens.subduedText; font.pixelSize: 12 }
            Rectangle {
                width: parent.width
                height: 72
                radius: 8
                color: ThemeTokens.panel
                border.color: ThemeTokens.border
                Row {
                    anchors.centerIn: parent
                    spacing: 10
                    ChaSetButton { text: "Saving Changes"; loading: true }
                    ChaSetButton { text: "Disabled Button"; disabled: true }
                }
            }
            CodeBlock {
                width: parent.width
                language: "qml"
                code: "ChaSetButton { text: \"Saving Changes\"; loading: true }\nChaSetButton { text: \"Disabled Button\"; disabled: true }"
            }
        }
    }

    // 4. API Reference
    PropsTable {
        width: parent.width
        title: "API Reference"
        propsModel: [
            ["variant", "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'", "'default'", "Visual appearance and semantic intent."],
            ["size", "'default' | 'sm' | 'lg' | 'icon'", "'default'", "Height and padding dimensions."],
            ["loading", "bool", "false", "Shows spinning indicator and disables user interaction."],
            ["fullWidth", "bool", "false", "Stretches the button to 100% of the parent container width."],
            ["disabled", "bool", "false", "Blocks clicks and applies muted disabled styling."],
            ["iconSource", "string", "\"\"", "Optional icon image source URL."],
            ["text", "string", "\"\"", "Button label text content."]
        ]
    }
}
