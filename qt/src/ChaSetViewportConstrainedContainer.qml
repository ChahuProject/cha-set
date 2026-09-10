// ChaSetViewportConstrainedContainer.qml — Cross-Stack Viewport Constrained Container Component
// Dynamically bounds max-height based on available viewport space below the anchor.
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Rectangle {
    id: root

    property var maxHeight: undefined
    property var minHeight: 80
    property real margin: 16
    property string overflow: "auto" // "auto" | "scroll"
    property int customRadius: 6
    property color backgroundColor: ThemeTokens.panel
    property color borderColor: ThemeTokens.border

    // Accessible properties
    Accessible.role: Accessible.Pane
    Accessible.name: "Viewport Constrained Container"

    radius: customRadius
    color: backgroundColor
    border.width: 1
    border.color: borderColor
    clip: true

    default property alias contentData: contentContainer.data
    property alias contentItem: contentContainer
    property alias flickable: flickableItem

    readonly property real minH: {
        if (typeof root.minHeight === "number" && root.minHeight > 0) return root.minHeight;
        if (typeof root.minHeight === "string") {
            var parsed = parseInt(root.minHeight, 10);
            if (!isNaN(parsed) && parsed > 0) return parsed;
        }
        return 80;
    }

    // Calculated bounded height
    readonly property real availableViewportRemaining: {
        var win = root.Window.window;
        if (win && win.contentItem) {
            var mapped = root.mapToItem(win.contentItem, 0, 0);
            return win.height - mapped.y - root.margin;
        }
        if (root.parent) {
            return root.parent.height - root.y - root.margin;
        }
        return 600;
    }

    readonly property real calculatedMaxHeight: {
        var avail = Math.max(root.minH, availableViewportRemaining);
        var upper = root.Window.window ? (root.Window.window.height - 16) : 600;
        var limit = avail;

        if (typeof root.maxHeight === "number" && root.maxHeight > 0) {
            limit = Math.min(root.maxHeight, avail);
        } else if (typeof root.maxHeight === "string") {
            var parsed = parseInt(root.maxHeight, 10);
            if (!isNaN(parsed) && parsed > 0) {
                limit = Math.min(parsed, avail);
            }
        }

        return Math.max(root.minH, Math.min(limit, upper, avail));
    }

    implicitWidth: Math.max(contentContainer.implicitWidth, 120)
    implicitHeight: {
        var contentH = contentContainer.implicitHeight > 0 ? contentContainer.implicitHeight : 0;
        if (root.overflow === "scroll") {
            return calculatedMaxHeight;
        }
        return contentH > 0 ? Math.min(contentH, calculatedMaxHeight) : calculatedMaxHeight;
    }

    ChaSetScrollArea {
        id: flickableItem
        anchors.fill: parent
        clip: true
        showHorizontalScrollBar: false
        showVerticalScrollBar: root.overflow === "scroll" || (contentContainer.implicitHeight > root.height)

        Item {
            id: contentContainer
            width: root.width > 0 ? root.width : implicitWidth
            implicitWidth: childrenRect.width
            implicitHeight: childrenRect.height
        }
    }
}

