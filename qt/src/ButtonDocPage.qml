// ButtonDocPage.qml — Comprehensive Button Documentation matching React 1:1
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Base Primitives"
    pageTitle: "Button"
    description: ChaSetI18n.tr("components.button.description", "Displays a button or a component that looks like a button with multiple variants, sizes, and states.")

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
        title: ChaSetI18n.tr("desktopComposite.button.sandboxTitle", "Interactive Button Sandbox")
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
                DocText { text: ChaSetI18n.tr("common.variant", "Variant:"); color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeCaption; anchors.verticalCenter: parent.verticalCenter }
                ChaSetSegmentedControl {
                    size: "sm"
                    value: root.btnVariant
                    options: [
                        { label: ChaSetI18n.tr("common.default", "Default"), value: "default" },
                        { label: ChaSetI18n.tr("common.secondary", "Secondary"), value: "secondary" },
                        { label: ChaSetI18n.tr("common.outline", "Outline"), value: "outline" },
                        { label: ChaSetI18n.tr("common.ghost", "Ghost"), value: "ghost" },
                        { label: ChaSetI18n.tr("common.destructive", "Destructive"), value: "destructive" },
                        { label: ChaSetI18n.tr("common.link", "Link"), value: "link" },
                        { label: ChaSetI18n.tr("common.overlay", "Overlay"), value: "overlay" }
                    ]
                    onValueSelected: function(v) { root.btnVariant = String(v); }
                }
            },
            Row {
                spacing: 6
                DocText { text: ChaSetI18n.tr("common.size", "Size:"); color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeCaption; anchors.verticalCenter: parent.verticalCenter }
                ChaSetSegmentedControl {
                    size: "sm"
                    value: root.btnSize
                    options: [
                        { label: "XS", value: "xs" },
                        { label: "SM", value: "sm" },
                        { label: ChaSetI18n.tr("common.default", "Default"), value: "default" },
                        { label: "LG", value: "lg" },
                        { label: ChaSetI18n.tr("desktopComposite.button.iconLabel", "Icon"), value: "icon" },
                        { label: ChaSetI18n.tr("desktopComposite.button.iconXsLabel", "Icon-XS"), value: "icon-xs" },
                        { label: ChaSetI18n.tr("desktopComposite.button.iconSmLabel", "Icon-SM"), value: "icon-sm" },
                        { label: ChaSetI18n.tr("desktopComposite.button.iconLgLabel", "Icon-LG"), value: "icon-lg" }
                    ]
                    onValueSelected: function(s) { root.btnSize = String(s); }
                }
            },
            Row {
                spacing: 12
                ChaSetCheckbox {
                    size: "sm"
                    label: ChaSetI18n.tr("common.loading", "Loading")
                    checked: root.btnLoading
                    onToggled: (val) => root.btnLoading = val
                }
                ChaSetCheckbox {
                    size: "sm"
                    label: ChaSetI18n.tr("common.disabled", "Disabled")
                    checked: root.btnDisabled
                    onToggled: (val) => root.btnDisabled = val
                }
                ChaSetCheckbox {
                    size: "sm"
                    label: ChaSetI18n.tr("common.fullWidth", "Full Width")
                    checked: root.btnFullWidth
                    onToggled: (val) => root.btnFullWidth = val
                }
                ChaSetCheckbox {
                    size: "sm"
                    label: ChaSetI18n.tr("common.pressed", "Pressed")
                    checked: root.btnPressed
                    onToggled: (val) => root.btnPressed = val
                }
            },
            Row {
                visible: !root.isIconSize
                spacing: 6
                DocText { text: ChaSetI18n.tr("common.label", "Label:"); color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeCaption; anchors.verticalCenter: parent.verticalCenter }
                ChaSetInput {
                    width: ThemeTokens.dp(100)
                    size: "sm"
                    customRadius: 4
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
        property string sectionId: "states"
        property string sectionTitle: ChaSetI18n.tr("showcase.examplesAndStates", "Examples & States")
        width: parent.width
        spacing: ThemeTokens.dp(20)

        DocText { text: ChaSetI18n.tr("showcase.examplesAndStates", "Examples & States"); textColor: ThemeTokens.text; font.pixelSize: Typography.sizeTitleSm; font.weight: Typography.weightBold }

        // Variants Example
        Column {
            width: parent.width
            spacing: ThemeTokens.dp(8)
            DocText { text: ChaSetI18n.tr("components.button.variantsTitle", "Variants"); textColor: ThemeTokens.text; font.pixelSize: Typography.sizeHeading; font.weight: Typography.weightSemibold }
            DocText { text: ChaSetI18n.tr("components.button.variantsDesc", "Use the variant prop to change the visual hierarchy."); isMuted: true; font.pixelSize: Typography.sizeSmall }
            ChaSetCard {
                width: parent.width
                customRadius: 8

                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(16)
                    bottomPadding: ThemeTokens.dp(16)

                    Row {
                        anchors.horizontalCenter: parent.horizontalCenter
                        spacing: ThemeTokens.dp(10)
                        ChaSetButton { variant: "default"; text: ChaSetI18n.tr("common.default", "Default") }
                        ChaSetButton { variant: "secondary"; text: ChaSetI18n.tr("common.secondary", "Secondary") }
                        ChaSetButton { variant: "outline"; text: ChaSetI18n.tr("common.outline", "Outline") }
                        ChaSetButton { variant: "ghost"; text: ChaSetI18n.tr("common.ghost", "Ghost") }
                        ChaSetButton { variant: "destructive"; text: ChaSetI18n.tr("common.destructive", "Destructive") }
                        ChaSetButton { variant: "link"; text: ChaSetI18n.tr("common.link", "Link") }
                        ChaSetButton { variant: "overlay"; text: ChaSetI18n.tr("common.overlay", "Overlay") }
                    }
                }
            }
            ChaSetCodeBlock {
                width: parent.width
                language: "qml"
                code: "ChaSetButton { variant: \"default\"; text: \"Default\" }\nChaSetButton { variant: \"secondary\"; text: \"Secondary\" }\nChaSetButton { variant: \"outline\"; text: \"Outline\" }\nChaSetButton { variant: \"ghost\"; text: \"Ghost\" }\nChaSetButton { variant: \"destructive\"; text: \"Destructive\" }\nChaSetButton { variant: \"link\"; text: \"Link\" }\nChaSetButton { variant: \"overlay\"; text: \"Overlay\" }"
            }
        }

        // Sizes Example
        Column {
            width: parent.width
            spacing: ThemeTokens.dp(8)
            DocText { text: ChaSetI18n.tr("components.button.sizesTitle", "Sizes"); textColor: ThemeTokens.text; font.pixelSize: Typography.sizeHeading; font.weight: Typography.weightSemibold }
            DocText { text: ChaSetI18n.tr("components.button.sizesDesc", "Available in standardized sizes: xs, sm, default, lg, and icon variants."); isMuted: true; font.pixelSize: Typography.sizeSmall }
            ChaSetCard {
                width: parent.width
                customRadius: 8

                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(16)
                    bottomPadding: ThemeTokens.dp(16)

                    Row {
                        anchors.horizontalCenter: parent.horizontalCenter
                        spacing: ThemeTokens.dp(10)
                        ChaSetButton { size: "xs"; text: ChaSetI18n.tr("components.button.extraSmall", "Extra Small") }
                        ChaSetButton { size: "sm"; text: ChaSetI18n.tr("components.button.small", "Small") }
                        ChaSetButton { size: "default"; text: ChaSetI18n.tr("common.default", "Default") }
                        ChaSetButton { size: "lg"; text: ChaSetI18n.tr("components.button.large", "Large") }
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
            DocText { text: ChaSetI18n.tr("components.button.statesTitle", "States & Loading"); textColor: ThemeTokens.text; font.pixelSize: Typography.sizeHeading; font.weight: Typography.weightSemibold }
            DocText { text: ChaSetI18n.tr("components.button.statesDesc", "Buttons handle loading, pressed, and disabled states automatically, preserving width and blocking pointer events."); isMuted: true; font.pixelSize: Typography.sizeSmall }
            ChaSetCard {
                width: parent.width
                customRadius: 8

                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(16)
                    bottomPadding: ThemeTokens.dp(16)

                    Row {
                        anchors.horizontalCenter: parent.horizontalCenter
                        spacing: ThemeTokens.dp(10)
                        ChaSetButton { text: ChaSetI18n.tr("common.saveChanges", "Saving Changes"); loading: true; loadingText: ChaSetI18n.tr("common.saving", "Saving...") }
                        ChaSetButton { text: ChaSetI18n.tr("components.button.activeToggle", "Active Toggle"); pressed: true }
                        ChaSetButton { text: ChaSetI18n.tr("components.button.disabledButton", "Disabled Button"); disabled: true }
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
        // Animations
    Column {
        width: parent.width
        spacing: ThemeTokens.dp(8)

        DocText {
            text: ChaSetI18n.tr("showcase.animations", "Animations")
            font.pixelSize: Typography.sizeTitleSm
            font.weight: Typography.weightBold
            color: ThemeTokens.text
        }

        DocText {
            text: ChaSetI18n.tr("showcase.animationsDescQml", "State changes (hover, press, focus) animate over duration-quick with standard easing curves. Durations and easing resolve from theme tokens; prefers-reduced-motion zeroes them automatically (governed by ThemeTokens.animationsEnabled).")
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }
    }

    ComponentReference {
        name: "Button"
        componentId: "button"
        propsModel: [
            ["variant", "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'overlay'", "'default'", ChaSetI18n.tr("components.button.variantDesc", "Visual appearance and semantic intent.")],
            ["size", "'default' | 'sm' | 'lg' | 'icon' | 'xs' | 'icon-xs' | 'icon-sm' | 'icon-lg'", "'default'", ChaSetI18n.tr("components.button.sizeDesc", "Standardized dimensions scale.")],
            ["loading", "bool", "false", ChaSetI18n.tr("components.button.loadingDesc", "Shows spinning indicator and disables user interaction.")],
            ["loadingText", "string", "\"\"", ChaSetI18n.tr("components.button.loadingTextDesc", "Optional content displayed while in loading state.")],
            ["pressed", "bool", "false", ChaSetI18n.tr("components.button.pressedDesc", "Toggle or selected state with active styling and aria-pressed.")],
            ["fullWidth", "bool", "false", ChaSetI18n.tr("components.button.fullWidthDesc", "Stretches the button to 100% of the parent container width.")],
            ["disabled", "bool", "false", ChaSetI18n.tr("components.button.disabledDesc", "Blocks clicks and applies muted disabled styling.")],
            ["iconSource", "string", "\"\"", ChaSetI18n.tr("components.button.iconSourceDesc", "Optional icon image source URL.")],
            ["iconPosition", "string", "\"left\"", ChaSetI18n.tr("components.button.iconPositionDesc", "Placement of iconSource: left or right.")],
            ["iconSize", "int", "0", ChaSetI18n.tr("components.button.iconSizeDesc", "Logical unscaled icon size; enlarges or overrides icons rendered inside the button.")],
            ["text", "string", "\"\"", ChaSetI18n.tr("components.button.textDesc", "Button label text content.")]
        ]
    }
    }