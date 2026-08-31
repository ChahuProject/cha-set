// ButtonDocPage.qml — Comprehensive Button Documentation matching React 1:1
import QtQuick 6.10
import QtQuick.Controls 6.10
import chaSet

DocLayout {
    id: root
    category: "Components"
    pageTitle: "Button"
    description: "A versatile button component with multiple variants, sizes, and states. Neutral contract implemented via @base-ui/react on Web and pure QML on Desktop."
    tocItems: [
        { id: "preview", title: "Interactive Preview" },
        { id: "variants", title: "Variants & Hierarchy" },
        { id: "sizes", title: "Sizes" },
        { id: "states", title: "Interactive States" },
        { id: "props", title: "API Reference" }
    ]

    property string btnVariant: "primary"
    property string btnSize: "md"
    property string btnLabel: "Create Project"
    property bool btnLoading: false
    property bool btnDisabled: false
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
        title: "Button Sandbox"
        reactCode: `<Button
  variant="${root.btnVariant}"
  size="${root.btnSize}"
  loading={${root.btnLoading}}
  disabled={${root.btnDisabled}}
>
  ${root.btnLabel}
</Button>`
        qtCode: `ChaSetButton {
    variant: "${root.btnVariant}"
    size: "${root.btnSize}"
    text: "${root.btnLabel}"
    loading: ${root.btnLoading}
    disabled: ${root.btnDisabled}
}`

        // Center Stage Container
        Rectangle {
            anchors.fill: parent
            color: "transparent"

            ChaSetButton {
                anchors.centerIn: parent
                variant: root.btnVariant
                size: root.btnSize
                text: root.btnLabel
                loading: root.btnLoading
                disabled: root.btnDisabled
            }
        }

        // Bottom Controls Bar
        controlsData: [
            Row {
                spacing: 6
                Text { text: "Variant:"; color: ThemeTokens.subduedText; font.pixelSize: 11; anchors.verticalCenter: parent.verticalCenter }
                Repeater {
                    model: ["primary", "secondary", "destructive", "ghost"]
                    delegate: Rectangle {
                        required property var modelData
                        width: 68; height: 26; radius: 5
                        color: root.btnVariant === modelData ? ThemeTokens.accent : ThemeTokens.panel
                        border.color: ThemeTokens.border
                        Text { anchors.centerIn: parent; text: modelData; color: root.btnVariant === modelData ? "#ffffff" : ThemeTokens.text; font.pixelSize: 11; font.weight: Font.Medium }
                        MouseArea { anchors.fill: parent; cursorShape: Qt.PointingHandCursor; onClicked: root.btnVariant = modelData }
                    }
                }
            },
            Row {
                spacing: 6
                Text { text: "Size:"; color: ThemeTokens.subduedText; font.pixelSize: 11; anchors.verticalCenter: parent.verticalCenter }
                Repeater {
                    model: ["sm", "md", "lg"]
                    delegate: Rectangle {
                        required property var modelData
                        width: 36; height: 26; radius: 5
                        color: root.btnSize === modelData ? ThemeTokens.accent : ThemeTokens.panel
                        border.color: ThemeTokens.border
                        Text { anchors.centerIn: parent; text: modelData; color: root.btnSize === modelData ? "#ffffff" : ThemeTokens.text; font.pixelSize: 11; font.weight: Font.Medium }
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
            }
        ]
    }
}
