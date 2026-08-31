// ThemeTunerPage.qml — Live Interactive Theme Studio
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

    property string activeAccent: ""
    property string overridePrimary: ""
    property string overrideBackground: ""
    property string overrideCard: ""
    property string overrideDestructive: ""

    signal requestExport()
    signal logAction(string msg)

    Column {
        id: contentCol
        width: Math.min(parent.width, 820)
        spacing: 24

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
                Text { text: "Theme Studio"; color: root.cFg; font.pixelSize: 12; font.weight: Font.DemiBold }
                Rectangle {
                    width: 36; height: 18; radius: 9
                    color: Qt.rgba(root.cPrimary.r, root.cPrimary.g, root.cPrimary.b, 0.15)
                    Text { anchors.centerIn: parent; text: "Live"; color: root.cPrimary; font.pixelSize: 10; font.weight: Font.Bold }
                }
            }

            Text {
                text: "Theme Studio"
                color: root.cFg
                font.pixelSize: 28
                font.weight: Font.Bold
            }

            Text {
                text: "Fine-tune colors, corner radiuses, and theme accents with real-time live preview and multi-platform config export."
                color: root.cMutedFg
                font.pixelSize: 14
                lineHeight: 1.4
                wrapMode: Text.WordWrap
                width: parent.width
            }

            Rectangle { width: parent.width; height: 1; color: root.cBorder }
        }

        // Main Tuner Card
        Rectangle {
            width: parent.width
            height: tunerCol.implicitHeight + 36
            radius: root.customRadius
            color: root.cCard
            border.color: root.cBorder
            border.width: 1

            Column {
                id: tunerCol
                x: 20
                y: 18
                width: parent.width - 40
                spacing: 18

                // Header with Export button
                Row {
                    width: parent.width
                    Text { text: "🎨 Live Theme Controls"; color: root.cFg; font.pixelSize: 16; font.weight: Font.Bold }
                    Item { width: parent.width - 340; height: 1 }
                    ChaSetButton {
                        size: "sm"
                        variant: "primary"
                        text: "📋 Export Config"
                        onClicked: root.requestExport()
                    }
                }

                Rectangle { width: parent.width; height: 1; color: root.cBorder }

                // 1. Appearance Mode
                Column {
                    spacing: 6
                    Text { text: "APPEARANCE & MODE"; color: root.cMutedFg; font.pixelSize: 11; font.weight: Font.Bold }
                    Row {
                        spacing: 8
                        ChaSetButton {
                            variant: !ThemeTokens.dark ? "primary" : "secondary"
                            size: "sm"
                            text: "☀️ Light Mode"
                            onClicked: { ThemeTokens.dark = false; root.logAction("Switched to Light mode") }
                        }
                        ChaSetButton {
                            variant: ThemeTokens.dark ? "primary" : "secondary"
                            size: "sm"
                            text: "🌙 Dark Mode"
                            onClicked: { ThemeTokens.dark = true; root.logAction("Switched to Dark mode") }
                        }
                    }
                }

                // 2. Accent Presets (9 Presets)
                Column {
                    spacing: 6
                    Text { text: "ACCENT THEME PRESETS"; color: root.cMutedFg; font.pixelSize: 11; font.weight: Font.Bold }
                    Flow {
                        width: parent.width
                        spacing: 6
                        Repeater {
                            model: [
                                ["Default", "#30a0ff"], ["Slate", "#64748b"], ["Red", "#ef4444"],
                                ["Orange", "#f97316"], ["Yellow", "#eab308"], ["Green", "#22c55e"],
                                ["Blue", "#3b82f6"], ["Violet", "#8b5cf6"], ["Rose", "#f43f5e"]
                            ]
                            delegate: Rectangle {
                                required property var modelData
                                width: chipRow.implicitWidth + 18
                                height: 26
                                radius: 13
                                color: root.activeAccent === modelData[0] ? Qt.rgba(root.cPrimary.r, root.cPrimary.g, root.cPrimary.b, 0.15) : root.cCard
                                border.color: root.activeAccent === modelData[0] ? root.cPrimary : root.cBorder
                                border.width: root.activeAccent === modelData[0] ? 1.5 : 1

                                Row {
                                    id: chipRow
                                    anchors.centerIn: parent
                                    spacing: 5
                                    Rectangle { width: 8; height: 8; radius: 4; color: parent.parent.modelData[1]; anchors.verticalCenter: parent.verticalCenter }
                                    Text { text: parent.parent.modelData[0]; color: root.cFg; font.pixelSize: 11; font.weight: Font.Medium; anchors.verticalCenter: parent.verticalCenter }
                                }

                                MouseArea {
                                    anchors.fill: parent
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: {
                                        root.activeAccent = parent.modelData[0]
                                        root.overridePrimary = parent.modelData[1]
                                        root.logAction("Accent preset: " + parent.modelData[0])
                                    }
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
                        Text { text: "CORNER RADIUS (--RADIUS)"; color: root.cMutedFg; font.pixelSize: 11; font.weight: Font.Bold }
                        Item { width: parent.width - 290; height: 1 }
                        Text {
                            text: root.customRadius === 8 ? "0.5rem (Default)" : (root.customRadius + "px")
                            color: root.cMutedFg
                            font.pixelSize: 11
                            font.family: "Consolas, monospace"
                        }
                    }

                    Rectangle {
                        width: parent.width
                        height: 8
                        radius: 4
                        color: root.cAccentBg
                        border.color: root.cBorder

                        Rectangle {
                            width: (root.customRadius / 24) * parent.width
                            height: parent.height
                            radius: 4
                            color: root.cPrimary
                        }

                        Rectangle {
                            x: (root.customRadius / 24) * (parent.width - 16)
                            anchors.verticalCenter: parent.verticalCenter
                            width: 16; height: 16; radius: 8
                            color: root.cPrimary
                            border.color: "#ffffff"
                            border.width: 2
                        }

                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onPositionChanged: (mouse) => {
                                if (pressed) {
                                    let frac = Math.max(0, Math.min(1, mouse.x / width))
                                    root.customRadius = Math.round(frac * 24)
                                }
                            }
                            onClicked: (mouse) => {
                                let frac = Math.max(0, Math.min(1, mouse.x / width))
                                root.customRadius = Math.round(frac * 24)
                            }
                        }
                    }
                }
            }
        }

        // Section 2: Live Sandbox Stage
        Column {
            width: parent.width
            spacing: 12

            Text { text: "Live Component Sandbox"; color: root.cFg; font.pixelSize: 18; font.weight: Font.Bold }
            Text { text: "Interact with components rendering live under your current style settings:"; color: root.cMutedFg; font.pixelSize: 13 }

            Rectangle {
                width: parent.width
                height: 200
                radius: root.customRadius
                color: root.cCard
                border.color: root.cBorder

                Row {
                    anchors.centerIn: parent
                    spacing: 24

                    Column {
                        spacing: 12
                        Text { text: "Buttons"; color: root.cMutedFg; font.pixelSize: 12; font.weight: Font.Bold }
                        Row {
                            spacing: 8
                            ChaSetButton { variant: "primary"; size: "md"; text: "Primary Action"; onClicked: root.logAction("Clicked sandbox primary") }
                            ChaSetButton { variant: "secondary"; size: "md"; text: "Secondary"; onClicked: root.logAction("Clicked sandbox secondary") }
                            ChaSetButton { variant: "destructive"; size: "md"; text: "Danger"; onClicked: root.logAction("Clicked sandbox danger") }
                        }
                    }

                    Rectangle { width: 1; height: 120; color: root.cBorder; anchors.verticalCenter: parent.verticalCenter }

                    Column {
                        spacing: 12
                        Text { text: "Mini Scroll Viewport"; color: root.cMutedFg; font.pixelSize: 12; font.weight: Font.Bold }
                        ChaSetScrollView {
                            width: 260
                            height: 100
                            showButtons: true
                            contentWidth: 240
                            contentHeight: 300

                            Column {
                                spacing: 4
                                Repeater {
                                    model: 10
                                    delegate: Rectangle {
                                        required property int index
                                        width: 240; height: 24; radius: 4; color: root.cAccentBg
                                        Text { anchors.centerIn: parent; text: "Item #" + (parent.index + 1); color: root.cFg; font.pixelSize: 11 }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
