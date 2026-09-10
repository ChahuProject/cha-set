// ChaSetSettingRow.qml — Standardized Settings Row Component
// Provides structured label, description, control zone, and 3-cycle anchor flash animation.
import QtQuick 6.10
import ChaSet

Item {
    id: root

    property string name: ""
    property string description: ""
    property string icon: ""
    property string badge: ""
    property string size: "default" // "default" | "sm"
    property string highlightId: ""
    property string highlightTarget: ""
    property bool highlight: highlightTarget !== "" && highlightTarget === highlightId
    property bool disabled: false

    readonly property bool isSm: root.size === "sm"

    signal highlightFinished(string id)

    default property alias controls: _controlZone.children

    width: parent ? parent.width : 0
    implicitHeight: Math.max(_labelColumn.implicitHeight, _controlZone.implicitHeight) + (root.isSm ? 14 : 20)

    opacity: root.disabled ? 0.5 : 1.0

    // Highlight flash border
    Rectangle {
        anchors.fill: parent
        anchors.margins: -3
        radius: 8
        color: "transparent"
        border.width: root.highlight ? 2 : 0
        border.color: ThemeTokens.accent
        opacity: root.highlight ? 1 : 0
        visible: opacity > 0

        SequentialAnimation on opacity {
            running: root.highlight
            NumberAnimation { from: 1; to: 0.25; duration: 180 }
            NumberAnimation { from: 0.25; to: 1; duration: 180 }
            NumberAnimation { from: 1; to: 0.25; duration: 180 }
            NumberAnimation { from: 0.25; to: 1; duration: 180 }
            NumberAnimation { from: 1; to: 0; duration: 400 }
            onRunningChanged: {
                if (!running && root.highlight) {
                    root.highlightFinished(root.highlightId);
                }
            }
        }

        Behavior on opacity {
            NumberAnimation { duration: 120 }
        }
    }

    Row {
        anchors.fill: parent
        anchors.topMargin: root.isSm ? 6 : 10
        anchors.bottomMargin: root.isSm ? 6 : 10
        spacing: root.isSm ? 8 : 12

        Rectangle {
            id: _iconBox
            visible: root.icon.length > 0
            width: root.isSm ? 26 : 32
            height: root.isSm ? 26 : 32
            radius: 6
            color: ThemeTokens.hover
            anchors.verticalCenter: parent.verticalCenter

            Text {
                anchors.centerIn: parent
                text: root.icon
                font.pixelSize: root.isSm ? 12 : 14
                color: ThemeTokens.text
            }
        }

        Column {
            id: _labelColumn
            width: Math.min(parent.width * 0.55, 340)
            anchors.verticalCenter: parent.verticalCenter
            spacing: 2

            Row {
                spacing: 6

                Text {
                    text: root.name
                    color: ThemeTokens.text
                    font.pixelSize: root.isSm ? 12 : 13
                    font.bold: true
                }

                ChaSetBadge {
                    visible: root.badge.length > 0
                    text: root.badge
                    variant: "secondary"
                    size: "sm"
                    anchors.verticalCenter: parent.verticalCenter
                }
            }

            Text {
                width: parent.width
                text: root.description
                visible: root.description.length > 0
                color: ThemeTokens.subduedText
                font.pixelSize: root.isSm ? 10 : 11
                wrapMode: Text.Wrap
            }
        }

        Item {
            id: _controlZone
            width: parent.width - _labelColumn.width - (_iconBox.visible ? _iconBox.width + 12 : 0) - 12
            height: parent.height
            anchors.verticalCenter: parent.verticalCenter
        }
    }
}

