// ScrollAreaDocPage.qml — Comprehensive Scroll Area Documentation matching React 1:1
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Surfaces & Layout"
    pageTitle: "Scroll Area"
    description: "Augments native scroll functionality with custom cross-browser styling, dynamic hot-zone expansion, and interactive stepper navigation buttons."

    property string heroMode: "vertical"
    property string heroSize: "default"
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
  size="${root.heroSize}"
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
    size: "${root.heroSize}"
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
                size: root.heroSize
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
                                DocText { text: parent.parent.modelData.version; color: ThemeTokens.accent; font.pixelSize: Typography.sizeSmall; font.family: Typography.familyMono; font.weight: Typography.weightBold; width: 140 }
                                DocText { text: parent.parent.modelData.summary; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeCaption; width: 340; elide: Text.ElideRight }
                                DocText { text: parent.parent.modelData.date; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeCaption }
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
                size: root.heroSize
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
                            width: ThemeTokens.dp(220); height: ThemeTokens.dp(160); radius: ThemeTokens.dp(8)
                            color: ThemeTokens.panel
                            border.color: ThemeTokens.border
                            Column {
                                anchors.fill: parent; anchors.margins: ThemeTokens.dp(14); spacing: ThemeTokens.dp(8)
                                Row {
                                    width: parent.width
                                    ChaSetIcon { name: parent.parent.parent.modelData.icon; size: ThemeTokens.dp(24); color: ThemeTokens.accent }
                                    Item { width: ThemeTokens.dp(10); height: 1 }
                                    Rectangle {
                                        width: ThemeTokens.dp(44); height: ThemeTokens.dp(18); radius: ThemeTokens.dp(9)
                                        color: Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.15)
                                        DocText { anchors.centerIn: parent; text: parent.parent.parent.parent.modelData.badge; color: ThemeTokens.accent; font.pixelSize: Typography.sizeMicro; font.weight: Typography.weightBold }
                                    }
                                }
                                DocText { text: parent.parent.modelData.title; color: ThemeTokens.text; font.pixelSize: Typography.sizeBody; font.weight: Typography.weightBold }
                                DocText { text: parent.parent.modelData.desc; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeCaption; wrapMode: TextEdit.WordWrap; width: parent.width }
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
                anchors.margins: ThemeTokens.dp(6)
                size: root.heroSize
                showVerticalScrollBar: true
                showHorizontalScrollBar: true
                showButtons: root.showButtons
                smoothScroll: root.smoothScroll
                contentWidth: ThemeTokens.dp(800)
                contentHeight: ThemeTokens.dp(600)

                Grid {
                    x: ThemeTokens.dp(10); y: ThemeTokens.dp(10); columns: 8; spacing: ThemeTokens.dp(8)
                    Repeater {
                        model: 64
                        delegate: Rectangle {
                            required property int index
                            width: ThemeTokens.dp(88); height: ThemeTokens.dp(60); radius: ThemeTokens.dp(6)
                            color: ThemeTokens.panel
                            border.color: ThemeTokens.border
                            DocText { anchors.centerIn: parent; text: "Cell " + (parent.index + 1); color: ThemeTokens.text; font.pixelSize: Typography.sizeCaption; font.weight: Typography.weightMedium }
                        }
                    }
                }
            }
        }

        // Bottom Controls Bar
        controlsData: [
            Row {
                width: childrenRect.width
                spacing: 6
                DocText { text: "Mode:"; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeCaption; anchors.verticalCenter: parent.verticalCenter }
                ChaSetButton {
                    size: "sm"
                    variant: root.heroMode === "vertical" ? "default" : "outline"
                    text: "Vertical"
                    onClicked: root.heroMode = "vertical"
                }
                ChaSetButton {
                    size: "sm"
                    variant: root.heroMode === "horizontal" ? "default" : "outline"
                    text: "Horizontal"
                    onClicked: root.heroMode = "horizontal"
                }
                ChaSetButton {
                    size: "sm"
                    variant: root.heroMode === "both" ? "default" : "outline"
                    text: "2D Dual-Axis"
                    onClicked: root.heroMode = "both"
                }
            },
            Row {
                width: childrenRect.width
                spacing: 6
                DocText { text: "Size:"; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeCaption; anchors.verticalCenter: parent.verticalCenter }
                ChaSetButton {
                    size: "sm"
                    variant: root.heroSize === "default" ? "default" : "outline"
                    text: "Default"
                    onClicked: root.heroSize = "default"
                }
                ChaSetButton {
                    size: "sm"
                    variant: root.heroSize === "sm" ? "default" : "outline"
                    text: "Compact (sm)"
                    onClicked: root.heroSize = "sm"
                }
            },
            Row {
                width: childrenRect.width
                spacing: 12
                ChaSetCheckbox {
                    size: "sm"
                    label: "Show Steppers"
                    checked: root.showButtons
                    onToggled: (val) => root.showButtons = val
                }
                ChaSetCheckbox {
                    size: "sm"
                    label: "Smooth Scroll"
                    checked: root.smoothScroll
                    onToggled: (val) => root.smoothScroll = val
                }
            }
        ]
    }

    // ==============================================================
    // 2. Anatomy
    // ==============================================================
    DocAnatomy {
        width: parent.width
        qtCode: `import ChaSet\n\nChaSetScrollArea {\n    width: 300\n    height: 200\n    contentWidth: 300\n    contentHeight: 600\n}`
        reactCode: `import { ScrollArea } from "@chahu/cha-set";\n\n<ScrollArea className="h-48 w-full border rounded">\n  <div className="p-4">Scrollable content area...</div>\n</ScrollArea>`
    }

    // ==============================================================
    // 3. Horizontal Scrolling Example
    // ==============================================================
    Column {
        width: parent.width
        spacing: 12

        DocText {
            text: "Horizontal Example"
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeTitleSm
            font.weight: Typography.weightBold
        }

        DocText {
            text: "Hover over the bottom scrollbar to reveal the left and right stepper buttons."
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
        }

        Rectangle {
            width: parent.width
            height: ThemeTokens.dp(220)
            radius: ThemeTokens.dp(8)
            color: ThemeTokens.background
            border.color: ThemeTokens.border

            ChaSetScrollArea {
                anchors.fill: parent
                anchors.margins: ThemeTokens.dp(12)
                showVerticalScrollBar: false
                showHorizontalScrollBar: true
                showButtons: true
                contentWidth: horizExampleRow.implicitWidth + ThemeTokens.dp(24)
                contentHeight: parent.height - ThemeTokens.dp(24)

                Row {
                    id: horizExampleRow
                    x: ThemeTokens.dp(8); y: ThemeTokens.dp(8); spacing: ThemeTokens.dp(14)
                    Repeater {
                        model: ShowcaseData.featureCards
                        delegate: Rectangle {
                            required property var modelData
                            width: ThemeTokens.dp(220); height: ThemeTokens.dp(160); radius: ThemeTokens.dp(8)
                            color: ThemeTokens.panel
                            border.color: ThemeTokens.border
                            Column {
                                anchors.fill: parent; anchors.margins: ThemeTokens.dp(14); spacing: ThemeTokens.dp(8)
                                Row {
                                    width: parent.width
                                    DocText { text: parent.parent.parent.modelData.icon; font.pixelSize: Typography.sizeTitleMd }
                                    Item { width: ThemeTokens.dp(10); height: 1 }
                                    Rectangle {
                                        width: ThemeTokens.dp(44); height: ThemeTokens.dp(18); radius: ThemeTokens.dp(9)
                                        color: Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.15)
                                        DocText { anchors.centerIn: parent; text: parent.parent.parent.parent.modelData.badge; color: ThemeTokens.accent; font.pixelSize: Typography.sizeMicro; font.weight: Typography.weightBold }
                                    }
                                }
                                DocText { text: parent.parent.modelData.title; color: ThemeTokens.text; font.pixelSize: Typography.sizeBody; font.weight: Typography.weightBold }
                                DocText { text: parent.parent.modelData.desc; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeCaption; wrapMode: TextEdit.WordWrap; width: parent.width }
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
        spacing: ThemeTokens.dp(12)

        DocText {
            text: "Dual-Axis"
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeTitleSm
            font.weight: Typography.weightBold
        }

        DocText {
            text: "When content exceeds both width and height, both scrollbars render with a synchronized corner piece."
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
        }

        Rectangle {
            width: parent.width
            height: ThemeTokens.dp(240)
            radius: ThemeTokens.dp(8)
            color: ThemeTokens.background
            border.color: ThemeTokens.border

            ChaSetScrollArea {
                anchors.fill: parent
                anchors.margins: ThemeTokens.dp(10)
                showVerticalScrollBar: true
                showHorizontalScrollBar: true
                showButtons: true
                contentWidth: ThemeTokens.dp(900)
                contentHeight: ThemeTokens.dp(500)

                Rectangle {
                    width: ThemeTokens.dp(900); height: ThemeTokens.dp(500); color: "transparent"
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
                        font.family: Typography.familyMono
                        font.pixelSize: Typography.sizeSmall
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

        DocText {
            text: "Dual-Box Hot Zone"
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeTitleSm
            font.weight: Typography.weightBold
        }

        DocText {
            text: "Traditional narrow scrollbars are difficult to target with a mouse pointer. ChaSet introduces an interaction hot-zone paired with an animated visual indicator that expands from slim idle to expanded hover with 150ms cubic easing."
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }

        ChaSetCard {
            width: parent.width
            customRadius: ThemeTokens.dp(8)

            Column {
                width: parent.width
                topPadding: ThemeTokens.dp(14)
                bottomPadding: ThemeTokens.dp(14)
                leftPadding: ThemeTokens.dp(14)
                rightPadding: ThemeTokens.dp(14)
                spacing: ThemeTokens.dp(8)
                Row {
                    spacing: ThemeTokens.dp(8)
                    Rectangle { width: ThemeTokens.dp(8); height: ThemeTokens.dp(8); radius: ThemeTokens.dp(4); color: ThemeTokens.accent; anchors.verticalCenter: parent.verticalCenter }
                    DocText { text: "Idle State: Slim indicator bar, non-intrusive and lightweight."; color: ThemeTokens.text; font.pixelSize: Typography.sizeSmall }
                }
                Row {
                    spacing: ThemeTokens.dp(8)
                    Rectangle { width: ThemeTokens.dp(8); height: ThemeTokens.dp(8); radius: ThemeTokens.dp(4); color: ThemeTokens.accent; anchors.verticalCenter: parent.verticalCenter }
                    DocText { text: "Hover State: Expands with high visual affordance."; color: ThemeTokens.text; font.pixelSize: Typography.sizeSmall }
                }
                Row {
                    spacing: ThemeTokens.dp(8)
                    Rectangle { width: ThemeTokens.dp(8); height: ThemeTokens.dp(8); radius: ThemeTokens.dp(4); color: ThemeTokens.accent; anchors.verticalCenter: parent.verticalCenter }
                    DocText { text: "Hit Area: Compact trigger box prevents accidental cursor capture."; color: ThemeTokens.text; font.pixelSize: Typography.sizeSmall }
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

        DocText {
            text: "Stepper Buttons"
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeTitleSm
            font.weight: Typography.weightBold
        }

        DocText {
            text: "Hovering the scrollbar reveals two-end stepper action buttons:"
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
        }

        Row {
            width: parent.width
            spacing: ThemeTokens.dp(14)

            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(14)) / 2
                customRadius: ThemeTokens.dp(8)

                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(14)
                    bottomPadding: ThemeTokens.dp(14)
                    leftPadding: ThemeTokens.dp(14)
                    rightPadding: ThemeTokens.dp(14)
                    spacing: ThemeTokens.dp(6)
                    DocText { width: parent.width - ThemeTokens.dp(28); wrap: true; text: "Vertical Cluster"; color: ThemeTokens.text; font.pixelSize: Typography.sizeBody; font.weight: Typography.weightBold }
                    DocText { width: parent.width - ThemeTokens.dp(28); wrap: true; text: "• Top: [To Top] & [Page Up] (85% viewport step)"; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeCaption }
                    DocText { width: parent.width - ThemeTokens.dp(28); wrap: true; text: "• Bottom: [Page Down] & [To Bottom]"; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeCaption }
                    DocText { width: parent.width - ThemeTokens.dp(28); wrap: true; text: "• Auto-disabled when at boundary limits."; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeCaption }
                }
            }

            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(14)) / 2
                customRadius: ThemeTokens.dp(8)

                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(14)
                    bottomPadding: ThemeTokens.dp(14)
                    leftPadding: ThemeTokens.dp(14)
                    rightPadding: ThemeTokens.dp(14)
                    spacing: ThemeTokens.dp(6)
                    DocText { width: parent.width - ThemeTokens.dp(28); wrap: true; text: "Horizontal Cluster"; color: ThemeTokens.text; font.pixelSize: Typography.sizeBody; font.weight: Typography.weightBold }
                    DocText { width: parent.width - ThemeTokens.dp(28); wrap: true; text: "• Left: [To Start] & [Page Left]"; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeCaption }
                    DocText { width: parent.width - ThemeTokens.dp(28); wrap: true; text: "• Right: [Page Right] & [To End]"; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeCaption }
                    DocText { width: parent.width - ThemeTokens.dp(28); wrap: true; text: "• Supports smooth animated interpolation."; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeCaption }
                }
            }
        }
    }

        ComponentReference {
        name: "ScrollArea"
        componentId: "scroll-area"
        propsModel: [
            ["size", "string", "\"default\"", "Scrollbar density and scale (\"default\" | \"sm\")."],
            ["showVerticalScrollBar", "bool", "true", "Whether to render vertical scrollbar."],
            ["showHorizontalScrollBar", "bool", "false", "Whether to render horizontal scrollbar."],
            ["showButtons", "bool", "true", "Whether stepper navigation buttons appear on hover."],
            ["pageStepRatio", "real", "0.85", "Viewport dimension ratio for page up / down."],
            ["smoothScroll", "bool", "true", "Whether stepper buttons trigger animated smooth scrolling."]
        ]
    }

    ComponentReference {
        name: "ScrollBar"
        componentId: "scroll-bar"
        isSubComponent: true
        propsModel: [
            ["orientation", "Qt::Orientation", "Qt.Vertical", "Scrollbar orientation axis."],
            ["barSize", "string", "\"default\"", "Scrollbar density and scale (\"default\" | \"sm\")."],
            ["collapsedSize", "int", "4", "Thickness of the visual indicator when idle."],
            ["expandedSize", "int", "10", "Thickness of the visual indicator when hovered."],
            ["hitSize", "int", "14", "Thickness of the pointer-capture hot-zone (preventing Win32 resize border conflict)."]
        ]
    }
}