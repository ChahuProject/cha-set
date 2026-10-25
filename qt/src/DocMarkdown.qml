// DocMarkdown.qml — Renders the runtime-parsed Markdown AST (spec/content/<docId>/<locale>.md)
// for the Living Documentation, mirroring packages/react/.../DocMarkdown.tsx.
//
// Parsing happens at RUNTIME with the SAME parser the React side imports
// (spec/shared/docAst.mjs, embedded as a module resource). The Markdown itself is embedded
// verbatim by qt_add_resources and handed over by ChaSetDocSource, so editing prose needs no
// code generation — only a rebuild.
//
// This file owns typography only: every node resolves through DocText / Typography / dp, never
// through MarkdownText (which would bypass ThemeTokens.sp scaling).
import QtQuick 6.10
import ChaSet
import "vendor/docAst.mjs" as DocAst

Column {
    id: root
    width: parent ? parent.width : ThemeTokens.dp(760)
    spacing: ThemeTokens.dp(6)

    /// Doc id matching the spec/content/<id>/ directory.
    property string docId: ""
    /// Render a single section id (incremental migration) or the whole page when empty.
    property string section: ""
    /// Native implementations for `overview` / `anatomy` / `props` slots: { "<slot>": Component }.
    property var slots: ({})

    /// Parsed page cache: "<docId>/<locale>" -> page object (null when unreadable).
    property var pageCache: ({})

    readonly property string activeLocale: (typeof ChaSetI18n !== "undefined" && ChaSetI18n.locale)
        ? ChaSetI18n.locale
        : "zh-CN"

    readonly property var page: loadPage(docId, activeLocale)

    /// DocLayout discovers outline entries from child items; expose the section identity so a
    /// markdown-driven block lands in the TOC exactly like a hand-written one.
    readonly property string sectionId: section
    readonly property string sectionTitle: {
        var entry = page;
        if (!entry || !entry.sections) return "";
        for (var i = 0; i < entry.sections.length; i += 1) {
            if (entry.sections[i].id === section) return entry.sections[i].title || "";
        }
        return "";
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

    /// QML has no file IO (XMLHttpRequest rejects the qrc scheme for sync and async alike), so
    /// the raw Markdown crosses a C++ boundary and is parsed here, at runtime.
    function readSource(id, locale) {
        return ChaSetDocSource.read(id, locale);
    }

    function loadPage(id, locale) {
        if (!id) return null;
        var key = id + "/" + locale;
        if (pageCache.hasOwnProperty(key)) return pageCache[key];

        var source = readSource(id, locale);
        if (!source) source = readSource(id, "zh-CN");
        if (!source) {
            console.warn("[DocMarkdown] no Markdown source for " + key + " (:/spec/content/)");
            pageCache[key] = null;
            return null;
        }

        var result = DocAst.buildDocAst(source);
        if (result.errors && result.errors.length > 0) {
            console.warn("[DocMarkdown] " + key + ".md dialect errors: " + result.errors.join(" | "));
        }
        pageCache[key] = result.page;
        return result.page;
    }

    function pad2(value) {
        var hex = Math.round(value * 255).toString(16);
        return hex.length < 2 ? "0" + hex : hex;
    }

    function toHex(color) {
        return "#" + pad2(color.r) + pad2(color.g) + pad2(color.b);
    }

    function esc(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    /// Same as esc(), plus quote escaping for attribute values (chip hrefs).
    function attr(value) {
        return esc(value).replace(/"/g, "&quot;");
    }

    /// Anchor href prefix that marks an inline chip. Shared with DocChipLayer.marker.
    readonly property string chipMarker: "chip:"

    /// Markdown code span → token chip.
    ///
    /// The visual pill is NOT painted here: Qt's rich text has no border-radius (CSS property
    /// not in the supported subset) and no inline-item API, so the background would be a hard
    /// rectangle that fills the whole line box. Instead the span only reserves space and marks
    /// itself with an anchor; DocChipLayer reads the fragment geometry from QTextLayout and
    /// paints a rounded Rectangle *behind* the text.
    ///
    /// The anchor is not decoration — it is the marker AND the payload: clicking a chip emits
    /// linkActivated("chip:<token>"), which is how copy-to-clipboard will be wired.
    ///
    /// Note: CSS `em` is NOT in Qt's supported subset — font-size must be an absolute px value.
    function codeSpan(value) {
        return '<a href="' + chipMarker + attr(value) + '">'
            + '<span style="font-family:' + Typography.familyMono
            + "; font-size:" + Typography.sizeSmall + "px"
            + "; text-decoration:none; color:" + toHex(ThemeTokens.text)
            + '">&nbsp;' + esc(value) + "&nbsp;</span></a>";
    }

    function inlineHtml(nodes) {
        var out = "";
        if (!nodes) return out;
        for (var i = 0; i < nodes.length; i += 1) {
            var node = nodes[i];
            if (node.t === "strong") out += "<b>" + inlineHtml(node.c) + "</b>";
            else if (node.t === "em") out += "<i>" + inlineHtml(node.c) + "</i>";
            else if (node.t === "code") out += codeSpan(node.v);
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
            readonly property bool isText: !!node && (node.t === "heading" || node.t === "para")

            function blockHeight() {
                if (!node) return 0;
                if (node.t === "table") return tableColumn.height + ThemeTokens.dp(8);
                if (node.t === "list") return listColumn.height + ThemeTokens.dp(4);
                if (node.t === "slot") return slotHost.height + ThemeTokens.dp(6);
                return textBlock.contentHeight + (node.t === "heading" ? ThemeTokens.dp(4) : ThemeTokens.dp(8));
            }

            DocChipLayer {
                target: textBlock
                marker: root.chipMarker
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
                visible: !!block.node && block.node.t === "list"
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

                        DocChipLayer {
                            target: itemText
                            marker: root.chipMarker
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

            Column {
                id: tableColumn
                visible: !!block.node && block.node.t === "table"
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
                visible: !!block.node && block.node.t === "slot"
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
