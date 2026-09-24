// ChaSet ScrollBar for Qt (QML)
// Professional Cross-Stack ScrollBar implementation:
// 1. Dual-mode Theme Adapter (operates seamlessly with ThemeTokens or dunting-qt ThemeManager)
// 2. Interaction zone preventing Win32 window resizing border conflict
// 3. Dynamic symmetric expansion (idle -> hover/drag) with zero-latency thumb tracking
// 4. Guaranteed minimum thumb length for large item datasets
// 5. Two-end stepper navigation buttons with autoRepeat and boundary clamping
// 6. Automatic auto-hide when content fits without overflow

import QtQuick 6.10
import QtQuick.Controls 6.10
import QtQuick.Templates 6.10 as T
import ChaSet 1.0

T.ScrollBar {
    id: control

    // ---- Desktop Geometry Properties ----
    property string barSize: "default" // "default" | "sm"
    readonly property bool isSm: barSize === "sm"
    property int hitThickness: ThemeTokens.dp(isSm ? 12 : 16)
    property int thumbThickness: ThemeTokens.dp(isSm ? 2 : 4)
    property int expandedThumbThickness: ThemeTokens.dp(isSm ? 6 : 10)
    property int minThumbLength: ThemeTokens.dp(isSm ? 20 : 30)
    property int buttonLength: ThemeTokens.dp(isSm ? 10 : 14)
    property bool showButtons: true
    property bool autoRepeat: true
    property int autoRepeatDelay: 400
    property int autoRepeatInterval: 100
    property real pageStepRatio: 0.85
    property bool smoothScroll: true
    property var scrollArea: null
    readonly property var _scrollTarget: scrollArea

    // Deterministic state overrides for pixel testing
    property bool forceHover: false
    property bool forceActive: false
    property string forceButtonState: ""
    property bool extraHovered: false

    // Unified runway hover tracker with PointerHandler level tracking: never steals clicks or drags, never masked by child items or z-order
    HoverHandler {
        id: barHoverHandler
        cursorShape: control.pressed ? Qt.ClosedHandCursor : Qt.PointingHandCursor
    }
    readonly property bool isBarHovered: barHoverHandler.hovered

    // Backward compatibility aliases for cha-set showcase and tests
    property alias hitSize: control.hitThickness
    property alias collapsedSize: control.thumbThickness
    property alias expandedSize: control.expandedThumbThickness

    readonly property bool isVertical: control.vertical

    readonly property bool _hasSpaceForButtons: showButtons && ((vertical ? height : width) >= (buttonLength * 4 + ThemeTokens.dp(24)))

    topPadding: (vertical && _hasSpaceForButtons) ? (buttonLength * 2) : 0
    bottomPadding: (vertical && _hasSpaceForButtons) ? (buttonLength * 2) : 0
    leftPadding: (horizontal && _hasSpaceForButtons) ? (buttonLength * 2) : 0
    rightPadding: (horizontal && _hasSpaceForButtons) ? (buttonLength * 2) : 0
    padding: 0
    hoverEnabled: true

    minimumSize: 0.05
    implicitWidth: control.vertical ? control.hitThickness : 0
    implicitHeight: control.horizontal ? control.hitThickness : 0

    // ---- Theme Fallback Adapter ----
    // Seamlessly reads 'theme' if available (in dunting-qt), or falls back to 'ThemeTokens' (in cha-set)
    readonly property var _themeSource: (typeof theme !== "undefined" && theme) ? theme : ThemeTokens
    readonly property color _accent: _themeSource ? _themeSource.accent : "#30a0ff"
    readonly property color _text: _themeSource ? _themeSource.text : "#ffffff"
    readonly property color _subduedText: _themeSource ? _themeSource.subduedText : "#888888"
    readonly property color _panelRaised: (_themeSource && typeof _themeSource.panelRaised !== "undefined") ? _themeSource.panelRaised : (_themeSource && _themeSource.panel ? _themeSource.panel : "#222222")
    readonly property color _border: _themeSource ? _themeSource.border : "#444444"
    readonly property color _hoverColor: (_themeSource && typeof _themeSource.hover !== "undefined") ? _themeSource.hover : Qt.rgba(1, 1, 1, 0.1)

    // ---- Overflow & Visibility ----
    readonly property bool hasOverflow: _scrollTarget
        ? (isVertical ? (_scrollTarget.contentHeight > _scrollTarget.height) : (_scrollTarget.contentWidth > _scrollTarget.width))
        : (size > 0 && size < 0.99)

    policy: ScrollBar.AsNeeded
    readonly property bool _needed: policy === ScrollBar.AlwaysOn || (policy === ScrollBar.AsNeeded && hasOverflow)
    visible: _needed
    enabled: _needed
    active: _needed

    readonly property bool canScrollBack: _scrollTarget ? (isVertical ? !_scrollTarget.isAtTop : !_scrollTarget.isAtLeft) : (position > 0.0001 && size < 1.0)
    readonly property bool canScrollForward: _scrollTarget ? (isVertical ? !_scrollTarget.isAtBottom : !_scrollTarget.isAtRight) : (position < (1.0 - size - 0.0001) && size < 1.0)

    readonly property bool isAtStart: !canScrollBack
    readonly property bool isAtEnd: !canScrollForward

    // Expansion State
    readonly property bool _anyButtonHovered: (typeof btnStartTo !== "undefined" && btnStartTo._isHovered)
                                           || (typeof btnStartPage !== "undefined" && btnStartPage._isHovered)
                                           || (typeof btnEndPage !== "undefined" && btnEndPage._isHovered)
                                           || (typeof btnEndTo !== "undefined" && btnEndTo._isHovered)

    readonly property bool _isExpanded: control.forceHover || control.forceActive
                                        || control.hovered || barHoverHandler.hovered
                                        || _anyButtonHovered
                                        || control.extraHovered || control.pressed

    // Navigation Methods
    function scrollToStart() {
        if (_scrollTarget) {
            if (isVertical) _scrollTarget.scrollToTop(control.smoothScroll)
            else _scrollTarget.scrollToLeft(control.smoothScroll)
        } else if (canScrollBack) {
            position = 0.0
        }
    }

    function scrollPageBack() {
        if (_scrollTarget) {
            if (isVertical) _scrollTarget.pageUp(control.smoothScroll)
            else _scrollTarget.pageLeft(control.smoothScroll)
        } else if (canScrollBack) {
            position = Math.max(0.0, position - size)
        }
    }

    function scrollPageForward() {
        if (_scrollTarget) {
            if (isVertical) _scrollTarget.pageDown(control.smoothScroll)
            else _scrollTarget.pageRight(control.smoothScroll)
        } else if (canScrollForward) {
            position = Math.min(Math.max(0.0, 1.0 - size), position + size)
        }
    }

    function scrollToEnd() {
        if (_scrollTarget) {
            if (isVertical) _scrollTarget.scrollToBottom(control.smoothScroll)
            else _scrollTarget.scrollToRight(control.smoothScroll)
        } else if (canScrollForward) {
            position = Math.max(0.0, 1.0 - size)
        }
    }

    // Runway Background
    background: Rectangle {
        implicitWidth: control.vertical ? control.hitThickness : 0
        implicitHeight: control.horizontal ? control.hitThickness : 0
        color: control._isExpanded ? (ThemeTokens.dark ? Qt.rgba(30/255, 41/255, 59/255, 0.8) : Qt.rgba(241/255, 245/255, 249/255, 0.8)) : "transparent"
        radius: 0
        Behavior on color { enabled: ThemeTokens.animationsEnabled && !control.forceHover && !control.forceActive && (typeof harnessMode === "undefined" || harnessMode === ""); ColorAnimation { duration: ThemeTokens.motionShort } }
    }

    // Centered Thumb Item with Min Length Clamping
    contentItem: Item {
        implicitWidth: control.vertical ? control.hitThickness : 0
        implicitHeight: control.horizontal ? control.hitThickness : 0

        Rectangle {
            id: thumbRect
            readonly property real actualLength: control.vertical ? parent.height : parent.width
            readonly property real displayLength: Math.max(control.minThumbLength, actualLength)

            y: control.vertical ? ((actualLength < control.minThumbLength) ? (actualLength - control.minThumbLength) / 2 : 0) : 0
            x: control.horizontal ? ((actualLength < control.minThumbLength) ? (actualLength - control.minThumbLength) / 2 : 0) : 0

            anchors.horizontalCenter: control.vertical ? parent.horizontalCenter : undefined
            anchors.verticalCenter: control.horizontal ? parent.verticalCenter : undefined

            width: control.vertical ? (control._isExpanded ? control.expandedThumbThickness : control.thumbThickness) : displayLength
            height: control.horizontal ? (control._isExpanded ? control.expandedThumbThickness : control.thumbThickness) : displayLength

            radius: Math.min(width, height) / 2

            color: (control.pressed || control.forceActive) ? (ThemeTokens.dark ? Qt.rgba(160/255, 165/255, 173/255, 1.0) : Qt.rgba(99/255, 104/255, 114/255, 1.0)) :
                   (control._isExpanded) ? (ThemeTokens.dark ? Qt.rgba(87/255, 100/255, 119/255, 1.0) : Qt.rgba(172/255, 181/255, 195/255, 1.0)) :
                   (ThemeTokens.dark ? "#1e293b" : "#e2e8f0")

            Behavior on width { enabled: ThemeTokens.animationsEnabled && !control.forceHover && !control.forceActive && (typeof harnessMode === "undefined" || harnessMode === ""); NumberAnimation { duration: ThemeTokens.motionShort; easing.type: Easing.OutQuad } }
            Behavior on height { enabled: ThemeTokens.animationsEnabled && !control.forceHover && !control.forceActive && (typeof harnessMode === "undefined" || harnessMode === ""); NumberAnimation { duration: ThemeTokens.motionShort; easing.type: Easing.OutQuad } }
            Behavior on color { enabled: ThemeTokens.animationsEnabled && !control.forceHover && !control.forceActive && (typeof harnessMode === "undefined" || harnessMode === ""); ColorAnimation { duration: ThemeTokens.motionShort } }
        }
    }

    // Inline StepperButton Component
    component StepperButton : Rectangle {
        id: btn
        // kind: 0: ToStart (ToTop/ToLeft), 1: PageBack (PageUp/PageLeft), 2: PageForward (PageDown/PageRight), 3: ToEnd (ToBottom/ToRight)
        property int kind: 0
        property bool isEnabled: true
        property string tooltipText: ""
        signal triggered()

        width: control.buttonLength
        height: control.buttonLength
        radius: ThemeTokens.dp(2)
        z: 2

        readonly property bool _isHovered: (control.forceButtonState === "hover") || (_ma.containsMouse && isEnabled && control._isExpanded)
        readonly property bool _isPressed: (control.forceButtonState === "active") || (_ma.pressed && isEnabled && control._isExpanded)

        color: !isEnabled ? "transparent" :
               _isPressed ? (ThemeTokens.dark ? "#334155" : "#e2e8f0") :
               _isHovered ? (ThemeTokens.dark ? Qt.rgba(30/255, 41/255, 59/255, 0.8) : Qt.rgba(241/255, 245/255, 249/255, 0.8)) : "transparent"

        opacity: !control._isExpanded ? 0.0 : (!isEnabled ? 0.20 : 1.0)
        Behavior on opacity { enabled: ThemeTokens.animationsEnabled; NumberAnimation { duration: ThemeTokens.motionShort } }
        Behavior on color { enabled: ThemeTokens.animationsEnabled; ColorAnimation { duration: ThemeTokens.motionShort } }

        readonly property color iconColor: !isEnabled ? (ThemeTokens.dark ? "#64748b" : "#94a3b8") :
                                          ((_isPressed || _isHovered) ? (ThemeTokens.dark ? "#f8fafc" : "#020817") :
                                          (ThemeTokens.dark ? Qt.rgba(148/255, 163/255, 184/255, 0.8) : Qt.rgba(100/255, 116/255, 139/255, 0.8)))

        Canvas {
            id: iconCanvas
            anchors.fill: parent
            antialiasing: true
            renderTarget: Canvas.Image

            onPaint: {
                var ctx = getContext("2d")
                ctx.reset()
                ctx.clearRect(0, 0, width, height)
                var w = width
                var h = height
                if (w <= 0 || h <= 0) return
                var sx = function(val) { return (val / 14.0) * w }
                var sy = function(val) { return (val / 14.0) * h }
                ctx.strokeStyle = btn.iconColor
                ctx.lineWidth = Math.max(1.0, ThemeTokens.dp(1.0))
                ctx.lineCap = "round"
                ctx.lineJoin = "round"

                var isVert = control.vertical
                if (isVert) {
                    if (btn.kind === 0) { // ToStart (ToTop)
                        ctx.moveTo(sx(3.5), sy(6.5)); ctx.lineTo(sx(7), sy(3)); ctx.lineTo(sx(10.5), sy(6.5)); ctx.stroke()
                        ctx.moveTo(sx(3.5), sy(10.5)); ctx.lineTo(sx(7), sy(7)); ctx.lineTo(sx(10.5), sy(10.5)); ctx.stroke()
                    } else if (btn.kind === 1) { // PageBack (PageUp)
                        ctx.moveTo(sx(3.5), sy(8.5)); ctx.lineTo(sx(7), sy(5)); ctx.lineTo(sx(10.5), sy(8.5)); ctx.stroke()
                    } else if (btn.kind === 2) { // PageForward (PageDown)
                        ctx.moveTo(sx(3.5), sy(5.5)); ctx.lineTo(sx(7), sy(9)); ctx.lineTo(sx(10.5), sy(5.5)); ctx.stroke()
                    } else if (btn.kind === 3) { // ToEnd (ToBottom)
                        ctx.moveTo(sx(3.5), sy(3.5)); ctx.lineTo(sx(7), sy(7)); ctx.lineTo(sx(10.5), sy(3.5)); ctx.stroke()
                        ctx.moveTo(sx(3.5), sy(7.5)); ctx.lineTo(sx(7), sy(11)); ctx.lineTo(sx(10.5), sy(7.5)); ctx.stroke()
                    }
                } else {
                    if (btn.kind === 0) { // ToStart (ToLeft)
                        ctx.moveTo(sx(6.5), sy(3.5)); ctx.lineTo(sx(3), sy(7)); ctx.lineTo(sx(6.5), sy(10.5)); ctx.stroke()
                        ctx.moveTo(sx(10.5), sy(3.5)); ctx.lineTo(sx(7), sy(7)); ctx.lineTo(sx(10.5), sy(10.5)); ctx.stroke()
                    } else if (btn.kind === 1) { // PageBack (PageLeft)
                        ctx.moveTo(sx(8.5), sy(3.5)); ctx.lineTo(sx(5), sy(7)); ctx.lineTo(sx(8.5), sy(10.5)); ctx.stroke()
                    } else if (btn.kind === 2) { // PageForward (PageRight)
                        ctx.moveTo(sx(5.5), sy(3.5)); ctx.lineTo(sx(9), sy(7)); ctx.lineTo(sx(5.5), sy(10.5)); ctx.stroke()
                    } else if (btn.kind === 3) { // ToEnd (ToRight)
                        ctx.moveTo(sx(3.5), sy(3.5)); ctx.lineTo(sx(7), sy(7)); ctx.lineTo(sx(3.5), sy(10.5)); ctx.stroke()
                        ctx.moveTo(sx(7.5), sy(3.5)); ctx.lineTo(sx(11), sy(7)); ctx.lineTo(sx(7.5), sy(10.5)); ctx.stroke()
                    }
                }
            }

            Connections {
                target: btn
                function onIconColorChanged() { iconCanvas.requestPaint() }
            }
            onWidthChanged: iconCanvas.requestPaint()
            onHeightChanged: iconCanvas.requestPaint()
            Component.onCompleted: iconCanvas.requestPaint()
        }

        Timer {
            id: repeatDelayTimer
            interval: control.autoRepeatDelay
            repeat: false
            onTriggered: {
                if (_ma.pressed && isEnabled && control.autoRepeat) {
                    repeatIntervalTimer.start()
                }
            }
        }

        Timer {
            id: repeatIntervalTimer
            interval: control.autoRepeatInterval
            repeat: true
            onTriggered: {
                if (_ma.pressed && isEnabled && control.autoRepeat) {
                    btn.triggered()
                } else {
                    stop()
                }
            }
        }

        MouseArea {
            id: _ma
            anchors.fill: parent
            hoverEnabled: true
            enabled: btn.isEnabled && control._isExpanded
            cursorShape: (btn.isEnabled && control._isExpanded) ? Qt.PointingHandCursor : undefined
            acceptedButtons: Qt.LeftButton

            onPressed: {
                if (btn.isEnabled) {
                    btn.triggered()
                    if (control.autoRepeat && (btn.kind === 1 || btn.kind === 2)) {
                        repeatDelayTimer.restart()
                    }
                }
            }
            onReleased: {
                repeatDelayTimer.stop()
                repeatIntervalTimer.stop()
            }
            onCanceled: {
                repeatDelayTimer.stop()
                repeatIntervalTimer.stop()
            }
        }
    }

    // ---- Start Stepper Buttons (ToTop/ToLeft + PageUp/PageLeft) ----
    StepperButton {
        id: btnStartTo
        objectName: "btnStartTo"
        kind: 0
        visible: control.showButtons && control._hasSpaceForButtons && control.hasOverflow
        isEnabled: control.canScrollBack
        tooltipText: control.vertical ? qsTr("到顶") : qsTr("到最左")
        x: 0
        y: 0
        onTriggered: control.scrollToStart()
    }

    StepperButton {
        id: btnStartPage
        objectName: "btnStartPage"
        kind: 1
        visible: control.showButtons && control._hasSpaceForButtons && control.hasOverflow
        isEnabled: control.canScrollBack
        tooltipText: control.vertical ? qsTr("向上翻一页") : qsTr("向左翻一页")
        x: control.vertical ? 0 : control.buttonLength
        y: control.vertical ? control.buttonLength : 0
        onTriggered: control.scrollPageBack()
    }

    // ---- End Stepper Buttons (PageDown/PageRight + ToBottom/ToEnd) ----
    StepperButton {
        id: btnEndPage
        objectName: "btnEndPage"
        kind: 2
        visible: control.showButtons && control._hasSpaceForButtons && control.hasOverflow
        isEnabled: control.canScrollForward
        tooltipText: control.vertical ? qsTr("向下翻一页") : qsTr("向右翻一页")
        x: control.vertical ? 0 : (control.width - control.buttonLength * 2)
        y: control.vertical ? (control.height - control.buttonLength * 2) : 0
        onTriggered: control.scrollPageForward()
    }

    StepperButton {
        id: btnEndTo
        objectName: "btnEndTo"
        kind: 3
        visible: control.showButtons && control._hasSpaceForButtons && control.hasOverflow
        isEnabled: control.canScrollForward
        tooltipText: control.vertical ? qsTr("到底") : qsTr("到最右")
        x: control.vertical ? 0 : (control.width - control.buttonLength)
        y: control.vertical ? (control.height - control.buttonLength) : 0
        onTriggered: control.scrollToEnd()
    }
}
