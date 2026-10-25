// DocSectionHeader.qml — the block-level composition of the doc type scale.
// Mirrors packages/react/examples/basic/src/components/SectionHeader.tsx.
//
// This is where composition belongs. A heading is not a component (it is a
// role), but *title + optional description with the right vertical rhythm*
// repeats across the showcase, and that pattern IS worth naming. Both text
// children route through DocText, so the typography still comes from DocRoles —
// never from a hand-written font.pixelSize.
//
// Exposing `sectionId` / `sectionTitle` registers the header as an outline
// entry in DocLayout (case 4 of its scanner), so a page can drop a header in
// and get its TOC row for free.
import QtQuick
import ChaSet

Column {
    id: root
    width: parent ? parent.width : implicitWidth
    spacing: ThemeTokens.dp(4)
    bottomPadding: ThemeTokens.dp(12)

    /// Outline id (DocLayout scanSections). Empty = not in the outline.
    property string sectionId: ""
    /// Outline title — the scanned header text, kept as a stable property name.
    readonly property string sectionTitle: root.title

    property string title: ""
    property string description: ""
    /// Title role: "h2" for page sections, "h3" for nested groups.
    property string level: "h2"

    DocText {
        id: titleText
        role: root.level
        text: root.title
        width: parent.width
        wrap: true
        visible: root.title !== ""
    }

    DocText {
        role: "p"
        text: root.description
        width: parent.width
        wrap: true
        visible: root.description !== ""
    }
}
