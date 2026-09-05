// ThemeTunerPage.qml — Live Interactive Theme Studio matching React 1:1
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Get Started"
    pageTitle: "Theme Studio"
    description: "Live interactive theme tuner. Fine-tune colors, radiuses, and accents with real-time feedback and one-click config export."
    tocItems: [
        { id: "tuner", title: "Theme Controls" },
        { id: "playground", title: "Live Sandbox" }
    ]

    property int customRadius: 8
    property color cFg: ThemeTokens.text
    property color cMutedFg: ThemeTokens.subduedText
    property color cCard: ThemeTokens.panel
    property color cBorder: ThemeTokens.border
    property color cPrimary: ThemeTokens.accent
    property color cAccentBg: ThemeTokens.hover

    property string activeAccent: ""
    property string overridePrimary: ""
    property string overrideBackground: ""
    property string overrideCard: ""
    property string overrideDestructive: ""

    signal requestExport()
    signal logAction(string msg)

    // Section 1: Theme Controls
    Column {
        width: parent.width
        spacing: 14

        Rectangle {
            width: parent.width
            implicitHeight: tunerCol.implicitHeight + 36
            radius: root.customRadius
            color: ThemeTokens.panel
            border.color: ThemeTokens.border
            border.width: 1

            Column {
                id: tunerCol
                x: 20
                y: 18
                width: parent.width - 40
                spacing: 18

                // Header
                Row {
                    width: parent.width
                    Row {
                        spacing: 8
                        Text { text: "🎨"; font.pixelSize: 16; anchors.verticalCenter: parent.verticalCenter }
                        Text { text: "Theme & Style Tuner"; color: ThemeTokens.text; font.pixelSize: 15; font.weight: Font.Bold; anchors.verticalCenter: parent.verticalCenter }
                    }

                    Item { width: Math.max(10, parent.width - 340); height: 1 }

                    Row {
                        spacing: 8
                        ChaSetButton {
                            visible: root.activeAccent !== "" || root.customRadius !== 8
                            size: "sm"
                            variant: "outline"
                            text: "Reset"
                            onClicked: {
                                root.activeAccent = ""
                                root.customRadius = 8
                                ThemeTokens.dark = false
                            }
                        }

                        ChaSetButton {
                            size: "sm"
                            variant: "default"
                            text: "📋 Copy Config"
                            onClicked: root.requestExport()
                        }
                    }
                }

                Rectangle { width: parent.width; height: 1; color: ThemeTokens.border }

                // 1. Appearance & Mode
                Column {
                    spacing: 6
                    Text { text: "APPEARANCE & MODE"; color: ThemeTokens.subduedText; font.pixelSize: 11; font.weight: Font.Bold; font.letterSpacing: 0.5 }
                    Row {
                        spacing: 8
                        ChaSetButton {
                            size: "sm"
                            variant: !ThemeTokens.dark ? "default" : "outline"
                            text: "☀️ Light"
                            onClicked: ThemeTokens.dark = false
                        }

                        ChaSetButton {
                            size: "sm"
                            variant: ThemeTokens.dark ? "default" : "outline"
                            text: "🌙 Dark"
                            onClicked: ThemeTokens.dark = true
                        }
                    }
                }

                // 2. Accent Presets (9 Presets)
                Column {
                    spacing: 6
                    Text { text: "ACCENT THEME PRESET"; color: ThemeTokens.subduedText; font.pixelSize: 11; font.weight: Font.Bold; font.letterSpacing: 0.5 }
                    Flow {
                        width: parent.width
                        spacing: 6
                        Repeater {
                            model: [
                                ["Default", "#30a0ff"], ["Slate", "#64748b"], ["Red", "#ef4444"],
                                ["Orange", "#f97316"], ["Yellow", "#eab308"], ["Green", "#22c55e"],
                                ["Blue", "#3b82f6"], ["Violet", "#8b5cf6"], ["Rose", "#f43f5e"]
                            ]
                            delegate: ChaSetButton {
                                required property var modelData
                                size: "sm"
                                variant: root.activeAccent === modelData[0] ? "default" : "outline"
                                text: "● " + modelData[0]
                                onClicked: {
                                    root.activeAccent = modelData[0]
                                    root.logAction("Accent preset: " + modelData[0])
                                }
                            }
                        }
                    }
                }

                // 3. Corner Radius Slider
                Column {
                    width: parent.width
                    spacing: 6
                    Row {
                        width: parent.width
                        Text { text: "CORNER RADIUS (--RADIUS)"; color: ThemeTokens.subduedText; font.pixelSize: 11; font.weight: Font.Bold; font.letterSpacing: 0.5 }
                        Item { width: Math.max(10, parent.width - 320); height: 1 }
                        Text {
                            text: root.customRadius === 8 ? "0.5rem (Default)" : (root.customRadius + "px")
                            color: ThemeTokens.accent
                            font.pixelSize: 11
                            font.family: "Consolas, monospace"
                            font.weight: Font.Bold
                        }
                    }

                    Rectangle {
                        width: parent.width
                        height: 8
                        radius: 4
                        color: ThemeTokens.hover
                        border.color: ThemeTokens.border

                        Rectangle {
                            width: Math.max(8, (root.customRadius / 24) * parent.width)
                            height: parent.height
                            radius: 4
                            color: ThemeTokens.accent
                        }

                        Rectangle {
                            x: Math.max(0, Math.min(parent.width - 16, (root.customRadius / 24) * (parent.width - 16)))
                            anchors.verticalCenter: parent.verticalCenter
                            width: 16; height: 16; radius: 8
                            color: ThemeTokens.accent
                            border.color: "#ffffff"
                            border.width: 2
                        }

                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onPositionChanged: (mouse) => {
                                if (pressed) {
                                    let frac = Math.max(0, Math.min(1, mouse.x / width))
                                    root.customRadius = Math.round(frac * 12) * 2
                                }
                            }
                            onClicked: (mouse) => {
                                let frac = Math.max(0, Math.min(1, mouse.x / width))
                                root.customRadius = Math.round(frac * 12) * 2
                            }
                        }
                    }

                    Row {
                        width: parent.width
                        Text { text: "0px (Sharp)"; color: ThemeTokens.subduedText; font.pixelSize: 10 }
                        Item { width: parent.width - 240; height: 1 }
                        Text { text: "8px"; color: ThemeTokens.subduedText; font.pixelSize: 10 }
                        Item { width: 50; height: 1 }
                        Text { text: "16px"; color: ThemeTokens.subduedText; font.pixelSize: 10 }
                        Item { width: 50; height: 1 }
                        Text { text: "24px (Pill)"; color: ThemeTokens.subduedText; font.pixelSize: 10 }
                    }
                }
            }
        }
    }

    // Section 2: Live Sandbox Stage
    Column {
        width: parent.width
        spacing: 12

        Column {
            spacing: 4
            Text { text: "Live Component Sandbox"; color: ThemeTokens.text; font.pixelSize: 18; font.weight: Font.Bold }
            Text { text: "Interact with components rendering live under your current style settings:"; color: ThemeTokens.subduedText; font.pixelSize: 13 }
        }

        Rectangle {
            width: parent.width
            implicitHeight: sandboxRow.implicitHeight + 36
            radius: root.customRadius
            color: ThemeTokens.panel
            border.color: ThemeTokens.border
            border.width: 1

            Row {
                id: sandboxRow
                x: 20
                y: 18
                width: parent.width - 40
                spacing: 24

                // Buttons Column
                Column {
                    spacing: 12
                    Text { text: "BUTTONS"; color: ThemeTokens.subduedText; font.pixelSize: 11; font.weight: Font.Bold; font.letterSpacing: 0.5 }
                    Row {
                        spacing: 8
                        ChaSetButton { variant: "default"; size: "default"; text: "Default Action"; onClicked: root.logAction("Clicked sandbox default") }
                        ChaSetButton { variant: "outline"; size: "default"; text: "Outline"; onClicked: root.logAction("Clicked sandbox outline") }
                        ChaSetButton { variant: "secondary"; size: "default"; text: "Secondary"; onClicked: root.logAction("Clicked sandbox secondary") }
                        ChaSetButton { variant: "destructive"; size: "default"; text: "Danger"; onClicked: root.logAction("Clicked sandbox danger") }
                    }
                    Row {
                        spacing: 8
                        ChaSetButton { variant: "ghost"; size: "sm"; text: "Ghost Action" }
                        ChaSetButton { variant: "link"; size: "sm"; text: "Link Action" }
                        ChaSetButton { variant: "default"; size: "sm"; text: "Saving..."; loading: true }
                        ChaSetButton { variant: "secondary"; size: "sm"; text: "Disabled"; disabled: true }
                    }
                }

                Rectangle { width: 1; height: 120; color: ThemeTokens.border; anchors.verticalCenter: parent.verticalCenter }

                // Mini Scroll Viewport Column
                Column {
                    spacing: 12
                    Text { text: "MINI SCROLL VIEWPORT"; color: ThemeTokens.subduedText; font.pixelSize: 11; font.weight: Font.Bold; font.letterSpacing: 0.5 }
                    ChaSetScrollArea {
                        width: 240
                        height: 100
                        showButtons: true
                        contentWidth: 220
                        contentHeight: 280
                        clip: true

                        Column {
                            spacing: 4
                            Repeater {
                                model: 10
                                delegate: Rectangle {
                                    required property int index
                                    width: 220; height: 24; radius: 4; color: ThemeTokens.hover
                                    Text { anchors.centerIn: parent; text: "Item #" + (index + 1); color: ThemeTokens.text; font.pixelSize: 11 }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
