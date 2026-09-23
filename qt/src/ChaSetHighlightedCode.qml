// ChaSetHighlightedCode.qml — L2 syntax-highlight primitive.
//
// Renders the shared spec lexer's token stream as Qt RichText, so React and Qt
// tokenize and color identically with no third-party highlighter on either stack.
// The lexer itself lives in Highlighter.generated.qml (emitted from
// spec/highlight/*), and the palette in CodeTokens.generated.qml; this file only
// owns layout (line gutter, wrapping) and the token -> color bridge.
import QtQuick 6.10
import ChaSet

Item {
    id: root

    property string code: ""
    property string language: "tsx"
    property bool highlight: true
    property bool showLineNumbers: false
    property bool wrap: false
    property int fontSize: Typography.sizeSmall
    // Line-height ROLE, not a raw number: the ratio lives in the shared
    // typography tokens (spec/tokens/primitives.json -> primitives.typography),
    // so React's `leading-code` and this item resolve the same 1.4.
    // See docs/architecture/typography-system.md.
    property string lineHeight: "code"
    property color textColor: ThemeTokens.text
    property color gutterColor: ThemeTokens.subduedText

    readonly property string fontFamily: Typography.familyMono

    // Absolute px line height. Qt text items take px, while CSS `line-height`
    // is a ratio multiplied by the font size — `Typography.lineHeightPx()` is
    // the single bridge so both engines land on the same number (12 × 1.4 = 16.8).
    readonly property real lineHeightPx: Typography.lineHeightPx(root.fontSize, root.lineHeight)
    readonly property real gutterGap: root.showLineNumbers ? ThemeTokens.dp(12) : 0
    readonly property real codeWidth: Math.max(0, root.width - (root.showLineNumbers ? gutterWidth + gutterGap : 0))

    // Tokenized data structures
    readonly property var allTokens: {
        if (highlight && Highlighter.isHighlightable(language)) {
            return Highlighter.tokenize(code, language)
        }
        return [{ t: "plain", v: code }]
    }

    readonly property var tokenLines: {
        return Highlighter.toLines(allTokens)
    }

    readonly property int lineCount: Math.max(1, tokenLines.length)
    readonly property real gutterWidth: root.showLineNumbers ? gutterMetrics.implicitWidth : 0
    readonly property string richText: Highlighter.buildRichText(allTokens, root.colorForToken)

    // Qt rich text resolves `line-height:<percentage>` against the FONT'S
    // DEFAULT line spacing, not the font size (CSS resolves percentages against
    // the font size), so a percentage would silently disagree with React. The
    // absolute px form is unambiguous; the <p> wrapper is what carries it — a
    // bare run of <span>/<br/> inherits the font's default line spacing, which
    // is exactly the 14px-vs-16.8px bug this replaces. `<p>` defaults to
    // margin 0 in Qt, but it is spelled out so the parity contract is explicit.
    readonly property string styledRichText:
        "<p style=\"margin:0;line-height:" + root.lineHeightPx + "px\">" + root.richText + "</p>"

    FontMetrics {
        id: codeFontMetrics
        font.family: root.fontFamily
        font.pixelSize: root.fontSize
    }

    readonly property real lineSpacing: codeEdit.lineCount > 0 ? (codeEdit.contentHeight / codeEdit.lineCount) : codeFontMetrics.lineSpacing

    // Bridges the generated palette (QColor) to the CSS color string the shared
    // engine's buildRichText() expects, so both stacks emit the same markup shape.
    function colorForToken(type) {
        return CodeTokens.colorFor(type).toString()
    }

    implicitWidth: root.showLineNumbers ? (root.gutterWidth + root.gutterGap + codeEdit.contentWidth) : codeEdit.contentWidth
    implicitHeight: Math.max(root.showLineNumbers ? gutterCol.implicitHeight : 0, codeEdit.contentHeight)

    // Hidden reference text reserving a stable gutter width for the widest line number.
    Text {
        id: gutterMetrics
        visible: false
        text: String(Math.max(1, root.lineCount))
        font.family: root.fontFamily
        font.pixelSize: root.fontSize
    }

    Row {
        id: mainRow
        spacing: 0
        width: root.wrap ? root.width : implicitWidth

        // Non-selectable Line Numbers Gutter
        Column {
            id: gutterCol
            visible: root.showLineNumbers
            width: root.showLineNumbers ? (root.gutterWidth + root.gutterGap) : 0
            spacing: 0

            Repeater {
                model: root.lineCount
                delegate: Item {
                    required property int index
                    width: root.gutterWidth + root.gutterGap
                    height: root.lineSpacing

                    Text {
                        anchors.left: parent.left
                        anchors.right: parent.right
                        anchors.rightMargin: root.gutterGap
                        anchors.verticalCenter: parent.verticalCenter
                        text: String(index + 1)
                        color: root.gutterColor
                        opacity: 0.65
                        horizontalAlignment: Text.AlignRight
                        font.family: root.fontFamily
                        font.pixelSize: root.fontSize
                    }
                }
            }
        }

        // Selectable Multi-line RichText Code Editor
        TextEdit {
            id: codeEdit
            readOnly: true
            selectByMouse: true
            selectByKeyboard: true
            cursorVisible: false
            activeFocusOnPress: true
            textFormat: TextEdit.RichText
            textMargin: 0
            padding: 0
            topPadding: 0
            bottomPadding: 0
            leftPadding: 0
            rightPadding: 0
            font.family: root.fontFamily
            font.pixelSize: root.fontSize
            color: root.textColor
            selectionColor: ThemeTokens.dark ? Qt.rgba(48.0 / 255.0, 160.0 / 255.0, 255.0 / 255.0, 0.4) : Qt.rgba(29.0 / 255.0, 122.0 / 255.0, 224.0 / 255.0, 0.3)
            selectedTextColor: root.textColor
            wrapMode: root.wrap ? TextEdit.WrapAnywhere : TextEdit.NoWrap
            width: root.wrap ? Math.max(0, root.width - (root.showLineNumbers ? (root.gutterWidth + root.gutterGap) : 0)) : implicitWidth
            text: root.styledRichText

            HoverHandler {
                cursorShape: Qt.IBeamCursor
            }
        }
    }
}
