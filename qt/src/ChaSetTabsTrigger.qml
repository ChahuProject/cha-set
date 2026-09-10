// ChaSetTabsTrigger.qml — Individual Tab Trigger Button
// Matching shadcn: inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium
import QtQuick 6.10
import ChaSet

Rectangle {
    id: root

    property string value: ""
    property string text: ""
    property string badge: ""
    property string iconSource: ""
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

    function findList() {
        var p = root.parent;
        while (p) {
            if (p.variant !== undefined) return p;
            p = p.parent;
        }
        return null;
    }

    readonly property Item parentTabs: findTabs()
    readonly property Item parentList: findList()

    property string variant: parentList && parentList.variant ? parentList.variant : (parentTabs && parentTabs.variant ? parentTabs.variant : "default")
    property string size: parentList && parentList.size ? parentList.size : (parentTabs && parentTabs.size ? parentTabs.size : "default")

    readonly property bool isSelected: forceActive || (parentTabs && parentTabs.currentValue === root.value)
    readonly property bool isHovered: (mouseArea.containsMouse || forceHover) && !disabled
    readonly property bool isLine: variant === "line"
    readonly property bool isSm: size === "sm"

    height: isLine ? (isSm ? 32 : 36) : (isSm ? 24 : 28)
    implicitHeight: height
    implicitWidth: Math.max(isSm ? 28 : 36, contentRow.implicitWidth + (isLine ? (isSm ? 12 : 16) : (isSm ? 16 : 24)))
    radius: isLine ? 0 : (isSm ? 4 : 6)
    opacity: disabled ? 0.5 : 1.0

    color: isLine
        ? "transparent"
        : (isSelected
            ? (ThemeTokens.dark ? Qt.rgba(2.0 / 255.0, 8.0 / 255.0, 23.0 / 255.0, 1.0) : Qt.rgba(1.0, 1.0, 1.0, 1.0))
            : "transparent")

    border.width: isLine ? 0 : (isSelected ? 1 : 0)
    border.color: ThemeTokens.dark ? Qt.rgba(30.0 / 255.0, 41.0 / 255.0, 59.0 / 255.0, 0.7) : Qt.rgba(226.0 / 255.0, 232.0 / 255.0, 240.0 / 255.0, 0.8)

    Row {
        id: contentRow
        anchors.centerIn: parent
        spacing: root.isSm ? 4 : 6

        Image {
            id: iconItem
            visible: root.iconSource !== ""
            source: root.iconSource
            width: root.isSm ? 12 : 14
            height: root.isSm ? 12 : 14
            anchors.verticalCenter: parent.verticalCenter
        }

        Text {
            id: textItem
            text: root.text
            font.pixelSize: root.isSm ? 12 : 13
            font.weight: root.isSelected ? Font.Medium : Font.Normal
            font.family: "Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif"
            color: {
                if (root.isSelected || root.isHovered) {
                    return ThemeTokens.dark ? Qt.rgba(248.0 / 255.0, 250.0 / 255.0, 252.0 / 255.0, 1.0) : Qt.rgba(2.0 / 255.0, 8.0 / 255.0, 23.0 / 255.0, 1.0);
                }
                return ThemeTokens.dark ? Qt.rgba(148.0 / 255.0, 163.0 / 255.0, 184.0 / 255.0, 1.0) : Qt.rgba(100.0 / 255.0, 116.0 / 255.0, 139.0 / 255.0, 1.0);
            }
            verticalAlignment: Text.AlignVCenter
        }

        Rectangle {
            id: badgeRect
            visible: root.badge !== ""
            radius: 9999
            height: root.isSm ? 14 : 16
            width: Math.max(height, badgeText.implicitWidth + (root.isSm ? 6 : 8))
            color: Qt.rgba(148.0 / 255.0, 163.0 / 255.0, 184.0 / 255.0, 0.15)
            anchors.verticalCenter: parent.verticalCenter

            Text {
                id: badgeText
                anchors.centerIn: parent
                text: root.badge
                font.pixelSize: root.isSm ? 10 : 11
                font.weight: Font.Medium
                color: root.isSelected ? ThemeTokens.text : ThemeTokens.subduedText
            }
        }
    }

    Rectangle {
        id: lineIndicator
        visible: root.isLine && root.isSelected
        anchors.bottom: parent.bottom
        anchors.left: parent.left
        anchors.right: parent.right
        height: 2
        color: ThemeTokens.accent
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
