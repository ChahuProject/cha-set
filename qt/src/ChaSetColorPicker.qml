// ChaSetColorPicker.qml — Cross-Stack ColorPicker Component
// 100% Feature Parity with React ColorPicker.tsx & chahu-render-debugger
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root

    property color value: "#1d7ae0"
    property string hex: "#1D7AE0"
    property bool disabled: false
    property bool showPreview: true
    property bool showHex: true
    property bool showSwatches: true
    property string size: "default" // "default" | "sm"
    property string mode: "inline"   // "inline" | "popover"
    property var presetColors: [
        "#18181b", "#334155", "#ef4444", "#f97316",
        "#eab308", "#22c55e", "#06b6d4", "#3b82f6",
        "#8b5cf6", "#ec4899", "#f43f5e", "#14b8a6",
        "#84cc16", "#f59e0b", "#6366f1", "#a855f7"
    ]

    signal colorChanged(color color)

    // Internal HSV state (0.0 to 1.0)
    property real currentH: 0.58
    property real currentS: 0.87
    property real currentV: 0.88
    property bool updatingInternally: false
    property string activePanel: "square" // "square" | "circle" | "triangle" | "swatches"

    // Independent multi-channel toggle flags
    property bool showRgbSliders: true
    property bool showHsvSliders: false
    property bool showCmykSliders: false
    property bool showLabSliders: false

    property bool showCopied: false

    readonly property bool isDark: ThemeTokens.dark
    readonly property bool isSm: root.size === "sm"
    readonly property int cardWidth: isSm ? 256 : 288
    readonly property int stageSize: isSm ? 180 : 210
    readonly property int innerStageSize: stageSize - 40

    implicitWidth: mode === "popover" ? popoverTrigger.implicitWidth : cardWidth
    implicitHeight: mode === "popover" ? popoverTrigger.implicitHeight : (panelLoader.item ? panelLoader.item.height : 540)

    opacity: root.disabled ? 0.5 : 1.0

    function clamp(val, min, max) {
        if (isNaN(val)) return min;
        return Math.min(max, Math.max(min, val));
    }

    function colorToHex(c) {
        var r = Math.round(c.r * 255).toString(16).padStart(2, "0");
        var g = Math.round(c.g * 255).toString(16).padStart(2, "0");
        var b = Math.round(c.b * 255).toString(16).padStart(2, "0");
        return ("#" + r + g + b).toUpperCase();
    }

    function setFromHsv(h, s, v) {
        if (root.disabled) return;
        root.updatingInternally = true;
        root.currentH = Math.max(0.0, Math.min(1.0, h));
        root.currentS = Math.max(0.0, Math.min(1.0, s));
        root.currentV = Math.max(0.0, Math.min(1.0, v));
        var col = Qt.hsva(root.currentH, root.currentS, root.currentV, 1.0);
        root.value = col;
        var hStr = colorToHex(col);
        root.hex = hStr;
        root.updatingInternally = false;
        root.colorChanged(col);
    }

    function setFromHex(hexStr) {
        if (root.disabled) return;
        var clean = hexStr.trim();
        if (!/^#?[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?$/.test(clean)) return;
        if (clean[0] !== "#") clean = "#" + clean;
        if (clean.length === 4) {
            clean = "#" + clean[1] + clean[1] + clean[2] + clean[2] + clean[3] + clean[3];
        }
        var col = Qt.color(clean);
        root.updatingInternally = true;
        root.value = col;
        root.hex = clean.toUpperCase();
        if (col.hsvHue >= 0) {
            root.currentH = col.hsvHue;
        }
        root.currentS = col.hsvSaturation;
        root.currentV = col.hsvValue;
        root.updatingInternally = false;
        root.colorChanged(col);
    }

    function setFromRgb(r, g, b) {
        if (root.disabled) return;
        var col = Qt.rgba(
            Math.max(0.0, Math.min(1.0, r / 255.0)),
            Math.max(0.0, Math.min(1.0, g / 255.0)),
            Math.max(0.0, Math.min(1.0, b / 255.0)),
            1.0
        );
        root.updatingInternally = true;
        root.value = col;
        var hStr = colorToHex(col);
        root.hex = hStr;
        if (col.hsvHue >= 0) {
            root.currentH = col.hsvHue;
        }
        root.currentS = col.hsvSaturation;
        root.currentV = col.hsvValue;
        root.updatingInternally = false;
        root.colorChanged(col);
    }

    // CMYK Math
    function rgbToCmyk(r, g, b) {
        var red = r / 255.0;
        var green = g / 255.0;
        var blue = b / 255.0;
        var k = 1.0 - Math.max(red, Math.max(green, blue));
        if (k >= 1.0) {
            return { c: 0, m: 0, y: 0, k: 100 };
        }
        return {
            c: Math.round(((1.0 - red - k) / (1.0 - k)) * 100),
            m: Math.round(((1.0 - green - k) / (1.0 - k)) * 100),
            y: Math.round(((1.0 - blue - k) / (1.0 - k)) * 100),
            k: Math.round(k * 100)
        };
    }

    function cmykToRgb(c, m, y, k) {
        var cd = clamp(c, 0, 100) / 100.0;
        var md = clamp(m, 0, 100) / 100.0;
        var yd = clamp(y, 0, 100) / 100.0;
        var kd = clamp(k, 0, 100) / 100.0;
        return {
            r: Math.round(255 * (1.0 - cd) * (1.0 - kd)),
            g: Math.round(255 * (1.0 - md) * (1.0 - kd)),
            b: Math.round(255 * (1.0 - yd) * (1.0 - kd))
        };
    }

    // CIELAB Math
    function srgbToLinear(val) {
        var norm = clamp(val, 0, 255) / 255.0;
        return norm <= 0.04045 ? norm / 12.92 : Math.pow((norm + 0.055) / 1.055, 2.4);
    }

    function linearToSrgb(val) {
        var norm = clamp(val, 0, 1);
        return Math.round((norm <= 0.0031308 ? norm * 12.92 : 1.055 * Math.pow(norm, 1.0 / 2.4) - 0.055) * 255);
    }

    function xyzToLabPivot(val) {
        return val > 0.008856 ? Math.pow(val, 1.0 / 3.0) : 7.787 * val + 16.0 / 116.0;
    }

    function labToXyzPivot(val) {
        var cubed = Math.pow(val, 3);
        return cubed > 0.008856 ? cubed : (val - 16.0 / 116.0) / 7.787;
    }

    function rgbToLab(r, g, b) {
        var red = srgbToLinear(r);
        var green = srgbToLinear(g);
        var blue = srgbToLinear(b);
        var x = (red * 0.4124564 + green * 0.3575761 + blue * 0.1804375) / 0.95047;
        var y = red * 0.2126729 + green * 0.7151522 + blue * 0.0721750;
        var z = (red * 0.0193339 + green * 0.1191920 + blue * 0.9503041) / 1.08883;
        var fx = xyzToLabPivot(x);
        var fy = xyzToLabPivot(y);
        var fz = xyzToLabPivot(z);
        return {
            l: Math.round(116.0 * fy - 16.0),
            a: Math.round(500.0 * (fx - fy)),
            b: Math.round(200.0 * (fy - fz))
        };
    }

    function labToRgb(l, a, b) {
        var fy = (clamp(l, 0, 100) + 16.0) / 116.0;
        var fx = fy + clamp(a, -128, 127) / 500.0;
        var fz = fy - clamp(b, -128, 127) / 200.0;
        var x = 0.95047 * labToXyzPivot(fx);
        var y = labToXyzPivot(fy);
        var z = 1.08883 * labToXyzPivot(fz);
        return {
            r: linearToSrgb(x * 3.2404542 + y * -1.5371385 + z * -0.4985314),
            g: linearToSrgb(x * -0.9692660 + y * 1.8760108 + z * 0.0415560),
            b: linearToSrgb(x * 0.0556434 + y * -0.2040259 + z * 1.0572252)
        };
    }

    onValueChanged: {
        if (!root.updatingInternally) {
            var hStr = colorToHex(root.value);
            root.hex = hStr;
            if (root.value.hsvHue >= 0) {
                root.currentH = root.value.hsvHue;
            }
            root.currentS = root.value.hsvSaturation;
            root.currentV = root.value.hsvValue;
        }
    }

    onHexChanged: {
        if (!root.updatingInternally) {
            root.setFromHex(root.hex);
        }
    }

    Component.onCompleted: {
        if (root.value) {
            var hStr = colorToHex(root.value);
            root.hex = hStr;
            if (root.value.hsvHue >= 0) {
                root.currentH = root.value.hsvHue;
            }
            root.currentS = root.value.hsvSaturation;
            root.currentV = root.value.hsvValue;
        }
    }

    // Component representing the color picker card
    Component {
        id: pickerCardComponent

        Rectangle {
            id: cardRect
            width: root.cardWidth
            implicitHeight: cardColumn.implicitHeight + 24
            height: implicitHeight
            radius: 8
            color: root.isDark ? ThemeTokens.panel : "#ffffff"
            border.color: ThemeTokens.border
            border.width: 1

            Column {
                id: cardColumn
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.top: parent.top
                anchors.margins: 12
                spacing: 10

                // 1. Preview Header
                Row {
                    width: parent.width
                    visible: root.showPreview
                    spacing: 10

                    Rectangle {
                        width: 32
                        height: 32
                        radius: 6
                        color: root.value
                        border.color: ThemeTokens.border
                        border.width: 1
                        anchors.verticalCenter: parent.verticalCenter
                    }

                    Column {
                        anchors.verticalCenter: parent.verticalCenter
                        spacing: 2
                        Text {
                            text: "Color"
                            color: ThemeTokens.text
                            font.pixelSize: 12
                            font.weight: Font.DemiBold
                        }
                        Text {
                            text: root.hex
                            color: ThemeTokens.subduedText
                            font.family: "monospace"
                            font.pixelSize: 11
                        }
                    }
                }

                // 2. View Tab Switcher (Square / Circle / Triangle / Swatches)
                Rectangle {
                    width: parent.width
                    height: 28
                    radius: 6
                    color: root.isDark ? Qt.rgba(1, 1, 1, 0.06) : Qt.rgba(0, 0, 0, 0.05)

                    Row {
                        anchors.fill: parent
                        anchors.margins: 2
                        spacing: 2

                        Repeater {
                            model: [
                                { id: "square", label: "Square" },
                                { id: "circle", label: "Circle" },
                                { id: "triangle", label: "Triangle" },
                                { id: "swatches", label: "Swatches" }
                            ]
                            Rectangle {
                                width: (parent.width - 6) / 4
                                height: parent.height
                                radius: 4
                                color: root.activePanel === modelData.id
                                    ? (root.isDark ? Qt.rgba(1, 1, 1, 0.15) : "#ffffff")
                                    : "transparent"
                                Text {
                                    anchors.centerIn: parent
                                    text: modelData.label
                                    font.pixelSize: root.isSm ? 10 : 11
                                    font.weight: root.activePanel === modelData.id ? Font.DemiBold : Font.Normal
                                    color: root.activePanel === modelData.id ? ThemeTokens.text : ThemeTokens.subduedText
                                }
                                MouseArea {
                                    anchors.fill: parent
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: root.activePanel = modelData.id
                                }
                            }
                        }
                    }
                }

                // 3. Central Panel Stage (Square, Circle, Triangle, Swatches)
                Item {
                    width: parent.width
                    height: root.stageSize

                    // 3A. Square View: Saturation / Value square inside circular HueRing
                    Item {
                        anchors.centerIn: parent
                        width: root.stageSize
                        height: root.stageSize
                        visible: root.activePanel === "square"

                        // Static Conic HueRing Canvas
                        Canvas {
                            id: squareHueRingCanvas
                            anchors.fill: parent
                            renderTarget: Canvas.Image

                            onPaint: {
                                var ctx = getContext("2d");
                                var cx = width * 0.5;
                                var cy = height * 0.5;
                                var outerR = width * 0.5;
                                var innerR = outerR - 16;
                                for (var a = 0; a < 360; a += 1) {
                                    var rad1 = (a - 90) * Math.PI / 180.0;
                                    var rad2 = (a + 1.5 - 90) * Math.PI / 180.0;
                                    ctx.beginPath();
                                    ctx.arc(cx, cy, outerR, rad1, rad2);
                                    ctx.arc(cx, cy, innerR, rad2, rad1, true);
                                    ctx.closePath();
                                    ctx.fillStyle = Qt.hsva(a / 360.0, 1.0, 1.0, 1.0);
                                    ctx.fill();
                                }
                            }
                            Component.onCompleted: requestPaint()
                        }

                        // Hue Ring Handle
                        Rectangle {
                            width: 14
                            height: 14
                            radius: 7
                            color: "#ffffff"
                            border.color: ThemeTokens.accent
                            border.width: 2
                            x: (parent.width * 0.5) + (parent.width * 0.5 - 8) * Math.cos((root.currentH * 360.0 - 90.0) * Math.PI / 180.0) - 7
                            y: (parent.height * 0.5) + (parent.height * 0.5 - 8) * Math.sin((root.currentH * 360.0 - 90.0) * Math.PI / 180.0) - 7
                        }

                        // Hue Ring Mouse Interaction
                        MouseArea {
                            anchors.fill: parent
                            enabled: !root.disabled
                            cursorShape: Qt.CrossCursor

                            function updateRingHue(mx, my) {
                                var cx = width * 0.5;
                                var cy = height * 0.5;
                                var dx = mx - cx;
                                var dy = my - cy;
                                var dist = Math.sqrt(dx * dx + dy * dy);
                                // If click is near the outer ring perimeter
                                if (dist >= (width * 0.5 - 24)) {
                                    var angle = Math.atan2(dy, dx) * 180.0 / Math.PI + 90.0;
                                    if (angle < 0) angle += 360.0;
                                    root.setFromHsv(angle / 360.0, root.currentS, root.currentV);
                                    return true;
                                }
                                return false;
                            }

                            onPressed: function(mouse) { updateRingHue(mouse.x, mouse.y); }
                            onPositionChanged: function(mouse) { if (pressed) updateRingHue(mouse.x, mouse.y); }
                        }

                        // Inner Saturation/Value Square
                        Rectangle {
                            id: squareArea
                            anchors.centerIn: parent
                            width: root.innerStageSize - 20
                            height: root.innerStageSize - 20
                            radius: 4
                            clip: true
                            color: Qt.hsva(root.currentH, 1.0, 1.0, 1.0)
                            border.color: ThemeTokens.border
                            border.width: 1

                            Rectangle {
                                anchors.fill: parent
                                gradient: Gradient {
                                    orientation: Gradient.Horizontal
                                    GradientStop { position: 0.0; color: "#ffffff" }
                                    GradientStop { position: 1.0; color: Qt.rgba(1, 1, 1, 0) }
                                }
                            }

                            Rectangle {
                                anchors.fill: parent
                                gradient: Gradient {
                                    orientation: Gradient.Vertical
                                    GradientStop { position: 0.0; color: Qt.rgba(0, 0, 0, 0) }
                                    GradientStop { position: 1.0; color: "#000000" }
                                }
                            }

                            Rectangle {
                                id: squareThumb
                                width: 12
                                height: 12
                                radius: 6
                                color: root.value
                                border.color: "#ffffff"
                                border.width: 2
                                x: Math.max(0, Math.min(parent.width - 12, root.currentS * (parent.width - 12)))
                                y: Math.max(0, Math.min(parent.height - 12, (1.0 - root.currentV) * (parent.height - 12)))
                            }

                            MouseArea {
                                anchors.fill: parent
                                enabled: !root.disabled
                                cursorShape: Qt.CrossCursor

                                function updateFromPos(mx, my) {
                                    var s = Math.max(0.0, Math.min(1.0, mx / (squareArea.width - 1)));
                                    var v = Math.max(0.0, Math.min(1.0, 1.0 - (my / (squareArea.height - 1))));
                                    root.setFromHsv(root.currentH, s, v);
                                }

                                onPressed: function(mouse) { updateFromPos(mouse.x, mouse.y); }
                                onPositionChanged: function(mouse) { if (pressed) updateFromPos(mouse.x, mouse.y); }
                            }
                        }
                    }

                    // 3B. Circle View: Color Wheel Disc
                    Item {
                        anchors.centerIn: parent
                        width: root.stageSize
                        height: root.stageSize
                        visible: root.activePanel === "circle"

                        Canvas {
                            id: wheelCanvas
                            anchors.fill: parent
                            renderTarget: Canvas.Image

                            onPaint: {
                                var ctx = getContext("2d");
                                var cx = width * 0.5;
                                var cy = height * 0.5;
                                var r = width * 0.5;
                                for (var a = 0; a < 360; a += 1) {
                                    var rad1 = (a - 90) * Math.PI / 180.0;
                                    var rad2 = (a + 1.5 - 90) * Math.PI / 180.0;
                                    var grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
                                    grad.addColorStop(0.0, "rgba(255, 255, 255, 1)");
                                    grad.addColorStop(1.0, Qt.hsva(a / 360.0, 1.0, 1.0, 1.0).toString());
                                    ctx.beginPath();
                                    ctx.moveTo(cx, cy);
                                    ctx.arc(cx, cy, r, rad1, rad2);
                                    ctx.closePath();
                                    ctx.fillStyle = grad;
                                    ctx.fill();
                                }
                            }
                            Component.onCompleted: requestPaint()
                        }

                        // Wheel Pointer Handle
                        Rectangle {
                            width: 14
                            height: 14
                            radius: 7
                            color: root.value
                            border.color: "#ffffff"
                            border.width: 2
                            x: (parent.width * 0.5) + (root.currentS * (parent.width * 0.5 - 7)) * Math.cos((root.currentH * 360.0 - 90.0) * Math.PI / 180.0) - 7
                            y: (parent.height * 0.5) + (root.currentS * (parent.height * 0.5 - 7)) * Math.sin((root.currentH * 360.0 - 90.0) * Math.PI / 180.0) - 7
                        }

                        MouseArea {
                            anchors.fill: parent
                            enabled: !root.disabled
                            cursorShape: Qt.CrossCursor

                            function updateFromWheel(mx, my) {
                                var cx = width * 0.5;
                                var cy = height * 0.5;
                                var r = width * 0.5;
                                var dx = mx - cx;
                                var dy = my - cy;
                                var dist = Math.min(r, Math.sqrt(dx * dx + dy * dy));
                                var sat = dist / r;
                                var angle = Math.atan2(dy, dx) * 180.0 / Math.PI + 90.0;
                                if (angle < 0) angle += 360.0;
                                root.setFromHsv(angle / 360.0, sat, root.currentV < 0.05 ? 1.0 : root.currentV);
                            }

                            onPressed: function(mouse) { updateFromWheel(mouse.x, mouse.y); }
                            onPositionChanged: function(mouse) { if (pressed) updateFromWheel(mouse.x, mouse.y); }
                        }
                    }

                    // 3C. Triangle View: HSV Triangle inside circular HueRing
                    Item {
                        anchors.centerIn: parent
                        width: root.stageSize
                        height: root.stageSize
                        visible: root.activePanel === "triangle"

                        // Static Conic HueRing Canvas
                        Canvas {
                            id: triangleHueRingCanvas
                            anchors.fill: parent
                            renderTarget: Canvas.Image

                            onPaint: {
                                var ctx = getContext("2d");
                                var cx = width * 0.5;
                                var cy = height * 0.5;
                                var outerR = width * 0.5;
                                var innerR = outerR - 16;
                                for (var a = 0; a < 360; a += 1) {
                                    var rad1 = (a - 90) * Math.PI / 180.0;
                                    var rad2 = (a + 1.5 - 90) * Math.PI / 180.0;
                                    ctx.beginPath();
                                    ctx.arc(cx, cy, outerR, rad1, rad2);
                                    ctx.arc(cx, cy, innerR, rad2, rad1, true);
                                    ctx.closePath();
                                    ctx.fillStyle = Qt.hsva(a / 360.0, 1.0, 1.0, 1.0);
                                    ctx.fill();
                                }
                            }
                            Component.onCompleted: requestPaint()
                        }

                        // Orbiting handle
                        Rectangle {
                            width: 14
                            height: 14
                            radius: 7
                            color: "#ffffff"
                            border.color: ThemeTokens.accent
                            border.width: 2
                            x: (parent.width * 0.5) + (parent.width * 0.5 - 8) * Math.cos((root.currentH * 360.0 - 90.0) * Math.PI / 180.0) - 7
                            y: (parent.height * 0.5) + (parent.height * 0.5 - 8) * Math.sin((root.currentH * 360.0 - 90.0) * Math.PI / 180.0) - 7
                        }

                        // Hue Ring Drag
                        MouseArea {
                            anchors.fill: parent
                            enabled: !root.disabled
                            cursorShape: Qt.CrossCursor

                            function updateRingHue(mx, my) {
                                var cx = width * 0.5;
                                var cy = height * 0.5;
                                var dx = mx - cx;
                                var dy = my - cy;
                                var dist = Math.sqrt(dx * dx + dy * dy);
                                if (dist >= (width * 0.5 - 24)) {
                                    var angle = Math.atan2(dy, dx) * 180.0 / Math.PI + 90.0;
                                    if (angle < 0) angle += 360.0;
                                    root.setFromHsv(angle / 360.0, root.currentS, root.currentV);
                                    return true;
                                }
                                return false;
                            }

                            onPressed: function(mouse) { updateRingHue(mouse.x, mouse.y); }
                            onPositionChanged: function(mouse) { if (pressed) updateRingHue(mouse.x, mouse.y); }
                        }

                        // Inner Triangle Canvas
                        Canvas {
                            id: triangleCanvas
                            anchors.centerIn: parent
                            width: root.innerStageSize - 16
                            height: root.innerStageSize - 20

                            onPaint: {
                                var ctx = getContext("2d");
                                ctx.reset();
                                var w = width;
                                var h = height;

                                var pTopX = w * 0.5;
                                var pTopY = 4;
                                var pLeftX = 6;
                                var pLeftY = h - 6;
                                var pRightX = w - 6;
                                var pRightY = h - 6;

                                ctx.beginPath();
                                ctx.moveTo(pTopX, pTopY);
                                ctx.lineTo(pLeftX, pLeftY);
                                ctx.lineTo(pRightX, pRightY);
                                ctx.closePath();
                                ctx.fillStyle = Qt.hsva(root.currentH, 1.0, 1.0, 1.0);
                                ctx.fill();

                                var gradWhite = ctx.createLinearGradient(pLeftX, pLeftY, pTopX, pTopY);
                                gradWhite.addColorStop(0.0, "rgba(255,255,255,1)");
                                gradWhite.addColorStop(1.0, "rgba(255,255,255,0)");
                                ctx.fillStyle = gradWhite;
                                ctx.fill();

                                var gradBlack = ctx.createLinearGradient(pRightX, pRightY, pTopX, pTopY);
                                gradBlack.addColorStop(0.0, "rgba(0,0,0,1)");
                                gradBlack.addColorStop(1.0, "rgba(0,0,0,0)");
                                ctx.fillStyle = gradBlack;
                                ctx.fill();

                                ctx.strokeStyle = ThemeTokens.border;
                                ctx.lineWidth = 1;
                                ctx.stroke();
                            }

                            Connections {
                                target: root
                                function onCurrentHChanged() {
                                    triangleCanvas.requestPaint();
                                }
                            }

                            Rectangle {
                                width: 12
                                height: 12
                                radius: 6
                                color: root.value
                                border.color: "#ffffff"
                                border.width: 2
                                x: Math.max(6, Math.min(parent.width - 18, (parent.width * 0.5) + (root.currentS - 0.5) * (parent.width - 24)))
                                y: Math.max(4, Math.min(parent.height - 16, (1.0 - root.currentV) * (parent.height - 20)))
                            }

                            MouseArea {
                                anchors.fill: parent
                                enabled: !root.disabled
                                cursorShape: Qt.CrossCursor

                                function updateFromTri(mx, my) {
                                    var s = Math.max(0.0, Math.min(1.0, mx / parent.width));
                                    var v = Math.max(0.0, Math.min(1.0, 1.0 - (my / parent.height)));
                                    root.setFromHsv(root.currentH, s, v);
                                }

                                onPressed: function(mouse) { updateFromTri(mouse.x, mouse.y); }
                                onPositionChanged: function(mouse) { if (pressed) updateFromTri(mouse.x, mouse.y); }
                            }
                        }
                    }

                    // 3D. Swatches View: Palette Grid
                    Item {
                        anchors.fill: parent
                        visible: root.activePanel === "swatches"

                        Grid {
                            anchors.centerIn: parent
                            width: parent.width - 8
                            columns: 8
                            spacing: 4

                            Repeater {
                                model: root.presetColors
                                Rectangle {
                                    width: (parent.width - 28) / 8
                                    height: 22
                                    radius: 4
                                    color: modelData
                                    border.color: modelData.toUpperCase() === root.hex.toUpperCase() ? ThemeTokens.accent : ThemeTokens.border
                                    border.width: modelData.toUpperCase() === root.hex.toUpperCase() ? 2 : 1

                                    MouseArea {
                                        anchors.fill: parent
                                        cursorShape: Qt.PointingHandCursor
                                        onClicked: root.setFromHex(modelData)
                                    }
                                }
                            }
                        }
                    }
                }

                // Quick preset swatches row (when not on swatches tab)
                Flow {
                    width: parent.width
                    spacing: 4
                    visible: root.showSwatches && root.activePanel !== "swatches"

                    Repeater {
                        model: root.presetColors.slice(0, 16)
                        Rectangle {
                            width: (parent.width - 32) / 8
                            height: 18
                            radius: 3
                            color: modelData
                            border.color: modelData.toUpperCase() === root.hex.toUpperCase() ? ThemeTokens.accent : ThemeTokens.border
                            border.width: modelData.toUpperCase() === root.hex.toUpperCase() ? 2 : 1

                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                onClicked: root.setFromHex(modelData)
                            }
                        }
                    }
                }

                // 4. Hex Input Row with Copy Button
                Row {
                    width: parent.width
                    height: 28
                    spacing: 8
                    visible: root.showHex

                    Text {
                        text: "HEX"
                        color: ThemeTokens.subduedText
                        font.pixelSize: 11
                        font.weight: Font.DemiBold
                        anchors.verticalCenter: parent.verticalCenter
                    }

                    Rectangle {
                        width: parent.width - 40
                        height: 28
                        radius: 4
                        color: root.isDark ? Qt.rgba(1, 1, 1, 0.05) : Qt.rgba(0, 0, 0, 0.03)
                        border.color: hexInput.activeFocus ? ThemeTokens.accent : ThemeTokens.border
                        border.width: 1

                        TextInput {
                            id: hexInput
                            anchors.left: parent.left
                            anchors.right: copyBtn.left
                            anchors.top: parent.top
                            anchors.bottom: parent.bottom
                            anchors.leftMargin: 8
                            anchors.rightMargin: 4
                            verticalAlignment: TextInput.AlignVCenter
                            text: root.hex
                            font.family: "monospace"
                            font.pixelSize: 12
                            color: ThemeTokens.text
                            enabled: !root.disabled
                            selectByMouse: true

                            onEditingFinished: {
                                root.setFromHex(hexInput.text);
                            }
                            onAccepted: {
                                root.setFromHex(hexInput.text);
                            }
                        }

                        // Copy button
                        Rectangle {
                            id: copyBtn
                            width: 24
                            height: 24
                            radius: 4
                            anchors.right: parent.right
                            anchors.rightMargin: 2
                            anchors.verticalCenter: parent.verticalCenter
                            color: copyMouse.containsMouse ? (root.isDark ? Qt.rgba(1, 1, 1, 0.1) : Qt.rgba(0, 0, 0, 0.06)) : "transparent"

                            Text {
                                anchors.centerIn: parent
                                text: root.showCopied ? "✓" : "📋"
                                font.pixelSize: 11
                                color: root.showCopied ? "#10b981" : ThemeTokens.subduedText
                            }

                            MouseArea {
                                id: copyMouse
                                anchors.fill: parent
                                hoverEnabled: true
                                cursorShape: Qt.PointingHandCursor
                                onClicked: {
                                    root.showCopied = true;
                                    copiedTimer.restart();
                                }
                            }

                            Timer {
                                id: copiedTimer
                                interval: 1500
                                onTriggered: root.showCopied = false
                            }
                        }
                    }
                }

                // 5. Channel Sliders Section
                Column {
                    width: parent.width
                    spacing: 8

                    // Active Channel Groups
                    Column {
                        width: parent.width
                        spacing: 6

                        // RGB Channel Group
                        Column {
                            width: parent.width
                            spacing: 4
                            visible: root.showRgbSliders

                            // R
                            Row {
                                width: parent.width
                                spacing: 6
                                Text { text: "R"; width: 14; color: "#ef4444"; font.pixelSize: 11; font.weight: Font.Bold; anchors.verticalCenter: parent.verticalCenter }
                                Slider {
                                    id: rSlider
                                    width: parent.width - 64
                                    from: 0; to: 255; stepSize: 1
                                    value: Math.round(root.value.r * 255)
                                    anchors.verticalCenter: parent.verticalCenter
                                    onMoved: root.setFromRgb(value, gSlider.value, bSlider.value)
                                }
                                Rectangle {
                                    width: 36; height: 20; radius: 3
                                    color: root.isDark ? Qt.rgba(1, 1, 1, 0.06) : Qt.rgba(0, 0, 0, 0.04)
                                    border.color: ThemeTokens.border; border.width: 1
                                    anchors.verticalCenter: parent.verticalCenter
                                    TextInput {
                                        anchors.fill: parent; verticalAlignment: TextInput.AlignVCenter; horizontalAlignment: TextInput.AlignHCenter
                                        text: Math.round(rSlider.value).toString(); font.pixelSize: 10; color: ThemeTokens.text
                                        onEditingFinished: root.setFromRgb(parseInt(text) || 0, gSlider.value, bSlider.value)
                                    }
                                }
                            }

                            // G
                            Row {
                                width: parent.width
                                spacing: 6
                                Text { text: "G"; width: 14; color: "#22c55e"; font.pixelSize: 11; font.weight: Font.Bold; anchors.verticalCenter: parent.verticalCenter }
                                Slider {
                                    id: gSlider
                                    width: parent.width - 64
                                    from: 0; to: 255; stepSize: 1
                                    value: Math.round(root.value.g * 255)
                                    anchors.verticalCenter: parent.verticalCenter
                                    onMoved: root.setFromRgb(rSlider.value, value, bSlider.value)
                                }
                                Rectangle {
                                    width: 36; height: 20; radius: 3
                                    color: root.isDark ? Qt.rgba(1, 1, 1, 0.06) : Qt.rgba(0, 0, 0, 0.04)
                                    border.color: ThemeTokens.border; border.width: 1
                                    anchors.verticalCenter: parent.verticalCenter
                                    TextInput {
                                        anchors.fill: parent; verticalAlignment: TextInput.AlignVCenter; horizontalAlignment: TextInput.AlignHCenter
                                        text: Math.round(gSlider.value).toString(); font.pixelSize: 10; color: ThemeTokens.text
                                        onEditingFinished: root.setFromRgb(rSlider.value, parseInt(text) || 0, bSlider.value)
                                    }
                                }
                            }

                            // B
                            Row {
                                width: parent.width
                                spacing: 6
                                Text { text: "B"; width: 14; color: "#3b82f6"; font.pixelSize: 11; font.weight: Font.Bold; anchors.verticalCenter: parent.verticalCenter }
                                Slider {
                                    id: bSlider
                                    width: parent.width - 64
                                    from: 0; to: 255; stepSize: 1
                                    value: Math.round(root.value.b * 255)
                                    anchors.verticalCenter: parent.verticalCenter
                                    onMoved: root.setFromRgb(rSlider.value, gSlider.value, value)
                                }
                                Rectangle {
                                    width: 36; height: 20; radius: 3
                                    color: root.isDark ? Qt.rgba(1, 1, 1, 0.06) : Qt.rgba(0, 0, 0, 0.04)
                                    border.color: ThemeTokens.border; border.width: 1
                                    anchors.verticalCenter: parent.verticalCenter
                                    TextInput {
                                        anchors.fill: parent; verticalAlignment: TextInput.AlignVCenter; horizontalAlignment: TextInput.AlignHCenter
                                        text: Math.round(bSlider.value).toString(); font.pixelSize: 10; color: ThemeTokens.text
                                        onEditingFinished: root.setFromRgb(rSlider.value, gSlider.value, parseInt(text) || 0)
                                    }
                                }
                            }
                        }

                        // HSV Channel Group
                        Column {
                            width: parent.width
                            spacing: 4
                            visible: root.showHsvSliders

                            // H
                            Row {
                                width: parent.width
                                spacing: 6
                                Text { text: "H"; width: 14; color: ThemeTokens.subduedText; font.pixelSize: 11; font.weight: Font.Bold; anchors.verticalCenter: parent.verticalCenter }
                                Slider {
                                    id: hSlider
                                    width: parent.width - 64
                                    from: 0; to: 360; stepSize: 1
                                    value: Math.round(root.currentH * 360)
                                    anchors.verticalCenter: parent.verticalCenter
                                    onMoved: root.setFromHsv(value / 360.0, root.currentS, root.currentV)
                                }
                                Rectangle {
                                    width: 36; height: 20; radius: 3
                                    color: root.isDark ? Qt.rgba(1, 1, 1, 0.06) : Qt.rgba(0, 0, 0, 0.04)
                                    border.color: ThemeTokens.border; border.width: 1
                                    anchors.verticalCenter: parent.verticalCenter
                                    TextInput {
                                        anchors.fill: parent; verticalAlignment: TextInput.AlignVCenter; horizontalAlignment: TextInput.AlignHCenter
                                        text: Math.round(hSlider.value).toString(); font.pixelSize: 10; color: ThemeTokens.text
                                        onEditingFinished: root.setFromHsv((parseInt(text) || 0) / 360.0, root.currentS, root.currentV)
                                    }
                                }
                            }

                            // S
                            Row {
                                width: parent.width
                                spacing: 6
                                Text { text: "S"; width: 14; color: ThemeTokens.subduedText; font.pixelSize: 11; font.weight: Font.Bold; anchors.verticalCenter: parent.verticalCenter }
                                Slider {
                                    id: sSlider
                                    width: parent.width - 64
                                    from: 0; to: 100; stepSize: 1
                                    value: Math.round(root.currentS * 100)
                                    anchors.verticalCenter: parent.verticalCenter
                                    onMoved: root.setFromHsv(root.currentH, value / 100.0, root.currentV)
                                }
                                Rectangle {
                                    width: 36; height: 20; radius: 3
                                    color: root.isDark ? Qt.rgba(1, 1, 1, 0.06) : Qt.rgba(0, 0, 0, 0.04)
                                    border.color: ThemeTokens.border; border.width: 1
                                    anchors.verticalCenter: parent.verticalCenter
                                    TextInput {
                                        anchors.fill: parent; verticalAlignment: TextInput.AlignVCenter; horizontalAlignment: TextInput.AlignHCenter
                                        text: Math.round(sSlider.value).toString(); font.pixelSize: 10; color: ThemeTokens.text
                                        onEditingFinished: root.setFromHsv(root.currentH, (parseInt(text) || 0) / 100.0, root.currentV)
                                    }
                                }
                            }

                            // V
                            Row {
                                width: parent.width
                                spacing: 6
                                Text { text: "V"; width: 14; color: ThemeTokens.subduedText; font.pixelSize: 11; font.weight: Font.Bold; anchors.verticalCenter: parent.verticalCenter }
                                Slider {
                                    id: vSlider
                                    width: parent.width - 64
                                    from: 0; to: 100; stepSize: 1
                                    value: Math.round(root.currentV * 100)
                                    anchors.verticalCenter: parent.verticalCenter
                                    onMoved: root.setFromHsv(root.currentH, root.currentS, value / 100.0)
                                }
                                Rectangle {
                                    width: 36; height: 20; radius: 3
                                    color: root.isDark ? Qt.rgba(1, 1, 1, 0.06) : Qt.rgba(0, 0, 0, 0.04)
                                    border.color: ThemeTokens.border; border.width: 1
                                    anchors.verticalCenter: parent.verticalCenter
                                    TextInput {
                                        anchors.fill: parent; verticalAlignment: TextInput.AlignVCenter; horizontalAlignment: TextInput.AlignHCenter
                                        text: Math.round(vSlider.value).toString(); font.pixelSize: 10; color: ThemeTokens.text
                                        onEditingFinished: root.setFromHsv(root.currentH, root.currentS, (parseInt(text) || 0) / 100.0)
                                    }
                                }
                            }
                        }

                        // CMYK Channel Group
                        Column {
                            width: parent.width
                            spacing: 4
                            visible: root.showCmykSliders

                            property var cmykVal: root.rgbToCmyk(Math.round(root.value.r * 255), Math.round(root.value.g * 255), Math.round(root.value.b * 255))

                            // C
                            Row {
                                width: parent.width
                                spacing: 6
                                Text { text: "C"; width: 14; color: "#06b6d4"; font.pixelSize: 11; font.weight: Font.Bold; anchors.verticalCenter: parent.verticalCenter }
                                Slider {
                                    id: cSlider
                                    width: parent.width - 64
                                    from: 0; to: 100; stepSize: 1
                                    value: parent.parent.cmykVal.c
                                    anchors.verticalCenter: parent.verticalCenter
                                    onMoved: {
                                        var rgbRes = root.cmykToRgb(value, mSlider.value, ySlider.value, kSlider.value);
                                        root.setFromRgb(rgbRes.r, rgbRes.g, rgbRes.b);
                                    }
                                }
                                Rectangle {
                                    width: 36; height: 20; radius: 3
                                    color: root.isDark ? Qt.rgba(1, 1, 1, 0.06) : Qt.rgba(0, 0, 0, 0.04)
                                    border.color: ThemeTokens.border; border.width: 1
                                    anchors.verticalCenter: parent.verticalCenter
                                    TextInput {
                                        anchors.fill: parent; verticalAlignment: TextInput.AlignVCenter; horizontalAlignment: TextInput.AlignHCenter
                                        text: Math.round(cSlider.value).toString(); font.pixelSize: 10; color: ThemeTokens.text
                                        onEditingFinished: {
                                            var rgbRes = root.cmykToRgb(parseInt(text) || 0, mSlider.value, ySlider.value, kSlider.value);
                                            root.setFromRgb(rgbRes.r, rgbRes.g, rgbRes.b);
                                        }
                                    }
                                }
                            }

                            // M
                            Row {
                                width: parent.width
                                spacing: 6
                                Text { text: "M"; width: 14; color: "#ec4899"; font.pixelSize: 11; font.weight: Font.Bold; anchors.verticalCenter: parent.verticalCenter }
                                Slider {
                                    id: mSlider
                                    width: parent.width - 64
                                    from: 0; to: 100; stepSize: 1
                                    value: parent.parent.cmykVal.m
                                    anchors.verticalCenter: parent.verticalCenter
                                    onMoved: {
                                        var rgbRes = root.cmykToRgb(cSlider.value, value, ySlider.value, kSlider.value);
                                        root.setFromRgb(rgbRes.r, rgbRes.g, rgbRes.b);
                                    }
                                }
                                Rectangle {
                                    width: 36; height: 20; radius: 3
                                    color: root.isDark ? Qt.rgba(1, 1, 1, 0.06) : Qt.rgba(0, 0, 0, 0.04)
                                    border.color: ThemeTokens.border; border.width: 1
                                    anchors.verticalCenter: parent.verticalCenter
                                    TextInput {
                                        anchors.fill: parent; verticalAlignment: TextInput.AlignVCenter; horizontalAlignment: TextInput.AlignHCenter
                                        text: Math.round(mSlider.value).toString(); font.pixelSize: 10; color: ThemeTokens.text
                                        onEditingFinished: {
                                            var rgbRes = root.cmykToRgb(cSlider.value, parseInt(text) || 0, ySlider.value, kSlider.value);
                                            root.setFromRgb(rgbRes.r, rgbRes.g, rgbRes.b);
                                        }
                                    }
                                }
                            }

                            // Y
                            Row {
                                width: parent.width
                                spacing: 6
                                Text { text: "Y"; width: 14; color: "#eab308"; font.pixelSize: 11; font.weight: Font.Bold; anchors.verticalCenter: parent.verticalCenter }
                                Slider {
                                    id: ySlider
                                    width: parent.width - 64
                                    from: 0; to: 100; stepSize: 1
                                    value: parent.parent.cmykVal.y
                                    anchors.verticalCenter: parent.verticalCenter
                                    onMoved: {
                                        var rgbRes = root.cmykToRgb(cSlider.value, mSlider.value, value, kSlider.value);
                                        root.setFromRgb(rgbRes.r, rgbRes.g, rgbRes.b);
                                    }
                                }
                                Rectangle {
                                    width: 36; height: 20; radius: 3
                                    color: root.isDark ? Qt.rgba(1, 1, 1, 0.06) : Qt.rgba(0, 0, 0, 0.04)
                                    border.color: ThemeTokens.border; border.width: 1
                                    anchors.verticalCenter: parent.verticalCenter
                                    TextInput {
                                        anchors.fill: parent; verticalAlignment: TextInput.AlignVCenter; horizontalAlignment: TextInput.AlignHCenter
                                        text: Math.round(ySlider.value).toString(); font.pixelSize: 10; color: ThemeTokens.text
                                        onEditingFinished: {
                                            var rgbRes = root.cmykToRgb(cSlider.value, mSlider.value, parseInt(text) || 0, kSlider.value);
                                            root.setFromRgb(rgbRes.r, rgbRes.g, rgbRes.b);
                                        }
                                    }
                                }
                            }

                            // K
                            Row {
                                width: parent.width
                                spacing: 6
                                Text { text: "K"; width: 14; color: ThemeTokens.text; font.pixelSize: 11; font.weight: Font.Bold; anchors.verticalCenter: parent.verticalCenter }
                                Slider {
                                    id: kSlider
                                    width: parent.width - 64
                                    from: 0; to: 100; stepSize: 1
                                    value: parent.parent.cmykVal.k
                                    anchors.verticalCenter: parent.verticalCenter
                                    onMoved: {
                                        var rgbRes = root.cmykToRgb(cSlider.value, mSlider.value, ySlider.value, value);
                                        root.setFromRgb(rgbRes.r, rgbRes.g, rgbRes.b);
                                    }
                                }
                                Rectangle {
                                    width: 36; height: 20; radius: 3
                                    color: root.isDark ? Qt.rgba(1, 1, 1, 0.06) : Qt.rgba(0, 0, 0, 0.04)
                                    border.color: ThemeTokens.border; border.width: 1
                                    anchors.verticalCenter: parent.verticalCenter
                                    TextInput {
                                        anchors.fill: parent; verticalAlignment: TextInput.AlignVCenter; horizontalAlignment: TextInput.AlignHCenter
                                        text: Math.round(kSlider.value).toString(); font.pixelSize: 10; color: ThemeTokens.text
                                        onEditingFinished: {
                                            var rgbRes = root.cmykToRgb(cSlider.value, mSlider.value, ySlider.value, parseInt(text) || 0);
                                            root.setFromRgb(rgbRes.r, rgbRes.g, rgbRes.b);
                                        }
                                    }
                                }
                            }
                        }

                        // LAB Channel Group
                        Column {
                            width: parent.width
                            spacing: 4
                            visible: root.showLabSliders

                            property var labVal: root.rgbToLab(Math.round(root.value.r * 255), Math.round(root.value.g * 255), Math.round(root.value.b * 255))

                            // L
                            Row {
                                width: parent.width
                                spacing: 6
                                Text { text: "L"; width: 14; color: ThemeTokens.subduedText; font.pixelSize: 11; font.weight: Font.Bold; anchors.verticalCenter: parent.verticalCenter }
                                Slider {
                                    id: labLSlider
                                    width: parent.width - 64
                                    from: 0; to: 100; stepSize: 1
                                    value: parent.parent.labVal.l
                                    anchors.verticalCenter: parent.verticalCenter
                                    onMoved: {
                                        var rgbRes = root.labToRgb(value, labASlider.value, labBSlider.value);
                                        root.setFromRgb(rgbRes.r, rgbRes.g, rgbRes.b);
                                    }
                                }
                                Rectangle {
                                    width: 36; height: 20; radius: 3
                                    color: root.isDark ? Qt.rgba(1, 1, 1, 0.06) : Qt.rgba(0, 0, 0, 0.04)
                                    border.color: ThemeTokens.border; border.width: 1
                                    anchors.verticalCenter: parent.verticalCenter
                                    TextInput {
                                        anchors.fill: parent; verticalAlignment: TextInput.AlignVCenter; horizontalAlignment: TextInput.AlignHCenter
                                        text: Math.round(labLSlider.value).toString(); font.pixelSize: 10; color: ThemeTokens.text
                                        onEditingFinished: {
                                            var rgbRes = root.labToRgb(parseInt(text) || 0, labASlider.value, labBSlider.value);
                                            root.setFromRgb(rgbRes.r, rgbRes.g, rgbRes.b);
                                        }
                                    }
                                }
                            }

                            // A
                            Row {
                                width: parent.width
                                spacing: 6
                                Text { text: "A"; width: 14; color: ThemeTokens.subduedText; font.pixelSize: 11; font.weight: Font.Bold; anchors.verticalCenter: parent.verticalCenter }
                                Slider {
                                    id: labASlider
                                    width: parent.width - 64
                                    from: -128; to: 127; stepSize: 1
                                    value: parent.parent.labVal.a
                                    anchors.verticalCenter: parent.verticalCenter
                                    onMoved: {
                                        var rgbRes = root.labToRgb(labLSlider.value, value, labBSlider.value);
                                        root.setFromRgb(rgbRes.r, rgbRes.g, rgbRes.b);
                                    }
                                }
                                Rectangle {
                                    width: 36; height: 20; radius: 3
                                    color: root.isDark ? Qt.rgba(1, 1, 1, 0.06) : Qt.rgba(0, 0, 0, 0.04)
                                    border.color: ThemeTokens.border; border.width: 1
                                    anchors.verticalCenter: parent.verticalCenter
                                    TextInput {
                                        anchors.fill: parent; verticalAlignment: TextInput.AlignVCenter; horizontalAlignment: TextInput.AlignHCenter
                                        text: Math.round(labASlider.value).toString(); font.pixelSize: 10; color: ThemeTokens.text
                                        onEditingFinished: {
                                            var rgbRes = root.labToRgb(labLSlider.value, parseInt(text) || 0, labBSlider.value);
                                            root.setFromRgb(rgbRes.r, rgbRes.g, rgbRes.b);
                                        }
                                    }
                                }
                            }

                            // B
                            Row {
                                width: parent.width
                                spacing: 6
                                Text { text: "B"; width: 14; color: ThemeTokens.subduedText; font.pixelSize: 11; font.weight: Font.Bold; anchors.verticalCenter: parent.verticalCenter }
                                Slider {
                                    id: labBSlider
                                    width: parent.width - 64
                                    from: -128; to: 127; stepSize: 1
                                    value: parent.parent.labVal.b
                                    anchors.verticalCenter: parent.verticalCenter
                                    onMoved: {
                                        var rgbRes = root.labToRgb(labLSlider.value, labASlider.value, value);
                                        root.setFromRgb(rgbRes.r, rgbRes.g, rgbRes.b);
                                    }
                                }
                                Rectangle {
                                    width: 36; height: 20; radius: 3
                                    color: root.isDark ? Qt.rgba(1, 1, 1, 0.06) : Qt.rgba(0, 0, 0, 0.04)
                                    border.color: ThemeTokens.border; border.width: 1
                                    anchors.verticalCenter: parent.verticalCenter
                                    TextInput {
                                        anchors.fill: parent; verticalAlignment: TextInput.AlignVCenter; horizontalAlignment: TextInput.AlignHCenter
                                        text: Math.round(labBSlider.value).toString(); font.pixelSize: 10; color: ThemeTokens.text
                                        onEditingFinished: {
                                            var rgbRes = root.labToRgb(labLSlider.value, labASlider.value, parseInt(text) || 0);
                                            root.setFromRgb(rgbRes.r, rgbRes.g, rgbRes.b);
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Independent Multi-Channel Toggle Group Buttons
                    Row {
                        width: parent.width
                        height: 26
                        spacing: 4

                        Repeater {
                            model: [
                                { label: "RGB", active: root.showRgbSliders, toggle: function() { root.showRgbSliders = !root.showRgbSliders; } },
                                { label: "HSV", active: root.showHsvSliders, toggle: function() { root.showHsvSliders = !root.showHsvSliders; } },
                                { label: "CMYK", active: root.showCmykSliders, toggle: function() { root.showCmykSliders = !root.showCmykSliders; } },
                                { label: "LAB", active: root.showLabSliders, toggle: function() { root.showLabSliders = !root.showLabSliders; } }
                            ]

                            Rectangle {
                                width: (parent.width - 12) / 4
                                height: parent.height
                                radius: 4
                                color: modelData.active
                                    ? (root.isDark ? Qt.rgba(1, 1, 1, 0.16) : Qt.rgba(0, 0, 0, 0.08))
                                    : "transparent"
                                border.color: modelData.active ? ThemeTokens.accent : ThemeTokens.border
                                border.width: 1

                                Text {
                                    anchors.centerIn: parent
                                    text: modelData.label
                                    font.pixelSize: 10
                                    font.weight: modelData.active ? Font.DemiBold : Font.Normal
                                    color: modelData.active ? ThemeTokens.text : ThemeTokens.subduedText
                                }

                                MouseArea {
                                    anchors.fill: parent
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: modelData.toggle()
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // Popover Trigger Button
    Rectangle {
        id: popoverTrigger
        visible: root.mode === "popover"
        implicitWidth: root.isSm ? 110 : 124
        implicitHeight: root.isSm ? 32 : 36
        radius: 6
        color: root.disabled ? ThemeTokens.disabled : (triggerMouse.containsMouse ? Qt.rgba(1, 1, 1, 0.08) : "transparent")
        border.color: ThemeTokens.border
        border.width: 1

        Row {
            anchors.centerIn: parent
            spacing: 8

            Rectangle {
                width: 16
                height: 16
                radius: 8
                color: root.value
                border.color: ThemeTokens.border
                border.width: 1
                anchors.verticalCenter: parent.verticalCenter
            }

            Text {
                text: root.hex
                color: ThemeTokens.text
                font.family: "monospace"
                font.pixelSize: root.isSm ? 11 : 12
                font.weight: Font.DemiBold
                anchors.verticalCenter: parent.verticalCenter
            }

            Text {
                text: "▾"
                color: ThemeTokens.subduedText
                font.pixelSize: 10
                anchors.verticalCenter: parent.verticalCenter
            }
        }

        MouseArea {
            id: triggerMouse
            anchors.fill: parent
            enabled: !root.disabled
            cursorShape: root.disabled ? Qt.ForbiddenCursor : Qt.PointingHandCursor
            hoverEnabled: !root.disabled
            onClicked: {
                colorPopup.open();
            }
        }
    }

    // Popover Floating Dropdown
    Popup {
        id: colorPopup
        y: popoverTrigger.height + 4
        closePolicy: Popup.CloseOnEscape | Popup.CloseOnPressOutside
        padding: 0
        background: Item {}

        Loader {
            sourceComponent: pickerCardComponent
            width: item ? item.width : root.cardWidth
            height: item ? item.height : 0
        }
    }

    // Inline Card Loader
    Loader {
        id: panelLoader
        visible: root.mode === "inline"
        width: item ? item.width : root.cardWidth
        height: item ? item.height : 0
        sourceComponent: pickerCardComponent
    }
}

