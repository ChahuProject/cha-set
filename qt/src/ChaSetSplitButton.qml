// ChaSetSplitButton.qml — Cross-Stack Split Button Component
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root

    property string text: "Action"
    property string variant: "default"
    property string size: "default"
    property bool disabled: false
    property var menuItems: [] // [{ id, label, icon, destructive, onSelect }]
    property int customRadius: 6

    signal clicked()
    signal menuItemClicked(string itemId)

    implicitWidth: rowLayout.width
    implicitHeight: mainBtn.height

    Row {
        id: rowLayout
        spacing: 0

        ChaSetButton {
            id: mainBtn
            text: root.text
            variant: root.variant
            size: root.size
            disabled: root.disabled
            customRadius: root.customRadius
            onClicked: root.clicked()
        }

        // Inner vertical hairline divider
        Rectangle {
            width: 1
            height: mainBtn.height
            color: ThemeTokens.border
            opacity: 0.8
        }

        ChaSetButton {
            id: chevronBtn
            text: "▾"
            variant: root.variant
            size: root.size === "sm" ? "icon-sm" : (root.size === "lg" ? "icon-lg" : "icon")
            disabled: root.disabled
            customRadius: root.customRadius
            onClicked: splitPopup.open()
        }
    }

    Popup {
        id: splitPopup
        y: mainBtn.height + 4
        x: rowLayout.width - width
        width: 160
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
                model: root.menuItems
                delegate: Rectangle {
                    required property var modelData
                    width: parent.width
                    height: 28
                    radius: 4
                    color: itemMouse.containsMouse ? (modelData.destructive ? Qt.rgba(239/255, 68/255, 68/255, 0.15) : ThemeTokens.hover) : "transparent"

                    Row {
                        anchors.fill: parent
                        anchors.leftMargin: 8
                        anchors.rightMargin: 8
                        spacing: 6

                        Text {
                            visible: !!parent.parent.modelData.icon
                            text: parent.parent.modelData.icon || ""
                            font.pixelSize: 12
                            anchors.verticalCenter: parent.verticalCenter
                        }

                        Text {
                            text: parent.parent.modelData.label || ""
                            color: parent.parent.modelData.destructive ? ThemeTokens.danger : ThemeTokens.text
                            font.pixelSize: 12
                            anchors.verticalCenter: parent.verticalCenter
                        }
                    }

                    MouseArea {
                        id: itemMouse
                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        onClicked: {
                            splitPopup.close()
                            if (typeof parent.modelData.onSelect === "function") {
                                parent.modelData.onSelect()
                            }
                            root.menuItemClicked(parent.modelData.id || parent.modelData.label)
                        }
                    }
                }
            }
        }
    }
}
