// ChaSetSelect.qml — Cross-Stack Select Component
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root

    property string value: ""
    property string placeholder: "Select an option..."
    property var options: [] // [{ value: "apple", label: "Apple", disabled: false }]
    property bool disabled: false
    property int customRadius: 6

    implicitWidth: 160
    implicitHeight: 32

    readonly property var currentOption: {
        for (let i = 0; i < options.length; i++) {
            if (String(options[i].value) === String(root.value)) return options[i]
        }
        return null
    }

    Rectangle {
        id: triggerBox
        anchors.fill: parent
        radius: root.customRadius
        color: ThemeTokens.panel
        border.color: selectPopup.visible ? ThemeTokens.accent : (triggerMouse.containsMouse ? ThemeTokens.border : ThemeTokens.border)
        border.width: 1
        opacity: root.disabled ? 0.5 : 1.0

        Row {
            anchors.fill: parent
            anchors.leftMargin: 10
            anchors.rightMargin: 10
            spacing: 6

            Text {
                id: labelText
                anchors.verticalCenter: parent.verticalCenter
                width: parent.width - 20
                elide: Text.ElideRight
                text: root.currentOption ? root.currentOption.label : root.placeholder
                color: root.currentOption ? ThemeTokens.text : ThemeTokens.subduedText
                font.pixelSize: 13
            }

            Text {
                anchors.verticalCenter: parent.verticalCenter
                text: selectPopup.visible ? "▴" : "▾"
                color: ThemeTokens.subduedText
                font.pixelSize: 11
            }
        }

        MouseArea {
            id: triggerMouse
            anchors.fill: parent
            hoverEnabled: !root.disabled
            cursorShape: root.disabled ? Qt.ArrowCursor : Qt.PointingHandCursor
            onClicked: {
                if (root.disabled) return
                if (selectPopup.visible) selectPopup.close()
                else selectPopup.open()
            }
        }
    }

    Popup {
        id: selectPopup
        y: root.height + 4
        width: Math.max(root.width, 160)
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
                model: root.options
                delegate: Rectangle {
                    required property var modelData
                    width: parent.width
                    height: 28
                    radius: 4
                    readonly property bool isSelected: String(modelData.value) === String(root.value)
                    color: isSelected ? ThemeTokens.hover : (optMouse.containsMouse ? ThemeTokens.hover : "transparent")
                    opacity: modelData.disabled ? 0.4 : 1.0

                    Text {
                        anchors.left: parent.left
                        anchors.leftMargin: 8
                        anchors.right: checkText.visible ? checkText.left : parent.right
                        anchors.rightMargin: 8
                        anchors.verticalCenter: parent.verticalCenter
                        text: parent.modelData.label || ""
                        color: ThemeTokens.text
                        font.pixelSize: 12
                        font.weight: parent.isSelected ? Font.DemiBold : Font.Normal
                        elide: Text.ElideRight
                    }

                    Text {
                        id: checkText
                        anchors.right: parent.right
                        anchors.rightMargin: 8
                        anchors.verticalCenter: parent.verticalCenter
                        visible: parent.isSelected
                        text: "✓"
                        color: ThemeTokens.accent
                        font.pixelSize: 11
                    }

                    MouseArea {
                        id: optMouse
                        anchors.fill: parent
                        hoverEnabled: !parent.modelData.disabled
                        cursorShape: parent.modelData.disabled ? Qt.ArrowCursor : Qt.PointingHandCursor
                        onClicked: {
                            if (parent.modelData.disabled) return
                            root.value = String(parent.modelData.value)
                            root.valueChanged(root.value)
                            selectPopup.close()
                        }
                    }
                }
            }
        }
    }
}
