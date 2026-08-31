// ScrollAreaDocPage.qml — Comprehensive Scroll Area Documentation & Showcase
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

    property string scrollDemoMode: "vertical"
    property bool scrollShowButtons: true
    property bool scrollSmooth: true
    property int scrollHitSize: 8
    property string codeTab: "qt" // "qt" | "react"

    signal logAction(string msg)

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
                Text { text: "Components"; color: root.cMutedFg; font.pixelSize: 12 }
                Text { text: "/"; color: root.cMutedFg; font.pixelSize: 12 }
                Text { text: "Scroll Area"; color: root.cFg; font.pixelSize: 12; font.weight: Font.DemiBold }
                Rectangle {
                    width: 36; height: 18; radius: 9
                    color: Qt.rgba(root.cPrimary.r, root.cPrimary.g, root.cPrimary.b, 0.15)
                    Text { anchors.centerIn: parent; text: "New"; color: root.cPrimary; font.pixelSize: 10; font.weight: Font.Bold }
                }
            }

            Text {
                text: "Scroll Area"
                color: root.cFg
                font.pixelSize: 28
                font.weight: Font.Bold
            }

            Text {
                text: "Custom scrollable container with dynamic hot-zone expansion (0.5rem), accurate track-click jump, and interactive stepper navigation."
                color: root.cMutedFg
                font.pixelSize: 14
                lineHeight: 1.4
                wrapMode: Text.WordWrap
                width: parent.width
            }

            Rectangle { width: parent.width; height: 1; color: root.cBorder }
        }

        // Section 1: Interactive Sandbox
        Rectangle {
            width: parent.width
            height: scrollSandboxCol.implicitHeight + 40
            radius: root.customRadius
            color: root.cCard
            border.color: root.cBorder
            border.width: 1

            Column {
                id: scrollSandboxCol
                x: 20
                y: 18
                width: parent.width - 40
                spacing: 16

                // Mode Tabs & Controls
                Row {
                    width: parent.width
                    spacing: 12

                    Row {
                        spacing: 6
                        Repeater {
                            model: [
                                ["Vertical List (120 Logs)", "vertical"],
                                ["Horizontal Cards (24 Cards)", "horizontal"],
                                ["Dual-Axis (100x8 Grid)", "both"]
                            ]
                            delegate: Rectangle {
                                required property var modelData
                                width: tabText.implicitWidth + 24
                                height: 28
                                radius: 4
                                color: root.scrollDemoMode === modelData[1] ? root.cPrimary : root.cAccentBg
                                Text { id: tabText; anchors.centerIn: parent; text: parent.modelData[0]; color: root.scrollDemoMode === parent.modelData[1] ? "#ffffff" : root.cFg; font.pixelSize: 12 }
                                MouseArea { anchors.fill: parent; cursorShape: Qt.PointingHandCursor; onClicked: root.scrollDemoMode = parent.modelData[1] }
                            }
                        }
                    }

                    Item { width: parent.width - 640; height: 1 }

                    Row {
                        spacing: 8
                        anchors.verticalCenter: parent.verticalCenter
                        CheckBox { checked: root.scrollShowButtons; onToggled: root.scrollShowButtons = checked }
                        Text { text: "Steppers"; color: root.cFg; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
                        CheckBox { checked: root.scrollSmooth; onToggled: root.scrollSmooth = checked }
                        Text { text: "Smooth"; color: root.cFg; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
                    }
                }

                // Stage Area
                Rectangle {
                    width: parent.width
                    height: 280
                    radius: root.customRadius
                    color: ThemeTokens.background
                    border.color: root.cBorder
                    clip: true

                    // Vertical 120 Logs
                    ChaSetScrollView {
                        id: demoScrollVert
                        visible: root.scrollDemoMode === "vertical"
                        anchors.fill: parent
                        anchors.margins: 4
                        showButtons: root.scrollShowButtons
                        smoothScroll: root.scrollSmooth
                        hitSize: root.scrollHitSize
                        contentWidth: parent.width - 20
                        contentHeight: vertCol.implicitHeight + 16

                        Column {
                            id: vertCol
                            x: 8; y: 8; width: parent.width - 16; spacing: 6
                            Repeater {
                                model: ShowcaseData.changelog
                                delegate: Rectangle {
                                    required property var modelData
                                    required property int index
                                    width: vertCol.width; height: 36; radius: 4
                                    color: index % 2 === 0 ? root.cCard : "transparent"
                                    border.color: root.cBorder; border.width: 0.5
                                    Row {
                                        anchors.fill: parent; anchors.margins: 8; spacing: 10
                                        Text { text: parent.parent.modelData.version; color: root.cPrimary; font.pixelSize: 12; font.family: "Consolas"; font.weight: Font.Bold; width: 140 }
                                        Text { text: parent.parent.modelData.summary; color: root.cMutedFg; font.pixelSize: 11; width: 340; elide: Text.ElideRight }
                                        Text { text: parent.parent.modelData.date; color: root.cMutedFg; font.pixelSize: 11 }
                                    }
                                }
                            }
                        }
                    }

                    // Horizontal 24 Cards
                    ChaSetScrollView {
                        id: demoScrollHoriz
                        visible: root.scrollDemoMode === "horizontal"
                        anchors.fill: parent
                        anchors.margins: 10
                        showVerticalScrollBar: false
                        showHorizontalScrollBar: true
                        showButtons: root.scrollShowButtons
                        smoothScroll: root.scrollSmooth
                        hitSize: root.scrollHitSize
                        contentWidth: horizRow.implicitWidth + 24
                        contentHeight: parent.height - 20

                        Row {
                            id: horizRow
                            spacing: 10; height: parent.height - 20
                            Repeater {
                                model: ShowcaseData.featureCards
                                delegate: Rectangle {
                                    required property var modelData
                                    required property int index
                                    width: 200; height: 220; radius: 6
                                    color: root.cCard; border.color: root.cBorder
                                    Column {
                                        anchors.fill: parent; anchors.margins: 12; spacing: 8
                                        Row {
                                            spacing: 6
                                            Text { text: parent.parent.parent.modelData.icon; font.pixelSize: 14 }
                                            Text { text: parent.parent.parent.modelData.badge; color: root.cPrimary; font.pixelSize: 11; font.weight: Font.Bold }
                                        }
                                        Text { text: parent.parent.modelData.title; color: root.cFg; font.pixelSize: 13; font.weight: Font.Bold }
                                        Text { text: parent.parent.modelData.desc; color: root.cMutedFg; font.pixelSize: 11; wrapMode: Text.WordWrap; width: parent.width }
                                    }
                                }
                            }
                        }
                    }

                    // Dual-Axis 2D Matrix
                    ChaSetScrollView {
                        id: demoScrollBoth
                        visible: root.scrollDemoMode === "both"
                        anchors.fill: parent
                        anchors.margins: 4
                        showVerticalScrollBar: true
                        showHorizontalScrollBar: true
                        showButtons: root.scrollShowButtons
                        smoothScroll: root.scrollSmooth
                        hitSize: root.scrollHitSize
                        contentWidth: 900
                        contentHeight: 1800

                        Column {
                            x: 8; y: 8; spacing: 4
                            Repeater {
                                model: 100
                                delegate: Row {
                                    required property int index
                                    spacing: 6
                                    Rectangle { width: 60; height: 26; color: root.cCard; border.color: root.cBorder; Text { anchors.centerIn: parent; text: "#" + (parent.parent.index + 1); color: root.cMutedFg; font.pixelSize: 11 } }
                                    Rectangle { width: 280; height: 26; color: root.cCard; border.color: root.cBorder; Text { anchors.left: parent.left; anchors.leftMargin: 8; anchors.verticalCenter: parent.verticalCenter; text: "Cross-stack matrix test item #" + (parent.parent.index + 1); color: root.cFg; font.pixelSize: 11 } }
                                    Rectangle { width: 120; height: 26; color: root.cCard; border.color: root.cBorder; Text { anchors.centerIn: parent; text: "React & Qt"; color: root.cPrimary; font.pixelSize: 11 } }
                                    Rectangle { width: 100; height: 26; color: root.cCard; border.color: root.cBorder; Text { anchors.centerIn: parent; text: "Verified"; color: "#22c55e"; font.pixelSize: 11 } }
                                    Rectangle { width: 100; height: 26; color: root.cCard; border.color: root.cBorder; Text { anchors.centerIn: parent; text: "8px / 0.5rem"; color: root.cMutedFg; font.pixelSize: 11 } }
                                }
                            }
                        }
                    }
                }

                // Action Buttons
                Row {
                    spacing: 8
                    Text { text: "Quick Jump:"; color: root.cMutedFg; font.pixelSize: 11; font.weight: Font.Bold; anchors.verticalCenter: parent.verticalCenter }
                    ChaSetButton { size: "sm"; variant: "secondary"; text: "⇡ To Top"; onClicked: { if (root.scrollDemoMode === "vertical") demoScrollVert.scrollToTop(); else if (root.scrollDemoMode === "horizontal") demoScrollHoriz.scrollToLeft(); else demoScrollBoth.scrollToTop(); } }
                    ChaSetButton { size: "sm"; variant: "secondary"; text: "▴ Page Up"; onClicked: { if (root.scrollDemoMode === "vertical") demoScrollVert.pageUp(); else if (root.scrollDemoMode === "horizontal") demoScrollHoriz.pageLeft(); else demoScrollBoth.pageUp(); } }
                    ChaSetButton { size: "sm"; variant: "secondary"; text: "▾ Page Down"; onClicked: { if (root.scrollDemoMode === "vertical") demoScrollVert.pageDown(); else if (root.scrollDemoMode === "horizontal") demoScrollHoriz.pageRight(); else demoScrollBoth.pageDown(); } }
                    ChaSetButton { size: "sm"; variant: "secondary"; text: "⇣ To Bottom"; onClicked: { if (root.scrollDemoMode === "vertical") demoScrollVert.scrollToBottom(); else if (root.scrollDemoMode === "horizontal") demoScrollHoriz.scrollToRight(); else demoScrollBoth.scrollToBottom(); } }
                }

                // Live Code Box (QML / React JSX)
                Column {
                    width: parent.width
                    spacing: 6

                    Row {
                        spacing: 8
                        Rectangle {
                            width: 80; height: 24; radius: 4
                            color: root.codeTab === "qt" ? root.cPrimary : root.cAccentBg
                            Text { anchors.centerIn: parent; text: "Qt QML"; color: root.codeTab === "qt" ? "#ffffff" : root.cFg; font.pixelSize: 11; font.weight: Font.DemiBold }
                            MouseArea { anchors.fill: parent; cursorShape: Qt.PointingHandCursor; onClicked: root.codeTab = "qt" }
                        }
                        Rectangle {
                            width: 80; height: 24; radius: 4
                            color: root.codeTab === "react" ? root.cPrimary : root.cAccentBg
                            Text { anchors.centerIn: parent; text: "React JSX"; color: root.codeTab === "react" ? "#ffffff" : root.cFg; font.pixelSize: 11; font.weight: Font.DemiBold }
                            MouseArea { anchors.fill: parent; cursorShape: Qt.PointingHandCursor; onClicked: root.codeTab = "react" }
                        }
                    }

                    Rectangle {
                        width: parent.width
                        height: 110
                        radius: 4
                        color: ThemeTokens.background
                        border.color: root.cBorder

                        TextArea {
                            anchors.fill: parent
                            anchors.margins: 10
                            readOnly: true
                            text: {
                                if (root.codeTab === "qt") {
                                    return 'ChaSetScrollView {\n    width: 400\n    height: 300\n    showButtons: ' + root.scrollShowButtons + '\n    smoothScroll: ' + root.scrollSmooth + '\n\n    // Child Content View\n}';
                                }
                                return '<ScrollArea\n  showButtons={' + root.scrollShowButtons + '}\n  smoothScroll={' + root.scrollSmooth + '}\n  className="h-72 w-full"\n>\n  {/* Child Content View */}\n</ScrollArea>';
                            }
                            color: root.cFg
                            font.family: "Consolas, monospace"
                            font.pixelSize: 11
                            background: null
                        }
                    }
                }
            }
        }

        // Section 2: Feature Matrix Cards
        Column {
            width: parent.width
            spacing: 14

            Text { text: "Architecture Highlights"; color: root.cFg; font.pixelSize: 18; font.weight: Font.Bold }

            Grid {
                columns: 3
                columnSpacing: 14
                width: parent.width

                Rectangle {
                    width: (parent.width - 28) / 3; height: 110; radius: root.customRadius; color: root.cCard; border.color: root.cBorder
                    Column {
                        anchors.fill: parent; anchors.margins: 12; spacing: 4
                        Text { text: "🔥 Hot-Zone Expansion"; color: root.cPrimary; font.pixelSize: 12; font.weight: Font.Bold }
                        Text { text: "8px hit zone dynamically expands on hover without shifting inner layout content."; color: root.cMutedFg; font.pixelSize: 11; wrapMode: Text.WordWrap; width: parent.width }
                    }
                }
                Rectangle {
                    width: (parent.width - 28) / 3; height: 110; radius: root.customRadius; color: root.cCard; border.color: root.cBorder
                    Column {
                        anchors.fill: parent; anchors.margins: 12; spacing: 4
                        Text { text: "⚓ Stepper Clearance"; color: root.cPrimary; font.pixelSize: 12; font.weight: Font.Bold }
                        Text { text: "Thumb travels strictly on dedicated runway between top and bottom stepper button clusters."; color: root.cMutedFg; font.pixelSize: 11; wrapMode: Text.WordWrap; width: parent.width }
                    }
                }
                Rectangle {
                    width: (parent.width - 28) / 3; height: 110; radius: root.customRadius; color: root.cCard; border.color: root.cBorder
                    Column {
                        anchors.fill: parent; anchors.margins: 12; spacing: 4
                        Text { text: "🖥️ Desktop Wheel Ready"; color: root.cPrimary; font.pixelSize: 12; font.weight: Font.Bold }
                        Text { text: "Native WheelHandler delivers smooth step animations on Windows, macOS, and Linux."; color: root.cMutedFg; font.pixelSize: 11; wrapMode: Text.WordWrap; width: parent.width }
                    }
                }
            }
        }

        // Section 3: Props & API Reference Table
        Column {
            width: parent.width
            spacing: 12

            Text { text: "API Reference"; color: root.cFg; font.pixelSize: 18; font.weight: Font.Bold }

            Rectangle {
                width: parent.width
                height: 240
                radius: root.customRadius
                color: root.cCard
                border.color: root.cBorder
                clip: true

                Column {
                    anchors.fill: parent

                    // Header
                    Row {
                        width: parent.width
                        height: 36
                        Rectangle { width: 180; height: 36; color: root.cAccentBg; Text { anchors.left: parent.left; anchors.leftMargin: 12; anchors.verticalCenter: parent.verticalCenter; text: "Property"; color: root.cMutedFg; font.pixelSize: 11; font.weight: Font.Bold } }
                        Rectangle { width: 140; height: 36; color: root.cAccentBg; Text { anchors.left: parent.left; anchors.leftMargin: 12; anchors.verticalCenter: parent.verticalCenter; text: "Type"; color: root.cMutedFg; font.pixelSize: 11; font.weight: Font.Bold } }
                        Rectangle { width: 120; height: 36; color: root.cAccentBg; Text { anchors.left: parent.left; anchors.leftMargin: 12; anchors.verticalCenter: parent.verticalCenter; text: "Default"; color: root.cMutedFg; font.pixelSize: 11; font.weight: Font.Bold } }
                        Rectangle { width: parent.width - 440; height: 36; color: root.cAccentBg; Text { anchors.left: parent.left; anchors.leftMargin: 12; anchors.verticalCenter: parent.verticalCenter; text: "Description"; color: root.cMutedFg; font.pixelSize: 11; font.weight: Font.Bold } }
                    }

                    // Props List
                    Repeater {
                        model: [
                            ["showVerticalScrollBar", "boolean", "true", "Controls vertical scrollbar visibility"],
                            ["showHorizontalScrollBar", "boolean", "false", "Controls horizontal scrollbar visibility"],
                            ["showButtons", "boolean", "true", "Enables navigation stepper button clusters"],
                            ["smoothScroll", "boolean", "true", "Animates pagination and jump actions smoothly"],
                            ["hitSize", "int", "8", "Pixel width/height of outer mouse hot-zone"]
                        ]
                        delegate: Row {
                            required property var modelData
                            width: parent.width
                            height: 40
                            Rectangle { width: 180; height: 40; color: "transparent"; Text { anchors.left: parent.left; anchors.leftMargin: 12; anchors.verticalCenter: parent.verticalCenter; text: parent.parent.modelData[0]; color: root.cPrimary; font.pixelSize: 12; font.family: "Consolas"; font.weight: Font.Bold } }
                            Rectangle { width: 140; height: 40; color: "transparent"; Text { anchors.left: parent.left; anchors.leftMargin: 12; anchors.verticalCenter: parent.verticalCenter; text: parent.parent.modelData[1]; color: root.cFg; font.pixelSize: 11; font.family: "Consolas" } }
                            Rectangle { width: 120; height: 40; color: "transparent"; Text { anchors.left: parent.left; anchors.leftMargin: 12; anchors.verticalCenter: parent.verticalCenter; text: parent.parent.modelData[2]; color: root.cMutedFg; font.pixelSize: 11; font.family: "Consolas" } }
                            Rectangle { width: parent.width - 440; height: 40; color: "transparent"; Text { anchors.left: parent.left; anchors.leftMargin: 12; anchors.verticalCenter: parent.verticalCenter; text: parent.parent.modelData[3]; color: root.cMutedFg; font.pixelSize: 11 } }
                        }
                    }
                }
            }
        }
    }
}
