// ChaSetTooltipBubble.qml — Pure presentational tooltip bubble shared by the
// local ChaSetTooltip branch and host global-tooltip windows.
//
// NO hover / overlay / service / timer logic, NO customContent loader: the
// parent decides when and where this bubble shows and feeds the six content
// props (text / description / shortcut / iconName / side / arrow).
//
// 内容与可见性契约：叶子 visible 绑定（appIcon / bubbleText / shortcutBadge /
// descText / contentRow）仅作初始态兜底。在独立引擎里跨节点 visible 绑定可能
// 卡死（text 已写入但 visible 永假 → 空白泡），宿主 C++（TooltipWindow::
// applyContent / reconcile）作为唯一写入方显式驱动这些标志；禁止新增与 C++
// 驱动相竞争的可见性绑定。
//
// Tokens (exact, do NOT change — host measuredSize agreement depends on them):
// bubble padding dp(16)/dp(8), floor dp(24), radius dp(4), kbd size xs,
// icon 14, desc max width dp(280), arrow 8x4.
import QtQuick
import QtQuick.Shapes
import ChaSet

Item {
    id: root
    objectName: "tooltipRoot"

    property string text: ""
    property string description: ""
    property string shortcut: ""
    property string iconName: ""
    property string side: "top" // "top" | "bottom" | "left" | "right"
    property alias placement: root.side
    property bool arrow: false

    readonly property real uiScaleFactor: {
        if (typeof ThemeTokens !== "undefined" && ThemeTokens && ThemeTokens.uiScale > 0)
            return Number(ThemeTokens.uiScale);
        if (typeof UiScale !== "undefined" && UiScale && UiScale.scale > 0)
            return Number(UiScale.scale);
        if (typeof uiScale !== "undefined" && uiScale && uiScale.scale > 0)
            return Number(uiScale.scale);
        return 1.0;
    }

    readonly property int arrowW: (typeof ThemeTokens !== "undefined" && ThemeTokens)
            ? ThemeTokens.dp(8) : Math.round(8 * uiScaleFactor)
    readonly property int arrowH: (typeof ThemeTokens !== "undefined" && ThemeTokens)
            ? ThemeTokens.dp(4) : Math.round(4 * uiScaleFactor)
    readonly property int effectiveArrowH: root.arrow ? arrowH : 0

    readonly property real scaledPadX: (typeof ThemeTokens !== "undefined" && ThemeTokens)
            ? ThemeTokens.dp(16) : Math.round(16 * uiScaleFactor)
    readonly property real scaledPadY: (typeof ThemeTokens !== "undefined" && ThemeTokens)
            ? ThemeTokens.dp(8) : Math.round(8 * uiScaleFactor)

    readonly property real maxTextW: (typeof ThemeTokens !== "undefined" && ThemeTokens)
            ? ThemeTokens.dp(360) : Math.round(360 * uiScaleFactor)

    // Natural single-line text & description measurement off-layout (synchronous, binding-loop free)
    TextMetrics {
        id: textMetrics
        text: root.text
        font.family: (typeof Typography !== "undefined" && Typography && Typography.familySans)
                ? Typography.familySans : "Microsoft YaHei UI"
        font.pixelSize: (typeof Typography !== "undefined" && Typography)
                ? Typography.sizeSmall : Math.round(12 * root.uiScaleFactor)
        font.weight: (root.description !== "") ? Font.DemiBold : Font.Medium
    }

    TextMetrics {
        id: descMetrics
        text: root.description
        font.family: (typeof Typography !== "undefined" && Typography && Typography.familySans)
                ? Typography.familySans : "Microsoft YaHei UI"
        font.pixelSize: (typeof Typography !== "undefined" && Typography)
                ? Typography.sizeCaption : Math.round(11 * root.uiScaleFactor)
    }

    // 单行/多行紧凑内容宽度与高度（首帧同步计算 + TextMetrics 兜底，彻底杜绝 0 宽坍塌与 24dp 空白方块）
    readonly property real naturalTextW: {
        if (root.text === "") return 0
        if (root.text.indexOf("\n") !== -1 || textMetrics.width > root.maxTextW) {
            return Math.min(textMetrics.width, root.maxTextW)
        }
        return textMetrics.width
    }

    readonly property real naturalRowW: {
        var w = 0
        var items = 0
        if (root.iconName !== "") {
            w += Math.round(14 * root.uiScaleFactor)
            items++
        }
        if (root.text !== "") {
            w += naturalTextW
            items++
        }
        if (root.shortcut !== "") {
            var kbdW = (shortcutBadge.implicitWidth > 0) ? shortcutBadge.implicitWidth : shortcutBadge.width
            w += (kbdW > 0 ? kbdW : Math.round(30 * root.uiScaleFactor))
            items++
        }
        if (items > 1) {
            var sp = (typeof ThemeTokens !== "undefined" && ThemeTokens)
                    ? ThemeTokens.dp(8) : Math.round(8 * root.uiScaleFactor)
            w += (items - 1) * sp
        }
        return Math.max(w, contentRow.implicitWidth, contentRow.width)
    }

    readonly property real naturalDescW: {
        if (root.description === "") return 0
        var maxD = (typeof ThemeTokens !== "undefined" && ThemeTokens)
                ? ThemeTokens.dp(280) : Math.round(280 * root.uiScaleFactor)
        return Math.min(descMetrics.width, maxD)
    }

    readonly property real contentW: Math.max(naturalRowW, naturalDescW, descText.width, descText.implicitWidth)

    readonly property real naturalRowH: {
        var h = 0
        if (root.text !== "") {
            var th = (bubbleText.lineCount > 1)
                    ? (bubbleText.height > 0 ? bubbleText.height : (bubbleText.lineCount * textMetrics.height))
                    : textMetrics.height
            h = Math.max(h, th)
        }
        if (root.shortcut !== "") {
            var kbdH = (typeof ThemeTokens !== "undefined" && ThemeTokens)
                    ? ThemeTokens.dp(18) : Math.round(18 * root.uiScaleFactor)
            h = Math.max(h, kbdH)
        }
        if (root.iconName !== "") {
            var iconH = (typeof ThemeTokens !== "undefined" && ThemeTokens)
                    ? ThemeTokens.dp(14) : Math.round(14 * root.uiScaleFactor)
            h = Math.max(h, iconH)
        }
        return Math.max(h, contentRow.implicitHeight, contentRow.height)
    }

    readonly property real naturalDescH: {
        if (root.description === "") return 0
        return Math.max(descMetrics.height, descText.height, descText.implicitHeight)
    }

    readonly property real contentH: {
        var h = 0
        var hasRow = (root.text !== "" || root.shortcut !== "" || root.iconName !== "")
        var hasDesc = (root.description !== "")
        if (hasRow) h += naturalRowH
        if (hasRow && hasDesc) {
            h += (typeof ThemeTokens !== "undefined" && ThemeTokens)
                    ? ThemeTokens.dp(2) : Math.round(2 * root.uiScaleFactor)
        }
        if (hasDesc) h += naturalDescH
        return Math.max(h, contentRow.height + (descText.visible ? descText.height : 0))
    }

    readonly property real baseBubbleW: Math.max((typeof ThemeTokens !== "undefined" && ThemeTokens)
            ? ThemeTokens.dp(24) : Math.round(24 * uiScaleFactor), contentW + scaledPadX)
    readonly property real baseBubbleH: Math.max((typeof ThemeTokens !== "undefined" && ThemeTokens)
            ? ThemeTokens.dp(24) : Math.round(24 * uiScaleFactor), contentH + scaledPadY)

    implicitWidth: {
        if (root.arrow && (root.side === "left" || root.side === "right")) {
            return baseBubbleW + effectiveArrowH
        }
        return baseBubbleW
    }

    implicitHeight: {
        if (root.arrow && (root.side === "top" || root.side === "bottom")) {
            return baseBubbleH + effectiveArrowH
        }
        return baseBubbleH
    }

    // Ambient soft drop shadow matching React shadow-md
    Rectangle {
        id: shadow
        anchors.fill: bubble
        anchors.topMargin: (typeof ThemeTokens !== "undefined" && ThemeTokens) ? ThemeTokens.dp(2) : 2
        anchors.bottomMargin: (typeof ThemeTokens !== "undefined" && ThemeTokens) ? -ThemeTokens.dp(2) : -2
        radius: bubble.radius
        color: Qt.rgba(0, 0, 0, (typeof ThemeTokens !== "undefined" && ThemeTokens && ThemeTokens.dark) ? 0.45 : 0.12)
        z: -1
    }

    ChaSetSquircle {
        id: bubble
        objectName: "bubble"
        x: {
            if (root.arrow && root.side === "right") return root.effectiveArrowH
            return 0
        }
        y: {
            if (root.arrow && root.side === "bottom") return root.effectiveArrowH
            return 0
        }
        width: {
            if (root.width > 0) {
                var availW = root.width
                if (root.arrow && (root.side === "left" || root.side === "right")) {
                    availW -= root.effectiveArrowH
                }
                return Math.max(availW, root.baseBubbleW)
            }
            return root.baseBubbleW
        }
        height: {
            if (root.height > 0) {
                var availH = root.height
                if (root.arrow && (root.side === "top" || root.side === "bottom")) {
                    availH -= root.effectiveArrowH
                }
                return Math.max(availH, root.baseBubbleH)
            }
            return root.baseBubbleH
        }

        radius: (typeof ThemeTokens !== "undefined" && ThemeTokens)
                ? ThemeTokens.dp(6) : Math.max(1, Math.round(6 * root.uiScaleFactor))
        color: (typeof ThemeTokens !== "undefined" && ThemeTokens)
                ? (ThemeTokens.dark ? ThemeTokens.color("panelRaised") : "#ffffff")
                : "#ffffff"
        border.color: (typeof ThemeTokens !== "undefined" && ThemeTokens)
                ? ThemeTokens.color("border") : "#7188a5"
        border.width: 1

        Column {
            id: mainContent
            objectName: "mainContent"
            anchors.verticalCenter: parent.verticalCenter
            anchors.left: (root.description !== "" || bubbleText.lineCount > 1) ? parent.left : undefined
            anchors.leftMargin: (root.description !== "" || bubbleText.lineCount > 1) ? (scaledPadX / 2) : 0
            anchors.horizontalCenter: (root.description === "" && bubbleText.lineCount <= 1) ? parent.horizontalCenter : undefined
            spacing: (typeof ThemeTokens !== "undefined" && ThemeTokens)
                    ? ThemeTokens.dp(2) : Math.round(2 * root.uiScaleFactor)

            Row {
                id: contentRow
                objectName: "contentRow"
                visible: appIcon.visible || bubbleText.visible || shortcutBadge.visible
                spacing: (typeof ThemeTokens !== "undefined" && ThemeTokens)
                        ? ThemeTokens.dp(8) : Math.round(8 * root.uiScaleFactor)

                ChaSetIcon {
                    id: appIcon
                    objectName: "appIcon"
                    visible: root.iconName !== ""
                    name: root.iconName
                    size: 14
                    color: (typeof ThemeTokens !== "undefined" && ThemeTokens)
                            ? ThemeTokens.color("text") : "#e6f2ff"
                    anchors.verticalCenter: (bubbleText.lineCount <= 1) ? parent.verticalCenter : undefined
                    anchors.top: (bubbleText.lineCount > 1) ? parent.top : undefined
                    anchors.topMargin: (bubbleText.lineCount > 1) ? ((typeof ThemeTokens !== "undefined" && ThemeTokens) ? ThemeTokens.dp(2) : 2) : 0
                }

                Text {
                    id: bubbleText
                    objectName: "bubbleText"
                    visible: root.text !== ""
                    text: root.text
                    color: (typeof ThemeTokens !== "undefined" && ThemeTokens)
                            ? ThemeTokens.color("text") : "#e6f2ff"
                    font.family: (typeof Typography !== "undefined" && Typography && Typography.familySans)
                            ? Typography.familySans : "Microsoft YaHei UI"
                    font.pixelSize: (typeof Typography !== "undefined" && Typography)
                            ? Typography.sizeSmall : Math.round(12 * root.uiScaleFactor)
                    font.weight: (root.description !== "") ? Font.DemiBold : Font.Medium
                    horizontalAlignment: (root.description !== "" || lineCount > 1) ? Text.AlignLeft : Text.AlignHCenter
                    verticalAlignment: (lineCount <= 1) ? Text.AlignVCenter : Text.AlignTop
                    anchors.verticalCenter: (lineCount <= 1) ? parent.verticalCenter : undefined
                    wrapMode: (textMetrics.width > root.maxTextW || root.text.indexOf("\n") !== -1) ? Text.Wrap : Text.NoWrap
                    width: (wrapMode === Text.Wrap) ? Math.min(textMetrics.width, root.maxTextW) : undefined
                }

                ChaSetKbd {
                    id: shortcutBadge
                    objectName: "shortcutBadge"
                    visible: root.shortcut !== ""
                    anchors.verticalCenter: (bubbleText.lineCount <= 1) ? (parent ? parent.verticalCenter : undefined) : undefined
                    anchors.top: (bubbleText.lineCount > 1) ? (parent ? parent.top : undefined) : undefined
                    anchors.topMargin: (bubbleText.lineCount > 1) ? ((typeof ThemeTokens !== "undefined" && ThemeTokens) ? ThemeTokens.dp(2) : 2) : 0
                    variant: "outline"
                    size: "xs"
                    compact: "never"
                    shortcut: root.shortcut
                }
            }

            Text {
                id: descText
                objectName: "descText"
                visible: root.description !== ""
                text: root.description
                color: (typeof ThemeTokens !== "undefined" && ThemeTokens)
                        ? ThemeTokens.color("subduedText") : "#b0c5e4"
                font.family: (typeof Typography !== "undefined" && Typography && Typography.familySans)
                        ? Typography.familySans : "Microsoft YaHei UI"
                font.pixelSize: (typeof Typography !== "undefined" && Typography)
                        ? Typography.sizeCaption : Math.round(11 * root.uiScaleFactor)
                wrapMode: Text.Wrap
                readonly property real maxDescW: (typeof ThemeTokens !== "undefined" && ThemeTokens)
                        ? ThemeTokens.dp(280) : Math.round(280 * root.uiScaleFactor)
                width: visible ? Math.min(descMetrics.width, maxDescW) : 0
                horizontalAlignment: Text.AlignLeft
            }
        }
    }

    // Seamless triangle pointer — fill covers the bubble border segment,
    // angled strokes redraw only the two outer edges (open base).
    Shape {
        id: arrowIndicator
        visible: root.arrow
        z: 1
        width: (root.side === "left" || root.side === "right") ? (root.arrowH + 1) : root.arrowW
        height: (root.side === "left" || root.side === "right") ? root.arrowW : (root.arrowH + 1)
        x: {
            switch (root.side) {
            case "left": return bubble.x + bubble.width - 1
            case "right": return 0
            default: return bubble.x + (bubble.width - width) / 2
            }
        }
        y: {
            switch (root.side) {
            case "top": return bubble.y + bubble.height - 1
            case "bottom": return 0
            default: return bubble.y + (bubble.height - height) / 2
            }
        }

        // Fill triangle covering container border line
        ShapePath {
            strokeWidth: 0
            strokeColor: "transparent"
            fillColor: bubble.color
            startX: {
                if (root.side === "bottom" || root.side === "top" || root.side === "left") return 0
                return root.arrowH + 1 // right
            }
            startY: {
                if (root.side === "bottom") return root.arrowH + 1
                return 0
            }
            PathLine {
                x: {
                    if (root.side === "bottom" || root.side === "top") return root.arrowW / 2
                    if (root.side === "right") return 0
                    return root.arrowH + 1 // left
                }
                y: {
                    if (root.side === "bottom") return 0
                    if (root.side === "top") return root.arrowH + 1
                    return root.arrowW / 2
                }
            }
            PathLine {
                x: {
                    if (root.side === "bottom" || root.side === "top") return root.arrowW
                    if (root.side === "right") return root.arrowH + 1
                    return 0 // left
                }
                y: {
                    if (root.side === "bottom") return root.arrowH + 1
                    if (root.side === "top") return 0
                    return root.arrowW
                }
            }
            PathLine {
                x: {
                    if (root.side === "bottom" || root.side === "top" || root.side === "left") return 0
                    return root.arrowH + 1 // right
                }
                y: {
                    if (root.side === "bottom") return root.arrowH + 1
                    return 0
                }
            }
        }

        // Angled border strokes with open base
        ShapePath {
            strokeWidth: 1
            strokeColor: bubble.border.color
            fillColor: "transparent"
            startX: {
                if (root.side === "bottom" || root.side === "top" || root.side === "left") return 0
                return root.arrowH + 1 // right
            }
            startY: {
                if (root.side === "bottom") return root.arrowH + 1
                return 0
            }
            PathLine {
                x: {
                    if (root.side === "bottom" || root.side === "top") return root.arrowW / 2
                    if (root.side === "right") return 0
                    return root.arrowH + 1 // left
                }
                y: {
                    if (root.side === "bottom") return 0
                    if (root.side === "top") return root.arrowH + 1
                    return root.arrowW / 2
                }
            }
            PathLine {
                x: {
                    if (root.side === "bottom" || root.side === "top") return root.arrowW
                    if (root.side === "right") return root.arrowH + 1
                    return 0 // left
                }
                y: {
                    if (root.side === "bottom") return root.arrowH + 1
                    return 0
                }
            }
        }
    }
}
