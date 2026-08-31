// ScrollAreaDocPage.qml — Comprehensive Scroll Area Documentation matching React 1:1
import QtQuick 6.10
import QtQuick.Controls 6.10
import chaSet

DocLayout {
    id: root
    category: "Components"
    pageTitle: "Scroll Area"
    description: "Augments native scroll functionality with custom cross-browser styling, dynamic hot-zone expansion, and interactive stepper navigation buttons."
    tocItems: [
        { id: "preview", title: "Interactive Preview" },
        { id: "horizontal-example", title: "Horizontal Scrolling" },
        { id: "dual-axis", title: "Dual-Axis (Both Axes)" },
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

    // 1. Interactive Preview Hero
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
        qtCode: `ChaSetScrollView {
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
            ChaSetScrollView {
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
            ChaSetScrollView {
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
            ChaSetScrollView {
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
                    delegate: Rectangle {
                        required property var modelData
                        width: 76; height: 26; radius: 5
                        color: root.heroMode === modelData[0] ? ThemeTokens.accent : ThemeTokens.panel
                        border.color: ThemeTokens.border
                        Text { anchors.centerIn: parent; text: modelData[1]; color: root.heroMode === modelData[0] ? "#ffffff" : ThemeTokens.text; font.pixelSize: 11; font.weight: Font.Medium }
                        MouseArea { anchors.fill: parent; cursorShape: Qt.PointingHandCursor; onClicked: root.heroMode = modelData[0] }
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
}
