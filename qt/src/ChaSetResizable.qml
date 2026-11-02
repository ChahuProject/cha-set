// ChaSetResizable.qml — Cross-Stack Resizable Panel Group Component
import QtQuick
import QtQuick.Controls
import ChaSet

SplitView {
    id: root

    // Container-owned rounding contract (React parity):
    // ResizablePanelGroup itself is borderless; the caller draws
    // `rounded-lg border border-border bg-card overflow-hidden` and insets
    // this view by the 1px border ring (anchors.margins: 1). This SplitView
    // must never draw its own radius/border: its dynamic panes are opaque
    // square Rectangles that would cover any rounding painted here.
    // clip: true keeps dragged panes inside the inset viewport so they can
    // never paint over the caller's border ring (occlusion fix).
    clip: true

    property bool withHandle: false
    property int handleThickness: withHandle ? 8 : 4
    readonly property int effectiveHandleThickness: ThemeTokens.dp(root.handleThickness)
    property color handleColor: ThemeTokens.border
    property color handleHoverColor: ThemeTokens.accent
    property color handleGripColor: ThemeTokens.subduedText

    implicitWidth: ThemeTokens.dp(400)
    implicitHeight: ThemeTokens.dp(300)

    handle: Rectangle {
        id: handleDelegate
        implicitWidth: root.orientation === Qt.Horizontal ? root.effectiveHandleThickness : root.width
        implicitHeight: root.orientation === Qt.Vertical ? root.effectiveHandleThickness : root.height
        color: "transparent"

        HoverHandler {
            cursorShape: root.orientation === Qt.Horizontal ? Qt.SizeHorCursor : Qt.SizeVerCursor
        }

        readonly property bool isVisualActive: handleDelegate.SplitHandle.pressed || handleDelegate.SplitHandle.hovered
        readonly property int visualThickness: isVisualActive ? ThemeTokens.dp(3) : 1

        // Hairline visual spanning the FULL handle extent.
        // At rest: subtle 1px hairline.
        // On hover/pressed: expands to wider visual thickness (ThemeTokens.dp(3)) with ThemeTokens.accent color.
        Rectangle {
            anchors.centerIn: parent
            width: root.orientation === Qt.Horizontal ? handleDelegate.visualThickness : parent.width
            height: root.orientation === Qt.Vertical ? handleDelegate.visualThickness : parent.height
            color: handleDelegate.isVisualActive ? root.handleHoverColor : root.handleColor

            Behavior on width {
                enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
                NumberAnimation { duration: ThemeTokens.motionQuick; easing.type: ThemeTokens.easeStandard }
            }
            Behavior on height {
                enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
                NumberAnimation { duration: ThemeTokens.motionQuick; easing.type: ThemeTokens.easeStandard }
            }
            Behavior on color {
                enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
                ColorAnimation { duration: ThemeTokens.motionQuick; easing.type: ThemeTokens.easeStandard }
            }
        }

        Item {
            id: gripContainer
            visible: root.withHandle
            anchors.centerIn: parent
            width: root.orientation === Qt.Horizontal ? ThemeTokens.dp(12) : ThemeTokens.dp(16)
            height: root.orientation === Qt.Horizontal ? ThemeTokens.dp(16) : ThemeTokens.dp(12)

            Rectangle {
                anchors.fill: parent
                radius: ThemeTokens.dp(2)
                color: ThemeTokens.panel
                border.color: handleDelegate.SplitHandle.hovered || handleDelegate.SplitHandle.pressed ? ThemeTokens.accent : ThemeTokens.border
                border.width: 1

                Behavior on border.color {
                    enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
                    ColorAnimation { duration: ThemeTokens.motionQuick; easing.type: ThemeTokens.easeStandard }
                }

                Row {
                    anchors.centerIn: parent
                    spacing: 2
                    visible: root.orientation === Qt.Horizontal

                    Column {
                        spacing: 2
                        Rectangle { width: 2; height: 2; radius: 1; color: root.handleGripColor }
                        Rectangle { width: 2; height: 2; radius: 1; color: root.handleGripColor }
                        Rectangle { width: 2; height: 2; radius: 1; color: root.handleGripColor }
                    }
                    Column {
                        spacing: 2
                        Rectangle { width: 2; height: 2; radius: 1; color: root.handleGripColor }
                        Rectangle { width: 2; height: 2; radius: 1; color: root.handleGripColor }
                        Rectangle { width: 2; height: 2; radius: 1; color: root.handleGripColor }
                    }
                }

                Column {
                    anchors.centerIn: parent
                    spacing: 2
                    visible: root.orientation === Qt.Vertical

                    Row {
                        spacing: 2
                        Rectangle { width: 2; height: 2; radius: 1; color: root.handleGripColor }
                        Rectangle { width: 2; height: 2; radius: 1; color: root.handleGripColor }
                        Rectangle { width: 2; height: 2; radius: 1; color: root.handleGripColor }
                    }
                    Row {
                        spacing: 2
                        Rectangle { width: 2; height: 2; radius: 1; color: root.handleGripColor }
                        Rectangle { width: 2; height: 2; radius: 1; color: root.handleGripColor }
                        Rectangle { width: 2; height: 2; radius: 1; color: root.handleGripColor }
                    }
                }
            }
        }
    }
}
