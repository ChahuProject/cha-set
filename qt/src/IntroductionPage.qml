// IntroductionPage.qml — Getting Started & Architecture Overview matching React 1:1
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Get Started"
    pageTitle: "Introduction"
    description: "ChaSet (Tea Set) is a cross-stack UI component library where a single source of truth powers both React (Web) and Qt/QML (Desktop) implementations."
    tocItems: [
        { id: "philosophy", title: "Design Philosophy" },
        { id: "architecture", title: "How It Works" },
        { id: "quickstart", title: "Quick Start" },
        { id: "packages", title: "Packages & Structure" }
    ]

    property int customRadius: 8
    property color cFg: ThemeTokens.text
    property color cMutedFg: ThemeTokens.subduedText
    property color cCard: ThemeTokens.panel
    property color cBorder: ThemeTokens.border
    property color cPrimary: ThemeTokens.accent
    property color cAccentBg: ThemeTokens.hover

    signal openPage(string pageId)

    // Section 1: Design Philosophy
    Column {
        width: parent.width
        spacing: 12

        Text {
            text: "Design Philosophy"
            color: ThemeTokens.text
            font.pixelSize: 18
            font.weight: Font.Bold
        }

        Text {
            text: "ChaSet is part of the ChahuProject ecosystem. In traditional multi-platform apps, Web and Desktop design systems drift apart quickly. ChaSet solves this by establishing a neutral, machine-readable specification and token shard layer that drives both React and Qt simultaneously with pixel-perfect and behavioral parity."
            color: ThemeTokens.subduedText
            font.pixelSize: 13
            lineHeight: 1.4
            wrapMode: Text.WordWrap
            width: parent.width
        }

        Row {
            width: parent.width
            spacing: 14

            // Pillar 1
            Rectangle {
                width: (parent.width - 28) / 3
                implicitHeight: col1.implicitHeight + 28
                radius: 10
                color: ThemeTokens.panel
                border.color: ThemeTokens.border
                border.width: 1

                Column {
                    id: col1
                    anchors.fill: parent
                    anchors.margins: 14
                    spacing: 6
                    Text { text: "🎯"; font.pixelSize: 22 }
                    Text { text: "One Source of Truth"; color: ThemeTokens.text; font.pixelSize: 13; font.weight: Font.Bold }
                    Text {
                        text: "Design tokens and API contracts reside in spec/ and emit synchronized tokens for Web & Qt."
                        color: ThemeTokens.subduedText
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
                implicitHeight: col2.implicitHeight + 28
                radius: 10
                color: ThemeTokens.panel
                border.color: ThemeTokens.border
                border.width: 1

                Column {
                    id: col2
                    anchors.fill: parent
                    anchors.margins: 14
                    spacing: 6
                    Text { text: "⚡"; font.pixelSize: 22 }
                    Text { text: "Native Ergonomics"; color: ThemeTokens.text; font.pixelSize: 13; font.weight: Font.Bold }
                    Text {
                        text: "Tailwind CSS v4 & Base UI on React; pure QML Quick Controls on Qt — no electron bloat or foreign wrappers."
                        color: ThemeTokens.subduedText
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
                implicitHeight: col3.implicitHeight + 28
                radius: 10
                color: ThemeTokens.panel
                border.color: ThemeTokens.border
                border.width: 1

                Column {
                    id: col3
                    anchors.fill: parent
                    anchors.margins: 14
                    spacing: 6
                    Text { text: "🔒"; font.pixelSize: 22 }
                    Text { text: "Automated Parity Gate"; color: ThemeTokens.text; font.pixelSize: 13; font.weight: Font.Bold }
                    Text {
                        text: "CI enforces that all required capabilities and visual rendering match 100% across stacks."
                        color: ThemeTokens.subduedText
                        font.pixelSize: 11
                        lineHeight: 1.3
                        wrapMode: Text.WordWrap
                        width: parent.width
                    }
                }
            }
        }
    }

    // Section 2: How It Works
    Column {
        width: parent.width
        spacing: 12

        Text {
            text: "How It Works"
            color: ThemeTokens.text
            font.pixelSize: 18
            font.weight: Font.Bold
        }

        CodeBlock {
            width: parent.width
            language: "structure"
            code: "spec/                     single source of truth\n  tokens/**               shards: colors, space, motion, typography\n  tokens.json             committed token snapshot\n  components/*.ts         component API contracts (zod schemas)\n  capabilities.json       capability manifest (must / should)\npackages/react/           React implementation (@chahu/cha-set)\nqt/                       Qt 6 / QML implementation (QtChaSetDemo)"
        }
    }

    // Section 3: Quick Start
    Column {
        width: parent.width
        spacing: 12

        Text {
            text: "Quick Start"
            color: ThemeTokens.text
            font.pixelSize: 18
            font.weight: Font.Bold
        }

        Text {
            text: "Install the package and peer dependencies:"
            color: ThemeTokens.subduedText
            font.pixelSize: 12
        }

        CodeBlock {
            width: parent.width
            language: "bash"
            code: "pnpm add @chahu/cha-set"
        }

        Text {
            text: "Use in your application:"
            color: ThemeTokens.subduedText
            font.pixelSize: 12
        }

        CodeBlock {
            width: parent.width
            language: "qml"
            code: "import QtQuick 6.10\nimport ChaSet\n\nChaSetScrollArea {\n    width: 400\n    height: 300\n    showButtons: true\n\n    ChaSetButton {\n        variant: \"primary\"\n        size: \"md\"\n        text: \"Launch Workspace\"\n        onClicked: console.log(\"Clicked!\")\n    }\n}"
        }
    }

    // Section 4: Packages
    Column {
        width: parent.width
        spacing: 12

        Text {
            text: "Packages"
            color: ThemeTokens.text
            font.pixelSize: 18
            font.weight: Font.Bold
        }

        Rectangle {
            width: parent.width
            implicitHeight: pkgCol.implicitHeight
            radius: 8
            color: ThemeTokens.panel
            border.color: ThemeTokens.border
            border.width: 1
            clip: true

            Column {
                id: pkgCol
                width: parent.width

                // Header
                Rectangle {
                    width: parent.width
                    height: 36
                    color: Qt.rgba(ThemeTokens.hover.r, ThemeTokens.hover.g, ThemeTokens.hover.b, 0.6)
                    border.color: ThemeTokens.border
                    border.width: 0.5

                    Row {
                        anchors.fill: parent
                        anchors.leftMargin: 16
                        anchors.rightMargin: 16
                        spacing: 12
                        Text { text: "PACKAGE"; color: ThemeTokens.subduedText; font.pixelSize: 11; font.weight: Font.Bold; font.letterSpacing: 0.5; width: 160; anchors.verticalCenter: parent.verticalCenter }
                        Text { text: "TARGET"; color: ThemeTokens.subduedText; font.pixelSize: 11; font.weight: Font.Bold; font.letterSpacing: 0.5; width: 140; anchors.verticalCenter: parent.verticalCenter }
                        Text { text: "DESCRIPTION"; color: ThemeTokens.subduedText; font.pixelSize: 11; font.weight: Font.Bold; font.letterSpacing: 0.5; width: parent.width - 330; anchors.verticalCenter: parent.verticalCenter }
                    }
                }

                // Rows
                Repeater {
                    model: [
                        ["@chahu/cha-set", "React / Web", "React component library published to npm."],
                        ["QtChaSetDemo", "Qt 6 / C++ / QML", "Qt reference implementation with native QML components."],
                        ["@chahu/spec", "Internal Spec", "Neutral token generator and contract schemas."]
                    ]
                    delegate: Rectangle {
                        required property var modelData
                        required property int index
                        width: parent.width
                        height: 44
                        color: index % 2 === 0 ? "transparent" : Qt.rgba(ThemeTokens.hover.r, ThemeTokens.hover.g, ThemeTokens.hover.b, 0.2)

                        Rectangle {
                            anchors.bottom: parent.bottom
                            width: parent.width
                            height: 1
                            color: ThemeTokens.border
                            opacity: 0.6
                        }

                        Row {
                            anchors.fill: parent
                            anchors.leftMargin: 16
                            anchors.rightMargin: 16
                            spacing: 12

                            Text {
                                text: modelData[0]
                                color: ThemeTokens.accent
                                font.family: "Consolas, monospace"
                                font.pixelSize: 12
                                font.weight: Font.DemiBold
                                width: 160
                                anchors.verticalCenter: parent.verticalCenter
                            }
                            Text {
                                text: modelData[1]
                                color: ThemeTokens.text
                                font.pixelSize: 12
                                width: 140
                                anchors.verticalCenter: parent.verticalCenter
                            }
                            Text {
                                text: modelData[2]
                                color: ThemeTokens.subduedText
                                font.pixelSize: 12
                                width: parent.width - 330
                                anchors.verticalCenter: parent.verticalCenter
                            }
                        }
                    }
                }
            }
        }
    }
}
