// ViewportConstrainedContainerDocPage.qml — Living Documentation for ChaSetViewportConstrainedContainer
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Interactive Controls"
    pageTitle: "Viewport Constrained Container"
    description: "Container that dynamically bounds max-height based on available viewport space below the anchor, enabling smooth scrolling."
    tocItems: [
        { id: "preview", title: "Interactive Preview" },
        { id: "installation", title: "Installation" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "API Reference" }
    ]

    ComponentPreview {
        title: "Viewport Constrained Container Preview"
        reactCode: `<ViewportConstrainedContainer maxHeight={240} margin={16}>
  <div className="p-3 flex flex-col gap-2">
    {items.map(item => <div key={item}>{item}</div>)}
  </div>
</ViewportConstrainedContainer>`
        qtCode: `ChaSetViewportConstrainedContainer {
    width: 260
    maxHeight: 220
    margin: 16

    Column {
        width: parent.width
        padding: 12
        spacing: 8
        Repeater {
            model: 12
            Rectangle {
                width: parent.width - 24
                height: 32
                radius: 4
                color: ThemeTokens.color("panelRaised")
                Text {
                    anchors.centerIn: parent
                    text: "Item #" + (index + 1)
                    color: ThemeTokens.text
                    font.pixelSize: 12
                }
            }
        }
    }
}`

        Item {
            anchors.fill: parent

            ChaSetViewportConstrainedContainer {
                anchors.horizontalCenter: parent.horizontalCenter
                anchors.top: parent.top
                anchors.topMargin: 24
                width: 260
                maxHeight: 220
                margin: 16

                Column {
                    width: parent.width
                    padding: 12
                    spacing: 8

                    Repeater {
                        model: 12
                        Rectangle {
                            width: parent.width - 24
                            height: 32
                            radius: 4
                            color: ThemeTokens.color("panelRaised")
                            border.width: 1
                            border.color: ThemeTokens.border

                            Text {
                                anchors.centerIn: parent
                                text: "Constrained Item #" + (index + 1)
                                color: ThemeTokens.text
                                font.pixelSize: 12
                            }
                        }
                    }
                }
            }
        }
    }

    CodeBlock {
        title: "Installation"
        code: "import ChaSet 1.0\n\nChaSetViewportConstrainedContainer {\n    maxHeight: 300\n    margin: 16\n    overflow: \"auto\"\n}"
        language: "qml"
    }

    
    KeyboardShortcutsTable {
        componentId: "viewport-constrained-container"
    }

    PropsTable {
        title: "Props Reference"
        props: [
            { name: "maxHeight", type: "var", default: "undefined", description: "Optional upper bound on max-height in pixels." },
            { name: "margin", type: "real", default: "16", description: "Reserved margin between container bottom and viewport bottom." },
            { name: "overflow", type: "string", default: "'auto'", description: "Overflow behavior ('auto' | 'scroll')." },
            { name: "customRadius", type: "int", default: "6", description: "Corner radius of the container." },
            { name: "backgroundColor", type: "color", default: "ThemeTokens.panel", description: "Background surface fill color." },
            { name: "borderColor", type: "color", default: "ThemeTokens.border", description: "Border outline color." }
        ]
    }
}
