// ChaSetInlineEditableText.qml — Cross-Stack Inline Editable Text Component
import QtQuick 6.10
import ChaSet

Item {
    id: root

    property string text: "Double click to edit"
    property string placeholder: "Enter text..."
    property bool editing: false
    property string tempText: ""

    signal textCommitted(string newText)
    signal editCancelled()

    implicitWidth: Math.max(120, editing ? inputField.implicitWidth + 24 : displayLabel.implicitWidth + 28)
    implicitHeight: 32

    onEditingChanged: {
        if (root.editing) {
            root.tempText = root.text
            inputField.forceActiveFocus()
        }
    }

    function commit() {
        root.text = root.tempText
        root.editing = false
        root.textCommitted(root.text)
    }

    function cancel() {
        root.editing = false
        root.editCancelled()
    }

    // Display Mode
    Rectangle {
        visible: !root.editing
        anchors.fill: parent
        color: hoverMouse.containsMouse ? ThemeTokens.hover : "transparent"
        radius: 4
        border.color: hoverMouse.containsMouse ? ThemeTokens.border : "transparent"
        border.width: 1

        Row {
            anchors.fill: parent
            anchors.leftMargin: 6
            anchors.rightMargin: 6
            spacing: 6

            Text {
                id: displayLabel
                anchors.verticalCenter: parent.verticalCenter
                text: root.text.length > 0 ? root.text : root.placeholder
                color: root.text.length > 0 ? ThemeTokens.text : ThemeTokens.subduedText
                font.pixelSize: 13
            }

            Text {
                anchors.verticalCenter: parent.verticalCenter
                text: "✏️"
                font.pixelSize: 10
                opacity: hoverMouse.containsMouse ? 0.8 : 0.0
            }
        }

        MouseArea {
            id: hoverMouse
            anchors.fill: parent
            hoverEnabled: true
            cursorShape: Qt.PointingHandCursor
            onDoubleClicked: root.editing = true
        }
    }

    // Edit Mode
    Row {
        visible: root.editing
        anchors.fill: parent
        spacing: 4

        ChaSetInput {
            id: inputField
            width: parent.width - 56
            height: parent.height
            text: root.tempText
            onTextEdited: root.tempText = text
            Keys.onReturnPressed: root.commit()
            Keys.onEnterPressed: root.commit()
            Keys.onEscapePressed: root.cancel()
        }

        ChaSetButton {
            text: "✓"
            variant: "default"
            size: "icon-xs"
            height: parent.height
            width: 24
            onClicked: root.commit()
        }

        ChaSetButton {
            text: "✕"
            variant: "ghost"
            size: "icon-xs"
            height: parent.height
            width: 24
            onClicked: root.cancel()
        }
    }
}
