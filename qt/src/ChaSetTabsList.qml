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

    property bool initialized: false
    Component.onCompleted: Qt.callLater(function() { root.initialized = true })

    function getActiveTrigger() {
        if (!parentTabs || parentTabs.currentValue === undefined) return null;
        for (var i = 0; i < contentLayout.children.length; i++) {
            var c = contentLayout.children[i];
            if (c && c.value !== undefined && c.value === parentTabs.currentValue) {
                return c;
            }
        }
        return null;
    }

    readonly property string currentTabVal: parentTabs && parentTabs.currentValue !== undefined ? parentTabs.currentValue : ""
    readonly property Item activeTrigger: {
        var _dummy = currentTabVal;
        return getActiveTrigger();
    }

    // Smooth sliding indicator pill for variant === "default"
    Rectangle {
        id: pillIndicator
        z: 0
        visible: !root.isLine && root.activeTrigger !== null
        x: root.activeTrigger ? (contentLayout.x + root.activeTrigger.x) : 0
        y: root.activeTrigger ? (contentLayout.y + root.activeTrigger.y) : 0
        width: root.activeTrigger ? root.activeTrigger.width : 0
        height: root.activeTrigger ? root.activeTrigger.height : 0
        radius: root.isSm ? 4 : 6
        color: ThemeTokens.dark ? Qt.rgba(2.0 / 255.0, 8.0 / 255.0, 23.0 / 255.0, 1.0) : Qt.rgba(1.0, 1.0, 1.0, 1.0)
        border.width: 1
        border.color: ThemeTokens.dark ? Qt.rgba(30.0 / 255.0, 41.0 / 255.0, 59.0 / 255.0, 0.7) : Qt.rgba(226.0 / 255.0, 232.0 / 255.0, 240.0 / 255.0, 0.8)

        Behavior on x {
            enabled: root.initialized && ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
            NumberAnimation { duration: 180; easing.type: Easing.OutCubic }
        }
        Behavior on y {
            enabled: root.initialized && ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
            NumberAnimation { duration: 180; easing.type: Easing.OutCubic }
        }
        Behavior on width {
            enabled: root.initialized && ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
            NumberAnimation { duration: 180; easing.type: Easing.OutCubic }
        }
        Behavior on height {
            enabled: root.initialized && ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
            NumberAnimation { duration: 180; easing.type: Easing.OutCubic }
        }
    }

    Grid {
        id: contentLayout
        z: 1
        anchors.fill: parent
        anchors.margins: root.padding
        columns: root.isVert ? 1 : -1
        rows: root.isVert ? -1 : 1
        spacing: root.isLine ? (root.isSm ? 8 : 16) : 0
        verticalItemAlignment: Grid.AlignVCenter
        horizontalItemAlignment: root.isLine ? Grid.AlignLeft : Grid.AlignHCenter
    }

    // Static border line under tabs in line variant
    Rectangle {
        id: bottomLine
        z: 0
        visible: root.isLine && !root.isVert
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.bottom: parent.bottom
        height: 1
        color: ThemeTokens.border
    }

    // Smooth sliding underline indicator for variant === "line"
    Rectangle {
        id: lineActiveIndicator
        z: 2
        visible: root.isLine && !root.isVert && root.activeTrigger !== null
        x: root.activeTrigger ? (contentLayout.x + root.activeTrigger.x) : 0
        y: root.height - 2
        width: root.activeTrigger ? root.activeTrigger.width : 0
        height: 2
        color: ThemeTokens.accent

        Behavior on x {
            enabled: root.initialized && ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
            NumberAnimation { duration: 180; easing.type: Easing.OutCubic }
        }
        Behavior on width {
            enabled: root.initialized && ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
            NumberAnimation { duration: 180; easing.type: Easing.OutCubic }
        }
    }
}
