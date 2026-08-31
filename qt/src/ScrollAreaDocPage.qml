// ScrollAreaDocPage.qml — Scroll Area Documentation & Showcase
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

        // Interactive Sandbox
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
                                model: 120
                                delegate: Rectangle {
                                    required property int index
                                    width: vertCol.width; height: 36; radius: 4
                                    color: index % 2 === 0 ? root.cCard : "transparent"
                                    border.color: root.cBorder; border.width: 0.5
                                    Row {
                                        anchors.fill: parent; anchors.margins: 8; spacing: 10
                                        Text { text: "v2.1.0-build." + (120 - parent.parent.index); color: root.cPrimary; font.pixelSize: 12; font.family: "Consolas"; font.weight: Font.Bold; width: 140 }
                                        Text { text: "Patch #" + (120 - parent.parent.index) + ": Synchronized cross-stack precision"; color: root.cMutedFg; font.pixelSize: 11; width: 340; elide: Text.ElideRight }
                                        Text { text: "2026-08-" + String((parent.parent.index % 28) + 1).padStart(2, '0'); color: root.cMutedFg; font.pixelSize: 11 }
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
                                model: 24
                                delegate: Rectangle {
                                    required property int index
                                    width: 200; height: 220; radius: 6
                                    color: root.cCard; border.color: root.cBorder
                                    Column {
                                        anchors.fill: parent; anchors.margins: 12; spacing: 8
                                        Text { text: "Feature #" + (parent.parent.index + 1); color: root.cPrimary; font.pixelSize: 11; font.weight: Font.Bold }
                                        Text { text: "Single Source of Truth"; color: root.cFg; font.pixelSize: 13; font.weight: Font.Bold }
                                        Text { text: "spec/tokens shards driving React and Qt synchronized builds."; color: root.cMutedFg; font.pixelSize: 11; wrapMode: Text.WordWrap; width: parent.width }
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
            }
        }
    }
}
