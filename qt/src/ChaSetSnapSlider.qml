// ChaSetSnapSlider.qml — Cross-Stack Snap Slider Component
import QtQuick 6.10
import QtQuick.Controls 6.10
import QtQuick.Layouts 6.10
import ChaSet

Item {
    id: root

    property int count: labels && labels.length > 0 ? labels.length : 5
    property var labels: []
    property int currentIndex: 0
    property alias value: root.currentIndex
    property string leftLabel: ""
    property string rightLabel: ""
    property bool showTicks: true
    property bool disabled: false
    property bool readOnly: false
    property string size: "default" // "default" | "sm"

    signal indexChanged(int index)
    signal valueMoved(int index)

    readonly property int labelRowHeight: 16
    readonly property int effectiveCount: Math.max(2, root.count)
    readonly property int maxIndex: effectiveCount - 1

    width: implicitWidth
    height: implicitHeight
    implicitWidth: slider.implicitWidth
    implicitHeight: slider.implicitHeight + 4 + (hasLabels ? labelRowHeight : 0)

    readonly property bool hasLabels: root.leftLabel !== "" || root.rightLabel !== "" || (root.labels && root.labels.length > 0)

    ChaSetSlider {
        id: slider
        anchors.top: parent.top
        anchors.left: parent.left
        anchors.right: parent.right
        min: 0
        max: root.maxIndex
        step: 1
        value: root.currentIndex
        showTicks: root.showTicks
        disabled: root.disabled || !root.enabled
        readOnly: root.readOnly
        size: root.size
        onValueMoved: function(val) {
            var snapped = Math.round(val);
            root.currentIndex = snapped;
            root.indexChanged(snapped);
            root.valueMoved(snapped);
        }
    }

    RowLayout {
        anchors.top: slider.bottom
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.topMargin: 2
        height: root.labelRowHeight
        visible: root.hasLabels
        opacity: (root.disabled || !root.enabled) ? 0.5 : 1.0

        Text {
            text: root.leftLabel
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeCaption
            verticalAlignment: Text.AlignVCenter
        }

        Text {
            Layout.fillWidth: true
            Layout.preferredWidth: 0
            horizontalAlignment: Text.AlignHCenter
            text: root.currentIndex >= 0 && root.labels && root.currentIndex < root.labels.length
                  ? root.labels[root.currentIndex]
                  : String(root.currentIndex)
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeSmall
            font.bold: true
            verticalAlignment: Text.AlignVCenter
            elide: Text.ElideMiddle
        }

        Text {
            Layout.alignment: Qt.AlignRight | Qt.AlignVCenter
            text: root.rightLabel
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeCaption
            verticalAlignment: Text.AlignVCenter
        }
    }
}
