// MediaProgressBarDocPage.qml — Documentation and interactive sandbox for ChaSetMediaProgressBar
import QtQuick
import QtQuick.Controls
import ChaSet

DocLayout {
    id: root
    category: "Forms & Inputs"
    pageTitle: "MediaProgressBar"
    description: ChaSetI18n.tr("components.mediaProgressBar.description", "Universal media playback progress bar supporting drag-scrubbing, click-to-seek, hover preview, elapsed/remaining time display, click to toggle countdown, and context format menu.")

    property real demoRatio: 0.35
    property real demoPosition: 42000
    property real demoDuration: 120000
    property real demoFps: 30.0
    property string demoTimingMode: "elapsed"
    property string demoTimeFormat: "hms"
    property bool demoShowTime: true

    ComponentPreview {
        id: heroPreview
        width: parent.width
        title: ChaSetI18n.tr("desktopComposite.mediaProgressBar.sandboxTitle", "MediaProgressBar Sandbox")
        reactCode: `<MediaProgressBar
  ratio={${root.demoRatio.toFixed(2)}}
  duration={${root.demoDuration}}
  frameRate={${root.demoFps}}
  timingMode="${root.demoTimingMode}"
  timeFormat="${root.demoTimeFormat}"
  showTime={${root.demoShowTime}}
  onSeekRequested={setRatio}
  onTimingModeChanged={setTimingMode}
/>`
        qtCode: `ChaSetMediaProgressBar {
    width: parent.width
    ratio: ${root.demoRatio.toFixed(2)}
    duration: ${root.demoDuration}
    frameRate: ${root.demoFps}
    timingMode: "${root.demoTimingMode}"
    timeFormat: "${root.demoTimeFormat}"
    showTime: ${root.demoShowTime}
    onSeekRequested: (r) => root.demoRatio = r
}`
        stageData: [
            Item {
                anchors.centerIn: parent
                width: Math.min(parent.width - ThemeTokens.dp(40), ThemeTokens.dp(480))
                height: ThemeTokens.dp(90)

                Column {
                    anchors.centerIn: parent
                    width: parent.width
                    spacing: ThemeTokens.dp(12)

                    ChaSetMediaProgressBar {
                        width: parent.width
                        ratio: root.demoRatio
                        position: root.demoPosition
                        duration: root.demoDuration
                        frameRate: root.demoFps
                        timingMode: root.demoTimingMode
                        timeFormat: root.demoTimeFormat
                        showTime: root.demoShowTime

                        onSeekRequested: (r) => {
                            root.demoRatio = r
                            root.demoPosition = r * root.demoDuration
                        }
                        onTimingModeChanged: (m) => root.demoTimingMode = m
                        onTimeFormatChanged: (f) => root.demoTimeFormat = f
                    }

                    Item {
                        width: parent.width
                        height: Math.max(statusText.implicitHeight, timingText.implicitHeight)

                        DocText {
                            id: statusText
                            anchors.left: parent.left
                            anchors.verticalCenter: parent.verticalCenter
                            text: ChaSetI18n.tr("components.mediaProgressBar.playbackStatus", "Playback Progress") + ": " + Math.round(root.demoRatio * 100) + "%"
                            color: ThemeTokens.subduedText
                            font.pixelSize: Typography.sizeCaption
                        }

                        DocText {
                            id: timingText
                            anchors.right: parent.right
                            anchors.verticalCenter: parent.verticalCenter
                            text: ChaSetI18n.tr("components.mediaProgressBar.timingModeLabel", "Timing Mode") + ": " + root.demoTimingMode
                            color: ThemeTokens.subduedText
                            font.pixelSize: Typography.sizeCaption
                        }
                    }
                }
            }
        ]
    }

    DocMarkdown {
        width: parent.width
        docId: "media-progress-bar"
        section: "animations"
    }

    DocMarkdown {
        width: parent.width
        docId: "media-progress-bar"
        section: "keyboard"
    }

    DocMarkdown {
        width: parent.width
        docId: "media-progress-bar"
        section: "props"
    }
}
