// ChaSetCardTitle.qml — Card Title Text
// Matching React: font-semibold leading-none tracking-tight text-base text-card-foreground
import QtQuick 6.10
import ChaSet

TextEdit {
    id: root

    property bool isDark: ThemeTokens.dark

    font.pixelSize: Typography.sizeHeading
    font.weight: Font.DemiBold
    // React pins `leading-none`, i.e. a line box exactly as tall as the font size.
    // Qt would otherwise use the font's own metrics (≈21px at 16px), so the block
    // is one line-taller than the Web twin. See docs/architecture/typography-system.md.
    property real lineHeight: Typography.lineHeightPx(Typography.sizeHeading, "none")
    property int lineHeightMode: 0
    color: isDark ? Qt.rgba(248/255, 250/255, 252/255, 1.0) : Qt.rgba(2/255, 8/255, 23/255, 1.0)
    wrapMode: TextEdit.Wrap
    width: parent ? parent.width : contentWidth
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
        if (selectedText.length > 0) SelectionHub.claim(root);
        else if (SelectionHub.activeOwner === root) SelectionHub.clear(root);
    }
}
