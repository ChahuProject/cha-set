// DocMarkdown.qml — Renders the single-sourced Markdown AST (spec/content/<docId>/<locale>.md)
// for the Living Documentation, mirroring packages/react/.../DocMarkdown.tsx.
//
// Prose is authored once; this file owns typography and spacing only. Every text node goes
// through DocText so sizes resolve from Typography (which is ThemeTokens.sp-scaled), and the
// copyable chip row is derived from the AST instead of being hand-written per page.
import QtQuick 6.10
import ChaSet

Column {
    id: root
    width: parent ? parent.width : ThemeTokens.dp(760)
    spacing: ThemeTokens.dp(6)

    /// Doc id matching the spec/content/<id>/ directory.
    property string docId: ""
    /// Render a single section id (incremental migration) or the whole page when empty.
    property string section: ""
    /// Native implementations for `demo` / `anatomy` / `props` slots: { "<slot>": Component }.
    property var slots: ({})

    /// DocLayout discovers outline entries from child items; expose the section identity so a
    /// markdown-driven block lands in the TOC exactly like a hand-written one.
    readonly property string sectionId: section
    readonly property string sectionTitle: {
        if (!page || !page.sections) return "";
        for (var i = 0; i < page.sections.length; i += 1) {
            if (page.sections[i].id === section) return page.sections[i].title || "";
        }
        return "";
    }

    readonly property string activeLocale: (typeof ChaSetI18n !== "undefined" && ChaSetI18n.locale)
        ? ChaSetI18n.locale
        : "zh-CN"

    readonly property var page: {
        if (!docId || typeof DocContent === "undefined" || !DocContent.pages) return null;
        var byLocale = DocContent.pages[docId];
        if (!byLocale) return null;
        return byLocale[activeLocale] || byLocale[DocContent.defaultLocale] || null;
    }

    readonly property var blocks: {
        var out = [];
        if (!page || !page.sections) return out;
        for (var i = 0; i < page.sections.length; i += 1) {
            var entry = page.sections[i];
            if (section !== "" && entry.id !== section) continue;
            for (var j = 0; j < entry.blocks.length; j += 1) out.push(entry.blocks[j]);
        }
        return out;
    }

    function esc(value) {        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    function monoSpan(value) {
        return '<span style="font-family:' + Typography.familyMono + '">' + esc(value) + "</span>";
    }

    function inlineHtml(nodes) {
        var out = "";
        if (!nodes) return out;
        for (var i = 0; i < nodes.length; i += 1) {
            var node = nodes[i];
            if (node.t === "strong") out += "<b>" + inlineHtml(node.c) + "</b>";
            else if (node.t === "em") out += "<i>" + inlineHtml(node.c) + "</i>";
            else if (node.t === "code" || node.t === "token") out += monoSpan(node.v);
            else out += esc(node.v);
        }
        return out;
    }

    Repeater {
        model: root.blocks
        delegate: Item {
            id: block
            width: root.width
            height: blockHeight()
            readonly property var node: modelData
            readonly property bool isText: node && (node.t === "heading" || node.t === "para")

            function blockHeight() {
                if (!node) return 0;
                if (node.t === "chips") return chipFlow.height + ThemeTokens.dp(6);
                if (node.t === "table") return tableColumn.height + ThemeTokens.dp(8);
                if (node.t === "list") return listColumn.height + ThemeTokens.dp(4);
                if (node.t === "slot") return slotHost.height + ThemeTokens.dp(6);
                return textBlock.contentHeight + (node.t === "heading" ? ThemeTokens.dp(4) : ThemeTokens.dp(8));
            }

            DocText {
                id: textBlock
                visible: block.isText
                width: block.width
                role: block.node && block.node.t === "heading" ? "h2" : "p"
                textFormat: TextEdit.RichText
                color: block.node && block.node.t === "heading" ? ThemeTokens.text : ThemeTokens.subduedText
                text: visible ? root.inlineHtml(block.node.inlines) : ""
            }

            Column {
                id: listColumn
                visible: block.node && block.node.t === "list"
                width: block.width
                spacing: ThemeTokens.dp(6)

                Repeater {
                    model: block.node && block.node.t === "list" ? block.node.items : []

                    delegate: Item {
                        width: listColumn.width
                        height: itemText.contentHeight

                        DocText {
                            id: bulletDot
                            role: "p"
                            wrap: false
                            color: ThemeTokens.text
                            text: block.node && block.node.ordered ? (index + 1) + "." : "\u2022"
                        }

                        DocText {
                            id: itemText
                            x: ThemeTokens.dp(16)
                            width: parent.width - ThemeTokens.dp(16)
                            role: "p"
                            textFormat: TextEdit.RichText
                            color: ThemeTokens.text
                            text: root.inlineHtml(modelData)
                        }
                    }
                }
            }

            Flow {
                id: chipFlow
                visible: block.node && block.node.t === "chips"
                width: block.width
                spacing: ThemeTokens.dp(8)

                Repeater {
                    model: block.node && block.node.t === "chips" ? block.node.tokens : []

                    ChaSetCopyableBadge {
                        text: modelData
                        size: "sm"
                    }
                }
            }

            Column {
                id: tableColumn
                visible: block.node && block.node.t === "table"
                width: block.width
                spacing: 0

                readonly property var allRows: (block.node && block.node.t === "table")
                    ? [block.node.head].concat(block.node.rows)
                    : []
                readonly property int columnCount: allRows.length > 0 ? allRows[0].length : 1

                Repeater {
                    model: tableColumn.allRows

                    delegate: Item {
                        id: rowItem
                        width: tableColumn.width
                        height: rowHost.height + ThemeTokens.dp(10)
                        readonly property bool isHeaderRow: index === 0

                        Row {
                            id: rowHost
                            width: parent.width
                            spacing: 0

                            Repeater {
                                model: modelData

                                delegate: DocText {
                                    role: "p"
                                    width: tableColumn.width / tableColumn.columnCount
                                    color: rowItem.isHeaderRow ? ThemeTokens.text : ThemeTokens.subduedText
                                    textFormat: TextEdit.RichText
                                    text: root.inlineHtml(modelData)
                                }
                            }
                        }

                        Rectangle {
                            y: rowHost.height + ThemeTokens.dp(4)
                            width: parent.width
                            height: 1
                            color: ThemeTokens.border
                            opacity: rowItem.isHeaderRow ? 1.0 : 0.4
                        }
                    }
                }
            }

            Loader {
                id: slotHost
                visible: block.node && block.node.t === "slot"
                width: block.width
                sourceComponent: (block.node && block.node.t === "slot")
                    ? (root.slots[block.node.name] ? root.slots[block.node.name] : null)
                    : null

                onLoaded: {
                    if (item) item.width = Qt.binding(function() { return block.width; });
                }
            }
        }
    }
}
