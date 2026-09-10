// ChaSetSettingRow.qml — Standardized Settings Row Component
// Provides structured label, description, control zone, and 3-cycle anchor flash animation.
import QtQuick 6.10
import ChaSet

Item {
    id: root

    property string name: ""
    property string description: ""
    property string highlightId: ""
    property string highlightTarget: ""
    property bool highlight: highlightTarget !== "" && highlightTarget === highlightId
    property bool disabled: false

    signal highlightFinished(string id)

    default property alias controls: _controlZone.children

    width: parent ? parent.width : 0
    implicitHeight: Math.max(_labelColumn.implicitHeight, _controlZone.implicitHeight) + 20

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
        anchors.topMargin: 10
        anchors.bottomMargin: 10
        spacing: 12

        Column {
            id: _labelColumn
            width: Math.min(parent.width * 0.55, 340)
            anchors.verticalCenter: parent.verticalCenter
            spacing: 2

            Text {
                width: parent.width
                text: root.name
                color: ThemeTokens.text
                font.pixelSize: 13
                font.bold: true
                wrapMode: Text.Wrap
            }

            Text {
                width: parent.width
                text: root.description
                visible: root.description.length > 0
                color: ThemeTokens.subduedText
                font.pixelSize: 11
                wrapMode: Text.Wrap
            }
        }

        Item {
            id: _controlZone
            width: parent.width - _labelColumn.width - 12
            height: parent.height
            anchors.verticalCenter: parent.verticalCenter
        }
    }
}
