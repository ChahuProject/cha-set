// TokensPage.qml — Semantic Tokens & Palette Reference
import QtQuick 6.10
import QtQuick.Controls 6.10
import chaSet

Item {
    id: root
    width: parent ? parent.width : 820
    implicitHeight: contentCol.implicitHeight + 60

    property int customRadius: 8
    property color cFg: ThemeTokens.text
    property color cMutedFg: ThemeTokens.subduedText
    property color cCard: ThemeTokens.panel
    property color cBorder: ThemeTokens.border
    property color cPrimary: ThemeTokens.accent
    property color cAccentBg: ThemeTokens.hover

    signal logCopied(string tokenName)

    Column {
        id: contentCol
        width: Math.min(parent.width, 820)
        spacing: 28

        // Breadcrumb & Header
        Column {
            width: parent.width
            spacing: 8

            Row {
                spacing: 6
                Text { text: "Docs"; color: root.cMutedFg; font.pixelSize: 12 }
                Text { text: "/"; color: root.cMutedFg; font.pixelSize: 12 }
                Text { text: "Get Started"; color: root.cMutedFg; font.pixelSize: 12 }
                Text { text: "/"; color: root.cMutedFg; font.pixelSize: 12 }
                Text { text: "Theme & Tokens"; color: root.cFg; font.pixelSize: 12; font.weight: Font.DemiBold }
            }

            Text {
                text: "Theme & Tokens"
                color: root.cFg
                font.pixelSize: 28
                font.weight: Font.Bold
            }

            Text {
                text: "Neutral design token system driving both Tailwind CSS custom properties and Qt Quick C++ / QML singletons."
                color: root.cMutedFg
                font.pixelSize: 14
                lineHeight: 1.4
                wrapMode: Text.WordWrap
                width: parent.width
            }

            Rectangle { width: parent.width; height: 1; color: root.cBorder }
        }

        // Section 1: Color Palette Swatches
        Column {
            width: parent.width
            spacing: 14

            Text { text: "Semantic Core Tokens"; color: root.cFg; font.pixelSize: 18; font.weight: Font.Bold }
            Text { text: "Derived from spec/tokens.json. Click any swatch to copy its expression."; color: root.cMutedFg; font.pixelSize: 13 }

            Grid {
                columns: 4
                columnSpacing: 12
                rowSpacing: 12
                width: parent.width

                Repeater {
                    model: [
                        ["background", "window background"], ["text", "primary text"],
                        ["accent", "primary accent action"], ["onAccent", "accent text"],
                        ["panel", "card / surface bg"], ["panelRaised", "raised surface"],
                        ["hover", "hover overlay"], ["pressed", "pressed overlay"],
                        ["border", "stroke boundary"], ["focus", "focus outline ring"],
                        ["danger", "destructive action"], ["dangerHover", "destructive hover"],
                        ["subduedText", "muted caption"], ["disabled", "disabled state"]
                    ]
                    delegate: Rectangle {
                        required property var modelData
                        width: (parent.width - 36) / 4
                        height: 96
                        radius: root.customRadius > 6 ? 6 : root.customRadius
                        color: root.cCard
                        border.color: root.cBorder
                        clip: true

                        Column {
                            anchors.fill: parent
                            Rectangle {
                                width: parent.width
                                height: 50
                                color: ThemeTokens.color(parent.parent.modelData[0])
                                border.color: root.cBorder
                            }
                            Column {
                                x: 8
                                y: 4
                                spacing: 2
                                Text {
                                    text: "--" + parent.parent.parent.modelData[0]
                                    color: root.cFg
                                    font.pixelSize: 11
                                    font.family: "Consolas, monospace"
                                    font.weight: Font.Bold
                                }
                                Text {
                                    text: parent.parent.parent.modelData[1]
                                    color: root.cMutedFg
                                    font.pixelSize: 10
                                }
                            }
                        }

                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: root.logCopied("--" + parent.modelData[0])
                        }
                    }
                }
            }
        }

        // Section 2: Radius Tokens
        Column {
            width: parent.width
            spacing: 14

            Text { text: "Corner Radius Scale"; color: root.cFg; font.pixelSize: 18; font.weight: Font.Bold }
            Text { text: "Derived from base --radius unit (0.5rem = 8px default):"; color: root.cMutedFg; font.pixelSize: 13 }

            Row {
                spacing: 14
                Repeater {
                    model: [
                        ["radius-sm", 4, "0.25rem"],
                        ["radius-md", 6, "0.375rem"],
                        ["radius-lg", 8, "0.5rem (Default)"],
                        ["radius-xl", 12, "0.75rem"]
                    ]
                    delegate: Rectangle {
                        required property var modelData
                        width: (parent.parent.width - 42) / 4
                        height: 72
                        radius: modelData[1]
                        color: Qt.rgba(root.cPrimary.r, root.cPrimary.g, root.cPrimary.b, 0.12)
                        border.color: root.cPrimary
                        border.width: 1.5

                        Column {
                            anchors.centerIn: parent
                            spacing: 4
                            Text {
                                text: parent.parent.modelData[0]
                                color: root.cFg
                                font.pixelSize: 12
                                font.weight: Font.Bold
                                anchors.horizontalCenter: parent.horizontalCenter
                            }
                            Text {
                                text: parent.parent.modelData[2]
                                color: root.cMutedFg
                                font.pixelSize: 10
                                anchors.horizontalCenter: parent.horizontalCenter
                            }
                        }
                    }
                }
            }
        }

        // Section 3: Typography & Chart Bars
        Column {
            width: parent.width
            spacing: 14

            Text { text: "Typography Scale & Visualizers"; color: root.cFg; font.pixelSize: 18; font.weight: Font.Bold }

            Rectangle {
                width: parent.width
                height: 160
                radius: root.customRadius
                color: root.cCard
                border.color: root.cBorder
                border.width: 1

                Column {
                    anchors.fill: parent
                    anchors.margins: 16
                    spacing: 8

                    Text { text: "Title (24px) — Tea Set ChaSet, cross-stack component library"; color: root.cFg; font.pixelSize: 18; font.weight: Font.Bold }
                    Text { text: "Heading (16px) — Synchronized design token architecture for Web & Qt"; color: root.cFg; font.pixelSize: 14; font.weight: Font.DemiBold }
                    Text { text: "Body (13px) — Clean, ergonomic UI primitives with zero Electron bloat"; color: root.cMutedFg; font.pixelSize: 13 }
                    Text { text: "Small Caption (11px) — WCAG AAA verified contrast ratios"; color: root.cMutedFg; font.pixelSize: 11; font.family: "Consolas, monospace" }
                }
            }
        }
    }
}
