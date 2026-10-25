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

    /// Markdown heading level → doc role. Level is DATA, exactly like the React
    /// renderer: `#` is h1, `##` is h2 … and `####`+ collapses onto h4.
    function headingRole(level) {
        if (level <= 1) return "h1";
        if (level === 2) return "h2";
        if (level === 3) return "h3";
        return "h4";
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
    /// Anchor href prefix that marks one keycap. A shortcut like [[Ctrl+K]] emits one anchor
    /// per key, because each key is its own cap and the separator in between must stay bare.
    readonly property string keyMarker: "key:"

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
        // The padding cells are a *smaller* font than the token: at body size a monospace
        // space is ~6.6px per side, which makes the pill look much wider than React's
        // `px-1.5` (6px). At sizeMicro the padding lands at ~5.5px per side, matching React.
        // They stay inside the anchor so the pill still spans them.
        var pad = '<span style="font-family:' + Typography.familyMono
            + "; font-size:" + Typography.sizeMicro + "px"
            + "; text-decoration:none"
            + "; color:" + toHex(ThemeTokens.text) + '">&nbsp;</span>';

        return '<a href="' + chipMarker + attr(value) + '">' + pad
            + '<span style="font-family:' + Typography.familyMono
            + "; font-size:" + Typography.sizeSmall + "px"
            + "; text-decoration:none; color:" + toHex(ThemeTokens.text)
            + '">' + esc(value) + "</span>" + pad + "</a>";
    }

    function inlineHtml(nodes, flat) {
        var out = "";
        if (!nodes) return out;
        for (var i = 0; i < nodes.length; i += 1) {
            var node = nodes[i];
            if (node.t === "strong") out += "<b>" + inlineHtml(node.c, flat) + "</b>";
            else if (node.t === "em") out += "<i>" + inlineHtml(node.c, flat) + "</i>";
            else if (node.t === "code") out += flat ? monoSpan(node.v) : codeSpan(node.v);
            else if (node.t === "kbd") out += flat ? monoSpan(node.v) : keycapHtml(node.v);
            else out += esc(node.v);
        }
        return out;
    }

    /// Table cells are DATA, not prose. They carry no chip layer, so a `background-color`
    /// would fill the whole line box and read as a highlight band. Both stacks therefore drop
    /// the surface inside tables and keep the monospace treatment only — the cell text renders
    /// identically on the two stacks instead of being one rounded pill and one grey bar.
    function monoSpan(value) {
        return '<span style="font-family:' + Typography.familyMono
            + "; font-size:" + Typography.sizeSmall + "px"
            + "; color:" + toHex(ThemeTokens.text) + '">' + esc(value) + "</span>";
    }

    /// [[Ctrl+K]] / [[Space / Enter]] → one bordered keycap per key, bare separators between.
    /// The split comes from the shared parser so both stacks agree on where a key starts.
    function keycapHtml(value) {
        var groups = DocAst.splitShortcut(value);
        if (!groups || groups.length === 0) return esc(value);
        var out = "";
        for (var g = 0; g < groups.length; g += 1) {
            if (g > 0) out += " / ";
            for (var k = 0; k < groups[g].length; k += 1) {
                if (k > 0) out += "+";
                out += keySpan(groups[g][k]);
            }
        }
        return out;
    }

    /// One keycap, authored exactly like codeSpan(): two small padding cells around the key so
    /// the painted box hugs the glyph instead of the whole line box. The padding cells need
    /// `text-decoration:none`, otherwise the anchor's underline crosses the cap.
    function keySpan(key) {
        var pad = '<span style="font-family:' + Typography.familyMono
            + "; font-size:" + Typography.sizeMicro + "px"
            + "; text-decoration:none"
            + "; color:" + toHex(ThemeTokens.text) + '">&nbsp;</span>';
        return '<a href="' + keyMarker + attr(key) + '">' + pad
            + '<span style="font-family:' + Typography.familyMono
            + "; font-size:" + Typography.sizeSmall + "px"
            + "; text-decoration:none; color:" + toHex(ThemeTokens.text)
            + '">' + esc(key) + "</span>" + pad + "</a>";
    }

    /// ```table <schema>``` → the column descriptors ChaSetTable already consumes. The schema
    /// table itself lives in spec/shared/docAst.mjs, so React and Qt cannot disagree on what
    /// a `props` table means: both read the same kind/width list.
    function tableColumns(node) {
        var spec = DocAst.DOC_SCHEMAS[node.schema];
        var columns = [];
        for (var i = 0; i < node.head.length; i += 1) {
            var def = (spec && spec.length > i) ? spec[i] : { kind: "rich", wrap: true };
            var column = {
                key: "c" + i,
                title: DocAst.inlineText(node.head[i]).toUpperCase(),
                code: def.kind === "code",
                copyableBadge: def.kind === "copyable",
                kbd: def.kind === "kbd",
                wrap: def.kind === "rich",
                rich: def.kind === "rich"
            };
            if (def.width) column.width = def.width;
            columns.push(column);
        }
        return columns;
    }

    function tableRows(node) {
        var spec = DocAst.DOC_SCHEMAS[node.schema];
        var rows = [];
        for (var r = 0; r < node.rows.length; r += 1) {
            var record = {};
            for (var c = 0; c < node.rows[r].length; c += 1) {
                var def = (spec && spec.length > c) ? spec[c] : { kind: "rich" };
                if (def.kind === "rich") {
                    record["c" + c] = inlineHtml(node.rows[r][c], true);
                } else {
                    var text = DocAst.inlineText(node.rows[r][c]);
                    // An authored empty default cell would render as an empty badge; the em
                    // dash is what "no default" looks like everywhere else in the showcase.
                    record["c" + c] = (def.kind === "copyable" && text === "") ? "—" : text;
                }
            }
            rows.push(record);
        }
        return rows;
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
                if (node.t === "table") return tableTable.implicitHeight + ThemeTokens.dp(8);
                if (node.t === "list") return listColumn.height + ThemeTokens.dp(4);
                if (node.t === "slot") return slotHost.height + ThemeTokens.dp(6);
                return textBlock.contentHeight + (node.t === "heading" ? ThemeTokens.dp(4) : ThemeTokens.dp(8));
            }

            DocChipLayer {
                target: textBlock
                marker: root.chipMarker
            }

            /// Keycaps sit behind the text exactly like the token pills do, but with a hairline
            /// outline instead of a lighter fill. Two layers, same geometry source.
            DocChipLayer {
                target: textBlock
                marker: root.keyMarker
                chipColor: ThemeTokens.panel
                borderColor: ThemeTokens.border
                borderWidth: ThemeTokens.dp(1)
                radius: ThemeTokens.dp(4)
                verticalPadding: ThemeTokens.dp(7) / 2
            }

            DocText {
                id: textBlock
                visible: block.isText
                width: block.width
                role: block.node && block.node.t === "heading" ? root.headingRole(block.node.level) : "p"
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

                        DocChipLayer {
                            target: itemText
                            marker: root.keyMarker
                            chipColor: ThemeTokens.panel
                            borderColor: ThemeTokens.border
                            borderWidth: ThemeTokens.dp(1)
                            radius: ThemeTokens.dp(4)
                            verticalPadding: ThemeTokens.dp(7) / 2
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

            /// Tables are delegated to the design system's own table, driven by the column
            /// descriptors from the shared schema: a Markdown `props` table therefore lands on
            /// the same chrome (header strip, borders, copyable badges, keycaps) as the
            /// hand-written PropsTable instead of being painted a second time here.
            ChaSetTable {
                id: tableTable
                visible: !!block.node && block.node.t === "table"
                width: block.width
                height: implicitHeight
                interactive: false
                columns: (block.node && block.node.t === "table") ? root.tableColumns(block.node) : []
                rows: (block.node && block.node.t === "table") ? root.tableRows(block.node) : []
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
