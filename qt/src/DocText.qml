// DocText.qml — Selectable typography primitive for ChaSet Living Documentation
import QtQuick 6.10
import ChaSet

TextEdit {
    id: root

    property color textColor: ThemeTokens.text
    property bool isMuted: false

    readOnly: true
    selectByMouse: true
    selectByKeyboard: true
    cursorVisible: false
    activeFocusOnPress: false
    textMargin: 0
    padding: 0
    wrapMode: TextEdit.WordWrap
    color: isMuted ? ThemeTokens.subduedText : textColor
    selectionColor: ThemeTokens.accent
    selectedTextColor: "#ffffff"
    height: contentHeight

    HoverHandler {
        cursorShape: Qt.IBeamCursor
    }
}
