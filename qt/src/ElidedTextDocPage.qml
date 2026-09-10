// ElidedTextDocPage.qml — Living Documentation for ChaSetElidedText
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Data Display"
    pageTitle: "Elided Text"
    description: "Smart text truncation with automatic overflow detection and contextual tooltip reveal."
    tocItems: [
        { id: "overview", title: "Interactive Overview" },
        { id: "multiline", title: "Multi-Line Clamping" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "Props Reference" }
    ]

    property int containerWidth: 240
    property bool alwaysShow: false
    readonly property string sampleText: "C:\\Users\\Development\\Projects\\cha-set\\qt\\src\\ChaSetElidedText.qml"

    ComponentPreview {
        id: heroPreview
        title: "Interactive Sandbox"
        reactCode: `<div style={{ width: ${root.containerWidth} }}>
  <ElidedText
    text="${root.sampleText}"
    alwaysShowTooltip={${root.alwaysShow}}
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
                height: 36
                color: ThemeTokens.card
                radius: 6
                border.color: ThemeTokens.border
                border.width: 1

                ChaSetElidedText {
                    anchors.fill: parent
                    anchors.margins: 8
                    text: root.sampleText
                    alwaysShowTooltip: root.alwaysShow
                    tooltipPlacement: "top"
                }
            }
        }

        controlsData: [
            Row {
                spacing: 16
                anchors.verticalCenter: parent.verticalCenter

                Row {
                    spacing: 8
                    anchors.verticalCenter: parent.verticalCenter

                    Text {
                        anchors.verticalCenter: parent.verticalCenter
                        text: "Width: " + root.containerWidth + "px"
                        color: ThemeTokens.mutedForeground
                        font.pixelSize: 12
                    }

                    ChaSetSlider {
                        anchors.verticalCenter: parent.verticalCenter
                        width: 120
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
            }
        ]
    }

    // Multi-Line Clamping
    Text {
        text: "Multi-Line Clamping"
        font.pixelSize: 18
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

                Text {
                    width: parent.width
                    wrapMode: Text.Wrap
                    text: "Using maxLines: 2 to clamp overflowing multiline paragraphs with trailing ellipsis."
                    color: ThemeTokens.mutedForeground
                    font.pixelSize: 12
                }

                Rectangle {
                    width: Math.min(parent.width, 360)
                    height: 48
                    color: ThemeTokens.card
                    radius: 6
                    border.color: ThemeTokens.border
                    border.width: 1

                    ChaSetElidedText {
                        anchors.fill: parent
                        anchors.margins: 8
                        maxLines: 2
                        text: "ChaSet provides cross-stack design system primitives with pixel-level parity across React Web and Qt Quick desktop applications."
                        tooltipPlacement: "bottom"
                    }
                }
            }
        }
    }

    // Keyboard Navigation
    Text {
        text: "Keyboard Navigation"
        font.pixelSize: 18
        font.bold: true
        color: ThemeTokens.text
    }

    KeyboardShortcutsTable {
        componentId: "elided-text"
    }

    // Props Reference
    PropsTable {
        title: "Props Reference"
        props: [
            { name: "text", type: "string", default: "''", description: "The string content to display and measure for overflow." },
            { name: "tooltipText", type: "string", default: "''", description: "Custom tooltip text override if different from raw text." },
            { name: "tooltipPlacement", type: "string", default: "'top'", description: "Placement direction: 'top', 'bottom', 'left', 'right', 'auto'." },
            { name: "tooltipDelay", type: "int", default: "400", description: "Delay in milliseconds before showing tooltip on hover." },
            { name: "alwaysShowTooltip", type: "bool", default: "false", description: "Force tooltip to appear on hover even if text is not elided." },
            { name: "showTooltipWhenElided", type: "bool", default: "true", description: "Enable tooltip reveal whenever overflow truncation is detected." },
            { name: "maxLines", type: "int", default: "1", description: "Maximum visible lines before truncating (1 = single line, >1 = clamp)." }
        ]
    }
}
