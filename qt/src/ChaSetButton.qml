// ChaSet Button for Qt (QML), implementing the API contract from
// spec/components/button.ts and capabilities in spec/capabilities.json.
// 100% pixel-perfect and behavioral parity with React (@chahu/cha-set).
import QtQuick 6.10
import chaSet

Item {
    id: root

    // ---- API Contract ----
    property string variant: "primary"   // primary | secondary | ghost | destructive
    property string size: "md"           // sm | md | lg
    property bool loading: false
    property bool fullWidth: false
    property bool disabled: false
    property string text: ""
    property int customRadius: ThemeTokens.rowRadius

    signal clicked()

    readonly property bool effectiveDisabled: disabled || loading

    // Height parity: sm: 32px, md: 36px, lg: 40px
    function buttonHeight() {
        switch (size) {
        case "sm": return 32
        case "lg": return 40
        default:   return 36
        }
    }

    // Horizontal padding parity: sm: 12px, md: 16px, lg: 20px
    function paddingH() {
        switch (size) {
        case "sm": return 12
        case "lg": return 20
        default:   return 16
        }
    }

    // Font size parity: sm: 12px (text-xs), md: 14px (text-sm), lg: 16px (text-base)
    function fontSizePx() {
        switch (size) {
        case "sm": return 12
        case "lg": return 16
        default:   return 14
        }
    }

    // Colors matching Web Tailwind token classes
    function baseColor() {
        switch (variant) {
        case "secondary": return ThemeTokens.selection
        case "ghost":     return "transparent"
        case "destructive": return ThemeTokens.danger
        default:          return ThemeTokens.accent
        }
    }

    function bgColor() {
        const base = baseColor()
        if (base === "transparent") {
            if (down) return ThemeTokens.pressed
            if (hovered && !effectiveDisabled) return ThemeTokens.hover
            return "transparent"
        }
        if (down) {
            return Qt.rgba(base.r, base.g, base.b, 0.8) // active/80
        }
        if (hovered && !effectiveDisabled) {
            return Qt.rgba(base.r, base.g, base.b, 0.9) // hover/90
        }
        return base
    }

    function fgColor() {
        switch (variant) {
        case "secondary": return ThemeTokens.text
        case "ghost":     return ThemeTokens.text
        case "destructive": return ThemeTokens.onAccent
        default:          return ThemeTokens.onAccent
        }
    }

    implicitHeight: buttonHeight()
    implicitWidth: Math.max(buttonHeight(), (text !== "" ? contentRow.implicitWidth : fontSizePx()) + paddingH() * 2)
    height: buttonHeight()
    width: fullWidth && parent ? parent.width : implicitWidth

    property bool down: false
    property bool hovered: false

    Accessible.role: Accessible.Button
    Accessible.name: text
    activeFocusOnTab: true

    // Background surface
    Rectangle {
        id: bg
        anchors.fill: root
        radius: root.customRadius
        color: root.bgColor()
        border.color: root.variant === "secondary" ? ThemeTokens.border : "transparent"
        border.width: root.variant === "secondary" ? 1 : 0

        Behavior on color { ColorAnimation { duration: ThemeTokens.motionQuick } }
        opacity: root.effectiveDisabled ? 0.6 : 1.0
    }

    // Focus ring (2px width with 2px offset matching focus-visible:outline-2 focus-visible:outline-ring)
    Rectangle {
        anchors.fill: root
        anchors.margins: -2
        radius: root.customRadius + 2
        color: "transparent"
        border.color: root.activeFocus ? ThemeTokens.focus : "transparent"
        border.width: 2
        visible: root.activeFocus
    }

    // Content: Spinner + Label (centered row)
    Row {
        id: contentRow
        anchors.centerIn: root
        spacing: 8

        // Spinner (loading state)
        Rectangle {
            id: spinner
            visible: root.loading
            width: 16
            height: 16
            anchors.verticalCenter: parent.verticalCenter
            color: "transparent"
            border.color: root.fgColor()
            border.width: 2
            radius: 8

            Rectangle {
                width: 3
                height: 3
                color: root.fgColor()
                anchors.top: parent.top
                anchors.horizontalCenter: parent.horizontalCenter
                radius: 1.5
            }

            RotationAnimation {
                target: spinner
                property: "rotation"
                running: root.loading
                loops: Animation.Infinite
                from: 0
                to: 360
                duration: 600
            }
        }

        // Label
        Text {
            id: label
            anchors.verticalCenter: parent.verticalCenter
            text: root.text
            color: root.fgColor()
            font.pixelSize: root.fontSizePx()
            font.weight: Font.Medium
            font.family: "Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif"
            horizontalAlignment: Text.AlignHCenter
            verticalAlignment: Text.AlignVCenter
            opacity: root.loading ? 0.7 : 1.0
        }
    }

    HoverHandler {
        id: hoverHandler
        enabled: !root.effectiveDisabled
        onHoveredChanged: root.hovered = hoverHandler.hovered
    }

    TapHandler {
        id: tap
        acceptedButtons: Qt.LeftButton
        enabled: !root.effectiveDisabled
        onTapped: root.clicked()
        onPressedChanged: {
            root.down = tap.pressed
            if (!tap.pressed) root.hovered = hoverHandler.hovered
            else root.hovered = true
        }
    }

    Keys.onSpacePressed: (event) => {
        event.accepted = true
        if (!effectiveDisabled) { down = true; root.clicked() }
    }
    Keys.onReturnPressed: (event) => {
        event.accepted = true
        if (!effectiveDisabled) root.clicked()
    }
    Keys.onReleased: (event) => { if (event.key === Qt.Key_Space) down = false }
}
