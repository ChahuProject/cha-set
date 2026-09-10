// ChaSetPresetNumberInput.qml — Cross-Stack Preset Number Input Component
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root

    property string value: ""
    property var presets: [64, 128, 256, 512, 1024, 2048, 4096, 8192]
    property string placeholder: ""
    property bool disabled: false
    property bool allowClear: true
    property string clearLabel: "None"
    property int customRadius: 6

    implicitWidth: 140
    implicitHeight: 32

    function formatPresetTag(num) {
        if (num >= 1024) {
            var k = num / 1024;
            return (num % 1024 === 0 ? k : k.toFixed(1)) + "K";
        }
        return num + "px";
    }

    onValueChanged: {
        if (textInput.text !== root.value) {
            textInput.text = root.value;
        }
    }

    ChaSetInput {
        id: textInput
        anchors.fill: parent
        text: root.value
        placeholder: root.placeholder
        disabled: root.disabled
        customRadius: root.customRadius
        size: "sm"
        type: "number"

        onTextEdited: {
            root.value = textInput.text;
        }

        Keys.onDownPressed: function(event) {
            if (presetPopup.visible) {
                event.accepted = true
                presetPopup.modality = "keyboard"
                var len = root.presets ? root.presets.length : 0
                if (len > 0) {
                    presetPopup.highlightedIndex = (presetPopup.highlightedIndex + 1) % len
                }
            } else {
                event.accepted = true
                var n = parseFloat(root.value) || 0
                root.value = String(Math.max(0, n - 1))
            }
        }

        Keys.onUpPressed: function(event) {
            if (presetPopup.visible) {
                event.accepted = true
                presetPopup.modality = "keyboard"
                var len = root.presets ? root.presets.length : 0
                if (len > 0) {
                    presetPopup.highlightedIndex = (presetPopup.highlightedIndex - 1 + len) % len
                }
            } else {
                event.accepted = true
                var n = parseFloat(root.value) || 0
                root.value = String(n + 1)
            }
        }

        Keys.onReturnPressed: function(event) {
            if (presetPopup.visible && presetPopup.highlightedIndex >= 0 && presetPopup.highlightedIndex < root.presets.length) {
                event.accepted = true
                root.value = String(root.presets[presetPopup.highlightedIndex])
                presetPopup.close()
            }
        }

        Keys.onEnterPressed: function(event) {
            if (presetPopup.visible && presetPopup.highlightedIndex >= 0 && presetPopup.highlightedIndex < root.presets.length) {
                event.accepted = true
                root.value = String(root.presets[presetPopup.highlightedIndex])
                presetPopup.close()
            }
        }

        Keys.onEscapePressed: function(event) {
            if (presetPopup.visible) {
                event.accepted = true
                presetPopup.close()
            }
        }

        Connections {
            target: textInput
            function onIsFocusedChanged() {
                if (textInput.isFocused && !root.disabled && !presetPopup.visible) {
                    presetPopup.open();
                }
            }
        }
    }

    // Toggle button on the right
    Rectangle {
        id: arrowBtn
        anchors.right: parent.right
        anchors.top: parent.top
        anchors.bottom: parent.bottom
        anchors.margins: 1
        width: 24
        color: "transparent"
        radius: root.customRadius - 1

        Text {
            anchors.centerIn: parent
            text: "▾"
            color: ThemeTokens.subduedText
            font.pixelSize: 11
        }

        MouseArea {
            anchors.fill: parent
            hoverEnabled: true
            cursorShape: Qt.PointingHandCursor
            onClicked: {
                if (root.disabled) return;
                if (presetPopup.visible) {
                    presetPopup.close();
                } else {
                    presetPopup.open();
                }
            }
        }
    }

    Popup {
        id: presetPopup
        y: root.height + 4
        width: Math.max(root.width, 140)
        padding: 4
        modal: false
        focus: false
        closePolicy: Popup.CloseOnEscape | Popup.CloseOnPressOutside

        property int highlightedIndex: -1
        property string modality: "keyboard"
        property real lastPointerX: -1
        property real lastPointerY: -1

        onAboutToShow: {
            highlightedIndex = -1
            modality = "keyboard"
            lastPointerX = -1
            lastPointerY = -1
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

            // Clear Option
            Rectangle {
                id: clearItem
                visible: root.allowClear
                width: parent.width
                height: 26
                radius: 4
                color: clearMouse.containsMouse ? ThemeTokens.hover : "transparent"

                Text {
                    anchors.left: parent.left
                    anchors.leftMargin: 8
                    anchors.verticalCenter: parent.verticalCenter
                    text: root.clearLabel
                    color: ThemeTokens.subduedText
                    font.pixelSize: 12
                }

                MouseArea {
                    id: clearMouse
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: Qt.PointingHandCursor
                    onClicked: {
                        root.value = "";
                        presetPopup.close();
                    }
                }
            }

            // Preset items
            Repeater {
                model: root.presets
                delegate: Rectangle {
                    required property var modelData
                    required property int index
                    width: parent.width
                    height: 26
                    radius: 4
                    readonly property bool isSelected: String(modelData) === String(root.value)
                    readonly property bool isHighlighted: (presetPopup.modality === "keyboard" && presetPopup.highlightedIndex === index) || (presetPopup.modality === "pointer" && itemMouse.containsMouse)
                    color: isHighlighted ? ThemeTokens.hover : (isSelected ? ThemeTokens.hover : "transparent")

                    Text {
                        anchors.left: parent.left
                        anchors.leftMargin: 8
                        anchors.verticalCenter: parent.verticalCenter
                        text: String(parent.modelData)
                        color: ThemeTokens.text
                        font.pixelSize: 12
                        font.weight: parent.isSelected ? Font.DemiBold : Font.Normal
                    }

                    Text {
                        anchors.right: parent.right
                        anchors.rightMargin: 8
                        anchors.verticalCenter: parent.verticalCenter
                        text: root.formatPresetTag(parent.modelData)
                        color: ThemeTokens.subduedText
                        font.pixelSize: 10
                    }

                    MouseArea {
                        id: itemMouse
                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        onPositionChanged: function(mouse) {
                            if (presetPopup.modality !== "pointer") {
                                var dx = Math.abs(mouse.x - presetPopup.lastPointerX)
                                var dy = Math.abs(mouse.y - presetPopup.lastPointerY)
                                if (presetPopup.lastPointerX >= 0 && (dx > 1 || dy > 1)) {
                                    presetPopup.modality = "pointer"
                                }
                            }
                            presetPopup.lastPointerX = mouse.x
                            presetPopup.lastPointerY = mouse.y
                        }
                        onClicked: {
                            root.value = String(parent.modelData);
                            presetPopup.close();
                        }
                    }
                }
            }
        }
    }
}
