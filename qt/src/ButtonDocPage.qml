// ButtonDocPage.qml — Button Documentation & Matrix
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

                // Controls Row
                Row {
                    spacing: 20
                    width: parent.width

                    // Left: Controls
                    Column {
                        width: 320
                        spacing: 12

                        // Variant
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

                        // Size
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
                        }
                    }

                    // Right: Stage
                    Rectangle {
                        width: parent.width - 340
                        height: 120
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
            }
        }

        // Section 2: Full Matrix
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
    }
}
