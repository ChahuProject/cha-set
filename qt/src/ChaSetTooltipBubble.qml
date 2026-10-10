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
import QtQuick 6.10
import QtQuick.Shapes 6.10
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

    readonly property real uiScaleFactor: (typeof uiScale !== "undefined" && uiScale)
            ? Number(uiScale.scale) : 1.0

    readonly property int arrowW: (typeof ThemeTokens !== "undefined" && ThemeTokens)
            ? ThemeTokens.dp(8) : Math.round(8 * uiScaleFactor)
    readonly property int arrowH: (typeof ThemeTokens !== "undefined" && ThemeTokens)
            ? ThemeTokens.dp(4) : Math.round(4 * uiScaleFactor)
    readonly property int effectiveArrowH: root.arrow ? arrowH : 0

    readonly property real scaledPadX: (typeof ThemeTokens !== "undefined" && ThemeTokens)
            ? ThemeTokens.dp(16) : Math.round(16 * uiScaleFactor)
    readonly property real scaledPadY: (typeof ThemeTokens !== "undefined" && ThemeTokens)
            ? ThemeTokens.dp(8) : Math.round(8 * uiScaleFactor)

    // 单行紧凑内容宽度与高度
    readonly property real contentW: mainContent.implicitWidth
    readonly property real contentH: mainContent.implicitHeight

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

    ChaSetSquircle {
        id: bubble
        x: {
            if (root.arrow && root.side === "right") return root.effectiveArrowH
            return 0
        }
        y: {
            if (root.arrow && root.side === "bottom") return root.effectiveArrowH
            return 0
        }
        width: root.baseBubbleW
        height: root.baseBubbleH

        radius: (typeof ThemeTokens !== "undefined" && ThemeTokens)
                ? ThemeTokens.dp(4) : Math.max(1, Math.round(4 * root.uiScaleFactor))
        color: (typeof ThemeTokens !== "undefined" && ThemeTokens)
                ? (ThemeTokens.dark ? ThemeTokens.color("panelRaised") : "#ffffff")
                : "#ffffff"
        border.color: (typeof ThemeTokens !== "undefined" && ThemeTokens)
                ? ThemeTokens.color("border") : "#7188a5"
        border.width: 1

        Column {
            id: mainContent
            objectName: "mainContent"
            anchors.centerIn: parent
            spacing: (typeof ThemeTokens !== "undefined" && ThemeTokens)
                    ? ThemeTokens.dp(3) : Math.round(3 * root.uiScaleFactor)

            Row {
                id: contentRow
                objectName: "contentRow"
                anchors.horizontalCenter: parent.horizontalCenter
                visible: appIcon.visible || bubbleText.visible || shortcutBadge.visible
                spacing: (typeof ThemeTokens !== "undefined" && ThemeTokens)
                        ? ThemeTokens.dp(6) : Math.round(6 * root.uiScaleFactor)

                ChaSetIcon {
                    id: appIcon
                    objectName: "appIcon"
                    visible: root.iconName !== ""
                    name: root.iconName
                    size: 14
                    color: (typeof ThemeTokens !== "undefined" && ThemeTokens)
                            ? ThemeTokens.color("text") : "#e6f2ff"
                    anchors.verticalCenter: parent.verticalCenter
                }

                Text {
                    id: bubbleText
                    objectName: "bubbleText"
                    visible: root.text !== ""
                    text: root.text
                    color: (typeof ThemeTokens !== "undefined" && ThemeTokens)
                            ? ThemeTokens.color("text") : "#e6f2ff"
                    font.family: (typeof Typography !== "undefined" && Typography && Typography.familySans)
                            ? Typography.familySans : undefined
                    font.pixelSize: (typeof Typography !== "undefined" && Typography)
                            ? Typography.sizeCaption : Math.round(11 * root.uiScaleFactor)
                    font.weight: Font.Medium
                    horizontalAlignment: Text.AlignHCenter
                    verticalAlignment: Text.AlignVCenter
                    anchors.verticalCenter: parent.verticalCenter
                }

                ChaSetKbd {
                    id: shortcutBadge
                    objectName: "shortcutBadge"
                    visible: root.shortcut !== ""
                    anchors.verticalCenter: parent ? parent.verticalCenter : undefined
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
                anchors.horizontalCenter: parent.horizontalCenter
                text: root.description
                color: (typeof ThemeTokens !== "undefined" && ThemeTokens)
                        ? ThemeTokens.color("subduedText") : "#b0c5e4"
                font.family: (typeof Typography !== "undefined" && Typography && Typography.familySans)
                        ? Typography.familySans : undefined
                font.pixelSize: (typeof Typography !== "undefined" && Typography)
                        ? Typography.sizeCaption : Math.round(11 * root.uiScaleFactor)
                wrapMode: Text.Wrap
                readonly property real maxDescW: (typeof ThemeTokens !== "undefined" && ThemeTokens)
                        ? ThemeTokens.dp(280) : Math.round(280 * root.uiScaleFactor)
                width: visible ? Math.min(implicitWidth, maxDescW) : 0
                horizontalAlignment: Text.AlignHCenter
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
