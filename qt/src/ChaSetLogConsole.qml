// ChaSetLogConsole.qml — Standalone virtualized terminal log viewer
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Rectangle {
  id: root

  property var lines: []
  property string emptyText: "No logs"
  property bool showCopy: true
  property bool showLineCount: true
  property bool autoScroll: true
  property string copyTitle: "Copy all logs"

  implicitWidth: ThemeTokens.dp(480)
  implicitHeight: ThemeTokens.dp(260)
  width: implicitWidth
  height: implicitHeight

  color: ThemeTokens.dark ? Qt.rgba(0.08, 0.12, 0.18, 0.4) : Qt.rgba(0.96, 0.97, 0.98, 0.8)
  border.color: ThemeTokens.border
  border.width: 1
  radius: ThemeTokens.dp(8)
  clip: true

  function stripAnsi(str) {
    return (str || "").replace(/\u001B\[[0-9;]*[a-zA-Z]/g, "")
  }

  function allLogsAsPlainText() {
    if (!root.lines || root.lines.length === 0) return ""
    var out = []
    for (var i = 0; i < root.lines.length; i++) {
      out.push(stripAnsi(root.lines[i]))
    }
    return out.join("\n")
  }

  function ansiToStyledText(str) {
    if (!str) return ""
    var raw = str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    raw = raw.replace(/\u001B\[31m/g, '<font color="#ef4444">')
             .replace(/\u001B\[32m/g, '<font color="#10b981">')
             .replace(/\u001B\[33m/g, '<font color="#f59e0b">')
             .replace(/\u001B\[34m/g, '<font color="#3b82f6">')
             .replace(/\u001B\[35m/g, '<font color="#d946ef">')
             .replace(/\u001B\[36m/g, '<font color="#06b6d4">')
             .replace(/\u001B\[0m/g, '</font>')
             .replace(/\u001B\[[0-9;]*m/g, '')
    return raw
  }

  // Empty state
  Text {
    id: emptyLabel
    visible: !root.lines || root.lines.length === 0
    text: root.emptyText
    font.pixelSize: Typography.sizeSmall
    color: ThemeTokens.subduedText
    anchors.centerIn: parent
  }

  // Logs list
  ListView {
    id: listView
    visible: root.lines && root.lines.length > 0
    anchors.fill: parent
    anchors.margins: ThemeTokens.dp(8)
    clip: true
    model: root.lines
    boundsBehavior: Flickable.StopAtBounds

    delegate: TextEdit {
      id: lineEdit
      required property int index
      required property var modelData

      width: listView.width
      readOnly: true
      selectByMouse: true
      font.family: Typography.familyMono
      font.pixelSize: Typography.sizeSmall
      color: ThemeTokens.text
      textFormat: TextEdit.RichText
      text: root.ansiToStyledText(modelData)

      HoverHandler {
        cursorShape: Qt.IBeamCursor
      }
    }

    ScrollBar.vertical: ChaSetScrollBar {}

    onCountChanged: {
      if (root.autoScroll && count > 0) {
        listView.positionViewAtEnd()
      }
    }
  }

  // Top-right floating controls
  Rectangle {
    visible: root.lines && root.lines.length > 0 && (root.showCopy || root.showLineCount)
    anchors.top: parent.top
    anchors.topMargin: ThemeTokens.dp(8)
    anchors.right: parent.right
    anchors.rightMargin: ThemeTokens.dp(12)
    height: ThemeTokens.dp(22)
    width: controlsRow.implicitWidth + ThemeTokens.dp(8)
    radius: ThemeTokens.dp(4)
    color: ThemeTokens.dark ? Qt.rgba(0.08, 0.12, 0.18, 0.85) : Qt.rgba(1, 1, 1, 0.85)
    border.color: ThemeTokens.border
    border.width: 1
    z: 10

    Row {
      id: controlsRow
      anchors.centerIn: parent
      spacing: ThemeTokens.dp(6)

      Text {
        visible: root.showLineCount
        text: (root.lines ? root.lines.length : 0) + " lines"
        font.pixelSize: Typography.sizeMicro
        color: ThemeTokens.subduedText
        anchors.verticalCenter: parent.verticalCenter
      }

      ChaSetCopyButton {
        visible: root.showCopy
        anchors.verticalCenter: parent.verticalCenter
        size: "icon-xs"
        text: root.allLogsAsPlainText()
      }
    }
  }
}
