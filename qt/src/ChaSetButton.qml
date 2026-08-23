import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

// ChaSet Button for Qt (QML), implementing the API contract from
// spec/components/button.ts and the capabilities in spec/capabilities.json.
Item {
    id: root

    // ---- API contract (mirrors spec/components/button.ts) ----
    property string variant: "primary"   // primary | secondary | ghost | danger
    property string size: "md"           // sm | md | lg
    property bool loading: false
    property bool fullWidth: false
    property bool disabled: false
    property string text: ""

    signal clicked()

    readonly property bool effectiveDisabled: disabled || loading

    function hoveredColor(base) {
        switch (variant) {
        case "primary":  return Theme.colorPrimaryHover
        case "secondary": return Theme.colorSecondaryHover
        case "danger":   return Theme.colorDangerHover
        case "ghost":    return Theme.colorGhostHover
        default:         return base
        }
    }

    function bgColor() {
        if (effectiveDisabled || tap.pressed && variant === "ghost") return hoveredColor(Theme.colorText)
        switch (variant) {
        case "secondary": return Theme.colorSecondary
        case "ghost":     return "transparent"
        case "danger":    return Theme.colorDanger
        default:          return Theme.colorPrimary
        }
    }

    function fgColor() {
        switch (variant) {
        case "secondary": return Theme.colorSecondaryForeground
        case "ghost":     return Theme.colorText
        case "danger":    return Theme.colorDangerForeground
        default:          return Theme.colorPrimaryForeground
        }
    }

    function paddingH() {
        switch (size) {
        case "sm": return Theme.paddingSmH
        case "lg": return Theme.paddingLgH
        default:   return Theme.paddingMdH
        }
    }
    function paddingV() {
        switch (size) {
        case "sm": return Theme.paddingSmV
        case "lg": return Theme.paddingLgV
        default:   return Theme.paddingMdV
        }
    }
    function fontSizePx() {
        switch (size) {
        case "sm": return Theme.fontSm
        case "lg": return Theme.fontLg
        default:   return Theme.fontMd
        }
    }

    implicitWidth: (text !== "" ? text.width : fontSizePx()) + paddingH() * 2 + Theme.spacingGapSm
    implicitHeight: fontSizePx() + paddingV() * 2

    property bool down: false
    property bool hovered: false

    Accessible.role: Accessible.Button
    Accessible.name: text

    // Background
    Rectangle {
        id: bg
        anchors.fill: root
        radius: Theme.radiusControl
        color: down
                 ? (variant === "primary" ? Theme.colorPrimaryActive : hoveredColor(Theme.colorText))
                 : (hovered && !effectiveDisabled ? hoveredColor(Theme.colorText) : bgColor())
        border.color: variant === "secondary" ? Theme.colorBorder : "transparent"
        border.width: variant === "secondary" ? 1 : 0

        Behavior on color { ColorAnimation { duration: 120 } }
        opacity: effectiveDisabled ? 0.6 : 1.0
    }

    // Focus ring (a11y)
    Rectangle {
        anchors.fill: root
        anchors.margins: -3
        radius: Theme.radiusControl + 3
        color: "transparent"
        border.color: root.activeFocus ? Theme.colorPrimary : "transparent"
        border.width: 2
        visible: root.activeFocus
    }

    // Label
    Text {
        id: label
        anchors.centerIn: root
        anchors.leftMargin: paddingH()
        anchors.rightMargin: paddingH()
        text: root.text
        color: fgColor()
        font.pixelSize: fontSizePx()
        font.weight: Theme.fontWeightMedium
        horizontalAlignment: Text.AlignHCenter
        verticalAlignment: Text.AlignVCenter
        opacity: loading ? 0.7 : 1.0
    }

    // Spinner (loading)
    Rectangle {
        id: spinner
        visible: loading
        width: fontSizePx()
        height: fontSizePx()
        anchors.centerIn: root
        color: "transparent"
        border.color: fgColor()
        border.width: 2
        radius: width / 2

        // spinning tick
        Rectangle {
            width: 2
            height: width
            color: fgColor()
            anchors.top: parent.top
            anchors.horizontalCenter: parent.horizontalCenter
            radius: width / 2
        }

        RotationAnimation {
            id: spin
            target: spinner
            property: "rotation"
            running: root.loading
            loops: Animation.Infinite
            from: 0
            to: 360
            duration: 600
        }
    }

    // Hover (mouse hover)
    HoverHandler {
        id: hoverHandler
        enabled: !effectiveDisabled
        onHoveredChanged: root.hovered = hoverHandler.hovered
    }

    // Tap (click) — blocks when disabled/loading
    TapHandler {
        id: tap
        acceptedButtons: Qt.LeftButton
        enabled: !effectiveDisabled
        onTapped: root.clicked()
        onPressedChanged: {
            root.down = tap.pressed
            if (!tap.pressed) root.hovered = hoverHandler.hovered
            else root.hovered = true
        }
    }

    // Keyboard activation (native button behaviour): Space / Enter when focused
    Keys.onSpacePressed: (event) => {
        event.accepted = true
        if (!effectiveDisabled) { down = true; root.clicked() }
    }
    Keys.onReturnPressed: (event) => {
        event.accepted = true
        if (!effectiveDisabled) root.clicked()
    }
    Keys.onReleased: (event) => { if (event.key === Qt.Key_Space) down = false }

    focusPolicy: Qt.TabFocus
}