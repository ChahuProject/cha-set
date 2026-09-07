// ResizableDocPage.qml — Living Documentation for ChaSetResizable
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Desktop & Virtualization"
    pageTitle: "Resizable"
    description: "Accessible resizable panel groups and layout splitters based on QtQuick.Controls SplitView with interactive grip handles."
    tocItems: [
        { id: "preview", title: "Interactive Preview" },
        { id: "installation", title: "Installation" },
        { id: "props", title: "API Reference" }
    ]

    ComponentPreview {
        title: "Resizable Panels Preview"
        reactCode: `<ResizablePanelGroup direction="horizontal">
  <ResizablePanel defaultSize={30} minSize={20}>
    <Sidebar />
  </ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize={70}>
    <Editor />
  </ResizablePanel>
</ResizablePanelGroup>`
        qtCode: `ChaSetResizable {
    width: 420
    height: 220
    orientation: Qt.Horizontal
    withHandle: true

    Rectangle {
        SplitView.preferredWidth: 140
        SplitView.minimumWidth: 80
        color: ThemeTokens.panel
    }
    Rectangle {
        SplitView.fillWidth: true
        color: ThemeTokens.background
    }
}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: 12

                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "Drag the divider with visual grip handle to resize panels:"
                    color: ThemeTokens.subduedText
                    font.pixelSize: 12
                }

                ChaSetResizable {
                    width: 440
                    height: 220
                    orientation: Qt.Horizontal
                    withHandle: true

                    Rectangle {
                        SplitView.preferredWidth: 140
                        SplitView.minimumWidth: 90
                        SplitView.maximumWidth: 260
                        color: ThemeTokens.panel
                        border.color: ThemeTokens.border
                        border.width: 1
                        radius: 4

                        Column {
                            anchors.centerIn: parent
                            spacing: 4
                            Text {
                                text: "Navigation Tree"
                                color: ThemeTokens.text
                                font.pixelSize: 12
                                font.weight: Font.DemiBold
                                anchors.horizontalCenter: parent.horizontalCenter
                            }
                            Text {
                                text: "Resizable Panel"
                                color: ThemeTokens.subduedText
                                font.pixelSize: 11
                                anchors.horizontalCenter: parent.horizontalCenter
                            }
                        }
                    }

                    Rectangle {
                        SplitView.fillWidth: true
                        SplitView.minimumWidth: 120
                        color: ThemeTokens.background
                        border.color: ThemeTokens.border
                        border.width: 1
                        radius: 4

                        Column {
                            anchors.centerIn: parent
                            spacing: 4
                            Text {
                                text: "Editor Viewport"
                                color: ThemeTokens.text
                                font.pixelSize: 12
                                font.weight: Font.DemiBold
                                anchors.horizontalCenter: parent.horizontalCenter
                            }
                            Text {
                                text: "Flexible Pane"
                                color: ThemeTokens.subduedText
                                font.pixelSize: 11
                                anchors.horizontalCenter: parent.horizontalCenter
                            }
                        }
                    }
                }
            }
        }
    }

    CodeBlock {
        title: "Installation"
        code: "import ChaSet 1.0\n\nChaSetResizable {\n    orientation: Qt.Horizontal\n    withHandle: true\n}"
        language: "qml"
    }

    PropsTable {
        title: "Props Reference"
        props: [
            { name: "orientation", type: "int", default: "Qt.Horizontal", description: "Split layout orientation: Qt.Horizontal or Qt.Vertical." },
            { name: "withHandle", type: "bool", default: "false", description: "Whether to render a tactile 6-dot visual grip indicator on the handle." },
            { name: "handleThickness", type: "int", default: "4 (or 8 with handle)", description: "Thickness of the divider separator in pixels." },
            { name: "handleColor", type: "color", default: "ThemeTokens.border", description: "Idle separator line background color." },
            { name: "handleHoverColor", type: "color", default: "ThemeTokens.accent", description: "Hovered or active separator accent color." },
            { name: "handleGripColor", type: "color", default: "ThemeTokens.subduedText", description: "Grip dot indicator color." }
        ]
    }
}
