pragma Singleton
import QtQuick

// GENERATED FILE - DO NOT EDIT.
// Source: spec/highlight/languages.json + spec/highlight/engine.mjs
//         via spec/generators/generate-highlight.mjs
// Refresh: pnpm gen:highlight  (or pnpm gen:all)
//
// Identical lexer source to the React target; only this wrapper differs.

QtObject {
    id: root

    readonly property var api: root.createApi()

    function createApi() {
        var LANGUAGES = {
  "version": 1,
  "comment": "Single source of truth for syntax highlighting rules across React and Qt. Consumed by spec/highlight/engine.mjs and emitted to both stacks by spec/generators/generate-highlight.mjs. Never import a third-party highlighter: the rules must be plain data so both stacks tokenize identically. Patterns must stay ES5-compatible (no lookbehind) so Qt's V4 engine can run them.",
  "tokenTypes": [
    "plain",
    "keyword",
    "constant",
    "type",
    "string",
    "number",
    "comment",
    "function",
    "property",
    "operator",
    "punctuation",
    "variable",
    "tag",
    "attribute"
  ],
  "aliases": {
    "js": "ts",
    "jsx": "ts",
    "ts": "ts",
    "tsx": "ts",
    "mjs": "ts",
    "cjs": "ts",
    "typescript": "ts",
    "javascript": "ts",
    "qml": "qml",
    "json": "json",
    "jsonc": "json",
    "bash": "bash",
    "sh": "bash",
    "shell": "bash",
    "zsh": "bash",
    "console": "bash",
    "css": "css",
    "scss": "css",
    "less": "css",
    "html": "html",
    "xml": "html",
    "svg": "html",
    "vue": "html",
    "python": "python",
    "py": "python",
    "yaml": "yaml",
    "yml": "yaml",
    "text": "text",
    "txt": "text",
    "plain": "text",
    "plaintext": "text",
    "md": "text",
    "markdown": "text"
  },
  "languages": {
    "ts": {
      "displayName": "TSX",
      "lineComment": [
        "//"
      ],
      "blockComment": [
        [
          "/*",
          "*/"
        ]
      ],
      "strings": [
        {
          "open": "`",
          "close": "`",
          "escape": true,
          "multiline": true
        },
        {
          "open": "'",
          "close": "'",
          "escape": true
        },
        {
          "open": "\"",
          "close": "\"",
          "escape": true
        }
      ],
      "identifier": "[A-Za-z_$][A-Za-z0-9_$]*",
      "number": "0[xX][0-9a-fA-F_]+|0[bB][01_]+|0[oO][0-7_]+|\\d[\\d_]*(?:\\.\\d[\\d_]*)?(?:[eE][+-]?\\d+)?n?",
      "operator": "=>|\\.\\.\\.|\\?\\?|\\?\\.|&&|\\|\\||[+\\-*/%=<>!&|^~?:]",
      "punctuation": "[{}()\\[\\],;.]",
      "keywords": [
        "abstract",
        "as",
        "async",
        "await",
        "break",
        "case",
        "catch",
        "class",
        "const",
        "continue",
        "declare",
        "default",
        "delete",
        "do",
        "else",
        "enum",
        "export",
        "extends",
        "finally",
        "for",
        "from",
        "function",
        "get",
        "if",
        "implements",
        "import",
        "in",
        "instanceof",
        "interface",
        "keyof",
        "let",
        "namespace",
        "new",
        "of",
        "private",
        "protected",
        "public",
        "readonly",
        "return",
        "satisfies",
        "set",
        "static",
        "super",
        "switch",
        "this",
        "throw",
        "try",
        "type",
        "typeof",
        "var",
        "void",
        "while",
        "yield"
      ],
      "constants": [
        "true",
        "false",
        "null",
        "undefined",
        "NaN",
        "Infinity"
      ],
      "types": [
        "any",
        "bigint",
        "boolean",
        "never",
        "number",
        "object",
        "string",
        "symbol",
        "unknown",
        "Array",
        "Promise",
        "Record",
        "Map",
        "Set",
        "Date",
        "Error",
        "React",
        "HTMLElement",
        "JSX"
      ],
      "builtins": [
        "console",
        "JSON",
        "Math",
        "Object",
        "String",
        "Number",
        "Boolean",
        "document",
        "window",
        "process",
        "require",
        "parseInt",
        "parseFloat",
        "setTimeout",
        "setInterval",
        "fetch",
        "clsx"
      ],
      "classifyUpperAsType": true
    },
    "qml": {
      "displayName": "QML",
      "lineComment": [
        "//"
      ],
      "blockComment": [
        [
          "/*",
          "*/"
        ]
      ],
      "strings": [
        {
          "open": "`",
          "close": "`",
          "escape": true,
          "multiline": true
        },
        {
          "open": "'",
          "close": "'",
          "escape": true
        },
        {
          "open": "\"",
          "close": "\"",
          "escape": true
        }
      ],
      "identifier": "[A-Za-z_$][A-Za-z0-9_$]*",
      "number": "\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?",
      "operator": "=>|\\.\\.\\.|\\?\\?|===|!==|&&|\\|\\||[+\\-*/%=<>!&|^~?:]",
      "punctuation": "[{}()\\[\\],;.]",
      "keywords": [
        "as",
        "alias",
        "break",
        "case",
        "catch",
        "continue",
        "default",
        "do",
        "else",
        "enum",
        "finally",
        "for",
        "function",
        "id",
        "if",
        "import",
        "in",
        "instanceof",
        "new",
        "on",
        "property",
        "readonly",
        "required",
        "return",
        "signal",
        "switch",
        "this",
        "throw",
        "try",
        "typeof",
        "var",
        "while",
        "with"
      ],
      "constants": [
        "true",
        "false",
        "null",
        "undefined",
        "Infinity",
        "NaN"
      ],
      "types": [
        "QtObject",
        "Item",
        "Rectangle",
        "Text",
        "Column",
        "Row",
        "Grid",
        "Flow",
        "Repeater",
        "ItemDelegate",
        "ListView",
        "GridView",
        "Flickable",
        "Timer",
        "Component",
        "Connections",
        "Loader",
        "MouseArea",
        "TextEdit",
        "TextField",
        "Image",
        "Font",
        "Qt",
        "Math",
        "Console",
        "JSON"
      ],
      "builtins": [
        "anchors",
        "parent",
        "children"
      ],
      "extra": [
        {
          "type": "function",
          "pattern": "on[A-Z][A-Za-z0-9_]*"
        },
        {
          "type": "number",
          "pattern": "#[0-9a-fA-F]{3,8}\\b"
        }
      ],
      "classifyUpperAsType": true
    },
    "json": {
      "displayName": "JSON",
      "strings": [
        {
          "open": "\"",
          "close": "\"",
          "escape": true,
          "multiline": true
        }
      ],
      "identifier": "[A-Za-z_$][A-Za-z0-9_$]*",
      "number": "-?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?",
      "punctuation": "[{}\\[\\],:]",
      "constants": [
        "true",
        "false",
        "null"
      ],
      "propertyLookahead": true
    },
    "bash": {
      "displayName": "BASH",
      "lineComment": [
        "#"
      ],
      "strings": [
        {
          "open": "'",
          "close": "'",
          "escape": false,
          "multiline": true
        },
        {
          "open": "\"",
          "close": "\"",
          "escape": true,
          "multiline": true
        }
      ],
      "identifier": "[A-Za-z_][A-Za-z0-9_]*",
      "number": "\\b\\d+\\b",
      "operator": "\\|\\||&&|>>|<<|[|&<>]",
      "punctuation": "[{}()\\[\\];,]",
      "keywords": [
        "if",
        "then",
        "else",
        "elif",
        "fi",
        "for",
        "while",
        "until",
        "do",
        "done",
        "case",
        "esac",
        "in",
        "function",
        "return",
        "local",
        "export",
        "declare",
        "readonly",
        "set",
        "unset",
        "source",
        "alias",
        "exit",
        "shift",
        "exec",
        "trap",
        "eval",
        "test"
      ],
      "constants": [
        "true",
        "false"
      ],
      "builtins": [
        "echo",
        "cd",
        "ls",
        "cat",
        "rm",
        "cp",
        "mv",
        "mkdir",
        "touch",
        "grep",
        "sed",
        "awk",
        "find",
        "git",
        "node",
        "npm",
        "pnpm",
        "yarn",
        "npx",
        "python",
        "pip",
        "docker",
        "curl",
        "chmod",
        "sudo",
        "make",
        "cmake",
        "lefthook"
      ],
      "extra": [
        {
          "type": "variable",
          "pattern": "\\$\\{[^}]*\\}"
        },
        {
          "type": "variable",
          "pattern": "\\$[A-Za-z_][A-Za-z0-9_]*"
        },
        {
          "type": "variable",
          "pattern": "\\$[0-9@*?#]"
        },
        {
          "type": "operator",
          "pattern": "-{1,2}[A-Za-z][A-Za-z0-9-]*"
        }
      ],
      "classifyLineStartAsFunction": true
    },
    "css": {
      "displayName": "CSS",
      "blockComment": [
        [
          "/*",
          "*/"
        ]
      ],
      "strings": [
        {
          "open": "\"",
          "close": "\"",
          "escape": true
        },
        {
          "open": "'",
          "close": "'",
          "escape": true
        }
      ],
      "identifier": "-?[A-Za-z_][A-Za-z0-9_-]*",
      "number": "\\d+(?:\\.\\d+)?(?:px|em|rem|vh|vw|vmin|vmax|%|s|ms|deg|fr|ch|ex|pt)?",
      "punctuation": "[{}:;,.]",
      "keywords": [
        "important",
        "media",
        "supports",
        "keyframes",
        "import",
        "charset",
        "layer",
        "container"
      ],
      "properties": [
        "align-items",
        "background",
        "background-color",
        "border",
        "border-radius",
        "bottom",
        "box-shadow",
        "color",
        "content",
        "cursor",
        "display",
        "flex",
        "flex-direction",
        "font",
        "font-family",
        "font-size",
        "font-weight",
        "gap",
        "grid",
        "height",
        "justify-content",
        "left",
        "line-height",
        "margin",
        "max-height",
        "max-width",
        "min-height",
        "min-width",
        "opacity",
        "overflow",
        "padding",
        "position",
        "right",
        "top",
        "transform",
        "transition",
        "width",
        "z-index"
      ],
      "extra": [
        {
          "type": "keyword",
          "pattern": "@[A-Za-z-]+"
        },
        {
          "type": "constant",
          "pattern": "#[0-9a-fA-F]{3,8}\\b"
        },
        {
          "type": "type",
          "pattern": "\\.[A-Za-z_-][A-Za-z0-9_-]*"
        },
        {
          "type": "variable",
          "pattern": "--[A-Za-z_-][A-Za-z0-9_-]*"
        }
      ]
    },
    "html": {
      "displayName": "HTML",
      "strings": [
        {
          "open": "\"",
          "close": "\"",
          "escape": false
        },
        {
          "open": "'",
          "close": "'",
          "escape": false
        }
      ],
      "blockComment": [
        [
          "<!--",
          "-->"
        ]
      ],
      "identifier": "[A-Za-z_][A-Za-z0-9_:.-]*",
      "number": "\\b\\d+(?:\\.\\d+)?\\b",
      "punctuation": "[<>/=]",
      "tagPosition": true,
      "attributeFollowsEquals": true
    },
    "python": {
      "displayName": "PYTHON",
      "lineComment": [
        "#"
      ],
      "strings": [
        {
          "open": "\"\"\"",
          "close": "\"\"\"",
          "escape": true,
          "multiline": true
        },
        {
          "open": "'''",
          "close": "'''",
          "escape": true,
          "multiline": true
        },
        {
          "open": "\"",
          "close": "\"",
          "escape": true
        },
        {
          "open": "'",
          "close": "'",
          "escape": true
        }
      ],
      "identifier": "[A-Za-z_][A-Za-z0-9_]*",
      "number": "0[xX][0-9a-fA-F_]+|0[bB][01_]+|\\d[\\d_]*(?:\\.\\d[\\d_]*)?(?:[eE][+-]?\\d+)?j?",
      "operator": "\\*\\*|//|->|:=|==|!=|<=|>=|[+\\-*/%=<>!&|^~]",
      "punctuation": "[{}()\\[\\],;.:@]",
      "keywords": [
        "and",
        "as",
        "assert",
        "async",
        "await",
        "break",
        "class",
        "continue",
        "def",
        "del",
        "elif",
        "else",
        "except",
        "finally",
        "for",
        "from",
        "global",
        "if",
        "import",
        "in",
        "is",
        "lambda",
        "nonlocal",
        "not",
        "or",
        "pass",
        "raise",
        "return",
        "try",
        "while",
        "with",
        "yield"
      ],
      "constants": [
        "True",
        "False",
        "None"
      ],
      "types": [
        "str",
        "int",
        "float",
        "bool",
        "bytes",
        "list",
        "dict",
        "set",
        "tuple",
        "object",
        "Exception"
      ],
      "builtins": [
        "print",
        "len",
        "range",
        "open",
        "super",
        "self",
        "isinstance",
        "enumerate",
        "zip",
        "sum",
        "min",
        "max",
        "abs",
        "sorted",
        "reversed"
      ],
      "classifyUpperAsType": true
    },
    "yaml": {
      "displayName": "YAML",
      "lineComment": [
        "#"
      ],
      "strings": [
        {
          "open": "\"",
          "close": "\"",
          "escape": true
        },
        {
          "open": "'",
          "close": "'",
          "escape": false
        }
      ],
      "identifier": "[A-Za-z_][A-Za-z0-9_.-]*",
      "number": "\\b\\d+(?:\\.\\d+)?\\b",
      "punctuation": "[:\\-?]",
      "constants": [
        "true",
        "false",
        "null",
        "yes",
        "no",
        "on",
        "off"
      ],
      "propertyLookahead": true
    },
    "text": {
      "displayName": "TEXT",
      "plain": true
    }
  }
};

var HL_CACHE = {};
var HL_STICKY_OK = (function () {
  try {
    var probe = new RegExp('a', 'y');
    probe.lastIndex = 0;
    return probe.test('a');
  } catch (e) {
    return false;
  }
})();

function hlEscapeRegExpLiteral(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hlCompile(pattern) {
  if (!pattern) return null;
  try {
    return HL_STICKY_OK ? new RegExp('(?:' + pattern + ')', 'y') : new RegExp('^(?:' + pattern + ')');
  } catch (e) {
    return null;
  }
}

function hlMatch(rule, source, pos) {
  if (!rule) return null;
  if (HL_STICKY_OK) {
    rule.lastIndex = pos;
    var m = rule.exec(source);
    return m && m.index === pos ? m[0] : null;
  }
  var m2 = rule.exec(source.slice(pos));
  return m2 ? m2[0] : null;
}

function hlStartsWith(source, pos, text) {
  return source.slice(pos, pos + text.length) === text;
}

function hlToSet(list) {
  var set = {};
  if (list) {
    for (var i = 0; i < list.length; i++) set[list[i]] = true;
  }
  return set;
}

function hlBuildRules(lang) {
  var rules = {};
  rules.ws = hlCompile('[ \\t\\r\\n\\f\\v]+');

  if (lang.blockComment && lang.blockComment.length) {
    var blocks = [];
    for (var i = 0; i < lang.blockComment.length; i++) {
      var pair = lang.blockComment[i];
      blocks.push(hlEscapeRegExpLiteral(pair[0]) + '[\\s\\S]*?(?:' + hlEscapeRegExpLiteral(pair[1]) + '|$)');
    }
    rules.blockComment = hlCompile(blocks.join('|'));
  }

  if (lang.lineComment && lang.lineComment.length) {
    var lines = [];
    for (var j = 0; j < lang.lineComment.length; j++) lines.push(hlEscapeRegExpLiteral(lang.lineComment[j]));
    rules.lineComment = hlCompile('(?:' + lines.join('|') + ')[^\\n]*');
  }

  rules.number = hlCompile(lang.number);
  rules.identifier = hlCompile(lang.identifier || '[A-Za-z_$][A-Za-z0-9_$]*');
  rules.operator = hlCompile(lang.operator);
  rules.punctuation = hlCompile(lang.punctuation);

  rules.extra = [];
  if (lang.extra) {
    for (var k = 0; k < lang.extra.length; k++) {
      var entry = lang.extra[k];
      var compiled = hlCompile(entry.pattern);
      if (compiled) rules.extra.push({ type: entry.type, re: compiled });
    }
  }
  return rules;
}

function hlBuildSets(lang) {
  return {
    keywords: hlToSet(lang.keywords),
    constants: hlToSet(lang.constants),
    types: hlToSet(lang.types),
    builtins: hlToSet(lang.builtins),
    properties: hlToSet(lang.properties)
  };
}

function hlRulesFor(languages, id, lang) {
  if (!HL_CACHE[id]) {
    HL_CACHE[id] = { rules: hlBuildRules(lang), sets: hlBuildSets(lang) };
  }
  return HL_CACHE[id];
}

function hlIsMarkupOpen(source, pos) {
  var i = pos - 1;
  if (i < 0) return false;
  if (source.charAt(i) === '<') return true;
  return source.charAt(i) === '/' && i - 1 >= 0 && source.charAt(i - 1) === '<';
}

function hlSkipInlineSpace(source, end) {
  var i = end;
  while (i < source.length) {
    var c = source.charAt(i);
    if (c !== ' ' && c !== '\t') break;
    i += 1;
  }
  return i;
}

function hlFollowsEquals(source, end) {
  return source.charAt(hlSkipInlineSpace(source, end)) === '=';
}

function hlFollowsPropertyColon(source, end) {
  var i = hlSkipInlineSpace(source, end);
  if (source.charAt(i) !== ':') return false;
  var next = source.charAt(i + 1);
  return next !== ':' && next !== '=';
}

function hlFollowsCallParen(source, end) {
  return source.charAt(hlSkipInlineSpace(source, end)) === '(';
}

function hlIsLineStart(source, pos) {
  var i = pos - 1;
  while (i >= 0) {
    var c = source.charAt(i);
    if (c !== ' ' && c !== '\t') return c === '\n' || c === '\r';
    i -= 1;
  }
  return true;
}

function hlIsUpperFirst(text) {
  var c = text.charAt(0);
  return c >= 'A' && c <= 'Z';
}

function hlClassify(lang, sets, source, pos, ident) {
  if (sets.keywords[ident]) return 'keyword';
  if (sets.constants[ident]) return 'constant';
  if (sets.types[ident]) return 'type';
  if (sets.properties[ident]) return 'property';
  if (sets.builtins[ident]) return 'function';

  var end = pos + ident.length;
  if (lang.tagPosition && hlIsMarkupOpen(source, pos)) return 'tag';
  if (lang.attributeFollowsEquals && hlFollowsEquals(source, end)) return 'attribute';
  if (lang.classifyLineStartAsFunction && hlIsLineStart(source, pos)) return 'function';
  if (lang.propertyLookahead !== false && hlFollowsPropertyColon(source, end)) return 'property';
  if (hlFollowsCallParen(source, end)) return 'function';
  if (lang.classifyUpperAsType && hlIsUpperFirst(ident)) return 'type';
  return 'plain';
}

function hlMatchString(lang, source, pos) {
  var defs = lang.strings;
  if (!defs) return null;
  for (var i = 0; i < defs.length; i++) {
    var def = defs[i];
    if (!hlStartsWith(source, pos, def.open)) continue;

    var j = pos + def.open.length;
    var closed = false;
    while (j < source.length) {
      var c = source.charAt(j);
      if (def.escape && c === '\\') {
        j += 2;
        continue;
      }
      if (!def.multiline && (c === '\n' || c === '\r')) break;
      if (hlStartsWith(source, j, def.close)) {
        j += def.close.length;
        closed = true;
        break;
      }
      j += 1;
    }

    if (closed) return source.slice(pos, j);
    return source.slice(pos, Math.min(j, source.length));
  }
  return null;
}

function hlPush(out, type, value) {
  if (!value) return;
  if (out.length) {
    var last = out[out.length - 1];
    if (last.t === type) {
      last.v += value;
      return;
    }
  }
  out.push({ t: type, v: value });
}

/**
 * Map an arbitrary language hint (extension, alias, or display name) onto a
 * known language id in the supplied rule table. Returns null when unknown.
 */
function hlResolveLanguage(languages, name) {
  if (name === null || name === undefined) return null;
  var key = String(name).trim().toLowerCase();
  if (key.charAt(0) === '.') key = key.slice(1);
  if (!key) return null;
  var aliases = languages.aliases || {};
  var id = aliases[key] || key;
  return languages.languages && languages.languages[id] ? id : null;
}

/** Header label for the language chip: "tsx" -> "TSX", unknown -> "FOO". */
function hlLanguageLabel(languages, name) {
  var id = hlResolveLanguage(languages, name);
  if (id && languages.languages[id].displayName) return languages.languages[id].displayName;
  var raw = name === null || name === undefined ? '' : String(name);
  return raw ? raw.toUpperCase() : 'TEXT';
}

/** True when the language id has real rules (false for `text`). */
function hlIsHighlightable(languages, name) {
  var id = hlResolveLanguage(languages, name);
  return !!(id && !languages.languages[id].plain);
}

/**
 * Tokenize `source`. Returns [{ t: tokenType, v: text }] such that joining
 * every `v` reproduces `source` byte for byte. Unknown/plain languages return
 * a single `plain` token.
 */
function hlTokenize(languages, source, language) {
  var code = source === null || source === undefined ? '' : String(source);
  if (!code) return [];

  var id = hlResolveLanguage(languages, language);
  if (!id) return [{ t: 'plain', v: code }];

  var lang = languages.languages[id];
  if (lang.plain) return [{ t: 'plain', v: code }];

  var compiled = hlRulesFor(languages, id, lang);
  var rules = compiled.rules;
  var sets = compiled.sets;

  var out = [];
  var pos = 0;

  while (pos < code.length) {
    var ws = hlMatch(rules.ws, code, pos);
    if (ws) {
      hlPush(out, 'plain', ws);
      pos += ws.length;
      continue;
    }

    var block = hlMatch(rules.blockComment, code, pos);
    if (block) {
      hlPush(out, 'comment', block);
      pos += block.length;
      continue;
    }

    var line = hlMatch(rules.lineComment, code, pos);
    if (line) {
      hlPush(out, 'comment', line);
      pos += line.length;
      continue;
    }

    var str = hlMatchString(lang, code, pos);
    if (str) {
      hlPush(out, 'string', str);
      pos += str.length;
      continue;
    }

    var matchedExtra = false;
    for (var i = 0; i < rules.extra.length; i++) {
      var extra = rules.extra[i];
      var value = hlMatch(extra.re, code, pos);
      if (value) {
        hlPush(out, extra.type, value);
        pos += value.length;
        matchedExtra = true;
        break;
      }
    }
    if (matchedExtra) continue;

    var number = hlMatch(rules.number, code, pos);
    if (number) {
      hlPush(out, 'number', number);
      pos += number.length;
      continue;
    }

    var ident = hlMatch(rules.identifier, code, pos);
    if (ident) {
      hlPush(out, hlClassify(lang, sets, code, pos, ident), ident);
      pos += ident.length;
      continue;
    }

    var op = hlMatch(rules.operator, code, pos);
    if (op) {
      hlPush(out, 'operator', op);
      pos += op.length;
      continue;
    }

    var punct = hlMatch(rules.punctuation, code, pos);
    if (punct) {
      hlPush(out, 'punctuation', punct);
      pos += punct.length;
      continue;
    }

    hlPush(out, 'plain', code.charAt(pos));
    pos += 1;
  }

  return out;
}

/**
 * Split a token stream into per-line token arrays. Used by the line-number
 * gutter on both stacks so numbering and rendering never disagree.
 */
function hlToLines(tokens) {
  var lines = [];
  var current = [];
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];
    var parts = String(token.v).split('\n');
    for (var p = 0; p < parts.length; p++) {
      if (p > 0) {
        lines.push(current);
        current = [];
      }
      if (parts[p]) current.push({ t: token.t, v: parts[p] });
    }
  }
  lines.push(current);
  return lines;
}

function hlEscapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Build Qt RichText for a token stream. `colorFor(type)` returns a CSS color
 * string, or a falsy value to leave the token at the default text color.
 * Spaces become &nbsp; so Qt's rich-text engine stops collapsing indentation.
 */
function hlBuildRichText(tokens, colorFor) {
  var parts = [];
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];
    var text = hlEscapeHtml(token.v)
      .replace(/ /g, '&nbsp;')
      .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
      .replace(/\r\n/g, '\n')
      .replace(/\n/g, '<br/>');

    var color = token.t === 'plain' ? null : colorFor(token.t);
    if (color) parts.push('<span style="color:' + color + '">' + text + '</span>');
    else parts.push(text);
  }
  return parts.join('');
}

        return {
            languages: LANGUAGES,
            resolveLanguage: hlResolveLanguage,
            languageLabel: hlLanguageLabel,
            isHighlightable: hlIsHighlightable,
            tokenize: hlTokenize,
            toLines: hlToLines,
            escapeHtml: hlEscapeHtml,
            buildRichText: hlBuildRichText
        };
    }

    function resolveLanguage(name) {
        return root.api.resolveLanguage(root.api.languages, name);
    }

    function languageLabel(name) {
        return root.api.languageLabel(root.api.languages, name);
    }

    function isHighlightable(name) {
        return root.api.isHighlightable(root.api.languages, name);
    }

    function tokenize(code, language) {
        return root.api.tokenize(root.api.languages, code, language);
    }

    function toLines(tokens) {
        return root.api.toLines(tokens);
    }

    function buildRichText(tokens, colorFor) {
        return root.api.buildRichText(tokens, colorFor);
    }
}
