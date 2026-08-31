// generate-showcase-data.mjs — Emits typed showcase datasets for React & Qt
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '..', '..');
const showcaseDir = path.resolve(repoRoot, 'spec', 'showcase');

const changelog = JSON.parse(fs.readFileSync(path.join(showcaseDir, 'changelog.json'), 'utf8'));
const featureCards = JSON.parse(fs.readFileSync(path.join(showcaseDir, 'feature-cards.json'), 'utf8'));
const navigation = JSON.parse(fs.readFileSync(path.join(showcaseDir, 'navigation.json'), 'utf8'));

// React Output
const reactOutDir = path.resolve(repoRoot, 'packages', 'react', 'examples', 'basic', 'src', 'data');
if (!fs.existsSync(reactOutDir)) fs.mkdirSync(reactOutDir, { recursive: true });

const reactCode = `// GENERATED FILE - DO NOT EDIT.
// Source: spec/showcase/*.json via spec/generators/generate-showcase-data.mjs

export interface ChangelogItem {
  id: string;
  version: string;
  date: string;
  category: string;
  summary: string;
}

export interface FeatureCardItem {
  id: string;
  icon: string;
  title: string;
  badge: string;
  desc: string;
}

export interface NavItem {
  id: string;
  title: string;
  href: string;
  badge?: string;
  desc: string;
}

export interface NavCategory {
  title: string;
  items: NavItem[];
}

export const CHANGELOG_DATA: ChangelogItem[] = ${JSON.stringify(changelog, null, 2)};
export const FEATURE_CARDS_DATA: FeatureCardItem[] = ${JSON.stringify(featureCards, null, 2)};
export const NAVIGATION_DATA: NavCategory[] = ${JSON.stringify(navigation, null, 2)};
`;

fs.writeFileSync(path.join(reactOutDir, 'showcaseData.generated.ts'), reactCode, 'utf8');

// Qt QML Singleton Output
const qtOutDir = path.resolve(repoRoot, 'qt', 'src');
const qtQml = `pragma Singleton
import QtQuick 6.10

// GENERATED FILE - DO NOT EDIT.
// Source: spec/showcase/*.json via spec/generators/generate-showcase-data.mjs
QtObject {
    id: root

    readonly property var changelog: ${JSON.stringify(changelog)}
    readonly property var featureCards: ${JSON.stringify(featureCards)}
    readonly property var navigation: ${JSON.stringify(navigation)}
}
`;

fs.writeFileSync(path.join(qtOutDir, 'ShowcaseData.generated.qml'), qtQml, 'utf8');

// Emit DocLayout.qml
const docLayoutQml = `// DocLayout.qml — Standard Documentation Page Template matching React DocLayout.tsx 1:1
import QtQuick 6.10
import QtQuick.Controls 6.10
import chaSet

Item {
    id: root
    width: parent ? parent.width : 860
    implicitHeight: layoutRow.implicitHeight + 40

    property string category: "Components"
    property string pageTitle: "Button"
    property string description: ""
    property var tocItems: []
    default property alias contentData: pageContentCol.data

    property bool copiedLink: false

    Timer {
        id: copyTimer
        interval: 2000
        onTriggered: root.copiedLink = false
    }

    Row {
        id: layoutRow
        width: parent.width
        spacing: 32

        // Main Center Content Column
        Column {
            id: mainCol
            width: root.tocItems && root.tocItems.length > 0 ? Math.max(480, parent.width - 200) : parent.width
            spacing: 24

            // Breadcrumb
            Row {
                spacing: 6
                Text { text: "Docs"; color: ThemeTokens.subduedText; font.pixelSize: 12 }
                Text { text: "/"; color: ThemeTokens.subduedText; font.pixelSize: 12 }
                Text { text: root.category; color: ThemeTokens.subduedText; font.pixelSize: 12 }
                Text { text: "/"; color: ThemeTokens.subduedText; font.pixelSize: 12 }
                Text { text: root.pageTitle; color: ThemeTokens.text; font.pixelSize: 12; font.weight: Font.DemiBold }
            }

            // Page Header with Copy Link
            Column {
                width: parent.width
                spacing: 8

                Row {
                    width: parent.width
                    Text {
                        text: root.pageTitle
                        color: ThemeTokens.text
                        font.pixelSize: 32
                        font.weight: Font.Bold
                        font.letterSpacing: -0.5
                    }

                    Item { width: Math.max(20, parent.width - 280); height: 1 }

                    Rectangle {
                        width: 96; height: 28; radius: 6
                        color: ThemeTokens.panel
                        border.color: ThemeTokens.border
                        border.width: 1

                        Row {
                            anchors.centerIn: parent
                            spacing: 5
                            Text {
                                text: root.copiedLink ? "✓" : "📋"
                                font.pixelSize: 11
                                color: root.copiedLink ? "#10b981" : ThemeTokens.subduedText
                            }
                            Text {
                                text: root.copiedLink ? "Copied" : "Copy Link"
                                color: root.copiedLink ? "#10b981" : ThemeTokens.text
                                font.pixelSize: 11
                                font.weight: Font.Medium
                            }
                        }

                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: {
                                root.copiedLink = true
                                copyTimer.restart()
                            }
                        }
                    }
                }

                Text {
                    text: root.description
                    color: ThemeTokens.subduedText
                    font.pixelSize: 14
                    lineHeight: 1.4
                    wrapMode: Text.WordWrap
                    width: parent.width
                }

                Rectangle {
                    width: parent.width
                    height: 1
                    color: ThemeTokens.border
                }
            }

            // Page Body Content
            Column {
                id: pageContentCol
                width: parent.width
                spacing: 28
            }
        }

        // Right Table of Contents (TOC, 160px width)
        Column {
            id: tocCol
            visible: root.tocItems && root.tocItems.length > 0
            width: 160
            spacing: 12

            Text {
                text: "ON THIS PAGE"
                color: ThemeTokens.text
                font.pixelSize: 11
                font.weight: Font.Bold
                font.letterSpacing: 0.5
            }

            Repeater {
                model: root.tocItems
                delegate: Text {
                    required property var modelData
                    text: modelData.title
                    color: ThemeTokens.subduedText
                    font.pixelSize: 12
                    wrapMode: Text.WordWrap
                    width: parent.width
                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                    }
                }
            }
        }
    }
}
`;

fs.writeFileSync(path.join(qtOutDir, 'DocLayout.qml'), docLayoutQml, 'utf8');

// Emit ComponentPreview.qml
const componentPreviewQml = `// ComponentPreview.qml — Visual Component Sandbox matching React ComponentPreview.tsx 1:1
import QtQuick 6.10
import QtQuick.Controls 6.10
import chaSet

Rectangle {
    id: root
    width: parent ? parent.width : 760
    implicitHeight: previewContainer.implicitHeight
    radius: 8
    color: ThemeTokens.panel
    border.color: ThemeTokens.border
    border.width: 1
    clip: true

    property string title: ""
    property string reactCode: ""
    property string qtCode: ""
    property string activeTab: "preview"

    default property alias stageData: stageContainer.data
    property alias controlsData: controlsContainer.data

    Column {
        id: previewContainer
        width: parent.width

        // Tab Navigation Header (36px height)
        Rectangle {
            width: parent.width
            height: 38
            color: ThemeTokens.hover
            border.color: ThemeTokens.border
            border.width: 0.5

            Row {
                anchors.left: parent.left
                anchors.leftMargin: 10
                anchors.verticalCenter: parent.verticalCenter
                spacing: 4

                Rectangle {
                    width: 64; height: 26; radius: 5
                    color: root.activeTab === "preview" ? ThemeTokens.panel : "transparent"
                    border.color: root.activeTab === "preview" ? ThemeTokens.border : "transparent"
                    Text { anchors.centerIn: parent; text: "Preview"; color: root.activeTab === "preview" ? ThemeTokens.text : ThemeTokens.subduedText; font.pixelSize: 11; font.weight: root.activeTab === "preview" ? Font.Bold : Font.Normal }
                    MouseArea { anchors.fill: parent; cursorShape: Qt.PointingHandCursor; onClicked: root.activeTab = "preview" }
                }

                Rectangle {
                    width: 80; height: 26; radius: 5
                    color: root.activeTab === "code" ? ThemeTokens.panel : "transparent"
                    border.color: root.activeTab === "code" ? ThemeTokens.border : "transparent"
                    Text { anchors.centerIn: parent; text: "React Code"; color: root.activeTab === "code" ? ThemeTokens.text : ThemeTokens.subduedText; font.pixelSize: 11; font.weight: root.activeTab === "code" ? Font.Bold : Font.Normal }
                    MouseArea { anchors.fill: parent; cursorShape: Qt.PointingHandCursor; onClicked: root.activeTab = "code" }
                }

                Rectangle {
                    width: 68; height: 26; radius: 5
                    color: root.activeTab === "qt" ? ThemeTokens.panel : "transparent"
                    border.color: root.activeTab === "qt" ? ThemeTokens.border : "transparent"
                    Text { anchors.centerIn: parent; text: "Qt QML"; color: root.activeTab === "qt" ? ThemeTokens.text : ThemeTokens.subduedText; font.pixelSize: 11; font.weight: root.activeTab === "qt" ? Font.Bold : Font.Normal }
                    MouseArea { anchors.fill: parent; cursorShape: Qt.PointingHandCursor; onClicked: root.activeTab = "qt" }
                }
            }

            Text {
                visible: root.title !== ""
                anchors.right: parent.right
                anchors.rightMargin: 14
                anchors.verticalCenter: parent.verticalCenter
                text: root.title
                color: ThemeTokens.subduedText
                font.pixelSize: 11
            }
        }

        // Preview Mode Content
        Column {
            visible: root.activeTab === "preview"
            width: parent.width

            // Center Stage
            Item {
                id: stageContainer
                width: parent.width
                height: 280
                clip: true
            }

            // Controls Bar
            Rectangle {
                width: parent.width
                height: controlsContainer.implicitHeight + 20
                color: ThemeTokens.hover
                border.color: ThemeTokens.border
                border.width: 0.5

                Row {
                    id: controlsContainer
                    anchors.centerIn: parent
                    spacing: 16
                }
            }
        }

        // Code Mode Content (React JSX / Qt QML)
        Rectangle {
            visible: root.activeTab !== "preview"
            width: parent.width
            height: 200
            color: ThemeTokens.background

            TextArea {
                anchors.fill: parent
                anchors.margins: 14
                readOnly: true
                text: root.activeTab === "code" ? root.reactCode : root.qtCode
                color: ThemeTokens.text
                font.family: "Consolas, monospace"
                font.pixelSize: 12
                background: null
            }
        }
    }
}
`;

fs.writeFileSync(path.join(qtOutDir, 'ComponentPreview.qml'), componentPreviewQml, 'utf8');

// Emit ScrollAreaDocPage.qml
const scrollAreaDocPageQml = `// ScrollAreaDocPage.qml — Comprehensive Scroll Area Documentation matching React 1:1
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
        reactCode: \`<ScrollArea
  className="h-72 w-full rounded-md border border-border"
  showVerticalScrollBar={\${root.heroMode !== "horizontal"}}
  showHorizontalScrollBar={\${root.heroMode !== "vertical"}}
  showButtons={\${root.showButtons}}
  smoothScroll={\${root.smoothScroll}}
>
  {/* Content */}
</ScrollArea>\`
        qtCode: \`ChaSetScrollView {
    width: parent.width
    height: 280
    showButtons: \${root.showButtons}
    showVerticalScrollBar: \${root.heroMode !== "horizontal"}
    showHorizontalScrollBar: \${root.heroMode !== "vertical"}
    smoothScroll: \${root.smoothScroll}

    // Viewport Content
}\`

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
`;

fs.writeFileSync(path.join(qtOutDir, 'ScrollAreaDocPage.qml'), scrollAreaDocPageQml, 'utf8');

// Emit ButtonDocPage.qml
const buttonDocPageQml = `// ButtonDocPage.qml — Comprehensive Button Documentation matching React 1:1
import QtQuick 6.10
import QtQuick.Controls 6.10
import chaSet

DocLayout {
    id: root
    category: "Components"
    pageTitle: "Button"
    description: "A versatile button component with multiple variants, sizes, and states. Neutral contract implemented via @base-ui/react on Web and pure QML on Desktop."
    tocItems: [
        { id: "preview", title: "Interactive Preview" },
        { id: "variants", title: "Variants & Hierarchy" },
        { id: "sizes", title: "Sizes" },
        { id: "states", title: "Interactive States" },
        { id: "props", title: "API Reference" }
    ]

    property string btnVariant: "primary"
    property string btnSize: "md"
    property string btnLabel: "Create Project"
    property bool btnLoading: false
    property bool btnDisabled: false
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
        title: "Button Sandbox"
        reactCode: \`<Button
  variant="\${root.btnVariant}"
  size="\${root.btnSize}"
  loading={\${root.btnLoading}}
  disabled={\${root.btnDisabled}}
>
  \${root.btnLabel}
</Button>\`
        qtCode: \`ChaSetButton {
    variant: "\${root.btnVariant}"
    size: "\${root.btnSize}"
    text: "\${root.btnLabel}"
    loading: \${root.btnLoading}
    disabled: \${root.btnDisabled}
}\`

        // Center Stage Container
        Rectangle {
            anchors.fill: parent
            color: "transparent"

            ChaSetButton {
                anchors.centerIn: parent
                variant: root.btnVariant
                size: root.btnSize
                text: root.btnLabel
                loading: root.btnLoading
                disabled: root.btnDisabled
            }
        }

        // Bottom Controls Bar
        controlsData: [
            Row {
                spacing: 6
                Text { text: "Variant:"; color: ThemeTokens.subduedText; font.pixelSize: 11; anchors.verticalCenter: parent.verticalCenter }
                Repeater {
                    model: ["primary", "secondary", "destructive", "ghost"]
                    delegate: Rectangle {
                        required property var modelData
                        width: 68; height: 26; radius: 5
                        color: root.btnVariant === modelData ? ThemeTokens.accent : ThemeTokens.panel
                        border.color: ThemeTokens.border
                        Text { anchors.centerIn: parent; text: modelData; color: root.btnVariant === modelData ? "#ffffff" : ThemeTokens.text; font.pixelSize: 11; font.weight: Font.Medium }
                        MouseArea { anchors.fill: parent; cursorShape: Qt.PointingHandCursor; onClicked: root.btnVariant = modelData }
                    }
                }
            },
            Row {
                spacing: 6
                Text { text: "Size:"; color: ThemeTokens.subduedText; font.pixelSize: 11; anchors.verticalCenter: parent.verticalCenter }
                Repeater {
                    model: ["sm", "md", "lg"]
                    delegate: Rectangle {
                        required property var modelData
                        width: 36; height: 26; radius: 5
                        color: root.btnSize === modelData ? ThemeTokens.accent : ThemeTokens.panel
                        border.color: ThemeTokens.border
                        Text { anchors.centerIn: parent; text: modelData; color: root.btnSize === modelData ? "#ffffff" : ThemeTokens.text; font.pixelSize: 11; font.weight: Font.Medium }
                        MouseArea { anchors.fill: parent; cursorShape: Qt.PointingHandCursor; onClicked: root.btnSize = modelData }
                    }
                }
            },
            Row {
                spacing: 12
                CheckBox {
                    text: "Loading"
                    checked: root.btnLoading
                    onToggled: root.btnLoading = checked
                }
                CheckBox {
                    text: "Disabled"
                    checked: root.btnDisabled
                    onToggled: root.btnDisabled = checked
                }
            }
        ]
    }
}
`;

fs.writeFileSync(path.join(qtOutDir, 'ButtonDocPage.qml'), buttonDocPageQml, 'utf8');

// Emit native ChaSetScrollBar.qml
const scrollBarQml = `// ChaSet ScrollBar for Qt (QML)
// Native Qt Quick Controls ScrollBar implementation with ChaSet design token styling.
import QtQuick 6.10
import QtQuick.Templates 6.10 as T
import chaSet

T.ScrollBar {
    id: control

    implicitWidth: Math.max(implicitBackgroundWidth + leftInset + rightInset,
                            implicitContentWidth + leftPadding + rightPadding)
    implicitHeight: Math.max(implicitBackgroundHeight + topInset + bottomInset,
                             implicitContentHeight + topPadding + bottomPadding)

    padding: 0
    hoverEnabled: true

    property int collapsedSize: 4
    property int expandedSize: 8
    property real customRadius: ThemeTokens.rowRadius

    // Visual Thumb Capsule (Native C++ QQuickScrollBar handles position & drag seamlessly)
    contentItem: Rectangle {
        implicitWidth: control.orientation === Qt.Vertical ? (control.hovered || control.pressed ? control.expandedSize : control.collapsedSize) : 0
        implicitHeight: control.orientation === Qt.Horizontal ? (control.hovered || control.pressed ? control.expandedSize : control.collapsedSize) : 0
        radius: Math.min(width, height) / 2

        color: control.pressed ? Qt.rgba(ThemeTokens.text.r, ThemeTokens.text.g, ThemeTokens.text.b, 0.6) :
               (control.hovered ? Qt.rgba(ThemeTokens.text.r, ThemeTokens.text.g, ThemeTokens.text.b, 0.4) :
               Qt.rgba(ThemeTokens.border.r, ThemeTokens.border.g, ThemeTokens.border.b, 0.8))

        Behavior on implicitWidth { NumberAnimation { duration: 150; easing.type: Easing.OutCubic } }
        Behavior on implicitHeight { NumberAnimation { duration: 150; easing.type: Easing.OutCubic } }
        Behavior on color { ColorAnimation { duration: 150 } }
    }

    // Transparent Runway
    background: Rectangle {
        implicitWidth: control.expandedSize
        implicitHeight: control.expandedSize
        color: "transparent"
    }
}
`;
fs.writeFileSync(path.join(qtOutDir, 'ChaSetScrollBar.qml'), scrollBarQml, 'utf8');

// Emit native ChaSetScrollView.qml
const scrollViewQml = `// ChaSet ScrollView for Qt (QML)
// High-level scrollable viewport container with integrated ChaSetScrollBar and desktop mouse wheel support.
import QtQuick 6.10
import QtQuick.Controls 6.10
import chaSet

Item {
    id: root

    default property alias contentData: flickable.data
    property alias contentWidth: flickable.contentWidth
    property alias contentHeight: flickable.contentHeight
    property alias contentX: flickable.contentX
    property alias contentY: flickable.contentY
    property alias flickableItem: flickable

    property alias verticalScrollBar: vScrollBar
    property alias horizontalScrollBar: hScrollBar

    property bool showVerticalScrollBar: true
    property bool showHorizontalScrollBar: false
    property bool showButtons: false
    property int hitSize: 8
    property int collapsedSize: 4
    property int expandedSize: 8
    property real pageStepRatio: 0.85
    property bool smoothScroll: true

    function scrollToTop() { flickable.contentY = 0 }
    function scrollToBottom() { flickable.contentY = Math.max(0, flickable.contentHeight - flickable.height) }
    function scrollToLeft() { flickable.contentX = 0 }
    function scrollToRight() { flickable.contentX = Math.max(0, flickable.contentWidth - flickable.width) }
    function pageUp() { flickable.contentY = Math.max(0, flickable.contentY - flickable.height * root.pageStepRatio) }
    function pageDown() { flickable.contentY = Math.min(Math.max(0, flickable.contentHeight - flickable.height), flickable.contentY + flickable.height * root.pageStepRatio) }
    function pageLeft() { flickable.contentX = Math.max(0, flickable.contentX - flickable.width * root.pageStepRatio) }
    function pageRight() { flickable.contentX = Math.min(Math.max(0, flickable.contentWidth - flickable.width), flickable.contentX + flickable.width * root.pageStepRatio) }
    function simulateThumbDrag(deltaPixels) { flickable.contentY = Math.max(0, Math.min(flickable.contentHeight - flickable.height, flickable.contentY + deltaPixels)) }

    clip: true

    Flickable {
        id: flickable
        anchors.fill: parent
        boundsBehavior: Flickable.StopAtBounds
        clip: true

        WheelHandler {
            target: flickable
            orientation: Qt.Vertical
            acceptedDevices: PointerDevice.Mouse | PointerDevice.TouchPad
            onWheel: function(event) {
                var delta = event.angleDelta.y !== 0 ? event.angleDelta.y : event.angleDelta.x
                var maxScrollY = Math.max(0, flickable.contentHeight - flickable.height)
                if (maxScrollY > 0 && delta !== 0) {
                    var step = 100
                    flickable.contentY = Math.max(0, Math.min(maxScrollY, flickable.contentY - (delta > 0 ? step : -step)))
                }
            }
        }

        WheelHandler {
            target: flickable
            orientation: Qt.Horizontal
            acceptedDevices: PointerDevice.Mouse | PointerDevice.TouchPad
            onWheel: function(event) {
                var delta = event.angleDelta.x
                var maxScrollX = Math.max(0, flickable.contentWidth - flickable.width)
                if (maxScrollX > 0 && delta !== 0) {
                    var step = 100
                    flickable.contentX = Math.max(0, Math.min(maxScrollX, flickable.contentX - (delta > 0 ? step : -step)))
                }
            }
        }

        ScrollBar.vertical: ChaSetScrollBar {
            id: vScrollBar
            visible: root.showVerticalScrollBar && flickable.contentHeight > flickable.height
            collapsedSize: root.collapsedSize
            expandedSize: root.expandedSize
        }

        ScrollBar.horizontal: ChaSetScrollBar {
            id: hScrollBar
            visible: root.showHorizontalScrollBar && flickable.contentWidth > flickable.width
            collapsedSize: root.collapsedSize
            expandedSize: root.expandedSize
        }
    }
}
`;
fs.writeFileSync(path.join(qtOutDir, 'ChaSetScrollView.qml'), scrollViewQml, 'utf8');

console.log('[gen:showcase] Emitted showcaseData.generated.ts, ShowcaseData.generated.qml, DocLayout.qml, ComponentPreview.qml, ScrollAreaDocPage.qml, ButtonDocPage.qml, ChaSetScrollBar.qml, and ChaSetScrollView.qml');
