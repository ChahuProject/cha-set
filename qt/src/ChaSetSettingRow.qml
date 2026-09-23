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
    implicitHeight: Math.max(_labelColumn.implicitHeight, _controlZone.implicitHeight) + ThemeTokens.dp(root.isSm ? 14 : 20)
    height: implicitHeight

    opacity: root.disabled ? 0.5 : 1.0

    // Highlight flash border
    Rectangle {
        anchors.fill: parent
        anchors.margins: -ThemeTokens.dp(3)
        radius: ThemeTokens.dp(8)
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
        anchors.rightMargin: ThemeTokens.dp(12)
        anchors.verticalCenter: parent.verticalCenter
        height: _labelColumn.height
        spacing: ThemeTokens.dp(root.isSm ? 8 : 12)

        Rectangle {
            id: _iconBox
            visible: root.icon.length > 0
            width: ThemeTokens.dp(root.isSm ? 26 : 32)
            height: ThemeTokens.dp(root.isSm ? 26 : 32)
            radius: ThemeTokens.dp(6)
            color: ThemeTokens.hover
            anchors.verticalCenter: parent.verticalCenter

            ChaSetIcon {
                anchors.centerIn: parent
                name: root.icon
                size: root.isSm ? 14 : 16
                color: ThemeTokens.text
            }
        }

        Item {
            id: _labelColumn
            width: _leftRow.width - (_iconBox.visible ? (_iconBox.width + _leftRow.spacing) : 0)
            anchors.verticalCenter: parent.verticalCenter
            implicitHeight: nameRow.height + (rowDescText.visible ? (rowDescText.height + 2) : 0)
            height: implicitHeight

            Row {
                id: nameRow
                anchors.top: parent.top
                anchors.left: parent.left
                anchors.right: parent.right
                height: Math.max(rowNameText.height, badgeComp.visible ? badgeComp.height : 0)
                spacing: ThemeTokens.dp(6)

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
                    id: badgeComp
                    visible: root.badge.length > 0
                    text: root.badge
                    variant: "secondary"
                    size: "sm"
                    anchors.verticalCenter: parent.verticalCenter
                }
            }

            TextEdit {
                id: rowDescText
                anchors.top: nameRow.bottom
                anchors.topMargin: ThemeTokens.dp(2)
                anchors.left: parent.left
                anchors.right: parent.right
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
            var maxAllowed = root.width > 0 ? Math.max(ThemeTokens.dp(140), root.width - ThemeTokens.dp(180)) : ThemeTokens.dp(500);
            if (maxW > 0) return Math.min(maxAllowed, Math.max(ThemeTokens.dp(100), maxW));
            return root.width > 0 ? Math.min(maxAllowed, Math.max(ThemeTokens.dp(160), root.width * 0.45)) : ThemeTokens.dp(200);
        }
        implicitHeight: {
            var maxH = 0;
            for (var j = 0; j < _controlZone.children.length; j++) {
                var ch = _controlZone.children[j];
                if (ch && ch.visible !== false) {
                    var h = ch.implicitHeight > 0 ? ch.implicitHeight : ch.height;
                    if (h > maxH) maxH = h;
                }
            }
            return maxH;
        }
        height: implicitHeight > 0 ? implicitHeight : (parent.height - ThemeTokens.dp(root.isSm ? 12 : 20))
    }
}

