// ButtonDocPage.qml — Comprehensive Button Documentation matching React 1:1
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Base Primitives"
    pageTitle: "Button"
    description: "Displays a button or a component that looks like a button with multiple variants, sizes, and states."
    tocItems: [
        { id: "overview", title: "Interactive Overview" },
        { id: "anatomy", title: "Anatomy" },
        { id: "examples", title: "Examples" },
        { id: "variants", title: "Variants" },
        { id: "sizes", title: "Sizes" },
        { id: "states", title: "States" },
        { id: "animations", title: "Animations" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "Props Reference" }
    ]

    property string btnVariant: "default"
    property string btnSize: "default"
    property string btnLabel: "Button"
    property bool btnLoading: false
    property bool btnDisabled: false
    property bool btnFullWidth: false
    property bool btnPressed: false
    property int customRadius: 8
    property color cFg: ThemeTokens.text
    property color cMutedFg: ThemeTokens.subduedText
    property color cCard: ThemeTokens.panel
    property color cBorder: ThemeTokens.border
    property color cPrimary: ThemeTokens.accent
    property color cAccentBg: ThemeTokens.hover

    readonly property bool isIconSize: btnSize === "icon" || btnSize === "icon-xs" || btnSize === "icon-sm" || btnSize === "icon-lg"

    signal logAction(string msg)

    // 1. Interactive Preview Hero
    ComponentPreview {
        title: "Interactive Button Sandbox"
        reactCode: `<Button
  variant="${root.btnVariant}"
  size="${root.btnSize}"${root.btnLoading ? '\n  loading' : ''}${root.btnDisabled ? '\n  disabled' : ''}${root.btnFullWidth ? '\n  fullWidth' : ''}${root.btnPressed ? '\n  pressed' : ''}
>
  ${root.isIconSize ? '<SettingsIcon className="size-4" />' : root.btnLabel}
</Button>`
        qtCode: `ChaSetButton {
    variant: "${root.btnVariant}"
    size: "${root.btnSize}"
    text: "${root.isIconSize ? '' : root.btnLabel}"
    loading: ${root.btnLoading}
    disabled: ${root.btnDisabled}
    fullWidth: ${root.btnFullWidth}
    pressed: ${root.btnPressed}
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
                text: root.isIconSize ? "" : root.btnLabel
                loading: root.btnLoading
                disabled: root.btnDisabled
                pressed: root.btnPressed
                width: root.btnFullWidth ? Math.min(parent.width - 48, 360) : implicitWidth
            }
        }

        // Bottom Controls Bar
        controlsData: [
            Row {
                spacing: 6
                DocText { text: "Variant:"; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeCaption; anchors.verticalCenter: parent.verticalCenter }
                ChaSetSegmentedControl {
                    size: "sm"
                    value: root.btnVariant
                    options: [
                        { label: "Default", value: "default" },
                        { label: "Secondary", value: "secondary" },
                        { label: "Outline", value: "outline" },
                        { label: "Ghost", value: "ghost" },
                        { label: "Destructive", value: "destructive" },
                        { label: "Link", value: "link" }
                    ]
                    onValueSelected: function(v) { root.btnVariant = String(v); }
                }
            },
            Row {
                spacing: 6
                DocText { text: "Size:"; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeCaption; anchors.verticalCenter: parent.verticalCenter }
                ChaSetSegmentedControl {
                    size: "sm"
                    value: root.btnSize
                    options: [
                        { label: "XS", value: "xs" },
                        { label: "SM", value: "sm" },
                        { label: "Default", value: "default" },
                        { label: "LG", value: "lg" },
                        { label: "Icon", value: "icon" },
                        { label: "Icon-XS", value: "icon-xs" },
                        { label: "Icon-SM", value: "icon-sm" },
                        { label: "Icon-LG", value: "icon-lg" }
                    ]
                    onValueSelected: function(s) { root.btnSize = String(s); }
                }
            },
            Row {
                spacing: 12
                ChaSetCheckbox {
                    size: "sm"
                    label: "Loading"
                    checked: root.btnLoading
                    onToggled: (val) => root.btnLoading = val
                }
                ChaSetCheckbox {
                    size: "sm"
                    label: "Disabled"
                    checked: root.btnDisabled
                    onToggled: (val) => root.btnDisabled = val
                }
                ChaSetCheckbox {
                    size: "sm"
                    label: "Full Width"
                    checked: root.btnFullWidth
                    onToggled: (val) => root.btnFullWidth = val
                }
                ChaSetCheckbox {
                    size: "sm"
                    label: "Pressed"
                    checked: root.btnPressed
                    onToggled: (val) => root.btnPressed = val
                }
            },
            Row {
                visible: !root.isIconSize
                spacing: 6
                DocText { text: "Label:"; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeCaption; anchors.verticalCenter: parent.verticalCenter }
                ChaSetInput {
                    width: ThemeTokens.dp(100)
                    size: "sm"
                    customRadius: ThemeTokens.dp(4)
                    text: root.btnLabel
                    onTextEdited: root.btnLabel = text
                }
            }
        ]
    }

    // 2. Anatomy
    DocAnatomy {
        width: parent.width
        qtCode: "import ChaSet\n\nChaSetButton {\n    text: \"Button\"\n}"
        reactCode: "import { Button } from '@chahu/cha-set';\n\n<Button variant=\"default\">Button</Button>"
    }

    // 3. Examples
    Column {
        width: parent.width
        spacing: ThemeTokens.dp(20)

        DocText { text: "Examples"; textColor: ThemeTokens.text; font.pixelSize: Typography.sizeTitleSm; font.weight: Typography.weightBold }

        // Variants Example
        Column {
            width: parent.width
            spacing: ThemeTokens.dp(8)
            DocText { text: "Variants"; textColor: ThemeTokens.text; font.pixelSize: Typography.sizeHeading; font.weight: Typography.weightSemibold }
            DocText { text: "Use the variant prop to change the visual hierarchy."; isMuted: true; font.pixelSize: Typography.sizeSmall }
            ChaSetCard {
                width: parent.width
                customRadius: ThemeTokens.dp(8)

                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(16)
                    bottomPadding: ThemeTokens.dp(16)

                    Row {
                        anchors.horizontalCenter: parent.horizontalCenter
                        spacing: ThemeTokens.dp(10)
                        ChaSetButton { variant: "default"; text: "Default" }
                        ChaSetButton { variant: "secondary"; text: "Secondary" }
                        ChaSetButton { variant: "outline"; text: "Outline" }
                        ChaSetButton { variant: "ghost"; text: "Ghost" }
                        ChaSetButton { variant: "destructive"; text: "Destructive" }
                        ChaSetButton { variant: "link"; text: "Link" }
                    }
                }
            }
            ChaSetCodeBlock {
                width: parent.width
                language: "qml"
                code: "ChaSetButton { variant: \"default\"; text: \"Default\" }\nChaSetButton { variant: \"secondary\"; text: \"Secondary\" }\nChaSetButton { variant: \"outline\"; text: \"Outline\" }\nChaSetButton { variant: \"ghost\"; text: \"Ghost\" }\nChaSetButton { variant: \"destructive\"; text: \"Destructive\" }\nChaSetButton { variant: \"link\"; text: \"Link\" }"
            }
        }

        // Sizes Example
        Column {
            width: parent.width
            spacing: ThemeTokens.dp(8)
            DocText { text: "Sizes"; textColor: ThemeTokens.text; font.pixelSize: Typography.sizeHeading; font.weight: Typography.weightSemibold }
            DocText { text: "Available in standardized sizes: xs, sm, default, lg, and icon variants."; isMuted: true; font.pixelSize: Typography.sizeSmall }
            ChaSetCard {
                width: parent.width
                customRadius: ThemeTokens.dp(8)

                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(16)
                    bottomPadding: ThemeTokens.dp(16)

                    Row {
                        anchors.horizontalCenter: parent.horizontalCenter
                        spacing: ThemeTokens.dp(10)
                        ChaSetButton { size: "xs"; text: "Extra Small" }
                        ChaSetButton { size: "sm"; text: "Small" }
                        ChaSetButton { size: "default"; text: "Default" }
                        ChaSetButton { size: "lg"; text: "Large" }
                        ChaSetButton { size: "icon"; icon: "settings" }
                    }
                }
            }
            ChaSetCodeBlock {
                width: parent.width
                language: "qml"
                code: "ChaSetButton { size: \"xs\"; text: \"Extra Small\" }\nChaSetButton { size: \"sm\"; text: \"Small\" }\nChaSetButton { size: \"default\"; text: \"Default\" }\nChaSetButton { size: \"lg\"; text: \"Large\" }\nChaSetButton { size: \"icon\"; icon: \"settings\" }"
            }
        }

        // States Example
        Column {
            width: parent.width
            spacing: ThemeTokens.dp(8)
            DocText { text: "States & Loading"; textColor: ThemeTokens.text; font.pixelSize: Typography.sizeHeading; font.weight: Typography.weightSemibold }
            DocText { text: "Buttons handle loading, pressed, and disabled states automatically, preserving width and blocking pointer events."; isMuted: true; font.pixelSize: Typography.sizeSmall }
            ChaSetCard {
                width: parent.width
                customRadius: ThemeTokens.dp(8)

                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(16)
                    bottomPadding: ThemeTokens.dp(16)

                    Row {
                        anchors.horizontalCenter: parent.horizontalCenter
                        spacing: ThemeTokens.dp(10)
                        ChaSetButton { text: "Saving Changes"; loading: true; loadingText: "Saving..." }
                        ChaSetButton { text: "Active Toggle"; pressed: true }
                        ChaSetButton { text: "Disabled Button"; disabled: true }
                    }
                }
            }
            ChaSetCodeBlock {
                width: parent.width
                language: "qml"
                code: "ChaSetButton { text: \"Saving Changes\"; loading: true; loadingText: \"Saving...\" }\nChaSetButton { text: \"Active Toggle\"; pressed: true }\nChaSetButton { text: \"Disabled Button\"; disabled: true }"
            }
        }
    }

    // 4. Footer Sections (Animations, Keyboard, Props)
    DocFooterSections {
        width: parent.width
        componentId: "button"
        propsModel: [
            ["variant", "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'", "'default'", "Visual appearance and semantic intent."],
            ["size", "'default' | 'sm' | 'lg' | 'icon' | 'xs' | 'icon-xs' | 'icon-sm' | 'icon-lg'", "'default'", "Standardized dimensions scale."],
            ["loading", "bool", "false", "Shows spinning indicator and disables user interaction."],
            ["loadingText", "string", "\"\"", "Optional label displayed while in loading state."],
            ["pressed", "bool", "false", "Toggle or selected state with active styling."],
            ["fullWidth", "bool", "false", "Stretches the button to 100% of the parent container width."],
            ["disabled", "bool", "false", "Blocks clicks and applies muted disabled styling."],
            ["iconSource", "string", "\"\"", "Optional icon image source URL."],
            ["iconPosition", "string", "\"left\"", "Placement of iconSource: left or right."],
            ["text", "string", "\"\"", "Button label text content."]
        ]
    }
}
