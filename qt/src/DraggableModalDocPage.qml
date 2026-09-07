// DraggableModalDocPage.qml — Living Documentation for ChaSetDraggableModal
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Desktop & Virtualization"
    pageTitle: "Draggable Modal"
    description: "Desktop floating panel window with a draggable header bar and bounded parent viewport constraints."
    tocItems: [
        { id: "preview", title: "Interactive Preview" },
        { id: "installation", title: "Installation" },
        { id: "props", title: "API Reference" }
    ]

    ComponentPreview {
        title: "Draggable Modal Preview"
        reactCode: `<DraggableModal title="Floating Tools" open={open} onClose={() => setOpen(false)}>
  <div className="p-4">Inspect active rendering targets</div>
</DraggableModal>`
        qtCode: `ChaSetDraggableModal {
    title: "Floating Tools"
    open: true
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
                    width: 280
                    height: 180
                    title: "Shader Debugger"

                    Column {
                        anchors.fill: parent
                        anchors.margins: 16
                        spacing: 8

                        Text { text: "Active Pass: G-Buffer Depth"; color: ThemeTokens.text; font.pixelSize: 12 }
                        Text { text: "Format: R32G32B32A32_FLOAT"; color: ThemeTokens.subduedText; font.pixelSize: 11; font.family: "monospace" }
                        Text { text: "Dimensions: 2560 x 1440"; color: ThemeTokens.subduedText; font.pixelSize: 11 }
                        ChaSetButton { text: "Export Buffer"; size: "xs"; variant: "outline" }
                    }
                }
            }
        }
    }

    CodeBlock {
        title: "Installation"
        code: "import ChaSet 1.0\n\nChaSetDraggableModal { title: \"Inspector\"; width: 300; height: 200 }"
        language: "qml"
    }

    PropsTable {
        title: "Props Reference"
        props: [
            { name: "title", type: "string", default: "'Inspector Window'", description: "Headline text in the drag bar." },
            { name: "open", type: "bool", default: "true", description: "Whether the floating window is currently visible." },
            { name: "customRadius", type: "int", default: "8", description: "Corner radius of the floating window." }
        ]
    }
}
