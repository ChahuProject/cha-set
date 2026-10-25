/**
 * docAst.mjs — the single Markdown → AST parser for ChaSet living documentation.
 *
 * Shared verbatim by both stacks at RUNTIME:
 *   React:  import { buildDocAst } from '.../spec/shared/docAst.mjs'   (Vite)
 *   Qt:     import "vendor/docAst.mjs" as DocAst                        (QML JS engine)
 *
 * Because the Qt QML engine compiles this file, the body is written in ES5 syntax
 * (var / function / no arrow functions, template literals, optional chaining or
 * destructuring). Export syntax is required and supported by both engines.
 *
 * The dialect is a closed whitelist: anything outside it is reported as an error instead
 * of being silently swallowed, because a dropped node renders as blank space on one stack.
 *
 * Blocks: heading (##/###), paragraph, unordered/ordered list, GFM table, slot fence.
 * Inline: `code`, **strong**, *em*.
 * Slots: ```overview```, ```anatomy```, ```props``` delegate to native code.
 */

export var DOC_SLOTS = ["overview", "anatomy", "props"];

var RE_FENCE = /^```(\S*)\s*$/;
var RE_HEADING = /^(#{2,3})\s+(.*)$/;
var RE_UL = /^[-*]\s+(.*)$/;
var RE_OL = /^(\d+)\.\s+(.*)$/;
var RE_TABLE_ROW = /^\|/;
var RE_TABLE_DELIM = /^\|?[\s:|-]+\|[\s:|-]*$/;
var RE_HEADING_ID = /\{#([\w-]+)\}\s*$/;

function isCJK(ch) {
  if (!ch) return false;
  var code = ch.charCodeAt(0);
  return code >= 0x2e80;
}

/** Soft line breaks join with a space for latin text and directly for CJK. */
function joinSoft(left, right) {
  if (!left) return right;
  if (!right) return left;
  if (isCJK(left.charAt(left.length - 1)) || isCJK(right.charAt(0))) return left + right;
  return left + " " + right;
}

export function parseFrontMatter(source) {
  var errors = [];
  var meta = {};
  var match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source);
  if (!match) {
    errors.push("missing front matter block (--- ... ---)");
    return { meta: meta, body: source, errors: errors };
  }
  var lines = match[1].split(/\r?\n/);
  for (var i = 0; i < lines.length; i += 1) {
    var line = lines[i].replace(/^\s+|\s+$/g, "");
    if (!line || line.charAt(0) === "#") continue;
    var idx = line.indexOf(":");
    if (idx < 0) {
      errors.push('front matter line is not "key: value" -> ' + line);
      continue;
    }
    meta[line.slice(0, idx).replace(/\s+$/, "")] = line.slice(idx + 1).replace(/^\s+/, "");
  }
  return { meta: meta, body: source.slice(match[0].length), errors: errors };
}

/** Inline scanner: `code`, **strong**, *em*. Everything else stays literal text. */
export function parseInline(text) {
  var out = [];
  var buffer = "";

  function flush() {
    if (buffer) {
      out.push({ t: "text", v: buffer });
      buffer = "";
    }
  }

  var i = 0;
  while (i < text.length) {
    var ch = text.charAt(i);

    if (ch === "`") {
      var codeEnd = text.indexOf("`", i + 1);
      if (codeEnd > i + 1) {
        flush();
        out.push({ t: "code", v: text.slice(i + 1, codeEnd) });
        i = codeEnd + 1;
        continue;
      }
    }

    if (ch === "*" && text.charAt(i + 1) === "*") {
      var strongEnd = text.indexOf("**", i + 2);
      if (strongEnd > i + 2) {
        flush();
        out.push({ t: "strong", c: parseInline(text.slice(i + 2, strongEnd)) });
        i = strongEnd + 2;
        continue;
      }
    }

    if (ch === "*") {
      var emEnd = text.indexOf("*", i + 1);
      if (emEnd > i + 1) {
        flush();
        out.push({ t: "em", c: parseInline(text.slice(i + 1, emEnd)) });
        i = emEnd + 1;
        continue;
      }
    }

    buffer += ch;
    i += 1;
  }

  flush();
  return out;
}

function splitTableRow(line) {
  var inner = line.replace(/^\s*\|/, "").replace(/\|\s*$/, "");
  var cells = inner.split("|");
  for (var i = 0; i < cells.length; i += 1) cells[i] = cells[i].replace(/^\s+|\s+$/g, "");
  return cells;
}

function plainInline(nodes) {
  var text = "";
  for (var i = 0; i < nodes.length; i += 1) {
    var node = nodes[i];
    if (node.c) text += plainInline(node.c);
    else text += node.v;
  }
  return text.replace(/^\s+|\s+$/g, "");
}

function slugFallback(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Parse one Markdown document into the cross-stack AST.
 * Returns { page, errors }: `page` is null when the front matter is unusable.
 */
export function buildDocAst(source) {
  var front = parseFrontMatter(source);
  var errors = front.errors.slice();
  var meta = front.meta;
  var lines = front.body.split(/\r?\n/);

  var required = ["id", "component", "category", "title", "description"];
  for (var r = 0; r < required.length; r += 1) {
    if (!meta[required[r]]) errors.push('front matter is missing "' + required[r] + '"');
  }

  var sections = [];
  var current = { id: "intro", title: "", blocks: [] };

  function pushSection() {
    if (current.blocks.length > 0) sections.push(current);
  }

  var i = 0;
  while (i < lines.length) {
    var raw = lines[i];
    var line = raw.replace(/\s+$/, "");
    var trimmed = line.replace(/^\s+/, "");

    if (!trimmed) {
      i += 1;
      continue;
    }

    var fence = RE_FENCE.exec(trimmed);
    if (fence) {
      var slot = fence[1];
      var closed = false;
      i += 1;
      while (i < lines.length) {
        if (/^```\s*$/.test(lines[i].replace(/\s+$/, ""))) {
          closed = true;
          i += 1;
          break;
        }
        i += 1;
      }
      if (!closed) errors.push("unclosed code fence at line " + i);
      if (DOC_SLOTS.indexOf(slot) < 0) {
        errors.push('fenced block "' + (slot || "(none)") + '" is not a known slot (' + DOC_SLOTS.join(", ") + ")");
      } else {
        current.blocks.push({ t: "slot", name: slot });
      }
      continue;
    }

    if (trimmed.charAt(0) === ">") {
      errors.push("blockquotes are not part of the dialect (line " + (i + 1) + ")");
      i += 1;
      continue;
    }
    if (trimmed.charAt(0) === "<") {
      errors.push("raw HTML is not part of the dialect (line " + (i + 1) + ")");
      i += 1;
      continue;
    }
    if (trimmed.indexOf("![") >= 0) {
      errors.push("images are not part of the dialect (line " + (i + 1) + ")");
      i += 1;
      continue;
    }

    var heading = RE_HEADING.exec(trimmed);
    if (heading) {
      var level = heading[1].length;
      var text = heading[2];
      var idMatch = RE_HEADING_ID.exec(text);
      var id = idMatch ? idMatch[1] : "";
      var headingText = idMatch ? text.slice(0, idMatch.index) : text;
      var inlines = parseInline(headingText);
      if (!id) id = slugFallback(plainInline(inlines));
      if (!id) errors.push('heading "' + plainInline(inlines) + '" needs an explicit "{#id}"');
      if (level === 2) {
        pushSection();
        current = { id: id || "section", title: plainInline(inlines), blocks: [] };
      }
      current.blocks.push({ t: "heading", level: level, id: id || "section", inlines: inlines });
      i += 1;
      continue;
    }

    if (RE_TABLE_ROW.test(trimmed) && i + 1 < lines.length && RE_TABLE_DELIM.test(lines[i + 1].replace(/\s+$/, ""))) {
      var head = splitTableRow(trimmed);
      var rows = [];
      i += 2;
      while (i < lines.length && RE_TABLE_ROW.test(lines[i].replace(/^\s+/, ""))) {
        rows.push(splitTableRow(lines[i]));
        i += 1;
      }
      var headCells = [];
      for (var h = 0; h < head.length; h += 1) headCells.push(parseInline(head[h]));
      var rowCells = [];
      for (var rr = 0; rr < rows.length; rr += 1) {
        var cells = [];
        for (var cc = 0; cc < rows[rr].length; cc += 1) cells.push(parseInline(rows[rr][cc]));
        rowCells.push(cells);
      }
      current.blocks.push({ t: "table", head: headCells, rows: rowCells });
      continue;
    }

    if (RE_UL.test(trimmed) || RE_OL.test(trimmed)) {
      var ordered = RE_OL.test(trimmed);
      var items = [];
      while (i < lines.length) {
        var itemLine = lines[i].replace(/\s+$/, "");
        var itemTrimmed = itemLine.replace(/^\s+/, "");
        var matchItem = ordered ? RE_OL.exec(itemTrimmed) : RE_UL.exec(itemTrimmed);
        if (matchItem) {
          if (itemLine.length !== itemTrimmed.length) {
            errors.push("nested lists are not part of the dialect (line " + (i + 1) + ")");
          }
          items.push(ordered ? matchItem[2] : matchItem[1]);
          i += 1;
          continue;
        }
        if (!itemTrimmed) break;
        // Continuation line of the previous item (indented, not a new block).
        if (/^\s{2,}\S/.test(itemLine) && items.length > 0) {
          items[items.length - 1] = joinSoft(items[items.length - 1], itemTrimmed);
          i += 1;
          continue;
        }
        break;
      }
      var parsedItems = [];
      for (var it = 0; it < items.length; it += 1) parsedItems.push(parseInline(items[it]));
      current.blocks.push({ t: "list", ordered: ordered, items: parsedItems });
      continue;
    }

    // Paragraph: consume consecutive plain lines.
    var paragraph = trimmed;
    i += 1;
    while (i < lines.length) {
      var nextRaw = lines[i];
      var next = nextRaw.replace(/^\s+/, "").replace(/\s+$/, "");
      if (!next) break;
      if (RE_HEADING.test(next) || RE_FENCE.test(next) || RE_UL.test(next) || RE_OL.test(next)) break;
      if (RE_TABLE_ROW.test(next) && i + 1 < lines.length && RE_TABLE_DELIM.test(lines[i + 1].replace(/\s+$/, ""))) break;
      if (next.charAt(0) === ">" || next.charAt(0) === "<") break;
      paragraph = joinSoft(paragraph, next);
      i += 1;
    }
    current.blocks.push({ t: "para", inlines: parseInline(paragraph) });
  }

  pushSection();

  var usable = !!(meta.id && meta.title);
  return {
    errors: errors,
    page: usable
      ? {
          id: meta.id,
          component: meta.component || meta.id,
          category: meta.category,
          title: meta.title,
          description: meta.description,
          sections: sections,
        }
      : null,
  };
}

/** Section ids in document order — used by gates to compare stacks and locales. */
export function sectionIds(page) {
  var ids = [];
  if (!page) return ids;
  for (var i = 0; i < page.sections.length; i += 1) ids.push(page.sections[i].id);
  return ids;
}

/** Slot names referenced by a page, in document order. */
export function slotNames(page) {
  var names = [];
  if (!page) return names;
  for (var i = 0; i < page.sections.length; i += 1) {
    var blocks = page.sections[i].blocks;
    for (var b = 0; b < blocks.length; b += 1) {
      if (blocks[b].t === "slot" && names.indexOf(blocks[b].name) < 0) names.push(blocks[b].name);
    }
  }
  return names;
}
