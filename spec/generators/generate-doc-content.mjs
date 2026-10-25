// generate-doc-content.mjs — Emits the Markdown-derived doc content AST for React & Qt
//
// Source of truth: spec/content/<docId>/<locale>.md
// Output:
//   packages/react/examples/basic/src/data/docContent.generated.ts
//   qt/src/DocContent.generated.qml
//
// Design notes (see .agents docs): Markdown is the AUTHOR interface, the AST is the CONTRACT.
// Parsing happens at build time so neither stack ships a Markdown runtime, and so every
// rendered node resolves through the shared typography / spacing tokens instead of raw HTML.
//
// Dialect is a strict whitelist. Anything outside it fails the build instead of silently
// rendering as empty space on one of the two stacks.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '..', '..');
const contentDir = path.resolve(repoRoot, 'spec', 'content');
const reactOut = path.resolve(repoRoot, 'packages', 'react', 'examples', 'basic', 'src', 'data', 'docContent.generated.ts');
const qtOut = path.resolve(repoRoot, 'qt', 'src', 'DocContent.generated.qml');

/** Node kinds the renderers implement. Keep this list and the two renderers in lockstep. */
const ALLOWED_BLOCK_TOKENS = new Set(['heading', 'paragraph', 'list', 'table', 'space', 'code']);
const ALLOWED_INLINE_TOKENS = new Set(['text', 'strong', 'em', 'codespan', 'link', 'escape', 'br']);
/** Slots a page may delegate to native code. */
const KNOWN_SLOTS = new Set(['overview', 'anatomy', 'props']);

const errors = [];

function fail(file, message) {
  errors.push(`${path.relative(repoRoot, file).replace(/\\/g, '/')}: ${message}`);
}

function parseFrontMatter(file, source) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source);
  if (!match) {
    fail(file, 'missing front matter block (--- ... ---)');
    return { meta: {}, body: source };
  }
  const meta = {};
  for (const rawLine of match[1].split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf(':');
    if (idx < 0) {
      fail(file, `front matter line is not "key: value" → ${line}`);
      continue;
    }
    meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return { meta, body: source.slice(match[0].length) };
}

function inlineToAst(file, tokens, { allowTokenLinks = true, headingText = '' } = {}) {
  const out = [];
  for (const token of tokens ?? []) {
    switch (token.type) {
      case 'text':
        out.push({ t: 'text', v: allowTokenLinks ? token.text : stripHeadingId(token.text) });
        break;
      case 'escape':
        out.push({ t: 'text', v: token.text });
        break;
      case 'strong':
        out.push({ t: 'strong', c: inlineToAst(file, token.tokens) });
        break;
      case 'em':
        out.push({ t: 'em', c: inlineToAst(file, token.tokens) });
        break;
      case 'codespan':
        out.push({ t: 'code', v: token.text });
        break;
      case 'link': {
        const href = token.href ?? '';
        if (href.startsWith('token:')) {
          out.push({ t: 'token', v: href.slice('token:'.length) });
        } else {
          // Plain links are not part of the rendered contract yet: keep the label, drop the href,
          // and surface it so nobody assumes it links anywhere.
          fail(file, `unsupported link target "${href}" (only "token:<name>" links are rendered)`);
          out.push(...inlineToAst(file, token.tokens));
        }
        break;
      }
      case 'br':
        out.push({ t: 'text', v: ' ' });
        break;
      default:
        fail(file, `inline token "${token.type}" is not in the whitelist${headingText ? ` (in heading "${headingText}")` : ''}`);
        break;
    }
  }
  return out;
}

function stripHeadingId(text) {
  return text.replace(/\s*\{#[\w-]+\}\s*$/, '');
}

/** Collect `token:` inline nodes so the renderer can emit a copyable chip row per section. */
function collectTokens(nodes, acc = []) {
  for (const node of nodes) {
    if (node.t === 'token' && !acc.includes(node.v)) acc.push(node.v);
    if (node.c) collectTokens(node.c, acc);
  }
  return acc;
}

function slugFallback(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function blockToAst(file, token) {
  switch (token.type) {
    case 'space':
      return [];
    case 'heading': {
      if (token.depth < 2) {
        fail(file, `level-${token.depth} headings are not allowed; the page title comes from front matter`);
        return [];
      }
      const idMatch = /\{#([\w-]+)\}\s*$/.exec(token.text);
      const inlines = inlineToAst(file, token.tokens);
      const plain = inlines.map((n) => n.v ?? '').join('').replace(/\s*\{#[\w-]+\}\s*$/, '');
      const id = idMatch ? idMatch[1] : slugFallback(plain);
      if (!id) {
        fail(file, `heading "${plain}" needs an explicit "{#id}" because it has no ASCII slug`);
      }
      return [{ t: 'heading', level: token.depth, id: id || 'section', inlines: idMatch ? trimTrailingId(inlines) : inlines }];
    }
    case 'paragraph':
      return [{ t: 'para', inlines: inlineToAst(file, token.tokens) }];
    case 'list': {
      const items = token.items.map((item) => {
        const inlineTokens = item.tokens.flatMap((inner) => {
          if (inner.type === 'text' || inner.type === 'paragraph') return inner.tokens ?? [];
          fail(file, `list item contains unsupported block "${inner.type}"`);
          return [];
        });
        return inlineToAst(file, inlineTokens);
      });
      return [{ t: 'list', ordered: Boolean(token.ordered), items }];
    }
    case 'table': {
      const cell = (c) => inlineToAst(file, c.tokens);
      return [{
        t: 'table',
        head: token.header.map(cell),
        rows: token.rows.map((row) => row.map(cell)),
      }];
    }
    case 'code': {
      const lang = (token.lang ?? '').trim();
      if (lang.startsWith('demo')) {
        const slot = lang.slice('demo'.length).trim();
        if (!slot) {
          fail(file, 'demo slot fence needs a name, e.g. "demo overview" as the info string');
          return [];
        }
        if (!KNOWN_SLOTS.has(slot)) {
          fail(file, `unknown demo slot "${slot}" (known: ${[...KNOWN_SLOTS].join(', ')})`);
        }
        return [{ t: 'slot', name: slot }];
      }
      if (KNOWN_SLOTS.has(lang)) return [{ t: 'slot', name: lang }];
      fail(file, `fenced block "${lang || '(none)'}" is not a known slot (use info string "demo <slot>" or a known slot name)`);
      return [];
    }
    default:
      fail(file, `block token "${token.type}" is not in the whitelist`);
      return [];
  }
}

function buildPage(file, source) {
  const { meta, body } = parseFrontMatter(file, source);
  for (const required of ['id', 'component', 'category', 'title', 'description']) {
    if (!meta[required]) fail(file, `front matter is missing "${required}"`);
  }

  const lexed = marked.lexer(body, { gfm: true, breaks: false });
  const sections = [{ id: 'intro', heading: null, blocks: [], tokens: [] }];
  let current = sections[0];

  for (const token of lexed) {
    if (!ALLOWED_BLOCK_TOKENS.has(token.type)) {
      fail(file, `block token "${token.type}" is not in the whitelist`);
      continue;
    }
    if (token.type === 'heading' && token.depth <= 2) {
      const blocks = blockToAst(file, token);
      const heading = blocks[0] ?? { id: 'section', inlines: [] };
      current = { id: heading.id, heading, blocks: [heading], tokens: [] };
      sections.push(current);
      continue;
    }
    current.blocks.push(...blockToAst(file, token));
  }

  // Derive the copyable chip row from the token links actually mentioned in each section body,
  // so the chip list can never drift away from the prose again.
  for (const section of sections) {
    const chips = [];
    for (const block of section.blocks) {
      if (block.t === 'heading') continue;
      if (block.t === 'para') collectTokens(block.inlines, chips);
      if (block.t === 'list') block.items.forEach((item) => collectTokens(item, chips));
      if (block.t === 'table') {
        block.head.forEach((cell) => collectTokens(cell, chips));
        block.rows.forEach((row) => row.forEach((cell) => collectTokens(cell, chips)));
      }
    }
    if (chips.length) section.blocks.push({ t: 'chips', tokens: chips });
  }

  const nonEmpty = sections.filter((s) => s.blocks.length > 0);
  return {
    meta,
    page: {
      id: meta.id,
      component: meta.component,
      category: meta.category,
      title: meta.title,
      description: meta.description,
      sections: nonEmpty.map((s) => ({
        id: s.id,
        title: s.heading ? plainInline(s.heading.inlines) : '',
        blocks: s.blocks,
      })),
    },
  };
}

function plainInline(nodes) {
  return nodes.map((n) => n.v ?? (n.c ? plainInline(n.c) : '')).join('').trim();
}

function trimTrailingId(inlines) {
  const copy = [...inlines];
  for (let i = copy.length - 1; i >= 0; i -= 1) {
    if (copy[i].t !== 'text') continue;
    const trimmed = copy[i].v.replace(/\s*\{#[\w-]+\}\s*$/, '').trimEnd();
    if (trimmed) copy[i] = { t: 'text', v: trimmed };
    else copy.splice(i, 1);
    break;
  }
  return copy;
}

// ---------------------------------------------------------------------------
// Load every doc + locale, then cross-check locale structure before emitting.
// ---------------------------------------------------------------------------
const docDirs = fs.existsSync(contentDir)
  ? fs.readdirSync(contentDir).filter((name) => fs.statSync(path.join(contentDir, name)).isDirectory())
  : [];

const docs = new Map();
for (const docId of docDirs.sort()) {
  const dir = path.join(contentDir, docId);
  const localeFiles = fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort();
  if (!localeFiles.length) fail(dir, 'no <locale>.md files found');
  const byLocale = {};
  for (const localeFile of localeFiles) {
    const file = path.join(dir, localeFile);
    const locale = path.basename(localeFile, '.md');
    const { meta, page } = buildPage(file, fs.readFileSync(file, 'utf8'));
    if (meta.id && meta.id !== docId) {
      fail(file, `front matter id "${meta.id}" does not match directory name "${docId}"`);
    }
    byLocale[locale] = page;
  }
  docs.set(docId, byLocale);
}

// Every locale of a doc must expose the same section ids in the same order, otherwise the
// two languages would render different outlines.
for (const [docId, byLocale] of docs) {
  const ids = Object.keys(byLocale);
  if (ids.length < 2) continue;
  const reference = byLocale[ids[0]].sections.map((s) => s.id).join(',');
  for (const locale of ids.slice(1)) {
    const actual = byLocale[locale].sections.map((s) => s.id).join(',');
    if (actual !== reference) {
      fail(path.join(contentDir, docId, `${locale}.md`), `section ids [${actual}] differ from ${ids[0]} [${reference}]`);
    }
  }
}

if (errors.length) {
  console.error('[gen:docs] FAILED — content dialect violations:');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

const payload = Object.fromEntries([...docs.entries()].map(([docId, byLocale]) => [docId, byLocale]));
const locales = [...new Set([...docs.values()].flatMap((byLocale) => Object.keys(byLocale)))].sort();

// Reuse the i18n default locale so both renderers fall back to the same language as ChaSetI18n.
const i18nMetaPath = path.resolve(repoRoot, 'spec', 'i18n', 'meta.json');
const defaultLocale = fs.existsSync(i18nMetaPath)
  ? JSON.parse(fs.readFileSync(i18nMetaPath, 'utf8')).defaultLocale || locales[0]
  : locales[0];

// ---------------------------------------------------------------------------
// React output
// ---------------------------------------------------------------------------
const tsHeader = `// GENERATED FILE - DO NOT EDIT.
// Source: spec/content/<docId>/<locale>.md via spec/generators/generate-doc-content.mjs
// Refresh: \`pnpm gen:docs\` regenerates this file in place.
//
// Markdown is authored once per locale; this AST is the cross-stack contract both
// living-doc renderers consume. Do not hand-edit — change the .md source instead.

export interface DocInlineText { t: 'text'; v: string }
export interface DocInlineMark { t: 'strong' | 'em'; c: DocInline[] }
export interface DocInlineCode { t: 'code' | 'token'; v: string }
export type DocInline = DocInlineText | DocInlineMark | DocInlineCode;

export type DocBlock =
  | { t: 'heading'; level: number; id: string; inlines: DocInline[] }
  | { t: 'para'; inlines: DocInline[] }
  | { t: 'list'; ordered: boolean; items: DocInline[][] }
  | { t: 'table'; head: DocInline[][]; rows: DocInline[][][] }
  | { t: 'chips'; tokens: string[] }
  | { t: 'slot'; name: string };

export interface DocSection { id: string; title: string; blocks: DocBlock[] }
export interface DocPage {
  id: string;
  component: string;
  category: string;
  title: string;
  description: string;
  sections: DocSection[];
}
export type DocContentMap = Record<string, Record<string, DocPage>>;

export const docContentLocales: string[] = ${JSON.stringify(locales)};
export const docContentDefaultLocale: string = ${JSON.stringify(defaultLocale)};

export const docContent: DocContentMap = ${JSON.stringify(payload, null, 2)};
`;

fs.mkdirSync(path.dirname(reactOut), { recursive: true });
fs.writeFileSync(reactOut, tsHeader, 'utf8');

// ---------------------------------------------------------------------------
// Qt output
// ---------------------------------------------------------------------------
const qml = `pragma Singleton
import QtQuick 6.10

// GENERATED FILE - DO NOT EDIT.
// Source: spec/content/<docId>/<locale>.md via spec/generators/generate-doc-content.mjs
// Refresh: \`pnpm gen:docs\` regenerates this file in place.
QtObject {
    id: root

    readonly property var locales: ${JSON.stringify(locales)}
    readonly property string defaultLocale: ${JSON.stringify(defaultLocale)}
    readonly property var pages: (${JSON.stringify(payload)})
}
`;

fs.writeFileSync(qtOut, qml, 'utf8');

// ---------------------------------------------------------------------------
// Machine-readable index for gates (scripts/check-doc-content.mjs). Keeps the
// parity tooling independent of the generated TS/QML syntax.
// ---------------------------------------------------------------------------
const index = {
  defaultLocale,
  docs: Object.fromEntries(
    [...docs.entries()].map(([docId, byLocale]) => [
      docId,
      Object.fromEntries(
        Object.entries(byLocale).map(([locale, page]) => [
          locale,
          page.sections.map((s) => ({
            id: s.id,
            title: s.title,
            slots: s.blocks.filter((b) => b.t === 'slot').map((b) => b.name),
          })),
        ])
      ),
    ])
  ),
};
fs.writeFileSync(path.join(contentDir, '_index.json'), `${JSON.stringify(index, null, 2)}\n`, 'utf8');

const sectionCount = [...docs.values()].reduce(
  (sum, byLocale) => sum + Object.values(byLocale).reduce((n, page) => n + page.sections.length, 0),
  0
);
console.log(`[gen:docs] OK — ${docs.size} doc(s) × ${locales.length} locale(s), ${sectionCount} section(s) → React + Qt`);
