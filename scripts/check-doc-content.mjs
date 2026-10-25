// scripts/check-doc-content.mjs
// Gate: the Markdown-derived doc content must stay in lockstep across the two stacks.
//
// spec/content/<docId>/<locale>.md is parsed at build time (generate-doc-content.mjs) into one
// AST that both renderers consume. Two things can still rot, and neither is visible to the
// source-scanning showcase parity gate because the prose no longer lives in the page files:
//
//   1. A page migrates to DocMarkdown on one stack but keeps hand-written prose on the other.
//   2. A page declares a `demo` / `anatomy` / `props` slot that only one stack implements.
//
// This check asserts both stacks consume the exact same section set for every documented
// component, and that every slot referenced by a section is provided by both pages.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export const toPascal = (id) =>
  id
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

/** Collect the section ids a page pulls from Markdown (empty set = page not migrated yet). */
export function readSections(source) {
  const ids = new Set();
  // Matches section="x" (QML/JSX literal) and section={"x"} (JSX expression).
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
  const indexPath = join(rootDir, 'spec', 'content', '_index.json');
  const reactPagesDir = join(rootDir, 'packages', 'react', 'examples', 'basic', 'src', 'pages', 'components');
  const qtPagesDir = join(rootDir, 'qt', 'src');

  if (!existsSync(indexPath)) {
    return { ok: false, checked: 0, errors: ['spec/content/_index.json is missing — run `pnpm gen:docs`'] };
  }

  const index = JSON.parse(readFileSync(indexPath, 'utf8'));
  const errors = [];
  let checked = 0;

  for (const [docId, byLocale] of Object.entries(index.docs)) {
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

    const sections = byLocale[index.defaultLocale] ?? Object.values(byLocale)[0] ?? [];

    // 1. Both stacks must render the same Markdown sections.
    const missingQt = [...reactSections].filter((id) => !qtSections.has(id));
    const missingReact = [...qtSections].filter((id) => !reactSections.has(id));
    if (missingQt.length) errors.push(`[${docId}] Qt page is missing Markdown section(s): ${missingQt.join(', ')}`);
    if (missingReact.length) errors.push(`[${docId}] React page is missing Markdown section(s): ${missingReact.join(', ')}`);

    // 2. Every section authored in Markdown must be consumed, otherwise the prose never renders.
    for (const section of sections) {
      if (!reactSections.has(section.id) && !qtSections.has(section.id)) {
        errors.push(`[${docId}] section "${section.id}" exists in ${docId}.md but no page renders it`);
      }
    }

    // 3. Slots referenced by the Markdown must be implemented by both pages.
    const requiredSlots = new Set(sections.flatMap((s) => s.slots ?? []));
    const reactSlots = readSlots(reactSrc);
    const qtSlots = readSlots(qtSrc);
    for (const slot of requiredSlots) {
      if (!reactSlots.has(slot)) errors.push(`[${docId}] React page does not implement slot "${slot}"`);
      if (!qtSlots.has(slot)) errors.push(`[${docId}] Qt page does not implement slot "${slot}"`);
    }

    checked += 1;
  }

  if (!quiet && !errors.length) {
    console.log(`[check-doc-content] OK — ${checked} documented component(s) consume identical Markdown sections on React & Qt`);
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

  const qtSections = readSections('DocMarkdown {\n    section: "animations"\n}\n');
  if (!qtSections.has('animations')) errors.push('readSections missed a QML section id');

  const slots = readSlots('<DocMarkdown slots={{ overview: <Overview />, anatomy: <Anatomy /> }} />');
  if (!slots.has('overview') || !slots.has('anatomy')) errors.push('readSlots missed object-literal slots');
  const qtSlots = readSlots('DocMarkdown {\n    slots: { overview: overviewComp }\n}');
  if (!qtSlots.has('overview')) errors.push('readSlots missed QML slots');

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
