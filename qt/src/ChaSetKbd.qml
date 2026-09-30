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
    property real availableWidth: -1    // Explicit available width constraint if provided by parent/caller

    // Test hooks
    property bool forceHover: false
    property bool forceActive: false

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

    // Modifier symbols & standard names lookup map
    function formatKeyTokenWithMode(rawKey, compactMode) {
        if (!rawKey) return "";
        var k = String(rawKey).trim();
        var lower = k.toLowerCase();
        if (!compactMode) {
            if (lower === "ctrl" || lower === "control") return "Ctrl";
            if (lower === "shift") return "Shift";
            if (lower === "alt" || lower === "option" || lower === "opt") return "Alt";
            if (lower === "cmd" || lower === "command" || lower === "meta") return "Cmd";
            if (lower === "win") return "Win";
            if (lower === "enter" || lower === "return") return "Enter";
            if (lower === "backspace") return "Backspace";
            if (lower === "esc" || lower === "escape") return "Esc";
            if (lower === "tab") return "Tab";
            if (lower === "space") return "Space";
            if (lower === "up") return "Up";
            if (lower === "down") return "Down";
            if (lower === "left") return "Left";
            if (lower === "right") return "Right";
            if (lower === "pageup" || lower === "pgup") return "PageUp";
            if (lower === "pagedown" || lower === "pgdn") return "PageDown";
            if (lower === "delete") return "Delete";
            if (lower === "del") return "Del";
            return k;
        }

        switch (lower) {
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
        case "pageup":
        case "pgup": return "⇞";
        case "pagedown":
        case "pgdn": return "⇟";
        case "delete":
        case "del": return "⌦";
        default: return k;
        }
    }

    function formatKey(rawKey) {
        return formatKeyTokenWithMode(rawKey, root.isCompact);
    }

    // Parse token for keyboard key or mouse button indicator (e.g. "mouse-left", "mouse-right", "mouse-middle")
    function parseKeyTokenWithMode(rawKey, compactMode) {
        if (!rawKey) return { isMouse: false, button: "none", text: "", label: "" };
        var rawStr = String(rawKey).trim();
        var colonIdx = rawStr.indexOf(":");
        var keyPart = colonIdx >= 0 ? rawStr.substring(0, colonIdx).trim() : rawStr;
        var labelPart = colonIdx >= 0 ? rawStr.substring(colonIdx + 1).trim() : "";
        var l = keyPart.toLowerCase();

        if (l === "mouse-left" || l === "left-click" || l === "lmb" || l === "mouse_left") {
            return { isMouse: true, button: "left", text: "LMB", label: labelPart };
        }
        if (l === "mouse-right" || l === "right-click" || l === "rmb" || l === "mouse_right") {
            return { isMouse: true, button: "right", text: "RMB", label: labelPart };
        }
        if (l === "mouse-middle" || l === "middle-click" || l === "mmb" || l === "wheel" || l === "mouse_middle") {
            return { isMouse: true, button: "middle", text: "MMB", label: labelPart };
        }
        if (l === "mouse" || l === "click") {
            return { isMouse: true, button: "left", text: "Click", label: labelPart };
        }
        return { isMouse: false, button: "none", text: formatKeyTokenWithMode(rawStr, compactMode), label: "" };
    }

    function parseKeyToken(rawKey) {
        return parseKeyTokenWithMode(rawKey, root.isCompact);
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

    // Estimate layout width for responsive auto-compaction and overflow handling
    function estimateWidth(compactMode) {
        var branches = root.parsedBranches;
        if (!branches || branches.length === 0) return 0;

        var charW = root.fontSize * 0.65;
        var totalW = 0;
        var orDividerW = ThemeTokens.dp(16);
        var branchGap = ThemeTokens.dp(6);
        var interKeyGap = ThemeTokens.dp(4);
        var separatorW = ThemeTokens.dp(10); // '+' character plus spacing

        for (var b = 0; b < branches.length; ++b) {
            var branch = branches[b];
            var branchW = 0;

            for (var k = 0; k < branch.length; ++k) {
                var token = parseKeyTokenWithMode(branch[k], compactMode);

                if (k > 0 && !compactMode) {
                    branchW += separatorW;
                }

                var contentW = 0;
                if (token.isMouse) {
                    contentW = ThemeTokens.dp(11);
                    if (token.label && token.label.length > 0) {
                        contentW += ThemeTokens.dp(4) + Math.ceil(token.label.length * charW);
                    }
                } else {
                    contentW = Math.ceil(token.text.length * charW);
                }

                var keyBoxW = Math.max(root.keyHeight, contentW + root.keyPaddingH * 2);
                branchW += keyBoxW;

                if (k > 0) {
                    branchW += interKeyGap;
                }
            }

            if (b > 0) {
                totalW += orDividerW + branchGap;
            }
            totalW += branchW;
        }

        return Math.round(totalW);
    }

    readonly property int estimatedFullWidth: estimateWidth(false)
    readonly property int estimatedCompactWidth: estimateWidth(true)

    // Responsive compaction calculation:
    // If compact is "always" -> true
    // If compact is "never" -> false
    // If compact is "auto" -> full text ("Ctrl") when space permits, compact symbols ("⌃") when constrained
    readonly property bool isCompact: {
        if (root.compact === "always") return true;
        if (root.compact === "never") return false;

        // compact === "auto"
        if (root.availableWidth >= 0) {
            return root.availableWidth < root.estimatedFullWidth;
        }

        // Default when space is available: render full text (e.g. "Ctrl", "Shift", "Esc")
        return false;
    }

    // Overflow visibility handling
    readonly property bool isOverflowHidden: {
        if (root.overflow !== "hide") return false;
        var limit = root.availableWidth >= 0 ? root.availableWidth : (root.width > 0 ? root.width : -1);
        if (limit >= 0 && limit < root.estimatedCompactWidth) return true;
        return false;
    }

    implicitWidth: layoutRow.implicitWidth
    implicitHeight: layoutRow.implicitHeight
    width: implicitWidth
    height: implicitHeight
    visible: !isOverflowHidden

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
                Repeater {
                        model: branchRow.modelData
                        delegate: Row {
                            id: keyWrapper
                            required property var modelData
                            required property int index
                            readonly property var tokenInfo: root.parseKeyToken(keyWrapper.modelData)
                            spacing: ThemeTokens.dp(4)
                            anchors.verticalCenter: parent ? parent.verticalCenter : undefined

                            Text {
                                visible: keyWrapper.index > 0 && !root.isCompact
                                text: root.separator
                                color: ThemeTokens.subduedText
                                font.pixelSize: root.fontSize
                                font.family: Typography.familyMono
                                anchors.verticalCenter: parent ? parent.verticalCenter : undefined
                            }

                            Rectangle {
                                id: keyBox
                                height: root.keyHeight
                                width: Math.max(height, contentRow.implicitWidth + root.keyPaddingH * 2)
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

                                Row {
                                    id: contentRow
                                    anchors.centerIn: parent
                                    spacing: ThemeTokens.dp(4)

                                    // 鼠标按键微型图示（当 tokenInfo.isMouse 为 true 时激活，高亮对应按键）
                                    Item {
                                        id: mouseGlyph
                                        visible: tokenInfo.isMouse
                                        width: ThemeTokens.dp(11)
                                        height: Math.max(ThemeTokens.dp(14), Math.round(root.keyHeight * 0.62))
                                        anchors.verticalCenter: parent.verticalCenter

                                        readonly property color strokeCol: root.forceActive ? ThemeTokens.text : root.fgTextColor
                                        readonly property color highlightCol: root.forceActive ? ThemeTokens.accent : ThemeTokens.focus

                                        // 下半身掌托握柄
                                        Rectangle {
                                            anchors.left: parent.left
                                            anchors.right: parent.right
                                            anchors.bottom: parent.bottom
                                            anchors.top: parent.top
                                            anchors.topMargin: Math.round(parent.height * 0.44)
                                            bottomLeftRadius: width / 2
                                            bottomRightRadius: width / 2
                                            color: Qt.rgba(mouseGlyph.strokeCol.r, mouseGlyph.strokeCol.g, mouseGlyph.strokeCol.b, 0.12)
                                            border.color: mouseGlyph.strokeCol
                                            border.width: 1
                                        }

                                        // 左按键（高亮状态亮起指定的左按键）
                                        Rectangle {
                                            x: 0
                                            y: 0
                                            width: Math.floor((parent.width - 1) / 2)
                                            height: Math.round(parent.height * 0.44)
                                            topLeftRadius: ThemeTokens.dp(3)
                                            topRightRadius: 0
                                            bottomLeftRadius: 0
                                            bottomRightRadius: 0
                                            color: (tokenInfo.button === "left" || tokenInfo.button === "both") ? mouseGlyph.highlightCol : "transparent"
                                            border.color: mouseGlyph.strokeCol
                                            border.width: 1
                                        }

                                        // 右按键（高亮状态亮起指定的右按键）
                                        Rectangle {
                                            x: Math.ceil((parent.width + 1) / 2) - 1
                                            y: 0
                                            width: Math.floor((parent.width - 1) / 2)
                                            height: Math.round(parent.height * 0.44)
                                            topLeftRadius: 0
                                            topRightRadius: ThemeTokens.dp(3)
                                            bottomLeftRadius: 0
                                            bottomRightRadius: 0
                                            color: (tokenInfo.button === "right" || tokenInfo.button === "both") ? mouseGlyph.highlightCol : "transparent"
                                            border.color: mouseGlyph.strokeCol
                                            border.width: 1
                                        }

                                        // 滚轮小药丸
                                        Rectangle {
                                            anchors.horizontalCenter: parent.horizontalCenter
                                            y: Math.round(parent.height * 0.10)
                                            width: ThemeTokens.dp(2)
                                            height: Math.round(parent.height * 0.22)
                                            radius: 1
                                            color: tokenInfo.button === "middle" ? mouseGlyph.highlightCol : mouseGlyph.strokeCol
                                        }
                                    }

                                    // 按键文本（普通按键显示 keyName，鼠标按键若带 label 则显示 label）
                                    Text {
                                        id: keyLabel
                                        anchors.verticalCenter: parent.verticalCenter
                                        visible: !tokenInfo.isMouse || (tokenInfo.label && tokenInfo.label.length > 0)
                                        text: tokenInfo.isMouse ? tokenInfo.label : tokenInfo.text
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
}
