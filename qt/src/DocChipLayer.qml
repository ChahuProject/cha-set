// DocChipLayer.qml — Backgrounds painted BEHIND inline tokens and keycaps.
//
// Qt's rich text cannot round corners (border-radius is not in the supported CSS subset) and
// has no inline-item API, so neither the token pill nor the keycap can come from the text
// engine. This layer reads the line geometry of the marked fragments from ChaSetTextFragments
// and draws plain Rectangles.
//
// The same layer backs two different markers, so `DocMarkdown` instantiates it twice:
//   * `marker: "chip:"` → a filled pill behind an inline code span
//   * `marker: "key:"`  → a bordered keycap behind a single key of a shortcut
//
// Order matters: declare this BEFORE the DocText sibling so the text paints on top. That also
// keeps hit-testing intact — the layer has no MouseArea, so presses, drag-selection and the
// native selection highlight all still belong to the text item.
import QtQuick 6.10
import ChaSet

Item {
    id: root

    /// The DocText (TextEdit) whose inline chips should be backed.
    property var target: null
    /// Anchor href prefix that marks a chip, e.g. "chip:". Set by DocMarkdown.codeSpan().
    property string marker: "chip:"
    property color chipColor: ThemeTokens.panelRaised
    /// Outline for keycap mode. Transparent (the default) keeps the pill borderless.
    property color borderColor: "transparent"
    property real borderWidth: 0
    /// React's `rounded-sm` is 2px, but Qt's rounded-rect shader produces a much shallower
    /// arc at the same value (measured against a 200% crop: ~2 device px of corner versus 5).
    /// 4 keeps the two visually equal.
    property real radius: ThemeTokens.dp(4)
    /// Vertical breathing room. The rich text box hugs the glyph metrics (13px for the 12px
    /// mono font), while React's `py-0.5` adds 2px above and below a ~14px line box, giving an
    /// 18px pill. Without it the pill reads as "too wide" even when the horizontal padding
    /// matches, because the width/height ratio is wrong.
    ///
    /// Expressed as dp(5)/2 because `ThemeTokens.dp()` rounds: dp(2.5) would collapse to 3 and
    /// make the pill 2px taller than React's at 200%.
    property real verticalPadding: ThemeTokens.dp(5) / 2

    /// {x, y, w, h} per line segment, in the target's content coordinates.
    property var rects: []

    visible: target !== null
    x: target ? target.x : 0
    y: target ? target.y : 0
    width: target ? target.width : 0
    height: target ? target.contentHeight : 0

    /// Geometry is only valid after the text has been laid out, so every refresh is deferred
    /// one event-loop turn: contentHeightChanged is emitted while the layout is still settling.
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

        delegate: Rectangle {
            x: modelData.x
            y: modelData.y - root.verticalPadding
            width: modelData.w
            height: modelData.h + root.verticalPadding * 2
            radius: root.radius
            color: root.chipColor
            border.color: root.borderColor
            border.width: root.borderWidth
            antialiasing: true
        }
    }
}
