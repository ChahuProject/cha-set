// IntroductionPage.qml — Getting Started & Architecture Overview
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

    signal openPage(string pageId)

    Column {
        id: contentCol
        width: Math.min(parent.width, 820)
        spacing: 28

        // Breadcrumb & Page Header
        Column {
            width: parent.width
            spacing: 8

            Row {
                spacing: 6
                Text { text: "Docs"; color: root.cMutedFg; font.pixelSize: 12 }
                Text { text: "/"; color: root.cMutedFg; font.pixelSize: 12 }
                Text { text: "Get Started"; color: root.cMutedFg; font.pixelSize: 12 }
                Text { text: "/"; color: root.cMutedFg; font.pixelSize: 12 }
                Text { text: "Introduction"; color: root.cFg; font.pixelSize: 12; font.weight: Font.DemiBold }
            }

            Text {
                text: "Introduction"
                color: root.cFg
                font.pixelSize: 28
                font.weight: Font.Bold
                font.family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            }

            Text {
                text: "ChaSet (Tea Set) is a cross-stack UI component library where a single source of truth powers both React (Web) and Qt/QML (Desktop) implementations with pixel-perfect and behavioral parity."
                color: root.cMutedFg
                font.pixelSize: 14
                lineHeight: 1.4
                wrapMode: Text.WordWrap
                width: parent.width
            }

            Rectangle { width: parent.width; height: 1; color: root.cBorder }
        }

        // Section 1: Design Philosophy (3 Pillars)
        Column {
            width: parent.width
            spacing: 14

            Text {
                text: "Design Philosophy"
                color: root.cFg
                font.pixelSize: 18
                font.weight: Font.Bold
            }

            Text {
                text: "In traditional multi-platform apps, Web and Desktop design systems drift apart quickly. ChaSet solves this by establishing a neutral, machine-readable specification and token shard layer that drives both React and Qt simultaneously with zero drift."
                color: root.cMutedFg
                font.pixelSize: 13
                lineHeight: 1.4
                wrapMode: Text.WordWrap
                width: parent.width
            }

            Grid {
                columns: 3
                columnSpacing: 14
                width: parent.width

                // Pillar 1
                Rectangle {
                    width: (parent.width - 28) / 3
                    height: 140
                    radius: root.customRadius
                    color: root.cCard
                    border.color: root.cBorder
                    border.width: 1

                    Column {
                        anchors.fill: parent
                        anchors.margins: 14
                        spacing: 6
                        Text { text: "🎯"; font.pixelSize: 22 }
                        Text { text: "One Source of Truth"; color: root.cFg; font.pixelSize: 14; font.weight: Font.Bold }
                        Text {
                            text: "Tokens and component contracts reside in spec/ and emit synchronized code for Web & Qt."
                            color: root.cMutedFg
                            font.pixelSize: 11
                            lineHeight: 1.3
                            wrapMode: Text.WordWrap
                            width: parent.width
                        }
                    }
                }

                // Pillar 2
                Rectangle {
                    width: (parent.width - 28) / 3
                    height: 140
                    radius: root.customRadius
                    color: root.cCard
                    border.color: root.cBorder
                    border.width: 1

                    Column {
                        anchors.fill: parent
                        anchors.margins: 14
                        spacing: 6
                        Text { text: "⚡"; font.pixelSize: 22 }
                        Text { text: "Native Ergonomics"; color: root.cFg; font.pixelSize: 14; font.weight: Font.Bold }
                        Text {
                            text: "Tailwind v4 on React; pure QML Quick Controls on Qt — zero Electron overhead."
                            color: root.cMutedFg
                            font.pixelSize: 11
                            lineHeight: 1.3
                            wrapMode: Text.WordWrap
                            width: parent.width
                        }
                    }
                }

                // Pillar 3
                Rectangle {
                    width: (parent.width - 28) / 3
                    height: 140
                    radius: root.customRadius
                    color: root.cCard
                    border.color: root.cBorder
                    border.width: 1

                    Column {
                        anchors.fill: parent
                        anchors.margins: 14
                        spacing: 6
                        Text { text: "🔒"; font.pixelSize: 22 }
                        Text { text: "Automated Parity Gate"; color: root.cFg; font.pixelSize: 14; font.weight: Font.Bold }
                        Text {
                            text: "CI verifies that every required capability and visual rendering match 100% across stacks."
                            color: root.cMutedFg
                            font.pixelSize: 11
                            lineHeight: 1.3
                            wrapMode: Text.WordWrap
                            width: parent.width
                        }
                    }
                }
            }
        }

        // Section 2: How It Works (Architecture Schema)
        Column {
            width: parent.width
            spacing: 12

            Text {
                text: "How It Works"
                color: root.cFg
                font.pixelSize: 18
                font.weight: Font.Bold
            }

            Rectangle {
                width: parent.width
                height: 130
                radius: root.customRadius
                color: root.cCard
                border.color: root.cBorder
                border.width: 1

                TextArea {
                    anchors.fill: parent
                    anchors.margins: 12
                    readOnly: true
                    text: "spec/                     single source of truth\n  tokens/**               shards: colors, space, motion, typography\n  tokens.json             committed token snapshot\n  components/*.ts         component API contracts (zod schemas)\n  capabilities.json       capability manifest (must / should)\npackages/react/           React implementation (@chahu/cha-set)\nqt/                       Qt 6 / QML implementation (QtChaSetDemo)"
                    color: root.cFg
                    font.family: "Consolas, monospace"
                    font.pixelSize: 12
                    background: null
                }
            }
        }

        // Section 3: Quick Start (Qt QML Usage)
        Column {
            width: parent.width
            spacing: 12

            Text {
                text: "Quick Start (Qt / QML)"
                color: root.cFg
                font.pixelSize: 18
                font.weight: Font.Bold
            }

            Text {
                text: "Import the chaSet module and use native components with dynamic tokens:"
                color: root.cMutedFg
                font.pixelSize: 13
            }

            Rectangle {
                width: parent.width
                height: 190
                radius: root.customRadius
                color: root.cCard
                border.color: root.cBorder
                border.width: 1

                TextArea {
                    anchors.fill: parent
                    anchors.margins: 12
                    readOnly: true
                    text: "import QtQuick 6.10\nimport chaSet\n\nChaSetScrollView {\n    width: 400\n    height: 300\n    showButtons: true\n\n    ChaSetButton {\n        variant: \"primary\"\n        size: \"md\"\n        text: \"Launch Workspace\"\n        onClicked: console.log(\"Clicked!\")\n    }\n}"
                    color: root.cFg
                    font.family: "Consolas, monospace"
                    font.pixelSize: 12
                    background: null
                }
            }
        }
    }
}
