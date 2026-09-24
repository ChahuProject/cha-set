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
    const sectionRegex = /<section\b[^>]*?id=["']([^"']+)["'][^>]*>([\s\S]*?)<\/section>/g;
    let sMatch;
    while ((sMatch = sectionRegex.exec(content)) !== null) {
      const id = sMatch[1];
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
      if (!title || (id === 'overview' && title.toLowerCase().includes('sandbox'))) {
        if (id === 'overview') title = 'Interactive Overview';
        else if (id === 'installation') title = 'Installation';
        else if (id === 'animations') title = 'Animations';
        else if (id === 'keyboard') title = 'Keyboard Navigation';
        else if (id === 'props') title = 'Props Reference';
        else title = id.split(/[-_]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }
      meta.tocItems.push({ id, title });
    }
  }

  meta.previews = [];
  const rRegex = /<ComponentPreview\b([\s\S]*?)>/g;
  let rMatch;
  while ((rMatch = rRegex.exec(content)) !== null) {
    const attrs = rMatch[1];
    const titleMatch = attrs.match(/title=(?:["']([^"']+)["']|\{["']([^"']+)["']\})/);
    const title = titleMatch ? (titleMatch[1] || titleMatch[2]) : '';
    const hasReactCode = /reactCode=/.test(attrs);
    const hasControls = /controls=/.test(attrs);
    meta.previews.push({ title, hasReactCode, hasControls });
  }
  meta.previewTitle = meta.previews[0]?.title || '';

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
    if (/ComponentPreview\s*\{/.test(content)) {
      meta.tocItems.push({ id: 'overview', title: 'Interactive Overview' });
    }
    const docTextRegex = /DocText\s*\{[^}]*?text\s*:\s*["']([^"']+)["'][^}]*?(?:sizeTitleSm|weightBold|weightSemibold|sizeHeading)/g;
    let tMatch;
    while ((tMatch = docTextRegex.exec(content)) !== null) {
      const title = tMatch[1].trim();
      let id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      if (id === 'interactive-overview' || id === 'sandbox') id = 'overview';
      else if (id === 'keyboard-navigation') id = 'keyboard';
      else if (id === 'props-reference') id = 'props';

      if (!meta.tocItems.some(item => item.id === id)) {
        meta.tocItems.push({ id, title });
      }
    }
    if (/KeyboardShortcutsTable\s*\{/.test(content) && !meta.tocItems.some(i => i.id === 'keyboard')) {
      meta.tocItems.push({ id: 'keyboard', title: 'Keyboard Navigation' });
    }
    if (/PropsTable\s*\{/.test(content) && !meta.tocItems.some(i => i.id === 'props')) {
      meta.tocItems.push({ id: 'props', title: 'Props Reference' });
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
    const hasControls = /controlsData\s*:/.test(snippet);
    meta.previews.push({ title, reactCode, hasControls });
  }
  meta.previewTitle = meta.previews[0]?.title || '';
  meta.reactCode = meta.previews[0]?.reactCode || '';

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
    }

    // 5. Component-Specific Parity Gates
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
