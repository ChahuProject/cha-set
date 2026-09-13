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

  const tocMatches = [...content.matchAll(/\{\s*id[:=]\s*["']([^"']+)["'],\s*title[:=]\s*["']([^"']+)["']/g)];
  meta.tocItems = tocMatches.map(m => ({ id: m[1], title: m[2] }));

  const prevTitleMatch = content.match(/ComponentPreview\s*\{?[^>]*?title[:=]\s*["']([^"']+)["']/s);
  if (prevTitleMatch) meta.previewTitle = prevTitleMatch[1];

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

  const tocMatches = [...content.matchAll(/\{\s*id:\s*["']([^"']+)["'],\s*title:\s*["']([^"']+)["']/g)];
  meta.tocItems = tocMatches.map(m => ({ id: m[1], title: m[2] }));

  const prevTitleMatch = content.match(/ComponentPreview\s*\{[^}]*?title:\s*["']([^"']+)["']/s);
  if (prevTitleMatch) meta.previewTitle = prevTitleMatch[1];

  const kbMatch = content.match(/KeyboardShortcutsTable\s*\{[^}]*?componentId:\s*["']([^"']+)["']/s);
  if (kbMatch) meta.keyboardComponentId = kbMatch[1];

  const reactCodeMatch = content.match(/reactCode:\s*(?:`([^`]+)`|["']([^"']+)["'])/);
  if (reactCodeMatch) meta.reactCode = reactCodeMatch[1] || reactCodeMatch[2] || '';

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

    if (qtTocIds.includes('preview') && reactTocIds.includes('overview')) {
      errors.push(`[${base}] Qt TOC uses legacy id "preview" instead of standard "overview" (Interactive Overview)`);
    }
    if (qtTocIds.includes('props') && reactTocIds.includes('props')) {
      const qPropsTitle = qtMeta.tocItems.find(t => t.id === 'props')?.title;
      const rPropsTitle = reactMeta.tocItems.find(t => t.id === 'props')?.title;
      if (qPropsTitle !== rPropsTitle) {
        errors.push(`[${base}] Props TOC title mismatch: React="${rPropsTitle}" vs Qt="${qPropsTitle}" (standardize on "Props Reference")`);
      }
    }

    // 4. Splitter Component-Specific Parity
    if (base === 'splitter') {
      const rIds = reactTocIds.join(',');
      const qIds = qtTocIds.join(',');
      if (rIds !== qIds) {
        errors.push(`[splitter] TOC IDs must match exactly: React=[${rIds}] vs Qt=[${qIds}]`);
      }
      if (reactMeta.previewTitle !== qtMeta.previewTitle) {
        errors.push(`[splitter] ComponentPreview title mismatch: React="${reactMeta.previewTitle}" vs Qt="${qtMeta.previewTitle}"`);
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
