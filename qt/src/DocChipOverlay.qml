// DocChipOverlay.qml — Interactive HoverCopy overlay on top of marked inline chips.
//
// Paired with DocChipLayer: DocChipLayer paints the rounded background BEHIND the
// text (z: 0), while DocChipOverlay positions ChaSetHoverCopy at the exact same
// coordinates and corner radius ON TOP OF the text (z: 2).
//
// Idle: scrim is transparent, text glyphs show through unobstructed.
// Hovered: scrim (ThemeTokens.dp(4) radius) dims the chip and reveals copy icon.
// Clicked: copies payload to clipboard.
import QtQuick
import ChaSet

Item {
    id: root

    /// The DocText (TextEdit) whose inline chips should be covered.
    property var target: null
    /// Anchor href prefix that marks a chip, e.g. "chip:". Set by DocMarkdown.codeSpan().
    property string marker: "chip:"
    /// Matches DocChipLayer's radius (4dp, rounded)
    property real radius: ThemeTokens.dp(4)
    /// Breathing room matching DocChipLayer
    property real verticalPadding: ThemeTokens.dp(5) / 2

    /// {x, y, w, h, payload} per line segment, in the target's content coordinates.
    property var rects: []

    visible: target !== null
    x: target ? target.x : 0
    y: target ? target.y : 0
    width: target ? target.width : 0
    height: target ? target.contentHeight : 0
    z: 2

    function refresh() {
        rects = target && target.textDocument
            ? ChaSetTextFragments.fragmentRects(target.textDocument, marker)
            : [];
    }

    onTargetChanged: Qt.callLater(refresh)
    Component.onCompleted: Qt.callLater(refresh)

    Connections {
        target: root.target

        function onContentHeightChanged() { Qt.callLater(root.refresh); }
        function onTextChanged() { Qt.callLater(root.refresh); }
        function onWidthChanged() { Qt.callLater(root.refresh); }
    }

    Repeater {
        model: root.rects

        delegate: ChaSetHoverCopy {
            x: modelData.x
            y: modelData.y - root.verticalPadding
            width: modelData.w
            height: modelData.h + root.verticalPadding * 2
            radius: "sm"
            text: modelData.payload || ""
            visible: root.marker === "chip:" && Boolean(modelData.payload)
        }
    }
}
