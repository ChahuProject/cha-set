// ChaSetKbd.qml — Cross-Stack Keyboard Shortcut & Keycap Primitive
// Single source of truth parity with spec/components/kbd.ts and React Kbd.tsx
import QtQuick 6.10
import ChaSet

Item {
    id: root

    property string variant: "outline"   // "outline" | "solid" | "subtle" | "inverted"
    property string size: "default"      // "xs" | "sm" | "default" | "md"
    property string compact: "auto"      // "auto" | "always" | "never"
    property string overflow: "collapse" // "collapse" | "hide" | "visible"
    property string shortcut: ""
    property string separator: "+"
    property string text: ""

    // Test hooks
    property bool forceHover: false
    property bool forceActive: false

    readonly property bool isCompact: compact === "always" || compact === "auto"
    readonly property bool isSubtle: variant === "subtle"
    readonly property bool isInverted: variant === "inverted"
    readonly property bool isSolid: variant === "solid"

    // Geometry scaling via ThemeTokens.dp
    readonly property int keyHeight: {
        switch (root.size) {
        case "xs": return ThemeTokens.dp(18);
        case "sm": return ThemeTokens.dp(20);
        case "md":
        case "default":
        default: return ThemeTokens.dp(24);
        }
    }

    readonly property int keyRadius: {
        switch (root.size) {
        case "xs": return ThemeTokens.dp(3);
        case "sm": return ThemeTokens.dp(4);
        case "md":
        case "default":
        default: return ThemeTokens.dp(4);
        }
    }

    readonly property int keyPaddingH: {
        switch (root.size) {
        case "xs": return ThemeTokens.dp(4);
        case "sm": return ThemeTokens.dp(6);
        case "md":
        case "default":
        default: return ThemeTokens.dp(8);
        }
    }

    readonly property int fontSize: {
        switch (root.size) {
        case "xs": return Typography.sizeMicro;
        case "sm": return Typography.sizeCaption;
        case "md":
        case "default":
        default: return Typography.sizeSmall;
        }
    }

    // Color tokens
    readonly property color bgFillColor: {
        if (root.forceActive) return ThemeTokens.accent;
        if (isSubtle) return "transparent";
        if (isInverted) return ThemeTokens.dark ? Qt.rgba(0, 0, 0, 0.15) : Qt.rgba(255, 255, 255, 0.2);
        if (isSolid) return ThemeTokens.dark ? Qt.rgba(1, 1, 1, 0.14) : Qt.rgba(0, 0, 0, 0.08);
        // outline default
        return ThemeTokens.dark ? Qt.rgba(1, 1, 1, 0.08) : Qt.rgba(0, 0, 0, 0.05);
    }

    readonly property color borderColor: {
        if (root.forceHover) return ThemeTokens.accent;
        if (isSubtle || isSolid) return "transparent";
        if (isInverted) return ThemeTokens.dark ? Qt.rgba(0, 0, 0, 0.2) : Qt.rgba(255, 255, 255, 0.25);
        return ThemeTokens.border;
    }

    readonly property color fgTextColor: {
        if (root.forceActive) return ThemeTokens.text;
        if (isSubtle) return ThemeTokens.subduedText;
        if (isInverted) return ThemeTokens.dark ? "#020817" : "#f8fafc";
        return ThemeTokens.text;
    }

    // Modifier symbols lookup map
    function formatKey(rawKey) {
        if (!rawKey) return "";
        var k = String(rawKey).trim();
        if (!root.isCompact) {
            var lower = k.toLowerCase();
            if (lower === "ctrl" || lower === "control") return "Ctrl";
            if (lower === "shift") return "Shift";
            if (lower === "alt" || lower === "option" || lower === "opt") return "Alt";
            if (lower === "cmd" || lower === "command" || lower === "meta" || lower === "win") return "Cmd";
            if (lower === "enter" || lower === "return") return "Enter";
            if (lower === "backspace") return "Backspace";
            if (lower === "esc" || lower === "escape") return "Esc";
            if (lower === "tab") return "Tab";
            if (lower === "space") return "Space";
            return k;
        }

        var l = k.toLowerCase();
        switch (l) {
        case "ctrl":
        case "control": return "⌃";
        case "shift": return "⇧";
        case "alt":
        case "opt":
        case "option": return "⌥";
        case "cmd":
        case "command":
        case "meta":
        case "win": return "⌘";
        case "enter":
        case "return": return "↵";
        case "backspace": return "⌫";
        case "escape":
        case "esc": return "⎋";
        case "tab": return "⇥";
        case "space": return "␣";
        case "up": return "↑";
        case "down": return "↓";
        case "left": return "←";
        case "right": return "→";
        case "pageup": return "⇞";
        case "pagedown": return "⇟";
        case "delete":
        case "del": return "⌦";
        default: return k;
        }
    }

    // Parsed shortcut structure: list of branches (split by " / "), each containing list of keys (split by "+")
    readonly property var parsedBranches: {
        var raw = root.shortcut.length > 0 ? root.shortcut : root.text;
        if (!raw || raw.length === 0) return [];
        var branches = raw.split(" / ");
        var res = [];
        for (var i = 0; i < branches.length; ++i) {
            var b = branches[i].trim();
            if (b.length === 0) continue;
            var keys = b.split("+");
            var keyList = [];
            for (var j = 0; j < keys.length; ++j) {
                var kt = keys[j].trim();
                if (kt.length > 0) {
                    keyList.push(kt);
                }
            }
            if (keyList.length > 0) {
                res.push(keyList);
            }
        }
        return res;
    }

    implicitWidth: layoutRow.implicitWidth
    implicitHeight: layoutRow.implicitHeight
    width: implicitWidth
    height: implicitHeight

    Row {
        id: layoutRow
        anchors.verticalCenter: parent ? parent.verticalCenter : undefined
        spacing: ThemeTokens.dp(6)

        Repeater {
            model: root.parsedBranches
            delegate: Row {
                id: branchRow
                required property var modelData
                required property int index
                spacing: ThemeTokens.dp(4)
                anchors.verticalCenter: parent ? parent.verticalCenter : undefined

                // "or" alternative divider
                Text {
                    visible: branchRow.index > 0
                    text: "or"
                    color: ThemeTokens.subduedText
                    font.family: Typography.familySans
                    font.pixelSize: Typography.sizeMicro
                    anchors.verticalCenter: parent ? parent.verticalCenter : undefined
                }

                // Subtle variant renders streamlined monospace text directly
                Text {
                    visible: root.isSubtle
                    anchors.verticalCenter: parent ? parent.verticalCenter : undefined
                    text: {
                        var parts = [];
                        for (var k = 0; k < branchRow.modelData.length; ++k) {
                            parts.push(root.formatKey(branchRow.modelData[k]));
                        }
                        return parts.join(root.isCompact ? "" : root.separator);
                    }
                    color: root.fgTextColor
                    font.pixelSize: root.fontSize
                    font.family: Typography.familyMono
                    font.weight: Typography.weightRegular
                }

                // Non-subtle variants render individual keycap badges
                Repeater {
                    visible: !root.isSubtle
                    model: branchRow.modelData
                    delegate: Row {
                        id: keyWrapper
                        required property var modelData
                        required property int index
                        spacing: ThemeTokens.dp(2)
                        anchors.verticalCenter: parent ? parent.verticalCenter : undefined

                        Text {
                            visible: keyWrapper.index > 0 && !root.isCompact
                            text: root.separator
                            color: ThemeTokens.subduedText
                            font.pixelSize: Typography.sizeMicro
                            font.family: Typography.familyMono
                            anchors.verticalCenter: parent ? parent.verticalCenter : undefined
                        }

                        Rectangle {
                            id: keyBox
                            height: root.keyHeight
                            width: Math.max(height, keyLabel.implicitWidth + root.keyPaddingH * 2)
                            radius: root.keyRadius
                            color: root.bgFillColor
                            border.color: root.borderColor
                            border.width: (root.variant === "outline" || root.variant === "inverted") ? 1 : 0
                            anchors.verticalCenter: parent ? parent.verticalCenter : undefined

                            Behavior on color {
                                enabled: ThemeTokens.animationsEnabled && !root.forceHover && !root.forceActive
                                ColorAnimation {
                                    duration: ThemeTokens.motionQuick
                                    easing.type: ThemeTokens.easeStandard
                                }
                            }

                            Text {
                                id: keyLabel
                                anchors.centerIn: parent
                                text: root.formatKey(keyWrapper.modelData)
                                color: root.fgTextColor
                                font.pixelSize: root.fontSize
                                font.family: Typography.familyMono
                                font.weight: Typography.weightMedium
                            }
                        }
                    }
                }
            }
        }
    }
}
