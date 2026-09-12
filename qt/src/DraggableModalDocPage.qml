// DraggableModalDocPage.qml — Living Documentation for ChaSetDraggableModal
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Desktop & Virtualization"
    pageTitle: "Draggable Modal"
    description: "Desktop floating panel window with a draggable header bar, bounded parent viewport constraints, and size mode switching."
    tocItems: [
        { id: "preview", title: "Interactive Preview" },
        { id: "installation", title: "Installation" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "API Reference" }
    ]

    ComponentPreview {
        title: "Draggable Modal Preview"
        reactCode: `<DraggableModal
  title="Floating Tools"
  initialPositionMode="center"
  showEscBadge
  sizeOptions={[
    { name: "默认", special: "default" },
    { name: "宽屏", widthRem: 32, heightRem: 20 },
    { name: "全窗口", special: "fullscreen" }
  ]}
>
  <div className="p-4">Inspect active rendering targets</div>
</DraggableModal>`
        qtCode: `ChaSetDraggableModal {
    title: "Floating Tools"
    initialPositionMode: "center"
    showEscBadge: true
    sizeOptions: [
        { name: "默认", special: "default" },
        { name: "宽屏", widthRem: 32, heightRem: 20 },
        { name: "全窗口", special: "fullscreen" }
    ]
    width: 300
    height: 200
}`

        Item {
            anchors.fill: parent

            Rectangle {
                anchors.fill: parent
                color: ThemeTokens.hover
                border.color: ThemeTokens.border
                border.width: 1
                radius: 8

                Text {
                    anchors.centerIn: parent
                    text: "Drag the modal around within this bounded canvas"
                    color: ThemeTokens.subduedText
                    font.pixelSize: 12
                }

                ChaSetDraggableModal {
                    x: 40
                    y: 30
                    width: 300
                    height: 200
                    title: "Shader Debugger"
                    showEscBadge: true
                    initialPositionMode: "center"
                    sizeOptions: [
                        { name: "默认", special: "default" },
                        { name: "宽屏", widthRem: 22, heightRem: 14 },
                        { name: "全窗口", special: "fullscreen" }
                    ]

                    Column {
                        anchors.fill: parent
                        anchors.margins: 16
                        spacing: 8

                        Row {
                            spacing: 8
                            Text {
                                text: "Active Pass:"
                                color: ThemeTokens.subduedText
                                font.pixelSize: 12
                                anchors.verticalCenter: parent.verticalCenter
                            }
                            ChaSetBadge {
                                text: "G-Buffer Depth"
                                size: "sm"
                                variant: "secondary"
                            }
                        }

                        Text { text: "Format: R32G32B32A32_FLOAT"; color: ThemeTokens.subduedText; font.pixelSize: 11; font.family: "monospace" }
                        Text { text: "Dimensions: 2560 x 1440"; color: ThemeTokens.subduedText; font.pixelSize: 11 }
                        ChaSetButton { text: "Export Buffer"; size: "xs"; variant: "outline" }
                    }
                }
            }
        }
    }

    ChaSetCodeBlock {
        title: "Installation"
        code: "import ChaSet 1.0\n\nChaSetDraggableModal {\n    title: \"Inspector\"\n    initialPositionMode: \"center\"\n    width: 300\n    height: 200\n}"
        language: "qml"
    }

    KeyboardShortcutsTable {
        componentId: "draggable-modal"
    }

    PropsTable {
        title: "Props Reference"
        props: [
            { name: "title", type: "string", default: "'Inspector Window'", description: "Headline text in the drag bar." },
            { name: "open", type: "bool", default: "true", description: "Whether the floating window is currently visible." },
            { name: "customRadius", type: "int", default: "8", description: "Corner radius of the floating window." },
            { name: "initialPositionMode", type: "string", default: "'center'", description: "Initial positioning mode: 'center' or 'top'." },
            { name: "topMargin", type: "int", default: "72", description: "Top offset margin when in top position mode." },
            { name: "sizeOptions", type: "var", default: "[]", description: "Array of preset size options for dropdown switching." },
            { name: "sizeMenuTooltip", type: "string", default: "'Adjust Size'", description: "Tooltip text for the size dropdown button." },
            { name: "remBase", type: "real", default: "16", description: "Base scale ratio per rem." },
            { name: "showEscBadge", type: "bool", default: "false", description: "Whether to display the ESC keyboard shortcut badge." },
            { name: "fixedFooter", type: "Item", default: "null", description: "Fixed footer action bar item anchored to the bottom." },
            { name: "topControls", type: "Item", default: "null", description: "Custom control item rendered in the header toolbar." }
        ]
    }
}

