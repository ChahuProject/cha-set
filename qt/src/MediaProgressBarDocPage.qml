// MediaProgressBarDocPage.qml — Documentation and interactive sandbox for ChaSetMediaProgressBar
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Forms & Inputs"
    pageTitle: "MediaProgressBar"
    description: "通用媒体播放进度条组件，支持拖拽擦洗、点击 seek、悬停预览、左下方「位置 / 总长」时间显示、点击翻转正/倒计时与右键格式菜单。"

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

    DocFooterSections {
        width: parent.width
        componentId: "media-progress-bar"
        propsModel: [
            { "name": "ratio", "type": "real", "defaultValue": "0", "description": ChaSetI18n.tr("components.mediaProgressBar.ratioDesc", "Playback progress ratio from 0.0 to 1.0.") },
            { "name": "duration", "type": "real", "defaultValue": "0", "description": ChaSetI18n.tr("components.mediaProgressBar.durationDesc", "Total duration of the media in milliseconds.") },
            { "name": "position", "type": "real", "defaultValue": "0", "description": ChaSetI18n.tr("components.mediaProgressBar.positionDesc", "Current playback position in milliseconds.") },
            { "name": "frameRate", "type": "real", "defaultValue": "30", "description": ChaSetI18n.tr("components.mediaProgressBar.frameRateDesc", "Frame rate for frame-based time formatting.") },
            { "name": "timingMode", "type": "string", "defaultValue": "\"elapsed\"", "description": ChaSetI18n.tr("components.mediaProgressBar.timingModeDesc", "Timing mode: elapsed time or remaining countdown.") },
            { "name": "timeFormat", "type": "string", "defaultValue": "\"hms\"", "description": ChaSetI18n.tr("components.mediaProgressBar.timeFormatDesc", "Format to display timestamp.") },
            { "name": "showTime", "type": "bool", "defaultValue": "true", "description": ChaSetI18n.tr("components.mediaProgressBar.showTimeDesc", "Whether to show the time readout underneath.") },
            { "name": "showThumb", "type": "bool", "defaultValue": "true", "description": ChaSetI18n.tr("components.mediaProgressBar.showThumbDesc", "Whether to display the progress thumb handle.") },
            { "name": "interactive", "type": "bool", "defaultValue": "true", "description": ChaSetI18n.tr("components.mediaProgressBar.interactiveDesc", "Whether pointer seek/drag is enabled.") },
            { "name": "disabled", "type": "bool", "defaultValue": "false", "description": ChaSetI18n.tr("components.mediaProgressBar.disabledDesc", "Disabled state.") }
        ]
    }
}
