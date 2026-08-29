import QtQuick 6.10
import QtQuick.Controls 6.10
import chaSet

// ChaSet Qt Showcase & Theme Workbench
// Consumes the generated ThemeTokens singleton (spec/tokens.json, dunting preset).
// Supports live runtime style tuning, component matrix preview, and copyable exports.
ApplicationWindow {
    id: win
    width: 960
    height: 1120
    visible: true
    title: "ChaSet Qt Studio & Component Showcase"
    color: ThemeTokens.background

    property string lastClick: "Ready."
    property string activeAccent: "Default"
    property int customRadius: ThemeTokens.panelRadius
    property color activePrimaryColor: ThemeTokens.accent

    function push(msg) { lastClick = msg }

    Component.onCompleted: if (startupLight === true) ThemeTokens.dark = false

    // ---- Inline Card component ----
    component Card: Rectangle {
        id: cardRoot
        property string title
        property string subtitle: ""
        default property alias contentData: contentCol.data
        radius: win.customRadius
        color: ThemeTokens.panel
        border.color: ThemeTokens.border
        border.width: 1
        implicitWidth: contentCol.implicitWidth + 32
        implicitHeight: contentCol.implicitHeight + 48

        Column {
            id: contentCol
            x: 16
            y: 14
            spacing: 12
            Text {
                text: cardRoot.title
                color: ThemeTokens.text
                font.pixelSize: ThemeTokens.fontSizeHeading
                font.weight: Font.DemiBold
            }
            Text {
                visible: cardRoot.subtitle.length > 0
                text: cardRoot.subtitle
                color: ThemeTokens.subduedText
                font.pixelSize: ThemeTokens.fontSizeSmall
            }
        }
    }

    component SwatchItem: Column {
        property string tokenName
        property string label
        spacing: 4
        Rectangle {
            width: 130
            height: 38
            radius: win.customRadius > 4 ? 4 : win.customRadius
            color: ThemeTokens.color(tokenName)
            border.color: ThemeTokens.border
        }
        Text {
            text: tokenName
            color: ThemeTokens.text
            font.pixelSize: ThemeTokens.fontSizeSmall
            font.family: "Consolas"
        }
        Text {
            text: label
            color: ThemeTokens.subduedText
            font.pixelSize: ThemeTokens.fontSizeSmall
        }
    }

    ScrollView {
        anchors.fill: parent
        contentWidth: mainCol.width + 40
        contentHeight: mainCol.height + 40
        clip: true

        Column {
            id: mainCol
            x: 20
            y: 20
            width: win.width - 60
            spacing: 18

            // ---- Top Header & Quick Presets ----
            Row {
                width: parent.width
                spacing: 12

                Text {
                    text: "🍵 ChaSet Qt Studio"
                    color: ThemeTokens.text
                    font.pixelSize: ThemeTokens.fontSizeTitle
                    font.weight: Font.Bold
                }

                Item { width: 24; height: 1 }

                Text {
                    text: "Appearance:"
                    color: ThemeTokens.subduedText
                    font.pixelSize: ThemeTokens.fontSizeSmall
                    anchors.verticalCenter: parent.verticalCenter
                }

                Switch {
                    id: darkSwitch
                    text: ThemeTokens.dark ? "🌙 Dark" : "☀️ Light"
                    checked: ThemeTokens.dark
                    onToggled: ThemeTokens.dark = checked
                }
            }

            // ---- 1. Style & Theme Tuner ----
            Card {
                title: "🎨 Theme & Style Tuner"
                subtitle: "Tune theme presets and corner radii live across all preview components."
                width: parent.width

                Column {
                    spacing: 12
                    width: parent.width - 32

                    // Accent Presets
                    Row {
                        spacing: 8
                        Text {
                            text: "Accent Preset:"
                            color: ThemeTokens.subduedText
                            font.pixelSize: ThemeTokens.fontSizeSmall
                            anchors.verticalCenter: parent.verticalCenter
                            width: 100
                        }
                        Repeater {
                            model: [
                                ["Default", "#30a0ff"],
                                ["Emerald", "#10b981"],
                                ["Violet", "#8b5cf6"],
                                ["Amber", "#f59e0b"],
                                ["Crimson", "#ef4444"]
                            ]
                            delegate: Rectangle {
                                required property var modelData
                                width: 84
                                height: 28
                                radius: 14
                                color: win.activeAccent === modelData[0] ? ThemeTokens.panelRaised : ThemeTokens.panel
                                border.color: win.activeAccent === modelData[0] ? modelData[1] : ThemeTokens.border
                                border.width: win.activeAccent === modelData[0] ? 2 : 1

                                Row {
                                    anchors.centerIn: parent
                                    spacing: 6
                                    Rectangle {
                                        width: 8
                                        height: 8
                                        radius: 4
                                        color: parent.parent.modelData[1]
                                    }
                                    Text {
                                        text: parent.parent.modelData[0]
                                        color: ThemeTokens.text
                                        font.pixelSize: ThemeTokens.fontSizeSmall
                                    }
                                }

                                MouseArea {
                                    anchors.fill: parent
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: {
                                        win.activeAccent = parent.modelData[0]
                                        win.activePrimaryColor = parent.modelData[1]
                                    }
                                }
                            }
                        }
                    }

                    // Radius Tuner
                    Row {
                        spacing: 8
                        Text {
                            text: "Corner Radius:"
                            color: ThemeTokens.subduedText
                            font.pixelSize: ThemeTokens.fontSizeSmall
                            anchors.verticalCenter: parent.verticalCenter
                            width: 100
                        }
                        Repeater {
                            model: [
                                ["Sharp (0px)", 0],
                                ["Small (4px)", 4],
                                ["Medium (8px)", 8],
                                ["Large (12px)", 12]
                            ]
                            delegate: Rectangle {
                                required property var modelData
                                width: 96
                                height: 28
                                radius: 4
                                color: win.customRadius === modelData[1] ? ThemeTokens.panelRaised : ThemeTokens.panel
                                border.color: win.customRadius === modelData[1] ? ThemeTokens.accent : ThemeTokens.border
                                border.width: win.customRadius === modelData[1] ? 2 : 1

                                Text {
                                    anchors.centerIn: parent
                                    text: parent.modelData[0]
                                    color: ThemeTokens.text
                                    font.pixelSize: ThemeTokens.fontSizeSmall
                                }

                                MouseArea {
                                    anchors.fill: parent
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: win.customRadius = parent.modelData[1]
                                }
                            }
                        }
                    }
                }
            }

            // ---- 2. Button Matrix ----
            Card {
                title: "Components · ChaSetButton Matrix"
                subtitle: "Cross-stack spec contract (spec/components/button.ts) rendered in QtQuick."
                width: parent.width

                Grid {
                    columns: 1
                    rowSpacing: 10
                    width: parent.width - 32

                    Repeater {
                        model: ["primary", "secondary", "ghost", "destructive"]
                        delegate: Row {
                            required property string modelData
                            spacing: 12
                            Text {
                                text: modelData
                                color: ThemeTokens.subduedText
                                font.pixelSize: ThemeTokens.fontSizeSmall
                                font.family: "Consolas"
                                width: 90
                                anchors.verticalCenter: parent.verticalCenter
                            }
                            ChaSetButton { variant: parent.modelData; size: "sm"; text: parent.modelData + " sm"; onClicked: win.push(modelData + "/sm") }
                            ChaSetButton { variant: parent.modelData; size: "md"; text: parent.modelData + " md"; onClicked: win.push(modelData + "/md") }
                            ChaSetButton { variant: parent.modelData; size: "lg"; text: parent.modelData + " lg"; onClicked: win.push(modelData + "/lg") }
                        }
                    }

                    Row {
                        spacing: 12
                        Text {
                            text: "states"
                            color: ThemeTokens.subduedText
                            font.pixelSize: ThemeTokens.fontSizeSmall
                            font.family: "Consolas"
                            width: 90
                            anchors.verticalCenter: parent.verticalCenter
                        }
                        ChaSetButton { variant: "destructive"; text: "Delete Action"; onClicked: win.push("destructive clicked") }
                        ChaSetButton { text: "Disabled Button"; disabled: true }
                        ChaSetButton {
                            id: saveBtn
                            text: loading ? "Saving…" : "Simulate Async Save"
                            onClicked: {
                                loading = true
                                win.push("Async action triggered")
                                resetTimer.restart()
                            }
                        }
                        Timer {
                            id: resetTimer
                            interval: 1200
                            onTriggered: {
                                saveBtn.loading = false
                                win.push("Async action completed")
                            }
                        }
                    }

                    Row {
                        spacing: 12
                        Text {
                            text: "fullWidth"
                            color: ThemeTokens.subduedText
                            font.pixelSize: ThemeTokens.fontSizeSmall
                            font.family: "Consolas"
                            width: 90
                            anchors.verticalCenter: parent.verticalCenter
                        }
                        ChaSetButton {
                            fullWidth: true
                            width: 400
                            text: "Full Width Block Action"
                            onClicked: win.push("fullWidth clicked")
                        }
                    }

                    Rectangle {
                        width: parent.width
                        height: 32
                        color: ThemeTokens.panelRaised
                        radius: 4
                        border.color: ThemeTokens.border
                        Row {
                            anchors.verticalCenter: parent.verticalCenter
                            anchors.left: parent.left
                            anchors.leftMargin: 10
                            spacing: 8
                            Text {
                                text: "Last Event:"
                                color: ThemeTokens.subduedText
                                font.pixelSize: ThemeTokens.fontSizeSmall
                            }
                            Text {
                                text: win.lastClick
                                color: ThemeTokens.accent
                                font.pixelSize: ThemeTokens.fontSizeSmall
                                font.family: "Consolas"
                                font.weight: Font.Medium
                            }
                        }
                    }
                }
            }

            // ---- 3. Export / Copy QML Configuration ----
            Card {
                title: "📋 Export QML / C++ Configuration"
                subtitle: "Copy ready-to-use Qt Quick component and theme initialization code."
                width: parent.width

                Column {
                    spacing: 8
                    width: parent.width - 32

                    Rectangle {
                        width: parent.width
                        height: 140
                        color: ThemeTokens.background
                        border.color: ThemeTokens.border
                        radius: 4

                        ScrollView {
                            anchors.fill: parent
                            anchors.margins: 8
                            TextArea {
                                readOnly: true
                                text: "// ChaSet Qt QML Component Usage\nimport QtQuick 6.10\nimport chaSet\n\nChaSetButton {\n    variant: \"primary\"\n    size: \"md\"\n    text: \"Save Changes\"\n    onClicked: console.log(\"Clicked\")\n}\n\n// Runtime Theme Toggle:\n// ThemeTokens.dark = " + (ThemeTokens.dark ? "true" : "false") + ";"
                                color: ThemeTokens.text
                                font.family: "Consolas"
                                font.pixelSize: ThemeTokens.fontSizeSmall
                                background: null
                            }
                        }
                    }
                }
            }

            // ---- 4. Palette Grid ----
            Card {
                title: "Palette · dunting semantic tokens"
                subtitle: "All derived from spec/tokens.json and bound live to ThemeTokens singleton."
                width: parent.width

                Grid {
                    columns: 5
                    columnSpacing: 14
                    rowSpacing: 10
                    Repeater {
                        model: [
                            ["background", "window bg"], ["panel", "panel"],
                            ["panelRaised", "raised panel"], ["selection", "selection"],
                            ["hover", "hover"], ["pressed", "pressed"],
                            ["accent", "accent"], ["onAccent", "on-accent text"],
                            ["nestAccent", "nest accent"], ["pendingAccent", "pending"],
                            ["conflict", "conflict"], ["blocked", "blocked"],
                            ["danger", "danger"], ["dangerHover", "danger hover"],
                            ["border", "border"], ["text", "text"],
                            ["subduedText", "secondary text"], ["overlayScrim", "scrim"]
                        ]
                        delegate: SwatchItem {
                            required property var modelData
                            tokenName: modelData[0]
                            label: modelData[1]
                        }
                    }
                }
            }
        }
    }
}
