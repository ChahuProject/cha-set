#!/usr/bin/env node
// verify-showcase-parity.mjs — Cross-Stack Showcase Parity Assurance Engine (SPAS)
// Validates structural, semantic, and content parity between React and Qt living showcase doc pages.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

const navPath = resolve(repoRoot, 'spec', 'showcase', 'navigation.json');
const kbPath = resolve(repoRoot, 'spec', 'showcase', 'keyboard-shortcuts.json');
const componentsDir = resolve(repoRoot, 'spec', 'components');
const reactDocPagesDir = resolve(repoRoot, 'packages', 'react', 'examples', 'basic', 'src', 'pages', 'components');
const qtSrcDir = resolve(repoRoot, 'qt', 'src');

if (!existsSync(navPath) || !existsSync(kbPath)) {
  console.error('[showcase-parity] Missing navigation.json or keyboard-shortcuts.json');
  process.exit(1);
}

const navigation = JSON.parse(readFileSync(navPath, 'utf8'));
const keyboardShortcuts = JSON.parse(readFileSync(kbPath, 'utf8'));

// Build lookup table from navigation.json
const navLookup = new Map();
for (const group of navigation) {
  for (const item of group.items) {
    navLookup.set(item.id, {
      ...item,
      category: group.title,
    });
  }
}

function toPascalCase(str) {
  return str.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

// Brace-aware JSX attribute scanner: starts right after the element name and
// returns everything up to the closing ">" while ignoring braces, quotes and
// template literals (whose contents may legally contain ">" and "/>").
function scanJsxElementAttrs(content, startIndex) {
  let idx = startIndex;
  let inBrace = 0;
  let inBacktick = false;
  let inQuote = null;

  while (idx < content.length) {
    const ch = content[idx];
    const prevCh = idx > 0 ? content[idx - 1] : '';

    if (inBacktick) {
      if (ch === '`' && prevCh !== '\\') inBacktick = false;
    } else if (inQuote) {
      if (ch === inQuote && prevCh !== '\\') inQuote = null;
    } else if (ch === '`') {
      inBacktick = true;
    } else if (ch === '"' || ch === "'") {
      inQuote = ch;
    } else if (ch === '{') {
      inBrace++;
    } else if (ch === '}') {
      inBrace = Math.max(0, inBrace - 1);
    } else if (ch === '>' && inBrace === 0) {
      return content.slice(startIndex, idx);
    }
    idx++;
  }
  return null;
}

// Brace-aware QML block scanner: starts right after the opening "{" and
// returns the block body, ignoring braces inside template literals, string
// literals and line comments.
function scanQmlBlockBody(content, startIndex) {
  let idx = startIndex;
  let depth = 1;
  let inBacktick = false;
  let inQuote = null;
  let inLineComment = false;

  while (idx < content.length) {
    const ch = content[idx];
    const prevCh = idx > 0 ? content[idx - 1] : '';

    if (inLineComment) {
      if (ch === '\n') inLineComment = false;
    } else if (inBacktick) {
      if (ch === '`' && prevCh !== '\\') inBacktick = false;
    } else if (inQuote) {
      if (ch === inQuote && prevCh !== '\\') inQuote = null;
    } else if (ch === '/' && content[idx + 1] === '/') {
      inLineComment = true;
      idx++;
    } else if (ch === '`') {
      inBacktick = true;
    } else if (ch === '"' || ch === "'") {
      inQuote = ch;
    } else if (ch === '{') {
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0) return content.slice(startIndex, idx);
    }
    idx++;
  }
  return null;
}

const specialMap = {
  'scrollbar': { navId: 'scroll-area', reactDoc: 'ScrollAreaDocPage.tsx', qtDoc: 'ScrollAreaDocPage.qml' },
  'data-table': { navId: 'generic-data-table', reactDoc: 'GenericDataTableDocPage.tsx', qtDoc: 'GenericDataTableDocPage.qml' },
};

export function extractReactDocMetadata(content) {
  const meta = {
    category: '',
    title: '',
    description: '',
    tocItems: [],
    previewTitle: '',
    keyboardComponentId: '',
  };

  const docLayoutMatch = content.match(/<DocLayout\b([^>]*?)>/s);
  const layoutAttrs = docLayoutMatch ? docLayoutMatch[1] : content;

  const catMatch = layoutAttrs.match(/category=(?:["']([^"']+)["']|\{["']([^"']+)["']\})/);
  if (catMatch) meta.category = catMatch[1] || catMatch[2];

  const titleMatch = layoutAttrs.match(/title=(?:["']([^"']+)["']|\{["']([^"']+)["']\})/);
  if (titleMatch) meta.title = titleMatch[1] || titleMatch[2];

  const descMatch = layoutAttrs.match(/description=(?:["']([^"']+)["']|\{["']([^"']+)["']\})/);
  if (descMatch) meta.description = descMatch[1] || descMatch[2];

  let tocBlock = '';
  const tocBlockMatch = content.match(/tocItems=\{?\s*\[([^\]]*)\]\}?/s);
  if (tocBlockMatch) {
    tocBlock = tocBlockMatch[1];
    const tocMatches = [...tocBlock.matchAll(/\{\s*id[:=]\s*["']([^"']+)["'],\s*title[:=]\s*["']([^"']+)["']/g)];
    meta.tocItems = tocMatches.map(m => ({ id: m[1], title: m[2] }));
    meta.isAutoToc = false;
  } else {
    meta.isAutoToc = true;
    const events = [];

    const pStarts = [...content.matchAll(/<ComponentPreview\b/g)];
    for (const p of pStarts) {
      events.push({ index: p.index, id: 'overview', title: 'Interactive Overview' });
    }

    const aStarts = [...content.matchAll(/<DocAnatomy\b/g)];
    for (const a of aStarts) {
      events.push({ index: a.index, id: 'anatomy', title: 'Anatomy' });
    }

    const sectionRegex = /<section\b[^>]*?id=["']([^"']+)["'][^>]*>([\s\S]*?)<\/section>/g;
    let sMatch;
    while ((sMatch = sectionRegex.exec(content)) !== null) {
      let id = sMatch[1];
      if (id === 'overview' || id === 'anatomy' || id === 'installation') continue;
      if (id === 'examples' || id === 'examples-states' || id === 'examples-variants') id = 'states';
      if (id === 'variants-options') id = 'variants';
      if (id === 'multi-file-tabs') id = 'multi-file';
      const inner = sMatch[2];
      let title = '';
      const customTitleMatch = inner.match(/data-toc-title=["']([^"']+)["']/);
      if (customTitleMatch) {
        title = customTitleMatch[1];
      } else {
        const hMatch = inner.match(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/);
        if (hMatch) {
          title = hMatch[1].replace(/<[^>]+>/g, '').trim();
        }
      }
      if (!title) {
        if (id === 'animations') title = 'Animations';
        else if (id === 'keyboard') title = 'Keyboard Navigation';
        else if (id === 'props') title = 'Props Reference';
        else title = id.split(/[-_]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }
      events.push({ index: sMatch.index, id, title });
    }

    const dfsStarts = [...content.matchAll(/<DocFooterSections\b/g)];
    for (const dfs of dfsStarts) {
      events.push({ index: dfs.index, id: 'animations', title: 'Animations' });
      events.push({ index: dfs.index + 1, id: 'keyboard', title: 'Keyboard Navigation' });
      events.push({ index: dfs.index + 2, id: 'props', title: 'Props Reference' });
    }

    const crRegex = /<ComponentReference\b([^>]*?)(?:\/>|>)/gs;
    let crMatch;
    while ((crMatch = crRegex.exec(content)) !== null) {
      const attrs = crMatch[1];
      const compIdMatch = attrs.match(/componentId=["']([^"']+)["']/);
      const nameMatch = attrs.match(/name=["']([^"']+)["']/);
      const isSub = /isSubComponent/.test(attrs);
      const compId = compIdMatch ? compIdMatch[1] : '';
      const name = nameMatch ? nameMatch[1] : '';
      const hasKb = compId && keyboardShortcuts[compId] && keyboardShortcuts[compId].length > 0;
      if (hasKb) {
        const kbId = isSub ? `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-keyboard` : 'keyboard';
        const kbTitle = isSub ? `${name} Keyboard Navigation & Shortcuts` : 'Keyboard Navigation';
        events.push({ index: crMatch.index, id: kbId, title: kbTitle });
      }
      const propsId = isSub ? `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-props` : 'props';
      const propsTitle = isSub ? `${name} Properties` : 'Props Reference';
      events.push({ index: crMatch.index + 1, id: propsId, title: propsTitle });
    }

    events.sort((a, b) => a.index - b.index);
    const seen = new Set();
    for (const ev of events) {
      if (!seen.has(ev.id)) {
        seen.add(ev.id);
        meta.tocItems.push({ id: ev.id, title: ev.title });
      }
    }
  }

  meta.previews = [];
  const previewStarts = [...content.matchAll(/<ComponentPreview\b/g)];
  for (const pMatch of previewStarts) {
    let idx = pMatch.index + pMatch[0].length;
    let inBrace = 0;
    let inBacktick = false;
    let inQuote = null;
    let endIdx = -1;

    while (idx < content.length) {
      const ch = content[idx];
      const prevCh = idx > 0 ? content[idx - 1] : '';

      if (inBacktick) {
        if (ch === '`' && prevCh !== '\\') {
          inBacktick = false;
        }
      } else if (inQuote) {
        if (ch === inQuote && prevCh !== '\\') {
          inQuote = null;
        }
      } else {
        if (ch === '`') {
          inBacktick = true;
        } else if (ch === '"' || ch === "'") {
          inQuote = ch;
        } else if (ch === '{') {
          inBrace++;
        } else if (ch === '}') {
          inBrace = Math.max(0, inBrace - 1);
        } else if (ch === '>' && inBrace === 0) {
          endIdx = idx;
          break;
        }
      }
      idx++;
    }

    if (endIdx !== -1) {
      const attrs = content.slice(pMatch.index + pMatch[0].length, endIdx);
      const titleMatch = attrs.match(/title=(?:["']([^"']+)["']|\{["']([^"']+)["']\})/);
      const title = titleMatch ? (titleMatch[1] || titleMatch[2]) : '';
      const hasReactCode = /reactCode=/.test(attrs);
      const hasQtCode = /qtCode=/.test(attrs);
      const hasControls = /controls=/.test(attrs);
      meta.previews.push({ title, hasReactCode, hasQtCode, hasControls });
    }
  }
  meta.previewTitle = meta.previews[0]?.title || '';

  meta.anatomies = [];
  for (const aMatch of content.matchAll(/<DocAnatomy\b/g)) {
    const attrs = scanJsxElementAttrs(content, aMatch.index + aMatch[0].length);
    if (attrs === null) continue;
    const reactCodeMatch = attrs.match(/reactCode=\{(?:`([^`]*)`|"((?:[^"\\]|\\.)*)")\}/s);
    const qtCodeMatch = attrs.match(/qtCode=\{(?:`([^`]*)`|"((?:[^"\\]|\\.)*)")\}/s);
    const idMatch = attrs.match(/\bid=(?:["']([^"']+)["']|\{["']([^"']+)["']\})/);
    meta.anatomies.push({
      id: idMatch ? (idMatch[1] || idMatch[2]) : 'anatomy',
      hasReactCode: !!reactCodeMatch && (reactCodeMatch[1] || reactCodeMatch[2] || '').trim() !== '',
      hasQtCode: !!qtCodeMatch && (qtCodeMatch[1] || qtCodeMatch[2] || '').trim() !== '',
    });
  }

  const kbMatch = content.match(/KeyboardShortcutsTable\s*\{?[^>]*?componentId[:=]\s*["']([^"']+)["']/);
  if (kbMatch) meta.keyboardComponentId = kbMatch[1];

  return meta;
}

export function extractQtDocMetadata(content) {
  const meta = {
    category: '',
    pageTitle: '',
    description: '',
    tocItems: [],
    previewTitle: '',
    keyboardComponentId: '',
    reactCode: '',
  };

  const docLayoutMatch = content.match(/DocLayout\s*\{([^]*?)(?:ComponentPreview|Column|ChaSetCodeBlock|Item)/);
  const layoutProps = docLayoutMatch ? docLayoutMatch[1] : content;

  const catMatch = layoutProps.match(/category:\s*["']([^"']+)["']/);
  if (catMatch) meta.category = catMatch[1];

  const titleMatch = layoutProps.match(/pageTitle:\s*["']([^"']+)["']/);
  if (titleMatch) meta.pageTitle = titleMatch[1];

  const descMatch = layoutProps.match(/description:\s*["']([^"']+)["']/);
  if (descMatch) meta.description = descMatch[1];

  let tocBlock = '';
  const tocBlockMatch = content.match(/tocItems:\s*\[([^\]]*)\]/s);
  if (tocBlockMatch) {
    tocBlock = tocBlockMatch[1];
    const tocMatches = [...tocBlock.matchAll(/\{\s*id:\s*["']([^"']+)["'],\s*title:\s*["']([^"']+)["']/g)];
    meta.tocItems = tocMatches.map(m => ({ id: m[1], title: m[2] }));
    meta.isAutoToc = false;
  } else {
    meta.isAutoToc = true;
    const events = [];

    const pStarts = [...content.matchAll(/\bComponentPreview\s*\{/g)];
    for (const p of pStarts) {
      const body = scanQmlBlockBody(content, p.index + p[0].length);
      const sIdMatch = body ? body.match(/sectionId:\s*["']([^"']+)["']/) : null;
      const sTitleMatch = body ? body.match(/sectionTitle:\s*["']([^"']+)["']/) : null;
      const titleMatch = body ? body.match(/title:\s*["']([^"']+)["']/) : null;
      const id = sIdMatch ? sIdMatch[1] : 'overview';
      const title = sTitleMatch ? sTitleMatch[1] : (id === 'overview' ? 'Interactive Overview' : (titleMatch ? titleMatch[1] : 'Interactive Overview'));
      events.push({ index: p.index, id, title });
    }

    const aStarts = [...content.matchAll(/\bDocAnatomy\s*\{/g)];
    for (const a of aStarts) {
      events.push({ index: a.index, id: 'anatomy', title: 'Anatomy' });
    }

    const secIdRegex = /(?:property\s+string\s+)?sectionId\s*:\s*["']([^"']+)["']/g;
    let secMatch;
    while ((secMatch = secIdRegex.exec(content)) !== null) {
      const id = secMatch[1];
      if (id === 'overview' || id === 'anatomy' || id === 'installation') continue;
      const snippet = content.slice(secMatch.index, secMatch.index + 500);
      const stitleMatch = snippet.match(/(?:property\s+string\s+)?sectionTitle\s*:\s*["']([^"']+)["']/);
      let title = stitleMatch ? stitleMatch[1] : '';
      if (!title) {
        const textMatch = snippet.match(/(?:DocText|Text)\s*\{[^}]*?text\s*:\s*["']([^"']+)["']/);
        if (textMatch) {
          title = textMatch[1].trim();
        }
      }
      if (!title) {
        if (id === 'animations') title = 'Animations';
        else if (id === 'keyboard') title = 'Keyboard Navigation';
        else if (id === 'props') title = 'Props Reference';
        else title = id.split(/[-_]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }
      if (id === 'animations' && (title.startsWith('Animations') || title.startsWith('Motion'))) {
        title = 'Animations';
      }
      events.push({ index: secMatch.index, id, title });
    }

    const titleRegex = /DocText\s*\{[^}]*?text\s*:\s*["']([^"']+)["'][^}]*?(?:sizeTitleSm|font\.pixelSize:\s*Typography\.sizeTitleSm)[^}]*?\}/g;
    let tMatch;
    while ((tMatch = titleRegex.exec(content)) !== null) {
      const lastOpenBrace = content.lastIndexOf('{', tMatch.index);
      const lastCloseBrace = content.lastIndexOf('}', tMatch.index);
      if (lastOpenBrace > lastCloseBrace) {
        const blockStart = content.slice(lastOpenBrace, tMatch.index);
        const sidMatch = blockStart.match(/(?:property\s+string\s+)?sectionId\s*:\s*["']([^"']+)["']/);
        if (sidMatch) continue;
      }
      const title = tMatch[1].trim();
      let id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      if (id === 'interactive-overview' || id === 'sandbox' || id === 'overview' || id === 'anatomy' || id === 'installation') continue;
      if (id === 'keyboard-navigation' || id === 'keyboard' || id === 'props-reference' || id === 'props' || id === 'api-reference') continue;
      if (id === 'examples-states' || id === 'examples' || id === 'examples-variants') id = 'states';
      if (id === 'variants-options') id = 'variants';
      if (id === 'multi-file-tabs') id = 'multi-file';
      events.push({ index: tMatch.index, id, title: (id === 'states' ? 'Examples & States' : title) });
    }

    const dfsStarts = [...content.matchAll(/\bDocFooterSections\s*\{/g)];
    for (const dfs of dfsStarts) {
      events.push({ index: dfs.index, id: 'animations', title: 'Animations' });
      events.push({ index: dfs.index + 1, id: 'keyboard', title: 'Keyboard Navigation' });
      events.push({ index: dfs.index + 2, id: 'props', title: 'Props Reference' });
    }

    const crRegex = /\bComponentReference\s*\{([^}]*)\}/g;
    let crMatch;
    while ((crMatch = crRegex.exec(content)) !== null) {
      const body = crMatch[1];
      const compIdMatch = body.match(/componentId:\s*["']([^"']+)["']/);
      const nameMatch = body.match(/name:\s*["']([^"']+)["']/);
      const isSub = /isSubComponent:\s*true/.test(body);
      const compId = compIdMatch ? compIdMatch[1] : '';
      const name = nameMatch ? nameMatch[1] : '';
      const hasKb = compId && keyboardShortcuts[compId] && keyboardShortcuts[compId].length > 0;
      if (hasKb) {
        const kbId = isSub ? `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-keyboard` : 'keyboard';
        const kbTitle = isSub ? `${name} Keyboard Navigation & Shortcuts` : 'Keyboard Navigation';
        events.push({ index: crMatch.index, id: kbId, title: kbTitle });
      }
      const propsId = isSub ? `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-props` : 'props';
      const propsTitle = isSub ? `${name} Properties` : 'Props Reference';
      events.push({ index: crMatch.index + 1, id: propsId, title: propsTitle });
    }

    const kbStarts = [...content.matchAll(/\bKeyboardShortcutsTable\s*\{/g)];
    for (const kb of kbStarts) {
      events.push({ index: kb.index, id: 'keyboard', title: 'Keyboard Navigation' });
    }
    const ptStarts = [...content.matchAll(/\bPropsTable\s*\{/g)];
    for (const pt of ptStarts) {
      events.push({ index: pt.index, id: 'props', title: 'Props Reference' });
    }

    events.sort((a, b) => a.index - b.index);
    const seen = new Set();
    for (const ev of events) {
      if (!seen.has(ev.id)) {
        seen.add(ev.id);
        meta.tocItems.push({ id: ev.id, title: ev.title });
      }
    }
  }

  meta.previews = [];
  const qPreviewRegex = /\bComponentPreview\s*\{/g;
  let qMatch;
  while ((qMatch = qPreviewRegex.exec(content)) !== null) {
    const startIndex = qMatch.index + qMatch[0].length;
    const snippet = content.slice(startIndex, startIndex + 1500);
    const titleMatch = snippet.match(/title\s*:\s*["']([^"']+)["']/);
    const title = titleMatch ? titleMatch[1] : '';
    const reactCodeMatch = snippet.match(/reactCode\s*:\s*(?:`([^`]+)`|["']([^"']+)["']|([^\n\r]+))/);
    const reactCode = reactCodeMatch ? (reactCodeMatch[1] || reactCodeMatch[2] || reactCodeMatch[3] || '').trim() : '';
    const qtCodeMatch = snippet.match(/qtCode\s*:\s*(?:`([^`]+)`|["']([^"']+)["']|([^\n\r]+))/);
    const qtCode = qtCodeMatch ? (qtCodeMatch[1] || qtCodeMatch[2] || qtCodeMatch[3] || '').trim() : '';
    const hasControls = /controlsData\s*:/.test(snippet);
    meta.previews.push({ title, reactCode, qtCode, hasControls });
  }
  meta.previewTitle = meta.previews[0]?.title || '';
  meta.reactCode = meta.previews[0]?.reactCode || '';

  meta.anatomies = [];
  const qAnatomyRegex = /\bDocAnatomy\s*\{/g;
  let qAnatomyMatch;
  while ((qAnatomyMatch = qAnatomyRegex.exec(content)) !== null) {
    const body = scanQmlBlockBody(content, qAnatomyMatch.index + qAnatomyMatch[0].length);
    if (body === null) continue;
    const reactCodeMatch = body.match(/\breactCode\s*:\s*(?:`([^`]*)`|"((?:[^"\\]|\\.)*)")/s);
    const qtCodeMatch = body.match(/\bqtCode\s*:\s*(?:`([^`]*)`|"((?:[^"\\]|\\.)*)")/s);
    const idMatch = body.match(/\bsectionId\s*:\s*["']([^"']+)["']/);
    meta.anatomies.push({
      id: idMatch ? idMatch[1] : 'anatomy',
      hasReactCode: !!reactCodeMatch && (reactCodeMatch[1] || reactCodeMatch[2] || '').trim() !== '',
      hasQtCode: !!qtCodeMatch && (qtCodeMatch[1] || qtCodeMatch[2] || '').trim() !== '',
    });
  }

  const kbMatch = content.match(/KeyboardShortcutsTable\s*\{[^}]*?componentId:\s*["']([^"']+)["']/s);
  if (kbMatch) meta.keyboardComponentId = kbMatch[1];

  return meta;
}

export function verifyShowcaseParity(options = {}) {
  const { targetComponent = 'all' } = options;
  const specFiles = readdirSync(componentsDir).filter(f => f.endsWith('.ts'));

  const errors = [];
  const warnings = [];
  let checkedCount = 0;

  for (const file of specFiles) {
    const base = file.replace('.ts', '');
    if (targetComponent !== 'all' && base !== targetComponent) continue;

    const pascal = toPascalCase(base);
    const navId = specialMap[base]?.navId || base;
    const reactDocName = specialMap[base]?.reactDoc || `${pascal}DocPage.tsx`;
    const qtDocName = specialMap[base]?.qtDoc || `${pascal}DocPage.qml`;

    const navItem = navLookup.get(navId);
    if (!navItem) {
      errors.push(`[${base}] Missing navigation entry in spec/showcase/navigation.json (id: "${navId}")`);
      continue;
    }

    const reactDocPath = join(reactDocPagesDir, reactDocName);
    const qtDocPath = join(qtSrcDir, qtDocName);

    if (!existsSync(reactDocPath)) {
      errors.push(`[${base}] Missing React doc page: ${reactDocName}`);
      continue;
    }
    if (!existsSync(qtDocPath)) {
      errors.push(`[${base}] Missing Qt doc page: ${qtDocName}`);
      continue;
    }

    checkedCount++;
    const reactContent = readFileSync(reactDocPath, 'utf8');
    const qtContent = readFileSync(qtDocPath, 'utf8');

    const reactMeta = extractReactDocMetadata(reactContent);
    const qtMeta = extractQtDocMetadata(qtContent);

    // 1. Metadata Checks against Single Source of Truth (navigation.json)
    if (reactMeta.title !== navItem.title) {
      errors.push(`[${base}] React title mismatch: got "${reactMeta.title}", expected "${navItem.title}" from navigation.json`);
    }
    if (qtMeta.pageTitle !== navItem.title) {
      errors.push(`[${base}] Qt pageTitle mismatch: got "${qtMeta.pageTitle}", expected "${navItem.title}" from navigation.json`);
    }
    if (reactMeta.category !== navItem.category) {
      errors.push(`[${base}] React category mismatch: got "${reactMeta.category}", expected "${navItem.category}" from navigation.json`);
    }
    if (qtMeta.category !== navItem.category) {
      errors.push(`[${base}] Qt category mismatch: got "${qtMeta.category}", expected "${navItem.category}" from navigation.json`);
    }

    // 2. Keyboard Shortcuts ComponentId Check
    if (reactMeta.keyboardComponentId && !keyboardShortcuts[reactMeta.keyboardComponentId]) {
      errors.push(`[${base}] React KeyboardShortcutsTable componentId "${reactMeta.keyboardComponentId}" not defined in spec/showcase/keyboard-shortcuts.json`);
    }
    if (qtMeta.keyboardComponentId && !keyboardShortcuts[qtMeta.keyboardComponentId]) {
      errors.push(`[${base}] Qt KeyboardShortcutsTable componentId "${qtMeta.keyboardComponentId}" not defined in spec/showcase/keyboard-shortcuts.json`);
    }
    if (reactMeta.keyboardComponentId && qtMeta.keyboardComponentId && reactMeta.keyboardComponentId !== qtMeta.keyboardComponentId) {
      errors.push(`[${base}] KeyboardShortcutsTable componentId mismatch: React="${reactMeta.keyboardComponentId}" vs Qt="${qtMeta.keyboardComponentId}"`);
    }

    // 3. TOC Parity Checks
    const reactTocIds = reactMeta.tocItems.map(t => t.id);
    const qtTocIds = qtMeta.tocItems.map(t => t.id);

    if (reactTocIds.length === 0) {
      errors.push(`[${base}] React TOC is empty or missing tocItems`);
    }
    if (qtTocIds.length === 0) {
      errors.push(`[${base}] Qt TOC is empty or missing tocItems`);
    }

    if (reactTocIds.includes('preview')) {
      errors.push(`[${base}] React TOC uses legacy id "preview" instead of standard "overview" (Interactive Overview)`);
    }
    if (qtTocIds.includes('preview')) {
      errors.push(`[${base}] Qt TOC uses legacy id "preview" instead of standard "overview" (Interactive Overview)`);
    }

    // Strict 1:1 TOC ID Equivalence Check
    if (reactTocIds.join(',') !== qtTocIds.join(',')) {
      errors.push(`[${base}] TOC IDs mismatch across stacks: React=[${reactTocIds.join(', ')}] vs Qt=[${qtTocIds.join(', ')}]`);
    }

    // Title matching for identical IDs
    for (let i = 0; i < Math.min(reactMeta.tocItems.length, qtMeta.tocItems.length); i++) {
      const rItem = reactMeta.tocItems[i];
      const qItem = qtMeta.tocItems[i];
      if (rItem.id === qItem.id && rItem.title !== qItem.title) {
        errors.push(`[${base}] TOC title mismatch for id "${rItem.id}": React="${rItem.title}" vs Qt="${qItem.title}"`);
      }
    }

    // 4. ComponentPreview Cardinality & Title Equivalence Checks
    if (reactMeta.previews.length === 0) {
      errors.push(`[${base}] React doc page has no <ComponentPreview> components`);
    }
    if (qtMeta.previews.length === 0) {
      errors.push(`[${base}] Qt doc page has no ComponentPreview items`);
    }

    if (reactMeta.previews.length !== qtMeta.previews.length) {
      const rTitles = reactMeta.previews.map(p => `"${p.title || '(no-title)'}"`).join(', ');
      const qTitles = qtMeta.previews.map(p => `"${p.title || '(no-title)'}"`).join(', ');
      errors.push(
        `[${base}] ComponentPreview count mismatch: React has ${reactMeta.previews.length} preview(s) [${rTitles}], but Qt has ${qtMeta.previews.length} preview(s) [${qTitles}]`
      );
    }

    const minPreviews = Math.min(reactMeta.previews.length, qtMeta.previews.length);
    for (let i = 0; i < minPreviews; i++) {
      const rPrev = reactMeta.previews[i];
      const qPrev = qtMeta.previews[i];

      if (!rPrev.title) {
        errors.push(`[${base}] React ComponentPreview[${i}] is missing a 'title' prop`);
      }
      if (!qPrev.title) {
        errors.push(`[${base}] Qt ComponentPreview[${i}] is missing a 'title' property`);
      }

      if (rPrev.title && qPrev.title && rPrev.title !== qPrev.title) {
        errors.push(
          `[${base}] ComponentPreview[${i}] title mismatch: React="${rPrev.title}" vs Qt="${qPrev.title}"`
        );
      }
    }

    for (let i = 0; i < qtMeta.previews.length; i++) {
      const qPrev = qtMeta.previews[i];
      if (!qPrev.reactCode || qPrev.reactCode.trim() === '') {
        errors.push(`[${base}] Qt ComponentPreview[${i}] is missing 'reactCode' property`);
      }
      if (!qPrev.qtCode || qPrev.qtCode.trim() === '') {
        errors.push(`[${base}] Qt ComponentPreview[${i}] is missing 'qtCode' property`);
      }
    }

    for (let i = 0; i < reactMeta.previews.length; i++) {
      const rPrev = reactMeta.previews[i];
      if (!rPrev.hasReactCode) {
        errors.push(`[${base}] React ComponentPreview[${i}] is missing 'reactCode' prop`);
      }
      if (!rPrev.hasQtCode) {
        errors.push(`[${base}] React ComponentPreview[${i}] is missing 'qtCode' prop`);
      }
    }

    // 5. DocAnatomy Contract Gate
    // Every page that declares an "anatomy" TOC section must render the shared
    // DocAnatomy component on both stacks (never a hand-rolled section), and
    // every DocAnatomy instance must supply both language snippets.
    const hasAnatomyToc = reactTocIds.includes('anatomy') || qtTocIds.includes('anatomy');
    const reactAnatomies = reactMeta.anatomies || [];
    const qtAnatomies = qtMeta.anatomies || [];

    if (hasAnatomyToc && reactAnatomies.length === 0) {
      errors.push(
        `[${base}] Page declares an "anatomy" TOC section but React does not render the shared <DocAnatomy> component`
      );
    }
    if (hasAnatomyToc && qtAnatomies.length === 0) {
      errors.push(
        `[${base}] Page declares an "anatomy" TOC section but Qt does not render the shared DocAnatomy component`
      );
    }

    if (reactAnatomies.length !== qtAnatomies.length) {
      errors.push(
        `[${base}] DocAnatomy count mismatch: React has ${reactAnatomies.length}, but Qt has ${qtAnatomies.length}`
      );
    }

    const minAnatomies = Math.min(reactAnatomies.length, qtAnatomies.length);
    for (let i = 0; i < minAnatomies; i++) {
      if (!reactAnatomies[i].hasReactCode) {
        errors.push(`[${base}] React DocAnatomy[${i}] is missing a non-empty 'reactCode' prop`);
      }
      if (!reactAnatomies[i].hasQtCode) {
        errors.push(`[${base}] React DocAnatomy[${i}] is missing a non-empty 'qtCode' prop`);
      }
      if (!qtAnatomies[i].hasReactCode) {
        errors.push(`[${base}] Qt DocAnatomy[${i}] is missing a non-empty 'reactCode' property`);
      }
      if (!qtAnatomies[i].hasQtCode) {
        errors.push(`[${base}] Qt DocAnatomy[${i}] is missing a non-empty 'qtCode' property`);
      }
    }

    // 6. Component-Specific Parity Gates
    if (base === 'splitter') {
      const rIds = reactTocIds.join(',');
      const qIds = qtTocIds.join(',');
      if (rIds !== qIds) {
        errors.push(`[splitter] TOC IDs must match exactly: React=[${rIds}] vs Qt=[${qIds}]`);
      }
      if (!qtContent.includes('Editor Workspace')) {
        errors.push(`[splitter] Qt sandbox must include "Editor Workspace" header to match React`);
      }
      if (!qtContent.includes('Navigation Tree')) {
        errors.push(`[splitter] Qt sandbox must include "Navigation Tree" header to match React`);
      }
      if (!qtContent.includes('Reset (35%)')) {
        errors.push(`[splitter] Qt sandbox must include "Reset (35%)" button to match React`);
      }
    }
  }

  return {
    checkedCount,
    errors,
    warnings,
    ok: errors.length === 0,
  };
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(__filename)) {
  const args = process.argv.slice(2);
  const compIndex = args.indexOf('--component');
  const targetComponent = compIndex !== -1 ? args[compIndex + 1] : 'all';

  console.log(`[showcase-parity] Running cross-stack showcase parity check for "${targetComponent}"...`);
  const result = verifyShowcaseParity({ targetComponent });

  if (result.warnings.length > 0) {
    console.warn(`[showcase-parity] WARNINGS (${result.warnings.length}):`);
    for (const w of result.warnings) {
      console.warn(`  - ${w}`);
    }
  }

  if (!result.ok) {
    console.error(`[showcase-parity] FAIL: ${result.errors.length} parity errors detected across ${result.checkedCount} components:`);
    for (const err of result.errors) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }

  console.log(`[showcase-parity] OK — All ${result.checkedCount} components showcase metadata and structure verified.`);
}
