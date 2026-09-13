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
    property int autoHideDuration: 1400
    property bool showControls: true
    property bool disabled: false
    property var format: null

    signal stepTriggered(real delta)
    signal resetTriggered()

    property bool osdVisible: true
    property bool pointerOver: false

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
        var next = Math.max(root.min, Math.min(root.max, Math.round((root.value + delta) * 100) / 100));
        root.value = next;
        root.stepTriggered(delta);
        root.show();
    }

    function resetZoom() {
        if (root.disabled) return;
        root.value = 1.0;
        root.resetTriggered();
        root.show();
    }

    onValueChanged: {
        root.show();
    }

    Timer {
        id: hideTimer
        interval: root.autoHideDuration
        repeat: false
        running: false
        onTriggered: {
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
    implicitHeight: 40
    width: implicitWidth
    height: implicitHeight

    visible: osdVisible
    opacity: osdVisible ? 1.0 : 0.0

    Behavior on opacity {
        enabled: ThemeTokens.animationsEnabled
        NumberAnimation {
            duration: ThemeTokens.motionShort
            easing.type: ThemeTokens.easeStandard
        }
    }

    Rectangle {
        id: pill
        anchors.fill: parent
        radius: height / 2
        color: ThemeTokens.panelRaised
        border.color: ThemeTokens.border
        border.width: 1
        implicitWidth: contentRow.implicitWidth + 24

        HoverHandler {
            onHoveredChanged: root.pointerOver = hovered
        }

        Row {
            id: contentRow
            anchors.centerIn: parent
            spacing: 8

            Text {
                id: labelText
                anchors.verticalCenter: parent.verticalCenter
                text: root.format ? root.format(root.value) : qsTr("%1%").arg(Math.round(root.value * 100))
                color: ThemeTokens.text
                font.pixelSize: Typography.sizeBody
                font.weight: Typography.weightSemibold
                horizontalAlignment: Text.AlignHCenter
                verticalAlignment: Text.AlignVCenter
            }

            Rectangle {
                visible: root.showControls
                width: 1
                height: 18
                color: ThemeTokens.border
                anchors.verticalCenter: parent.verticalCenter
            }

            // Minus Button
            Rectangle {
                id: minusBtn
                visible: root.showControls
                width: 28
                height: 28
                radius: 14
                anchors.verticalCenter: parent.verticalCenter
                color: minusHover.hovered && !minusDisabled ? ThemeTokens.hover : "transparent"
                readonly property bool minusDisabled: root.disabled || root.value <= root.min
                opacity: minusDisabled ? 0.4 : 1.0

                Text {
                    anchors.centerIn: parent
                    text: "−"
                    color: ThemeTokens.text
                    font.pixelSize: Typography.sizeHeading
                    font.weight: Typography.weightBold
                }

                HoverHandler {
                    id: minusHover
                    cursorShape: minusBtn.minusDisabled ? Qt.ForbiddenCursor : Qt.PointingHandCursor
                }

                TapHandler {
                    enabled: !minusBtn.minusDisabled
                    onTapped: root.stepZoom(-root.step)
                }
            }

            // Plus Button
            Rectangle {
                id: plusBtn
                visible: root.showControls
                width: 28
                height: 28
                radius: 14
                anchors.verticalCenter: parent.verticalCenter
                color: plusHover.hovered && !plusDisabled ? ThemeTokens.hover : "transparent"
                readonly property bool plusDisabled: root.disabled || root.value >= root.max
                opacity: plusDisabled ? 0.4 : 1.0

                Text {
                    anchors.centerIn: parent
                    text: "+"
                    color: ThemeTokens.text
                    font.pixelSize: Typography.sizeHeading
                    font.weight: Typography.weightBold
                }

                HoverHandler {
                    id: plusHover
                    cursorShape: plusBtn.plusDisabled ? Qt.ForbiddenCursor : Qt.PointingHandCursor
                }

                TapHandler {
                    enabled: !plusBtn.plusDisabled
                    onTapped: root.stepZoom(+root.step)
                }
            }

            // Reset Button
            Rectangle {
                id: resetBtn
                visible: root.showControls
                width: 28
                height: 28
                radius: 14
                anchors.verticalCenter: parent.verticalCenter
                color: resetHover.hovered && !root.disabled ? ThemeTokens.hover : "transparent"
                opacity: root.disabled ? 0.4 : 1.0

                Text {
                    anchors.centerIn: parent
                    text: "⟳"
                    color: ThemeTokens.text
                    font.pixelSize: Typography.sizeBody
                }

                HoverHandler {
                    id: resetHover
                    cursorShape: root.disabled ? Qt.ForbiddenCursor : Qt.PointingHandCursor
                }

                TapHandler {
                    enabled: !root.disabled
                    onTapped: root.resetZoom()
                }
            }
        }
    }
}
