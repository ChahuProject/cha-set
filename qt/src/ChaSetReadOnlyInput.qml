// ChaSetReadOnlyInput.qml — Cross-Stack Read-Only Input Component
import QtQuick 6.10
import ChaSet

Item {
    id: root

    property string value: ""
    property string placeholder: ""
    property string colorScheme: "default"
    property int customRadius: 6
    property bool showCopy: true
    property bool masked: false
    property string maskChar: "•"
    property bool showMaskToggle: true
    property bool revealed: false
    property string size: "default" // "default" | "sm"
    property bool disabled: false

    signal copiedToClipboard(string text)

    readonly property bool isSm: root.size === "sm"

    implicitWidth: 260
    implicitHeight: root.isSm ? 26 : 32
    opacity: root.disabled ? 0.5 : 1.0

    readonly property color borderColor: {
        if (!root.disabled && (hoverArea.containsMouse || copyBtn.hovered)) return ThemeTokens.accent
        switch (root.colorScheme) {
        case "destructive": return ThemeTokens.danger
        case "warning":     return "#f59e0b"
        case "success":     return "#10b981"
        default:            return ThemeTokens.border
        }
    }

    Rectangle {
        anchors.fill: parent
        color: ThemeTokens.panel
        border.color: root.borderColor
        border.width: 1
        radius: root.customRadius

        Behavior on border.color {
            enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
            ColorAnimation { duration: ThemeTokens.motionShort; easing.type: ThemeTokens.easeStandard }
        }

        Item {
            anchors.fill: parent
            anchors.leftMargin: root.isSm ? 8 : 10
            anchors.rightMargin: 4

            TextInput {
                id: valInput
                anchors.left: parent.left
                anchors.right: actionsRow.left
                anchors.rightMargin: 4
                anchors.verticalCenter: parent.verticalCenter
                readOnly: true
                enabled: !root.disabled
                selectByMouse: true
                clip: true
                echoMode: (root.masked && !root.revealed) ? TextInput.Password : TextInput.Normal
                passwordCharacter: root.maskChar.length > 0 ? root.maskChar : "•"
                text: root.value
                color: {
                    if (root.value.length === 0) return ThemeTokens.subduedText
                    switch (root.colorScheme) {
                    case "destructive": return ThemeTokens.danger
                    case "warning":     return "#f59e0b"
                    case "success":     return "#10b981"
                    default:            return ThemeTokens.text
                    }
                }
                font.pixelSize: Typography.sizeSmall
                font.family: Typography.familyMono

                Text {
                    anchors.fill: parent
                    visible: root.value.length === 0 && root.placeholder.length > 0
                    text: root.placeholder
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeSmall
                    font.family: Typography.familyMono
                    verticalAlignment: Text.AlignVCenter
                    elide: Text.ElideRight
                }
            }

            Row {
                id: actionsRow
                anchors.right: parent.right
                anchors.verticalCenter: parent.verticalCenter
                spacing: 2

                // Reveal / Mask toggle button
                Rectangle {
                    id: maskToggleBtn
                    visible: root.masked && root.showMaskToggle
                    width: 22
                    height: 22
                    radius: 4
                    color: toggleMouse.containsMouse ? ThemeTokens.hover : "transparent"

                    ChaSetIcon {
                        anchors.centerIn: parent
                        name: root.revealed ? "eye" : "eye-off"
                        size: 14
                        color: ThemeTokens.subduedText
                    }

                    MouseArea {
                        id: toggleMouse
                        anchors.fill: parent
                        hoverEnabled: !root.disabled
                        enabled: !root.disabled
                        cursorShape: Qt.PointingHandCursor
                        onClicked: {
                            root.revealed = !root.revealed
                        }
                    }
                }

                ChaSetCopyButton {
                    id: copyBtn
                    visible: root.showCopy && (hoverArea.containsMouse || copyBtn.hovered || copyBtn.copied)
                    textToCopy: root.value
                    size: "icon-xs"
                    variant: "ghost"
                    enabled: !root.disabled
                    onCopiedToClipboard: (t) => root.copiedToClipboard(t)
                }
            }
        }

        HoverHandler {
            cursorShape: root.disabled ? Qt.ForbiddenCursor : Qt.IBeamCursor
        }

        MouseArea {
            id: hoverArea
            anchors.fill: parent
            z: -1
            hoverEnabled: false
            cursorShape: root.disabled ? Qt.ForbiddenCursor : Qt.IBeamCursor
            onClicked: {
                if (!root.disabled) {
                    valInput.forceActiveFocus()
                }
            }
        }

        MouseArea {
            id: disabledArea
            anchors.fill: parent
            z: 99
            visible: root.disabled
            hoverEnabled: true
            cursorShape: Qt.ForbiddenCursor
            acceptedButtons: Qt.AllButtons
            onPressed: (mouse) => mouse.accepted = true
        }
    }
}
