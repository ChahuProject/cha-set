// TokensPage.qml — Full Semantic Tokens & Palette Reference matching React 1:1
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Get Started"
    pageTitle: "Theme & Tokens"
    description: "Neutral token system driving both Tailwind custom CSS properties and Qt Quick C++ / QML singletons."
    tocItems: [
        { id: "colors", title: "Color Palette" },
        { id: "type", title: "Typography & Radius" }
    ]

    property int customRadius: ThemeTokens.dp(8)
    property color cFg: ThemeTokens.text
    property color cMutedFg: ThemeTokens.subduedText
    property color cCard: ThemeTokens.panel
    property color cBorder: ThemeTokens.border
    property color cPrimary: ThemeTokens.accent
    property color cAccentBg: ThemeTokens.hover

    property string copiedToken: ""

    signal logCopied(string tokenName)

    TextEdit { id: clipHelper; visible: false }

    Timer {
        id: toastTimer
        interval: 1800
        onTriggered: root.copiedToken = ""
    }

    function copyToken(tokenName, hexVal) {
        clipHelper.text = "var(--" + tokenName + ") /* " + hexVal + " */"
        clipHelper.selectAll()
        clipHelper.copy()
        root.copiedToken = tokenName
        root.logCopied(tokenName)
        toastTimer.restart()
    }

    // Section 1: Color Palette
    Column {
        width: parent.width
        spacing: ThemeTokens.dp(14)

        Column {
            width: parent.width
            spacing: ThemeTokens.dp(4)
            DocText { text: "Palette · Semantic Core Tokens"; textColor: ThemeTokens.text; font.pixelSize: Typography.sizeTitleSm; font.weight: Typography.weightBold }
            DocText {
                width: parent.width
                text: "All derived from spec/tokens.json. Click any swatch to copy its CSS variable expression."
                isMuted: true
                font.pixelSize: Typography.sizeBody
                wrapMode: TextEdit.WordWrap
                height: contentHeight
            }
        }

        Grid {
            columns: 4
            columnSpacing: ThemeTokens.dp(12)
            rowSpacing: ThemeTokens.dp(12)
            width: parent.width

            Repeater {
                model: [
                    ["background", ThemeTokens.background],
                    ["foreground", ThemeTokens.text],
                    ["primary", ThemeTokens.accent],
                    ["primary-foreground", ThemeTokens.primaryForeground],
                    ["secondary", ThemeTokens.hover],
                    ["secondary-foreground", ThemeTokens.text],
                    ["muted", ThemeTokens.panel],
                    ["muted-foreground", ThemeTokens.subduedText],
                    ["accent", ThemeTokens.accent],
                    ["accent-foreground", ThemeTokens.primaryForeground],
                    ["destructive", ThemeTokens.danger],
                    ["destructive-foreground", "#ffffff"],
                    ["border", ThemeTokens.border],
                    ["input", ThemeTokens.panelRaised],
                    ["ring", ThemeTokens.focus],
                    ["card", ThemeTokens.panel],
                    ["popover", ThemeTokens.panelRaised]
                ]
                delegate: Rectangle {
                    required property var modelData
                    width: (parent ? parent.width - ThemeTokens.dp(36) : ThemeTokens.dp(760)) / 4
                    height: ThemeTokens.dp(100)
                    radius: ThemeTokens.dp(8)
                    color: ThemeTokens.panel
                    border.color: ThemeTokens.border
                    border.width: 1
                    clip: true

                    Column {
                        anchors.fill: parent
                        Rectangle {
                            width: parent.width
                            height: ThemeTokens.dp(52)
                            color: modelData[1]
                            border.color: ThemeTokens.border
                            border.width: 0.5

                            Rectangle {
                                visible: root.copiedToken === modelData[0]
                                anchors.centerIn: parent
                                width: ThemeTokens.dp(72); height: ThemeTokens.dp(22); radius: ThemeTokens.dp(11)
                                color: Qt.rgba(0, 0, 0, 0.75)
                                Row {
                                    anchors.centerIn: parent
                                    spacing: ThemeTokens.dp(4)
                                    ChaSetIcon { name: "check"; size: 12; color: "#10b981"; anchors.verticalCenter: parent.verticalCenter }
                                    DocText { text: "Copied"; color: "#10b981"; font.pixelSize: Typography.sizeMicro; font.weight: Typography.weightBold; anchors.verticalCenter: parent.verticalCenter }
                                }
                            }
                        }

                        Column {
                            x: ThemeTokens.dp(8)
                            y: ThemeTokens.dp(6)
                            spacing: ThemeTokens.dp(2)
                            DocText {
                                text: "--" + modelData[0]
                                color: ThemeTokens.text
                                font.pixelSize: Typography.sizeCaption
                                font.family: Typography.familyMono
                                font.weight: Typography.weightBold
                            }
                            DocText {
                                text: "" + modelData[1]
                                color: ThemeTokens.subduedText
                                font.pixelSize: Typography.sizeMicro
                                font.family: Typography.familyMono
                            }
                        }
                    }

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: root.copyToken(parent.modelData[0], "" + parent.modelData[1])
                    }
                }
            }
        }
    }

    // Section 2: Typography & Radius & Charts
    Column {
        width: parent.width
        spacing: ThemeTokens.dp(16)

        Column {
            width: parent.width
            spacing: ThemeTokens.dp(4)
            DocText { text: "Typography / Radius / Charts"; textColor: ThemeTokens.text; font.pixelSize: Typography.sizeTitleSm; font.weight: Typography.weightBold }
            DocText {
                width: parent.width
                text: "Radii derived from --radius (same sm/md/lg/xl derivation as shadcn); font weights map to tokens.json primitives (500/600); chart five colors follow the accent."
                isMuted: true
                font.pixelSize: Typography.sizeBody
                wrapMode: TextEdit.WordWrap
                height: contentHeight
            }
        }

        // Radius Boxes
        Row {
            width: parent.width
            spacing: ThemeTokens.dp(12)
            Repeater {
                model: [
                    ["radius-sm", 4, "0.25rem"],
                    ["radius-md", 6, "0.375rem"],
                    ["radius-lg", 8, "0.5rem (Default)"],
                    ["radius-xl", 12, "0.75rem"]
                ]
                delegate: Rectangle {
                    required property var modelData
                    width: (parent ? parent.width - ThemeTokens.dp(36) : ThemeTokens.dp(760)) / 4
                    height: ThemeTokens.dp(64)
                    radius: ThemeTokens.dp(modelData[1])
                    color: ThemeTokens.panel
                    border.color: ThemeTokens.border
                    border.width: 1

                    Column {
                        anchors.centerIn: parent
                        spacing: ThemeTokens.dp(2)
                        DocText { text: modelData[0]; color: ThemeTokens.text; font.pixelSize: Typography.sizeCaption; font.weight: Typography.weightBold; font.family: Typography.familyMono; anchors.horizontalCenter: parent.horizontalCenter }
                        DocText { text: modelData[2]; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeMicro; anchors.horizontalCenter: parent.horizontalCenter }
                    }
                }
            }
        }

        // Typography Weight & CJK Font Fallback Samples
        Rectangle {
            width: parent.width
            implicitHeight: typeCol.implicitHeight + ThemeTokens.dp(28)
            radius: ThemeTokens.dp(8)
            color: ThemeTokens.panel
            border.color: ThemeTokens.border
            border.width: 1

            Column {
                id: typeCol
                anchors.fill: parent
                anchors.margins: ThemeTokens.dp(14)
                spacing: ThemeTokens.dp(12)

                Row {
                    spacing: ThemeTokens.dp(8)
                    DocText { text: "Font System · CJK Fallback & Typography Scale"; color: ThemeTokens.text; font.pixelSize: Typography.sizeBody; font.weight: Typography.weightBold }
                    ChaSetBadge { text: "Zero-SimSun Guarantee"; variant: "secondary" }
                }

                DocText {
                    width: parent.width
                    wrap: true
                    height: contentHeight
                    text: "Fallback Stack (Sans): " + Typography.familiesSans.join("  →  ")
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeCaption
                    font.family: Typography.familyMono
                }

                Column {
                    spacing: ThemeTokens.dp(6)
                    width: parent.width

                    DocText {
                        width: parent.width
                        wrap: true
                        text: "Regular 400 — ChaSet 组件库 · 跨端统一字体系统 (The quick brown fox jumps over the lazy dog 0123456789)"
                        color: ThemeTokens.text
                        font.family: Typography.familySans
                        font.pixelSize: Typography.sizeBody
                        font.weight: Typography.weightRegular
                    }
                    DocText {
                        width: parent.width
                        wrap: true
                        text: "Medium 500 — ChaSet 组件库 · 跨端统一字体系统 (The quick brown fox jumps over the lazy dog 0123456789)"
                        color: ThemeTokens.text
                        font.family: Typography.familySans
                        font.pixelSize: Typography.sizeBody
                        font.weight: Typography.weightMedium
                    }
                    DocText {
                        width: parent.width
                        wrap: true
                        text: "Semibold 600 — ChaSet 组件库 · 跨端统一字体系统 (The quick brown fox jumps over the lazy dog 0123456789)"
                        color: ThemeTokens.text
                        font.family: Typography.familySans
                        font.pixelSize: Typography.sizeBody
                        font.weight: Typography.weightSemibold
                    }
                    DocText {
                        width: parent.width
                        wrap: true
                        text: "Bold 700 — ChaSet 组件库 · 跨端统一字体系统 (The quick brown fox jumps over the lazy dog 0123456789)"
                        color: ThemeTokens.text
                        font.family: Typography.familySans
                        font.pixelSize: Typography.sizeBody
                        font.weight: Typography.weightBold
                    }
                }

                Rectangle {
                    width: parent.width
                    height: 1
                    color: ThemeTokens.border
                }

                DocText {
                    width: parent.width
                    wrap: true
                    height: contentHeight
                    text: "Fallback Stack (Mono): " + Typography.familiesMono.join("  →  ")
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeCaption
                    font.family: Typography.familyMono
                }

                Rectangle {
                    width: parent.width
                    implicitHeight: monoCol.implicitHeight + ThemeTokens.dp(16)
                    color: ThemeTokens.panelRaised
                    radius: ThemeTokens.dp(6)
                    border.color: ThemeTokens.border
                    border.width: 1

                    Column {
                        id: monoCol
                        anchors.fill: parent
                        anchors.margins: ThemeTokens.dp(10)
                        spacing: ThemeTokens.dp(4)

                        DocText {
                            width: parent.width
                            wrap: true
                            text: "const fontSystem = ChaSet.FontSystem; // 自动处理中文字体回退，消除宋体锯齿"
                            color: ThemeTokens.text
                            font.family: Typography.familyMono
                            font.pixelSize: Typography.sizeSmall
                        }
                        DocText {
                            width: parent.width
                            wrap: true
                            text: "console.log(`[ChaSet] CJK glyphs: 字体平滑清晰, zero raster artifacts`);"
                            color: ThemeTokens.subduedText
                            font.family: Typography.familyMono
                            font.pixelSize: Typography.sizeSmall
                        }
                    }
                }
            }
        }

        // Chart Bars
        Column {
            spacing: ThemeTokens.dp(6)
            DocText { text: "CHART PALETTE (FOLLOWS ACCENT)"; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeCaption; font.weight: Typography.weightBold; font.letterSpacing: 0.5 }
            Row {
                spacing: ThemeTokens.dp(10)
                Repeater {
                    model: [
                        [1, ThemeTokens.accent, 40],
                        [2, Qt.lighter(ThemeTokens.accent, 1.2), 52],
                        [3, Qt.darker(ThemeTokens.accent, 1.2), 64],
                        [4, Qt.lighter(ThemeTokens.accent, 1.4), 76],
                        [5, Qt.darker(ThemeTokens.accent, 1.4), 88]
                    ]
                    delegate: Rectangle {
                        required property var modelData
                        width: ThemeTokens.dp(44)
                        height: ThemeTokens.dp(modelData[2])
                        radius: ThemeTokens.dp(4)
                        color: modelData[1]
                        anchors.bottom: parent ? parent.bottom : undefined
                        DocText {
                            anchors.horizontalCenter: parent.horizontalCenter
                            anchors.bottom: parent.top
                            anchors.bottomMargin: ThemeTokens.dp(4)
                            text: "--chart-" + parent.modelData[0]
                            color: ThemeTokens.subduedText
                            font.pixelSize: Typography.sizeNano
                            font.family: Typography.familyMono
                        }
                    }
                }
            }
        }
    }
}
