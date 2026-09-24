// ChaSetCardDescription.qml — Card Description Text
// Matching React: text-sm text-muted-foreground
import QtQuick 6.10
import ChaSet

TextEdit {
    id: root

    property bool isDark: ThemeTokens.dark

    font.pixelSize: Typography.sizeBody
    font.weight: Font.Normal
    // React twin: text-sm -> 14px on a 20px line box.
    property real lineHeight: Typography.lineHeightPx(Typography.sizeBody, "body")
    property int lineHeightMode: 0
    color: isDark ? Qt.rgba(148/255, 163/255, 184/255, 1.0) : Qt.rgba(100/255, 116/255, 139/255, 1.0)
    wrapMode: TextEdit.Wrap
    width: parent ? parent.width : contentWidth
    height: contentHeight

    readOnly: true
    selectByMouse: true
    selectByKeyboard: true
    cursorVisible: false
    activeFocusOnPress: true
    textMargin: 0
    padding: 0
    selectionColor: ThemeTokens.accent
    selectedTextColor: "#ffffff"

    HoverHandler {
        cursorShape: Qt.IBeamCursor
    }

    onSelectedTextChanged: {
        if (selectedText.length > 0) SelectionHub.claim(root);
        else if (SelectionHub.activeOwner === root) SelectionHub.clear(root);
    }

    Keys.onPressed: function(event) {
        if (event.matches(StandardKey.Copy) || (event.key === Qt.Key_C && (event.modifiers & (Qt.ControlModifier | Qt.MetaModifier)))) {
            SelectionHub.copyActiveSelection();
            event.accepted = true;
        }
    }

    TapHandler {
        acceptedButtons: Qt.RightButton
        onTapped: function(eventPoint) {
            var scenePos = eventPoint.scenePosition;
            SelectionHub.showContextMenu(scenePos.x, scenePos.y, root);
        }
    }
}
