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
    property int fontSize: 12
    property real lineHeight: 1.5
    property color textColor: ThemeTokens.text
    property color gutterColor: ThemeTokens.subduedText

    readonly property string fontFamily: "Consolas, monospace"
    readonly property real gutterGap: root.showLineNumbers ? 12 : 0
    readonly property real codeWidth: Math.max(0, root.width - (root.showLineNumbers ? gutterWidth + gutterGap : 0))

    // One token array per source line — the same stream React's HighlightedCode consumes.
    readonly property var tokenLines: {
        if (highlight && Highlighter.isHighlightable(language)) {
            return Highlighter.toLines(Highlighter.tokenize(code, language))
        }
        return Highlighter.toLines([{ t: "plain", v: code }])
    }

    readonly property int lineCount: tokenLines.length
    readonly property real gutterWidth: root.showLineNumbers ? gutterMetrics.implicitWidth : 0

    // Bridges the generated palette (QColor) to the CSS color string the shared
    // engine's buildRichText() expects, so both stacks emit the same markup shape.
    function colorForToken(type) {
        return CodeTokens.colorFor(type).toString()
    }

    implicitWidth: linesColumn.implicitWidth
    implicitHeight: linesColumn.implicitHeight

    // Hidden reference text reserving a stable gutter width for the widest line number.
    Text {
        id: gutterMetrics
        visible: false
        text: String(Math.max(1, root.lineCount))
        font.family: root.fontFamily
        font.pixelSize: root.fontSize
    }

    Column {
        id: linesColumn
        width: root.wrap ? root.width : implicitWidth
        spacing: 0

        Repeater {
            model: root.tokenLines

            delegate: Row {
                id: lineRow
                required property var modelData
                required property int index
                spacing: 0

                Text {
                    id: lineGutter
                    visible: root.showLineNumbers
                    width: visible ? root.gutterWidth : 0
                    text: String(lineRow.index + 1)
                    color: root.gutterColor
                    opacity: 0.65
                    horizontalAlignment: Text.AlignRight
                    font.family: root.fontFamily
                    font.pixelSize: root.fontSize
                }

                Item {
                    width: root.gutterGap
                    height: 1
                }

                Text {
                    textFormat: Text.RichText
                    text: Highlighter.buildRichText(lineRow.modelData, root.colorForToken)
                    color: root.textColor
                    wrapMode: root.wrap ? Text.WrapAnywhere : Text.NoWrap
                    width: root.wrap ? root.codeWidth : implicitWidth
                    lineHeight: root.lineHeight
                    font.family: root.fontFamily
                    font.pixelSize: root.fontSize
                }
            }
        }
    }
}
