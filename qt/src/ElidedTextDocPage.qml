// ElidedTextDocPage.qml — Living Documentation for ChaSetElidedText
import QtQuick
import QtQuick.Controls
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

    DocMarkdown {
        width: parent.width
        docId: "elided-text"
        section: "animations"
    }

    DocMarkdown {
        width: parent.width
        docId: "elided-text"
        section: "keyboard"
    }

    DocMarkdown {
        width: parent.width
        docId: "elided-text"
        section: "props"
    }
    }