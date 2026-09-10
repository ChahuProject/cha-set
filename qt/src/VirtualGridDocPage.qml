// VirtualGridDocPage.qml — Living Documentation for ChaSetVirtualGrid
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Desktop & Virtualization"
    pageTitle: "Virtual Grid"
    description: "2D windowed grid virtualizer for high-performance visualization of massive visual card and thumbnail matrices."
    tocItems: [
        { id: "preview", title: "Interactive Preview" },
        { id: "installation", title: "Installation" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "API Reference" }
    ]

    ComponentPreview {
        title: "Virtual Grid Preview"
        reactCode: `<VirtualGrid
  items={items}
  columnWidth={160}
  rowHeight={100}
  renderCard={(item) => <Card>{item.title}</Card>}
/>`
        qtCode: `ChaSetVirtualGrid {
    width: 360
    height: 240
    cellWidth: 160
    cellHeight: 90
    model: 1000
    delegate: Rectangle {
        // ...card delegate...
    }
}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: 12

                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "Rendering 1,000 Grid Cards with Responsive Recycling:"
                    color: ThemeTokens.subduedText
                    font.pixelSize: 12
                }

                ChaSetVirtualGrid {
                    width: 360
                    height: 220
                    cellWidth: 168
                    cellHeight: 96
                    model: 1000

                    delegate: Item {
                        width: 168
                        height: 96

                        Rectangle {
                            anchors.fill: parent
                            anchors.margins: 4
                            color: ThemeTokens.panel
                            border.color: ThemeTokens.border
                            border.width: 1
                            radius: 6

                            Column {
                                anchors.centerIn: parent
                                spacing: 4

                                Text {
                                    anchors.horizontalCenter: parent.horizontalCenter
                                    text: "Asset #" + (index + 1)
                                    color: ThemeTokens.text
                                    font.pixelSize: 12
                                    font.weight: Font.DemiBold
                                }

                                Text {
                                    anchors.horizontalCenter: parent.horizontalCenter
                                    text: "1920x1080 • PNG"
                                    color: ThemeTokens.subduedText
                                    font.pixelSize: 10
                                    font.family: "monospace"
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    CodeBlock {
        title: "Installation"
        code: "import ChaSet 1.0\n\nChaSetVirtualGrid { model: 1000; delegate: ... }"
        language: "qml"
    }

    
    KeyboardShortcutsTable {
        componentId: "virtual-grid"
    }

    PropsTable {
        title: "Props Reference"
        props: [
            { name: "model", type: "var", default: "null", description: "Number of grid items or data array." },
            { name: "cellWidth", type: "int", default: "160", description: "Width of each grid slot cell in pixels." },
            { name: "cellHeight", type: "int", default: "120", description: "Height of each grid slot cell in pixels." },
            { name: "customRadius", type: "int", default: "6", description: "Corner radius of the grid container." }
        ]
    }
}
