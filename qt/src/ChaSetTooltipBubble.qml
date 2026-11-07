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

    // 单行上限：超过才折行。400dp 级的文件名/路径很常见，旧的 380dp 会在
    // 「看上去并不长」的内容上强行折行（并让首行右侧留下突兀空白）。
    readonly property real maxContentW: (typeof ThemeTokens !== "undefined" && ThemeTokens)
            ? ThemeTokens.dp(480) : Math.round(480 * uiScaleFactor)
    readonly property real maxTextW: maxContentW
    readonly property real maxDescW: maxContentW

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

    FontMetrics {
        id: descFm
        font: descMetrics.font
    }

    FontMetrics {
        id: textFm
        font: textMetrics.font
    }

    // 声明式单行/多行判定（基于离线 TextMetrics，彻底断绝 Text 内部 lineCount 布局依赖形成的 Binding loop）
    readonly property bool isMultilineText: root.text !== "" && (root.text.indexOf("\n") !== -1 || textMetrics.width > root.maxTextW)

    // 单行/多行紧凑内容宽度：**纯 FontMetrics/TextMetrics 同步推导**。
    // 当存在显式换行符 '\n' 时，TextMetrics.width 会累加全部行字符导致假性超宽；
    // 必须拆分各行取最大 advance，并与 bubbleText.implicitWidth 取较大值吸收 CJK 塑形差异。
    readonly property real rawTextW: {
        if (root.text === "")
            return 0
        if (root.text.indexOf("\n") === -1)
            return textMetrics.width
        var lines = root.text.split("\n")
        var maxW = 0
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i]
            if (line.length === 0) continue
            var lw = textFm.advanceWidth(line)
            if (lw > maxW) {
                maxW = lw
            }
        }
        return maxW
    }

    readonly property real naturalTextW: {
        if (root.text === "")
            return 0
        return Math.min(Math.max(rawTextW, bubbleText.implicitWidth), root.maxTextW)
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
            // estimatedFullWidth 由 ChaSetKbd 内部 TextMetrics 同步推导；
            // 严禁退回 implicitWidth/width —— 那是 Positioner 的布局产物，
            // 新内容写入后仍是旧值（首帧宽度塌陷 12px 就是这么来的）。
            // estimatedFullWidth（同步推算）与徽标自身 implicitWidth 取大：
            // 前者可能在多分支/组合键上略窄，导致徽标悬空脱出黑框右侧。
            var kbdW = (typeof shortcutBadge !== "undefined" && shortcutBadge)
                    ? Math.max(shortcutBadge.estimatedFullWidth, shortcutBadge.implicitWidth)
                    : 0
            if (!(kbdW > 0))
                kbdW = Math.round(30 * root.uiScaleFactor)
            w += kbdW
            items++
        }
        if (items > 1) {
            var sp = (typeof ThemeTokens !== "undefined" && ThemeTokens)
                    ? ThemeTokens.dp(8) : Math.round(8 * root.uiScaleFactor)
            w += (items - 1) * sp
        }
        return w
    }

    // 描述紧凑宽度：纯 FontMetrics 同步推导。
    // 当存在显式换行符 '\n' 时，TextMetrics.width 会累加所有行字符导致假性超宽；
    // 必须拆分各行取最大 advance，并与 descText.implicitWidth 取较大值吸收 CJK 塑形差异。
    readonly property real rawDescW: {
        if (root.description === "")
            return 0
        if (root.description.indexOf("\n") === -1)
            return descMetrics.width
        var lines = root.description.split("\n")
        var maxW = 0
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i]
            if (line.length === 0) continue
            var lw = descFm.advanceWidth(line)
            if (lw > maxW) {
                maxW = lw
            }
        }
        return maxW
    }

    readonly property real naturalDescW: root.description === ""
            ? 0 : Math.min(Math.max(rawDescW, descText.implicitWidth), root.maxDescW)

    // 宽度一律由 TextMetrics 同步推导，不掺入任何 Positioner/Text 的布局尺寸
    readonly property real contentW: Math.max(naturalRowW, naturalDescW)

    /// 正文行数（纯 TextMetrics 推导，与 C++ measuredSize 同一口径）。
    /// 严禁读 bubbleText.lineCount / implicitHeight / contentRow.* ——
    /// 它们都是**上一帧**的布局产物：换缩放档或换内容后，父项几何要等下一次
    /// polish 才更新，读到的行高会让气泡凭空多出或少掉一整行
    /// （多出 = 底部留白，少掉 = 文字被裁）。
    readonly property int textLineCount: {
        if (root.text === "")
            return 0
        if (!root.isMultilineText)
            return 1
        var explicitLines = root.text.split("\n").length
        var wrappedLines = Math.max(1, Math.ceil(textMetrics.width / Math.max(1, root.maxTextW)))
        return Math.max(explicitLines, wrappedLines)
    }

    readonly property real naturalRowH: {
        var h = 0
        if (root.text !== "")
            h = root.textLineCount * textMetrics.height
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
        return h
    }

    readonly property real naturalDescH: {
        if (root.description === "")
            return 0
        var maxD = Math.max(1, root.maxDescW)
        if (root.description.indexOf("\n") === -1) {
            var lineCount = Math.max(1, Math.ceil(descMetrics.width / maxD))
            return lineCount * descMetrics.height
        }
        var lines = root.description.split("\n")
        var totalLines = 0
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i]
            if (line.length === 0) {
                totalLines += 1
                continue
            }
            var lw = descFm.advanceWidth(line)
            var wrapped = Math.max(1, Math.ceil(lw / maxD))
            totalLines += wrapped
        }
        return Math.max(1, totalLines) * descMetrics.height
    }

    readonly property real contentH: {
        var h = 0
        var hasRow = (root.text !== "" || root.shortcut !== "" || root.iconName !== "")
        var hasDesc = (root.description !== "")
        var sp = (hasRow && hasDesc)
                ? ((typeof ThemeTokens !== "undefined" && ThemeTokens)
                    ? ThemeTokens.dp(2) : Math.round(2 * root.uiScaleFactor))
                : 0
        if (hasRow) h += naturalRowH
        h += sp
        if (hasDesc) h += naturalDescH
        return h
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

    width: implicitWidth
    height: implicitHeight

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
            anchors.left: parent.left
            anchors.leftMargin: Math.round(scaledPadX / 2)
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
                    anchors.verticalCenter: (!root.isMultilineText) ? parent.verticalCenter : undefined
                    anchors.top: root.isMultilineText ? parent.top : undefined
                    anchors.topMargin: root.isMultilineText ? ((typeof ThemeTokens !== "undefined" && ThemeTokens) ? ThemeTokens.dp(2) : 2) : 0
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
                    horizontalAlignment: (root.description !== "" || root.isMultilineText) ? Text.AlignLeft : Text.AlignHCenter
                    verticalAlignment: (!root.isMultilineText) ? Text.AlignVCenter : Text.AlignTop
                    anchors.verticalCenter: (!root.isMultilineText) ? parent.verticalCenter : undefined
                    anchors.top: root.isMultilineText ? parent.top : undefined
                    anchors.topMargin: 0
                    wrapMode: root.isMultilineText ? Text.Wrap : Text.NoWrap
                    width: (wrapMode === Text.Wrap) ? Math.min(root.naturalTextW, root.maxTextW) : undefined
                }

                ChaSetKbd {
                    id: shortcutBadge
                    objectName: "shortcutBadge"
                    visible: root.shortcut !== ""
                    anchors.verticalCenter: (!root.isMultilineText) ? (parent ? parent.verticalCenter : undefined) : undefined
                    anchors.top: root.isMultilineText ? (parent ? parent.top : undefined) : undefined
                    anchors.topMargin: root.isMultilineText ? ((typeof ThemeTokens !== "undefined" && ThemeTokens) ? ThemeTokens.dp(2) : 2) : 0
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
                readonly property real maxDescW: root.maxDescW
                readonly property bool shouldWrap: (root.rawDescW > maxDescW)
                wrapMode: shouldWrap ? Text.Wrap : Text.NoWrap
                // 折行宽度只由内容上限决定，**不读 root.width**：
                // root.width 在全局提示窗里等于「窗口宽度」，而窗口宽度又来自
                // 本气泡的隐式尺寸 —— 一旦读取就形成「宽度↔高度」回环，量出来
                // 的尺寸会随上一帧的窗口宽度漂移（首行留白 / 多行被裁都源于此）。
                width: shouldWrap ? maxDescW : undefined
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
