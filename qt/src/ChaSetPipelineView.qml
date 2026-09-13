// ChaSetPipelineView.qml — Cross-stack Pipeline Execution View in Qt Quick
import QtQuick 6.10
import QtQuick.Controls 6.10
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

  implicitWidth: 780
  implicitHeight: 480
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

  function getStatusColor(s) {
    var str = (s || "").toLowerCase()
    if (str === "success" || str === "成功") return "#10b981"
    if (str === "failure" || str === "failed" || str === "失败") return ThemeTokens.destructive
    if (str === "running" || str === "compiling" || str === "运行中" || str === "编译中") return ThemeTokens.accent
    if (str === "retrying" || str === "重试中") return "#f59e0b"
    return ThemeTokens.textMuted
  }

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
    spacing: 12

    // Left Job List Column
    Rectangle {
      width: 240
      height: parent.height
      color: ThemeTokens.card
      border.color: ThemeTokens.border
      border.width: 1
      radius: 8
      clip: true

      Column {
        anchors.fill: parent

        // Header
        Rectangle {
          width: parent.width
          height: 32
          color: "transparent"
          border.color: ThemeTokens.border
          border.width: 0

          Rectangle {
            anchors.bottom: parent.bottom
            width: parent.width
            height: 1
            color: ThemeTokens.border
          }

          Text {
            anchors.verticalCenter: parent.verticalCenter
            anchors.left: parent.left
            anchors.leftMargin: 10
            text: root.jobsTitle
            font.pixelSize: 12
            font.weight: Font.DemiBold
            color: ThemeTokens.textMuted
          }
        }

        // Job items list
        ListView {
          id: jobListView
          width: parent.width
          height: parent.height - 32
          clip: true
          model: root.jobs
          boundsBehavior: Flickable.StopAtBounds

          delegate: Rectangle {
            id: jobItemRect
            required property int index
            required property var modelData

            readonly property bool isSelected: modelData && (modelData.id === root.activeJobId || (root.activeJobId === "" && index === 0))
            readonly property color jobColor: root.getStatusColor(modelData ? modelData.status : "")
            readonly property string jobDur: root.formatDuration(modelData ? modelData.durationMs : null)

            width: jobListView.width
            height: 32
            color: isSelected ? (ThemeTokens.dark ? Qt.rgba(0.2, 0.25, 0.35, 0.6) : Qt.rgba(0.92, 0.94, 0.97, 1)) : (jobMouse.containsMouse ? (ThemeTokens.dark ? Qt.rgba(0.15, 0.2, 0.28, 0.4) : Qt.rgba(0.96, 0.97, 0.98, 1)) : "transparent")
            radius: 4

            Row {
              anchors.fill: parent
              anchors.margins: 6
              spacing: 6

              // Status dot
              Rectangle {
                width: 8
                height: 8
                radius: 4
                anchors.verticalCenter: parent.verticalCenter
                color: jobItemRect.jobColor
              }

              // Job name
              Text {
                text: jobItemRect.modelData ? (jobItemRect.modelData.name || "") : ""
                font.pixelSize: 12
                font.weight: jobItemRect.isSelected ? Font.Medium : Font.Normal
                color: ThemeTokens.text
                elide: Text.ElideRight
                width: parent.width - 20 - (jobItemRect.jobDur !== "" ? 45 : 0)
                anchors.verticalCenter: parent.verticalCenter
              }

              // Duration
              Text {
                visible: jobItemRect.jobDur !== ""
                text: jobItemRect.jobDur
                font.pixelSize: 10
                font.family: "monospace"
                color: ThemeTokens.textMuted
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
    Column {
      width: parent.width - 252
      height: parent.height
      spacing: 8

      // Header row
      Row {
        width: parent.width
        height: 28
        spacing: 8

        ChaSetBadge {
          text: root.getStatusLabel(root.status)
          variant: (root.status === "success" || root.status === "成功") ? "secondary" : ((root.status === "failure" || root.status === "失败") ? "destructive" : "default")
          anchors.verticalCenter: parent.verticalCenter
        }

        Text {
          visible: root.totalDurationText !== ""
          text: root.totalDurationText
          font.pixelSize: 12
          font.family: "monospace"
          color: ThemeTokens.textMuted
          anchors.verticalCenter: parent.verticalCenter
        }

        Item {
          width: 1
          height: 1
          // Spacer
        }

        ChaSetButton {
          text: "Cancel"
          variant: "outline"
          size: "sm"
          disabled: root.cancelDisabled
          anchors.verticalCenter: parent.verticalCenter
          anchors.right: parent.right
          onClicked: root.cancelClicked()
        }
      }

      // Step Timeline Card
      Rectangle {
        visible: root.activeJob && root.activeJob.steps && root.activeJob.steps.length > 0
        width: parent.width
        implicitHeight: timelineItem.implicitHeight + 20
        height: implicitHeight
        color: ThemeTokens.card
        border.color: ThemeTokens.border
        border.width: 1
        radius: 8

        ChaSetStepTimeline {
          id: timelineItem
          anchors.fill: parent
          anchors.margins: 10
          steps: (root.activeJob && root.activeJob.steps) ? root.activeJob.steps : []
        }
      }

      // Log Console
      ChaSetLogConsole {
        width: parent.width
        height: parent.height - 36 - ((root.activeJob && root.activeJob.steps && root.activeJob.steps.length > 0) ? (timelineItem.implicitHeight + 28) : 0)
        lines: root.activeLogs
      }
    }
  }
}
