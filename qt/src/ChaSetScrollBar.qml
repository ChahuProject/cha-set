// ChaSet ScrollBar for Qt (QML), implementing the API contract from
// spec/components/scrollbar.ts and capabilities in spec/capabilities.json.
// 100% pixel-perfect and behavioral parity with React (@chahu/cha-set).
import QtQuick 6.10
import chaSet

Item {
    id: root

    // ---- API Contract ----
    property int orientation: Qt.Vertical   // Qt.Vertical | Qt.Horizontal
    property Flickable flickable: parent && parent.hasOwnProperty("contentY") ? parent : null
    property bool showButtons: true
    property int hitSize: 8
    property int collapsedSize: 4
    property int expandedSize: 8
    property real pageStepRatio: 0.85
    property bool smoothScroll: true
    property real customRadius: ThemeTokens.rowRadius

    property alias scrollAnimY: scrollAnimY
    property alias scrollAnimX: scrollAnimX

    readonly property bool isVertical: orientation === Qt.Vertical
    readonly property bool hovered: hitMouseArea.containsMouse || startCluster.hovered || endCluster.hovered || trackInteractionArea.containsMouse

    // Geometry bindings from Flickable
    readonly property real visiblePos: flickable ? (isVertical ? flickable.visibleArea.yPosition : flickable.visibleArea.xPosition) : 0
    readonly property real visibleRatio: flickable ? (isVertical ? flickable.visibleArea.heightRatio : flickable.visibleArea.widthRatio) : 1
    readonly property bool isAtStart: visiblePos <= 0.001
    readonly property bool isAtEnd: visiblePos + visibleRatio >= 0.999

    // Dimensions
    width: isVertical ? hitSize : (parent ? parent.width : 200)
    height: isVertical ? (parent ? parent.height : 200) : hitSize

    // Stepper Button Cluster dimensions
    readonly property real buttonClusterSize: showButtons ? (hitSize * 2 + 4) : 0
    readonly property real availableTrackLength: (isVertical ? height : width) - (showButtons ? buttonClusterSize * 2 : 0)

    // Scroll actions
    function scrollToStart() {
        if (!flickable) return
        if (smoothScroll) {
            if (isVertical) scrollAnimY.startTo(0)
            else scrollAnimX.startTo(0)
        } else {
            if (isVertical) flickable.contentY = 0
            else flickable.contentX = 0
        }
    }

    function scrollToEnd() {
        if (!flickable) return
        if (isVertical) {
            var maxY = Math.max(0, flickable.contentHeight - flickable.height)
            if (smoothScroll) scrollAnimY.startTo(maxY)
            else flickable.contentY = maxY
        } else {
            var maxX = Math.max(0, flickable.contentWidth - flickable.width)
            if (smoothScroll) scrollAnimX.startTo(maxX)
            else flickable.contentX = maxX
        }
    }

    function scrollPageUp() {
        if (!flickable) return
        if (isVertical) {
            var deltaY = flickable.height * pageStepRatio
            var targetY = Math.max(0, flickable.contentY - deltaY)
            if (smoothScroll) scrollAnimY.startTo(targetY)
            else flickable.contentY = targetY
        } else {
            var deltaX = flickable.width * pageStepRatio
            var targetX = Math.max(0, flickable.contentX - deltaX)
            if (smoothScroll) scrollAnimX.startTo(targetX)
            else flickable.contentX = targetX
        }
    }

    function scrollPageDown() {
        if (!flickable) return
        if (isVertical) {
            var deltaY = flickable.height * pageStepRatio
            var maxY = Math.max(0, flickable.contentHeight - flickable.height)
            var targetY = Math.min(maxY, flickable.contentY + deltaY)
            if (smoothScroll) scrollAnimY.startTo(targetY)
            else flickable.contentY = targetY
        } else {
            var deltaX = flickable.width * pageStepRatio
            var maxX = Math.max(0, flickable.contentWidth - flickable.width)
            var targetX = Math.min(maxX, flickable.contentX + deltaX)
            if (smoothScroll) scrollAnimX.startTo(targetX)
            else flickable.contentX = targetX
        }
    }

    function simulateThumbDrag(deltaPixels) {
        if (!flickable || thumb.maxThumbTravel <= 0) return
        if (isVertical) {
            var maxScrollY = Math.max(0, flickable.contentHeight - flickable.height)
            var deltaScrollY = (deltaPixels / thumb.maxThumbTravel) * maxScrollY
            flickable.contentY = Math.max(0, Math.min(maxScrollY, flickable.contentY + deltaScrollY))
        } else {
            var maxScrollX = Math.max(0, flickable.contentWidth - flickable.width)
            var deltaScrollX = (deltaPixels / thumb.maxThumbTravel) * maxScrollX
            flickable.contentX = Math.max(0, Math.min(maxScrollX, flickable.contentX + deltaScrollX))
        }
    }

    NumberAnimation {
        id: scrollAnimY
        target: root.flickable
        property: "contentY"
        duration: 180
        easing.type: Easing.OutCubic
        function startTo(val) {
            from = root.flickable.contentY
            to = val
            restart()
        }
    }

    NumberAnimation {
        id: scrollAnimX
        target: root.flickable
        property: "contentX"
        duration: 180
        easing.type: Easing.OutCubic
        function startTo(val) {
            from = root.flickable.contentX
            to = val
            restart()
        }
    }

    // Outer Hot-Zone MouseArea
    MouseArea {
        id: hitMouseArea
        anchors.fill: parent
        hoverEnabled: true
        acceptedButtons: Qt.NoButton
    }

    // Start Stepper Cluster (To Top / Page Up or To Left / Page Left)
    Item {
        id: startCluster
        property bool hovered: btnStart1.hovered || btnStart2.hovered
        visible: root.showButtons
        opacity: root.hovered && root.showButtons ? 1.0 : 0.0
        Behavior on opacity { NumberAnimation { duration: 150 } }

        anchors.top: root.isVertical ? parent.top : undefined
        anchors.left: parent.left
        anchors.topMargin: root.isVertical ? 2 : 0
        anchors.leftMargin: root.isVertical ? 0 : 2
        width: root.isVertical ? root.hitSize : root.buttonClusterSize
        height: root.isVertical ? root.buttonClusterSize : root.hitSize

        Column {
            anchors.fill: parent
            spacing: 2
            visible: root.isVertical

            // Button 1: To Top
            Rectangle {
                id: btnStart1
                property bool hovered: maStart1.containsMouse
                width: root.hitSize - 2
                height: root.hitSize - 2
                anchors.horizontalCenter: parent.horizontalCenter
                radius: 3
                color: maStart1.pressed ? ThemeTokens.pressed : (hovered ? ThemeTokens.hover : "transparent")
                opacity: root.isAtStart ? 0.3 : 1.0
                enabled: !root.isAtStart

                Text {
                    anchors.centerIn: parent
                    text: "⇡"
                    font.pixelSize: 11
                    font.bold: true
                    color: ThemeTokens.text
                }
                MouseArea {
                    id: maStart1
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: root.isAtStart ? Qt.ArrowCursor : Qt.PointingHandCursor
                    onClicked: root.scrollToStart()
                }
            }

            // Button 2: Page Up
            Rectangle {
                id: btnStart2
                property bool hovered: maStart2.containsMouse
                width: root.hitSize - 2
                height: root.hitSize - 2
                anchors.horizontalCenter: parent.horizontalCenter
                radius: 3
                color: maStart2.pressed ? ThemeTokens.pressed : (hovered ? ThemeTokens.hover : "transparent")
                opacity: root.isAtStart ? 0.3 : 1.0
                enabled: !root.isAtStart

                Text {
                    anchors.centerIn: parent
                    text: "▴"
                    font.pixelSize: 10
                    color: ThemeTokens.text
                }
                MouseArea {
                    id: maStart2
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: root.isAtStart ? Qt.ArrowCursor : Qt.PointingHandCursor
                    onClicked: root.scrollPageUp()
                }
            }
        }

        Row {
            anchors.fill: parent
            spacing: 2
            visible: !root.isVertical

            // Button 1: To Left
            Rectangle {
                property bool hovered: maStartH1.containsMouse
                width: root.hitSize - 2
                height: root.hitSize - 2
                anchors.verticalCenter: parent.verticalCenter
                radius: 3
                color: maStartH1.pressed ? ThemeTokens.pressed : (hovered ? ThemeTokens.hover : "transparent")
                opacity: root.isAtStart ? 0.3 : 1.0
                enabled: !root.isAtStart

                Text {
                    anchors.centerIn: parent
                    text: "⇠"
                    font.pixelSize: 11
                    font.bold: true
                    color: ThemeTokens.text
                }
                MouseArea {
                    id: maStartH1
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: root.isAtStart ? Qt.ArrowCursor : Qt.PointingHandCursor
                    onClicked: root.scrollToStart()
                }
            }

            // Button 2: Page Left
            Rectangle {
                property bool hovered: maStartH2.containsMouse
                width: root.hitSize - 2
                height: root.hitSize - 2
                anchors.verticalCenter: parent.verticalCenter
                radius: 3
                color: maStartH2.pressed ? ThemeTokens.pressed : (hovered ? ThemeTokens.hover : "transparent")
                opacity: root.isAtStart ? 0.3 : 1.0
                enabled: !root.isAtStart

                Text {
                    anchors.centerIn: parent
                    text: "◂"
                    font.pixelSize: 10
                    color: ThemeTokens.text
                }
                MouseArea {
                    id: maStartH2
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: root.isAtStart ? Qt.ArrowCursor : Qt.PointingHandCursor
                    onClicked: root.scrollPageUp()
                }
            }
        }
    }

    // Track Runway & Thumb
    Item {
        id: trackArea
        anchors.top: root.isVertical ? (root.showButtons ? startCluster.bottom : parent.top) : parent.top
        anchors.bottom: root.isVertical ? (root.showButtons ? endCluster.top : parent.bottom) : parent.bottom
        anchors.left: root.isVertical ? parent.left : (root.showButtons ? startCluster.right : parent.left)
        anchors.right: root.isVertical ? parent.right : (root.showButtons ? endCluster.left : parent.right)

        // Visual Thumb Indicator
        Rectangle {
            id: thumb
            z: 1

            readonly property real trackLength: root.isVertical ? trackArea.height : trackArea.width
            readonly property real thumbLength: Math.max(16, Math.min(trackLength, trackLength * root.visibleRatio))
            readonly property real maxThumbTravel: Math.max(0, trackLength - thumbLength)
            readonly property real maxScrollDist: root.flickable ? Math.max(1, (root.isVertical ? root.flickable.contentHeight - root.flickable.height : root.flickable.contentWidth - root.flickable.width)) : 1
            readonly property real currentScroll: root.flickable ? Math.max(0, (root.isVertical ? root.flickable.contentY : root.flickable.contentX)) : 0
            readonly property real scrollRatio: Math.max(0, Math.min(1, currentScroll / maxScrollDist))
            readonly property real computedPos: Math.round(scrollRatio * maxThumbTravel)

            x: root.isVertical ? Math.round((trackArea.width - width) / 2) : computedPos
            y: root.isVertical ? computedPos : Math.round((trackArea.height - height) / 2)
            width: root.isVertical ? (root.hovered ? root.expandedSize : root.collapsedSize) : thumbLength
            height: root.isVertical ? thumbLength : (root.hovered ? root.expandedSize : root.collapsedSize)
            radius: Math.min(width, height) / 2

            color: trackInteractionArea.isDragging ? Qt.rgba(ThemeTokens.text.r, ThemeTokens.text.g, ThemeTokens.text.b, 0.6) :
                   (root.hovered ? Qt.rgba(ThemeTokens.text.r, ThemeTokens.text.g, ThemeTokens.text.b, 0.4) :
                   Qt.rgba(ThemeTokens.border.r, ThemeTokens.border.g, ThemeTokens.border.b, 0.8))

            Behavior on width { NumberAnimation { duration: 150; easing.type: Easing.OutCubic } }
            Behavior on height { NumberAnimation { duration: 150; easing.type: Easing.OutCubic } }
            Behavior on color { ColorAnimation { duration: 150 } }
        }

        // Unified Track & Thumb Interaction Area (Static coordinate frame)
        MouseArea {
            id: trackInteractionArea
            anchors.fill: parent
            z: 2
            hoverEnabled: true
            preventStealing: true

            property bool isDragging: false
            property real dragStartMousePos: 0
            property real dragStartContentPos: 0

            property bool mouseOverThumb: {
                if (root.isVertical) {
                    return mouseY >= thumb.y && mouseY <= (thumb.y + thumb.height)
                } else {
                    return mouseX >= thumb.x && mouseX <= (thumb.x + thumb.width)
                }
            }

            cursorShape: isDragging ? Qt.ClosedHandCursor : (mouseOverThumb ? Qt.PointingHandCursor : Qt.ArrowCursor)

            onPressed: function(mouse) {
                if (!root.flickable) return
                if (mouseOverThumb) {
                    isDragging = true
                    dragStartMousePos = root.isVertical ? mouse.y : mouse.x
                    dragStartContentPos = root.isVertical ? root.flickable.contentY : root.flickable.contentX
                } else {
                    // Track click jump
                    if (root.isVertical && trackArea.height > thumb.height) {
                        var targetY = mouse.y - thumb.height / 2
                        var maxThumbY = trackArea.height - thumb.height
                        var ratioY = Math.max(0, Math.min(1, targetY / maxThumbY))
                        var maxScrollY = Math.max(0, root.flickable.contentHeight - root.flickable.height)
                        if (root.smoothScroll) root.scrollAnimY.startTo(ratioY * maxScrollY)
                        else root.flickable.contentY = ratioY * maxScrollY
                    } else if (!root.isVertical && trackArea.width > thumb.width) {
                        var targetX = mouse.x - thumb.width / 2
                        var maxThumbX = trackArea.width - thumb.width
                        var ratioX = Math.max(0, Math.min(1, targetX / maxThumbX))
                        var maxScrollX = Math.max(0, root.flickable.contentWidth - root.flickable.width)
                        if (root.smoothScroll) root.scrollAnimX.startTo(ratioX * maxScrollX)
                        else root.flickable.contentX = ratioX * maxScrollX
                    }
                }
            }

            onPositionChanged: function(mouse) {
                if (isDragging && root.flickable && thumb.maxThumbTravel > 0) {
                    var curPos = root.isVertical ? mouse.y : mouse.x
                    var delta = curPos - dragStartMousePos
                    if (root.isVertical) {
                        var maxScrollY = Math.max(0, root.flickable.contentHeight - root.flickable.height)
                        var deltaScrollY = (delta / thumb.maxThumbTravel) * maxScrollY
                        root.flickable.contentY = Math.max(0, Math.min(maxScrollY, dragStartContentPos + deltaScrollY))
                    } else {
                        var maxScrollX = Math.max(0, root.flickable.contentWidth - root.flickable.width)
                        var deltaScrollX = (delta / thumb.maxThumbTravel) * maxScrollX
                        root.flickable.contentX = Math.max(0, Math.min(maxScrollX, dragStartContentPos + deltaScrollX))
                    }
                }
            }

            onReleased: {
                isDragging = false
            }

            onCanceled: {
                isDragging = false
            }
        }
    }

    // End Stepper Cluster (Page Down / To Bottom or Page Right / To Right)
    Item {
        id: endCluster
        property bool hovered: btnEnd1.hovered || btnEnd2.hovered
        visible: root.showButtons
        opacity: root.hovered && root.showButtons ? 1.0 : 0.0
        Behavior on opacity { NumberAnimation { duration: 150 } }

        anchors.bottom: root.isVertical ? parent.bottom : undefined
        anchors.right: parent.right
        anchors.bottomMargin: root.isVertical ? 2 : 0
        anchors.rightMargin: root.isVertical ? 0 : 2
        width: root.isVertical ? root.hitSize : root.buttonClusterSize
        height: root.isVertical ? root.buttonClusterSize : root.hitSize

        Column {
            anchors.fill: parent
            spacing: 2
            visible: root.isVertical

            // Button 1: Page Down
            Rectangle {
                id: btnEnd1
                property bool hovered: maEnd1.containsMouse
                width: root.hitSize - 2
                height: root.hitSize - 2
                anchors.horizontalCenter: parent.horizontalCenter
                radius: 3
                color: maEnd1.pressed ? ThemeTokens.pressed : (hovered ? ThemeTokens.hover : "transparent")
                opacity: root.isAtEnd ? 0.3 : 1.0
                enabled: !root.isAtEnd

                Text {
                    anchors.centerIn: parent
                    text: "▾"
                    font.pixelSize: 10
                    color: ThemeTokens.text
                }
                MouseArea {
                    id: maEnd1
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: root.isAtEnd ? Qt.ArrowCursor : Qt.PointingHandCursor
                    onClicked: root.scrollPageDown()
                }
            }

            // Button 2: To Bottom
            Rectangle {
                id: btnEnd2
                property bool hovered: maEnd2.containsMouse
                width: root.hitSize - 2
                height: root.hitSize - 2
                anchors.horizontalCenter: parent.horizontalCenter
                radius: 3
                color: maEnd2.pressed ? ThemeTokens.pressed : (hovered ? ThemeTokens.hover : "transparent")
                opacity: root.isAtEnd ? 0.3 : 1.0
                enabled: !root.isAtEnd

                Text {
                    anchors.centerIn: parent
                    text: "⇣"
                    font.pixelSize: 11
                    font.bold: true
                    color: ThemeTokens.text
                }
                MouseArea {
                    id: maEnd2
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: root.isAtEnd ? Qt.ArrowCursor : Qt.PointingHandCursor
                    onClicked: root.scrollToEnd()
                }
            }
        }

        Row {
            anchors.fill: parent
            spacing: 2
            visible: !root.isVertical

            // Button 1: Page Right
            Rectangle {
                property bool hovered: maEndH1.containsMouse
                width: root.hitSize - 2
                height: root.hitSize - 2
                anchors.verticalCenter: parent.verticalCenter
                radius: 3
                color: maEndH1.pressed ? ThemeTokens.pressed : (hovered ? ThemeTokens.hover : "transparent")
                opacity: root.isAtEnd ? 0.3 : 1.0
                enabled: !root.isAtEnd

                Text {
                    anchors.centerIn: parent
                    text: "▸"
                    font.pixelSize: 10
                    color: ThemeTokens.text
                }
                MouseArea {
                    id: maEndH1
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: root.isAtEnd ? Qt.ArrowCursor : Qt.PointingHandCursor
                    onClicked: root.scrollPageDown()
                }
            }

            // Button 2: To Right
            Rectangle {
                property bool hovered: maEndH2.containsMouse
                width: root.hitSize - 2
                height: root.hitSize - 2
                anchors.verticalCenter: parent.verticalCenter
                radius: 3
                color: maEndH2.pressed ? ThemeTokens.pressed : (hovered ? ThemeTokens.hover : "transparent")
                opacity: root.isAtEnd ? 0.3 : 1.0
                enabled: !root.isAtEnd

                Text {
                    anchors.centerIn: parent
                    text: "⇢"
                    font.pixelSize: 11
                    font.bold: true
                    color: ThemeTokens.text
                }
                MouseArea {
                    id: maEndH2
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: root.isAtEnd ? Qt.ArrowCursor : Qt.PointingHandCursor
                    onClicked: root.scrollToEnd()
                }
            }
        }
    }
}
