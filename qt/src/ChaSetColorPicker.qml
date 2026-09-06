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
    property bool movable: false
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

    // Movable drag offsets
    property real dragOffsetX: 0
    property real dragOffsetY: 0

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

    readonly property var currentCmyk: root.rgbToCmyk(Math.round(root.value.r * 255), Math.round(root.value.g * 255), Math.round(root.value.b * 255))
    readonly property var currentLab: root.rgbToLab(Math.round(root.value.r * 255), Math.round(root.value.g * 255), Math.round(root.value.b * 255))

    readonly property bool isDark: ThemeTokens.dark
    readonly property bool isSm: root.size === "sm"
    readonly property int cardWidth: isSm ? 280 : 320
    readonly property int stageSize: isSm ? 200 : 236
    readonly property int ringThickness: isSm ? 16 : 20
    readonly property int innerStageSize: stageSize - ringThickness * 2
    readonly property int squareSize: Math.floor(innerStageSize * 0.7071)
    readonly property real ringHandleRadius: (stageSize - ringThickness) * 0.5

    // Dynamic slider density metrics
    readonly property int activeSliderCount: (root.showRgbSliders ? 3 : 0) +
                                             (root.showHsvSliders ? 3 : 0) +
                                             (root.showCmykSliders ? 4 : 0) +
                                             (root.showLabSliders ? 3 : 0)

    readonly property string sliderDensity: activeSliderCount >= 8 ? "dense" :
                                            activeSliderCount >= 5 ? "compact" : "spacious"

    readonly property int sliderRowHeight: sliderDensity === "dense" ? (isSm ? 16 : 18) :
                                           sliderDensity === "compact" ? (isSm ? 19 : 22) : (isSm ? 22 : 26)

    readonly property real sliderTrackHeight: sliderDensity === "dense" ? (isSm ? 3.0 : 3.5) :
                                              sliderDensity === "compact" ? (isSm ? 4.5 : 5.5) : (isSm ? 6.0 : 8.0)

    readonly property int sliderThumbSize: sliderDensity === "dense" ? (isSm ? 9 : 10) :
                                           sliderDensity === "compact" ? (isSm ? 11 : 13) : (isSm ? 14 : 16)

    readonly property int sliderLabelFontSize: sliderDensity === "dense" ? (isSm ? 8 : 9) :
                                               sliderDensity === "compact" ? (isSm ? 9 : 10) : (isSm ? 10 : 11)

    readonly property int sliderInputWidth: sliderDensity === "dense" ? (isSm ? 34 : 40) :
                                            sliderDensity === "compact" ? (isSm ? 38 : 46) : (isSm ? 44 : 52)

    readonly property int sliderInputHeight: sliderDensity === "dense" ? (isSm ? 16 : 18) :
                                             sliderDensity === "compact" ? (isSm ? 18 : 20) : (isSm ? 20 : 24)

    readonly property int sliderSpacing: sliderDensity === "dense" ? (isSm ? 2 : 3) :
                                         sliderDensity === "compact" ? (isSm ? 3 : 4) : (isSm ? 4 : 6)

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

    function cmykTrackColor(c, m, y, k) {
        var res = cmykToRgb(c, m, y, k);
        return Qt.rgba(res.r / 255.0, res.g / 255.0, res.b / 255.0, 1.0);
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

    function labTrackColor(l, a, b) {
        var res = labToRgb(l, a, b);
        return Qt.rgba(res.r / 255.0, res.g / 255.0, res.b / 255.0, 1.0);
    }

    // Triangle Geometry & Barycentric Math
    function hsvaToWeights(h, s, v) {
        var sat = clamp(s, 0, 1);
        var val = clamp(v, 0, 1);
        return {
            pure: val * sat,
            white: val * (1.0 - sat),
            black: 1.0 - val
        };
    }

    function weightsToPoint(pure, white, black, w, h) {
        var scale = w / 260.0;
        return {
            x: (pure * 130.0 + white * 17.4167 + black * 242.5833) * scale,
            y: (pure * 0.0 + white * 195.0 + black * 195.0) * scale
        };
    }

    function pointToWeights(px, py, w, h) {
        var scale = w / 260.0;
        var x = px / scale;
        var y = py / scale;
        var denominator = -43907.487;
        var pure = 225.1666 * (y - 195.0) / denominator;
        var white = (195.0 * (x - 242.5833) + (-112.5833) * (y - 195.0)) / denominator;
        pure = Math.max(0.0, pure);
        white = Math.max(0.0, white);
        var black = Math.max(0.0, 1.0 - pure - white);
        var total = pure + white + black;
        if (total <= 0) return { pure: 0, white: 1, black: 0 };
        return {
            pure: pure / total,
            white: white / total,
            black: black / total
        };
    }

    function weightsToHsva(pure, white, black) {
        var val = clamp(pure + white, 0, 1);
        var sat = val <= 0 ? 0 : clamp(pure / val, 0, 1);
        return { s: sat, v: val };
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

    // Reusable Channel Slider Row Component
    component ChannelSliderRow: Row {
        id: row
        width: parent ? parent.width : 0
        height: root.sliderRowHeight
        spacing: 6

        required property string label
        required property color labelColor
        required property real fromVal
        required property real toVal
        required property real curVal
        required property Gradient trackGradient

        signal userChanged(real val)

        readonly property real rangeSpan: toVal > fromVal ? (toVal - fromVal) : 1.0
        readonly property real progress: Math.max(0.0, Math.min(1.0, (curVal - fromVal) / rangeSpan))

        Text {
            width: root.sliderDensity === "dense" ? 10 : 14
            text: row.label
            color: row.labelColor
            font.pixelSize: root.sliderLabelFontSize
            font.weight: Font.Bold
            anchors.verticalCenter: parent.verticalCenter
        }

        Item {
            id: trackContainer
            width: parent.width - (root.sliderDensity === "dense" ? 10 : 14) - root.sliderInputWidth - 12
            height: root.sliderRowHeight
            anchors.verticalCenter: parent.verticalCenter

            readonly property real maxTravel: Math.max(0, width - thumb.width)

            // Track rectangle
            Rectangle {
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.verticalCenter: parent.verticalCenter
                height: root.sliderTrackHeight
                radius: height * 0.5
                gradient: row.trackGradient
            }

            // Thumb
            Rectangle {
                id: thumb
                width: root.sliderThumbSize
                height: root.sliderThumbSize
                radius: width * 0.5
                y: Math.round((parent.height - height) * 0.5)
                x: Math.round(row.progress * trackContainer.maxTravel)
                color: root.isDark ? "#ffffff" : "#0f172a"
                border.color: "#ffffff"
                border.width: 1.5
            }

            MouseArea {
                anchors.fill: parent
                enabled: !root.disabled
                cursorShape: Qt.PointingHandCursor

                function updateVal(mx) {
                    if (trackContainer.maxTravel <= 0) return;
                    var relX = mx - (thumb.width / 2);
                    var ratio = Math.max(0.0, Math.min(1.0, relX / trackContainer.maxTravel));
                    var newVal = Math.round(row.fromVal + ratio * row.rangeSpan);
                    row.userChanged(newVal);
                }

                onPressed: function(mouse) { updateVal(mouse.x); }
                onPositionChanged: function(mouse) { if (pressed) updateVal(mouse.x); }
            }
        }

        Rectangle {
            width: root.sliderInputWidth
            height: root.sliderInputHeight
            radius: 3
            color: root.isDark ? Qt.rgba(1, 1, 1, 0.06) : Qt.rgba(0, 0, 0, 0.04)
            border.color: numIn.activeFocus ? ThemeTokens.accent : ThemeTokens.border
            border.width: 1
            anchors.verticalCenter: parent.verticalCenter

            TextInput {
                id: numIn
                anchors.fill: parent
                verticalAlignment: TextInput.AlignVCenter
                horizontalAlignment: TextInput.AlignHCenter
                text: Math.round(row.curVal).toString()
                font.pixelSize: root.sliderLabelFontSize
                color: ThemeTokens.text
                enabled: !root.disabled
                selectByMouse: true
                onEditingFinished: {
                    var parsed = parseFloat(text);
                    if (!isNaN(parsed)) {
                        row.userChanged(Math.min(row.toVal, Math.max(row.fromVal, parsed)));
                    }
                }
            }
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

            x: root.movable ? root.dragOffsetX : 0
            y: root.movable ? root.dragOffsetY : 0

            // Background drag handler for movable mode
            MouseArea {
                id: cardDragArea
                anchors.fill: parent
                enabled: root.movable && !root.disabled
                cursorShape: pressed ? Qt.ClosedHandCursor : Qt.OpenHandCursor
                property real startMouseX: 0
                property real startMouseY: 0
                property real startOffsetX: 0
                property real startOffsetY: 0

                onPressed: function(mouse) {
                    startMouseX = mouse.x;
                    startMouseY = mouse.y;
                    startOffsetX = root.dragOffsetX;
                    startOffsetY = root.dragOffsetY;
                }

                onPositionChanged: function(mouse) {
                    if (pressed) {
                        root.dragOffsetX = startOffsetX + (mouse.x - startMouseX);
                        root.dragOffsetY = startOffsetY + (mouse.y - startMouseY);
                    }
                }

                onDoubleClicked: {
                    root.dragOffsetX = 0;
                    root.dragOffsetY = 0;
                }
            }

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

                    // 3A. Hue Ring Stage (Shared for Square and Triangle views)
                    Item {
                        anchors.centerIn: parent
                        width: root.stageSize
                        height: root.stageSize
                        visible: root.activePanel === "square" || root.activePanel === "triangle"

                        // Hue Ring Canvas
                        Canvas {
                            id: sharedHueRingCanvas
                            anchors.fill: parent
                            antialiasing: true
                            smooth: true
                            renderTarget: Canvas.Image

                            onPaint: {
                                var ctx = getContext("2d");
                                ctx.reset();
                                var cx = width * 0.5;
                                var cy = height * 0.5;
                                var outerR = width * 0.5;
                                var innerR = outerR - root.ringThickness;
                                var step = 1.0;
                                for (var a = 0; a < 360; a += step) {
                                    var rad1 = (a - 90) * Math.PI / 180.0;
                                    var rad2 = (a + step + 0.5 - 90) * Math.PI / 180.0;
                                    ctx.beginPath();
                                    ctx.arc(cx, cy, outerR, rad1, rad2, false);
                                    ctx.arc(cx, cy, innerR, rad2, rad1, true);
                                    ctx.closePath();
                                    ctx.fillStyle = Qt.hsva(a / 360.0, 1.0, 1.0, 1.0);
                                    ctx.fill();
                                }
                            }
                            Component.onCompleted: requestPaint()
                        }

                        // Outer ring subtle border
                        Rectangle {
                            anchors.fill: parent
                            radius: width * 0.5
                            color: "transparent"
                            border.color: root.isDark ? Qt.rgba(1, 1, 1, 0.15) : Qt.rgba(0, 0, 0, 0.12)
                            border.width: 1
                        }

                        // Inner circular card mask & border
                        Rectangle {
                            anchors.centerIn: parent
                            width: root.innerStageSize
                            height: root.innerStageSize
                            radius: width * 0.5
                            color: root.isDark ? ThemeTokens.panel : "#ffffff"
                            border.color: root.isDark ? Qt.rgba(1, 1, 1, 0.15) : Qt.rgba(0, 0, 0, 0.12)
                            border.width: 1
                        }

                        // Inner Content Container
                        Item {
                            id: ringContent
                            anchors.centerIn: parent
                            width: root.innerStageSize
                            height: root.innerStageSize
                            z: 1

                            // Square Picker Content
                            Rectangle {
                                id: squareArea
                                anchors.centerIn: parent
                                width: root.squareSize
                                height: root.squareSize
                                visible: root.activePanel === "square"
                                radius: 0
                                clip: true
                                color: Qt.hsva(root.currentH, 1.0, 1.0, 1.0)
                                border.color: root.isDark ? Qt.rgba(1, 1, 1, 0.2) : Qt.rgba(0, 0, 0, 0.15)
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
                                    enabled: !root.disabled && root.activePanel === "square"
                                    cursorShape: Qt.CrossCursor

                                    function updateFromSquare(mx, my) {
                                        var s = Math.max(0.0, Math.min(1.0, mx / (squareArea.width - 1)));
                                        var v = Math.max(0.0, Math.min(1.0, 1.0 - (my / (squareArea.height - 1))));
                                        root.setFromHsv(root.currentH, s, v);
                                    }

                                    onPressed: function(mouse) { updateFromSquare(mouse.x, mouse.y); }
                                    onPositionChanged: function(mouse) { if (pressed) updateFromSquare(mouse.x, mouse.y); }
                                }
                            }

                            // Triangle Picker Content
                            Item {
                                anchors.fill: parent
                                visible: root.activePanel === "triangle"

                                Canvas {
                                    id: triangleCanvas
                                    anchors.fill: parent
                                    antialiasing: true
                                    smooth: true

                                    onPaint: {
                                        var ctx = getContext("2d");
                                        ctx.reset();
                                        var w = width;
                                        var scale = w / 260.0;
                                        var pTopX = w * 0.5;
                                        var pTopY = 0;
                                        var pLeftX = scale * 17.4167;
                                        var pLeftY = scale * 195.0;
                                        var pRightX = scale * 242.5833;
                                        var pRightY = scale * 195.0;

                                        ctx.beginPath();
                                        ctx.moveTo(pTopX, pTopY);
                                        ctx.lineTo(pLeftX, pLeftY);
                                        ctx.lineTo(pRightX, pRightY);
                                        ctx.closePath();

                                        ctx.fillStyle = Qt.hsva(root.currentH, 1.0, 1.0, 1.0);
                                        ctx.fill();

                                        var gradWhite = ctx.createLinearGradient(pLeftX, pLeftY, pTopX, pTopY);
                                        gradWhite.addColorStop(0.0, "rgba(255, 255, 255, 1)");
                                        gradWhite.addColorStop(1.0, "rgba(255, 255, 255, 0)");
                                        ctx.fillStyle = gradWhite;
                                        ctx.fill();

                                        var gradBlack = ctx.createLinearGradient(pRightX, pRightY, pTopX, pTopY);
                                        gradBlack.addColorStop(0.0, "rgba(0, 0, 0, 1)");
                                        gradBlack.addColorStop(1.0, "rgba(0, 0, 0, 0)");
                                        ctx.fillStyle = gradBlack;
                                        ctx.fill();

                                        ctx.strokeStyle = root.isDark ? Qt.rgba(1, 1, 1, 0.2) : Qt.rgba(0, 0, 0, 0.15);
                                        ctx.lineWidth = 1;
                                        ctx.stroke();
                                    }

                                    Connections {
                                        target: root
                                        function onCurrentHChanged() {
                                            triangleCanvas.requestPaint();
                                        }
                                    }
                                }

                                Rectangle {
                                    id: triThumb
                                    width: 14
                                    height: 14
                                    radius: 7
                                    color: root.value
                                    border.color: "#ffffff"
                                    border.width: 2

                                    readonly property var pt: {
                                        var w = root.innerStageSize;
                                        var weights = root.hsvaToWeights(root.currentH, root.currentS, root.currentV);
                                        return root.weightsToPoint(weights.pure, weights.white, weights.black, w, w);
                                    }

                                    x: pt.x - 7
                                    y: pt.y - 7
                                }

                                MouseArea {
                                    anchors.fill: parent
                                    enabled: !root.disabled && root.activePanel === "triangle"
                                    cursorShape: Qt.CrossCursor

                                    function updateFromTri(mx, my) {
                                        var w = root.innerStageSize;
                                        var weights = root.pointToWeights(mx, my, w, w);
                                        var res = root.weightsToHsva(weights.pure, weights.white, weights.black);
                                        root.setFromHsv(root.currentH, res.s, res.v);
                                    }

                                    onPressed: function(mouse) { updateFromTri(mouse.x, mouse.y); }
                                    onPositionChanged: function(mouse) { if (pressed) updateFromTri(mouse.x, mouse.y); }
                                }
                            }
                        }

                        // Orbiting Hue Ring Handle
                        Rectangle {
                            z: 2
                            width: 14
                            height: 14
                            radius: 7
                            color: "#ffffff"
                            border.color: ThemeTokens.accent
                            border.width: 2
                            x: (parent.width * 0.5) + root.ringHandleRadius * Math.cos((root.currentH * 360.0 - 90.0) * Math.PI / 180.0) - 7
                            y: (parent.height * 0.5) + root.ringHandleRadius * Math.sin((root.currentH * 360.0 - 90.0) * Math.PI / 180.0) - 7
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
                                if (dist >= (root.innerStageSize * 0.5 - 4)) {
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
                            antialiasing: true
                            smooth: true
                            renderTarget: Canvas.Image

                            onPaint: {
                                var ctx = getContext("2d");
                                ctx.reset();
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

                        // Black brightness overlay
                        Rectangle {
                            anchors.fill: parent
                            radius: width * 0.5
                            color: "#000000"
                            opacity: 1.0 - root.currentV
                        }

                        // Circular boundary border
                        Rectangle {
                            anchors.fill: parent
                            radius: width * 0.5
                            color: "transparent"
                            border.color: root.isDark ? Qt.rgba(1, 1, 1, 0.15) : Qt.rgba(0, 0, 0, 0.12)
                            border.width: 1
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
                            enabled: !root.disabled && root.activePanel === "circle"
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

                    // 3C. Swatches View: Palette Grid
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

                // 5. Channel Toggle Switcher Bar (Placed directly above sliders)
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

                // 6. Channel Sliders Section with Dynamic Density & Color Tracks
                Column {
                    width: parent.width
                    spacing: root.sliderSpacing

                    // RGB Group
                    Column {
                        width: parent.width
                        spacing: root.sliderSpacing
                        visible: root.showRgbSliders

                        ChannelSliderRow {
                            label: "R"; labelColor: "#ef4444"
                            fromVal: 0; toVal: 255; curVal: Math.round(root.value.r * 255)
                            trackGradient: Gradient {
                                orientation: Gradient.Horizontal
                                GradientStop { position: 0.0; color: Qt.rgba(0, root.value.g, root.value.b, 1.0) }
                                GradientStop { position: 1.0; color: Qt.rgba(1.0, root.value.g, root.value.b, 1.0) }
                            }
                            onUserChanged: function(v) { root.setFromRgb(v, Math.round(root.value.g * 255), Math.round(root.value.b * 255)); }
                        }

                        ChannelSliderRow {
                            label: "G"; labelColor: "#22c55e"
                            fromVal: 0; toVal: 255; curVal: Math.round(root.value.g * 255)
                            trackGradient: Gradient {
                                orientation: Gradient.Horizontal
                                GradientStop { position: 0.0; color: Qt.rgba(root.value.r, 0, root.value.b, 1.0) }
                                GradientStop { position: 1.0; color: Qt.rgba(root.value.r, 1.0, root.value.b, 1.0) }
                            }
                            onUserChanged: function(v) { root.setFromRgb(Math.round(root.value.r * 255), v, Math.round(root.value.b * 255)); }
                        }

                        ChannelSliderRow {
                            label: "B"; labelColor: "#3b82f6"
                            fromVal: 0; toVal: 255; curVal: Math.round(root.value.b * 255)
                            trackGradient: Gradient {
                                orientation: Gradient.Horizontal
                                GradientStop { position: 0.0; color: Qt.rgba(root.value.r, root.value.g, 0, 1.0) }
                                GradientStop { position: 1.0; color: Qt.rgba(root.value.r, root.value.g, 1.0, 1.0) }
                            }
                            onUserChanged: function(v) { root.setFromRgb(Math.round(root.value.r * 255), Math.round(root.value.g * 255), v); }
                        }
                    }

                    // HSV Group
                    Column {
                        width: parent.width
                        spacing: root.sliderSpacing
                        visible: root.showHsvSliders

                        ChannelSliderRow {
                            label: "H"; labelColor: ThemeTokens.subduedText
                            fromVal: 0; toVal: 360; curVal: Math.round(root.currentH * 360)
                            trackGradient: Gradient {
                                orientation: Gradient.Horizontal
                                GradientStop { position: 0.000; color: "#ff0000" }
                                GradientStop { position: 0.167; color: "#ffff00" }
                                GradientStop { position: 0.333; color: "#00ff00" }
                                GradientStop { position: 0.500; color: "#00ffff" }
                                GradientStop { position: 0.667; color: "#0000ff" }
                                GradientStop { position: 0.833; color: "#ff00ff" }
                                GradientStop { position: 1.000; color: "#ff0000" }
                            }
                            onUserChanged: function(v) { root.setFromHsv(v / 360.0, root.currentS, root.currentV); }
                        }

                        ChannelSliderRow {
                            label: "S"; labelColor: ThemeTokens.subduedText
                            fromVal: 0; toVal: 100; curVal: Math.round(root.currentS * 100)
                            trackGradient: Gradient {
                                orientation: Gradient.Horizontal
                                GradientStop { position: 0.0; color: Qt.hsva(root.currentH, 0.0, root.currentV, 1.0) }
                                GradientStop { position: 1.0; color: Qt.hsva(root.currentH, 1.0, root.currentV, 1.0) }
                            }
                            onUserChanged: function(v) { root.setFromHsv(root.currentH, v / 100.0, root.currentV); }
                        }

                        ChannelSliderRow {
                            label: "V"; labelColor: ThemeTokens.subduedText
                            fromVal: 0; toVal: 100; curVal: Math.round(root.currentV * 100)
                            trackGradient: Gradient {
                                orientation: Gradient.Horizontal
                                GradientStop { position: 0.0; color: Qt.hsva(root.currentH, root.currentS, 0.0, 1.0) }
                                GradientStop { position: 1.0; color: Qt.hsva(root.currentH, root.currentS, 1.0, 1.0) }
                            }
                            onUserChanged: function(v) { root.setFromHsv(root.currentH, root.currentS, v / 100.0); }
                        }
                    }

                    // CMYK Group
                    Column {
                        width: parent.width
                        spacing: root.sliderSpacing
                        visible: root.showCmykSliders

                        ChannelSliderRow {
                            label: "C"; labelColor: "#06b6d4"
                            fromVal: 0; toVal: 100; curVal: root.currentCmyk.c
                            trackGradient: Gradient {
                                orientation: Gradient.Horizontal
                                GradientStop { position: 0.0; color: root.cmykTrackColor(0, root.currentCmyk.m, root.currentCmyk.y, root.currentCmyk.k) }
                                GradientStop { position: 1.0; color: root.cmykTrackColor(100, root.currentCmyk.m, root.currentCmyk.y, root.currentCmyk.k) }
                            }
                            onUserChanged: function(v) {
                                var res = root.cmykToRgb(v, root.currentCmyk.m, root.currentCmyk.y, root.currentCmyk.k);
                                root.setFromRgb(res.r, res.g, res.b);
                            }
                        }

                        ChannelSliderRow {
                            label: "M"; labelColor: "#ec4899"
                            fromVal: 0; toVal: 100; curVal: root.currentCmyk.m
                            trackGradient: Gradient {
                                orientation: Gradient.Horizontal
                                GradientStop { position: 0.0; color: root.cmykTrackColor(root.currentCmyk.c, 0, root.currentCmyk.y, root.currentCmyk.k) }
                                GradientStop { position: 1.0; color: root.cmykTrackColor(root.currentCmyk.c, 100, root.currentCmyk.y, root.currentCmyk.k) }
                            }
                            onUserChanged: function(v) {
                                var res = root.cmykToRgb(root.currentCmyk.c, v, root.currentCmyk.y, root.currentCmyk.k);
                                root.setFromRgb(res.r, res.g, res.b);
                            }
                        }

                        ChannelSliderRow {
                            label: "Y"; labelColor: "#eab308"
                            fromVal: 0; toVal: 100; curVal: root.currentCmyk.y
                            trackGradient: Gradient {
                                orientation: Gradient.Horizontal
                                GradientStop { position: 0.0; color: root.cmykTrackColor(root.currentCmyk.c, root.currentCmyk.m, 0, root.currentCmyk.k) }
                                GradientStop { position: 1.0; color: root.cmykTrackColor(root.currentCmyk.c, root.currentCmyk.m, 100, root.currentCmyk.k) }
                            }
                            onUserChanged: function(v) {
                                var res = root.cmykToRgb(root.currentCmyk.c, root.currentCmyk.m, v, root.currentCmyk.k);
                                root.setFromRgb(res.r, res.g, res.b);
                            }
                        }

                        ChannelSliderRow {
                            label: "K"; labelColor: ThemeTokens.text
                            fromVal: 0; toVal: 100; curVal: root.currentCmyk.k
                            trackGradient: Gradient {
                                orientation: Gradient.Horizontal
                                GradientStop { position: 0.0; color: root.cmykTrackColor(root.currentCmyk.c, root.currentCmyk.m, root.currentCmyk.y, 0) }
                                GradientStop { position: 1.0; color: root.cmykTrackColor(root.currentCmyk.c, root.currentCmyk.m, root.currentCmyk.y, 100) }
                            }
                            onUserChanged: function(v) {
                                var res = root.cmykToRgb(root.currentCmyk.c, root.currentCmyk.m, root.currentCmyk.y, v);
                                root.setFromRgb(res.r, res.g, res.b);
                            }
                        }
                    }

                    // LAB Group
                    Column {
                        width: parent.width
                        spacing: root.sliderSpacing
                        visible: root.showLabSliders

                        ChannelSliderRow {
                            label: "L"; labelColor: ThemeTokens.subduedText
                            fromVal: 0; toVal: 100; curVal: root.currentLab.l
                            trackGradient: Gradient {
                                orientation: Gradient.Horizontal
                                GradientStop { position: 0.0; color: root.labTrackColor(0, root.currentLab.a, root.currentLab.b) }
                                GradientStop { position: 1.0; color: root.labTrackColor(100, root.currentLab.a, root.currentLab.b) }
                            }
                            onUserChanged: function(v) {
                                var res = root.labToRgb(v, root.currentLab.a, root.currentLab.b);
                                root.setFromRgb(res.r, res.g, res.b);
                            }
                        }

                        ChannelSliderRow {
                            label: "A"; labelColor: ThemeTokens.subduedText
                            fromVal: -128; toVal: 127; curVal: root.currentLab.a
                            trackGradient: Gradient {
                                orientation: Gradient.Horizontal
                                GradientStop { position: 0.0; color: root.labTrackColor(root.currentLab.l, -128, root.currentLab.b) }
                                GradientStop { position: 1.0; color: root.labTrackColor(root.currentLab.l, 127, root.currentLab.b) }
                            }
                            onUserChanged: function(v) {
                                var res = root.labToRgb(root.currentLab.l, v, root.currentLab.b);
                                root.setFromRgb(res.r, res.g, res.b);
                            }
                        }

                        ChannelSliderRow {
                            label: "B"; labelColor: ThemeTokens.subduedText
                            fromVal: -128; toVal: 127; curVal: root.currentLab.b
                            trackGradient: Gradient {
                                orientation: Gradient.Horizontal
                                GradientStop { position: 0.0; color: root.labTrackColor(root.currentLab.l, root.currentLab.a, -128) }
                                GradientStop { position: 1.0; color: root.labTrackColor(root.currentLab.l, root.currentLab.a, 127) }
                            }
                            onUserChanged: function(v) {
                                var res = root.labToRgb(root.currentLab.l, root.currentLab.a, v);
                                root.setFromRgb(res.r, res.g, res.b);
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
