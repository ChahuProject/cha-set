// ChaSetPipelineView.qml — Cross-stack Pipeline Execution View in Qt Quick
import QtQuick 6.10
import QtQuick.Controls 6.10
import QtQuick.Shapes
import ChaSet

Item {
  id: root

  property string status: "running"
  property double startMs: 0
  property var endMs: null
  property var jobs: []
  property string activeJobId: ""
  property var logsSupplier: null
  property string jobsTitle: "Jobs"
  property string emptyJobsText: "No jobs"
  property bool cancelDisabled: false

  signal jobSelected(string jobId)
  signal cancelClicked()

  implicitWidth: ThemeTokens.dp(780)
  implicitHeight: ThemeTokens.dp(448)
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

  function getStatusLabel(s) {
    var str = (s || "").toLowerCase()
    if (str === "success" || str === "成功") return "Success"
    if (str === "failure" || str === "failed" || str === "失败") return "Failed"
    if (str === "running" || str === "运行中") return "Running"
    if (str === "compiling" || str === "编译中") return "Compiling"
    if (str === "retrying" || str === "重试中") return "Retrying"
    if (str === "queued" || str === "排队") return "Queued"
    if (str === "cancelled" || str === "已取消") return "Cancelled"
    return str || "Queued"
  }

  function normalize(s) {
    var str = (s || "").toLowerCase()
    if (str === "success" || str === "成功") return "success"
    if (str === "failure" || str === "failed" || str === "失败") return "failure"
    if (str === "running" || str === "运行中") return "running"
    if (str === "compiling" || str === "编译中") return "compiling"
    if (str === "retrying" || str === "重试中") return "retrying"
    if (str === "cancelled" || str === "已取消") return "cancelled"
    return "queued"
  }

  readonly property string normStatus: normalize(root.status)

  function getActiveJob() {
    if (!root.jobs || root.jobs.length === 0) return null
    for (var i = 0; i < root.jobs.length; i++) {
      if (root.jobs[i].id === root.activeJobId) {
        return root.jobs[i]
      }
    }
    return root.jobs[0]
  }

  readonly property var activeJob: getActiveJob()
  readonly property var activeLogs: {
    if (root.logsSupplier && root.activeJob) {
      return root.logsSupplier(root.activeJob.id)
    }
    return []
  }

  readonly property string totalDurationText: {
    if (root.endMs !== null && root.endMs !== undefined && root.endMs >= root.startMs) {
      return root.formatDuration(root.endMs - root.startMs)
    }
    return ""
  }

  Row {
    anchors.fill: parent
    spacing: ThemeTokens.dp(12)

    // Left Job List Column (Width: 288 matching React w-[18rem])
    Rectangle {
      width: ThemeTokens.dp(288)
      height: parent.height
      color: ThemeTokens.panel
      border.color: ThemeTokens.border
      border.width: 1
      radius: ThemeTokens.dp(8)
      clip: true

      Column {
        anchors.fill: parent

        // Header
        Rectangle {
          width: parent.width
          height: ThemeTokens.dp(33)
          color: "transparent"

          Rectangle {
            anchors.bottom: parent.bottom
            width: parent.width
            height: 1
            color: ThemeTokens.border
          }

          Text {
            anchors.verticalCenter: parent.verticalCenter
            anchors.left: parent.left
            anchors.leftMargin: ThemeTokens.dp(10)
            text: root.jobsTitle
            font.pixelSize: Typography.sizeSmall
            font.weight: Font.DemiBold
            color: ThemeTokens.subduedText
          }
        }

        // Job items list
        ListView {
          id: jobListView
          width: parent.width
          height: parent.height - ThemeTokens.dp(33)
          clip: true
          model: root.jobs
          boundsBehavior: Flickable.StopAtBounds

          ScrollBar.vertical: ChaSetScrollBar {}

          delegate: Rectangle {
            id: jobItemRect
            required property int index
            required property var modelData

            readonly property bool isSelected: modelData && (modelData.id === root.activeJobId || (root.activeJobId === "" && index === 0))
            readonly property string jobDur: root.formatDuration(modelData ? modelData.durationMs : null)

            width: jobListView.width - ThemeTokens.dp(8)
            height: ThemeTokens.dp(32)
            anchors.horizontalCenter: parent ? parent.horizontalCenter : undefined
            color: isSelected ? (ThemeTokens.dark ? Qt.rgba(0.2, 0.25, 0.35, 0.6) : Qt.rgba(0.92, 0.94, 0.97, 1)) : (jobMouse.containsMouse ? ThemeTokens.hover : "transparent")
            radius: ThemeTokens.dp(6)

            Row {
              anchors.fill: parent
              anchors.leftMargin: ThemeTokens.dp(8)
              anchors.rightMargin: ThemeTokens.dp(8)
              spacing: ThemeTokens.dp(8)

              // Status Icon matching React
              ChaSetStatusIcon {
                size: 14
                status: jobItemRect.modelData ? jobItemRect.modelData.status : "queued"
                anchors.verticalCenter: parent.verticalCenter
              }

              // Job name
              Text {
                text: jobItemRect.modelData ? (jobItemRect.modelData.name || "") : ""
                font.pixelSize: Typography.sizeSmall
                font.weight: jobItemRect.isSelected ? Font.Medium : Font.Normal
                color: ThemeTokens.text
                elide: Text.ElideRight
                width: parent.width - ThemeTokens.dp(22) - (jobItemRect.jobDur !== "" ? ThemeTokens.dp(45) : 0)
                anchors.verticalCenter: parent.verticalCenter
              }

              // Duration
              Text {
                visible: jobItemRect.jobDur !== ""
                text: jobItemRect.jobDur
                font.pixelSize: Typography.sizeCaption
                font.family: Typography.familyMono
                color: ThemeTokens.subduedText
                anchors.verticalCenter: parent.verticalCenter
              }
            }

            MouseArea {
              id: jobMouse
              anchors.fill: parent
              hoverEnabled: true
              cursorShape: Qt.PointingHandCursor
              onClicked: {
                if (jobItemRect.modelData) {
                  root.activeJobId = jobItemRect.modelData.id
                  root.jobSelected(jobItemRect.modelData.id)
                }
              }
            }
          }
        }
      }
    }

    // Right Section
    Item {
      width: parent.width - ThemeTokens.dp(300)
      height: parent.height

      // Header row
      Item {
        id: rightHeader
        anchors.top: parent.top
        anchors.left: parent.left
        anchors.right: parent.right
        height: ThemeTokens.dp(28)

        Row {
          id: leftHeaderRow
          anchors.left: parent.left
          anchors.verticalCenter: parent.verticalCenter
          spacing: ThemeTokens.dp(8)

          // Status Badge matching React styling
          Rectangle {
            height: ThemeTokens.dp(22)
            radius: height / 2
            border.width: 1
            anchors.verticalCenter: parent.verticalCenter
            width: badgeContentRow.implicitWidth + ThemeTokens.dp(14)

            color: {
              if (root.normStatus === "running" || root.normStatus === "compiling") return Qt.rgba(0.23, 0.51, 0.96, 0.15)
              if (root.normStatus === "success") return Qt.rgba(0.06, 0.72, 0.51, 0.15)
              if (root.normStatus === "failure") return Qt.rgba(0.94, 0.27, 0.27, 0.15)
              if (root.normStatus === "retrying") return Qt.rgba(0.96, 0.62, 0.04, 0.15)
              return ThemeTokens.hover
            }

            border.color: {
              if (root.normStatus === "running" || root.normStatus === "compiling") return Qt.rgba(0.23, 0.51, 0.96, 0.3)
              if (root.normStatus === "success") return Qt.rgba(0.06, 0.72, 0.51, 0.3)
              if (root.normStatus === "failure") return Qt.rgba(0.94, 0.27, 0.27, 0.3)
              if (root.normStatus === "retrying") return Qt.rgba(0.96, 0.62, 0.04, 0.3)
              return ThemeTokens.border
            }

            Row {
              id: badgeContentRow
              anchors.centerIn: parent
              spacing: ThemeTokens.dp(5)

              ChaSetStatusIcon {
                size: 12
                status: root.status
                anchors.verticalCenter: parent.verticalCenter
              }

              Text {
                text: root.getStatusLabel(root.status)
                font.pixelSize: Typography.sizeCaption
                font.weight: Font.Medium
                anchors.verticalCenter: parent.verticalCenter
                color: {
                  if (root.normStatus === "running" || root.normStatus === "compiling") return "#60a5fa"
                  if (root.normStatus === "success") return "#34d399"
                  if (root.normStatus === "failure") return "#f87171"
                  if (root.normStatus === "retrying") return "#fbbf24"
                  return ThemeTokens.subduedText
                }
              }
            }
          }

          // Total duration with Clock icon
          Row {
            visible: root.totalDurationText !== ""
            spacing: ThemeTokens.dp(4)
            anchors.verticalCenter: parent.verticalCenter

            Shape {
              id: clockIcon
              width: ThemeTokens.dp(12)
              height: ThemeTokens.dp(12)
              scale: 0.5
              transformOrigin: Item.Center
              anchors.verticalCenter: parent.verticalCenter
              asynchronous: false

              ShapePath {
                strokeColor: ThemeTokens.subduedText
                strokeWidth: 2.0
                fillColor: "transparent"
                capStyle: ShapePath.RoundCap
                joinStyle: ShapePath.RoundJoin

                PathSvg {
                  path: "M 2 12 a 10 10 0 1 0 20 0 a 10 10 0 1 0 -20 0 M 12 6 v 6 l 4 2"
                }
              }
            }

            Text {
              text: root.totalDurationText
              font.pixelSize: Typography.sizeSmall
              font.family: Typography.familyMono
              color: ThemeTokens.subduedText
              anchors.verticalCenter: parent.verticalCenter
            }
          }
        }

        // Cancel Button on the right
        ChaSetButton {
          text: "Cancel"
          variant: "outline"
          size: "sm"
          disabled: root.cancelDisabled
          anchors.right: parent.right
          anchors.verticalCenter: parent.verticalCenter
          onClicked: root.cancelClicked()
        }
      }

      // Step Timeline Card
      Rectangle {
        id: timelineCard
        visible: root.activeJob && root.activeJob.steps && root.activeJob.steps.length > 0
        anchors.top: rightHeader.bottom
        anchors.topMargin: ThemeTokens.dp(8)
        anchors.left: parent.left
        anchors.right: parent.right
        height: (timelineItem.implicitHeight > 0 ? timelineItem.implicitHeight + ThemeTokens.dp(24) : 0)
        color: ThemeTokens.panel
        border.color: ThemeTokens.border
        border.width: 1
        radius: ThemeTokens.dp(8)

        ChaSetStepTimeline {
          id: timelineItem
          anchors.fill: parent
          anchors.margins: ThemeTokens.dp(12)
          steps: (root.activeJob && root.activeJob.steps) ? root.activeJob.steps : []
        }
      }

      // Log Console
      ChaSetLogConsole {
        anchors.top: timelineCard.visible ? timelineCard.bottom : rightHeader.bottom
        anchors.topMargin: ThemeTokens.dp(8)
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.bottom: parent.bottom
        lines: root.activeLogs
      }
    }
  }
}
