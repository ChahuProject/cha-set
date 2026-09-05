// ScrollAreaDocPage.qml — Comprehensive Scroll Area Documentation matching React 1:1
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Components"
    pageTitle: "Scroll Area"
    description: "Augments native scroll functionality with custom cross-browser styling, dynamic hot-zone expansion, and interactive stepper navigation buttons."
    tocItems: [
        { id: "preview", title: "Interactive Preview" },
        { id: "installation", title: "Installation" },
        { id: "horizontal-example", title: "Horizontal Scrolling" },
        { id: "dual-axis", title: "Dual-Axis (Both Axes)" },
        { id: "hotzone", title: "Hot Zone & Dynamic Width" },
        { id: "steppers", title: "Stepper Navigation" },
        { id: "props", title: "API Reference" }
    ]

    property string heroMode: "vertical"
    property bool showButtons: true
    property bool smoothScroll: true
    property int customRadius: 8
    property color cFg: ThemeTokens.text
    property color cMutedFg: ThemeTokens.subduedText
    property color cCard: ThemeTokens.panel
    property color cBorder: ThemeTokens.border
    property color cPrimary: ThemeTokens.accent
    property color cAccentBg: ThemeTokens.hover

    signal logAction(string msg)

    // ==============================================================
    // 1. Interactive Preview Hero
    // ==============================================================
    ComponentPreview {
        title: "ScrollArea Showcase"
        reactCode: `<ScrollArea
  className="h-72 w-full rounded-md border border-border"
  showVerticalScrollBar={${root.heroMode !== "horizontal"}}
  showHorizontalScrollBar={${root.heroMode !== "vertical"}}
  showButtons={${root.showButtons}}
  smoothScroll={${root.smoothScroll}}
>
  {/* Content */}
</ScrollArea>`
        qtCode: `ChaSetScrollArea {
    width: parent.width
    height: 280
    showButtons: ${root.showButtons}
    showVerticalScrollBar: ${root.heroMode !== "horizontal"}
    showHorizontalScrollBar: ${root.heroMode !== "vertical"}
    smoothScroll: ${root.smoothScroll}

    // Viewport Content
}`

        // Center Stage Container
        Rectangle {
            anchors.fill: parent
            anchors.margins: 14
            radius: 8
            color: ThemeTokens.background
            border.color: ThemeTokens.border
            clip: true

            // Mode 1: Vertical 120 Logs
            ChaSetScrollArea {
                id: demoScrollVert
                visible: root.heroMode === "vertical"
                anchors.fill: parent
                anchors.margins: 4
                showButtons: root.showButtons
                smoothScroll: root.smoothScroll
                contentWidth: parent.width - 20
                contentHeight: vertCol.implicitHeight + 16

                Column {
                    id: vertCol
                    x: 8; y: 8; width: parent.width - 16; spacing: 6
                    Repeater {
                        model: ShowcaseData.changelog
                        delegate: Rectangle {
                            required property var modelData
                            required property int index
                            width: vertCol.width; height: 36; radius: 4
                            color: index % 2 === 0 ? ThemeTokens.panel : "transparent"
                            border.color: ThemeTokens.border; border.width: 0.5
                            Row {
                                anchors.fill: parent; anchors.margins: 8; spacing: 10
                                Text { text: parent.parent.modelData.version; color: ThemeTokens.accent; font.pixelSize: 12; font.family: "Consolas"; font.weight: Font.Bold; width: 140 }
                                Text { text: parent.parent.modelData.summary; color: ThemeTokens.subduedText; font.pixelSize: 11; width: 340; elide: Text.ElideRight }
                                Text { text: parent.parent.modelData.date; color: ThemeTokens.subduedText; font.pixelSize: 11 }
                            }
                        }
                    }
                }
            }

            // Mode 2: Horizontal 24 Cards
            ChaSetScrollArea {
                id: demoScrollHoriz
                visible: root.heroMode === "horizontal"
                anchors.fill: parent
                anchors.margins: 10
                showVerticalScrollBar: false
                showHorizontalScrollBar: true
                showButtons: root.showButtons
                smoothScroll: root.smoothScroll
                contentWidth: horizRow.implicitWidth + 24
                contentHeight: parent.height - 20

                Row {
                    id: horizRow
                    x: 8; y: 8; spacing: 12
                    Repeater {
                        model: ShowcaseData.featureCards
                        delegate: Rectangle {
                            required property var modelData
                            width: 220; height: 160; radius: 8
                            color: ThemeTokens.panel
                            border.color: ThemeTokens.border
                            Column {
                                anchors.fill: parent; anchors.margins: 14; spacing: 8
                                Row {
                                    width: parent.width
                                    Text { text: parent.parent.parent.modelData.icon; font.pixelSize: 22 }
                                    Item { width: 10; height: 1 }
                                    Rectangle {
                                        width: 44; height: 18; radius: 9
                                        color: Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.15)
                                        Text { anchors.centerIn: parent; text: parent.parent.parent.parent.modelData.badge; color: ThemeTokens.accent; font.pixelSize: 10; font.weight: Font.Bold }
                                    }
                                }
                                Text { text: parent.parent.modelData.title; color: ThemeTokens.text; font.pixelSize: 13; font.weight: Font.Bold }
                                Text { text: parent.parent.modelData.desc; color: ThemeTokens.subduedText; font.pixelSize: 11; wrapMode: Text.WordWrap; width: parent.width }
                            }
                        }
                    }
                }
            }

            // Mode 3: Dual Axis 2D Grid
            ChaSetScrollArea {
                id: demoScrollBoth
                visible: root.heroMode === "both"
                anchors.fill: parent
                anchors.margins: 6
                showVerticalScrollBar: true
                showHorizontalScrollBar: true
                showButtons: root.showButtons
                smoothScroll: root.smoothScroll
                contentWidth: 800
                contentHeight: 600

                Grid {
                    x: 10; y: 10; columns: 8; spacing: 8
                    Repeater {
                        model: 64
                        delegate: Rectangle {
                            required property int index
                            width: 88; height: 60; radius: 6
                            color: ThemeTokens.panel
                            border.color: ThemeTokens.border
                            Text { anchors.centerIn: parent; text: "Cell " + (parent.index + 1); color: ThemeTokens.text; font.pixelSize: 11; font.weight: Font.Medium }
                        }
                    }
                }
            }
        }

        // Bottom Controls Bar
        controlsData: [
            Row {
                spacing: 6
                Text { text: "Mode:"; color: ThemeTokens.subduedText; font.pixelSize: 11; anchors.verticalCenter: parent.verticalCenter }
                Repeater {
                    model: [["vertical", "Vertical"], ["horizontal", "Horizontal"], ["both", "2D Dual-Axis"]]
                    delegate: ChaSetButton {
                        required property var modelData
                        size: "sm"
                        variant: root.heroMode === modelData[0] ? "default" : "outline"
                        text: modelData[1]
                        onClicked: root.heroMode = modelData[0]
                    }
                }
            },
            Row {
                spacing: 12
                CheckBox {
                    text: "Show Steppers"
                    checked: root.showButtons
                    onToggled: root.showButtons = checked
                }
                CheckBox {
                    text: "Smooth Scroll"
                    checked: root.smoothScroll
                    onToggled: root.smoothScroll = checked
                }
            }
        ]
    }

    // ==============================================================
    // 2. Installation
    // ==============================================================
    Column {
        width: parent.width
        spacing: 10

        Text {
            text: "Installation"
            color: ThemeTokens.text
            font.pixelSize: 20
            font.weight: Font.Bold
        }

        Rectangle {
            width: parent.width
            height: 48
            radius: 6
            color: ThemeTokens.background
            border.color: ThemeTokens.border
            Row {
                anchors.fill: parent; anchors.margins: 14; spacing: 10
                Text { text: "$"; color: ThemeTokens.subduedText; font.family: "Consolas"; font.pixelSize: 13 }
                Text { text: "pnpm add @chahu/cha-set"; color: ThemeTokens.text; font.family: "Consolas"; font.pixelSize: 13; font.weight: Font.Bold }
            }
        }

        Text { text: "Import in QML (Qt Quick):"; color: ThemeTokens.subduedText; font.pixelSize: 12 }

        Rectangle {
            width: parent.width
            height: 60
            radius: 6
            color: ThemeTokens.background
            border.color: ThemeTokens.border
            TextArea {
                anchors.fill: parent; anchors.margins: 12
                readOnly: true
                text: "import QtQuick 6.10\nimport ChaSet"
                color: ThemeTokens.text
                font.family: "Consolas, monospace"
                font.pixelSize: 12
                background: null
            }
        }
    }

    // ==============================================================
    // 3. Horizontal Scrolling Example
    // ==============================================================
    Column {
        width: parent.width
        spacing: 12

        Text {
            text: "Horizontal Scrolling Example"
            color: ThemeTokens.text
            font.pixelSize: 20
            font.weight: Font.Bold
        }

        Text {
            text: "Hover over the bottom scrollbar to reveal the left (⏪ / ◀) and right (▶ / ⏩) stepper buttons."
            color: ThemeTokens.subduedText
            font.pixelSize: 13
        }

        Rectangle {
            width: parent.width
            height: 220
            radius: 8
            color: ThemeTokens.background
            border.color: ThemeTokens.border

            ChaSetScrollArea {
                anchors.fill: parent
                anchors.margins: 12
                showVerticalScrollBar: false
                showHorizontalScrollBar: true
                showButtons: true
                contentWidth: horizExampleRow.implicitWidth + 24
                contentHeight: parent.height - 24

                Row {
                    id: horizExampleRow
                    x: 8; y: 8; spacing: 14
                    Repeater {
                        model: ShowcaseData.featureCards
                        delegate: Rectangle {
                            required property var modelData
                            width: 220; height: 160; radius: 8
                            color: ThemeTokens.panel
                            border.color: ThemeTokens.border
                            Column {
                                anchors.fill: parent; anchors.margins: 14; spacing: 8
                                Row {
                                    width: parent.width
                                    Text { text: parent.parent.parent.modelData.icon; font.pixelSize: 22 }
                                    Item { width: 10; height: 1 }
                                    Rectangle {
                                        width: 44; height: 18; radius: 9
                                        color: Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.15)
                                        Text { anchors.centerIn: parent; text: parent.parent.parent.parent.modelData.badge; color: ThemeTokens.accent; font.pixelSize: 10; font.weight: Font.Bold }
                                    }
                                }
                                Text { text: parent.parent.modelData.title; color: ThemeTokens.text; font.pixelSize: 13; font.weight: Font.Bold }
                                Text { text: parent.parent.modelData.desc; color: ThemeTokens.subduedText; font.pixelSize: 11; wrapMode: Text.WordWrap; width: parent.width }
                            }
                        }
                    }
                }
            }
        }
    }

    // ==============================================================
    // 4. Dual-Axis Example
    // ==============================================================
    Column {
        width: parent.width
        spacing: 12

        Text {
            text: "Dual-Axis (Both Axes with Corner)"
            color: ThemeTokens.text
            font.pixelSize: 20
            font.weight: Font.Bold
        }

        Text {
            text: "When content exceeds both width and height, both scrollbars render with a synchronized corner piece."
            color: ThemeTokens.subduedText
            font.pixelSize: 13
        }

        Rectangle {
            width: parent.width
            height: 240
            radius: 8
            color: ThemeTokens.background
            border.color: ThemeTokens.border

            ChaSetScrollArea {
                anchors.fill: parent
                anchors.margins: 10
                showVerticalScrollBar: true
                showHorizontalScrollBar: true
                showButtons: true
                contentWidth: 900
                contentHeight: 500

                Rectangle {
                    width: 900; height: 500; color: "transparent"
                    TextArea {
                        anchors.fill: parent; anchors.margins: 14
                        readOnly: true
                        text: `// Large Cross-Stack Configuration & Token Matrix (Multi-Page Test Dataset)
export const CrossStackSpecification = {
  specVersion: 1,
  schema: "zod",
  namespace: "@chahu/cha-set",
  supportedPlatforms: ["react-web", "qt-quick-desktop", "qt-widgets"],
  tokenShards: [
    "spec/tokens/meta.json",
    "spec/tokens/primitives.json",
    "spec/tokens/semantic/core.json",
    "spec/tokens/semantic/dunting.json",
    "spec/tokens/themes/axes.json",
    "spec/tokens/components/button.json",
    "spec/tokens/components/scrollbar.json"
  ],
  capabilities: {
    scrollbar: {
      hotZone: "1rem",
      collapsed: "0.375rem",
      expanded: "0.75rem",
      pageStepRatio: 0.85,
      smoothScroll: true,
      boundaryClamp: true,
      steppers: { toTop: true, pageUp: true, pageDown: true, toBottom: true }
    }
  }
};`
                        color: ThemeTokens.text
                        font.family: "Consolas, monospace"
                        font.pixelSize: 12
                        background: null
                    }
                }
            }
        }
    }

    // ==============================================================
    // 5. Hot Zone & Dynamic Width Feature
    // ==============================================================
    Column {
        width: parent.width
        spacing: 12

        Text {
            text: "Dual-Box Hot Zone & Dynamic Width"
            color: ThemeTokens.text
            font.pixelSize: 20
            font.weight: Font.Bold
        }

        Text {
            text: "Traditional narrow scrollbars are difficult to target with a mouse pointer. ChaSet introduces an interaction hot-zone paired with an animated visual indicator that expands from 4px idle to 8px hover with 150ms cubic easing."
            color: ThemeTokens.subduedText
            font.pixelSize: 13
            wrapMode: Text.WordWrap
            width: parent.width
        }

        Rectangle {
            width: parent.width
            height: 110
            radius: 8
            color: ThemeTokens.panel
            border.color: ThemeTokens.border

            Column {
                anchors.fill: parent; anchors.margins: 14; spacing: 8
                Row {
                    spacing: 8
                    Rectangle { width: 8; height: 8; radius: 4; color: ThemeTokens.accent; anchors.verticalCenter: parent.verticalCenter }
                    Text { text: "Idle State: 4px slim indicator bar, non-intrusive and lightweight."; color: ThemeTokens.text; font.pixelSize: 12 }
                }
                Row {
                    spacing: 8
                    Rectangle { width: 8; height: 8; radius: 4; color: ThemeTokens.accent; anchors.verticalCenter: parent.verticalCenter }
                    Text { text: "Hover State: Expands to 8px with high visual affordance."; color: ThemeTokens.text; font.pixelSize: 12 }
                }
                Row {
                    spacing: 8
                    Rectangle { width: 8; height: 8; radius: 4; color: ThemeTokens.accent; anchors.verticalCenter: parent.verticalCenter }
                    Text { text: "Hit Area: 8px compact trigger box prevents accidental cursor capture."; color: ThemeTokens.text; font.pixelSize: 12 }
                }
            }
        }
    }

    // ==============================================================
    // 6. Two-End Stepper Navigation
    // ==============================================================
    Column {
        width: parent.width
        spacing: 12

        Text {
            text: "Two-End Stepper Navigation"
            color: ThemeTokens.text
            font.pixelSize: 20
            font.weight: Font.Bold
        }

        Text {
            text: "Hovering the scrollbar reveals two-end stepper action buttons:"
            color: ThemeTokens.subduedText
            font.pixelSize: 13
        }

        Row {
            width: parent.width
            spacing: 14

            Rectangle {
                width: (parent.width - 14) / 2
                height: 110
                radius: 8
                color: ThemeTokens.panel
                border.color: ThemeTokens.border

                Column {
                    anchors.fill: parent; anchors.margins: 14; spacing: 6
                    Text { text: "Vertical Cluster"; color: ThemeTokens.text; font.pixelSize: 13; font.weight: Font.Bold }
                    Text { text: "• Top: ⏫ To Top & 🔼 Page Up (85% viewport step)"; color: ThemeTokens.subduedText; font.pixelSize: 11 }
                    Text { text: "• Bottom: 🔽 Page Down & ⏬ To Bottom"; color: ThemeTokens.subduedText; font.pixelSize: 11 }
                    Text { text: "• Auto-disabled when at boundary limits."; color: ThemeTokens.subduedText; font.pixelSize: 11 }
                }
            }

            Rectangle {
                width: (parent.width - 14) / 2
                height: 110
                radius: 8
                color: ThemeTokens.panel
                border.color: ThemeTokens.border

                Column {
                    anchors.fill: parent; anchors.margins: 14; spacing: 6
                    Text { text: "Horizontal Cluster"; color: ThemeTokens.text; font.pixelSize: 13; font.weight: Font.Bold }
                    Text { text: "• Left: ⏪ To Start & ◀ Page Left"; color: ThemeTokens.subduedText; font.pixelSize: 11 }
                    Text { text: "• Right: ▶ Page Right & ⏩ To End"; color: ThemeTokens.subduedText; font.pixelSize: 11 }
                    Text { text: "• Supports smooth animated interpolation."; color: ThemeTokens.subduedText; font.pixelSize: 11 }
                }
            }
        }
    }

    // ==============================================================
    // 7. API Reference
    // ==============================================================
    Column {
        width: parent.width
        spacing: 14

        Text {
            text: "API Reference"
            color: ThemeTokens.text
            font.pixelSize: 20
            font.weight: Font.Bold
        }

        PropsTable {
            width: parent.width
            title: "ChaSetScrollArea Properties"
            propsModel: [
                ["showVerticalScrollBar", "bool", "true", "Whether to render vertical scrollbar."],
                ["showHorizontalScrollBar", "bool", "false", "Whether to render horizontal scrollbar."],
                ["showButtons", "bool", "true", "Whether stepper navigation buttons appear on hover."],
                ["pageStepRatio", "real", "0.85", "Viewport dimension ratio for page up / down."],
                ["smoothScroll", "bool", "true", "Whether stepper buttons trigger animated smooth scrolling."]
            ]
        }

        PropsTable {
            width: parent.width
            title: "ChaSetScrollBar Properties"
            propsModel: [
                ["orientation", "Qt::Orientation", "Qt.Vertical", "Scrollbar orientation axis."],
                ["collapsedSize", "int", "4", "Thickness in pixels of the visual indicator when idle."],
                ["expandedSize", "int", "8", "Thickness in pixels of the visual indicator when hovered."],
                ["hitSize", "int", "8", "Thickness in pixels of the pointer-capture hot-zone."]
            ]
        }
    }
}

