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
            Keys.onDownPressed: function(event) {
                event.accepted = true
                splitPopup.open()
            }
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

        property int highlightedIndex: -1
        property string modality: "keyboard"
        property real lastPointerX: -1
        property real lastPointerY: -1

        onAboutToShow: {
            highlightedIndex = 0
            modality = "keyboard"
            lastPointerX = -1
            lastPointerY = -1
        }

        function triggerItem(idx) {
            if (idx >= 0 && idx < root.menuItems.length) {
                let item = root.menuItems[idx]
                splitPopup.close()
                if (typeof item.onSelect === "function") {
                    item.onSelect()
                }
                root.menuItemClicked(item.id || item.label)
            }
        }

        background: Rectangle {
            color: ThemeTokens.panel
            border.color: ThemeTokens.border
            border.width: 1
            radius: root.customRadius
        }

        contentItem: Column {
            spacing: 2
            width: parent.width
            focus: true

            Keys.onDownPressed: function(event) {
                event.accepted = true
                splitPopup.modality = "keyboard"
                var len = root.menuItems ? root.menuItems.length : 0
                if (len > 0) {
                    splitPopup.highlightedIndex = (splitPopup.highlightedIndex + 1) % len
                }
            }

            Keys.onUpPressed: function(event) {
                event.accepted = true
                splitPopup.modality = "keyboard"
                var len = root.menuItems ? root.menuItems.length : 0
                if (len > 0) {
                    splitPopup.highlightedIndex = (splitPopup.highlightedIndex - 1 + len) % len
                }
            }

            Keys.onPressed: function(event) {
                if (event.key === Qt.Key_Home) {
                    event.accepted = true
                    splitPopup.modality = "keyboard"
                    splitPopup.highlightedIndex = 0
                } else if (event.key === Qt.Key_End) {
                    event.accepted = true
                    splitPopup.modality = "keyboard"
                    var len = root.menuItems ? root.menuItems.length : 0
                    if (len > 0) {
                        splitPopup.highlightedIndex = len - 1
                    }
                }
            }

            Keys.onReturnPressed: function(event) {
                event.accepted = true
                splitPopup.triggerItem(splitPopup.highlightedIndex)
            }

            Keys.onEnterPressed: function(event) {
                event.accepted = true
                splitPopup.triggerItem(splitPopup.highlightedIndex)
            }

            Keys.onSpacePressed: function(event) {
                event.accepted = true
                splitPopup.triggerItem(splitPopup.highlightedIndex)
            }

            Repeater {
                model: root.menuItems
                delegate: Rectangle {
                    required property var modelData
                    required property int index
                    width: parent.width
                    height: 28
                    radius: 4

                    readonly property bool isHighlighted: (splitPopup.modality === "keyboard" && splitPopup.highlightedIndex === index) || (splitPopup.modality === "pointer" && itemMouse.containsMouse)
                    color: isHighlighted ? (modelData.destructive ? Qt.rgba(239/255, 68/255, 68/255, 0.15) : ThemeTokens.hover) : "transparent"

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
                        onPositionChanged: function(mouse) {
                            if (splitPopup.modality !== "pointer") {
                                var dx = Math.abs(mouse.x - splitPopup.lastPointerX)
                                var dy = Math.abs(mouse.y - splitPopup.lastPointerY)
                                if (splitPopup.lastPointerX >= 0 && (dx > 1 || dy > 1)) {
                                    splitPopup.modality = "pointer"
                                }
                            }
                            splitPopup.lastPointerX = mouse.x
                            splitPopup.lastPointerY = mouse.y
                        }
                        onClicked: {
                            splitPopup.triggerItem(parent.index)
                        }
                    }
                }
            }
        }
    }
}
