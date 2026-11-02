// ChaSetSnapSlider.qml — Cross-Stack Snap Slider Component (Unified ChaSetSlider Wrapper)
import QtQuick
import QtQuick.Controls
import ChaSet

ChaSetSlider {
    id: root

    min: 0
    max: root.count > 0 ? (root.count - 1) : (root.labels && root.labels.length > 0 ? (root.labels.length - 1) : 4)
    step: 1
    showTicks: true

    property alias currentIndex: root.value

    signal indexChanged(int index)

    onValueChanged: {
        var snapped = Math.round(root.value);
        root.indexChanged(snapped);
    }
}
