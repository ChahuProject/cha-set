// ChaSetSeparator.qml — Cross-Stack Separator / Divider Component
// 100% Pixel-Perfect & Behavioral Parity with React Separator.tsx
import QtQuick 6.10
import ChaSet

Item {
    id: root

    property string orientation: "horizontal" // "horizontal" | "vertical"
    property string variant: "solid"          // "solid" | "dashed" | "dotted"
    property string label: ""
    property string labelPosition: "center"   // "left" | "center" | "right"
    property color customColor: "transparent"
    property alias color: root.customColor
    property bool decorative: true

    readonly property bool isVertical: orientation === "vertical"
    readonly property bool hasLabel: label.length > 0 && !isVertical
    readonly property bool isDark: ThemeTokens.dark

    readonly property color lineColor: customColor.a > 0
        ? customColor
        : (isDark ? Qt.rgba(30.0 / 255.0, 41.0 / 255.0, 59.0 / 255.0, 1.0) : Qt.rgba(226.0 / 255.0, 232.0 / 255.0, 240.0 / 255.0, 1.0))

    implicitWidth: hasLabel ? (parent ? parent.width : 160) : (isVertical ? 1 : 100)
    implicitHeight: hasLabel ? Math.max(16, labelText.implicitHeight) : (isVertical ? 100 : 1)

    width: hasLabel ? (parent ? parent.width : implicitWidth) : (isVertical ? 1 : (parent ? parent.width : implicitWidth))
    height: hasLabel ? implicitHeight : (isVertical ? (parent ? parent.height : implicitHeight) : 1)

    // Unlabeled Solid Divider
    Rectangle {
        id: solidLine
        visible: !root.hasLabel && root.variant === "solid"
        anchors.fill: parent
        color: root.lineColor
    }

    // Unlabeled Dashed / Dotted Divider
    Canvas {
        id: dashCanvas
        visible: !root.hasLabel && root.variant !== "solid"
        anchors.fill: parent
        onPaint: {
            var ctx = getContext("2d");
            ctx.clearRect(0, 0, width, height);
            ctx.strokeStyle = root.lineColor;
            ctx.lineWidth = 1;
            ctx.beginPath();
            if (root.variant === "dashed") {
                ctx.setLineDash([4, 4]);
            } else if (root.variant === "dotted") {
                ctx.setLineDash([2, 2]);
            }
            if (root.isVertical) {
                ctx.moveTo(0.5, 0);
                ctx.lineTo(0.5, height);
            } else {
                ctx.moveTo(0, 0.5);
                ctx.lineTo(width, 0.5);
            }
            ctx.stroke();
        }
        onWidthChanged: requestPaint()
        onHeightChanged: requestPaint()
        Connections {
            target: root
            function onLineColorChanged() { dashCanvas.requestPaint(); }
            function onVariantChanged() { dashCanvas.requestPaint(); }
        }
    }

    // Labeled Horizontal Divider Container
    Item {
        id: labeledContainer
        visible: root.hasLabel
        anchors.fill: parent

        Item {
            id: leftLineWrapper
            anchors.left: parent.left
            anchors.verticalCenter: parent.verticalCenter
            height: 1
            width: root.labelPosition === "left"
                ? 24
                : (root.labelPosition === "right"
                    ? Math.max(0, parent.width - labelText.implicitWidth - 36)
                    : Math.max(0, (parent.width - labelText.implicitWidth - 24) / 2))

            Rectangle {
                visible: root.variant === "solid"
                anchors.fill: parent
                color: root.lineColor
            }
            Canvas {
                id: leftDashCanvas
                visible: root.variant !== "solid"
                anchors.fill: parent
                onPaint: {
                    var ctx = getContext("2d");
                    ctx.clearRect(0, 0, width, height);
                    ctx.strokeStyle = root.lineColor;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.setLineDash(root.variant === "dashed" ? [4, 4] : [2, 2]);
                    ctx.moveTo(0, 0.5);
                    ctx.lineTo(width, 0.5);
                    ctx.stroke();
                }
                onWidthChanged: requestPaint()
                Connections {
                    target: root
                    function onLineColorChanged() { leftDashCanvas.requestPaint(); }
                    function onVariantChanged() { leftDashCanvas.requestPaint(); }
                }
            }
        }

        Text {
            id: labelText
            text: root.label
            color: ThemeTokens.subduedText
            font.pixelSize: 12
            font.weight: Font.Medium
            anchors.verticalCenter: parent.verticalCenter
            anchors.left: root.labelPosition === "left" ? leftLineWrapper.right : undefined
            anchors.leftMargin: root.labelPosition === "left" ? 12 : 0
            anchors.right: root.labelPosition === "right" ? rightLineWrapper.left : undefined
            anchors.rightMargin: root.labelPosition === "right" ? 12 : 0
            anchors.horizontalCenter: root.labelPosition === "center" ? parent.horizontalCenter : undefined
        }

        Item {
            id: rightLineWrapper
            anchors.right: parent.right
            anchors.verticalCenter: parent.verticalCenter
            height: 1
            width: root.labelPosition === "right"
                ? 24
                : (root.labelPosition === "left"
                    ? Math.max(0, parent.width - labelText.implicitWidth - 36)
                    : Math.max(0, (parent.width - labelText.implicitWidth - 24) / 2))

            Rectangle {
                visible: root.variant === "solid"
                anchors.fill: parent
                color: root.lineColor
            }
            Canvas {
                id: rightDashCanvas
                visible: root.variant !== "solid"
                anchors.fill: parent
                onPaint: {
                    var ctx = getContext("2d");
                    ctx.clearRect(0, 0, width, height);
                    ctx.strokeStyle = root.lineColor;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.setLineDash(root.variant === "dashed" ? [4, 4] : [2, 2]);
                    ctx.moveTo(0, 0.5);
                    ctx.lineTo(width, 0.5);
                    ctx.stroke();
                }
                onWidthChanged: requestPaint()
                Connections {
                    target: root
                    function onLineColorChanged() { rightDashCanvas.requestPaint(); }
                    function onVariantChanged() { rightDashCanvas.requestPaint(); }
                }
            }
        }
    }
}
