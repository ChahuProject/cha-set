// ChaSetKeybindingRecorder.qml — Cross-Stack Keybinding Recorder Component
import QtQuick
import ChaSet

FocusScope {
    id: root

    property string keybinding: "Ctrl+K"
    property string value: keybinding
    // Stack-specific: QML has no private component state, so recording stays a
    // writable property (toggled internally by the whole-box click area and Esc;
    // React keeps this in useState). Same for customRadius below, which follows
    // the repo-wide ChaSet Qt radius-override convention (cf. ChaSetButton).
    property bool recording: false
    property int customRadius: 6
    readonly property int effectiveRadius: ThemeTokens.dp(customRadius)
    property bool clearable: true
    property string size: "default" // "default" | "sm"
    property bool disabled: false
    // React parity (KeybindingRecorder.tsx defaults + spec/components/keybinding-recorder.ts).
    property string placeholder: (typeof ChaSetI18n !== "undefined" && ChaSetI18n.tr) ? ChaSetI18n.tr("components.keybindingRecorder.noBinding", "No keybinding set") : "No keybinding set"
    property string recordingText: (typeof ChaSetI18n !== "undefined" && ChaSetI18n.tr) ? ChaSetI18n.tr("components.keybindingRecorder.recordingPrompt", "Press key combination (Esc to cancel)...") : "Press key combination (Esc to cancel)..."

    signal keybindingRecorded(string newBinding)

    readonly property bool isSm: root.size === "sm"

    implicitWidth: ThemeTokens.dp(200)
    implicitHeight: ThemeTokens.dp(root.isSm ? 26 : 32)
    opacity: root.disabled ? 0.5 : 1.0

    onValueChanged: {
        if (root.keybinding !== root.value) {
            root.keybinding = root.value
        }
    }

    onKeybindingChanged: {
        if (root.value !== root.keybinding) {
            root.value = root.keybinding
        }
    }

    // While capturing, Escape cancels the recording — so the overlay registry must stand
    // down, otherwise a window-level Escape consumer would dismiss a host layer instead.
    onRecordingChanged: {
        ChaSetOverlayHub.escapeSuspended = root.recording
        if (root.recording) {
            recorderRect.forceActiveFocus()
        }
    }

    Component.onDestruction: {
        if (root.recording) ChaSetOverlayHub.escapeSuspended = false
    }

    Rectangle {
        id: recorderRect
        anchors.fill: parent
        color: root.recording ? ThemeTokens.hover : ThemeTokens.panel
        border.color: root.recording ? ThemeTokens.accent : ThemeTokens.border
        border.width: root.recording ? 2 : 1
        radius: root.effectiveRadius
        focus: true

        onActiveFocusChanged: {
            if (!activeFocus && root.recording) {
                root.recording = false
            }
        }

        Behavior on color {
            enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
            ColorAnimation { duration: ThemeTokens.motionQuick; easing.type: ThemeTokens.easeStandard }
        }
        Behavior on border.color {
            enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
            ColorAnimation { duration: ThemeTokens.motionQuick; easing.type: ThemeTokens.easeStandard }
        }

        ChaSetIcon {
            id: leadIcon
            anchors.left: parent.left
            anchors.leftMargin: ThemeTokens.dp(root.isSm ? 8 : 10)
            anchors.verticalCenter: parent.verticalCenter
            name: "keyboard"
            size: root.isSm ? 14 : 16
            color: root.recording ? ThemeTokens.accent : ThemeTokens.subduedText

            SequentialAnimation on opacity {
                running: ThemeTokens.animationsEnabled && root.recording
                loops: Animation.Infinite
                NumberAnimation { from: 1.0; to: 0.4; duration: 600 }
                NumberAnimation { from: 0.4; to: 1.0; duration: 600 }
            }
        }

        ChaSetKbd {
            id: kbdDisplay
            anchors.left: leadIcon.right
            anchors.leftMargin: ThemeTokens.dp(6)
            anchors.verticalCenter: parent.verticalCenter
            visible: !root.recording && root.keybinding.length > 0
            shortcut: root.keybinding
            size: root.isSm ? "sm" : "default"
            compact: "auto"
            variant: "outline"
            availableWidth: parent.width - leadIcon.width - ThemeTokens.dp(root.isSm ? 16 : 20) - (clearBtn.visible ? (btnRow.width + ThemeTokens.dp(6)) : ThemeTokens.dp(6))
        }

        Text {
            id: display
            anchors.left: leadIcon.right
            anchors.leftMargin: ThemeTokens.dp(8)
            anchors.right: parent.right
            anchors.rightMargin: clearBtn.visible ? btnRow.width + ThemeTokens.dp(6) : ThemeTokens.dp(6)
            anchors.verticalCenter: parent.verticalCenter
            visible: root.recording || root.keybinding.length === 0
            text: root.recording ? root.recordingText : root.placeholder
            color: root.recording ? ThemeTokens.accent : ThemeTokens.subduedText
            font.pixelSize: root.isSm ? Typography.sizeCaption : Typography.sizeSmall
            font.family: root.recording ? Typography.familySans : Typography.familyMono
            font.weight: root.recording ? Font.DemiBold : Font.Normal
            elide: Text.ElideRight
        }

        Row {
            id: btnRow
            anchors.right: parent.right
            anchors.rightMargin: ThemeTokens.dp(root.isSm ? 4 : 6)
            anchors.verticalCenter: parent.verticalCenter
            spacing: 2

            ChaSetButton {
                id: clearBtn
                visible: root.clearable && !root.recording && root.keybinding.length > 0 && !root.disabled
                icon: "x"
                variant: "ghost"
                size: "icon-xs"
                height: ThemeTokens.dp(root.isSm ? 20 : 24)
                width: ThemeTokens.dp(root.isSm ? 20 : 24)
                onClicked: {
                    root.keybinding = ""
                    root.value = ""
                    root.keybindingRecorded("")
                }
            }
        }

        MouseArea {
            id: recorderClickArea
            anchors.fill: parent
            // Below the ghost clear-X so its clicks pass through (React
            // stopPropagation parity); Text/icon siblings ignore mouse input.
            z: -1
            hoverEnabled: true
            cursorShape: root.disabled ? Qt.ForbiddenCursor : Qt.PointingHandCursor
            onClicked: {
                // Whole-box click toggles recording; Escape cancels.
                if (!root.disabled) {
                    root.recording = !root.recording
                    if (root.recording) {
                        recorderRect.forceActiveFocus()
                    }
                }
            }
        }

        function keyToString(key, text) {
            if (key >= Qt.Key_A && key <= Qt.Key_Z)
                return String.fromCharCode(key)
            if (key >= Qt.Key_0 && key <= Qt.Key_9)
                return String.fromCharCode(key)
            if (key >= Qt.Key_F1 && key <= Qt.Key_F35)
                return "F" + (key - Qt.Key_F1 + 1)
            switch (key) {
            case Qt.Key_Space: return "Space"
            case Qt.Key_Return:
            case Qt.Key_Enter: return "Return"
            case Qt.Key_Tab:
            case Qt.Key_Backtab: return "Tab"
            case Qt.Key_Backspace: return "Backspace"
            case Qt.Key_Delete: return "Del"
            case Qt.Key_Insert: return "Ins"
            case Qt.Key_Home: return "Home"
            case Qt.Key_End: return "End"
            case Qt.Key_PageUp: return "PgUp"
            case Qt.Key_PageDown: return "PgDown"
            case Qt.Key_Left: return "Left"
            case Qt.Key_Right: return "Right"
            case Qt.Key_Up: return "Up"
            case Qt.Key_Down: return "Down"
            case Qt.Key_Equal: return "="
            case Qt.Key_Minus: return "-"
            case Qt.Key_Plus: return "+"
            case Qt.Key_Slash: return "/"
            case Qt.Key_Asterisk: return "*"
            case Qt.Key_Semicolon: return ";"
            case Qt.Key_Apostrophe: return "'"
            case Qt.Key_Comma: return ","
            case Qt.Key_Period: return "."
            case Qt.Key_BracketLeft: return "["
            case Qt.Key_BracketRight: return "]"
            case Qt.Key_Backslash: return "\\"
            case Qt.Key_QuoteLeft: return "`"
            default:
                if (text && text.trim().length > 0 && text.charCodeAt(0) >= 32)
                    return text.trim().toUpperCase()
                return ""
            }
        }

        Keys.priority: Keys.BeforeItem
        Keys.onShortcutOverride: function(event) {
            if (root.recording && !root.disabled) {
                event.accepted = true
            }
        }

        Keys.onPressed: function(event) {
            if (!root.recording || root.disabled) return
            event.accepted = true

            if (event.key === Qt.Key_Escape) {
                root.recording = false
                return
            }

            if (event.key === Qt.Key_Control || event.key === Qt.Key_Shift ||
                event.key === Qt.Key_Alt || event.key === Qt.Key_Meta || event.key === Qt.Key_AltGr) {
                return
            }

            const mainKey = keyToString(event.key, event.text)
            if (!mainKey || mainKey.length === 0)
                return

            let parts = []
            if (event.modifiers & Qt.ControlModifier) parts.push("Ctrl")
            if (event.modifiers & Qt.AltModifier) parts.push("Alt")
            if (event.modifiers & Qt.ShiftModifier) parts.push("Shift")
            if (event.modifiers & Qt.MetaModifier) parts.push("Meta")

            parts.push(mainKey)
            root.keybinding = parts.join("+")
            root.value = root.keybinding
            root.recording = false
            root.keybindingRecorded(root.keybinding)
        }
    }

    MouseArea {
        id: disabledOverlay
        anchors.fill: parent
        z: 99
        visible: root.disabled
        hoverEnabled: true
        cursorShape: Qt.ForbiddenCursor
        acceptedButtons: Qt.AllButtons
        onPressed: (mouse) => mouse.accepted = true
    }
}
