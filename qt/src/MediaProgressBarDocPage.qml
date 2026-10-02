// MediaProgressBarDocPage.qml — Documentation and interactive sandbox for ChaSetMediaProgressBar
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Media"
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
        title: "MediaProgressBar Sandbox"
        stageData: [
            Item {
                anchors.centerIn: parent
                width: Math.min(parent.width - 40, 480)
                height: 90

                Column {
                    anchors.centerIn: parent
                    width: parent.width
                    spacing: 12

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
                }
            }
        ]
    }
}
