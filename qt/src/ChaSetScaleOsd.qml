// ChaSetScaleOsd.qml — Cross-Stack Scale OSD Component
import QtQuick 6.10
import QtQuick.Controls 6.10
import QtQuick.Layouts 6.10
import ChaSet

Item {
    id: root

    property real value: 1.0
    property real step: 0.1
    property real min: 0.2
    property real max: 3.0
    property var steps: []
    property bool ignoreUiScale: true
    property int autoHideDuration: 1400
    property bool showControls: true
    property bool disabled: false
    property var format: null
    property string placement: "bottom-center"
    property string size: "default" // "default" | "lg"
    property bool animated: true

    signal stepTriggered(real delta)
    signal resetTriggered()

    property bool defaultVisible: false
    property bool osdVisible: defaultVisible
    readonly property bool pointerOver: (pillHover.hovered || minusHover.hovered || plusHover.hovered || resetHover.hovered)
    property bool _initialized: false

    readonly property bool isLg: root.size === "lg"
    readonly property real effectiveMin: (root.steps && root.steps.length > 0) ? Math.min.apply(null, root.steps) : root.min
    readonly property real effectiveMax: (root.steps && root.steps.length > 0) ? Math.max.apply(null, root.steps) : root.max

    Component.onCompleted: {
        _initialized = true;
    }

    Component.onDestruction: {
        hideTimer.stop();
    }

    function show() {
        root.osdVisible = true;
        if (root.autoHideDuration > 0 && !root.pointerOver) {
            hideTimer.restart();
        }
    }

    function hide() {
        root.osdVisible = false;
        hideTimer.stop();
    }

    function stepZoom(delta) {
        if (root.disabled) return;
        if (root.steps && root.steps.length > 0) {
            var sorted = root.steps.slice().sort(function(a, b) { return a - b; });
            var targetIdx = -1;
            if (delta > 0) {
                for (var i = 0; i < sorted.length; i++) {
                    if (sorted[i] > root.value + 0.001) {
                        targetIdx = i;
                        break;
                    }
                }
                if (targetIdx === -1) targetIdx = sorted.length - 1;
            } else {
                for (var j = sorted.length - 1; j >= 0; j--) {
                    if (sorted[j] < root.value - 0.001) {
                        targetIdx = j;
                        break;
                    }
                }
                if (targetIdx === -1) targetIdx = 0;
            }
            root.value = sorted[targetIdx];
            root.stepTriggered(delta > 0 ? 1 : -1);
            root.show();
        } else {
            var next = Math.max(root.min, Math.min(root.max, Math.round((root.value + delta) * 100) / 100));
            root.value = next;
            root.stepTriggered(delta);
            root.show();
        }
    }

    function resetZoom() {
        if (root.disabled) return;
        root.value = 1.0;
        root.resetTriggered();
        root.show();
    }

    onValueChanged: {
        if (_initialized) {
            root.show();
        }
    }

    Timer {
        id: hideTimer
        interval: root.autoHideDuration
        repeat: false
        running: false
        onTriggered: {
            if (!root) return;
            if (!root.pointerOver) {
                root.osdVisible = false;
            } else {
                hideTimer.restart();
            }
        }
    }

    onPointerOverChanged: {
        if (pointerOver) {
            hideTimer.stop();
        } else if (osdVisible && autoHideDuration > 0) {
            hideTimer.restart();
        }
    }

    implicitWidth: pill.implicitWidth
    implicitHeight: root.ignoreUiScale ? (isLg ? 42 : 40) : ThemeTokens.dp(isLg ? 42 : 40)
    width: implicitWidth
    height: implicitHeight

    visible: root.animated ? (opacity > 0.01) : root.osdVisible
    opacity: osdVisible ? 1.0 : 0.0

    Behavior on opacity {
        enabled: root.animated && ThemeTokens.animationsEnabled
        NumberAnimation {
            duration: ThemeTokens.motionShort
            easing.type: ThemeTokens.easeStandard
        }
    }

    // Shadow / depth behind pill
    Rectangle {
        id: shadowPill
        anchors.fill: pill
        anchors.topMargin: root.ignoreUiScale ? 2 : ThemeTokens.dp(2)
        radius: pill.radius
        color: Qt.rgba(0, 0, 0, ThemeTokens.dark ? 0.35 : 0.12)
        z: -1
    }

    Rectangle {
        id: pill
        anchors.fill: parent
        radius: isLg ? (root.ignoreUiScale ? 21 : ThemeTokens.dp(21)) : height / 2
        color: ThemeTokens.panel
        border.color: ThemeTokens.border
        border.width: 1
        implicitWidth: contentRow.implicitWidth + (root.ignoreUiScale ? (isLg ? 27 : 24) : ThemeTokens.dp(isLg ? 27 : 24))
        implicitHeight: root.ignoreUiScale ? (isLg ? 42 : 40) : ThemeTokens.dp(isLg ? 42 : 40)

        HoverHandler {
            id: pillHover
        }

        Row {
            id: contentRow
            anchors.left: parent.left
            anchors.leftMargin: root.ignoreUiScale ? (root.isLg ? 18 : 12) : ThemeTokens.dp(root.isLg ? 18 : 12)
            anchors.verticalCenter: parent.verticalCenter
            spacing: root.ignoreUiScale ? (isLg ? 6 : 8) : ThemeTokens.dp(isLg ? 6 : 8)

            Text {
                id: labelText
                anchors.verticalCenter: parent.verticalCenter
                width: isLg ? Math.max(root.ignoreUiScale ? 180 : ThemeTokens.dp(180), implicitWidth) : implicitWidth
                text: root.format ? root.format(root.value) : qsTr("%1%").arg(Math.round(root.value * 100))
                color: ThemeTokens.text
                font.pixelSize: root.ignoreUiScale
                    ? (root.isLg ? 20 : 14)
                    : (root.isLg ? Typography.sizeTitleSm : Typography.sizeBody)
                font.weight: isLg ? Typography.weightMedium : Typography.weightSemibold
                font.family: Typography.familySans
                horizontalAlignment: Text.AlignHCenter
                verticalAlignment: Text.AlignVCenter
                elide: Text.ElideRight
            }

            Rectangle {
                visible: root.showControls && !root.isLg
                width: 1
                height: root.ignoreUiScale ? 18 : ThemeTokens.dp(18)
                color: ThemeTokens.border
                anchors.verticalCenter: parent.verticalCenter
            }

            // Minus Button
            Rectangle {
                id: minusBtn
                visible: root.showControls
                width: root.ignoreUiScale ? (root.isLg ? 42 : 28) : ThemeTokens.dp(root.isLg ? 42 : 28)
                height: root.ignoreUiScale ? (root.isLg ? 42 : 28) : ThemeTokens.dp(root.isLg ? 42 : 28)
                radius: root.ignoreUiScale ? (root.isLg ? 21 : 14) : ThemeTokens.dp(root.isLg ? 21 : 14)
                anchors.verticalCenter: parent.verticalCenter
                readonly property bool minusDisabled: root.disabled || root.value <= root.effectiveMin + 0.001
                color: minusTap.pressed ? ThemeTokens.pressed : (minusHover.hovered && !minusDisabled ? ThemeTokens.hover : "transparent")
                opacity: minusDisabled ? 0.4 : 1.0

                Text {
                    anchors.centerIn: parent
                    text: "−"
                    color: ThemeTokens.text
                    font.pixelSize: root.ignoreUiScale
                        ? (root.isLg ? 21 : 15)
                        : (root.isLg ? Typography.sizeTitleSm : Typography.sizeHeading)
                    font.weight: Typography.weightBold
                }

                ToolTip {
                    visible: minusHover.hovered && !minusBtn.minusDisabled
                    text: qsTr("缩小")
                    delay: 400
                }

                HoverHandler {
                    id: minusHover
                    cursorShape: minusBtn.minusDisabled ? Qt.ForbiddenCursor : Qt.PointingHandCursor
                }

                TapHandler {
                    id: minusTap
                    enabled: !minusBtn.minusDisabled
                    onTapped: root.stepZoom(-root.step)
                }
            }

            // Plus Button
            Rectangle {
                id: plusBtn
                visible: root.showControls
                width: root.ignoreUiScale ? (root.isLg ? 42 : 28) : ThemeTokens.dp(root.isLg ? 42 : 28)
                height: root.ignoreUiScale ? (root.isLg ? 42 : 28) : ThemeTokens.dp(root.isLg ? 42 : 28)
                radius: root.ignoreUiScale ? (root.isLg ? 21 : 14) : ThemeTokens.dp(root.isLg ? 21 : 14)
                anchors.verticalCenter: parent.verticalCenter
                readonly property bool plusDisabled: root.disabled || root.value >= root.effectiveMax - 0.001
                color: plusTap.pressed ? ThemeTokens.pressed : (plusHover.hovered && !plusDisabled ? ThemeTokens.hover : "transparent")
                opacity: plusDisabled ? 0.4 : 1.0

                Text {
                    anchors.centerIn: parent
                    text: "+"
                    color: ThemeTokens.text
                    font.pixelSize: root.ignoreUiScale
                        ? (root.isLg ? 21 : 15)
                        : (root.isLg ? Typography.sizeTitleSm : Typography.sizeHeading)
                    font.weight: Typography.weightBold
                }

                ToolTip {
                    visible: plusHover.hovered && !plusBtn.plusDisabled
                    text: qsTr("放大")
                    delay: 400
                }

                HoverHandler {
                    id: plusHover
                    cursorShape: plusBtn.plusDisabled ? Qt.ForbiddenCursor : Qt.PointingHandCursor
                }

                TapHandler {
                    id: plusTap
                    enabled: !plusBtn.plusDisabled
                    onTapped: root.stepZoom(+root.step)
                }
            }

            // Reset Button
            Rectangle {
                id: resetBtn
                visible: root.showControls
                width: root.ignoreUiScale ? (root.isLg ? 42 : 28) : ThemeTokens.dp(root.isLg ? 42 : 28)
                height: root.ignoreUiScale ? (root.isLg ? 42 : 28) : ThemeTokens.dp(root.isLg ? 42 : 28)
                radius: root.ignoreUiScale ? (root.isLg ? 21 : 14) : ThemeTokens.dp(root.isLg ? 21 : 14)
                anchors.verticalCenter: parent.verticalCenter
                readonly property bool resetDisabled: root.disabled || Math.abs(root.value - 1.0) < 0.001
                color: resetTap.pressed ? ThemeTokens.pressed : (resetHover.hovered && !resetDisabled ? ThemeTokens.hover : "transparent")
                opacity: resetDisabled ? 0.4 : 1.0

                Text {
                    anchors.centerIn: parent
                    text: "⟳"
                    color: ThemeTokens.text
                    font.pixelSize: root.ignoreUiScale
                        ? (root.isLg ? 18 : 12)
                        : (root.isLg ? Typography.sizeSubheading : Typography.sizeBody)
                }

                ToolTip {
                    visible: resetHover.hovered && !resetBtn.resetDisabled
                    text: qsTr("重置")
                    delay: 400
                }

                HoverHandler {
                    id: resetHover
                    cursorShape: resetBtn.resetDisabled ? Qt.ForbiddenCursor : Qt.PointingHandCursor
                }

                TapHandler {
                    id: resetTap
                    enabled: !resetBtn.resetDisabled
                    onTapped: root.resetZoom()
                }
            }
        }
    }
}
