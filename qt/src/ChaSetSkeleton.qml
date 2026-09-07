// ChaSetSkeleton.qml — Cross-Stack Skeleton Component
import QtQuick 6.10
import ChaSet

Rectangle {
    id: root

    property int customRadius: 4
    property bool animate: true

    color: ThemeTokens.hover
    radius: root.customRadius
    opacity: 0.6

    SequentialAnimation on opacity {
        running: root.animate
        loops: Animation.Infinite
        NumberAnimation { to: 0.3; duration: 800; easing.type: Easing.InOutQuad }
        NumberAnimation { to: 0.7; duration: 800; easing.type: Easing.InOutQuad }
    }
}
