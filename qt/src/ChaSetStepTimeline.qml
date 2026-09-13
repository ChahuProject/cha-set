// ChaSetStepTimeline.qml — Standalone vertical execution step timeline
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
  id: root

  property var steps: []
  property string emptyText: "No steps"

  implicitWidth: 320
  implicitHeight: stepsColumn.implicitHeight
  width: implicitWidth
  height: implicitHeight

  function formatDuration(ms) {
    if (ms === null || ms === undefined || ms < 0) return ""
    var totalSeconds = Math.floor(ms / 1000)
    var minutes = Math.floor(totalSeconds / 60)
    var seconds = totalSeconds % 60
    var mStr = minutes < 10 ? "0" + minutes : "" + minutes
    var sStr = seconds < 10 ? "0" + seconds : "" + seconds
    return mStr + ":" + sStr
  }

  function getStatusColor(status) {
    var s = (status || "").toLowerCase()
    if (s === "success" || s === "成功") return "#10b981"
    if (s === "failure" || s === "failed" || s === "失败") return ThemeTokens.destructive
    if (s === "running" || s === "compiling" || s === "运行中" || s === "编译中") return ThemeTokens.accent
    if (s === "retrying" || s === "重试中") return "#f59e0b"
    return ThemeTokens.textMuted
  }

  function isSpinning(status) {
    var s = (status || "").toLowerCase()
    return s === "running" || s === "compiling" || s === "retrying" ||
           s === "运行中" || s === "编译中" || s === "重试中"
  }

  Text {
    id: emptyLabel
    visible: !root.steps || root.steps.length === 0
    text: root.emptyText
    font.pixelSize: 12
    color: ThemeTokens.textMuted
    anchors.centerIn: parent
  }

  Column {
    id: stepsColumn
    visible: root.steps && root.steps.length > 0
    anchors.left: parent.left
    anchors.right: parent.right
    spacing: 0

    Repeater {
      model: root.steps

      delegate: Item {
        id: stepDelegate
        required property int index
        required property var modelData

        readonly property var stepItem: modelData
        readonly property bool isLast: index === (root.steps.length - 1)
        readonly property color statusColor: root.getStatusColor(stepItem ? stepItem.status : "")
        readonly property bool spinning: root.isSpinning(stepItem ? stepItem.status : "")
        readonly property string durationText: root.formatDuration(stepItem ? stepItem.durationMs : null)

        width: stepsColumn.width
        implicitHeight: contentRow.implicitHeight + (isLast ? 0 : 12)
        height: implicitHeight

        Row {
          id: contentRow
          anchors.left: parent.left
          anchors.right: parent.right
          spacing: 8

          // Left icon and connector column
          Item {
            width: 14
            height: 14
            anchors.top: parent.top
            anchors.topMargin: 2

            // Status Node Circle / Spinner
            Rectangle {
              id: nodeCircle
              width: 12
              height: 12
              radius: 6
              anchors.centerIn: parent
              color: "transparent"
              border.width: 2
              border.color: stepDelegate.statusColor

              // Inner dot or spinner segment
              Rectangle {
                width: 4
                height: 4
                radius: 2
                anchors.centerIn: parent
                color: stepDelegate.statusColor
                visible: !stepDelegate.spinning
              }

              RotationAnimation on rotation {
                loops: Animation.Infinite
                from: 0
                to: 360
                duration: 1000
                running: stepDelegate.spinning && ThemeTokens.animationsEnabled
              }
            }

            // Connecting vertical line to next node
            Rectangle {
              visible: !stepDelegate.isLast
              width: 1
              anchors.top: nodeCircle.bottom
              anchors.topMargin: 2
              anchors.bottom: parent.bottom
              anchors.bottomMargin: -12
              anchors.horizontalCenter: parent.horizontalCenter
              color: ThemeTokens.border
            }
          }

          // Right step title and duration column
          Column {
            width: parent.width - 22
            spacing: 2

            Text {
              width: parent.width
              text: stepDelegate.stepItem ? (stepDelegate.stepItem.name || "") : ""
              font.pixelSize: 12
              font.weight: Font.Medium
              color: ThemeTokens.text
              elide: Text.ElideRight
            }

            Text {
              visible: stepDelegate.durationText !== ""
              text: stepDelegate.durationText
              font.pixelSize: 11
              font.family: "monospace"
              color: ThemeTokens.textMuted
            }
          }
        }
      }
    }
  }
}
