// ResizableDocPage.qml — Living Documentation for ChaSetResizable
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Surfaces & Layout"
    pageTitle: "Resizable"
    description: "Accessible resizable panel groups and layout splitters."
    tocItems: [
        { id: "overview", title: "Horizontal Split" },
        { id: "nested", title: "Nested Splitters" },
        { id: "playground", title: "Variants Playground" },
        { id: "installation", title: "Installation" },
        { id: "animations", title: "Animations" },
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
            implicitHeight: ThemeTokens.dp(250)

            Rectangle {
                anchors.centerIn: parent
                width: ThemeTokens.dp(520)
                height: ThemeTokens.dp(220)
                radius: ThemeTokens.dp(6)
                border.color: ThemeTokens.border
                border.width: 1
                color: ThemeTokens.panel
                clip: true

                ChaSetResizable {
                    anchors.fill: parent
                    orientation: Qt.Horizontal
                    withHandle: true

                    Rectangle {
                        id: navPanel
                        SplitView.preferredWidth: 180
                        SplitView.minimumWidth: 40
                        SplitView.maximumWidth: 460
                        color: ThemeTokens.panel

                        Column {
                            anchors.centerIn: parent
                            spacing: 8
                            DocText {
                                text: "Explorer Tree"
                                color: ThemeTokens.text
                                font.pixelSize: Typography.sizeBody
                                font.weight: Typography.weightSemibold
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

                        Column {
                            anchors.centerIn: parent
                            spacing: 8
                            DocText {
                                text: "Source Code Editor"
                                color: ThemeTokens.text
                                font.pixelSize: Typography.sizeBody
                                font.weight: Typography.weightSemibold
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
            implicitHeight: ThemeTokens.dp(270)

            Rectangle {
                anchors.centerIn: parent
                width: ThemeTokens.dp(520)
                height: ThemeTokens.dp(240)
                radius: ThemeTokens.dp(6)
                border.color: ThemeTokens.border
                border.width: 1
                color: ThemeTokens.panel
                clip: true

                ChaSetResizable {
                    anchors.fill: parent
                    orientation: Qt.Horizontal
                    withHandle: true

                    Rectangle {
                        id: nestedSidebar
                        SplitView.preferredWidth: 140
                        SplitView.minimumWidth: 50
                        color: ThemeTokens.panel

                        Column {
                            anchors.centerIn: parent
                            spacing: 6
                            DocText {
                                text: "Sidebar"
                                color: ThemeTokens.text
                                font.pixelSize: Typography.sizeBody
                                font.weight: Typography.weightSemibold
                                anchors.horizontalCenter: parent.horizontalCenter
                            }
                            ChaSetBadge {
                                variant: "outline"
                                text: ((nestedSidebar.width + nestedInner.width > 0) ? Math.round((nestedSidebar.width / (nestedSidebar.width + nestedInner.width)) * 100) : 28) + "% Width"
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
                            SplitView.preferredHeight: 155
                            SplitView.minimumHeight: 40
                            color: ThemeTokens.background

                            Column {
                                anchors.centerIn: parent
                                spacing: 6
                                DocText {
                                    text: "Editor Viewport"
                                    color: ThemeTokens.text
                                    font.pixelSize: Typography.sizeBody
                                    font.weight: Typography.weightSemibold
                                    anchors.horizontalCenter: parent.horizontalCenter
                                }
                                ChaSetBadge {
                                    variant: "secondary"
                                    text: ((nestedEditor.height + nestedTerminal.height > 0) ? Math.round((nestedEditor.height / (nestedEditor.height + nestedTerminal.height)) * 100) : 65) + "% Height"
                                    anchors.horizontalCenter: parent.horizontalCenter
                                }
                            }
                        }

                        Rectangle {
                            id: nestedTerminal
                            SplitView.fillHeight: true
                            SplitView.minimumHeight: 40
                            color: ThemeTokens.panelRaised

                            Column {
                                anchors.centerIn: parent
                                spacing: 6
                                DocText {
                                    text: "Integrated Terminal"
                                    color: ThemeTokens.text
                                    font.pixelSize: Typography.sizeBody
                                    font.weight: Typography.weightSemibold
                                    anchors.horizontalCenter: parent.horizontalCenter
                                }
                                ChaSetBadge {
                                    variant: "outline"
                                    text: ((nestedEditor.height + nestedTerminal.height > 0) ? Math.round((nestedTerminal.height / (nestedEditor.height + nestedTerminal.height)) * 100) : 35) + "% Height"
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
                    DocText {
                        anchors.verticalCenter: parent.verticalCenter
                        text: "Direction:"
                        color: ThemeTokens.subduedText
                        font.pixelSize: Typography.sizeSmall
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

            Rectangle {
                anchors.centerIn: parent
                width: ThemeTokens.dp(520)
                height: ThemeTokens.dp(220)
                radius: ThemeTokens.dp(6)
                border.color: ThemeTokens.border
                border.width: 1
                color: ThemeTokens.panel
                clip: true

                ChaSetResizable {
                    id: playgroundResizable
                    anchors.fill: parent
                    orientation: root.playgroundDirection === "horizontal" ? Qt.Horizontal : Qt.Vertical
                    withHandle: root.playgroundWithHandle

                    Rectangle {
                        id: playPanel1
                        SplitView.preferredWidth: root.playgroundDirection === "horizontal" ? 208 : 520
                        SplitView.preferredHeight: root.playgroundDirection === "horizontal" ? 220 : 88
                        SplitView.minimumWidth: 40
                        SplitView.minimumHeight: 40
                        color: ThemeTokens.panel

                        Column {
                            anchors.centerIn: parent
                            spacing: 6
                            DocText {
                                text: "Panel Alpha"
                                color: ThemeTokens.text
                                font.pixelSize: Typography.sizeBody
                                font.weight: Typography.weightSemibold
                                anchors.horizontalCenter: parent.horizontalCenter
                            }
                            ChaSetBadge {
                                variant: "outline"
                                text: {
                                    if (root.playgroundDirection === "horizontal") {
                                        var totalW = playPanel1.width + playPanel2.width
                                        var pctW = totalW > 0 ? Math.round((playPanel1.width / totalW) * 100) : 40
                                        return pctW + "% Width"
                                    } else {
                                        var totalH = playPanel1.height + playPanel2.height
                                        var pctH = totalH > 0 ? Math.round((playPanel1.height / totalH) * 100) : 40
                                        return pctH + "% Height"
                                    }
                                }
                                anchors.horizontalCenter: parent.horizontalCenter
                            }
                        }
                    }

                    Rectangle {
                        id: playPanel2
                        SplitView.fillWidth: true
                        SplitView.fillHeight: true
                        SplitView.minimumWidth: 40
                        SplitView.minimumHeight: 40
                        color: ThemeTokens.background

                        Column {
                            anchors.centerIn: parent
                            spacing: 6
                            DocText {
                                text: "Panel Beta"
                                color: ThemeTokens.text
                                font.pixelSize: Typography.sizeBody
                                font.weight: Typography.weightSemibold
                                anchors.horizontalCenter: parent.horizontalCenter
                            }
                            ChaSetBadge {
                                variant: "secondary"
                                text: {
                                    if (root.playgroundDirection === "horizontal") {
                                        var totalW = playPanel1.width + playPanel2.width
                                        var pctW = totalW > 0 ? Math.round((playPanel2.width / totalW) * 100) : 60
                                        return pctW + "% Width"
                                    } else {
                                        var totalH = playPanel1.height + playPanel2.height
                                        var pctH = totalH > 0 ? Math.round((playPanel2.height / totalH) * 100) : 60
                                        return pctH + "% Height"
                                    }
                                }
                                anchors.horizontalCenter: parent.horizontalCenter
                            }
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

    // Animations Section
    Column {
        width: parent.width
        spacing: 12

        DocText {
            text: "Animations"
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
        }

        DocText {
            text: "Motion tokens and kinematic timing contracts for Resizable dividers and handles."
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }

        DocText {
            text: "• Separator grip indicator border and hover highlight color transitions animate smoothly over duration-quick (150ms) using ease-standard curve (ThemeTokens.motionQuick and ThemeTokens.easeStandard)."
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }
        DocText {
            text: "• Panel resizing kinematics are strictly un-animated for deterministic, 60fps real-time pointer tracking."
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }
        DocText {
            text: "• Respects prefers-reduced-motion on Web and ThemeTokens.animationsEnabled in Qt."
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }
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
