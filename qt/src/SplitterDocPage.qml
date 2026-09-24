// SplitterDocPage.qml — Living Documentation for ChaSetSplitter
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Surfaces & Layout"
    pageTitle: "Splitter"
    description: "Multi-pane resizable layout container with draggable gutters and collapse limits for IDEs and desktop toolkits."
    tocItems: [
        { id: "overview", title: "Horizontal Splitter" },
        { id: "vertical", title: "Vertical Splitter" },
        { id: "installation", title: "Installation" },
        { id: "animations", title: "Animations" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "Props Reference" }
    ]

    ComponentPreview {
        title: "Horizontal Splitter Sandbox"
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
                    text: "Hover over the gutter between panes and drag horizontally to resize panels. Double-click to reset."
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeSmall
                }

                Rectangle {
                    width: ThemeTokens.dp(480)
                    height: ThemeTokens.dp(192)
                    radius: ThemeTokens.dp(6)
                    border.color: ThemeTokens.border
                    border.width: 1
                    color: ThemeTokens.panel
                    clip: true

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
                                        text: "Navigation Tree"
                                        color: ThemeTokens.text
                                        font.pixelSize: Typography.sizeSmall
                                        font.weight: Typography.weightSemibold
                                    }

                                    Column {
                                        spacing: 4
                                        DocText { text: "▾ src"; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeCaption; font.family: Typography.familyMono }
                                        DocText { text: "  ▸ components"; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeCaption; font.family: Typography.familyMono }
                                        DocText { text: "  ▸ layout"; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeCaption; font.family: Typography.familyMono }
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
                                            text: "Editor Workspace"
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
                                        text: "Drag splitter handle to resize panes"
                                        color: ThemeTokens.subduedText
                                        font.pixelSize: Typography.sizeCaption
                                    }

                                    ChaSetButton {
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        text: "Reset (35%)"
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

    ComponentPreview {
        title: "Vertical Splitter Sandbox"
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
                    text: "Top and bottom pane split with horizontal divider line. Drag vertically to resize console output."
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeSmall
                }

                Rectangle {
                    width: ThemeTokens.dp(480)
                    height: ThemeTokens.dp(220)
                    radius: ThemeTokens.dp(6)
                    border.color: ThemeTokens.border
                    border.width: 1
                    color: ThemeTokens.panel
                    clip: true

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
                                            text: "Editor Canvas"
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
                                        text: "Drag splitter handle vertically to resize"
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
                                            text: "Terminal Console"
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
                                        text: "Reset (65%)"
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

    ChaSetCodeBlock {
        title: "Installation"
        code: "import ChaSet 1.0\n\nChaSetSplitter {\n    orientation: \"vertical\"\n    initialSize: 35\n}"
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
            text: "Motion tokens and kinematic timing contracts for Splitter divider gutters."
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }

        DocText {
            text: "• Gutter indicator color and opacity transitions animate smoothly over ThemeTokens.motionQuick (150ms) using ThemeTokens.easeStandard curve."
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }
        DocText {
            text: "• Divider dragging kinematics are strictly un-animated for deterministic, 60fps real-time pointer tracking."
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }
        DocText {
            text: "• All transitions are guarded by ThemeTokens.animationsEnabled; when disabled, durations resolve to zero and animations stop."
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }
    }

    KeyboardShortcutsTable {
        componentId: "splitter"
    }

    PropsTable {
        title: "Props Reference"
        props: [
            { name: "orientation", type: "string", default: "'vertical'", description: "Divider orientation: 'vertical' (separates left/right panes) or 'horizontal' (separates top/bottom panes)." },
            { name: "size", type: "real", default: "50", description: "Controlled percentage width/height (0-100)." },
            { name: "initialSize", type: "int", default: "50", description: "Initial size percentage for default layout distribution." },
            { name: "minSize", type: "int", default: "0", description: "Minimum allowed percentage bound." },
            { name: "maxSize", type: "int", default: "100", description: "Maximum allowed percentage bound." },
            { name: "gutterSize", type: "int", default: "8", description: "Interactive divider gutter thickness." },
            { name: "leftItem", type: "Component", default: "null", description: "First pane content component." },
            { name: "rightItem", type: "Component", default: "null", description: "Second pane content component." }
        ]
    }
}
