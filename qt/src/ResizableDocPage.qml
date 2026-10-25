// ResizableDocPage.qml — Living Documentation for ChaSetResizable
import QtQuick
import QtQuick.Controls
import ChaSet

DocLayout {
    id: root
    category: "Surfaces & Layout"
    pageTitle: "Resizable"
    description: ChaSetI18n.tr("components.resizable.description", "Accessible resizable panel groups and layout splitters.")

    property string playgroundDirection: "horizontal"
    property bool playgroundWithHandle: true

    // 1. Horizontal Split Overview
    Column {
        property string sectionId: "overview"
        width: parent.width
        spacing: 12

        DocText {
            text: ChaSetI18n.tr("desktopComposite.resizable.horizontalTitle", "Horizontal Split")
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
        }

        DocText {
            text: ChaSetI18n.tr("desktopComposite.resizable.horizontalDesc", "Panels automatically adapt to available width and provide interactive drag handles with boundary limits.")
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }
    }

    ComponentPreview {
        title: ChaSetI18n.tr("desktopComposite.resizable.horizontalSandboxTitle", "Horizontal Resizable Group")
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
                radius: ThemeTokens.dp(8)
                border.color: ThemeTokens.border
                border.width: 1
                color: ThemeTokens.panel
                clip: true

                ChaSetResizable {
                    anchors.fill: parent
                    // Inset by the outer 1px border: opaque panes paint above
                    // the parent border ring and would otherwise cover it.
                    anchors.margins: 1
                    orientation: Qt.Horizontal
                    withHandle: true

                    Rectangle {
                        id: navPanel
                        SplitView.preferredWidth: 180
                        SplitView.minimumWidth: 40
                        SplitView.maximumWidth: 460
                        color: ThemeTokens.panel
                        // Outer-corner rounding (frame radius 8 minus 1px border):
                        // square SplitView panes would otherwise paint over
                        // the frame's rounded corners (rectangular clip
                        // ignores radius). Divider-side corners stay 0.
                        topLeftRadius: ThemeTokens.dp(7)
                        topRightRadius: 0
                        bottomLeftRadius: ThemeTokens.dp(7)
                        bottomRightRadius: 0

                        Column {
                            anchors.centerIn: parent
                            spacing: 8
                            DocText {
                                text: ChaSetI18n.tr("surfaces.resizable.explorerTree")
                                color: ThemeTokens.text
                                font.pixelSize: Typography.sizeBody
                                font.weight: Typography.weightSemibold
                                anchors.horizontalCenter: parent.horizontalCenter
                            }
                            ChaSetBadge {
                                variant: "outline"
                                text: ChaSetI18n.tr("surfaces.resizable.percentWidth", "{{width}}% Width", { "width": ((navPanel.width + editorPanel.width > 0) ? Math.round((navPanel.width / (navPanel.width + editorPanel.width)) * 100) : 35) })
                                anchors.horizontalCenter: parent.horizontalCenter
                            }
                        }
                    }

                    Rectangle {
                        id: editorPanel
                        SplitView.fillWidth: true
                        SplitView.minimumWidth: 40
                        color: ThemeTokens.background
                        topLeftRadius: 0
                        topRightRadius: ThemeTokens.dp(7)
                        bottomLeftRadius: 0
                        bottomRightRadius: ThemeTokens.dp(7)

                        Column {
                            anchors.centerIn: parent
                            spacing: 8
                            DocText {
                                text: ChaSetI18n.tr("surfaces.resizable.sourceCodeEditor")
                                color: ThemeTokens.text
                                font.pixelSize: Typography.sizeBody
                                font.weight: Typography.weightSemibold
                                anchors.horizontalCenter: parent.horizontalCenter
                            }
                            ChaSetBadge {
                                variant: "secondary"
                                text: ChaSetI18n.tr("surfaces.resizable.percentWidth", "{{width}}% Width", { "width": ((navPanel.width + editorPanel.width > 0) ? Math.round((editorPanel.width / (navPanel.width + editorPanel.width)) * 100) : 65) })
                                anchors.horizontalCenter: parent.horizontalCenter
                            }
                        }
                    }
                }
            }
        }
    }

    DocAnatomy {
        sectionId: "anatomy"
        width: parent.width
        qtCode: `import ChaSet

ChaSetResizable {
    width: parent.width
    orientation: Qt.Horizontal
}`
        reactCode: `import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@chahu/cha-set';

<ResizablePanelGroup direction="horizontal">
  <ResizablePanel defaultSize={30}>Sidebar</ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize={70}>Content</ResizablePanel>
</ResizablePanelGroup>`
    }

    // 2. Nested Splitters
    Column {
        property string sectionId: "nested"
        width: parent.width
        spacing: 12

        DocText {
            text: ChaSetI18n.tr("desktopComposite.resizable.nestedTitle", "Nested Resizable Layout")
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
        }

        DocText {
            text: ChaSetI18n.tr("desktopComposite.resizable.nestedDesc", "Embed vertical panel groups inside horizontal panels to construct multi-pane IDE workbenches and docking surfaces.")
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }
    }

    ComponentPreview {
        title: ChaSetI18n.tr("desktopComposite.resizable.nestedTitle", "Nested Resizable Layout")
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
                radius: ThemeTokens.dp(8)
                border.color: ThemeTokens.border
                border.width: 1
                color: ThemeTokens.panel
                clip: true

                ChaSetResizable {
                    anchors.fill: parent
                    // Inset by the outer 1px border: opaque panes paint above
                    // the parent border ring and would otherwise cover it.
                    anchors.margins: 1
                    orientation: Qt.Horizontal
                    withHandle: true

                    Rectangle {
                        id: nestedSidebar
                        SplitView.preferredWidth: 140
                        SplitView.minimumWidth: 50
                        color: ThemeTokens.panel
                        topLeftRadius: ThemeTokens.dp(7)
                        topRightRadius: 0
                        bottomLeftRadius: ThemeTokens.dp(7)
                        bottomRightRadius: 0

                        Column {
                            anchors.centerIn: parent
                            spacing: 6
                            DocText {
                                text: ChaSetI18n.tr("surfaces.resizable.sidebar")
                                color: ThemeTokens.text
                                font.pixelSize: Typography.sizeBody
                                font.weight: Typography.weightSemibold
                                anchors.horizontalCenter: parent.horizontalCenter
                            }
                            ChaSetBadge {
                                variant: "outline"
                                text: ChaSetI18n.tr("surfaces.resizable.percentWidth", "{{width}}% Width", { "width": ((nestedSidebar.width + nestedInner.width > 0) ? Math.round((nestedSidebar.width / (nestedSidebar.width + nestedInner.width)) * 100) : 28) })
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
                            // Only the outer top-right corner is rounded;
                            // divider-side and interior corners stay 0.
                            topLeftRadius: 0
                            topRightRadius: ThemeTokens.dp(7)
                            bottomLeftRadius: 0
                            bottomRightRadius: 0

                            Column {
                                anchors.centerIn: parent
                                spacing: 6
                                DocText {
                                    text: ChaSetI18n.tr("surfaces.resizable.editorViewport")
                                    color: ThemeTokens.text
                                    font.pixelSize: Typography.sizeBody
                                    font.weight: Typography.weightSemibold
                                    anchors.horizontalCenter: parent.horizontalCenter
                                }
                                ChaSetBadge {
                                    variant: "secondary"
                                    text: ChaSetI18n.tr("surfaces.resizable.percentHeight", "{{height}}% Height", { "height": ((nestedEditor.height + nestedTerminal.height > 0) ? Math.round((nestedEditor.height / (nestedEditor.height + nestedTerminal.height)) * 100) : 65) })
                                    anchors.horizontalCenter: parent.horizontalCenter
                                }
                            }
                        }

                        Rectangle {
                            id: nestedTerminal
                            SplitView.fillHeight: true
                            SplitView.minimumHeight: 40
                            color: ThemeTokens.panelRaised
                            topLeftRadius: 0
                            topRightRadius: 0
                            bottomLeftRadius: 0
                            bottomRightRadius: ThemeTokens.dp(7)

                            Column {
                                anchors.centerIn: parent
                                spacing: 6
                                DocText {
                                    text: ChaSetI18n.tr("surfaces.resizable.integratedTerminal")
                                    color: ThemeTokens.text
                                    font.pixelSize: Typography.sizeBody
                                    font.weight: Typography.weightSemibold
                                    anchors.horizontalCenter: parent.horizontalCenter
                                }
                                ChaSetBadge {
                                    variant: "outline"
                                    text: ChaSetI18n.tr("surfaces.resizable.percentHeight", "{{height}}% Height", { "height": ((nestedEditor.height + nestedTerminal.height > 0) ? Math.round((nestedTerminal.height / (nestedEditor.height + nestedTerminal.height)) * 100) : 35) })
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
    Column {
        property string sectionId: "playground"
        width: parent.width
        spacing: 12

        DocText {
            text: ChaSetI18n.tr("desktopComposite.resizable.playgroundTitle", "Interactive Playground")
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
        }

        DocText {
            text: ChaSetI18n.tr("desktopComposite.resizable.playgroundDesc", "Toggle between horizontal and vertical orientations and test visual grip handle styles dynamically.")
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }
    }

    ComponentPreview {
        title: ChaSetI18n.tr("desktopComposite.resizable.playgroundTitle", "Interactive Playground")
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
                        text: ChaSetI18n.tr("surfaces.resizable.direction")
                        color: ThemeTokens.subduedText
                        font.pixelSize: Typography.sizeSmall
                    }
                    ChaSetSegmentedControl {
                        anchors.verticalCenter: parent.verticalCenter
                        options: [
                            { label: ChaSetI18n.tr("surfaces.resizable.horizontal"), value: "horizontal" },
                            { label: ChaSetI18n.tr("surfaces.resizable.vertical"), value: "vertical" }
                        ]
                        value: root.playgroundDirection
                        onValueSelected: function(val) { root.playgroundDirection = val; }
                    }
                }

                ChaSetButton {
                    size: "sm"
                    variant: root.playgroundWithHandle ? "default" : "outline"
                    text: root.playgroundWithHandle ? ChaSetI18n.tr("surfaces.resizable.handleVisible") : ChaSetI18n.tr("surfaces.resizable.handleHidden")
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
                radius: ThemeTokens.dp(8)
                border.color: ThemeTokens.border
                border.width: 1
                color: ThemeTokens.panel
                clip: true

                ChaSetResizable {
                    id: playgroundResizable
                    anchors.fill: parent
                    // Inset by the outer 1px border: opaque panes paint above
                    // the parent border ring and would otherwise cover it.
                    anchors.margins: 1
                    orientation: root.playgroundDirection === "horizontal" ? Qt.Horizontal : Qt.Vertical
                    withHandle: root.playgroundWithHandle

                    Rectangle {
                        id: playPanel1
                        SplitView.preferredWidth: root.playgroundDirection === "horizontal" ? 208 : 520
                        SplitView.preferredHeight: root.playgroundDirection === "horizontal" ? 220 : 88
                        SplitView.minimumWidth: 40
                        SplitView.minimumHeight: 40
                        color: ThemeTokens.panel
                        // Outer corners follow orientation: left column in
                        // horizontal mode, top row in vertical mode.
                        topLeftRadius: ThemeTokens.dp(7)
                        topRightRadius: root.playgroundDirection === "horizontal" ? 0 : ThemeTokens.dp(7)
                        bottomLeftRadius: ThemeTokens.dp(7)
                        bottomRightRadius: root.playgroundDirection === "horizontal" ? 0 : ThemeTokens.dp(7)

                        Column {
                            anchors.centerIn: parent
                            spacing: 6
                            DocText {
                                text: ChaSetI18n.tr("surfaces.resizable.panelAlpha")
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
                                        return ChaSetI18n.tr("surfaces.resizable.percentWidth", "{{width}}% Width", { "width": pctW })
                                    } else {
                                        var totalH = playPanel1.height + playPanel2.height
                                        var pctH = totalH > 0 ? Math.round((playPanel1.height / totalH) * 100) : 40
                                        return ChaSetI18n.tr("surfaces.resizable.percentHeight", "{{height}}% Height", { "height": pctH })
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
                        topLeftRadius: 0
                        topRightRadius: root.playgroundDirection === "horizontal" ? ThemeTokens.dp(7) : 0
                        bottomLeftRadius: root.playgroundDirection === "horizontal" ? 0 : ThemeTokens.dp(7)
                        bottomRightRadius: ThemeTokens.dp(7)

                        Column {
                            anchors.centerIn: parent
                            spacing: 6
                            DocText {
                                text: ChaSetI18n.tr("surfaces.resizable.panelBeta")
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
                                        return ChaSetI18n.tr("surfaces.resizable.percentWidth", "{{width}}% Width", { "width": pctW })
                                    } else {
                                        var totalH = playPanel1.height + playPanel2.height
                                        var pctH = totalH > 0 ? Math.round((playPanel2.height / totalH) * 100) : 60
                                        return ChaSetI18n.tr("surfaces.resizable.percentHeight", "{{height}}% Height", { "height": pctH })
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

    DocMarkdown {
        width: parent.width
        docId: "resizable"
        section: "animations"
    }

    DocMarkdown {
        width: parent.width
        docId: "resizable"
        section: "keyboard"
    }

    DocMarkdown {
        width: parent.width
        docId: "resizable"
        section: "props"
    }
}
