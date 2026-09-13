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
        { id: "overview", title: "Horizontal Split" },
        { id: "nested", title: "Nested Splitters" },
        { id: "playground", title: "Variants Playground" },
        { id: "installation", title: "Installation" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "Props Reference" }
    ]

    property string playgroundDirection: "horizontal"
    property bool playgroundWithHandle: true

    // 1. Horizontal Split Overview
    ComponentPreview {
        title: "Horizontal Resizable Group"
        reactCode: `<ResizablePanelGroup direction="horizontal" className="min-h-64 rounded-lg border border-border">
  <ResizablePanel defaultSize={35} minSize={5} maxSize={95}>
    <div className="flex h-full items-center justify-center p-6 bg-muted/20">
      <span className="font-semibold text-sm">Navigation Sidebar</span>
    </div>
  </ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize={65} minSize={5} maxSize={95}>
    <div className="flex h-full items-center justify-center p-6">
      <span className="font-semibold text-sm">Editor Workspace</span>
    </div>
  </ResizablePanel>
</ResizablePanelGroup>`
        qtCode: `ChaSetResizable {
    width: 520
    height: 240
    orientation: Qt.Horizontal
    withHandle: true

    Rectangle {
        SplitView.preferredWidth: 180
        SplitView.minimumWidth: 40
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
                    text: "Panels automatically adapt to available width and provide interactive drag handles with boundary limits:"
                    color: ThemeTokens.subduedText
                    font.pixelSize: 12
                }

                ChaSetResizable {
                    width: 520
                    height: 220
                    orientation: Qt.Horizontal
                    withHandle: true

                    Rectangle {
                        id: navPanel
                        SplitView.preferredWidth: 180
                        SplitView.minimumWidth: 40
                        SplitView.maximumWidth: 460
                        color: ThemeTokens.panel
                        border.color: ThemeTokens.border
                        border.width: 1
                        radius: 4

                        Column {
                            anchors.centerIn: parent
                            spacing: 8
                            Text {
                                text: "Explorer Tree"
                                color: ThemeTokens.text
                                font.pixelSize: 12
                                font.weight: Font.DemiBold
                                anchors.horizontalCenter: parent.horizontalCenter
                            }
                            ChaSetBadge {
                                variant: "outline"
                                text: ((navPanel.width + editorPanel.width > 0) ? Math.round((navPanel.width / (navPanel.width + editorPanel.width)) * 100) : 35) + "% Width"
                                anchors.horizontalCenter: parent.horizontalCenter
                            }
                        }
                    }

                    Rectangle {
                        id: editorPanel
                        SplitView.fillWidth: true
                        SplitView.minimumWidth: 40
                        color: ThemeTokens.background
                        border.color: ThemeTokens.border
                        border.width: 1
                        radius: 4

                        Column {
                            anchors.centerIn: parent
                            spacing: 8
                            Text {
                                text: "Source Code Editor"
                                color: ThemeTokens.text
                                font.pixelSize: 12
                                font.weight: Font.DemiBold
                                anchors.horizontalCenter: parent.horizontalCenter
                            }
                            ChaSetBadge {
                                variant: "secondary"
                                text: ((navPanel.width + editorPanel.width > 0) ? Math.round((editorPanel.width / (navPanel.width + editorPanel.width)) * 100) : 65) + "% Width"
                                anchors.horizontalCenter: parent.horizontalCenter
                            }
                        }
                    }
                }
            }
        }
    }

    // 2. Nested Splitters
    ComponentPreview {
        title: "Nested Resizable Layout"
        reactCode: `<ResizablePanelGroup direction="horizontal" className="min-h-64 rounded-lg border border-border">
  <ResizablePanel defaultSize={28} minSize={5} maxSize={95}>
    <div className="flex h-full items-center justify-center p-4 bg-muted/20 text-xs">
      File Tree
    </div>
  </ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize={72} minSize={5} maxSize={95}>
    <ResizablePanelGroup direction="vertical">
      <ResizablePanel defaultSize={65} minSize={5} maxSize={95}>
        <div className="flex h-full items-center justify-center p-4 text-xs font-mono">
          main.rs (Code Editor)
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={35} minSize={5} maxSize={95}>
        <div className="flex h-full items-center justify-center p-4 bg-muted/30 text-xs font-mono">
          Terminal Console / Output
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </ResizablePanel>
</ResizablePanelGroup>`
        qtCode: `ChaSetResizable {
    width: 520
    height: 240
    orientation: Qt.Horizontal
    withHandle: true

    Rectangle {
        SplitView.preferredWidth: 140
        color: ThemeTokens.panel
    }
    ChaSetResizable {
        SplitView.fillWidth: true
        orientation: Qt.Vertical
        withHandle: true

        Rectangle {
            SplitView.preferredHeight: 140
            color: ThemeTokens.background
        }
        Rectangle {
            SplitView.fillHeight: true
            color: ThemeTokens.panelRaised
        }
    }
}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: 12

                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "Embed vertical panel groups inside horizontal panels to construct multi-pane IDE workbenches:"
                    color: ThemeTokens.subduedText
                    font.pixelSize: 12
                }

                ChaSetResizable {
                    width: 520
                    height: 240
                    orientation: Qt.Horizontal
                    withHandle: true

                    Rectangle {
                        id: nestedSidebar
                        SplitView.preferredWidth: 140
                        SplitView.minimumWidth: 50
                        color: ThemeTokens.panel
                        border.color: ThemeTokens.border
                        border.width: 1
                        radius: 4

                        Column {
                            anchors.centerIn: parent
                            spacing: 6
                            Text {
                                text: "Sidebar"
                                color: ThemeTokens.text
                                font.pixelSize: 12
                                font.weight: Font.DemiBold
                                anchors.horizontalCenter: parent.horizontalCenter
                            }
                            ChaSetBadge {
                                variant: "outline"
                                text: "File Tree"
                                anchors.horizontalCenter: parent.horizontalCenter
                            }
                        }
                    }

                    ChaSetResizable {
                        id: nestedInner
                        SplitView.fillWidth: true
                        SplitView.minimumWidth: 80
                        orientation: Qt.Vertical
                        withHandle: true

                        Rectangle {
                            id: nestedEditor
                            SplitView.preferredHeight: 130
                            SplitView.minimumHeight: 40
                            color: ThemeTokens.background
                            border.color: ThemeTokens.border
                            border.width: 1
                            radius: 4

                            Column {
                                anchors.centerIn: parent
                                spacing: 6
                                Text {
                                    text: "Editor Viewport"
                                    color: ThemeTokens.text
                                    font.pixelSize: 12
                                    font.weight: Font.DemiBold
                                    anchors.horizontalCenter: parent.horizontalCenter
                                }
                                ChaSetBadge {
                                    variant: "secondary"
                                    text: "main.rs"
                                    anchors.horizontalCenter: parent.horizontalCenter
                                }
                            }
                        }

                        Rectangle {
                            id: nestedTerminal
                            SplitView.fillHeight: true
                            SplitView.minimumHeight: 40
                            color: ThemeTokens.panelRaised
                            border.color: ThemeTokens.border
                            border.width: 1
                            radius: 4

                            Column {
                                anchors.centerIn: parent
                                spacing: 6
                                Text {
                                    text: "Integrated Terminal"
                                    color: ThemeTokens.text
                                    font.pixelSize: 12
                                    font.weight: Font.DemiBold
                                    anchors.horizontalCenter: parent.horizontalCenter
                                }
                                ChaSetBadge {
                                    variant: "outline"
                                    text: "bash"
                                    anchors.horizontalCenter: parent.horizontalCenter
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // 3. Variants Playground
    ComponentPreview {
        title: "Interactive Playground"
        reactCode: `<ResizablePanelGroup direction="${root.playgroundDirection}" className="min-h-56 rounded-lg border border-border">
  <ResizablePanel defaultSize={40} minSize={5} maxSize={95}>
    <div className="flex h-full items-center justify-center p-4 bg-muted/20 text-sm">
      Panel Alpha
    </div>
  </ResizablePanel>
  <ResizableHandle withHandle={${root.playgroundWithHandle}} />
  <ResizablePanel defaultSize={60} minSize={5} maxSize={95}>
    <div className="flex h-full items-center justify-center p-4 text-sm">
      Panel Beta
    </div>
  </ResizablePanel>
</ResizablePanelGroup>`
        qtCode: `ChaSetResizable {
    width: 520
    height: 220
    orientation: ${root.playgroundDirection === "horizontal" ? "Qt.Horizontal" : "Qt.Vertical"}
    withHandle: ${root.playgroundWithHandle}

    Rectangle {
        SplitView.preferredWidth: 200
        color: ThemeTokens.panel
    }
    Rectangle {
        SplitView.fillWidth: true
        color: ThemeTokens.background
    }
}`

        controlsData: [
            Row {
                spacing: 16

                Row {
                    spacing: 8
                    anchors.verticalCenter: parent.verticalCenter
                    Text {
                        anchors.verticalCenter: parent.verticalCenter
                        text: "Direction:"
                        color: ThemeTokens.subduedText
                        font.pixelSize: 12
                    }
                    ChaSetSegmentedControl {
                        anchors.verticalCenter: parent.verticalCenter
                        options: [
                            { label: "Horizontal", value: "horizontal" },
                            { label: "Vertical", value: "vertical" }
                        ]
                        value: root.playgroundDirection
                        onValueSelected: function(val) { root.playgroundDirection = val; }
                    }
                }

                ChaSetButton {
                    size: "sm"
                    variant: root.playgroundWithHandle ? "default" : "outline"
                    text: root.playgroundWithHandle ? "Handle: Visible" : "Handle: Hidden"
                    onClicked: root.playgroundWithHandle = !root.playgroundWithHandle
                }
            }
        ]

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: 12

                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "Toggle between horizontal and vertical orientations and test visual grip handle styles dynamically:"
                    color: ThemeTokens.subduedText
                    font.pixelSize: 12
                }

                ChaSetResizable {
                    id: playgroundResizable
                    width: 520
                    height: 220
                    orientation: root.playgroundDirection === "horizontal" ? Qt.Horizontal : Qt.Vertical
                    withHandle: root.playgroundWithHandle

                    Rectangle {
                        id: playPanel1
                        SplitView.preferredWidth: root.playgroundDirection === "horizontal" ? 200 : 520
                        SplitView.preferredHeight: root.playgroundDirection === "horizontal" ? 220 : 100
                        SplitView.minimumWidth: 50
                        SplitView.minimumHeight: 40
                        color: ThemeTokens.panel
                        border.color: ThemeTokens.border
                        border.width: 1
                        radius: 4

                        Text {
                            anchors.centerIn: parent
                            text: "Panel Alpha"
                            color: ThemeTokens.text
                            font.pixelSize: 13
                            font.weight: Font.DemiBold
                        }
                    }

                    Rectangle {
                        id: playPanel2
                        SplitView.fillWidth: true
                        SplitView.fillHeight: true
                        SplitView.minimumWidth: 50
                        SplitView.minimumHeight: 40
                        color: ThemeTokens.background
                        border.color: ThemeTokens.border
                        border.width: 1
                        radius: 4

                        Text {
                            anchors.centerIn: parent
                            text: "Panel Beta"
                            color: ThemeTokens.text
                            font.pixelSize: 13
                            font.weight: Font.DemiBold
                        }
                    }
                }
            }
        }
    }

    ChaSetCodeBlock {
        title: "Installation"
        code: "import ChaSet 1.0\n\nChaSetResizable {\n    orientation: Qt.Horizontal\n    withHandle: true\n}"
        language: "qml"
    }

    KeyboardShortcutsTable {
        componentId: "resizable"
    }

    PropsTable {
        title: "Props Reference"
        props: [
            { name: "orientation", type: "int", default: "Qt.Horizontal", description: "Split layout orientation: Qt.Horizontal or Qt.Vertical." },
            { name: "withHandle", type: "bool", default: "false", description: "Whether to render a tactile 6-dot visual grip indicator on the handle." },
            { name: "handleThickness", type: "int", default: "4 (or 8 with handle)", description: "Thickness of the divider separator bound." },
            { name: "handleColor", type: "color", default: "ThemeTokens.border", description: "Idle separator line background color." },
            { name: "handleHoverColor", type: "color", default: "ThemeTokens.accent", description: "Hovered or active separator accent color." },
            { name: "handleGripColor", type: "color", default: "ThemeTokens.subduedText", description: "Grip dot indicator color." }
        ]
    }
}
