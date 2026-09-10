// ChaSetInlineEditableText.qml — Cross-Stack Inline Editable Text Component
import QtQuick 6.10
import ChaSet

Item {
    id: root

    property string text: "Click to edit"
    property string value: text
    property string placeholder: "Enter text..."
    property bool editing: false
    property string tempText: ""
    property bool disabled: false
    property string size: "default" // "default" | "sm"
    property string trigger: "click" // "click" | "doubleClick"

    signal textCommitted(string newText)
    signal save(string newValue)
    signal editCancelled()

    readonly property bool isSm: root.size === "sm"

    implicitWidth: Math.max(120, editing ? inputField.implicitWidth + 56 : displayLabel.implicitWidth + 28)
    implicitHeight: root.isSm ? 26 : 32
    opacity: root.disabled ? 0.5 : 1.0

    onValueChanged: {
        if (root.text !== root.value) {
            root.text = root.value
        }
    }

    onTextChanged: {
        if (root.value !== root.text) {
            root.value = root.text
        }
    }

    onEditingChanged: {
        if (root.editing) {
            root.tempText = root.text
            inputField.forceActiveFocus()
        }
    }

    function commit() {
        root.text = root.tempText
        root.value = root.tempText
        root.editing = false
        root.textCommitted(root.tempText)
        root.save(root.tempText)
    }

    function cancel() {
        root.editing = false
        root.editCancelled()
    }

    // Display Mode
    Rectangle {
        id: displayBox
        visible: !root.editing
        anchors.fill: parent
        color: (!root.disabled && (hoverMouse.containsMouse || displayBox.activeFocus)) ? ThemeTokens.hover : "transparent"
        radius: 4
        border.color: (!root.disabled && displayBox.activeFocus) ? ThemeTokens.focus : ((!root.disabled && hoverMouse.containsMouse) ? ThemeTokens.border : "transparent")
        border.width: displayBox.activeFocus ? 2 : 1
        activeFocusOnTab: !root.disabled && !root.editing

        Keys.onReturnPressed: function(event) {
            if (!root.disabled) {
                event.accepted = true
                root.editing = true
            }
        }

        Keys.onEnterPressed: function(event) {
            if (!root.disabled) {
                event.accepted = true
                root.editing = true
            }
        }

        Keys.onSpacePressed: function(event) {
            if (!root.disabled) {
                event.accepted = true
                root.editing = true
            }
        }

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
                font.pixelSize: root.isSm ? 12 : 13
                font.weight: Font.Medium
            }

            Text {
                anchors.verticalCenter: parent.verticalCenter
                text: "✏️"
                font.pixelSize: root.isSm ? 9 : 10
                opacity: (!root.disabled && (hoverMouse.containsMouse || displayBox.activeFocus)) ? 0.8 : 0.0
            }
        }

        MouseArea {
            id: hoverMouse
            anchors.fill: parent
            hoverEnabled: !root.disabled
            enabled: !root.disabled
            cursorShape: root.disabled ? Qt.ArrowCursor : Qt.PointingHandCursor
            onDoubleClicked: {
                if (!root.disabled) root.editing = true
            }
            onClicked: {
                if (!root.disabled) {
                    if (root.trigger === "click") {
                        root.editing = true
                    } else {
                        displayBox.forceActiveFocus()
                    }
                }
            }
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
            size: root.isSm ? "sm" : "default"
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
            width: root.isSm ? 22 : 24
            onClicked: root.commit()
        }

        ChaSetButton {
            text: "✕"
            variant: "ghost"
            size: "icon-xs"
            height: parent.height
            width: root.isSm ? 22 : 24
            onClicked: root.cancel()
        }
    }
}
