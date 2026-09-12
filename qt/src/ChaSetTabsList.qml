// ChaSetTabsList.qml — Container for Tab Triggers
// Matching shadcn: inline-flex items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground
import QtQuick 6.10
import ChaSet

Rectangle {
    id: root

    function findTabs() {
        var p = root.parent;
        while (p) {
            if (p.currentValue !== undefined) return p;
            p = p.parent;
        }
        return null;
    }

    readonly property Item parentTabs: findTabs()

    property string variant: parentTabs && parentTabs.variant ? parentTabs.variant : "default" // "default" | "line"
    property string size: parentTabs && parentTabs.size ? parentTabs.size : "default"          // "default" | "sm"
    property string orientation: "horizontal" // "horizontal" | "vertical"
    property alias spacing: contentLayout.spacing
    default property alias contentData: contentLayout.data

    property int padding: variant === "line" ? 0 : (size === "sm" ? 2 : 4)
    property int customRadius: variant === "line" ? 0 : 8

    readonly property bool isVert: orientation === "vertical"
    readonly property bool isLine: variant === "line"
    readonly property bool isSm: size === "sm"

    implicitHeight: isVert
        ? (contentLayout.implicitHeight + padding * 2)
        : (isLine ? (isSm ? 32 : 36) : (isSm ? 28 : 36))
    implicitWidth: contentLayout.implicitWidth + padding * 2

    radius: customRadius
    color: isLine
        ? "transparent"
        : (ThemeTokens.dark ? Qt.rgba(30.0 / 255.0, 41.0 / 255.0, 59.0 / 255.0, 1.0) : Qt.rgba(241.0 / 255.0, 245.0 / 255.0, 249.0 / 255.0, 1.0))

    Grid {
        id: contentLayout
        anchors.fill: parent
        anchors.margins: root.padding
        columns: root.isVert ? 1 : -1
        rows: root.isVert ? -1 : 1
        spacing: root.isLine ? (root.isSm ? 8 : 16) : 0
        verticalItemAlignment: Grid.AlignVCenter
        horizontalItemAlignment: root.isLine ? Grid.AlignLeft : Grid.AlignHCenter
    }

    Rectangle {
        id: bottomLine
        visible: root.isLine && !root.isVert
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.bottom: parent.bottom
        height: 1
        color: ThemeTokens.border
    }
}
