// ChaSetSplitterHandle.qml — Cross-stack SplitterHandle component for Qt Quick Desktop matching React SplitterHandle 1:1
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root

    // Component API Contract per spec/components/splitter-handle.ts
    // Edge: "left" | "right" | "top" | "bottom"
    property string edge: "left"

    property real targetSize: 200
    property real minSize: 100
    property real maxSize: 1000
    property real defaultSize: minSize

    property bool liveUpdate: true
    property Item referenceItem: null

    property real hitThickness: 6
    property real visualThickness: 1
    property real activeVisualThickness: 2
    property bool disabled: false

    property color lineColor: ThemeTokens.border
    property color activeLineColor: ThemeTokens.accent

    readonly property bool isVertical: edge === "left" || edge === "right"
    readonly property bool dragging: mouseArea.pressed
    readonly property bool hovered: mouseArea.containsMouse
    readonly property bool active: dragging || hovered

    signal sizeChanging(real newSize)
    signal sizeChanged(real finalSize)
    signal doubleClicked()

    // Default edge geometric anchoring
    anchors.top: isVertical ? (parent ? parent.top : undefined) : (edge === "top" && parent ? parent.top : undefined)
    anchors.bottom: isVertical ? (parent ? parent.bottom : undefined) : (edge === "bottom" && parent ? parent.bottom : undefined)
    anchors.left: !isVertical ? (parent ? parent.left : undefined) : (edge === "left" && parent ? parent.left : undefined)
    anchors.right: !isVertical ? (parent ? parent.right : undefined) : (edge === "right" && parent ? parent.right : undefined)

    width: isVertical ? hitThickness : (parent ? parent.width : 0)
    height: isVertical ? (parent ? parent.height : 0) : hitThickness
    z: 10

    activeFocusOnTab: !disabled

    Rectangle {
        id: visualLine
        anchors.left: root.edge === "left" ? parent.left : (root.edge === "right" ? undefined : parent.left)
        anchors.right: root.edge === "right" ? parent.right : (root.edge === "left" ? undefined : parent.right)
        anchors.top: root.edge === "top" ? parent.top : (root.edge === "bottom" ? undefined : parent.top)
        anchors.bottom: root.edge === "bottom" ? parent.bottom : (root.edge === "top" ? undefined : parent.bottom)

        width: root.isVertical ? (root.active ? root.activeVisualThickness : root.visualThickness) : parent.width
        height: root.isVertical ? parent.height : (root.active ? root.activeVisualThickness : root.visualThickness)
        color: root.active ? root.activeLineColor : root.lineColor
        opacity: root.active ? 1.0 : 0.75

        Behavior on color {
            enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
            ColorAnimation { duration: ThemeTokens.motionQuick; easing.type: ThemeTokens.easeStandard }
        }
        Behavior on opacity {
            enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
            NumberAnimation { duration: ThemeTokens.motionQuick; easing.type: ThemeTokens.easeStandard }
        }
    }

    MouseArea {
        id: mouseArea
        objectName: "splitterMouseArea"
        anchors.fill: parent
        hoverEnabled: true
        enabled: !root.disabled
        preventStealing: true
        cursorShape: root.isVertical ? Qt.SizeHorCursor : Qt.SizeVerCursor

        property point pressRefPos: Qt.point(0, 0)
        property real startSize: 0

        function getRefPoint(mouse) {
            const ref = root.referenceItem;
            return root.mapToItem(ref, mouse.x, mouse.y);
        }

        onPressed: (mouse) => {
            root.forceActiveFocus();
            pressRefPos = getRefPoint(mouse);
            startSize = root.targetSize;
        }

        onPositionChanged: (mouse) => {
            if (!pressed)
                return;

            const curRefPos = getRefPoint(mouse);
            const deltaX = curRefPos.x - pressRefPos.x;
            const deltaY = curRefPos.y - pressRefPos.y;

            let computed = startSize;
            if (root.edge === "left") {
                computed = startSize - deltaX;
            } else if (root.edge === "right") {
                computed = startSize + deltaX;
            } else if (root.edge === "top") {
                computed = startSize - deltaY;
            } else if (root.edge === "bottom") {
                computed = startSize + deltaY;
            }

            const clamped = Math.max(root.minSize, Math.min(root.maxSize, computed));
            root.sizeChanging(clamped);
            if (root.liveUpdate) {
                root.targetSize = clamped;
            }
        }

        onReleased: (mouse) => {
            const curRefPos = getRefPoint(mouse);
            const deltaX = curRefPos.x - pressRefPos.x;
            const deltaY = curRefPos.y - pressRefPos.y;

            let computed = startSize;
            if (root.edge === "left") {
                computed = startSize - deltaX;
            } else if (root.edge === "right") {
                computed = startSize + deltaX;
            } else if (root.edge === "top") {
                computed = startSize - deltaY;
            } else if (root.edge === "bottom") {
                computed = startSize + deltaY;
            }

            const clamped = Math.max(root.minSize, Math.min(root.maxSize, computed));
            if (!root.liveUpdate) {
                root.targetSize = clamped;
            }
            root.sizeChanged(clamped);
        }

        onDoubleClicked: {
            root.doubleClicked();
            if (root.defaultSize > 0) {
                root.targetSize = root.defaultSize;
                root.sizeChanged(root.defaultSize);
            }
        }
    }

    Keys.onPressed: (event) => {
        if (root.disabled) return;
        var step = 10;
        var computed = root.targetSize;
        if ((root.isVertical && event.key === Qt.Key_Left) || (!root.isVertical && event.key === Qt.Key_Up)) {
            event.accepted = true;
            computed = (root.edge === "left" || root.edge === "top") ? root.targetSize + step : root.targetSize - step;
        } else if ((root.isVertical && event.key === Qt.Key_Right) || (!root.isVertical && event.key === Qt.Key_Down)) {
            event.accepted = true;
            computed = (root.edge === "left" || root.edge === "top") ? root.targetSize - step : root.targetSize + step;
        } else if (event.key === Qt.Key_Home) {
            event.accepted = true;
            computed = root.minSize;
        } else if (event.key === Qt.Key_End) {
            event.accepted = true;
            computed = root.maxSize;
        } else if (event.key === Qt.Key_Return || event.key === Qt.Key_Enter) {
            event.accepted = true;
            root.doubleClicked();
            if (root.defaultSize > 0) computed = root.defaultSize;
        } else {
            return;
        }
        var clamped = Math.max(root.minSize, Math.min(root.maxSize, computed));
        root.sizeChanging(clamped);
        root.targetSize = clamped;
        root.sizeChanged(clamped);
    }
}
