// ChaSetIcon.qml — Cross-stack vector icon primitive for ChaSet (pure vector, zero emojis)
import QtQuick 6.10
import ChaSet

Item {
    id: root

    property string name: ""
    property int size: 16
    property color color: ThemeTokens.text

    implicitWidth: size
    implicitHeight: size
    width: implicitWidth
    height: implicitHeight

    Canvas {
        id: iconCanvas
        anchors.fill: parent
        renderTarget: Canvas.Image
        antialiasing: true

        onPaint: {
            var ctx = getContext("2d");
            ctx.reset();
            ctx.clearRect(0, 0, width, height);

            var w = width;
            var h = height;
            if (w <= 0 || h <= 0) return;

            ctx.strokeStyle = root.color;
            ctx.fillStyle = root.color;
            var lw = Math.max(1.2, w * 0.09);
            ctx.lineWidth = lw;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            var n = (root.name || "").toLowerCase().trim();

            if (n === "check") {
                ctx.beginPath();
                ctx.moveTo(w * 0.2, h * 0.52);
                ctx.lineTo(w * 0.42, h * 0.74);
                ctx.lineTo(w * 0.82, h * 0.28);
                ctx.stroke();
            } else if (n === "x" || n === "close") {
                ctx.beginPath();
                ctx.moveTo(w * 0.25, h * 0.25);
                ctx.lineTo(w * 0.75, h * 0.75);
                ctx.moveTo(w * 0.75, h * 0.25);
                ctx.lineTo(w * 0.25, h * 0.75);
                ctx.stroke();
            } else if (n === "minimize") {
                ctx.beginPath();
                ctx.moveTo(w * 0.2, h * 0.5);
                ctx.lineTo(w * 0.8, h * 0.5);
                ctx.stroke();
            } else if (n === "maximize") {
                ctx.beginPath();
                ctx.rect(w * 0.2, h * 0.2, w * 0.6, h * 0.6);
                ctx.stroke();
            } else if (n === "restore") {
                ctx.beginPath();
                ctx.rect(w * 0.35, h * 0.15, w * 0.5, h * 0.5);
                ctx.rect(w * 0.15, h * 0.35, w * 0.5, h * 0.5);
                ctx.stroke();
            } else if (n === "search") {
                ctx.beginPath();
                var cx = w * 0.42;
                var cy = h * 0.42;
                var r = w * 0.26;
                ctx.arc(cx, cy, r, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(cx + r * 0.7, cy + r * 0.7);
                ctx.lineTo(w * 0.84, h * 0.84);
                ctx.stroke();
            } else if (n === "settings" || n === "gear") {
                ctx.beginPath();
                var gcX = w * 0.5;
                var gcY = h * 0.5;
                var outR = w * 0.38;
                var inR = w * 0.28;
                var teeth = 8;
                for (var i = 0; i < teeth * 2; i++) {
                    var angle = (i * Math.PI) / teeth;
                    var rad = (i % 2 === 0) ? outR : inR;
                    var px = gcX + rad * Math.cos(angle);
                    var py = gcY + rad * Math.sin(angle);
                    if (i === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(gcX, gcY, w * 0.12, 0, 2 * Math.PI);
                ctx.stroke();
            } else if (n === "pencil" || n === "edit") {
                ctx.beginPath();
                ctx.moveTo(w * 0.8, h * 0.2);
                ctx.lineTo(w * 0.7, h * 0.1);
                ctx.lineTo(w * 0.2, h * 0.6);
                ctx.lineTo(w * 0.15, h * 0.85);
                ctx.lineTo(w * 0.4, h * 0.8);
                ctx.closePath();
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(w * 0.6, h * 0.2);
                ctx.lineTo(w * 0.8, h * 0.4);
                ctx.stroke();
            } else if (n === "eye") {
                ctx.beginPath();
                ctx.moveTo(w * 0.1, h * 0.5);
                ctx.bezierCurveTo(w * 0.3, h * 0.2, w * 0.7, h * 0.2, w * 0.9, h * 0.5);
                ctx.bezierCurveTo(w * 0.7, h * 0.8, w * 0.3, h * 0.8, w * 0.1, h * 0.5);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(w * 0.5, h * 0.5, w * 0.14, 0, 2 * Math.PI);
                ctx.stroke();
            } else if (n === "eye-off") {
                ctx.beginPath();
                ctx.moveTo(w * 0.1, h * 0.5);
                ctx.bezierCurveTo(w * 0.3, h * 0.25, w * 0.7, h * 0.25, w * 0.9, h * 0.5);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(w * 0.5, h * 0.5, w * 0.13, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(w * 0.15, h * 0.15);
                ctx.lineTo(w * 0.85, h * 0.85);
                ctx.stroke();
            } else if (n === "lock") {
                ctx.beginPath();
                ctx.rect(w * 0.2, h * 0.44, w * 0.6, h * 0.44);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(w * 0.5, h * 0.44, w * 0.2, Math.PI, 2 * Math.PI);
                ctx.stroke();
            } else if (n === "copy") {
                ctx.beginPath();
                ctx.rect(w * 0.35, h * 0.35, w * 0.52, h * 0.52);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(w * 0.2, h * 0.65);
                ctx.lineTo(w * 0.15, h * 0.65);
                ctx.lineTo(w * 0.15, h * 0.15);
                ctx.lineTo(w * 0.65, h * 0.15);
                ctx.lineTo(w * 0.65, h * 0.2);
                ctx.stroke();
            } else if (n === "globe" || n === "language") {
                ctx.beginPath();
                ctx.arc(w * 0.5, h * 0.5, w * 0.38, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.beginPath();
                ctx.ellipse(w * 0.5, h * 0.5, w * 0.18, h * 0.38, 0, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(w * 0.12, h * 0.5);
                ctx.lineTo(w * 0.88, h * 0.5);
                ctx.stroke();
            } else if (n === "monitor" || n === "system") {
                ctx.beginPath();
                ctx.rect(w * 0.15, h * 0.18, w * 0.7, h * 0.5);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(w * 0.5, h * 0.68);
                ctx.lineTo(w * 0.5, h * 0.82);
                ctx.moveTo(w * 0.32, h * 0.82);
                ctx.lineTo(w * 0.68, h * 0.82);
                ctx.stroke();
            } else if (n === "sun") {
                ctx.beginPath();
                ctx.arc(w * 0.5, h * 0.5, w * 0.18, 0, 2 * Math.PI);
                ctx.stroke();
                var rays = [
                    [0.5, 0.12, 0.5, 0.24],
                    [0.5, 0.76, 0.5, 0.88],
                    [0.12, 0.5, 0.24, 0.5],
                    [0.76, 0.5, 0.88, 0.5],
                    [0.23, 0.23, 0.32, 0.32],
                    [0.68, 0.68, 0.77, 0.77],
                    [0.23, 0.77, 0.32, 0.68],
                    [0.68, 0.32, 0.77, 0.23]
                ];
                for (var rIdx = 0; rIdx < rays.length; rIdx++) {
                    ctx.beginPath();
                    ctx.moveTo(w * rays[rIdx][0], h * rays[rIdx][1]);
                    ctx.lineTo(w * rays[rIdx][2], h * rays[rIdx][3]);
                    ctx.stroke();
                }
            } else if (n === "moon") {
                ctx.beginPath();
                ctx.arc(w * 0.5, h * 0.5, w * 0.34, 0.5 * Math.PI, 1.5 * Math.PI);
                ctx.bezierCurveTo(w * 0.6, h * 0.2, w * 0.6, h * 0.8, w * 0.5, h * 0.84);
                ctx.stroke();
            } else if (n === "palette" || n === "theme") {
                ctx.beginPath();
                ctx.arc(w * 0.5, h * 0.5, w * 0.38, 0, 2 * Math.PI);
                ctx.stroke();
                var dots = [[0.35, 0.35], [0.65, 0.35], [0.35, 0.65]];
                for (var d = 0; d < dots.length; d++) {
                    ctx.beginPath();
                    ctx.arc(w * dots[d][0], h * dots[d][1], w * 0.06, 0, 2 * Math.PI);
                    ctx.fill();
                }
            } else if (n === "zap" || n === "lightning") {
                ctx.beginPath();
                ctx.moveTo(w * 0.55, h * 0.1);
                ctx.lineTo(w * 0.2, h * 0.55);
                ctx.lineTo(w * 0.5, h * 0.55);
                ctx.lineTo(w * 0.45, h * 0.9);
                ctx.lineTo(w * 0.8, h * 0.45);
                ctx.lineTo(w * 0.5, h * 0.45);
                ctx.closePath();
                ctx.stroke();
            } else if (n === "target") {
                ctx.beginPath();
                ctx.arc(w * 0.5, h * 0.5, w * 0.38, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(w * 0.5, h * 0.5, w * 0.22, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(w * 0.5, h * 0.5, w * 0.08, 0, 2 * Math.PI);
                ctx.fill();
            } else if (n === "rocket") {
                ctx.beginPath();
                ctx.moveTo(w * 0.8, h * 0.2);
                ctx.bezierCurveTo(w * 0.8, h * 0.5, w * 0.5, h * 0.8, w * 0.2, h * 0.8);
                ctx.lineTo(w * 0.3, h * 0.5);
                ctx.bezierCurveTo(w * 0.5, h * 0.5, w * 0.5, h * 0.2, w * 0.8, h * 0.2);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(w * 0.2, h * 0.8);
                ctx.lineTo(w * 0.1, h * 0.9);
                ctx.stroke();
            } else if (n === "trash" || n === "delete") {
                ctx.beginPath();
                ctx.moveTo(w * 0.15, h * 0.28);
                ctx.lineTo(w * 0.85, h * 0.28);
                ctx.moveTo(w * 0.35, h * 0.28);
                ctx.lineTo(w * 0.35, h * 0.15);
                ctx.lineTo(w * 0.65, h * 0.15);
                ctx.lineTo(w * 0.65, h * 0.28);
                ctx.moveTo(w * 0.25, h * 0.28);
                ctx.lineTo(w * 0.28, h * 0.85);
                ctx.lineTo(w * 0.72, h * 0.85);
                ctx.lineTo(w * 0.75, h * 0.28);
                ctx.stroke();
            } else if (n === "folder") {
                ctx.beginPath();
                ctx.moveTo(w * 0.15, h * 0.8);
                ctx.lineTo(w * 0.85, h * 0.8);
                ctx.lineTo(w * 0.85, h * 0.35);
                ctx.lineTo(w * 0.52, h * 0.35);
                ctx.lineTo(w * 0.44, h * 0.22);
                ctx.lineTo(w * 0.15, h * 0.22);
                ctx.closePath();
                ctx.stroke();
            } else if (n === "home") {
                ctx.beginPath();
                ctx.moveTo(w * 0.15, h * 0.45);
                ctx.lineTo(w * 0.5, h * 0.15);
                ctx.lineTo(w * 0.85, h * 0.45);
                ctx.lineTo(w * 0.85, h * 0.85);
                ctx.lineTo(w * 0.15, h * 0.85);
                ctx.closePath();
                ctx.stroke();
            } else if (n === "tag") {
                ctx.beginPath();
                ctx.moveTo(w * 0.15, h * 0.15);
                ctx.lineTo(w * 0.5, h * 0.15);
                ctx.lineTo(w * 0.85, h * 0.5);
                ctx.lineTo(w * 0.5, h * 0.85);
                ctx.lineTo(w * 0.15, h * 0.5);
                ctx.closePath();
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(w * 0.32, h * 0.32, w * 0.06, 0, 2 * Math.PI);
                ctx.fill();
            } else if (n === "package" || n === "archive") {
                ctx.beginPath();
                ctx.rect(w * 0.18, h * 0.22, w * 0.64, h * 0.64);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(w * 0.18, h * 0.42);
                ctx.lineTo(w * 0.82, h * 0.42);
                ctx.moveTo(w * 0.5, h * 0.42);
                ctx.lineTo(w * 0.5, h * 0.86);
                ctx.stroke();
            } else if (n === "stop") {
                ctx.beginPath();
                ctx.moveTo(w * 0.32, h * 0.15);
                ctx.lineTo(w * 0.68, h * 0.15);
                ctx.lineTo(w * 0.85, h * 0.32);
                ctx.lineTo(w * 0.85, h * 0.68);
                ctx.lineTo(w * 0.68, h * 0.85);
                ctx.lineTo(w * 0.32, h * 0.85);
                ctx.lineTo(w * 0.15, h * 0.68);
                ctx.lineTo(w * 0.15, h * 0.32);
                ctx.closePath();
                ctx.stroke();
            } else if (n === "clock") {
                ctx.beginPath();
                ctx.arc(w * 0.5, h * 0.5, w * 0.38, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(w * 0.5, h * 0.24);
                ctx.lineTo(w * 0.5, h * 0.5);
                ctx.lineTo(w * 0.68, h * 0.5);
                ctx.stroke();
            } else if (n === "rotate-ccw" || n === "refresh") {
                ctx.beginPath();
                ctx.arc(w * 0.5, h * 0.5, w * 0.32, 0.2 * Math.PI, 1.8 * Math.PI);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(w * 0.55, h * 0.1);
                ctx.lineTo(w * 0.72, h * 0.18);
                ctx.lineTo(w * 0.55, h * 0.3);
                ctx.stroke();
            } else if (n === "table") {
                ctx.beginPath();
                ctx.rect(w * 0.15, h * 0.18, w * 0.7, h * 0.64);
                ctx.moveTo(w * 0.15, h * 0.42);
                ctx.lineTo(w * 0.85, h * 0.42);
                ctx.moveTo(w * 0.5, h * 0.18);
                ctx.lineTo(w * 0.5, h * 0.82);
                ctx.stroke();
            } else if (n === "list") {
                ctx.beginPath();
                ctx.moveTo(w * 0.2, h * 0.3);
                ctx.lineTo(w * 0.8, h * 0.3);
                ctx.moveTo(w * 0.2, h * 0.5);
                ctx.lineTo(w * 0.8, h * 0.5);
                ctx.moveTo(w * 0.2, h * 0.7);
                ctx.lineTo(w * 0.8, h * 0.7);
                ctx.stroke();
            } else if (n === "grid") {
                ctx.beginPath();
                ctx.rect(w * 0.18, h * 0.18, w * 0.28, h * 0.28);
                ctx.rect(w * 0.54, h * 0.18, w * 0.28, h * 0.28);
                ctx.rect(w * 0.18, h * 0.54, w * 0.28, h * 0.28);
                ctx.rect(w * 0.54, h * 0.54, w * 0.28, h * 0.28);
                ctx.stroke();
            } else if (n === "chart" || n === "bar-chart") {
                ctx.beginPath();
                ctx.moveTo(w * 0.18, h * 0.82);
                ctx.lineTo(w * 0.82, h * 0.82);
                ctx.moveTo(w * 0.3, h * 0.82);
                ctx.lineTo(w * 0.3, h * 0.5);
                ctx.moveTo(w * 0.5, h * 0.82);
                ctx.lineTo(w * 0.5, h * 0.28);
                ctx.moveTo(w * 0.7, h * 0.82);
                ctx.lineTo(w * 0.7, h * 0.6);
                ctx.stroke();
            } else if (n === "user") {
                ctx.beginPath();
                ctx.arc(w * 0.5, h * 0.34, w * 0.18, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(w * 0.5, h * 0.85, w * 0.34, 1.1 * Math.PI, 1.9 * Math.PI);
                ctx.stroke();
            } else if (n === "credit-card") {
                ctx.beginPath();
                ctx.rect(w * 0.15, h * 0.24, w * 0.7, h * 0.52);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(w * 0.15, h * 0.42);
                ctx.lineTo(w * 0.85, h * 0.42);
                ctx.stroke();
            } else if (n === "log-out") {
                ctx.beginPath();
                ctx.moveTo(w * 0.4, h * 0.2);
                ctx.lineTo(w * 0.2, h * 0.2);
                ctx.lineTo(w * 0.2, h * 0.8);
                ctx.lineTo(w * 0.4, h * 0.8);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(w * 0.45, h * 0.5);
                ctx.lineTo(w * 0.8, h * 0.5);
                ctx.lineTo(w * 0.65, h * 0.35);
                ctx.moveTo(w * 0.8, h * 0.5);
                ctx.lineTo(w * 0.65, h * 0.65);
                ctx.stroke();
            } else if (n === "logo" || n === "chaset") {
                // Elegant vector tea cup
                ctx.beginPath();
                ctx.moveTo(w * 0.18, h * 0.34);
                ctx.lineTo(w * 0.72, h * 0.34);
                ctx.lineTo(w * 0.66, h * 0.72);
                ctx.bezierCurveTo(w * 0.62, h * 0.82, w * 0.28, h * 0.82, w * 0.24, h * 0.72);
                ctx.closePath();
                ctx.stroke();
                // Handle
                ctx.beginPath();
                ctx.arc(w * 0.72, h * 0.48, w * 0.12, 1.5 * Math.PI, 0.5 * Math.PI);
                ctx.stroke();
            } else {
                // Fallback: subtle square
                ctx.beginPath();
                ctx.rect(w * 0.25, h * 0.25, w * 0.5, h * 0.5);
                ctx.stroke();
            }
        }
    }

    onColorChanged: iconCanvas.requestPaint()
    onNameChanged: iconCanvas.requestPaint()
    onWidthChanged: iconCanvas.requestPaint()
    onHeightChanged: iconCanvas.requestPaint()
}
