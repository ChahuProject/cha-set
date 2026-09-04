// ChaSet ScrollBar for Qt (QML)
// Native Qt Quick Controls ScrollBar implementation with ChaSet design tokens,
// dynamic hot-zone expansion, and two-end stepper navigation buttons (⏬ 🔽 🔼 ⏫ / ⏩ ▶ ◀ ⏪).
import QtQuick 6.10
import QtQuick.Templates 6.10 as T
import chaSet

T.ScrollBar {
    id: control

    implicitWidth: Math.max(implicitBackgroundWidth + leftInset + rightInset,
                            implicitContentWidth + leftPadding + rightPadding)
    implicitHeight: Math.max(implicitBackgroundHeight + topInset + bottomInset,
                             implicitContentHeight + topPadding + bottomPadding)

    property var scrollView: null
    property bool showButtons: true
    property int hitSize: 8
    property int collapsedSize: 4
    property int expandedSize: 8
    property real customRadius: ThemeTokens.rowRadius
    property real pageStepRatio: 0.85
    property bool smoothScroll: true

    readonly property bool isVertical: orientation === Qt.Vertical
    readonly property bool isAtStart: scrollView ? (isVertical ? scrollView.isAtTop : scrollView.isAtLeft) : (position <= 0.001)
    readonly property bool isAtEnd: scrollView ? (isVertical ? scrollView.isAtBottom : scrollView.isAtRight) : (position >= 0.999 - size)
    readonly property bool hasOverflow: scrollView ? (isVertical ? (scrollView.contentHeight > scrollView.height) : (scrollView.contentWidth > scrollView.width)) : (size > 0 && size < 1.0)

    visible: policy === ScrollBar.AlwaysOn || (policy === ScrollBar.AsNeeded && hasOverflow)

    topPadding: (showButtons && isVertical) ? 24 : 0
    bottomPadding: (showButtons && isVertical) ? 24 : 0
    leftPadding: (showButtons && !isVertical) ? 24 : 0
    rightPadding: (showButtons && !isVertical) ? 24 : 0
    padding: 0
    hoverEnabled: true

    // Visual Thumb Capsule (Native C++ QQuickScrollBar handles position & drag seamlessly)
    contentItem: Rectangle {
        implicitWidth: control.isVertical ? (control.hovered || control.pressed ? control.expandedSize : control.collapsedSize) : 0
        implicitHeight: !control.isVertical ? (control.hovered || control.pressed ? control.expandedSize : control.collapsedSize) : 0
        radius: Math.min(width, height) / 2

        color: control.pressed ? Qt.rgba(ThemeTokens.text.r, ThemeTokens.text.g, ThemeTokens.text.b, 0.6) :
               (control.hovered ? Qt.rgba(ThemeTokens.text.r, ThemeTokens.text.g, ThemeTokens.text.b, 0.4) :
               Qt.rgba(ThemeTokens.border.r, ThemeTokens.border.g, ThemeTokens.border.b, 0.8))

        Behavior on implicitWidth { NumberAnimation { duration: 150; easing.type: Easing.OutCubic } }
        Behavior on implicitHeight { NumberAnimation { duration: 150; easing.type: Easing.OutCubic } }
        Behavior on color { ColorAnimation { duration: 150 } }
    }

    // Transparent / Hovered Runway
    background: Rectangle {
        implicitWidth: control.expandedSize
        implicitHeight: control.expandedSize
        color: control.hovered ? Qt.rgba(ThemeTokens.hover.r, ThemeTokens.hover.g, ThemeTokens.hover.b, 0.3) : "transparent"
        Behavior on color { ColorAnimation { duration: 150 } }
    }

    // ==============================================================
    // 1. VERTICAL STEPPER CLUSTERS
    // ==============================================================
    // Top Cluster (To Top ⏫ + Page Up 🔼)
    Item {
        id: vertTopCluster
        visible: control.showButtons && control.isVertical && control.hasOverflow
        z: 10
        anchors.top: control.top
        anchors.horizontalCenter: control.horizontalCenter
        width: control.expandedSize
        height: 24
        opacity: (control.hovered || control.pressed) ? 1.0 : 0.0
        Behavior on opacity { NumberAnimation { duration: 150 } }

        Column {
            anchors.centerIn: parent
            spacing: 1

            // ⏫ To Top Button
            Rectangle {
                width: control.expandedSize; height: 10; radius: 2
                color: topBtnMa.pressed ? Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.35) :
                       (topBtnMa.containsMouse ? Qt.rgba(ThemeTokens.hover.r, ThemeTokens.hover.g, ThemeTokens.hover.b, 0.5) : "transparent")
                opacity: control.isAtStart ? 0.25 : 1.0
                Canvas {
                    anchors.centerIn: parent
                    width: 6; height: 6
                    onPaint: {
                        var ctx = getContext("2d")
                        ctx.reset()
                        ctx.strokeStyle = ThemeTokens.text
                        ctx.lineWidth = 1.2
                        ctx.lineCap = "round"
                        ctx.lineJoin = "round"
                        // Top chevron
                        ctx.beginPath()
                        ctx.moveTo(1, 2.5); ctx.lineTo(3, 0.5); ctx.lineTo(5, 2.5)
                        ctx.stroke()
                        // Bottom chevron
                        ctx.beginPath()
                        ctx.moveTo(1, 5); ctx.lineTo(3, 3); ctx.lineTo(5, 5)
                        ctx.stroke()
                    }
                }
                MouseArea {
                    id: topBtnMa
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: control.isAtStart ? Qt.ArrowCursor : Qt.PointingHandCursor
                    enabled: !control.isAtStart
                    onClicked: {
                        if (control.scrollView) control.scrollView.scrollToTop(control.smoothScroll)
                        else control.position = 0
                    }
                }
            }

            // 🔼 Page Up Button
            Rectangle {
                width: control.expandedSize; height: 10; radius: 2
                color: pageUpBtnMa.pressed ? Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.35) :
                       (pageUpBtnMa.containsMouse ? Qt.rgba(ThemeTokens.hover.r, ThemeTokens.hover.g, ThemeTokens.hover.b, 0.5) : "transparent")
                opacity: control.isAtStart ? 0.25 : 1.0
                Canvas {
                    anchors.centerIn: parent
                    width: 6; height: 6
                    onPaint: {
                        var ctx = getContext("2d")
                        ctx.reset()
                        ctx.strokeStyle = ThemeTokens.text
                        ctx.lineWidth = 1.2
                        ctx.lineCap = "round"
                        ctx.lineJoin = "round"
                        ctx.beginPath()
                        ctx.moveTo(1, 4.5); ctx.lineTo(3, 1.5); ctx.lineTo(5, 4.5)
                        ctx.stroke()
                    }
                }
                MouseArea {
                    id: pageUpBtnMa
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: control.isAtStart ? Qt.ArrowCursor : Qt.PointingHandCursor
                    enabled: !control.isAtStart
                    onClicked: {
                        if (control.scrollView) control.scrollView.pageUp(control.smoothScroll)
                        else control.decrease()
                    }
                }
            }
        }
    }

    // Bottom Cluster (Page Down 🔽 + To Bottom ⏬)
    Item {
        id: vertBottomCluster
        visible: control.showButtons && control.isVertical && control.hasOverflow
        z: 10
        anchors.bottom: control.bottom
        anchors.horizontalCenter: control.horizontalCenter
        width: control.expandedSize
        height: 24
        opacity: (control.hovered || control.pressed) ? 1.0 : 0.0
        Behavior on opacity { NumberAnimation { duration: 150 } }

        Column {
            anchors.centerIn: parent
            spacing: 1

            // 🔽 Page Down Button
            Rectangle {
                width: control.expandedSize; height: 10; radius: 2
                color: pageDownBtnMa.pressed ? Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.35) :
                       (pageDownBtnMa.containsMouse ? Qt.rgba(ThemeTokens.hover.r, ThemeTokens.hover.g, ThemeTokens.hover.b, 0.5) : "transparent")
                opacity: control.isAtEnd ? 0.25 : 1.0
                Canvas {
                    anchors.centerIn: parent
                    width: 6; height: 6
                    onPaint: {
                        var ctx = getContext("2d")
                        ctx.reset()
                        ctx.strokeStyle = ThemeTokens.text
                        ctx.lineWidth = 1.2
                        ctx.lineCap = "round"
                        ctx.lineJoin = "round"
                        ctx.beginPath()
                        ctx.moveTo(1, 1.5); ctx.lineTo(3, 4.5); ctx.lineTo(5, 1.5)
                        ctx.stroke()
                    }
                }
                MouseArea {
                    id: pageDownBtnMa
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: control.isAtEnd ? Qt.ArrowCursor : Qt.PointingHandCursor
                    enabled: !control.isAtEnd
                    onClicked: {
                        if (control.scrollView) control.scrollView.pageDown(control.smoothScroll)
                        else control.increase()
                    }
                }
            }

            // ⏬ To Bottom Button
            Rectangle {
                width: control.expandedSize; height: 10; radius: 2
                color: bottomBtnMa.pressed ? Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.35) :
                       (bottomBtnMa.containsMouse ? Qt.rgba(ThemeTokens.hover.r, ThemeTokens.hover.g, ThemeTokens.hover.b, 0.5) : "transparent")
                opacity: control.isAtEnd ? 0.25 : 1.0
                Canvas {
                    anchors.centerIn: parent
                    width: 6; height: 6
                    onPaint: {
                        var ctx = getContext("2d")
                        ctx.reset()
                        ctx.strokeStyle = ThemeTokens.text
                        ctx.lineWidth = 1.2
                        ctx.lineCap = "round"
                        ctx.lineJoin = "round"
                        // Top chevron
                        ctx.beginPath()
                        ctx.moveTo(1, 1); ctx.lineTo(3, 3); ctx.lineTo(5, 1)
                        ctx.stroke()
                        // Bottom chevron
                        ctx.beginPath()
                        ctx.moveTo(1, 3.5); ctx.lineTo(3, 5.5); ctx.lineTo(5, 3.5)
                        ctx.stroke()
                    }
                }
                MouseArea {
                    id: bottomBtnMa
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: control.isAtEnd ? Qt.ArrowCursor : Qt.PointingHandCursor
                    enabled: !control.isAtEnd
                    onClicked: {
                        if (control.scrollView) control.scrollView.scrollToBottom(control.smoothScroll)
                        else control.position = 1.0 - control.size
                    }
                }
            }
        }
    }

    // ==============================================================
    // 2. HORIZONTAL STEPPER CLUSTERS
    // ==============================================================
    // Left Cluster (To Start ⏪ + Page Left ◀)
    Item {
        id: horizLeftCluster
        visible: control.showButtons && !control.isVertical && control.hasOverflow
        z: 10
        anchors.left: control.left
        anchors.verticalCenter: control.verticalCenter
        width: 24
        height: control.expandedSize
        opacity: (control.hovered || control.pressed) ? 1.0 : 0.0
        Behavior on opacity { NumberAnimation { duration: 150 } }

        Row {
            anchors.centerIn: parent
            spacing: 1

            // ⏪ To Start Button
            Rectangle {
                width: 10; height: control.expandedSize; radius: 2
                color: leftStartBtnMa.pressed ? Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.35) :
                       (leftStartBtnMa.containsMouse ? Qt.rgba(ThemeTokens.hover.r, ThemeTokens.hover.g, ThemeTokens.hover.b, 0.5) : "transparent")
                opacity: control.isAtStart ? 0.25 : 1.0
                Canvas {
                    anchors.centerIn: parent
                    width: 6; height: 6
                    onPaint: {
                        var ctx = getContext("2d")
                        ctx.reset()
                        ctx.strokeStyle = ThemeTokens.text
                        ctx.lineWidth = 1.2
                        ctx.lineCap = "round"
                        ctx.lineJoin = "round"
                        ctx.beginPath()
                        ctx.moveTo(2.5, 1); ctx.lineTo(0.5, 3); ctx.lineTo(2.5, 5)
                        ctx.stroke()
                        ctx.beginPath()
                        ctx.moveTo(5, 1); ctx.lineTo(3, 3); ctx.lineTo(5, 5)
                        ctx.stroke()
                    }
                }
                MouseArea {
                    id: leftStartBtnMa
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: control.isAtStart ? Qt.ArrowCursor : Qt.PointingHandCursor
                    enabled: !control.isAtStart
                    onClicked: {
                        if (control.scrollView) control.scrollView.scrollToLeft(control.smoothScroll)
                        else control.position = 0
                    }
                }
            }

            // ◀ Page Left Button
            Rectangle {
                width: 10; height: control.expandedSize; radius: 2
                color: pageLeftBtnMa.pressed ? Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.35) :
                       (pageLeftBtnMa.containsMouse ? Qt.rgba(ThemeTokens.hover.r, ThemeTokens.hover.g, ThemeTokens.hover.b, 0.5) : "transparent")
                opacity: control.isAtStart ? 0.25 : 1.0
                Canvas {
                    anchors.centerIn: parent
                    width: 6; height: 6
                    onPaint: {
                        var ctx = getContext("2d")
                        ctx.reset()
                        ctx.strokeStyle = ThemeTokens.text
                        ctx.lineWidth = 1.2
                        ctx.lineCap = "round"
                        ctx.lineJoin = "round"
                        ctx.beginPath()
                        ctx.moveTo(4.5, 1); ctx.lineTo(1.5, 3); ctx.lineTo(4.5, 5)
                        ctx.stroke()
                    }
                }
                MouseArea {
                    id: pageLeftBtnMa
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: control.isAtStart ? Qt.ArrowCursor : Qt.PointingHandCursor
                    enabled: !control.isAtStart
                    onClicked: {
                        if (control.scrollView) control.scrollView.pageLeft(control.smoothScroll)
                        else control.decrease()
                    }
                }
            }
        }
    }

    // Right Cluster (Page Right ▶ + To End ⏩)
    Item {
        id: horizRightCluster
        visible: control.showButtons && !control.isVertical && control.hasOverflow
        z: 10
        anchors.right: control.right
        anchors.verticalCenter: control.verticalCenter
        width: 24
        height: control.expandedSize
        opacity: (control.hovered || control.pressed) ? 1.0 : 0.0
        Behavior on opacity { NumberAnimation { duration: 150 } }

        Row {
            anchors.centerIn: parent
            spacing: 1

            // ▶ Page Right Button
            Rectangle {
                width: 10; height: control.expandedSize; radius: 2
                color: pageRightBtnMa.pressed ? Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.35) :
                       (pageRightBtnMa.containsMouse ? Qt.rgba(ThemeTokens.hover.r, ThemeTokens.hover.g, ThemeTokens.hover.b, 0.5) : "transparent")
                opacity: control.isAtEnd ? 0.25 : 1.0
                Canvas {
                    anchors.centerIn: parent
                    width: 6; height: 6
                    onPaint: {
                        var ctx = getContext("2d")
                        ctx.reset()
                        ctx.strokeStyle = ThemeTokens.text
                        ctx.lineWidth = 1.2
                        ctx.lineCap = "round"
                        ctx.lineJoin = "round"
                        ctx.beginPath()
                        ctx.moveTo(1.5, 1); ctx.lineTo(4.5, 3); ctx.lineTo(1.5, 5)
                        ctx.stroke()
                    }
                }
                MouseArea {
                    id: pageRightBtnMa
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: control.isAtEnd ? Qt.ArrowCursor : Qt.PointingHandCursor
                    enabled: !control.isAtEnd
                    onClicked: {
                        if (control.scrollView) control.scrollView.pageRight(control.smoothScroll)
                        else control.increase()
                    }
                }
            }

            // ⏩ To End Button
            Rectangle {
                width: 10; height: control.expandedSize; radius: 2
                color: rightEndBtnMa.pressed ? Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.35) :
                       (rightEndBtnMa.containsMouse ? Qt.rgba(ThemeTokens.hover.r, ThemeTokens.hover.g, ThemeTokens.hover.b, 0.5) : "transparent")
                opacity: control.isAtEnd ? 0.25 : 1.0
                Canvas {
                    anchors.centerIn: parent
                    width: 6; height: 6
                    onPaint: {
                        var ctx = getContext("2d")
                        ctx.reset()
                        ctx.strokeStyle = ThemeTokens.text
                        ctx.lineWidth = 1.2
                        ctx.lineCap = "round"
                        ctx.lineJoin = "round"
                        ctx.beginPath()
                        ctx.moveTo(1, 1); ctx.lineTo(3, 3); ctx.lineTo(1, 5)
                        ctx.stroke()
                        ctx.beginPath()
                        ctx.moveTo(3.5, 1); ctx.lineTo(5.5, 3); ctx.lineTo(3.5, 5)
                        ctx.stroke()
                    }
                }
                MouseArea {
                    id: rightEndBtnMa
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: control.isAtEnd ? Qt.ArrowCursor : Qt.PointingHandCursor
                    enabled: !control.isAtEnd
                    onClicked: {
                        if (control.scrollView) control.scrollView.scrollToRight(control.smoothScroll)
                        else control.position = 1.0 - control.size
                    }
                }
            }
        }
    }
}

