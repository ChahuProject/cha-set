// VirtualListDocPage.qml — Living Documentation for ChaSetVirtualList
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Desktop & Virtualization"
    pageTitle: "Virtual List"
    description: "High-performance windowed virtualized list for handling 100k+ rows with native desktop wheel kinematics and delegate recycling."
    tocItems: [
        { id: "preview", title: "Interactive Preview" },
        { id: "installation", title: "Installation" },
        { id: "props", title: "API Reference" }
    ]

    ComponentPreview {
        title: "Virtual List Preview"
        reactCode: `<VirtualList
  items={items}
  estimateSize={36}
  renderItem={(item) => (
    <div className="flex justify-between px-3 h-9">
      <span>{item.title}</span>
      <Badge>{item.tag}</Badge>
    </div>
  )}
/>`
        qtCode: `ChaSetVirtualList {
    width: 340
    height: 260
    model: 10000
    delegate: Rectangle {
        width: parent.width
        height: 36
        // ...delegate...
    }
}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: 12

                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "Rendering 10,000 Virtual Items with Native Wheel Flicking:"
                    color: ThemeTokens.subduedText
                    font.pixelSize: 12
                }

                ChaSetVirtualList {
                    width: 360
                    height: 240
                    model: 10000
                    delegate: Rectangle {
                        width: parent.width
                        height: 36
                        color: index % 2 === 0 ? ThemeTokens.hover : "transparent"

                        Text {
                            anchors.left: parent.left
                            anchors.leftMargin: 12
                            anchors.right: badgeItem.left
                            anchors.rightMargin: 8
                            anchors.verticalCenter: parent.verticalCenter
                            text: "Dataset Record #" + (index + 1)
                            color: ThemeTokens.text
                            font.pixelSize: 12
                            font.family: "monospace"
                            elide: Text.ElideRight
                        }

                        ChaSetBadge {
                            id: badgeItem
                            anchors.right: parent.right
                            anchors.rightMargin: 12
                            anchors.verticalCenter: parent.verticalCenter
                            text: index % 3 === 0 ? "Production" : "Staging"
                            variant: index % 3 === 0 ? "default" : "secondary"
                            size: "sm"
                        }
                    }
                }
            }
        }
    }

    CodeBlock {
        title: "Installation"
        code: "import ChaSet 1.0\n\nChaSetVirtualList { model: 10000; delegate: ... }"
        language: "qml"
    }

    PropsTable {
        title: "Props Reference"
        props: [
            { name: "model", type: "var", default: "null", description: "List model count or array for delegate generation." },
            { name: "delegate", type: "Component", default: "null", description: "Visual delegate instantiated for visible rows." },
            { name: "itemHeight", type: "int", default: "36", description: "Default estimated height of each row in pixels." },
            { name: "customRadius", type: "int", default: "6", description: "Corner radius of the list viewport container." }
        ]
    }
}
