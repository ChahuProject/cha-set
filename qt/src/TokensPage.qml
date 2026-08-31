// TokensPage.qml — Full Semantic Tokens & Palette Reference matching React 1:1
import QtQuick 6.10
import QtQuick.Controls 6.10
import chaSet

DocLayout {
    id: root
    category: "Get Started"
    pageTitle: "Theme & Tokens"
    description: "Neutral token system driving both Tailwind custom CSS properties and Qt Quick C++ / QML singletons."
    tocItems: [
        { id: "colors", title: "Color Palette" },
        { id: "type", title: "Typography & Radius" }
    ]

    property int customRadius: 8
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
        spacing: 14

        Column {
            spacing: 4
            Text { text: "Palette · Semantic Core Tokens"; color: ThemeTokens.text; font.pixelSize: 18; font.weight: Font.Bold }
            Text { text: "All derived from spec/tokens.json. Click any swatch to copy its CSS variable expression."; color: ThemeTokens.subduedText; font.pixelSize: 13 }
        }

        Grid {
            columns: 4
            columnSpacing: 12
            rowSpacing: 12
            width: parent.width

            Repeater {
                model: [
                    ["background", ThemeTokens.background],
                    ["foreground", ThemeTokens.text],
                    ["primary", ThemeTokens.accent],
                    ["primary-foreground", ThemeTokens.onAccent],
                    ["secondary", ThemeTokens.hover],
                    ["secondary-foreground", ThemeTokens.text],
                    ["muted", ThemeTokens.panel],
                    ["muted-foreground", ThemeTokens.subduedText],
                    ["accent", ThemeTokens.accent],
                    ["accent-foreground", ThemeTokens.onAccent],
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
                    width: (parent.width - 36) / 4
                    height: 100
                    radius: 8
                    color: ThemeTokens.panel
                    border.color: ThemeTokens.border
                    border.width: 1
                    clip: true

                    Column {
                        anchors.fill: parent
                        Rectangle {
                            width: parent.width
                            height: 52
                            color: modelData[1]
                            border.color: ThemeTokens.border
                            border.width: 0.5

                            Rectangle {
                                visible: root.copiedToken === modelData[0]
                                anchors.centerIn: parent
                                width: 72; height: 22; radius: 11
                                color: Qt.rgba(0, 0, 0, 0.75)
                                Text { anchors.centerIn: parent; text: "✓ Copied"; color: "#10b981"; font.pixelSize: 10; font.weight: Font.Bold }
                            }
                        }

                        Column {
                            x: 8
                            y: 6
                            spacing: 2
                            Text {
                                text: "--" + modelData[0]
                                color: ThemeTokens.text
                                font.pixelSize: 11
                                font.family: "Consolas, monospace"
                                font.weight: Font.Bold
                            }
                            Text {
                                text: "" + modelData[1]
                                color: ThemeTokens.subduedText
                                font.pixelSize: 10
                                font.family: "Consolas, monospace"
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
        spacing: 16

        Column {
            spacing: 4
            Text { text: "Typography / Radius / Charts"; color: ThemeTokens.text; font.pixelSize: 18; font.weight: Font.Bold }
            Text { text: "Radii derived from --radius (same sm/md/lg/xl derivation as shadcn); font weights map to tokens.json primitives (500/600); chart five colors follow the accent."; color: ThemeTokens.subduedText; font.pixelSize: 13; wrapMode: Text.WordWrap; width: parent.width }
        }

        // Radius Boxes
        Row {
            width: parent.width
            spacing: 12
            Repeater {
                model: [
                    ["radius-sm", 4, "0.25rem"],
                    ["radius-md", 6, "0.375rem"],
                    ["radius-lg", 8, "0.5rem (Default)"],
                    ["radius-xl", 12, "0.75rem"]
                ]
                delegate: Rectangle {
                    required property var modelData
                    width: (parent.width - 36) / 4
                    height: 64
                    radius: modelData[1]
                    color: ThemeTokens.panel
                    border.color: ThemeTokens.border
                    border.width: 1

                    Column {
                        anchors.centerIn: parent
                        spacing: 2
                        Text { text: modelData[0]; color: ThemeTokens.text; font.pixelSize: 11; font.weight: Font.Bold; font.family: "Consolas, monospace"; anchors.horizontalCenter: parent.horizontalCenter }
                        Text { text: modelData[2]; color: ThemeTokens.subduedText; font.pixelSize: 10; anchors.horizontalCenter: parent.horizontalCenter }
                    }
                }
            }
        }

        // Typography Weight Samples
        Rectangle {
            width: parent.width
            implicitHeight: typeCol.implicitHeight + 24
            radius: 8
            color: ThemeTokens.panel
            border.color: ThemeTokens.border
            border.width: 1

            Column {
                id: typeCol
                anchors.fill: parent
                anchors.margins: 14
                spacing: 8
                Text { text: "Medium 500 — Tea Set ChaSet, cross-stack component library"; color: ThemeTokens.text; font.pixelSize: 13; font.weight: Font.Medium }
                Text { text: "Semibold 600 — Tea Set ChaSet, cross-stack component library"; color: ThemeTokens.text; font.pixelSize: 13; font.weight: Font.DemiBold }
            }
        }

        // Chart Bars
        Column {
            spacing: 6
            Text { text: "CHART PALETTE (FOLLOWS ACCENT)"; color: ThemeTokens.subduedText; font.pixelSize: 11; font.weight: Font.Bold; font.letterSpacing: 0.5 }
            Row {
                spacing: 10
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
                        width: 44
                        height: modelData[2]
                        radius: 4
                        color: modelData[1]
                        anchors.bottom: parent.bottom
                        Text {
                            anchors.horizontalCenter: parent.horizontalCenter
                            anchors.bottom: parent.top
                            anchors.bottomMargin: 4
                            text: "--chart-" + parent.modelData[0]
                            color: ThemeTokens.subduedText
                            font.pixelSize: 9
                            font.family: "Consolas, monospace"
                        }
                    }
                }
            }
        }
    }
}
