// SplitterDocPage.qml — Living Documentation for ChaSetSplitter
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Surfaces & Layout"
    pageTitle: "Splitter"
    description: ChaSetI18n.tr("components.splitter.description", "Multi-pane resizable layout container with draggable gutters and collapse limits for IDEs and desktop toolkits.")

    ComponentPreview {
        title: ChaSetI18n.tr("desktopComposite.splitter.horizontalSandboxTitle", "Horizontal Splitter Sandbox")
        reactCode: `<div className="flex h-48 border rounded-md">
  <div style={{ width: \`\${size}%\` }} className="p-4 text-xs">
    Left Pane (Sidebar)
  </div>
  <Splitter size={size} onChange={setSize} orientation="vertical" />
  <div style={{ width: \`\${100 - size}%\` }} className="p-4 text-xs">
    Right Pane (Main Content)
  </div>
</div>`
        qtCode: `ChaSetSplitter {
    width: 480
    height: 192
    orientation: "vertical"
    initialSize: 35
    minRatio: 0.20
    maxRatio: 0.80
    leftItem: Component { ... }
    rightItem: Component { ... }
}`

        Item {
            anchors.fill: parent
            implicitHeight: ThemeTokens.dp(250)

            Column {
                anchors.centerIn: parent
                spacing: ThemeTokens.dp(12)

                DocText {
                    anchors.horizontalCenter: parent.horizontalCenter
                    width: ThemeTokens.dp(480)
                    wrap: true
                    horizontalAlignment: Text.AlignHCenter
                    text: ChaSetI18n.tr("desktopComposite.splitter.horizontalDesc", "Hover over the gutter between panes and drag horizontally to resize panels. Double-click to reset.")
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeSmall
                }

                // ChaSetSplitter owns its own rounded-md border frame
                // (radius dp(6), 1px border, panel fill); this wrapper only
                // sizes the sandbox so no double border is painted.
                Item {
                    width: ThemeTokens.dp(480)
                    height: ThemeTokens.dp(192)

                    ChaSetSplitter {
                        id: splitter
                        anchors.fill: parent
                        orientation: "vertical"
                        initialSize: 35
                        minRatio: 0.20
                        maxRatio: 0.80
                        splitRatio: 0.35

                        leftItem: Component {
                            Rectangle {
                                color: ThemeTokens.panel
                                border.color: "transparent"

                                Column {
                                    anchors.fill: parent
                                    anchors.margins: 16
                                    spacing: 8

                                     DocText {
                                        text: ChaSetI18n.tr("surfaces.splitter.navTree", "Navigation Tree")
                                        color: ThemeTokens.text
                                        font.pixelSize: Typography.sizeSmall
                                        font.weight: Typography.weightSemibold
                                    }

                                    Column {
                                        spacing: 4
                                        DocText { text: ChaSetI18n.tr("desktopComposite.splitter.fileSrc", "▾ src"); color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeCaption; font.family: Typography.familyMono }
                                        DocText { text: "  " + ChaSetI18n.tr("desktopComposite.splitter.fileComponents", "▸ components"); color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeCaption; font.family: Typography.familyMono }
                                        DocText { text: "  " + ChaSetI18n.tr("desktopComposite.splitter.fileLayout", "▸ layout"); color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeCaption; font.family: Typography.familyMono }
                                    }
                                }
                            }
                        }

                        rightItem: Component {
                            Rectangle {
                                color: ThemeTokens.background
                                border.color: "transparent"

                                Column {
                                    anchors.centerIn: parent
                                    spacing: 8

                                    Row {
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        spacing: 8
                                        DocText {
                                            text: ChaSetI18n.tr("surfaces.splitter.editorWorkspace", "Editor Workspace")
                                            color: ThemeTokens.text
                                            font.pixelSize: Typography.sizeSmall
                                            font.weight: Typography.weightSemibold
                                            anchors.verticalCenter: parent.verticalCenter
                                        }
                                        ChaSetBadge {
                                            text: Math.round((1 - splitter.splitRatio) * 100) + "%"
                                            size: "sm"
                                            variant: "secondary"
                                            anchors.verticalCenter: parent.verticalCenter
                                        }
                                    }

                                    DocText {
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        text: ChaSetI18n.tr("surfaces.splitter.dragHint", "Drag splitter handle to resize panes")
                                        color: ThemeTokens.subduedText
                                        font.pixelSize: Typography.sizeCaption
                                    }

                                    ChaSetButton {
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        text: ChaSetI18n.tr("surfaces.splitter.reset35", "Reset (35%)")
                                        size: "xs"
                                        variant: "outline"
                                        onClicked: splitter.reset()
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    DocAnatomy {
        width: parent.width
        qtCode: `import ChaSet

ChaSetSplitter {
    width: parent.width
    height: 300
    orientation: Qt.Horizontal
    splitRatio: 0.3
}`
        reactCode: `import { Splitter } from '@chahu/cha-set';

<Splitter orientation="horizontal" defaultSplit={0.3}>
  <div>Left Pane</div>
  <div>Right Pane</div>
</Splitter>`
    }



    ComponentPreview {
        property string sectionId: "vertical"
        property string sectionTitle: ChaSetI18n.tr("desktopComposite.splitter.verticalTitle", "Vertical Splitter")
        title: ChaSetI18n.tr("desktopComposite.splitter.verticalSandboxTitle", "Vertical Splitter")
        reactCode: `<div className="flex flex-col h-64 border rounded-md">
  <div style={{ height: \`\${verticalSize}%\` }} className="p-4 text-xs">
    Top Pane (Editor Canvas)
  </div>
  <Splitter size={verticalSize} onChange={setVerticalSize} orientation="horizontal" />
  <div style={{ height: \`\${100 - verticalSize}%\` }} className="p-4 text-xs">
    Bottom Pane (Terminal Console)
  </div>
</div>`
        qtCode: `ChaSetSplitter {
    width: 480
    height: 220
    orientation: "horizontal"
    initialSize: 65
    minRatio: 0.20
    maxRatio: 0.80
    leftItem: Component { ... }
    rightItem: Component { ... }
}`

        Item {
            anchors.fill: parent
            implicitHeight: ThemeTokens.dp(270)

            Column {
                anchors.centerIn: parent
                spacing: ThemeTokens.dp(12)

                DocText {
                    anchors.horizontalCenter: parent.horizontalCenter
                    width: ThemeTokens.dp(480)
                    wrap: true
                    horizontalAlignment: Text.AlignHCenter
                    text: ChaSetI18n.tr("desktopComposite.splitter.verticalDesc", "Top and bottom pane split with horizontal divider line. Drag vertically to resize console output.")
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeSmall
                }

                // ChaSetSplitter owns its own rounded-md border frame;
                // this wrapper only sizes the sandbox (no double border).
                Item {
                    width: ThemeTokens.dp(480)
                    height: ThemeTokens.dp(220)

                    ChaSetSplitter {
                        id: verticalSplitter
                        anchors.fill: parent
                        orientation: "horizontal"
                        initialSize: 65
                        minRatio: 0.20
                        maxRatio: 0.80
                        splitRatio: 0.65

                        leftItem: Component {
                            Rectangle {
                                color: ThemeTokens.panel
                                border.color: "transparent"

                                Column {
                                    anchors.centerIn: parent
                                    spacing: 6

                                    Row {
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        spacing: 8
                                        DocText {
                                            text: ChaSetI18n.tr("surfaces.splitter.editorCanvas")
                                            color: ThemeTokens.text
                                            font.pixelSize: Typography.sizeSmall
                                            font.weight: Typography.weightSemibold
                                            anchors.verticalCenter: parent.verticalCenter
                                        }
                                        ChaSetBadge {
                                            text: Math.round(verticalSplitter.splitRatio * 100) + "%"
                                            size: "sm"
                                            variant: "secondary"
                                            anchors.verticalCenter: parent.verticalCenter
                                        }
                                    }
                                    DocText {
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        text: ChaSetI18n.tr("surfaces.splitter.dragVerticalHint")
                                        color: ThemeTokens.subduedText
                                        font.pixelSize: Typography.sizeCaption
                                    }
                                }
                            }
                        }

                        rightItem: Component {
                            Rectangle {
                                color: ThemeTokens.panelRaised
                                border.color: "transparent"

                                Column {
                                    anchors.centerIn: parent
                                    spacing: 6

                                    Row {
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        spacing: 8
                                        DocText {
                                            text: ChaSetI18n.tr("surfaces.splitter.terminalConsole")
                                            color: ThemeTokens.text
                                            font.pixelSize: Typography.sizeSmall
                                            font.weight: Typography.weightSemibold
                                            anchors.verticalCenter: parent.verticalCenter
                                        }
                                        ChaSetBadge {
                                            text: Math.round((1 - verticalSplitter.splitRatio) * 100) + "%"
                                            size: "sm"
                                            variant: "outline"
                                            anchors.verticalCenter: parent.verticalCenter
                                        }
                                    }
                                    ChaSetButton {
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        text: ChaSetI18n.tr("surfaces.splitter.reset65")
                                        size: "xs"
                                        variant: "outline"
                                        onClicked: verticalSplitter.reset()
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // Animations Section
    Column {
        property string sectionId: "animations"
        width: parent.width
        spacing: 12

        DocText {
            text: ChaSetI18n.tr("showcase.animations", "Animations")
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
        }

        DocText {
            text: ChaSetI18n.tr("desktopComposite.splitter.animationsDesc", "Motion tokens and kinematic timing contracts for Splitter divider gutters.")
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }

        DocText {
            text: ChaSetI18n.tr("desktopComposite.splitter.animationsBulletQt1", "• Gutter indicator color and opacity transitions animate smoothly over ThemeTokens.motionQuick (150ms) using ThemeTokens.easeStandard curve.")
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }
        DocText {
            text: ChaSetI18n.tr("desktopComposite.splitter.animationsBullet2", "• Divider dragging kinematics are strictly un-animated for deterministic, 60fps real-time pointer tracking.")
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }
        DocText {
            text: ChaSetI18n.tr("desktopComposite.splitter.animationsBulletQt3", "• All transitions are guarded by ThemeTokens.animationsEnabled; when disabled, durations resolve to zero and animations stop.")
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }
    }

    ComponentReference {
        name: "Splitter"
        componentId: "splitter"
        propsModel: [
            { name: "orientation", type: "string", default: "'vertical'", description: ChaSetI18n.tr("components.splitter.orientationDesc", "Divider orientation: 'vertical' (separates left/right panes) or 'horizontal' (separates top/bottom panes).") },
            { name: "size", type: "real", default: "50", description: ChaSetI18n.tr("components.splitter.sizeDesc", "Controlled percentage width/height (0-100).") },
            { name: "initialSize", type: "int", default: "50", description: ChaSetI18n.tr("components.splitter.initialSizeDesc", "Initial size percentage for uncontrolled usage.") },
            { name: "minSize", type: "int", default: "0", description: ChaSetI18n.tr("components.splitter.minSizeDesc", "Minimum allowed percentage bound.") },
            { name: "maxSize", type: "int", default: "100", description: ChaSetI18n.tr("components.splitter.maxSizeDesc", "Maximum allowed percentage bound.") },
            { name: "gutterSize", type: "int", default: "8", description: ChaSetI18n.tr("components.splitter.gutterSizeDesc", "Interactive divider gutter thickness.") },
            { name: "leftItem", type: "Component", default: "null", description: ChaSetI18n.tr("components.splitter.leftItemDesc", "First pane content component.") },
            { name: "rightItem", type: "Component", default: "null", description: ChaSetI18n.tr("components.splitter.rightItemDesc", "Second pane content component.") }
        ]
    }
}
