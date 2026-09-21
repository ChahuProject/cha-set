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
    property real controlWidth: -1

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
            running: ThemeTokens.animationsEnabled && root.highlight
            NumberAnimation { from: 1; to: 0.25; duration: ThemeTokens.motionMedium }
            NumberAnimation { from: 0.25; to: 1; duration: ThemeTokens.motionMedium }
            NumberAnimation { from: 1; to: 0.25; duration: ThemeTokens.motionMedium }
            NumberAnimation { from: 0.25; to: 1; duration: ThemeTokens.motionMedium }
            NumberAnimation { from: 1; to: 0; duration: Math.max(10, ThemeTokens.motionMedium * 2) }
            onRunningChanged: {
                if (!running && root.highlight) {
                    root.highlightFinished(root.highlightId);
                }
            }
        }

        Behavior on opacity {
            NumberAnimation { duration: ThemeTokens.motionShort }
        }
    }

    Row {
        id: _leftRow
        anchors.left: parent.left
        anchors.right: _controlZone.left
        anchors.rightMargin: 12
        anchors.top: parent.top
        anchors.bottom: parent.bottom
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
                font.pixelSize: root.isSm ? Typography.sizeSmall : Typography.sizeBody
                color: ThemeTokens.text
            }
        }

        Column {
            id: _labelColumn
            width: _leftRow.width - (_iconBox.visible ? (_iconBox.width + _leftRow.spacing) : 0)
            anchors.verticalCenter: parent.verticalCenter
            spacing: 2

            Row {
                spacing: 6

                TextEdit {
                    id: rowNameText
                    text: root.name
                    color: ThemeTokens.text
                    font.pixelSize: root.isSm ? Typography.sizeSmall : Typography.sizeBody
                    font.bold: true
                    width: contentWidth
                    height: contentHeight
                    readOnly: true
                    selectByMouse: true
                    selectByKeyboard: true
                    cursorVisible: false
                    activeFocusOnPress: false
                    textMargin: 0
                    padding: 0
                    selectionColor: ThemeTokens.accent
                    selectedTextColor: "#ffffff"

                    HoverHandler {
                        cursorShape: Qt.IBeamCursor
                    }

                    onSelectedTextChanged: {
                        if (selectedText.length > 0) SelectionHub.claim(rowNameText);
                        else if (SelectionHub.activeOwner === rowNameText) SelectionHub.clear(rowNameText);
                    }
                }

                ChaSetBadge {
                    visible: root.badge.length > 0
                    text: root.badge
                    variant: "secondary"
                    size: "sm"
                    anchors.verticalCenter: parent.verticalCenter
                }
            }

            TextEdit {
                id: rowDescText
                width: parent.width
                text: root.description
                visible: root.description.length > 0
                color: ThemeTokens.subduedText
                font.pixelSize: root.isSm ? Typography.sizeMicro : Typography.sizeCaption
                wrapMode: TextEdit.Wrap
                height: visible ? contentHeight : 0
                readOnly: true
                selectByMouse: true
                selectByKeyboard: true
                cursorVisible: false
                activeFocusOnPress: false
                textMargin: 0
                padding: 0
                selectionColor: ThemeTokens.accent
                selectedTextColor: "#ffffff"

                HoverHandler {
                    cursorShape: Qt.IBeamCursor
                }

                onSelectedTextChanged: {
                    if (selectedText.length > 0) SelectionHub.claim(rowDescText);
                    else if (SelectionHub.activeOwner === rowDescText) SelectionHub.clear(rowDescText);
                }
            }
        }
    }

    Item {
        id: _controlZone
        anchors.right: parent.right
        anchors.verticalCenter: parent.verticalCenter
        width: {
            if (root.controlWidth > 0) return root.controlWidth;
            var maxW = 0;
            for (var i = 0; i < _controlZone.children.length; i++) {
                var c = _controlZone.children[i];
                if (c && c.visible !== false) {
                    var w = c.implicitWidth > 0 ? c.implicitWidth : c.width;
                    if (w > maxW) maxW = w;
                }
            }
            var maxAllowed = root.width > 0 ? Math.max(140, root.width - 180) : 500;
            if (maxW > 0) return Math.min(maxAllowed, Math.max(100, maxW));
            return root.width > 0 ? Math.min(maxAllowed, Math.max(160, root.width * 0.45)) : 200;
        }
        height: parent.height - (root.isSm ? 12 : 20)
    }
}

