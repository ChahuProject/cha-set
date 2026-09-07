// ChaSetBadge.qml — Compact status / label pill matching React Badge.tsx 1:1
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Rectangle {
    id: root

    property string variant: "default"     // "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"
    property string size: "default"        // "default" | "sm"
    property string text: ""
    property bool forceHover: false
    property bool forceActive: false

    property bool isDark: ThemeTokens.dark

    // Dimensions based on size: default 20px (h-5), sm 16px (h-4)
    readonly property bool isSm: root.size === "sm"
    implicitHeight: isSm ? 16 : 20
    implicitWidth: Math.max(isSm ? 16 : 20, badgeText.implicitWidth + (isSm ? 12 : 16))
    radius: isSm ? 4 : 10

    // Background Color
    color: {
        if (root.variant === "link") return "transparent"
        if (root.variant === "ghost") {
            if (root.forceActive) return isDark ? Qt.rgba(0.18, 0.23, 0.32, 0.8) : Qt.rgba(0.95, 0.96, 0.97, 1.0)
            if (root.forceHover) return isDark ? Qt.rgba(0.15, 0.2, 0.28, 1.0) : Qt.rgba(0.945, 0.961, 0.976, 1.0)
            return "transparent"
        }

        if (root.forceActive) {
            if (root.variant === "default") return Qt.rgba(0.29, 0.584, 0.902, 1.0)      // #4a95e6
            if (root.variant === "secondary") return isDark ? Qt.rgba(0.18, 0.23, 0.32, 1.0) : Qt.rgba(0.96, 0.973, 0.984, 1.0)
            if (root.variant === "outline") return isDark ? Qt.rgba(0.18, 0.23, 0.32, 1.0) : Qt.rgba(0.957, 0.969, 0.98, 1.0)
            if (root.variant === "destructive") return Qt.rgba(0.937, 0.267, 0.267, 0.25)
        }
        if (root.forceHover) {
            if (root.variant === "default") return Qt.rgba(0.2, 0.529, 0.89, 1.0)        // #3387e3
            if (root.variant === "secondary") return isDark ? Qt.rgba(0.15, 0.2, 0.28, 1.0) : Qt.rgba(0.957, 0.969, 0.98, 1.0)
            if (root.variant === "outline") return isDark ? Qt.rgba(0.15, 0.2, 0.28, 1.0) : Qt.rgba(0.945, 0.961, 0.976, 1.0)
            if (root.variant === "destructive") return Qt.rgba(0.937, 0.267, 0.267, 0.2)
        }

        if (root.variant === "default") {
            return ThemeTokens.accent
        } else if (root.variant === "secondary") {
            return isDark ? Qt.rgba(0.118, 0.161, 0.231, 1.0) : Qt.rgba(0.945, 0.961, 0.976, 1.0) // #f1f5f9
        } else if (root.variant === "destructive") {
            return Qt.rgba(0.937, 0.267, 0.267, 0.15)
        } else if (root.variant === "outline") {
            return isDark ? Qt.rgba(0.008, 0.031, 0.09, 1.0) : Qt.rgba(1.0, 1.0, 1.0, 1.0)
        }
        return ThemeTokens.accent
    }

    // Border configuration
    border.width: (root.variant === "outline" || (root.isSm && root.variant === "secondary")) ? 1 : 0
    border.color: {
        if (root.variant === "outline") {
            return ThemeTokens.border
        }
        if (root.isSm && root.variant === "secondary") {
            return Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.2)
        }
        return "transparent"
    }

    // Label Text
    Text {
        id: badgeText
        anchors.centerIn: parent
        text: root.text
        font.pixelSize: root.isSm ? 10 : 12
        font.weight: Font.DemiBold
        font.family: root.isSm ? "monospace, Consolas, 'Courier New'" : "inherit"
        font.underline: root.variant === "link"
        color: {
            if (root.variant === "default") {
                return "#ffffff"
            } else if (root.variant === "destructive") {
                return Qt.rgba(0.937, 0.267, 0.267, 1.0)
            } else if (root.variant === "link") {
                return ThemeTokens.accent
            } else if (root.variant === "secondary") {
                if (root.isSm) return ThemeTokens.accent
                return ThemeTokens.text
            } else if (root.variant === "outline" || root.variant === "ghost") {
                return ThemeTokens.text
            }
            return ThemeTokens.text
        }
    }
}
