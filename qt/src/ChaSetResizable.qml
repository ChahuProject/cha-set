// ChaSetResizable.qml — Cross-Stack Resizable Panel Group Component
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

SplitView {
    id: root

    property bool withHandle: false
    property int handleThickness: withHandle ? 8 : 4
    property color handleColor: ThemeTokens.border
    property color handleHoverColor: ThemeTokens.accent
    property color handleGripColor: ThemeTokens.subduedText

    implicitWidth: 400
    implicitHeight: 300

    handle: Rectangle {
        id: handleDelegate
        implicitWidth: root.orientation === Qt.Horizontal ? root.handleThickness : root.width
        implicitHeight: root.orientation === Qt.Vertical ? root.handleThickness : root.height
        color: SplitHandle.pressed || SplitHandle.hovered ? root.handleHoverColor : root.handleColor

        Item {
            id: gripContainer
            visible: root.withHandle
            anchors.centerIn: parent
            width: root.orientation === Qt.Horizontal ? 12 : 20
            height: root.orientation === Qt.Horizontal ? 20 : 12

            Rectangle {
                anchors.fill: parent
                radius: 3
                color: ThemeTokens.panel
                border.color: handleDelegate.SplitHandle.hovered || handleDelegate.SplitHandle.pressed ? ThemeTokens.accent : ThemeTokens.border
                border.width: 1

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
