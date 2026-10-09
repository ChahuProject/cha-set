// ElidedTextDocPage.qml — Living Documentation for ChaSetElidedText
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Base Primitives"
    pageTitle: "Elided Text"
    description: ChaSetI18n.tr("components.elided-text.description", "Smart text truncation with automatic overflow detection, click-to-copy, and contextual tooltip reveal.")

    property int containerWidth: 240
    property bool alwaysShow: false
    property bool copyable: true
    readonly property string sampleText: "C:\\Users\\Development\\Projects\\cha-set\\qt\\src\\ChaSetElidedText.qml"

    ComponentPreview {
        id: heroPreview
        title: ChaSetI18n.tr("showcase.previewTitles.Elided Text Sandbox", "Elided Text Sandbox")
        reactCode: `<div style={{ width: '${(root.containerWidth / 16).toFixed(3)}rem' }}>
  <ElidedText
    text="${root.sampleText}"
    alwaysShowTooltip={${root.alwaysShow}}
    copyable={${root.copyable}}
    tooltipPlacement="top"
  />
</div>`
        qtCode: `Item {
    width: ${root.containerWidth}
    height: 32

    ChaSetElidedText {
        anchors.fill: parent
        text: "${root.sampleText}"
        alwaysShowTooltip: ${root.alwaysShow}
        copyable: ${root.copyable}
        tooltipPlacement: "top"
    }
}`

        // Stage Container
        Rectangle {
            anchors.fill: parent
            color: "transparent"

            Rectangle {
                anchors.centerIn: parent
                width: root.containerWidth
                height: ThemeTokens.dp(36)
                color: ThemeTokens.panel
                radius: ThemeTokens.dp(6)
                border.color: ThemeTokens.border
                border.width: 1

                ChaSetElidedText {
                    anchors.fill: parent
                    anchors.margins: ThemeTokens.dp(8)
                    text: root.sampleText
                    alwaysShowTooltip: root.alwaysShow
                    copyable: root.copyable
                    tooltipPlacement: "top"
                }
            }
        }

        controlsData: [
            Row {
                spacing: ThemeTokens.dp(16)

                Row {
                    spacing: ThemeTokens.dp(8)
                    anchors.verticalCenter: parent.verticalCenter

                    DocText {
                        anchors.verticalCenter: parent.verticalCenter
                        text: ChaSetI18n.tr("components.elided-text.widthLabel", "Width: {{width}}", { "width": root.containerWidth })
                        color: ThemeTokens.subduedText
                        font.pixelSize: Typography.sizeSmall
                    }

                    ChaSetSlider {
                        anchors.verticalCenter: parent.verticalCenter
                        width: ThemeTokens.dp(120)
                        min: 120
                        max: 440
                        step: 10
                        value: root.containerWidth
                        onValueChanged: root.containerWidth = Math.round(value)
                    }
                }

                ChaSetButton {
                    size: "sm"
                    variant: root.alwaysShow ? "default" : "outline"
                    text: ChaSetI18n.tr("components.elided-text.alwaysShow", "Always Show: {{status}}", { "status": root.alwaysShow ? ChaSetI18n.tr("components.elided-text.on", "On") : ChaSetI18n.tr("components.elided-text.off", "Off") })
                    onClicked: root.alwaysShow = !root.alwaysShow
                }

                ChaSetButton {
                    size: "sm"
                    variant: root.copyable ? "default" : "outline"
                    text: ChaSetI18n.tr("components.elided-text.copyable", "Copyable: {{status}}", { "status": root.copyable ? ChaSetI18n.tr("components.elided-text.on", "On") : ChaSetI18n.tr("components.elided-text.off", "Off") })
                    onClicked: root.copyable = !root.copyable
                }
            }
        ]
    }

    // Anatomy
    DocAnatomy {
        width: parent.width
        qtCode: "import ChaSet\n\nChaSetElidedText {\n    text: \"Sample text...\"\n    width: parent.width\n}"
        reactCode: "import { ElidedText } from '@chahu/cha-set';\n\n<ElidedText text=\"Sample text...\" />"
    }

    // Multi-Line Clamping
    DocText {
        property string sectionId: "multi-line-clamping"
        property string sectionTitle: ChaSetI18n.tr("components.elided-text.multiLineTitle", "Multi-Line Clamping")
        text: ChaSetI18n.tr("components.elided-text.multiLineTitle", "Multi-Line Clamping")
        font.pixelSize: Typography.sizeTitleSm
        font.bold: true
        color: ThemeTokens.text
    }

    ChaSetCard {
        width: parent.width

        ChaSetCardContent {
            topPadding: 16
            bottomPadding: 16
            horizontalPadding: 16

            Column {
                spacing: 12
                width: parent.width

                DocText {
                    width: parent.width
                    wrapMode: TextEdit.Wrap
                    text: ChaSetI18n.tr("components.elided-text.multiLineDesc", "Using maxLines: 2 to clamp overflowing multiline paragraphs with trailing ellipsis.")
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeSmall
                }

                Rectangle {
                    width: Math.min(parent.width, ThemeTokens.dp(360))
                    height: ThemeTokens.dp(48)
                    color: ThemeTokens.panel
                    radius: ThemeTokens.dp(6)
                    border.color: ThemeTokens.border
                    border.width: 1

                    ChaSetElidedText {
                        anchors.fill: parent
                        anchors.margins: ThemeTokens.dp(8)
                        maxLines: 2
                        text: ChaSetI18n.tr("components.elided-text.sampleParagraph", "ChaSet provides cross-stack design system primitives with pixel-level parity across React Web and Qt Quick desktop applications.")
                        tooltipPlacement: "bottom"
                    }
                }
            }
        }
    }

    // Footer Sections (Animations, Keyboard, Props)
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
        name: "ElidedText"
        componentId: "elided-text"
        propsModel: [
            { name: "text", type: "string", default: "''", description: ChaSetI18n.tr("components.elidedText.textDesc", "The string content to display and measure for overflow.") },
            { name: "tooltipText", type: "string", default: "''", description: ChaSetI18n.tr("components.elidedText.tooltipTextDesc", "Custom tooltip text override if different from raw text.") },
            { name: "tooltipPlacement", type: "string", default: "'top'", description: ChaSetI18n.tr("components.elidedText.tooltipPlacementDesc", "Placement direction of the floating tooltip.") },
            { name: "tooltipDelay", type: "int", default: "400", description: ChaSetI18n.tr("components.elidedText.tooltipDelayDesc", "Delay in milliseconds before showing tooltip on hover.") },
            { name: "alwaysShowTooltip", type: "bool", default: "false", description: ChaSetI18n.tr("components.elidedText.alwaysShowTooltipDesc", "Force tooltip to appear on hover even if text is not elided.") },
            { name: "showTooltipWhenElided", type: "bool", default: "true", description: ChaSetI18n.tr("components.elidedText.showTooltipWhenElidedDesc", "Enable tooltip reveal whenever overflow truncation is detected.") },
            { name: "maxLines", type: "int", default: "1", description: ChaSetI18n.tr("components.elidedText.maxLinesDesc", "Maximum visible lines before truncating (1 = single line, >1 = clamp).") },
            { name: "copyable", type: "bool", default: "false", description: ChaSetI18n.tr("components.elidedText.copyableDesc", "Whether clicking the text copies it to clipboard with instant feedback.") }
        ]
    }
    }