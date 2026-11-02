// ChaSetRangeSlider.qml — Cross-Stack Range Slider Component (Unified ChaSetSlider Wrapper)
import QtQuick
import QtQuick.Controls
import ChaSet

ChaSetSlider {
    id: root
    range: true

    property alias from: root.min
    property alias to: root.max
    property alias stepSize: root.step
}
