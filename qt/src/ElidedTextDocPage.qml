// ElidedTextDocPage.qml — Living Documentation for ChaSetElidedText
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Base Primitives"
    pageTitle: "Elided Text"
    description: "Smart text truncation with automatic overflow detection and contextual tooltip reveal."
    tocItems: [
        { id: "overview", title: "Interactive Overview" },
        { id: "anatomy", title: "Anatomy" },
        { id: "multiline", title: "Multi-Line Clamping" },
        { id: "animations", title: "Animations" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "Props Reference" }
    ]

    property int containerWidth: 240
    property bool alwaysShow: false
    property bool copyable: true
    readonly property string sampleText: "C:\\Users\\Development\\Projects\\cha-set\\qt\\src\\ChaSetElidedText.qml"

    ComponentPreview {
        id: heroPreview
        title: "Elided Text Sandbox"
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
                        text: "Width: " + root.containerWidth
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
                    text: "Always Show: " + (root.alwaysShow ? "On" : "Off")
                    onClicked: root.alwaysShow = !root.alwaysShow
                }

                ChaSetButton {
                    size: "sm"
                    variant: root.copyable ? "default" : "outline"
                    text: "Copyable: " + (root.copyable ? "On" : "Off")
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
        text: "Multi-Line Clamping"
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
                    text: "Using maxLines: 2 to clamp overflowing multiline paragraphs with trailing ellipsis."
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
                        text: "ChaSet provides cross-stack design system primitives with pixel-level parity across React Web and Qt Quick desktop applications."
                        tooltipPlacement: "bottom"
                    }
                }
            }
        }
    }

    // Footer Sections (Animations, Keyboard, Props)
    DocFooterSections {
        width: parent.width
        componentId: "elided-text"
        propsModel: [
            { name: "text", type: "string", default: "''", description: "The string content to display and measure for overflow." },
            { name: "tooltipText", type: "string", default: "''", description: "Custom tooltip text override if different from raw text." },
            { name: "tooltipPlacement", type: "string", default: "'top'", description: "Placement direction: 'top', 'bottom', 'left', 'right', 'auto'." },
            { name: "tooltipDelay", type: "int", default: "400", description: "Delay in milliseconds before showing tooltip on hover." },
            { name: "alwaysShowTooltip", type: "bool", default: "false", description: "Force tooltip to appear on hover even if text is not elided." },
            { name: "showTooltipWhenElided", type: "bool", default: "true", description: "Enable tooltip reveal whenever overflow truncation is detected." },
            { name: "maxLines", type: "int", default: "1", description: "Maximum visible lines before truncating (1 = single line, >1 = clamp)." },
            { name: "copyable", type: "bool", default: "false", description: "Whether clicking the text copies it to clipboard with instant feedback." }
        ]
    }
}

