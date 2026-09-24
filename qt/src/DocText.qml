// DocText.qml — Selectable typography primitive for ChaSet Living Documentation
import QtQuick 6.10
import ChaSet

TextEdit {
    id: root

    property string role: "" // "h1" | "h2" | "h3" | "p" | "caption" | "micro" | "code"
    property color textColor: ThemeTokens.text
    property bool isMuted: false
    property bool isMono: false

    // Defensive compatibility properties matching QQuickText APIs
    property real lineHeight: 1.0
    property int elide: 0
    property int maximumLineCount: -1

    readonly property int rolePixelSize: {
        switch (role) {
        case "h1": return Typography.sizeTitle       // 28px
        case "h2": return Typography.sizeTitleSm     // 20px (React text-xl)
        case "h3": return Typography.sizeHeading     // 16px (React text-base)
        case "p": return Typography.sizeBody         // 14px (React text-sm)
        case "caption": return Typography.sizeSmall  // 12px (React text-xs)
        case "micro": return Typography.sizeMicro    // 10px
        case "code": return Typography.sizeSmall     // 12px
        default: return 0
        }
    }

    readonly property int roleWeight: {
        switch (role) {
        case "h1":
        case "h2": return Typography.weightBold      // 700
        case "h3": return Typography.weightSemibold  // 600
        case "code": return Typography.weightMedium  // 500
        default: return 0
        }
    }

    font.family: (role === "code" || isMono) ? Typography.familyMono : Typography.familySans
    font.pixelSize: rolePixelSize > 0 ? rolePixelSize : Typography.sizeSmall
    font.weight: roleWeight > 0 ? roleWeight : Typography.weightRegular

    readOnly: true
    selectByMouse: true
    selectByKeyboard: true
    cursorVisible: false
    activeFocusOnPress: true
    property bool wrap: false
    textMargin: 0
    padding: 0
    wrapMode: wrap ? TextEdit.WordWrap : TextEdit.NoWrap
    color: isMuted ? ThemeTokens.subduedText : textColor
    selectionColor: ThemeTokens.accent
    selectedTextColor: "#ffffff"

    width: contentWidth
    height: contentHeight

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
