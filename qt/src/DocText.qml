// DocText.qml — Selectable typography primitive for ChaSet Living Documentation
import QtQuick 6.10
import ChaSet

TextEdit {
    id: root

    property color textColor: ThemeTokens.text
    property bool isMuted: false

    // Defensive compatibility properties matching QQuickText APIs
    property real lineHeight: 1.0
    property int elide: 0
    property int maximumLineCount: -1
    property int renderType: 0

    readOnly: true
    selectByMouse: true
    selectByKeyboard: true
    cursorVisible: false
    activeFocusOnPress: false
    textMargin: 0
    padding: 0
    wrapMode: TextEdit.NoWrap
    color: isMuted ? ThemeTokens.subduedText : textColor
    selectionColor: ThemeTokens.accent
    selectedTextColor: "#ffffff"

    width: contentWidth
    height: contentHeight

    HoverHandler {
        cursorShape: Qt.IBeamCursor
    }
}
