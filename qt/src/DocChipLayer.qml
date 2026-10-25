// DocChipLayer.qml — Rounded background boxes painted BEHIND inline token chips.
//
// Qt's rich text cannot round corners (border-radius is not in the supported CSS subset) and
// has no inline-item API, so the pill cannot come from the text engine. This layer reads the
// line geometry of the marked fragments from ChaSetTextFragments and draws plain Rectangles.
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
    property real radius: ThemeTokens.dp(2)

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
            y: modelData.y
            width: modelData.w
            height: modelData.h
            radius: root.radius
            color: root.chipColor
            antialiasing: true
        }
    }
}
