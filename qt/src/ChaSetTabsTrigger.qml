// ChaSetTabsTrigger.qml — Individual Tab Trigger Button
// Matching shadcn: inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium
import QtQuick 6.10
import ChaSet

Rectangle {
    id: root

    property string value: ""
    property string text: ""
    property bool disabled: false
    property bool forceHover: false
    property bool forceActive: false
    property Item tabs: null

    signal clicked()

    function findTabs() {
        if (tabs) return tabs;
        var p = root.parent;
        while (p) {
            if (p.currentValue !== undefined) return p;
            p = p.parent;
        }
        return null;
    }

    readonly property Item parentTabs: findTabs()
    readonly property bool isSelected: forceActive || (parentTabs && parentTabs.currentValue === root.value)
    readonly property bool isHovered: (mouseArea.containsMouse || forceHover) && !disabled

    height: 28
    implicitHeight: 28
    implicitWidth: Math.max(36, textItem.implicitWidth + 24)
    radius: 6
    opacity: disabled ? 0.5 : 1.0

    color: isSelected
        ? (ThemeTokens.dark ? Qt.rgba(2.0 / 255.0, 8.0 / 255.0, 23.0 / 255.0, 1.0) : Qt.rgba(1.0, 1.0, 1.0, 1.0))
        : "transparent"

    border.width: isSelected ? 1 : 0
    border.color: ThemeTokens.dark ? Qt.rgba(30.0 / 255.0, 41.0 / 255.0, 59.0 / 255.0, 0.7) : Qt.rgba(226.0 / 255.0, 232.0 / 255.0, 240.0 / 255.0, 0.8)

    Text {
        id: textItem
        anchors.centerIn: parent
        text: root.text
        font.pixelSize: 13
        font.weight: root.isSelected ? Font.Medium : Font.Normal
        font.family: "Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif"
        color: {
            if (root.isSelected || root.isHovered) {
                return ThemeTokens.dark ? Qt.rgba(248.0 / 255.0, 250.0 / 255.0, 252.0 / 255.0, 1.0) : Qt.rgba(2.0 / 255.0, 8.0 / 255.0, 23.0 / 255.0, 1.0);
            }
            return ThemeTokens.dark ? Qt.rgba(148.0 / 255.0, 163.0 / 255.0, 184.0 / 255.0, 1.0) : Qt.rgba(100.0 / 255.0, 116.0 / 255.0, 139.0 / 255.0, 1.0);
        }
    }

    MouseArea {
        id: mouseArea
        anchors.fill: parent
        hoverEnabled: !root.disabled
        cursorShape: root.disabled ? Qt.ArrowCursor : Qt.PointingHandCursor
        enabled: !root.disabled
        onClicked: {
            if (root.parentTabs) {
                root.parentTabs.currentValue = root.value;
            }
            root.clicked();
        }
    }

    // Keyboard support: Space or Enter activates
    Keys.onSpacePressed: {
        if (!root.disabled) {
            if (root.parentTabs) root.parentTabs.currentValue = root.value;
            root.clicked();
        }
    }
    Keys.onReturnPressed: {
        if (!root.disabled) {
            if (root.parentTabs) root.parentTabs.currentValue = root.value;
            root.clicked();
        }
    }
}
