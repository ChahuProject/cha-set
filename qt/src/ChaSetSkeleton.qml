// ChaSetSkeleton.qml — Cross-Stack Skeleton Component
import QtQuick 6.10
import ChaSet

Rectangle {
    id: root

    property string rounded: "md" // "none" | "sm" | "md" | "lg" | "full"
    property string animation: "pulse" // "pulse" | "wave" | "none"
    property bool animate: animation !== "none"
    property int customRadius: -1

    color: ThemeTokens.hover
    radius: root.customRadius >= 0 ? root.customRadius : (root.rounded === "none" ? 0 : (root.rounded === "sm" ? 2 : (root.rounded === "lg" ? 8 : (root.rounded === "full" ? Math.min(width, height) / 2 : 4))))
    clip: true
    opacity: root.animate && root.animation === "pulse" ? 0.6 : 0.85

    SequentialAnimation on opacity {
        running: root.animate && root.animation === "pulse"
        loops: Animation.Infinite
        NumberAnimation { to: 0.3; duration: 800; easing.type: Easing.InOutQuad }
        NumberAnimation { to: 0.7; duration: 800; easing.type: Easing.InOutQuad }
    }

    Rectangle {
        id: waveHighlight
        visible: root.animate && root.animation === "wave"
        width: Math.max(parent.width * 0.6, 40)
        height: parent.height
        opacity: 0.25
        gradient: Gradient {
            orientation: Gradient.Horizontal
            GradientStop { position: 0.0; color: "transparent" }
            GradientStop { position: 0.5; color: ThemeTokens.text }
            GradientStop { position: 1.0; color: "transparent" }
        }

        NumberAnimation on x {
            running: root.animate && root.animation === "wave"
            from: -waveHighlight.width
            to: root.width
            duration: 1200
            loops: Animation.Infinite
            easing.type: Easing.InOutQuad
        }
    }
}
