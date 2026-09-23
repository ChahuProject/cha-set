// ChaSetStepTimeline.qml — Standalone vertical execution step timeline
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
  id: root

  property var steps: []
  property string emptyText: "No steps"

  implicitWidth: ThemeTokens.dp(320)
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

  Text {
    id: emptyLabel
    visible: !root.steps || root.steps.length === 0
    text: root.emptyText
    font.pixelSize: Typography.sizeSmall
    color: ThemeTokens.subduedText
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
        readonly property string durationText: root.formatDuration(stepItem ? stepItem.durationMs : null)

        width: stepsColumn.width
        implicitHeight: contentRow.implicitHeight + (isLast ? 0 : ThemeTokens.dp(12))
        height: implicitHeight

        Row {
          id: contentRow
          anchors.left: parent.left
          anchors.right: parent.right
          spacing: ThemeTokens.dp(8)

          // Left icon and connector column
          Item {
            width: ThemeTokens.dp(14)
            height: ThemeTokens.dp(14)
            anchors.top: parent.top
            anchors.topMargin: ThemeTokens.dp(2)

            ChaSetStatusIcon {
              id: statusIcon
              anchors.centerIn: parent
              size: 14
              status: stepDelegate.stepItem ? stepDelegate.stepItem.status : "queued"
            }

            // Connecting vertical line to next node
            Rectangle {
              visible: !stepDelegate.isLast
              width: 1
              anchors.top: statusIcon.bottom
              anchors.topMargin: ThemeTokens.dp(2)
              anchors.bottom: parent.bottom
              anchors.bottomMargin: -ThemeTokens.dp(12)
              anchors.horizontalCenter: parent.horizontalCenter
              color: ThemeTokens.border
            }
          }

          // Right step title and duration column
          Column {
            width: parent.width - ThemeTokens.dp(22)
            spacing: ThemeTokens.dp(2)

            Text {
              width: parent.width
              text: stepDelegate.stepItem ? (stepDelegate.stepItem.name || "") : ""
              font.pixelSize: Typography.sizeSmall
              font.weight: Font.Medium
              color: ThemeTokens.text
              elide: Text.ElideRight
            }

            Text {
              visible: stepDelegate.durationText !== ""
              text: stepDelegate.durationText
              font.pixelSize: Typography.sizeCaption
              font.family: Typography.familyMono
              color: ThemeTokens.subduedText
            }
          }
        }
      }
    }
  }
}
