// ChaSetSidebar.qml — Cross-Stack Responsive Desktop Sidebar Component
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root

    property int sidebarWidth: 256
    property int minWidth: 160
    property int maxWidth: 400
    property int iconWidth: 52
    property bool collapsed: false
    property string side: "left" // "left" | "right"
    property string variant: "sidebar" // "sidebar" | "floating" | "inset"
    property string collapsible: "icon" // "offcanvas" | "icon" | "none"
    property bool resizable: true

    signal toggled(bool isCollapsed)

    readonly property bool isRight: root.side === "right"
    readonly property bool isOffcanvas: root.collapsible === "offcanvas"
    readonly property bool isIconMode: root.collapsible === "icon"

    readonly property int effectiveWidth: {
        if (!root.collapsed || root.collapsible === "none") {
            return root.sidebarWidth
        }
        if (root.isIconMode) {
            return root.iconWidth
        }
        return 0 // offcanvas
    }

    width: effectiveWidth
    implicitWidth: effectiveWidth
    implicitHeight: 600

    property bool isResizing: false

    function toggle() {
        if (root.collapsible === "none") return
        root.collapsed = !root.collapsed
        root.toggled(root.collapsed)
    }

    Behavior on width {
        enabled: !root.isResizing
        NumberAnimation { duration: 180; easing.type: Easing.OutCubic }
    }

    Rectangle {
        id: bgPanel
        anchors.fill: parent
        color: root.variant === "floating" ? ThemeTokens.panelRaised : ThemeTokens.panel
        border.color: ThemeTokens.border
        border.width: root.variant === "floating" ? 1 : 0
        radius: root.variant === "floating" ? 8 : (root.variant === "inset" ? 6 : 0)
        clip: true

        // Separating border on dock edge
        Rectangle {
            id: dockBorder
            visible: root.variant === "sidebar"
            width: 1
            height: parent.height
            anchors.right: root.isRight ? undefined : parent.right
            anchors.left: root.isRight ? parent.left : undefined
            color: ThemeTokens.border
        }

        // Inner layout container
        Column {
            anchors.fill: parent
            anchors.margins: root.variant === "floating" ? 8 : 0
            spacing: 0

            // Content host for injected QML elements
            Item {
                id: contentHost
                width: parent.width
                height: parent.height
                clip: true
            }
        }
    }

    // Default alias for children placed inside ChaSetSidebar
    default property alias contentData: contentHost.data

    // Interactive Resizable Rail
    Rectangle {
        id: rail
        visible: root.resizable && (!root.collapsed || root.isIconMode)
        width: 6
        anchors.top: parent.top
        anchors.bottom: parent.bottom
        anchors.right: root.isRight ? undefined : parent.right
        anchors.left: root.isRight ? parent.left : undefined
        anchors.rightMargin: root.isRight ? 0 : -3
        anchors.leftMargin: root.isRight ? -3 : 0
        z: 100
        color: railMouse.containsMouse || root.isResizing ? ThemeTokens.accent : "transparent"
        opacity: railMouse.containsMouse || root.isResizing ? 0.75 : 0.0

        Behavior on opacity {
            NumberAnimation { duration: 150 }
        }

        MouseArea {
            id: railMouse
            anchors.fill: parent
            hoverEnabled: true
            cursorShape: Qt.SizeHorCursor

            property int startX: 0
            property int startWidth: 0

            onPressed: function(mouse) {
                railMouse.startX = mouse.x
                railMouse.startWidth = root.effectiveWidth
                root.isResizing = true
            }

            onPositionChanged: function(mouse) {
                if (pressed) {
                    var delta = mouse.x - railMouse.startX
                    var newW = root.isRight
                        ? (railMouse.startWidth - delta)
                        : (railMouse.startWidth + delta)

                    if (newW < 96 && root.collapsible !== "none") {
                        root.collapsed = true
                    } else {
                        root.collapsed = false
                        root.sidebarWidth = Math.max(root.minWidth, Math.min(root.maxWidth, newW))
                    }
                }
            }

            onReleased: {
                root.isResizing = false
            }

            onDoubleClicked: {
                root.sidebarWidth = 256
                root.collapsed = false
            }
        }
    }
}
