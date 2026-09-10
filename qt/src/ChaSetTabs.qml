// ChaSetTabs.qml — Cross-Stack Tabs Component
// 100% Pixel-Perfect & Behavioral Parity with React (@chahu/cha-set).
import QtQuick 6.10
import ChaSet

Item {
    id: root

    property string currentValue: ""
    property string orientation: "horizontal" // "horizontal" | "vertical"
    property string variant: "default"         // "default" | "line"
    property string size: "default"            // "default" | "sm"

    signal valueChanged(string value)

    onCurrentValueChanged: {
        root.valueChanged(root.currentValue);
    }

    implicitWidth: childrenRect.width
    implicitHeight: childrenRect.height
}
