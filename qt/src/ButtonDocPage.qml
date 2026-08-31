// ButtonDocPage.qml — Comprehensive Button Documentation & Sandbox
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

    property string playgroundVariant: "primary"
    property string playgroundSize: "md"
    property string playgroundLabel: "Create Project"
    property bool playgroundLoading: false
    property bool playgroundDisabled: false
    property bool playgroundFullWidth: false
    property int playgroundClicks: 0
    property string codeTab: "qt" // "qt" | "react"

    property bool asyncLoading: false

    signal logAction(string msg)

    Timer {
        id: asyncTimer
        interval: 1500
        onTriggered: {
            root.asyncLoading = false
            root.logAction("Async action completed")
        }
    }

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
                Text { text: "Button"; color: root.cFg; font.pixelSize: 12; font.weight: Font.DemiBold }
            }

            Text {
                text: "Button"
                color: root.cFg
                font.pixelSize: 28
                font.weight: Font.Bold
            }

            Text {
                text: "A versatile button component with multiple variants, sizes, and states. Neutral contract implemented via @base-ui/react on Web and pure QML on Desktop."
                color: root.cMutedFg
                font.pixelSize: 14
                lineHeight: 1.4
                wrapMode: Text.WordWrap
                width: parent.width
            }

            Rectangle { width: parent.width; height: 1; color: root.cBorder }
        }

        // Section 1: Interactive Hero Sandbox
        Rectangle {
            width: parent.width
            height: sandboxCol.implicitHeight + 40
            radius: root.customRadius
            color: root.cCard
            border.color: root.cBorder
            border.width: 1

            Column {
                id: sandboxCol
                x: 20
                y: 18
                width: parent.width - 40
                spacing: 16

                Text { text: "Interactive Button Sandbox"; color: root.cFg; font.pixelSize: 16; font.weight: Font.Bold }

                // Controls & Stage Row
                Row {
                    spacing: 20
                    width: parent.width

                    // Left: Controls
                    Column {
                        width: 320
                        spacing: 12

                        // Variant Selector
                        Row {
                            spacing: 6
                            Repeater {
                                model: ["primary", "secondary", "ghost", "destructive"]
                                delegate: Rectangle {
                                    required property string modelData
                                    width: 72; height: 26
                                    radius: 4
                                    color: root.playgroundVariant === modelData ? root.cPrimary : root.cAccentBg
                                    Text { anchors.centerIn: parent; text: parent.modelData; color: root.playgroundVariant === parent.modelData ? "#ffffff" : root.cFg; font.pixelSize: 11 }
                                    MouseArea { anchors.fill: parent; cursorShape: Qt.PointingHandCursor; onClicked: root.playgroundVariant = parent.modelData }
                                }
                            }
                        }

                        // Size Selector
                        Row {
                            spacing: 6
                            Repeater {
                                model: ["sm", "md", "lg"]
                                delegate: Rectangle {
                                    required property string modelData
                                    width: 48; height: 26
                                    radius: 4
                                    color: root.playgroundSize === modelData ? root.cPrimary : root.cAccentBg
                                    Text { anchors.centerIn: parent; text: parent.modelData.toUpperCase(); color: root.playgroundSize === parent.modelData ? "#ffffff" : root.cFg; font.pixelSize: 11 }
                                    MouseArea { anchors.fill: parent; cursorShape: Qt.PointingHandCursor; onClicked: root.playgroundSize = parent.modelData }
                                }
                            }
                        }

                        // State Toggles
                        Row {
                            spacing: 12
                            CheckBox { id: cbLoad; checked: root.playgroundLoading; onToggled: root.playgroundLoading = checked }
                            Text { text: "Loading"; color: root.cFg; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
                            CheckBox { id: cbDis; checked: root.playgroundDisabled; onToggled: root.playgroundDisabled = checked }
                            Text { text: "Disabled"; color: root.cFg; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
                            CheckBox { id: cbFull; checked: root.playgroundFullWidth; onToggled: root.playgroundFullWidth = checked }
                            Text { text: "Full Width"; color: root.cFg; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
                        }
                    }

                    // Right: Stage Box
                    Rectangle {
                        width: parent.width - 340
                        height: 130
                        radius: root.customRadius
                        color: root.cAccentBg
                        border.color: root.cBorder

                        ChaSetButton {
                            anchors.centerIn: parent
                            variant: root.playgroundVariant
                            size: root.playgroundSize
                            text: root.playgroundLabel
                            loading: root.playgroundLoading
                            disabled: root.playgroundDisabled
                            fullWidth: root.playgroundFullWidth
                            onClicked: {
                                root.playgroundClicks++
                                root.logAction("Clicked sandbox button (" + root.playgroundClicks + ")")
                            }
                        }
                    }
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
                                    return 'ChaSetButton {\n    variant: "' + root.playgroundVariant + '"\n    size: "' + root.playgroundSize + '"\n    text: "' + root.playgroundLabel + '"' +
                                           (root.playgroundLoading ? '\n    loading: true' : '') +
                                           (root.playgroundDisabled ? '\n    disabled: true' : '') +
                                           (root.playgroundFullWidth ? '\n    fullWidth: true' : '') +
                                           '\n    onClicked: console.log("clicked")\n}';
                                }
                                return '<Button\n  variant="' + root.playgroundVariant + '"\n  size="' + root.playgroundSize + '"' +
                                       (root.playgroundLoading ? '\n  loading' : '') +
                                       (root.playgroundDisabled ? '\n  disabled' : '') +
                                       (root.playgroundFullWidth ? '\n  fullWidth' : '') +
                                       '\n>\n  ' + root.playgroundLabel + '\n</Button>';
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

        // Section 2: Variant × Size Matrix
        Column {
            width: parent.width
            spacing: 14

            Text { text: "Variant × Size Matrix"; color: root.cFg; font.pixelSize: 18; font.weight: Font.Bold }

            Grid {
                columns: 1
                rowSpacing: 12
                width: parent.width

                Repeater {
                    model: ["primary", "secondary", "ghost", "destructive"]
                    delegate: Row {
                        required property string modelData
                        spacing: 12
                        Text { text: modelData; color: root.cMutedFg; font.pixelSize: 12; font.family: "Consolas"; width: 90; anchors.verticalCenter: parent.verticalCenter }
                        ChaSetButton { variant: parent.modelData; size: "sm"; text: parent.modelData + " sm"; onClicked: root.logAction(modelData + " sm clicked") }
                        ChaSetButton { variant: parent.modelData; size: "md"; text: parent.modelData + " md"; onClicked: root.logAction(modelData + " md clicked") }
                        ChaSetButton { variant: parent.modelData; size: "lg"; text: parent.modelData + " lg"; onClicked: root.logAction(modelData + " lg clicked") }
                    }
                }
            }
        }

        // Section 3: Async Operation Simulation
        Column {
            width: parent.width
            spacing: 12

            Text { text: "Asynchronous Action Simulation"; color: root.cFg; font.pixelSize: 18; font.weight: Font.Bold }
            Text { text: "Click the button to simulate a 1.5-second async network operation:"; color: root.cMutedFg; font.pixelSize: 13 }

            Row {
                spacing: 12
                ChaSetButton {
                    variant: "primary"
                    size: "md"
                    text: root.asyncLoading ? "Submitting Request..." : "Trigger Async Task"
                    loading: root.asyncLoading
                    onClicked: {
                        root.asyncLoading = true
                        root.logAction("Started async simulation (1.5s)")
                        asyncTimer.start()
                    }
                }
                Text {
                    anchors.verticalCenter: parent.verticalCenter
                    text: root.asyncLoading ? "⏳ Processing on background thread..." : "Ready"
                    color: root.cMutedFg
                    font.pixelSize: 12
                }
            }
        }

        // Section 4: Props & API Reference Table
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
                        Rectangle { width: 140; height: 36; color: root.cAccentBg; Text { anchors.left: parent.left; anchors.leftMargin: 12; anchors.verticalCenter: parent.verticalCenter; text: "Property"; color: root.cMutedFg; font.pixelSize: 11; font.weight: Font.Bold } }
                        Rectangle { width: 180; height: 36; color: root.cAccentBg; Text { anchors.left: parent.left; anchors.leftMargin: 12; anchors.verticalCenter: parent.verticalCenter; text: "Type"; color: root.cMutedFg; font.pixelSize: 11; font.weight: Font.Bold } }
                        Rectangle { width: 120; height: 36; color: root.cAccentBg; Text { anchors.left: parent.left; anchors.leftMargin: 12; anchors.verticalCenter: parent.verticalCenter; text: "Default"; color: root.cMutedFg; font.pixelSize: 11; font.weight: Font.Bold } }
                        Rectangle { width: parent.width - 440; height: 36; color: root.cAccentBg; Text { anchors.left: parent.left; anchors.leftMargin: 12; anchors.verticalCenter: parent.verticalCenter; text: "Description"; color: root.cMutedFg; font.pixelSize: 11; font.weight: Font.Bold } }
                    }

                    // Props List
                    Repeater {
                        model: [
                            ["variant", "'primary' | 'secondary' | 'ghost' | 'destructive'", "'primary'", "Visual appearance preset"],
                            ["size", "'sm' | 'md' | 'lg'", "'md'", "Component dimensional scale"],
                            ["loading", "boolean", "false", "Displays spinner and suppresses user clicks"],
                            ["disabled", "boolean", "false", "Blocks all interaction and applies subdued styling"],
                            ["fullWidth", "boolean", "false", "Expands button width to 100% of container"]
                        ]
                        delegate: Row {
                            required property var modelData
                            width: parent.width
                            height: 40
                            Rectangle { width: 140; height: 40; color: "transparent"; Text { anchors.left: parent.left; anchors.leftMargin: 12; anchors.verticalCenter: parent.verticalCenter; text: parent.parent.modelData[0]; color: root.cPrimary; font.pixelSize: 12; font.family: "Consolas"; font.weight: Font.Bold } }
                            Rectangle { width: 180; height: 40; color: "transparent"; Text { anchors.left: parent.left; anchors.leftMargin: 12; anchors.verticalCenter: parent.verticalCenter; text: parent.parent.modelData[1]; color: root.cFg; font.pixelSize: 11; font.family: "Consolas" } }
                            Rectangle { width: 120; height: 40; color: "transparent"; Text { anchors.left: parent.left; anchors.leftMargin: 12; anchors.verticalCenter: parent.verticalCenter; text: parent.parent.modelData[2]; color: root.cMutedFg; font.pixelSize: 11; font.family: "Consolas" } }
                            Rectangle { width: parent.width - 440; height: 40; color: "transparent"; Text { anchors.left: parent.left; anchors.leftMargin: 12; anchors.verticalCenter: parent.verticalCenter; text: parent.parent.modelData[3]; color: root.cMutedFg; font.pixelSize: 11 } }
                        }
                    }
                }
            }
        }
    }
}
