// ChaSet ScrollBar for Qt (QML)
// Native Qt Quick Controls ScrollBar implementation with ChaSet design token styling.
import QtQuick 6.10
import QtQuick.Templates 6.10 as T
import chaSet

T.ScrollBar {
    id: control

    implicitWidth: Math.max(implicitBackgroundWidth + leftInset + rightInset,
                            implicitContentWidth + leftPadding + rightPadding)
    implicitHeight: Math.max(implicitBackgroundHeight + topInset + bottomInset,
                             implicitContentHeight + topPadding + bottomPadding)

    padding: 0
    hoverEnabled: true

    property int collapsedSize: 4
    property int expandedSize: 8
    property real customRadius: ThemeTokens.rowRadius

    // Visual Thumb Capsule (Native C++ QQuickScrollBar handles position & drag seamlessly)
    contentItem: Rectangle {
        implicitWidth: control.orientation === Qt.Vertical ? (control.hovered || control.pressed ? control.expandedSize : control.collapsedSize) : 0
        implicitHeight: control.orientation === Qt.Horizontal ? (control.hovered || control.pressed ? control.expandedSize : control.collapsedSize) : 0
        radius: Math.min(width, height) / 2

        color: control.pressed ? Qt.rgba(ThemeTokens.text.r, ThemeTokens.text.g, ThemeTokens.text.b, 0.6) :
               (control.hovered ? Qt.rgba(ThemeTokens.text.r, ThemeTokens.text.g, ThemeTokens.text.b, 0.4) :
               Qt.rgba(ThemeTokens.border.r, ThemeTokens.border.g, ThemeTokens.border.b, 0.8))

        Behavior on implicitWidth { NumberAnimation { duration: 150; easing.type: Easing.OutCubic } }
        Behavior on implicitHeight { NumberAnimation { duration: 150; easing.type: Easing.OutCubic } }
        Behavior on color { ColorAnimation { duration: 150 } }
    }

    // Transparent Runway
    background: Rectangle {
        implicitWidth: control.expandedSize
        implicitHeight: control.expandedSize
        color: "transparent"
    }
}
