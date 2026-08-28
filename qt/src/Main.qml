import QtQuick 6.10
import QtQuick.Controls 6.10
import chaSet

// ChaSet Qt showcase gallery — consumes the generated ThemeTokens singleton
// (spec/tokens.json, dunting preset). Top-bar switch toggles light/dark at
// runtime; all colors react to the singleton properties.
ApplicationWindow {
    id: win
    width: 900
    height: 1040
    visible: true
    title: "ChaSet Qt Showcase"
    color: ThemeTokens.background

    property string lastClick: "Ready."
    function push(msg) { lastClick = msg }

    Component.onCompleted: if (startupLight === true) ThemeTokens.dark = false

    // ---- Inline Card component ----
    component Card: Rectangle {
        id: cardRoot
        property string title
        default property alias contentData: contentCol.data
        radius: ThemeTokens.radiusLarge
        color: ThemeTokens.panel
        border.color: ThemeTokens.border
        implicitWidth: contentCol.implicitWidth + 32
        implicitHeight: contentCol.implicitHeight + 52
        Column {
            id: contentCol
            x: 16
            y: 14
            spacing: 12
            Text {
                text: cardRoot.title
                color: ThemeTokens.text
                font.pixelSize: ThemeTokens.fontSizeHeading
                font.weight: Font.Medium
            }
        }
    }

    component SwatchItem: Column {
        property string tokenName
        property string label
        spacing: 4
        Rectangle {
            width: 150
            height: 40
            radius: ThemeTokens.rowRadius
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

    Column {
        anchors.fill: parent
        anchors.margins: 20
        spacing: 16

        // ---- Top bar ----
        Row {
            width: parent.width
            spacing: 12
            Text {
                text: "ChaSet Qt Showcase"
                color: ThemeTokens.text
                font.pixelSize: ThemeTokens.fontSizeTitle
                font.weight: Font.Medium
            }
            Item { width: 1; height: 1 } // spacer
            Switch {
                text: "Dark"
                checked: ThemeTokens.dark
                onToggled: ThemeTokens.dark = checked
            }
        }

        // ---- Palette ----
        Card {
            title: "Palette · dunting preset (live with dark toggle)"
            Grid {
                columns: 4
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

        // ---- Typography / Radius ----
        Card {
            title: "Typography / Radius"
            Row {
                spacing: 14
                Repeater {
                    model: [
                        ["rowRadius", 4], ["panelRadius", 6],
                        ["radiusLarge", 10], ["radiusXl", 14]
                    ]
                    delegate: Rectangle {
                        required property var modelData
                        width: 76
                        height: 56
                        radius: modelData[1]
                        color: "transparent"
                        border.color: ThemeTokens.accent
                        border.width: 1.5
                        Text {
                            anchors.centerIn: parent
                            text: parent.modelData[0]
                            color: ThemeTokens.subduedText
                            font.pixelSize: ThemeTokens.fontSizeSmall
                        }
                    }
                }
            }
            Column {
                spacing: 4
                Text {
                    text: "Medium — Tea Set ChaSet, cross-stack component library"
                    color: ThemeTokens.text
                    font.pixelSize: ThemeTokens.fontSizeHeading
                    font.weight: Font.Medium
                }
                Text {
                    text: "DemiBold — Tea Set ChaSet, cross-stack component library"
                    color: ThemeTokens.subduedText
                    font.pixelSize: ThemeTokens.fontSizeHeading
                    font.weight: Font.DemiBold
                }
            }
        }

        // ---- Buttons ----
        Card {
            title: "Button · variant × size (cha-set contract)"
            width: parent.width

            Grid {
                columns: 1
                rowSpacing: 10
                Repeater {
                    model: ["primary", "secondary", "ghost", "destructive"]
                    delegate: Row {
                        required property string modelData
                        spacing: 10
                        Text {
                            text: modelData
                            color: ThemeTokens.subduedText
                            font.pixelSize: ThemeTokens.fontSizeSmall
                            font.family: "Consolas"
                            width: 80
                            anchors.verticalCenter: parent.verticalCenter
                        }
                        ChaSetButton { variant: parent.modelData; size: "sm"; text: "sm"; onClicked: win.push(modelData + "/sm") }
                        ChaSetButton { variant: parent.modelData; size: "md"; text: "md"; onClicked: win.push(modelData + "/md") }
                        ChaSetButton { variant: parent.modelData; size: "lg"; text: "lg"; onClicked: win.push(modelData + "/lg") }
                    }
                }
                Row {
                    spacing: 10
                    Text {
                        text: "states"
                        color: ThemeTokens.subduedText
                        font.pixelSize: ThemeTokens.fontSizeSmall
                        font.family: "Consolas"
                        width: 80
                        anchors.verticalCenter: parent.verticalCenter
                    }
                    ChaSetButton { variant: "destructive"; text: "Delete"; onClicked: win.push("destructive clicked") }
                    ChaSetButton { text: "Disabled"; disabled: true }
                    ChaSetButton { fullWidth: true; width: 320; text: "Full width"; onClicked: win.push("fullWidth clicked") }
                }
                Row {
                    spacing: 10
                    Text {
                        text: "async"
                        color: ThemeTokens.subduedText
                        font.pixelSize: ThemeTokens.fontSizeSmall
                        font.family: "Consolas"
                        width: 80
                        anchors.verticalCenter: parent.verticalCenter
                    }
                    ChaSetButton {
                        id: saveBtn
                        text: loading ? "Saving…" : "Simulate save"
                        onClicked: {
                            loading = true
                            resetTimer.restart()
                        }
                    }
                    Timer {
                        id: resetTimer
                        interval: 1200
                        onTriggered: saveBtn.loading = false
                    }
                }
                Text {
                    id: btnLog
                    text: win.lastClick
                    color: ThemeTokens.subduedText
                    font.pixelSize: ThemeTokens.fontSizeSmall
                    font.family: "Consolas"
                }
            }
        }
    }
}
