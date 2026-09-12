// SplitterDocPage.qml — Living Documentation for ChaSetSplitter
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Desktop & Virtualization"
    pageTitle: "Splitter"
    description: "Multi-pane resizable layout container with a draggable gutter divider, ratio boundary clamps, and double-click reset."
    tocItems: [
        { id: "preview", title: "Interactive Preview" },
        { id: "installation", title: "Installation" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "API Reference" }
    ]

    ComponentPreview {
        title: "Splitter Preview"
        reactCode: `<Splitter orientation="horizontal" defaultRatio={0.4}>
  <PaneOne />
  <PaneTwo />
</Splitter>`
        qtCode: `ChaSetSplitter {
    width: 400
    height: 200
    orientation: "horizontal"
    splitRatio: 0.4
    leftItem: Component { ... }
    rightItem: Component { ... }
}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: 12

                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "Drag the center bar to resize panes (Double-click gutter to reset to 50%):"
                    color: ThemeTokens.subduedText
                    font.pixelSize: 12
                }

                ChaSetSplitter {
                    id: splitter
                    width: 420
                    height: 200
                    splitRatio: 0.38

                    leftItem: Component {
                        Rectangle {
                            color: ThemeTokens.panel
                            border.color: ThemeTokens.border
                            border.width: 1
                            radius: 4

                            Column {
                                anchors.centerIn: parent
                                spacing: 6
                                Text { text: "Navigation Tree"; color: ThemeTokens.text; font.pixelSize: 12; font.weight: Font.DemiBold }
                                ChaSetBadge { text: Math.round(splitter.splitRatio * 100) + "% Width"; size: "sm"; variant: "secondary" }
                            }
                        }
                    }

                    rightItem: Component {
                        Rectangle {
                            color: ThemeTokens.hover
                            border.color: ThemeTokens.border
                            border.width: 1
                            radius: 4

                            Column {
                                anchors.centerIn: parent
                                spacing: 6
                                Text { text: "Editor Viewport"; color: ThemeTokens.text; font.pixelSize: 12; font.weight: Font.DemiBold }
                                ChaSetBadge { text: Math.round((1 - splitter.splitRatio) * 100) + "% Width"; size: "sm"; variant: "secondary" }
                                ChaSetButton {
                                    text: "Reset (50%)"
                                    size: "xs"
                                    variant: "outline"
                                    onClicked: splitter.splitRatio = 0.5
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
        code: "import ChaSet 1.0\n\nChaSetSplitter { splitRatio: 0.5 }"
        language: "qml"
    }

    KeyboardShortcutsTable {
        componentId: "splitter"
    }

    PropsTable {
        title: "Props Reference"
        props: [
            { name: "orientation", type: "string", default: "'horizontal'", description: "Split axis: 'horizontal' or 'vertical'." },
            { name: "splitRatio", type: "real", default: "0.5", description: "Proportional width/height distribution of the first pane (0.0 to 1.0)." },
            { name: "minRatio", type: "real", default: "0.15", description: "Minimum allowable constraint ratio." },
            { name: "maxRatio", type: "real", default: "0.85", description: "Maximum allowable constraint ratio." },
            { name: "gutterSize", type: "int", default: "6", description: "Draggable divider width." }
        ]
    }
}
