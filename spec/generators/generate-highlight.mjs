// generate-highlight.mjs — emit the shared syntax-highlight lexer for both stacks.
//
// Source of truth (never edit the outputs by hand):
//   spec/highlight/languages.json  — declarative rule tables
//   spec/highlight/engine.mjs      — dependency-free ES5 lexer
//
// Outputs:
//   packages/react/src/code-block/tokenize.generated.ts  (typed ESM façade)
//   qt/src/Highlighter.generated.qml                     (QML singleton)
//
// Both targets embed the SAME engine body, so tokenization can never drift
// between React and Qt. Fails loud (exit 1) on validation errors.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const languagesPath = resolve(repoRoot, 'spec', 'highlight', 'languages.json');
const enginePath = resolve(repoRoot, 'spec', 'highlight', 'engine.mjs');

const fail = (message) => {
  console.error(`[gen:highlight] ${message}`);
  process.exit(1);
};

let languages;
try {
  languages = JSON.parse(readFileSync(languagesPath, 'utf8'));
} catch (e) {
  fail(`cannot parse ${languagesPath}: ${e.message}`);
}

const engineSource = readFileSync(enginePath, 'utf8');

// ---------------------------------------------------------------------------
// Validation — every failure mode here would silently degrade highlighting.
// ---------------------------------------------------------------------------
const declaredTypes = new Set(languages.tokenTypes ?? []);
if (!declaredTypes.size) fail('languages.json: tokenTypes is empty');
for (const t of languages.tokenTypes) {
  // They are emitted as a TypeScript string-literal union, so they must be
  // identifier-safe. A bare identifier union would silently degrade to an
  // undefined-type union in the published .d.ts.
  if (!/^[a-z][a-z0-9-]*$/.test(t)) fail(`languages.json: token type "${t}" is not identifier-safe`);
}

for (const [key, target] of Object.entries(languages.aliases ?? {})) {
  if (!languages.languages?.[target]) {
    fail(`languages.json: alias "${key}" points at unknown language "${target}"`);
  }
}

const collectExtraTypes = (lang, id) => {
  for (const extra of lang.extra ?? []) {
    if (!declaredTypes.has(extra.type)) {
      fail(`languages.${id}.extra: unknown token type "${extra.type}"`);
    }
    try {
      new RegExp(extra.pattern);
    } catch (e) {
      fail(`languages.${id}.extra: invalid pattern "${extra.pattern}" (${e.message})`);
    }
  }
};

for (const [id, lang] of Object.entries(languages.languages)) {
  if (lang.plain) continue;
  for (const [field, value] of Object.entries(lang)) {
    if (typeof value !== 'string') continue;
    if (!['identifier', 'number', 'operator', 'punctuation'].includes(field)) continue;
    try {
      new RegExp(value);
    } catch (e) {
      fail(`languages.${id}.${field}: invalid pattern "${value}" (${e.message})`);
    }
  }
  for (const def of lang.strings ?? []) {
    if (!def.open || !def.close) fail(`languages.${id}.strings: entry needs both open and close`);
  }
  collectExtraTypes(lang, id);
}

// Engine exports must stay in lockstep with the rename table below, otherwise a
// renamed helper would survive unreplaced and break one of the two targets.
const ENGINE_EXPORTS = [
  'escapeRegExpLiteral',
  'resolveLanguage',
  'languageLabel',
  'isHighlightable',
  'tokenize',
  'toLines',
  'escapeHtml',
  'buildRichText',
];
const foundExports = [...engineSource.matchAll(/^export function (\w+)/gm)].map((m) => m[1]);
for (const name of ENGINE_EXPORTS) {
  if (!foundExports.includes(name)) fail(`engine.mjs: expected "export function ${name}"`);
}
for (const name of foundExports) {
  if (!ENGINE_EXPORTS.includes(name)) fail(`engine.mjs: unexpected export "${name}" — update ENGINE_EXPORTS`);
}

if (/^(import|export default)\s/m.test(engineSource)) {
  fail('engine.mjs must not use imports or default exports — it is embedded verbatim');
}
if (/=>|`|\bconst\b|\blet\b|\.\.\./.test(stripComments(engineSource))) {
  fail('engine.mjs must stay ES5 (no arrow functions, template literals, const/let, or spread) for Qt V4');
}

function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
}

// ---------------------------------------------------------------------------
// Transform — strip `export `, then rename the public API so each target can
// wrap it with its own façade without colliding on names.
// ---------------------------------------------------------------------------
const RENAMES = [
  ['escapeRegExpLiteral', 'hlEscapeRegExpLiteral'],
  ['isHighlightable', 'hlIsHighlightable'],
  ['languageLabel', 'hlLanguageLabel'],
  ['buildRichText', 'hlBuildRichText'],
  ['resolveLanguage', 'hlResolveLanguage'],
  ['escapeHtml', 'hlEscapeHtml'],
  ['toLines', 'hlToLines'],
  ['tokenize', 'hlTokenize'],
];

let engineBody = engineSource.replace(/^export\s+/gm, '');
for (const [from, to] of RENAMES) {
  engineBody = engineBody.replace(new RegExp(`\\b${from}\\b`, 'g'), to);
}
for (const [, to] of RENAMES) {
  if (!engineBody.includes(to)) fail(`rename produced no "${to}" — engine.mjs drifted from the rename table`);
}
engineBody = engineBody.trimEnd();

// Drop the file-leading spec comment; each target supplies its own header.
engineBody = engineBody.replace(/^(?:\s*\/\/[^\n]*\n)+/, '');
engineBody = engineBody.replace(/^(\s*\n)+/, '');

const languagesJson = JSON.stringify(languages, null, 2);
// Emit a string-literal union: `'plain' | 'keyword' | ...`. Interpolating the
// raw names would produce a union of undefined type references.
const tokenTypeUnion = languages.tokenTypes.map((t) => `'${t}'`).join('\n  | ');
const header = (comment) => `// GENERATED FILE - DO NOT EDIT.
// Source: spec/highlight/languages.json + spec/highlight/engine.mjs
//         via spec/generators/generate-highlight.mjs
// Refresh: pnpm gen:highlight  (or pnpm gen:all)
//
// ${comment}`;

// ---------------------------------------------------------------------------
// Target 1 — React (typed ESM)
// ---------------------------------------------------------------------------
const reactOut = `// @ts-nocheck
${header(`The embedded lexer is authored once in ES5 so Qt's V4 engine can run the
// identical source. Only the typed façade at the bottom of this file is
// checked; everything above it is shared, untransformed logic.`)}

export type TokenType =
  | ${tokenTypeUnion};

export interface Token {
  t: TokenType;
  v: string;
}

interface LanguageTable {
  version: number;
  tokenTypes: TokenType[];
  aliases: Record<string, string>;
  languages: Record<string, Record<string, unknown>>;
}

const LANGUAGES: LanguageTable = ${languagesJson};

const engine = (function () {
${engineBody}

  return {
    resolveLanguage: hlResolveLanguage,
    languageLabel: hlLanguageLabel,
    isHighlightable: hlIsHighlightable,
    tokenize: hlTokenize,
    toLines: hlToLines,
    escapeHtml: hlEscapeHtml,
    buildRichText: hlBuildRichText,
  };
})();

/** Map an extension, alias, or display name onto a known language id. */
export function resolveLanguage(name?: string | null): string | null {
  return engine.resolveLanguage(LANGUAGES, name);
}

/** Header chip label: "tsx" -> "TSX"; unknown hints are upper-cased verbatim. */
export function languageLabel(name?: string | null): string {
  return engine.languageLabel(LANGUAGES, name);
}

/** False for unknown languages and for the explicit \`text\` fallback. */
export function isHighlightable(name?: string | null): boolean {
  return engine.isHighlightable(LANGUAGES, name);
}

/** Lossless token stream: joining every \`v\` reproduces the input exactly. */
export function tokenize(code: string, language?: string | null): Token[] {
  return engine.tokenize(LANGUAGES, code, language);
}

/** Split a token stream into per-line token arrays for the line-number gutter. */
export function toLines(tokens: Token[]): Token[][] {
  return engine.toLines(tokens);
}

/** Build Qt RichText. Kept for parity tests so both stacks share one source. */
export function buildRichText(
  tokens: Token[],
  colorFor: (type: TokenType) => string | null | undefined,
): string {
  return engine.buildRichText(tokens, colorFor);
}
`;

const reactOutPath = resolve(repoRoot, 'packages', 'react', 'src', 'code-block', 'tokenize.generated.ts');
mkdirSync(dirname(reactOutPath), { recursive: true });
writeFileSync(reactOutPath, reactOut, 'utf8');
console.log(`[gen:highlight] react -> ${reactOutPath}`);

// ---------------------------------------------------------------------------
// Target 2 — Qt (QML singleton)
//
// The engine body cannot sit directly in a QtObject body (bare `var` is not a
// property declaration), so it is wrapped in a factory function whose closure
// holds the rule cache. Object literals inside function bodies are safe for
// qmlcachegen; property-binding literals are not.
// ---------------------------------------------------------------------------
const qmlOut = `pragma Singleton
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
        var LANGUAGES = ${languagesJson};

${engineBody}

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
`;

const qmlOutPath = resolve(repoRoot, 'qt', 'src', 'Highlighter.generated.qml');
mkdirSync(dirname(qmlOutPath), { recursive: true });
writeFileSync(qmlOutPath, qmlOut, 'utf8');
console.log(`[gen:highlight] qt    -> ${qmlOutPath}`);

const languageCount = Object.keys(languages.languages).length;
console.log(`[gen:highlight] ${languageCount} languages, ${languages.tokenTypes.length} token types`);
