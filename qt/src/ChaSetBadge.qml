// ChaSetBadge.qml — Compact status / label pill matching React Badge.tsx 1:1
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Rectangle {
    id: root

    property string variant: "default"     // "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"
    property string size: "default"        // "default" | "sm"
    property string text: ""
    property bool dot: false
    property color dotColor: root.variant === "default" ? "#ffffff" : ThemeTokens.accent
    property bool removable: false
    property bool interactive: false
    property string iconSource: ""

    property bool forceHover: false
    property bool forceActive: false

    signal clicked()
    signal removed()

    property bool hovered: false
    property bool down: false
    readonly property bool effectiveHovered: (hovered || forceHover)
    readonly property bool effectiveDown: (down || forceActive)

    property bool isDark: ThemeTokens.dark

    // Dimensions based on size scale: default (h-5), sm (h-4)
    readonly property bool isSm: root.size === "sm"
    implicitHeight: isSm ? 16 : 20
    implicitWidth: Math.max(isSm ? 16 : 20, contentRow.implicitWidth + (isSm ? 12 : 16))
    radius: isSm ? 4 : 10

    // Background Color
    color: {
        if (root.variant === "link") return "transparent"
        if (root.variant === "ghost") {
            if (root.effectiveDown) return isDark ? Qt.rgba(0.18, 0.23, 0.32, 0.8) : Qt.rgba(0.95, 0.96, 0.97, 1.0)
            if (root.effectiveHovered) return isDark ? Qt.rgba(0.15, 0.2, 0.28, 1.0) : Qt.rgba(0.945, 0.961, 0.976, 1.0)
            return "transparent"
        }

        if (root.effectiveDown) {
            if (root.variant === "default") return Qt.rgba(0.29, 0.584, 0.902, 1.0)      // #4a95e6
            if (root.variant === "secondary") return isDark ? Qt.rgba(0.18, 0.23, 0.32, 1.0) : Qt.rgba(0.96, 0.973, 0.984, 1.0)
            if (root.variant === "outline") return isDark ? Qt.rgba(0.18, 0.23, 0.32, 1.0) : Qt.rgba(0.957, 0.969, 0.98, 1.0)
            if (root.variant === "destructive") return Qt.rgba(0.937, 0.267, 0.267, 0.25)
        }
        if (root.effectiveHovered) {
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
            return isDark ? Qt.rgba(0.937, 0.267, 0.267, 0.2) : Qt.rgba(253.0 / 255.0, 236.0 / 255.0, 236.0 / 255.0, 1.0)
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

    Row {
        id: contentRow
        anchors.centerIn: parent
        spacing: root.isSm ? 3 : 4

        // Status Dot
        Rectangle {
            id: statusDot
            visible: root.dot
            width: root.isSm ? 5 : 6
            height: width
            radius: width / 2
            color: root.dotColor
            anchors.verticalCenter: parent.verticalCenter
        }

        // Optional Icon
        Image {
            id: badgeIcon
            visible: root.iconSource !== ""
            width: root.isSm ? 10 : 12
            height: width
            source: root.iconSource
            sourceSize.width: width
            sourceSize.height: height
            fillMode: Image.PreserveAspectFit
            anchors.verticalCenter: parent.verticalCenter
        }

        // Label Text
        Text {
            id: badgeText
            text: root.text
            font.pixelSize: root.isSm ? 10 : 12
            font.weight: Font.DemiBold
            font.family: root.isSm ? "monospace, Consolas, 'Courier New'" : "inherit"
            font.underline: root.variant === "link"
            anchors.verticalCenter: parent.verticalCenter
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

        // Optional Dismiss Button
        Item {
            id: removeBtn
            visible: root.removable
            width: root.isSm ? 10 : 12
            height: width
            anchors.verticalCenter: parent.verticalCenter

            Text {
                anchors.centerIn: parent
                text: "×"
                font.pixelSize: root.isSm ? 11 : 13
                font.weight: Font.Bold
                color: badgeText.color
                opacity: removeTap.pressed ? 1.0 : (removeHover.hovered ? 0.9 : 0.6)
            }

            HoverHandler {
                id: removeHover
                cursorShape: Qt.PointingHandCursor
            }

            TapHandler {
                id: removeTap
                onTapped: root.removed()
            }
        }
    }

    HoverHandler {
        id: hoverHandler
        enabled: root.interactive || root.variant === "link"
        cursorShape: enabled ? Qt.PointingHandCursor : Qt.ArrowCursor
        onHoveredChanged: root.hovered = hoverHandler.hovered
    }

    TapHandler {
        id: tap
        enabled: root.interactive || root.variant === "link"
        onTapped: root.clicked()
        onPressedChanged: root.down = tap.pressed
    }
}
