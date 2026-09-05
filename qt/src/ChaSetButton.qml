// ChaSet Button for Qt (QML), implementing the API contract from
// spec/components/button.ts and capabilities in spec/capabilities.json.
// 100% pixel-perfect and behavioral parity with React (@chahu/cha-set).
import QtQuick 6.10
import ChaSet

Item {
    id: root

    // ---- API Contract (shadcn/ui aligned) ----
    property string variant: "default"   // default | destructive | outline | secondary | ghost | link
    property string size: "default"      // default | sm | lg | icon
    property bool loading: false
    property bool fullWidth: false
    property bool disabled: false
    property string text: ""
    property string iconSource: ""
    property int customRadius: 6

    property bool forceHover: false
    property bool forceActive: false

    signal clicked()

    readonly property bool effectiveDisabled: disabled || loading
    readonly property bool effectiveHovered: (hovered || forceHover) && !effectiveDisabled
    readonly property bool effectiveDown: (down || forceActive) && !effectiveDisabled

    // Height parity: sm: 32px, default/md/icon: 36px, lg: 40px
    function buttonHeight() {
        switch (size) {
        case "sm": return 32
        case "lg": return 40
        default:   return 36
        }
    }

    // Horizontal padding parity: sm: 12px, default/md: 16px, lg: 24px, icon: 0px
    function paddingH() {
        if (size === "icon") return 0
        switch (size) {
        case "sm": return 12
        case "lg": return 24
        default:   return 16
        }
    }

    // Font size parity: sm: 12px (text-xs), default/md/icon: 14px (text-sm), lg: 16px (text-base)
    function fontSizePx() {
        switch (size) {
        case "sm": return 12
        case "lg": return 16
        default:   return 14
        }
    }

    // Colors matching Web Tailwind token classes (shadcn standard)
    readonly property color cPrimary: ThemeTokens.dark ? Qt.rgba(48.0 / 255.0, 160.0 / 255.0, 255.0 / 255.0, 1.0) : Qt.rgba(29.0 / 255.0, 122.0 / 255.0, 224.0 / 255.0, 1.0)
    readonly property color cDestructive: Qt.rgba(239.0 / 255.0, 68.0 / 255.0, 68.0 / 255.0, 1.0)
    readonly property color cBackground: ThemeTokens.dark ? Qt.rgba(2.0 / 255.0, 8.0 / 255.0, 23.0 / 255.0, 1.0) : Qt.rgba(1.0, 1.0, 1.0, 1.0)
    readonly property color cBorder: ThemeTokens.dark ? Qt.rgba(30.0 / 255.0, 41.0 / 255.0, 59.0 / 255.0, 1.0) : Qt.rgba(226.0 / 255.0, 232.0 / 255.0, 240.0 / 255.0, 1.0)
    readonly property color cFg: ThemeTokens.dark ? Qt.rgba(248.0 / 255.0, 250.0 / 255.0, 252.0 / 255.0, 1.0) : Qt.rgba(2.0 / 255.0, 8.0 / 255.0, 23.0 / 255.0, 1.0)
    readonly property color cAccentBg: ThemeTokens.dark ? Qt.rgba(30.0 / 255.0, 41.0 / 255.0, 59.0 / 255.0, 1.0) : Qt.rgba(241.0 / 255.0, 245.0 / 255.0, 249.0 / 255.0, 1.0)
    readonly property color cAccentFg: ThemeTokens.dark ? Qt.rgba(248.0 / 255.0, 250.0 / 255.0, 252.0 / 255.0, 1.0) : Qt.rgba(15.0 / 255.0, 23.0 / 255.0, 42.0 / 255.0, 1.0)
    readonly property color cSecondaryBg: cAccentBg
    readonly property color cSecondaryFg: cAccentFg

    function bgColor() {
        if (variant === "ghost" || variant === "link") {
            if (variant === "link") return "transparent"
            if (effectiveDown) return ThemeTokens.dark ? Qt.rgba(30.0 / 255.0, 41.0 / 255.0, 59.0 / 255.0, 0.8) : Qt.rgba(244.0 / 255.0, 247.0 / 255.0, 250.0 / 255.0, 1.0)
            if (effectiveHovered) return cAccentBg
            return "transparent"
        }

        if (variant === "outline") {
            if (effectiveDown) return ThemeTokens.dark ? Qt.rgba(30.0 / 255.0, 41.0 / 255.0, 59.0 / 255.0, 0.8) : Qt.rgba(244.0 / 255.0, 247.0 / 255.0, 250.0 / 255.0, 1.0)
            if (effectiveHovered) return cAccentBg
            return cBackground
        }

        if (variant === "secondary") {
            if (effectiveDown) return ThemeTokens.dark ? Qt.rgba(30.0 / 255.0, 41.0 / 255.0, 59.0 / 255.0, 0.7) : Qt.rgba(245.0 / 255.0, 248.0 / 255.0, 251.0 / 255.0, 1.0)
            if (effectiveHovered) return ThemeTokens.dark ? Qt.rgba(30.0 / 255.0, 41.0 / 255.0, 59.0 / 255.0, 0.8) : Qt.rgba(244.0 / 255.0, 247.0 / 255.0, 250.0 / 255.0, 1.0)
            return cSecondaryBg
        }

        if (variant === "destructive") {
            if (effectiveDown) return Qt.rgba(cDestructive.r, cDestructive.g, cDestructive.b, 0.8)
            if (effectiveHovered) return Qt.rgba(cDestructive.r, cDestructive.g, cDestructive.b, 0.9)
            return cDestructive
        }

        // default / primary
        const base = cPrimary
        if (effectiveDown) return Qt.rgba(74.0 / 255.0, 149.0 / 255.0, 230.0 / 255.0, 1.0)
        if (effectiveHovered) return Qt.rgba(51.0 / 255.0, 135.0 / 255.0, 227.0 / 255.0, 1.0)
        return base
    }

    function fgColor() {
        switch (variant) {
        case "destructive": return ThemeTokens.onAccent
        case "outline":     return effectiveHovered ? cAccentFg : cFg
        case "secondary":   return cSecondaryFg
        case "ghost":       return effectiveHovered ? cAccentFg : cFg
        case "link":        return cPrimary
        case "default":
        case "primary":
        default:            return ThemeTokens.onAccent
        }
    }

    function hasBorder() {
        return variant === "outline"
    }

    function isIconButton() {
        return size === "icon"
    }

    implicitHeight: buttonHeight()
    implicitWidth: isIconButton()
        ? buttonHeight()
        : Math.max(buttonHeight(), (text !== "" || iconSource !== "" ? contentRow.implicitWidth : fontSizePx()) + paddingH() * 2)
    height: buttonHeight()
    width: fullWidth && parent ? parent.width : implicitWidth

    property bool down: false
    property bool hovered: false

    Accessible.role: Accessible.Button
    Accessible.name: text !== "" ? text : (isIconButton() ? "Icon Button" : "")
    activeFocusOnTab: true

    // Subtle drop shadow / depth for solid & outline variants (shadcn shadow-xs)
    Rectangle {
        id: shadowDepth
        anchors.fill: root
        anchors.topMargin: 1
        radius: root.customRadius
        color: root.hasBorder() || root.variant === "default" || root.variant === "primary" || root.variant === "secondary" || root.variant === "destructive"
               ? Qt.rgba(0, 0, 0, ThemeTokens.dark ? 0.25 : 0.06)
               : "transparent"
        visible: !root.effectiveDown && !root.effectiveDisabled && (root.variant !== "ghost" && root.variant !== "link")
    }

    // Background surface
    Rectangle {
        id: bg
        anchors.fill: root
        radius: root.customRadius
        color: root.bgColor()
        border.color: root.hasBorder() ? root.cBorder : "transparent"
        border.width: root.hasBorder() ? 1 : 0

        Behavior on color { ColorAnimation { duration: ThemeTokens.motionQuick } }
        opacity: root.effectiveDisabled ? 0.5 : 1.0
    }

    // Focus ring (2px offset ring matching focus-visible:ring-2 focus-visible:ring-ring)
    Rectangle {
        anchors.fill: root
        anchors.margins: -2
        radius: root.customRadius + 2
        color: "transparent"
        border.color: root.activeFocus ? ThemeTokens.focus : "transparent"
        border.width: 2
        visible: root.activeFocus
    }

    // Content: Spinner + Icon + Label (centered row)
    Row {
        id: contentRow
        anchors.centerIn: root
        spacing: 8

        // Spinner (loading state)
        Rectangle {
            id: spinner
            visible: root.loading
            width: root.loading ? 16 : 0
            height: root.loading ? 16 : 0
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

        // Optional Icon
        Image {
            id: btnIcon
            visible: !root.loading && root.iconSource !== ""
            width: visible ? (root.size === "sm" ? 14 : 16) : 0
            height: width
            anchors.verticalCenter: parent.verticalCenter
            source: root.iconSource
            sourceSize.width: width
            sourceSize.height: height
            fillMode: Image.PreserveAspectFit
        }

        // Label
        Text {
            id: label
            visible: root.text !== ""
            anchors.verticalCenter: parent.verticalCenter
            text: root.text
            color: root.fgColor()
            font.pixelSize: root.fontSizePx()
            font.weight: Font.Medium
            font.family: "Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif"
            font.underline: root.variant === "link" && root.effectiveHovered
            horizontalAlignment: Text.AlignHCenter
            verticalAlignment: Text.AlignVCenter
            opacity: root.loading ? 0.7 : 1.0
        }
    }

    HoverHandler {
        id: hoverHandler
        enabled: !root.effectiveDisabled
        cursorShape: root.effectiveDisabled ? Qt.ArrowCursor : Qt.PointingHandCursor
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
