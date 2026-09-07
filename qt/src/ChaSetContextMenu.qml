// ChaSetContextMenu.qml — Cross-Stack Context Menu Component
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root

    property var items: [] // [{ id, label, icon, shortcut, destructive, disabled, onSelect }]
    property int menuWidth: 180
    property int customRadius: 6

    signal itemSelected(string itemId)

    default property alias targetData: targetContainer.data

    Item {
        id: targetContainer
        anchors.fill: parent
    }

    MouseArea {
        anchors.fill: parent
        acceptedButtons: Qt.RightButton
        onClicked: function(mouse) {
            if (mouse.button === Qt.RightButton) {
                contextPopup.x = mouse.x
                contextPopup.y = mouse.y
                contextPopup.open()
            }
        }
    }

    Popup {
        id: contextPopup
        width: root.menuWidth
        padding: 4
        modal: false
        focus: true
        closePolicy: Popup.CloseOnEscape | Popup.CloseOnPressOutside

        background: Rectangle {
            color: ThemeTokens.panel
            border.color: ThemeTokens.border
            border.width: 1
            radius: root.customRadius
        }

        contentItem: Column {
            spacing: 2
            width: parent.width

            Repeater {
                model: root.items
                delegate: Rectangle {
                    required property var modelData
                    width: parent.width
                    height: 28
                    radius: 4
                    color: itemMouse.containsMouse ? (modelData.destructive ? Qt.rgba(239/255, 68/255, 68/255, 0.15) : ThemeTokens.hover) : "transparent"
                    opacity: modelData.disabled ? 0.4 : 1.0

                    Row {
                        anchors.fill: parent
                        anchors.leftMargin: 8
                        anchors.rightMargin: 8
                        spacing: 6

                        Text {
                            visible: !!parent.parent.modelData.icon
                            text: parent.parent.modelData.icon || ""
                            color: parent.parent.modelData.destructive ? ThemeTokens.danger : ThemeTokens.text
                            font.pixelSize: 12
                            anchors.verticalCenter: parent.verticalCenter
                        }

                        Text {
                            text: parent.parent.modelData.label || ""
                            color: parent.parent.modelData.destructive ? ThemeTokens.danger : ThemeTokens.text
                            font.pixelSize: 12
                            anchors.verticalCenter: parent.verticalCenter
                        }

                        Item { width: 1; height: 1; Layout.fillWidth: true }

                        Text {
                            visible: !!parent.parent.modelData.shortcut
                            text: parent.parent.modelData.shortcut || ""
                            color: ThemeTokens.subduedText
                            font.pixelSize: 10
                            font.family: "monospace"
                            anchors.verticalCenter: parent.verticalCenter
                        }
                    }

                    MouseArea {
                        id: itemMouse
                        anchors.fill: parent
                        hoverEnabled: !parent.modelData.disabled
                        cursorShape: parent.modelData.disabled ? Qt.ArrowCursor : Qt.PointingHandCursor
                        onClicked: {
                            if (parent.modelData.disabled) return
                            contextPopup.close()
                            if (typeof parent.modelData.onSelect === "function") {
                                parent.modelData.onSelect()
                            }
                            root.itemSelected(parent.modelData.id || parent.modelData.label)
                        }
                    }
                }
            }
        }
    }
}
