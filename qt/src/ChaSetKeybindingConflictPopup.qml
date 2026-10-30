// ChaSetKeybindingConflictPopup.qml — Cross-Stack Shortcut Key Conflict Detail Popup
import QtQuick
import QtQuick.Controls
import ChaSet

Item {
    id: root

    property bool open: false
    property string chord: ""
    property var occupiers: [] // [{ actionId, actionName, isResolver }]

    signal closeRequested()

    anchors.fill: parent
    visible: open
    z: 990

    onOpenChanged: {
        if (open) {
            ChaSetOverlayHub.escapeSuspended = true
        } else {
            ChaSetOverlayHub.escapeSuspended = false
        }
    }

    Component.onDestruction: {
        if (root.open) ChaSetOverlayHub.escapeSuspended = false
    }

    // Scrim / Backdrop
    Rectangle {
        anchors.fill: parent
        color: ThemeTokens.overlayScrim

        MouseArea {
            anchors.fill: parent
            onClicked: root.closeRequested()
        }
    }

    // Centered Dialog Card
    Rectangle {
        id: card
        anchors.centerIn: parent
        width: Math.min(parent.width - ThemeTokens.dp(32), ThemeTokens.dp(420))
        implicitHeight: contentCol.implicitHeight + ThemeTokens.dp(32)
        radius: ThemeTokens.dp(8)
        color: ThemeTokens.panel
        border.color: ThemeTokens.border
        border.width: 1
        clip: true

        Column {
            id: contentCol
            anchors.top: parent.top
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.margins: ThemeTokens.dp(16)
            spacing: ThemeTokens.dp(12)

            // Header Row
            Item {
                width: parent.width
                height: ThemeTokens.dp(28)

                Row {
                    anchors.left: parent.left
                    anchors.verticalCenter: parent.verticalCenter
                    spacing: ThemeTokens.dp(8)

                    ChaSetIcon {
                        name: "alert-triangle"
                        size: 18
                        color: ThemeTokens.conflict
                        anchors.verticalCenter: parent.verticalCenter
                    }

                    Text {
                        text: (typeof ChaSetI18n !== "undefined" && ChaSetI18n.tr) ? ChaSetI18n.tr("components.keybindingManager.conflictTitle", "Shortcut Key Conflict") : "Shortcut Key Conflict"
                        color: ThemeTokens.text
                        font.pixelSize: Typography.sizeTitleSm
                        font.bold: true
                        anchors.verticalCenter: parent.verticalCenter
                    }

                    Rectangle {
                        height: ThemeTokens.dp(20)
                        width: chordText.implicitWidth + ThemeTokens.dp(12)
                        radius: ThemeTokens.dp(4)
                        color: ThemeTokens.panelRaised
                        border.color: ThemeTokens.border
                        border.width: 1
                        anchors.verticalCenter: parent.verticalCenter

                        Text {
                            id: chordText
                            anchors.centerIn: parent
                            text: root.chord
                            color: ThemeTokens.conflict
                            font.pixelSize: Typography.sizeCaption
                            font.family: Typography.familyMono
                            font.bold: true
                        }
                    }
                }

                ChaSetButton {
                    anchors.right: parent.right
                    anchors.verticalCenter: parent.verticalCenter
                    icon: "x"
                    variant: "ghost"
                    size: "icon-xs"
                    onClicked: root.closeRequested()
                }
            }

            // Description
            Text {
                width: parent.width
                wrapMode: Text.WordWrap
                text: (typeof ChaSetI18n !== "undefined" && ChaSetI18n.tr) ? ChaSetI18n.tr("components.keybindingManager.conflictExplanation", "The shortcut key is assigned to multiple actions in the same scope. At runtime, the last-registered binding takes precedence.") : "The shortcut key is assigned to multiple actions in the same scope."
                color: ThemeTokens.subduedText
                font.pixelSize: Typography.sizeSmall
            }

            // Occupiers List
            Rectangle {
                width: parent.width
                height: Math.min(ThemeTokens.dp(160), occupiersListCol.implicitHeight + ThemeTokens.dp(8))
                radius: ThemeTokens.dp(6)
                color: ThemeTokens.panelRaised
                border.color: ThemeTokens.border
                border.width: 1
                clip: true

                Flickable {
                    anchors.fill: parent
                    contentWidth: width
                    contentHeight: occupiersListCol.implicitHeight
                    boundsBehavior: Flickable.StopAtBounds

                    Column {
                        id: occupiersListCol
                        width: parent.width
                        spacing: 1

                        Repeater {
                            model: root.occupiers
                            delegate: Rectangle {
                                required property var modelData
                                required property int index

                                width: occupiersListCol.width
                                height: ThemeTokens.dp(36)
                                color: modelData.isResolver ? ThemeTokens.hover : "transparent"

                                Row {
                                    anchors.fill: parent
                                    anchors.leftMargin: ThemeTokens.dp(10)
                                    anchors.rightMargin: ThemeTokens.dp(10)
                                    spacing: ThemeTokens.dp(8)

                                    Column {
                                        anchors.verticalCenter: parent.verticalCenter
                                        width: parent.width - (modelData.isResolver ? resolverBadge.width + parent.spacing : 0)

                                        Text {
                                            width: parent.width
                                            text: modelData.actionName || modelData.actionId
                                            color: ThemeTokens.text
                                            font.pixelSize: Typography.sizeSmall
                                            font.bold: modelData.isResolver
                                            elide: Text.ElideRight
                                        }

                                        Text {
                                            width: parent.width
                                            text: modelData.actionId
                                            color: ThemeTokens.subduedText
                                            font.pixelSize: Typography.sizeCaption
                                            font.family: Typography.familyMono
                                            elide: Text.ElideRight
                                        }
                                    }

                                    Rectangle {
                                        id: resolverBadge
                                        visible: modelData.isResolver
                                        anchors.verticalCenter: parent.verticalCenter
                                        height: ThemeTokens.dp(20)
                                        width: resolverText.implicitWidth + ThemeTokens.dp(10)
                                        radius: ThemeTokens.dp(10)
                                        color: ThemeTokens.hover
                                        border.color: ThemeTokens.accent
                                        border.width: 1

                                        Text {
                                            id: resolverText
                                            anchors.centerIn: parent
                                            text: (typeof ChaSetI18n !== "undefined" && ChaSetI18n.tr) ? ChaSetI18n.tr("components.keybindingManager.activeResolver", "Active Resolver") : "Active"
                                            color: ThemeTokens.accent
                                            font.pixelSize: Typography.sizeCaption
                                            font.bold: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Footer
            Item {
                width: parent.width
                height: ThemeTokens.dp(32)

                ChaSetButton {
                    anchors.right: parent.right
                    anchors.verticalCenter: parent.verticalCenter
                    text: (typeof ChaSetI18n !== "undefined" && ChaSetI18n.tr) ? ChaSetI18n.tr("common.close", "Close") : "Close"
                    variant: "outline"
                    size: "sm"
                    onClicked: root.closeRequested()
                }
            }
        }
    }
}
