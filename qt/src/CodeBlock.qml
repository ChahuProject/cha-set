// CodeBlock.qml — Standard Syntax Code Block matching React CodeBlock.tsx 1:1
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Rectangle {
    id: root
    width: parent ? parent.width : 760
    implicitHeight: codeCol.implicitHeight
    radius: 8
    color: ThemeTokens.hover
    border.color: ThemeTokens.border
    border.width: 1
    clip: true

    property string code: ""
    property string language: "tsx"
    property bool copied: false

    TextEdit {
        id: clipHelper
        visible: false
    }

    Timer {
        id: copyTimer
        interval: 2000
        onTriggered: root.copied = false
    }

    function copyToClipboard() {
        clipHelper.text = root.code.trim()
        clipHelper.selectAll()
        clipHelper.copy()
        root.copied = true
        copyTimer.restart()
    }

    Column {
        id: codeCol
        width: parent.width

        // Code Header Bar
        Rectangle {
            width: parent.width
            height: 32
            color: Qt.rgba(ThemeTokens.hover.r, ThemeTokens.hover.g, ThemeTokens.hover.b, 0.8)
            border.color: ThemeTokens.border
            border.width: 0.5

            Row {
                anchors.left: parent.left
                anchors.leftMargin: 12
                anchors.verticalCenter: parent.verticalCenter
                Text {
                    text: root.language.toUpperCase()
                    color: ThemeTokens.subduedText
                    font.pixelSize: 11
                    font.weight: Font.Bold
                    font.letterSpacing: 0.5
                }
            }

            Rectangle {
                anchors.right: parent.right
                anchors.rightMargin: 10
                anchors.verticalCenter: parent.verticalCenter
                width: copyRow.implicitWidth + 14
                height: 22
                radius: 4
                color: root.copied ? Qt.rgba(0.06, 0.72, 0.5, 0.15) : "transparent"
                border.color: root.copied ? "#10b981" : "transparent"

                Row {
                    id: copyRow
                    anchors.centerIn: parent
                    spacing: 4
                    Text {
                        text: root.copied ? "✓" : "📋"
                        font.pixelSize: 10
                        color: root.copied ? "#10b981" : ThemeTokens.subduedText
                    }
                    Text {
                        text: root.copied ? "Copied!" : "Copy"
                        font.pixelSize: 10
                        font.weight: Font.Medium
                        color: root.copied ? "#10b981" : ThemeTokens.subduedText
                    }
                }

                MouseArea {
                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    hoverEnabled: true
                    onClicked: root.copyToClipboard()
                }
            }
        }

        // Code Body Pane
        Rectangle {
            width: parent.width
            implicitHeight: Math.max(48, codeText.implicitHeight + 24)
            color: ThemeTokens.background

            ChaSetScrollArea {
                anchors.fill: parent
                anchors.margins: 12
                showVerticalScrollBar: false
                showHorizontalScrollBar: true
                showButtons: false
                contentWidth: Math.max(width, codeText.implicitWidth)
                contentHeight: codeText.implicitHeight

                Text {
                    id: codeText
                    text: root.code.trim()
                    color: ThemeTokens.text
                    font.family: "Consolas, monospace"
                    font.pixelSize: 12
                    lineHeight: 1.4
                    textFormat: Text.PlainText
                }
            }
        }
    }
}
