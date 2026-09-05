// ChaSetColorPicker.qml — Cross-Stack ColorPicker Component
// 100% Feature Parity with React ColorPicker.tsx
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
    property string activePanel: "square" // "square" | "triangle" | "swatches"
    property bool showChannels: false

    readonly property bool isDark: ThemeTokens.dark
    readonly property bool isSm: root.size === "sm"
    readonly property int cardWidth: isSm ? 240 : 272

    implicitWidth: mode === "popover" ? popoverTrigger.width : cardWidth
    implicitHeight: mode === "popover" ? popoverTrigger.height : panelLoader.height

    opacity: root.disabled ? 0.5 : 1.0

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

                // 2. View Tab Switcher (Square / Triangle / Swatches)
                Rectangle {
                    width: parent.width
                    height: 28
                    radius: 6
                    color: root.isDark ? Qt.rgba(1, 1, 1, 0.06) : Qt.rgba(0, 0, 0, 0.05)

                    Row {
                        anchors.fill: parent
                        anchors.margins: 2
                        spacing: 2

                        // Square Tab
                        Rectangle {
                            width: (parent.width - 4) / 3
                            height: parent.height
                            radius: 4
                            color: root.activePanel === "square"
                                ? (root.isDark ? Qt.rgba(1, 1, 1, 0.15) : "#ffffff")
                                : "transparent"
                            Text {
                                anchors.centerIn: parent
                                text: "Square"
                                font.pixelSize: 11
                                font.weight: root.activePanel === "square" ? Font.DemiBold : Font.Normal
                                color: root.activePanel === "square" ? ThemeTokens.text : ThemeTokens.subduedText
                            }
                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                onClicked: root.activePanel = "square"
                            }
                        }

                        // Triangle Tab
                        Rectangle {
                            width: (parent.width - 4) / 3
                            height: parent.height
                            radius: 4
                            color: root.activePanel === "triangle"
                                ? (root.isDark ? Qt.rgba(1, 1, 1, 0.15) : "#ffffff")
                                : "transparent"
                            Text {
                                anchors.centerIn: parent
                                text: "Triangle"
                                font.pixelSize: 11
                                font.weight: root.activePanel === "triangle" ? Font.DemiBold : Font.Normal
                                color: root.activePanel === "triangle" ? ThemeTokens.text : ThemeTokens.subduedText
                            }
                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                onClicked: root.activePanel = "triangle"
                            }
                        }

                        // Swatches Tab
                        Rectangle {
                            width: (parent.width - 4) / 3
                            height: parent.height
                            radius: 4
                            color: root.activePanel === "swatches"
                                ? (root.isDark ? Qt.rgba(1, 1, 1, 0.15) : "#ffffff")
                                : "transparent"
                            Text {
                                anchors.centerIn: parent
                                text: "Swatches"
                                font.pixelSize: 11
                                font.weight: root.activePanel === "swatches" ? Font.DemiBold : Font.Normal
                                color: root.activePanel === "swatches" ? ThemeTokens.text : ThemeTokens.subduedText
                            }
                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                onClicked: root.activePanel = "swatches"
                            }
                        }
                    }
                }

                // 3. Panel Views
                // Square View: 2D Saturation / Value Canvas
                Item {
                    width: parent.width
                    height: root.isSm ? 110 : 130
                    visible: root.activePanel === "square"

                    Rectangle {
                        id: squareBg
                        anchors.fill: parent
                        radius: 6
                        clip: true
                        color: Qt.hsva(root.currentH, 1.0, 1.0, 1.0)
                        border.color: ThemeTokens.border
                        border.width: 1

                        // Horizontal white-to-transparent gradient
                        Rectangle {
                            anchors.fill: parent
                            gradient: Gradient {
                                orientation: Gradient.Horizontal
                                GradientStop { position: 0.0; color: "#ffffff" }
                                GradientStop { position: 1.0; color: Qt.rgba(1, 1, 1, 0) }
                            }
                        }

                        // Vertical black-to-transparent gradient
                        Rectangle {
                            anchors.fill: parent
                            gradient: Gradient {
                                orientation: Gradient.Vertical
                                GradientStop { position: 0.0; color: Qt.rgba(0, 0, 0, 0) }
                                GradientStop { position: 1.0; color: "#000000" }
                            }
                        }

                        // Thumb handle
                        Rectangle {
                            id: squareThumb
                            width: 14
                            height: 14
                            radius: 7
                            color: root.value
                            border.color: "#ffffff"
                            border.width: 2
                            x: Math.max(0, Math.min(parent.width - 14, root.currentS * (parent.width - 14)))
                            y: Math.max(0, Math.min(parent.height - 14, (1.0 - root.currentV) * (parent.height - 14)))
                        }

                        MouseArea {
                            anchors.fill: parent
                            enabled: !root.disabled
                            cursorShape: Qt.CrossCursor

                            function updateFromPos(mx, my) {
                                var s = Math.max(0.0, Math.min(1.0, mx / (squareBg.width - 1)));
                                var v = Math.max(0.0, Math.min(1.0, 1.0 - (my / (squareBg.height - 1))));
                                root.setFromHsv(root.currentH, s, v);
                            }

                            onPressed: function(mouse) { updateFromPos(mouse.x, mouse.y); }
                            onPositionChanged: function(mouse) { if (pressed) updateFromPos(mouse.x, mouse.y); }
                        }
                    }
                }

                // Triangle View: Canvas triangle
                Item {
                    width: parent.width
                    height: root.isSm ? 110 : 130
                    visible: root.activePanel === "triangle"

                    Canvas {
                        id: triangleCanvas
                        anchors.fill: parent

                        onPaint: {
                            var ctx = getContext("2d");
                            ctx.reset();
                            var w = width;
                            var h = height;

                            var pTopX = w * 0.5;
                            var pTopY = 4;
                            var pLeftX = 8;
                            var pLeftY = h - 6;
                            var pRightX = w - 8;
                            var pRightY = h - 6;

                            // Fill pure hue
                            ctx.beginPath();
                            ctx.moveTo(pTopX, pTopY);
                            ctx.lineTo(pLeftX, pLeftY);
                            ctx.lineTo(pRightX, pRightY);
                            ctx.closePath();
                            ctx.fillStyle = Qt.hsva(root.currentH, 1.0, 1.0, 1.0);
                            ctx.fill();

                            // White gradient overlay from left
                            var gradWhite = ctx.createLinearGradient(pLeftX, pLeftY, pTopX, pTopY);
                            gradWhite.addColorStop(0.0, "rgba(255,255,255,1)");
                            gradWhite.addColorStop(1.0, "rgba(255,255,255,0)");
                            ctx.fillStyle = gradWhite;
                            ctx.fill();

                            // Black gradient overlay from right
                            var gradBlack = ctx.createLinearGradient(pRightX, pRightY, pTopX, pTopY);
                            gradBlack.addColorStop(0.0, "rgba(0,0,0,1)");
                            gradBlack.addColorStop(1.0, "rgba(0,0,0,0)");
                            ctx.fillStyle = gradBlack;
                            ctx.fill();

                            // Outline
                            ctx.strokeStyle = ThemeTokens.border;
                            ctx.lineWidth = 1;
                            ctx.stroke();
                        }

                        // Repaint canvas when hue changes
                        Connections {
                            target: root
                            function onCurrentHChanged() {
                                triangleCanvas.requestPaint();
                            }
                        }

                        // Draggable thumb indicator
                        Rectangle {
                            width: 14
                            height: 14
                            radius: 7
                            color: root.value
                            border.color: "#ffffff"
                            border.width: 2
                            x: Math.max(8, Math.min(parent.width - 22, (parent.width * 0.5) + (root.currentS - 0.5) * (parent.width - 24)))
                            y: Math.max(4, Math.min(parent.height - 18, (1.0 - root.currentV) * (parent.height - 20)))
                        }

                        MouseArea {
                            anchors.fill: parent
                            enabled: !root.disabled
                            cursorShape: Qt.CrossCursor

                            function updateFromTri(mx, my) {
                                var s = Math.max(0.0, Math.min(1.0, mx / (parent.width)));
                                var v = Math.max(0.0, Math.min(1.0, 1.0 - (my / parent.height)));
                                root.setFromHsv(root.currentH, s, v);
                            }

                            onPressed: function(mouse) { updateFromTri(mouse.x, mouse.y); }
                            onPositionChanged: function(mouse) { if (pressed) updateFromTri(mouse.x, mouse.y); }
                        }
                    }
                }

                // Swatches View: Palette Grid
                Item {
                    width: parent.width
                    height: (Math.ceil(root.presetColors.length / 8) * 26)
                    visible: root.activePanel === "swatches"

                    Grid {
                        anchors.fill: parent
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

                // Hue Slider Bar (available in square & triangle panels)
                Item {
                    width: parent.width
                    height: 14
                    visible: root.activePanel !== "swatches"

                    Rectangle {
                        id: hueBar
                        anchors.fill: parent
                        radius: 7
                        gradient: Gradient {
                            orientation: Gradient.Horizontal
                            GradientStop { position: 0.0; color: "#ff0000" }
                            GradientStop { position: 0.17; color: "#ffff00" }
                            GradientStop { position: 0.33; color: "#00ff00" }
                            GradientStop { position: 0.50; color: "#00ffff" }
                            GradientStop { position: 0.67; color: "#0000ff" }
                            GradientStop { position: 0.83; color: "#ff00ff" }
                            GradientStop { position: 1.0; color: "#ff0000" }
                        }

                        Rectangle {
                            id: hueThumb
                            width: 14
                            height: 14
                            radius: 7
                            color: Qt.hsva(root.currentH, 1.0, 1.0, 1.0)
                            border.color: "#ffffff"
                            border.width: 2
                            x: Math.max(0, Math.min(hueBar.width - 14, root.currentH * (hueBar.width - 14)))
                        }

                        MouseArea {
                            anchors.fill: parent
                            enabled: !root.disabled
                            cursorShape: Qt.PointingHandCursor

                            function updateHue(mx) {
                                var h = Math.max(0.0, Math.min(1.0, mx / (hueBar.width - 1)));
                                root.setFromHsv(h, root.currentS, root.currentV);
                            }

                            onPressed: function(mouse) { updateHue(mouse.x); }
                            onPositionChanged: function(mouse) { if (pressed) updateHue(mouse.x); }
                        }
                    }
                }

                // Quick preset swatches row
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

                // 4. Hex Input Row
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
                        width: parent.width - 36
                        height: 28
                        radius: 4
                        color: root.isDark ? Qt.rgba(1, 1, 1, 0.05) : Qt.rgba(0, 0, 0, 0.03)
                        border.color: hexInput.activeFocus ? ThemeTokens.accent : ThemeTokens.border
                        border.width: 1

                        TextInput {
                            id: hexInput
                            anchors.fill: parent
                            anchors.leftMargin: 8
                            anchors.rightMargin: 8
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
                    }
                }

                // 5. Channel Sliders Toggle
                Rectangle {
                    width: parent.width
                    height: 22
                    color: "transparent"

                    Text {
                        anchors.left: parent.left
                        anchors.verticalCenter: parent.verticalCenter
                        text: root.showChannels ? "▾ RGB Channels" : "▸ RGB Channels"
                        font.pixelSize: 11
                        color: ThemeTokens.subduedText
                        font.weight: Font.Medium
                    }

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: root.showChannels = !root.showChannels
                    }
                }

                // Channel Sliders (R, G, B)
                Column {
                    width: parent.width
                    spacing: 6
                    visible: root.showChannels

                    // R slider
                    Row {
                        width: parent.width
                        spacing: 6
                        Text { text: "R"; width: 14; color: ThemeTokens.subduedText; font.pixelSize: 11; anchors.verticalCenter: parent.verticalCenter }
                        Slider {
                            id: rSlider
                            width: parent.width - 54
                            from: 0; to: 255; stepSize: 1
                            value: Math.round(root.value.r * 255)
                            anchors.verticalCenter: parent.verticalCenter
                            onMoved: root.setFromRgb(value, gSlider.value, bSlider.value)
                        }
                        Text { text: Math.round(rSlider.value).toString(); width: 28; color: ThemeTokens.text; font.pixelSize: 11; anchors.verticalCenter: parent.verticalCenter }
                    }

                    // G slider
                    Row {
                        width: parent.width
                        spacing: 6
                        Text { text: "G"; width: 14; color: ThemeTokens.subduedText; font.pixelSize: 11; anchors.verticalCenter: parent.verticalCenter }
                        Slider {
                            id: gSlider
                            width: parent.width - 54
                            from: 0; to: 255; stepSize: 1
                            value: Math.round(root.value.g * 255)
                            anchors.verticalCenter: parent.verticalCenter
                            onMoved: root.setFromRgb(rSlider.value, value, bSlider.value)
                        }
                        Text { text: Math.round(gSlider.value).toString(); width: 28; color: ThemeTokens.text; font.pixelSize: 11; anchors.verticalCenter: parent.verticalCenter }
                    }

                    // B slider
                    Row {
                        width: parent.width
                        spacing: 6
                        Text { text: "B"; width: 14; color: ThemeTokens.subduedText; font.pixelSize: 11; anchors.verticalCenter: parent.verticalCenter }
                        Slider {
                            id: bSlider
                            width: parent.width - 54
                            from: 0; to: 255; stepSize: 1
                            value: Math.round(root.value.b * 255)
                            anchors.verticalCenter: parent.verticalCenter
                            onMoved: root.setFromRgb(rSlider.value, gSlider.value, value)
                        }
                        Text { text: Math.round(bSlider.value).toString(); width: 28; color: ThemeTokens.text; font.pixelSize: 11; anchors.verticalCenter: parent.verticalCenter }
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
        }
    }

    // Inline Card Loader
    Loader {
        id: panelLoader
        visible: root.mode === "inline"
        sourceComponent: pickerCardComponent
    }
}
