// ChaSetCodeBlock.qml — L4 composite code viewer.
//
// Assembled from ChaSet primitives (ChaSetScrollArea, ChaSetCopyButton,
// ChaSetButton) over the shared spec lexer (Highlighter + CodeTokens), mirroring
// React's CodeBlock.tsx 1:1. Supports: syntax highlighting, copy, language/file
// label, line numbers, wrapping, bounded height, embedded (chrome-less) mode and
// multi-file tabs.
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Rectangle {
    id: root

    property string code: ""
    property string language: "tsx"
    property string filename: ""
    // Back-compat alias: existing showcase pages label the header via `title`.
    property alias title: root.filename
    property var files: []
    property bool highlight: true
    property bool showLineNumbers: false
    property bool showLanguage: true
    property bool showCopy: true
    property bool wrap: false
    property real maxHeight: 0
    property bool embedded: false
    property string copyLabel: ""

    property int currentIndex: 0

    readonly property bool multiFile: root.files !== undefined && root.files !== null && root.files.length > 0
    readonly property var activeFile: root.multiFile
        ? root.files[Math.max(0, Math.min(root.currentIndex, root.files.length - 1))]
        : null
    readonly property string activeCode: {
        var raw = (root.multiFile && root.activeFile) ? String(root.activeFile.code) : root.code
        return raw.trim()
    }
    readonly property string activeLanguage: (root.multiFile && root.activeFile && root.activeFile.language)
        ? String(root.activeFile.language)
        : root.language
    readonly property string label: {
        if (!root.showLanguage) return ""
        if (root.filename !== "") return root.filename
        if (root.multiFile && root.activeFile) return String(root.activeFile.name)
        return Highlighter.languageLabel(root.language)
    }

    readonly property int headerHeight: root.embedded ? 0 : 32
    readonly property int bodyPadding: root.embedded ? 0 : 12
    readonly property real naturalBodyHeight: highlighter.implicitHeight + root.bodyPadding * 2

    color: root.embedded ? "transparent" : ThemeTokens.hover
    border.color: root.embedded ? "transparent" : ThemeTokens.border
    border.width: root.embedded ? 0 : 1
    radius: root.embedded ? 0 : 8
    clip: true

    implicitWidth: 640
    implicitHeight: root.headerHeight + (root.maxHeight > 0 ? root.maxHeight : root.naturalBodyHeight)

    // Motion (Golden Rule 11): selecting another file cross-fades the body so the
    // swap reads as a transition instead of a hard cut. Duration/easing come from
    // the shared motion tokens — ThemeTokens.motionShort resolves to 0 when
    // animations are disabled, which is the reduced-motion kill switch. The
    // harness guard keeps headless scenario/pixel runs deterministic.
    NumberAnimation {
        id: fileSwapFade
        target: body
        property: "opacity"
        from: 0
        to: 1
        duration: ThemeTokens.motionShort
        easing.type: ThemeTokens.easeEntrance
    }

    onCurrentIndexChanged: {
        if (root.multiFile && ThemeTokens.animationsEnabled
                && (typeof harnessMode === "undefined" || harnessMode === "")) {
            fileSwapFade.restart()
        }
    }

    Column {
        id: layout
        width: parent.width
        spacing: 0

        // ---- Header: file tabs / label / copy ----
        Rectangle {
            id: header
            width: parent.width
            height: root.headerHeight
            visible: !root.embedded
            color: Qt.rgba(ThemeTokens.hover.r, ThemeTokens.hover.g, ThemeTokens.hover.b, 0.8)
            border.color: ThemeTokens.border
            border.width: 0.5

            Row {
                id: tabStrip
                visible: root.multiFile
                anchors.left: parent.left
                anchors.leftMargin: 8
                anchors.verticalCenter: parent.verticalCenter
                spacing: 2

                Repeater {
                    model: root.multiFile ? root.files : []

                    delegate: ChaSetButton {
                        required property var modelData
                        required property int index
                        text: String(modelData.name)
                        size: "sm"
                        variant: index === root.currentIndex ? "secondary" : "ghost"
                        onClicked: root.currentIndex = index

                        // Keyboard parity with React's Tabs primitive: ←/→ move the
                        // active file while a tab holds focus.
                        Keys.onLeftPressed: root.currentIndex = (index - 1 + root.files.length) % root.files.length
                        Keys.onRightPressed: root.currentIndex = (index + 1) % root.files.length
                    }
                }
            }

            Text {
                id: headerLabel
                visible: !root.multiFile && root.label !== ""
                anchors.left: parent.left
                anchors.leftMargin: 12
                anchors.verticalCenter: parent.verticalCenter
                text: root.label
                color: ThemeTokens.subduedText
                font.pixelSize: 11
                font.bold: true
                font.letterSpacing: 0.5
            }

            ChaSetCopyButton {
                visible: root.showCopy
                anchors.right: parent.right
                anchors.rightMargin: 8
                anchors.verticalCenter: parent.verticalCenter
                text: root.activeCode
                label: root.copyLabel
                variant: "ghost"
                size: "sm"
            }
        }

        // ---- Body: scrollable, syntax-highlighted source ----
        Rectangle {
            id: body
            width: parent.width
            height: root.maxHeight > 0 ? root.maxHeight : root.naturalBodyHeight
            color: ThemeTokens.background

            ChaSetScrollArea {
                id: scroll
                anchors.fill: parent
                anchors.margins: root.bodyPadding
                showVerticalScrollBar: root.maxHeight > 0
                showHorizontalScrollBar: !root.wrap
                showButtons: false
                contentWidth: root.wrap ? width : Math.max(width, highlighter.implicitWidth)
                contentHeight: highlighter.implicitHeight

                ChaSetHighlightedCode {
                    id: highlighter
                    width: root.wrap ? scroll.width : implicitWidth
                    code: root.activeCode
                    language: root.activeLanguage
                    highlight: root.highlight
                    showLineNumbers: root.showLineNumbers
                    wrap: root.wrap
                }
            }
        }
    }
}
