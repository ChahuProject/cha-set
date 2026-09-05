// ChaSet ScrollBar for Qt (QML)
// Professional Cross-Stack ScrollBar implementation:
// 1. Dual-mode Theme Adapter (operates seamlessly with ThemeTokens or dunting-qt ThemeManager)
// 2. 14px hit interaction zone preventing Win32 window resizing border conflict
// 3. Dynamic symmetric expansion (6px idle -> 10px hover/drag) with zero-latency thumb tracking
// 4. Guaranteed minimum thumb length (minThumbLength: 30) for 100k+ item datasets
// 5. Two-end stepper navigation buttons with autoRepeat and boundary clamping
// 6. Automatic auto-hide when content fits without overflow

import QtQuick 6.10
import QtQuick.Controls 6.10
import QtQuick.Templates 6.10 as T
import ChaSet 1.0

T.ScrollBar {
    id: control

    // ---- Desktop Geometry Properties ----
    property int hitThickness: 14
    property int thumbThickness: 6
    property int expandedThumbThickness: 10
    property int minThumbLength: 30
    property int buttonLength: 14
    property bool showButtons: true
    property bool autoRepeat: true
    property int autoRepeatDelay: 400
    property int autoRepeatInterval: 100
    property real pageStepRatio: 0.85
    property bool smoothScroll: true
    property var scrollArea: null
    readonly property var _scrollTarget: scrollArea

    // Backward compatibility aliases for cha-set showcase and tests
    property alias hitSize: control.hitThickness
    property alias collapsedSize: control.thumbThickness
    property alias expandedSize: control.expandedThumbThickness

    readonly property bool isVertical: control.vertical

    readonly property bool _hasSpaceForButtons: showButtons && ((vertical ? height : width) >= (buttonLength * 4 + 24))

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
        : (size > 0 && size < 0.9999)

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
    readonly property bool _isExpanded: control.hovered || control.pressed
                                        || (btnStartTo && btnStartTo._isHovered)
                                        || (btnStartPage && btnStartPage._isHovered)
                                        || (btnEndPage && btnEndPage._isHovered)
                                        || (btnEndTo && btnEndTo._isHovered)

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
        color: control._isExpanded ? Qt.rgba(control._panelRaised.r, control._panelRaised.g, control._panelRaised.b, 0.5) : "transparent"
        radius: 4
        Behavior on color { ColorAnimation { duration: 120 } }
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

            color: control.pressed ? control._accent :
                   (control.hovered ? control._subduedText :
                   Qt.rgba(control._subduedText.r, control._subduedText.g, control._subduedText.b, 0.45))

            Behavior on width { NumberAnimation { duration: 120; easing.type: Easing.OutQuad } }
            Behavior on height { NumberAnimation { duration: 120; easing.type: Easing.OutQuad } }
            Behavior on color { ColorAnimation { duration: 120 } }
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
        radius: 2

        readonly property bool _isHovered: _ma.containsMouse && isEnabled
        readonly property bool _isPressed: _ma.pressed && isEnabled

        color: !isEnabled ? "transparent" :
               _isPressed ? Qt.rgba(control._accent.r, control._accent.g, control._accent.b, 0.35) :
               _isHovered ? Qt.rgba(control._panelRaised.r, control._panelRaised.g, control._panelRaised.b, 0.9) : "transparent"

        opacity: !isEnabled ? 0.22 : (control._isExpanded ? 1.0 : 0.0)
        Behavior on opacity { NumberAnimation { duration: 120 } }
        Behavior on color { ColorAnimation { duration: 120 } }

        readonly property color iconColor: !isEnabled ? control._subduedText :
                                          (_isPressed ? control._accent :
                                          (_isHovered ? control._text : control._subduedText))

        Canvas {
            id: iconCanvas
            anchors.fill: parent
            antialiasing: true
            renderTarget: Canvas.Image

            onPaint: {
                var ctx = getContext("2d")
                ctx.reset()
                ctx.clearRect(0, 0, width, height)
                ctx.strokeStyle = btn.iconColor
                ctx.lineWidth = 1.2
                ctx.lineCap = "round"
                ctx.lineJoin = "round"

                var isVert = control.vertical
                if (isVert) {
                    if (btn.kind === 0) { // ToTop
                        ctx.moveTo(3.5, 6.5); ctx.lineTo(7, 3); ctx.lineTo(10.5, 6.5); ctx.stroke()
                        ctx.moveTo(3.5, 10.5); ctx.lineTo(7, 7); ctx.lineTo(10.5, 10.5); ctx.stroke()
                    } else if (btn.kind === 1) { // PageUp
                        ctx.moveTo(3.5, 8.5); ctx.lineTo(7, 5); ctx.lineTo(10.5, 8.5); ctx.stroke()
                    } else if (btn.kind === 2) { // PageDown
                        ctx.moveTo(3.5, 5.5); ctx.lineTo(7, 9); ctx.lineTo(10.5, 5.5); ctx.stroke()
                    } else if (btn.kind === 3) { // ToBottom
                        ctx.moveTo(3.5, 3.5); ctx.lineTo(7, 7); ctx.lineTo(10.5, 3.5); ctx.stroke()
                        ctx.moveTo(3.5, 7.5); ctx.lineTo(7, 11); ctx.lineTo(10.5, 7.5); ctx.stroke()
                    }
                } else {
                    if (btn.kind === 0) { // ToLeft
                        ctx.moveTo(6.5, 3.5); ctx.lineTo(3, 7); ctx.lineTo(6.5, 10.5); ctx.stroke()
                        ctx.moveTo(10.5, 3.5); ctx.lineTo(7, 7); ctx.lineTo(10.5, 10.5); ctx.stroke()
                    } else if (btn.kind === 1) { // PageLeft
                        ctx.moveTo(8.5, 3.5); ctx.lineTo(5, 7); ctx.lineTo(8.5, 10.5); ctx.stroke()
                    } else if (btn.kind === 2) { // PageRight
                        ctx.moveTo(5.5, 3.5); ctx.lineTo(9, 7); ctx.lineTo(5.5, 10.5); ctx.stroke()
                    } else if (btn.kind === 3) { // ToRight
                        ctx.moveTo(3.5, 3.5); ctx.lineTo(7, 7); ctx.lineTo(3.5, 10.5); ctx.stroke()
                        ctx.moveTo(7.5, 3.5); ctx.lineTo(11, 7); ctx.lineTo(7.5, 10.5); ctx.stroke()
                    }
                }
            }

            Connections {
                target: btn
                function onIconColorChanged() { iconCanvas.requestPaint() }
            }
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
            enabled: btn.isEnabled
            cursorShape: btn.isEnabled ? Qt.PointingHandCursor : Qt.ArrowCursor
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
        visible: control._hasSpaceForButtons && control.hasOverflow
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
        visible: control._hasSpaceForButtons && control.hasOverflow
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
        visible: control._hasSpaceForButtons && control.hasOverflow
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
        visible: control._hasSpaceForButtons && control.hasOverflow
        isEnabled: control.canScrollForward
        tooltipText: control.vertical ? qsTr("到底") : qsTr("到最右")
        x: control.vertical ? 0 : (control.width - control.buttonLength)
        y: control.vertical ? (control.height - control.buttonLength) : 0
        onTriggered: control.scrollToEnd()
    }
}
