// scripts/check-doc-content.mjs
// Gate: the runtime-parsed living-doc prose must stay valid and in lockstep across stacks.
//
// spec/content/<docId>/<locale>.md is parsed at RUNTIME by spec/shared/docAst.mjs — the exact
// same file both renderers import. Nothing is generated, so this gate is the only thing standing
// between a typo in prose and a silently blank section:
//
//   1. Every .md must parse with zero dialect errors (unknown syntax, missing front matter).
//   2. Every locale of a doc must expose the same section id sequence.
//   3. Both stacks must consume the same Markdown section set for that component.
//   4. Every section authored in Markdown must be rendered by at least one stack.
//   5. Every slot declared in Markdown must be implemented by both pages.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDocAst, sectionIds, slotNames, inlineText, splitShortcut } from '../spec/shared/docAst.mjs';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const contentDir = join(rootDir, 'spec', 'content');
const reactPagesDir = join(rootDir, 'packages', 'react', 'examples', 'basic', 'src', 'pages', 'components');
const qtPagesDir = join(rootDir, 'qt', 'src');

export const toPascal = (id) =>
  id
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

/** Section ids a page pulls from Markdown: section="x" (JSX/QML literal) or section={"x"}. */
export function readSections(source) {
  const ids = new Set();
  const re = /section[:=]\s*\{?\s*["']([\w-]+)["']\s*\}?/g;
  let match;
  while ((match = re.exec(source)) !== null) ids.add(match[1]);
  return ids;
}

export function readSlots(source) {
  const slots = new Set();
  const call = /slots[:=]\s*\{([^}]*)\}/s.exec(source);
  if (!call) return slots;
  const re = /["']?([\w-]+)["']?\s*:/g;
  let match;
  while ((match = re.exec(call[1])) !== null) slots.add(match[1]);
  return slots;
}

export function verifyDocContent({ quiet = false } = {}) {
  const errors = [];
  let checked = 0;

  if (!existsSync(contentDir)) {
    return { ok: true, checked: 0, errors: [] };
  }

  const docIds = readdirSync(contentDir).filter((name) => {
    const full = join(contentDir, name);
    return existsSync(full) && readdirSync(full).some((f) => f.endsWith('.md'));
  });

  for (const docId of docIds) {
    const dir = join(contentDir, docId);
    const localeFiles = readdirSync(dir).filter((f) => f.endsWith('.md')).sort();
    const pages = {};

    for (const file of localeFiles) {
      const full = join(dir, file);
      const locale = file.replace(/\.md$/, '');
      const { page, errors: parseErrors } = buildDocAst(readFileSync(full, 'utf8'));
      const where = relative(rootDir, full).replace(/\\/g, '/');

      for (const error of parseErrors) errors.push(`${where}: ${error}`);
      if (!page) continue;
      if (page.id !== docId) errors.push(`${where}: front matter id "${page.id}" does not match directory "${docId}"`);
      pages[locale] = page;
    }

    const locales = Object.keys(pages);
    if (locales.length === 0) continue;

    // 2. Every locale must expose the same section sequence.
    const reference = sectionIds(pages[locales[0]]).join(',');
    for (const locale of locales.slice(1)) {
      const actual = sectionIds(pages[locale]).join(',');
      if (actual !== reference) {
        errors.push(`[${docId}] ${locale} sections [${actual}] differ from ${locales[0]} [${reference}]`);
      }
    }

    // 3-5. Both stacks must consume the same sections and implement the same slots.
    const pascal = toPascal(docId);
    const reactPath = join(reactPagesDir, `${pascal}DocPage.tsx`);
    const qtPath = join(qtPagesDir, `${pascal}DocPage.qml`);
    if (!existsSync(reactPath) || !existsSync(qtPath)) {
      const missing = [!existsSync(reactPath) && `${pascal}DocPage.tsx`, !existsSync(qtPath) && `${pascal}DocPage.qml`]
        .filter(Boolean)
        .join(', ');
      errors.push(`[${docId}] missing living-doc page (${missing})`);
      continue;
    }

    const reactSrc = readFileSync(reactPath, 'utf8');
    const qtSrc = readFileSync(qtPath, 'utf8');
    const reactSections = readSections(reactSrc);
    const qtSections = readSections(qtSrc);

    for (const id of reactSections) if (!qtSections.has(id)) errors.push(`[${docId}] Qt page is missing Markdown section "${id}"`);
    for (const id of qtSections) if (!reactSections.has(id)) errors.push(`[${docId}] React page is missing Markdown section "${id}"`);

    const authored = sectionIds(pages[locales[0]]);
    for (const id of authored) {
      if (!reactSections.has(id) && !qtSections.has(id)) {
        errors.push(`[${docId}] section "${id}" exists in ${docId}.md but no page renders it`);
      }
    }

    const requiredSlots = new Set();
    for (const locale of locales) for (const name of slotNames(pages[locale])) requiredSlots.add(name);
    const reactSlots = readSlots(reactSrc);
    const qtSlots = readSlots(qtSrc);
    for (const slot of requiredSlots) {
      if (!reactSlots.has(slot)) errors.push(`[${docId}] React page does not implement slot "${slot}"`);
      if (!qtSlots.has(slot)) errors.push(`[${docId}] Qt page does not implement slot "${slot}"`);
    }

    checked += 1;
  }

  if (!quiet && errors.length === 0) {
    console.log(`[check-doc-content] OK — ${checked} documented component(s) parse cleanly and share identical Markdown sections`);
  }
  return { ok: errors.length === 0, checked, errors };
}

/** Prove the detectors still fire, so a silently-broken regex cannot pass the gate forever. */
export function selfTest() {
  const errors = [];

  const sections = readSections('<DocMarkdown id="x" section="animations" />\n<DocMarkdown\n  section={"keyboard"}\n/>');
  if (!sections.has('animations')) errors.push('readSections missed a string section id');
  if (!sections.has('keyboard')) errors.push('readSections missed a JSX expression section id');
  if (readSections('').size !== 0) errors.push('readSections invented a section id from empty input');
  if (!readSections('DocMarkdown {\n    section: "animations"\n}\n').has('animations')) {
    errors.push('readSections missed a QML section id');
  }

  const slots = readSlots('<DocMarkdown slots={{ overview: <Overview />, anatomy: <Anatomy /> }} />');
  if (!slots.has('overview') || !slots.has('anatomy')) errors.push('readSlots missed object-literal slots');
  if (!readSlots('DocMarkdown {\n    slots: { overview: overviewComp }\n}').has('overview')) {
    errors.push('readSlots missed QML slots');
  }

  // The shared parser is the runtime contract: keep a smoke test so a broken edit fails the gate
  // instead of rendering an empty section in both apps.
  const fixture = [
    '---',
    'id: probe',
    'component: probe',
    'category: Probe',
    'title: Probe',
    'description: Probe page.',
    '---',
    '',
    '## Animations {#animations}',
    '',
    'Intro with `duration-quick` inline.',
    '',
    '- First `a` item',
    '- Second item',
    '',
    '```overview',
    '```',
    '',
  ].join('\n');
  const probe = buildDocAst(fixture);
  if (probe.errors.length) errors.push(`parser rejected the clean fixture: ${probe.errors.join(' | ')}`);
  if (sectionIds(probe.page).join(',') !== 'animations') errors.push('parser lost the heading id');
  if (slotNames(probe.page).join(',') !== 'overview') errors.push('parser lost the slot fence');
  const inline = probe.page?.sections[0]?.blocks[2]?.items?.[0] ?? [];
  if (!inline.some((node) => node.t === 'code' && node.v === 'a')) errors.push('parser lost inline code');
  if (probe.page?.sections[0]?.blocks[2]?.t !== 'list' || probe.page?.sections[0]?.blocks[2]?.ordered !== false) {
    errors.push('parser lost unordered list');
  }

  // Ordered and numbered list testing
  const orderedFixture = [
    fixture,
    '',
    '1. First numbered item with `token`',
    '2. Second numbered item',
  ].join('\n');
  const orderedProbe = buildDocAst(orderedFixture);
  if (orderedProbe.errors.length) errors.push(`parser rejected ordered list fixture: ${orderedProbe.errors.join(' | ')}`);
  const orderedBlock = orderedProbe.page?.sections[0]?.blocks?.find((b) => b.t === 'list' && b.ordered === true);
  if (!orderedBlock || orderedBlock.items.length !== 2) errors.push('parser lost ordered/numbered list block');
  if (!orderedBlock?.items?.[0]?.some((n) => n.t === 'code' && n.v === 'token')) errors.push('parser lost inline code in ordered list');

  // Keycaps and typed tables are the tableture of the docs: a regression here renders a
  // table as plain text (or drops a keycap) on both stacks without any error dialog.
  const rich = buildDocAst(
    fixture +
      '\nPress [[Ctrl+K]] and [[Space / Enter]].\n\n' +
      '```table shortcuts\n| Key | Behavior |\n| --- | --- |\n| [[Tab]] | Move focus |\n```\n\n' +
      '```table props\n| Prop | Type | Default | Description |\n| --- | --- | --- | --- |\n| `variant` | `"a" \\| "b"` | `"a"` | Appearance |\n```\n',
  );
  if (rich.errors.length) errors.push(`parser rejected keycap/table fixture: ${rich.errors.join(' | ')}`);

  const richBlocks = rich.page?.sections[0]?.blocks ?? [];
  const keycapParagraph = richBlocks.find((b) => b.t === 'para' && b.inlines.some((n) => n.t === 'kbd'));
  if (!keycapParagraph) errors.push('parser lost inline [[kbd]]');
  else if (keycapParagraph.inlines.filter((n) => n.t === 'kbd').map((n) => n.v).join('|') !== 'Ctrl+K|Space / Enter') {
    errors.push('parser mangled the keycap payload');
  }

  const shortcutTable = richBlocks.find((b) => b.t === 'table' && b.schema === 'shortcuts');
  if (!shortcutTable) errors.push('parser lost the "table shortcuts" schema');
  const propsTable = richBlocks.find((b) => b.t === 'table' && b.schema === 'props');
  if (!propsTable) errors.push('parser lost the "table props" schema');
  else if (inlineText(propsTable.rows[0][1]) !== '"a" | "b"') {
    errors.push('parser lost the escaped pipe inside a table cell');
  }

  if (splitShortcut('Space / Enter').length !== 2) errors.push('splitShortcut lost the "/" alternative');
  if (splitShortcut('Ctrl + Shift + P')[0]?.length !== 3) errors.push('splitShortcut lost the "+" chord');

  const badSchema = buildDocAst(`${fixture}\n\`\`\`table nope\n| a |\n| --- |\n\`\`\`\n`);
  if (!badSchema.errors.some((error) => error.includes('unknown table schema'))) {
    errors.push('parser accepted an unknown table schema');
  }
  const shortProps = buildDocAst(`${fixture}\n\`\`\`table props\n| a | b |\n| --- | --- |\n| 1 | 2 |\n\`\`\`\n`);
  if (!shortProps.errors.some((error) => error.includes('needs 4 columns'))) {
    errors.push('parser accepted a props table with the wrong column count');
  }

  const bad = buildDocAst('> quote\n\n## H {#h}\n');
  if (!bad.errors.some((error) => error.includes('blockquote'))) errors.push('parser accepted a blockquote');

  return { ok: errors.length === 0, errors };
}

const invokedDirectly = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (invokedDirectly) {
  const test = selfTest();
  if (!test.ok) {
    console.error('[check-doc-content] FAIL: detector self-test failed');
    for (const error of test.errors) console.error(`  - ${error}`);
    process.exit(1);
  }
  const result = verifyDocContent();
  if (!result.ok) {
    console.error('[check-doc-content] FAIL — Markdown content is out of sync across stacks:');
    for (const error of result.errors) console.error(`  - ${error}`);
    process.exit(1);
  }
}
