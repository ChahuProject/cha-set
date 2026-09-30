// ChaSetCircularProgress.qml — Cross-Platform Vector Circular Progress / Countdown Indicator
import QtQuick 6.10
import ChaSet

Item {
    id: root

    property real value: 0.0          // 0.0 ~ 1.0
    property real size: ThemeTokens.dp(16)
    property real strokeWidth: ThemeTokens.dp(2)
    property color color: ThemeTokens.accent
    property color trackColor: Qt.rgba(root.color.r, root.color.g, root.color.b, 0.2)
    property bool anticlockwise: false

    implicitWidth: size
    implicitHeight: size
    width: implicitWidth
    height: implicitHeight

    Canvas {
        id: canvas
        anchors.fill: parent
        antialiasing: true
        renderTarget: Canvas.FramebufferObject

        onPaint: {
            var ctx = getContext("2d")
            ctx.reset()
            var w = width
            var h = height
            var cx = w / 2
            var cy = h / 2
            var sw = Math.max(1, root.strokeWidth)
            var r = Math.max(0, (Math.min(w, h) - sw) / 2)
            if (r <= 0) return

            // 1. 底环轨道
            if (root.trackColor !== "transparent" && root.trackColor.a > 0) {
                ctx.beginPath()
                ctx.arc(cx, cy, r, 0, 2 * Math.PI, false)
                ctx.lineWidth = sw
                ctx.strokeStyle = root.trackColor
                ctx.stroke()
            }

            // 2. 进度弧段（从 12 点钟位置 -PI/2 开始）
            var val = Math.max(0.0, Math.min(1.0, root.value))
            if (val > 0.001) {
                var startAngle = -Math.PI / 2
                var endAngle = startAngle + (val * 2 * Math.PI * (root.anticlockwise ? -1 : 1))
                ctx.beginPath()
                ctx.arc(cx, cy, r, startAngle, endAngle, root.anticlockwise)
                ctx.lineWidth = sw
                ctx.lineCap = "round"
                ctx.strokeStyle = root.color
                ctx.stroke()
            }
        }
    }

    onValueChanged: canvas.requestPaint()
    onColorChanged: canvas.requestPaint()
    onTrackColorChanged: canvas.requestPaint()
    onStrokeWidthChanged: canvas.requestPaint()
    onWidthChanged: canvas.requestPaint()
    onHeightChanged: canvas.requestPaint()
}
