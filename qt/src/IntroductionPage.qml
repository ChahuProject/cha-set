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

        DocText {
            text: "Design Philosophy"
            textColor: ThemeTokens.text
            font.pixelSize: 18
            font.weight: Font.Bold
        }

        DocText {
            text: "ChaSet is part of the ChahuProject ecosystem. In traditional multi-platform apps, Web and Desktop design systems drift apart quickly. ChaSet solves this by establishing a neutral, machine-readable specification and token shard layer that drives both React and Qt simultaneously with pixel-perfect and behavioral parity."
            isMuted: true
            font.pixelSize: 13
            width: parent.width
        }

        Row {
            width: parent.width
            spacing: 14

            // Pillar 1
            ChaSetCard {
                width: (parent.width - 28) / 3
                implicitHeight: pillarItem1.implicitHeight
                customRadius: 10

                Item {
                    id: pillarItem1
                    width: parent.width
                    implicitHeight: col1.implicitHeight + 28

                    Column {
                        id: col1
                        anchors.fill: parent
                        anchors.margins: 14
                        spacing: 6
                        DocText { text: "🎯"; font.pixelSize: 22 }
                        DocText { text: "One Source of Truth"; textColor: ThemeTokens.text; font.pixelSize: 13; font.weight: Font.Bold }
                        DocText {
                            text: "Design tokens and API contracts reside in spec/ and emit synchronized tokens for Web & Qt."
                            isMuted: true
                            font.pixelSize: 11
                            width: parent.width
                        }
                    }
                }
            }

            // Pillar 2
            ChaSetCard {
                width: (parent.width - 28) / 3
                implicitHeight: pillarItem2.implicitHeight
                customRadius: 10

                Item {
                    id: pillarItem2
                    width: parent.width
                    implicitHeight: col2.implicitHeight + 28

                    Column {
                        id: col2
                        anchors.fill: parent
                        anchors.margins: 14
                        spacing: 6
                        DocText { text: "⚡"; font.pixelSize: 22 }
                        DocText { text: "Native Ergonomics"; textColor: ThemeTokens.text; font.pixelSize: 13; font.weight: Font.Bold }
                        DocText {
                            text: "Tailwind CSS v4 & Base UI on React; pure QML Quick Controls on Qt — no electron bloat or foreign wrappers."
                            isMuted: true
                            font.pixelSize: 11
                            width: parent.width
                        }
                    }
                }
            }

            // Pillar 3
            ChaSetCard {
                width: (parent.width - 28) / 3
                implicitHeight: pillarItem3.implicitHeight
                customRadius: 10

                Item {
                    id: pillarItem3
                    width: parent.width
                    implicitHeight: col3.implicitHeight + 28

                    Column {
                        id: col3
                        anchors.fill: parent
                        anchors.margins: 14
                        spacing: 6
                        DocText { text: "🔒"; font.pixelSize: 22 }
                        DocText { text: "Automated Parity Gate"; textColor: ThemeTokens.text; font.pixelSize: 13; font.weight: Font.Bold }
                        DocText {
                            text: "CI enforces that all required capabilities and visual rendering match 100% across stacks."
                            isMuted: true
                            font.pixelSize: 11
                            width: parent.width
                        }
                    }
                }
            }
        }
    }

    // Section 2: How It Works
    Column {
        width: parent.width
        spacing: 12

        DocText {
            text: "How It Works"
            textColor: ThemeTokens.text
            font.pixelSize: 18
            font.weight: Font.Bold
        }

        ChaSetCodeBlock {
            width: parent.width
            language: "structure"
            code: "spec/                     single source of truth\n  tokens/**               shards: colors, space, motion, typography\n  tokens.json             committed token snapshot\n  components/*.ts         component API contracts (zod schemas)\n  capabilities.json       capability manifest (must / should)\npackages/react/           React implementation (@chahu/cha-set)\nqt/                       Qt 6 / QML implementation (QtChaSetDemo)"
        }
    }

    // Section 3: Quick Start
    Column {
        width: parent.width
        spacing: 12

        DocText {
            text: "Quick Start"
            textColor: ThemeTokens.text
            font.pixelSize: 18
            font.weight: Font.Bold
        }

        DocText {
            text: "Install the package and peer dependencies:"
            isMuted: true
            font.pixelSize: 12
        }

        ChaSetCodeBlock {
            width: parent.width
            language: "bash"
            code: "pnpm add @chahu/cha-set"
        }

        DocText {
            text: "Use in your application:"
            isMuted: true
            font.pixelSize: 12
        }

        ChaSetCodeBlock {
            width: parent.width
            language: "qml"
            code: "import QtQuick 6.10\nimport ChaSet\n\nChaSetScrollArea {\n    width: 400\n    height: 300\n    showButtons: true\n\n    ChaSetButton {\n        variant: \"default\"\n        size: \"default\"\n        text: \"Launch Workspace\"\n        onClicked: console.log(\"Clicked!\")\n    }\n}"
        }
    }

    // Section 4: Packages
    Column {
        width: parent.width
        spacing: 12

        DocText {
            text: "Packages"
            textColor: ThemeTokens.text
            font.pixelSize: 18
            font.weight: Font.Bold
        }

        ChaSetTable {
            width: parent.width
            interactive: false
            columns: [
                { key: "pkg", title: "PACKAGE", width: 180, code: true },
                { key: "target", title: "TARGET", width: 140 },
                { key: "desc", title: "DESCRIPTION" }
            ]
            rows: [
                { pkg: "@chahu/cha-set", target: "React / Web", desc: "React component library published to npm." },
                { pkg: "QtChaSetDemo", target: "Qt 6 / C++ / QML", desc: "Qt reference implementation with native QML components." },
                { pkg: "@chahu/spec", target: "Internal Spec", desc: "Neutral token generator and contract schemas." }
            ]
        }
    }
}
