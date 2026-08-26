// ChaSet Button for Qt (QML), implementing the API contract from
// spec/components/button.ts and the capabilities in spec/capabilities.json.
// All colors come from the GENERATED ThemeTokens singleton (spec/tokens.json,
// dunting preset) — accentHover/accentPressed stay runtime-derived here,
// mirroring dt-a's ThemeManager behaviour.
import QtQuick 6.10
import chaSet

Item {
    id: root

    // ---- API contract (mirrors spec/components/button.ts) ----
    property string variant: "primary"   // primary | secondary | ghost | destructive
    property string size: "md"           // sm | md | lg
    property bool loading: false
    property bool fullWidth: false
    property bool disabled: false
    property string text: ""

    signal clicked()

    readonly property bool effectiveDisabled: disabled || loading
    readonly property color cAccentHover: Qt.lighter(ThemeTokens.accent, 1.12)
    readonly property color cAccentPressed: Qt.darker(ThemeTokens.accent, 1.10)

    function hoverBg() {
        switch (variant) {
        case "primary":   return cAccentHover
        case "secondary": return ThemeTokens.selection
        case "destructive": return ThemeTokens.dangerHover
        case "ghost":       return ThemeTokens.hover
        default:          return ThemeTokens.hover
        }
    }

    function bgColor() {
        if (down) {
            switch (variant) {
            case "primary":   return cAccentPressed
            case "secondary": return ThemeTokens.selection
            case "destructive": return ThemeTokens.dangerHover
            default:          return ThemeTokens.hover
            }
        }
        if (hovered && !effectiveDisabled) return hoverBg()
        switch (variant) {
        case "secondary": return ThemeTokens.panelRaised
        case "ghost":     return "transparent"
        case "destructive": return ThemeTokens.danger
        default:          return ThemeTokens.accent
        }
    }

    function fgColor() {
        switch (variant) {
        case "secondary": return ThemeTokens.text
        case "ghost":     return ThemeTokens.text
        case "destructive": return ThemeTokens.onAccent
        default:          return ThemeTokens.onAccent
        }
    }

    function paddingH() {
        switch (size) {
        case "sm": return ThemeTokens.space4   // 12
        case "lg": return ThemeTokens.space6   // 24
        default:   return ThemeTokens.space5   // 16
        }
    }
    function paddingV() {
        switch (size) {
        case "sm": return ThemeTokens.space2   // 4
        case "lg": return ThemeTokens.space4   // 12
        default:   return ThemeTokens.space3   // 8
        }
    }
    function fontSizePx() {
        switch (size) {
        case "sm": return ThemeTokens.fontSizeSmall    // 12
        case "lg": return ThemeTokens.fontSizeHeading  // 16
        default:   return ThemeTokens.fontSizeBody     // 13
        }
    }

    implicitWidth: (text !== "" ? label.implicitWidth : fontSizePx()) + paddingH() * 2
    implicitHeight: fontSizePx() + paddingV() * 2
    width: fullWidth && parent ? parent.width : implicitWidth

    property bool down: false
    property bool hovered: false

    Accessible.role: Accessible.Button
    Accessible.name: text
    activeFocusOnTab: true

    // Background
    Rectangle {
        id: bg
        anchors.fill: root
        radius: ThemeTokens.rowRadius
        color: root.bgColor()
        border.color: root.variant === "secondary" ? ThemeTokens.border : "transparent"
        border.width: root.variant === "secondary" ? 1 : 0

        Behavior on color { ColorAnimation { duration: ThemeTokens.motionQuick } }
        opacity: root.effectiveDisabled ? 0.6 : 1.0
    }

    // Focus ring (a11y)
    Rectangle {
        anchors.fill: root
        anchors.margins: -3
        radius: ThemeTokens.rowRadius + 3
        color: "transparent"
        border.color: root.activeFocus ? ThemeTokens.accent : "transparent"
        border.width: 2
        visible: root.activeFocus
    }

    // Label
    Text {
        id: label
        anchors.centerIn: root
        text: root.text
        color: root.fgColor()
        font.pixelSize: root.fontSizePx()
        font.weight: Font.Medium
        horizontalAlignment: Text.AlignHCenter
        verticalAlignment: Text.AlignVCenter
        opacity: loading ? 0.7 : 1.0
    }

    // Spinner (loading)
    Rectangle {
        id: spinner
        visible: loading
        width: root.fontSizePx()
        height: root.fontSizePx()
        anchors.centerIn: root
        color: "transparent"
        border.color: root.fgColor()
        border.width: 2
        radius: width / 2

        Rectangle {
            width: 2
            height: width
            color: root.fgColor()
            anchors.top: parent.top
            anchors.horizontalCenter: parent.horizontalCenter
            radius: width / 2
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
