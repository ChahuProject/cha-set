// spec/highlight/engine.mjs — single-source lexer for the CodeBlock component.
//
// Design constraints (do not relax these):
//   1. No imports and no top-level `export default`. Every export is an
//      `export function` declaration so spec/generators/generate-highlight.mjs
//      can strip the `export ` keyword and embed the body verbatim into both
//      the React (.ts) and the Qt (.qml) artifacts.
//   2. Syntax stays ES5 (var / function / no template literals) so Qt's V4
//      engine accepts it unchanged.
//   3. Language rules are injected, never imported, so this module is pure and
//      unit-testable in plain Node with spec/highlight/languages.json.
//   4. Patterns must not use lookbehind — Qt's V4 support for it is not
//      dependable. Position-sensitive rules (markup tags, attributes, QML
//      signal handlers) are resolved by isMarkupOpen / followsEquals instead.
//
// Output is a flat, lossless token stream: concatenating every token's `v`
// reproduces the input exactly, including whitespace and newlines.

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

export function escapeRegExpLiteral(text) {
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
      blocks.push(escapeRegExpLiteral(pair[0]) + '[\\s\\S]*?(?:' + escapeRegExpLiteral(pair[1]) + '|$)');
    }
    rules.blockComment = hlCompile(blocks.join('|'));
  }

  if (lang.lineComment && lang.lineComment.length) {
    var lines = [];
    for (var j = 0; j < lang.lineComment.length; j++) lines.push(escapeRegExpLiteral(lang.lineComment[j]));
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
export function resolveLanguage(languages, name) {
  if (name === null || name === undefined) return null;
  var key = String(name).trim().toLowerCase();
  if (key.charAt(0) === '.') key = key.slice(1);
  if (!key) return null;
  var aliases = languages.aliases || {};
  var id = aliases[key] || key;
  return languages.languages && languages.languages[id] ? id : null;
}

/** Header label for the language chip: "tsx" -> "TSX", unknown -> "FOO". */
export function languageLabel(languages, name) {
  var id = resolveLanguage(languages, name);
  if (id && languages.languages[id].displayName) return languages.languages[id].displayName;
  var raw = name === null || name === undefined ? '' : String(name);
  return raw ? raw.toUpperCase() : 'TEXT';
}

/** True when the language id has real rules (false for `text`). */
export function isHighlightable(languages, name) {
  var id = resolveLanguage(languages, name);
  return !!(id && !languages.languages[id].plain);
}

/**
 * Tokenize `source`. Returns [{ t: tokenType, v: text }] such that joining
 * every `v` reproduces `source` byte for byte. Unknown/plain languages return
 * a single `plain` token.
 */
export function tokenize(languages, source, language) {
  var code = source === null || source === undefined ? '' : String(source);
  if (!code) return [];

  var id = resolveLanguage(languages, language);
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
export function toLines(tokens) {
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

export function escapeHtml(text) {
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
export function buildRichText(tokens, colorFor) {
  var parts = [];
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];
    var text = escapeHtml(token.v)
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
