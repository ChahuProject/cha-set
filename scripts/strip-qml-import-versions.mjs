#!/usr/bin/env node
// scripts/strip-qml-import-versions.mjs
//
// Qt 6 supports *versionless* QML imports: `import QtQuick` resolves to the
// highest version the running Qt provides, so the source never needs to be
// touched again when the toolchain is upgraded (6.10 -> 6.12 -> ...).
//
// This script rewrites every versioned import it can find in the repo, e.g.
//
//   import QtQuick <major>.<minor>              -> import QtQuick
//   import QtQuick.Controls <major>.<minor>     -> import QtQuick.Controls
//   import QtQuick.Templates <major>.<minor> as T -> import QtQuick.Templates as T
//   import QtQuick <old>.<minor>                -> import QtQuick
//   import ChaSet <module version>               -> import ChaSet
//
// It also patches the same pattern inside string literals (doc-page code
// previews, generator templates, markdown examples), so a single pass keeps
// the whole repository consistent.
//
// Usage:
//   node scripts/strip-qml-import-versions.mjs           # rewrite in place
//   node scripts/strip-qml-import-versions.mjs --check   # report only, exit 1 if any remain
//   node scripts/strip-qml-import-versions.mjs --dry-run # show the diff, write nothing

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const selfPath = fileURLToPath(import.meta.url);

/** Directories that hold build output / vendored code, never source of truth. */
const SKIP_DIRS = new Set([
  '.git',
  'node_modules',
  'dist',
  'target',
  '.pixel-diff',
  '.visual-diff',
  '.cache',
  'third_party',
]);

/** Build trees are matched by prefix (build, build-hot, build-debug, ...). */
const SKIP_DIR_PREFIXES = ['build'];

/** Only these extensions can carry a QML import statement (or a snippet of one). */
const TARGET_EXTS = new Set(['.qml', '.qmltypes', '.mjs', '.ts', '.tsx', '.md']);

/**
 * `import <Module> <major>.<minor>[.<patch>]` where Module is a Qt module or the
 * ChaSet module itself. The lookahead allows a following keyword (`as`),
 * whitespace, a string/closing delimiter (snippets), or an escaped newline
 * (`\n` inside a JS/TS string literal).
 *
 * Note: no `\b` before `import` — inside a string literal the preceding
 * character is the literal `n` of an escaped `\n`, so a word boundary would
 * never be there. Module-name matching alone is specific enough here.
 */
const IMPORT_VERSION_RE =
  /(import[ \t]+)((?:Qt[A-Za-z0-9_.]*|ChaSet))([ \t]+)(\d+\.\d+(?:\.\d+)?)(?=[\s"'`\],;\\]|$)/g;


function isSkippedDir(name) {
  if (SKIP_DIRS.has(name)) return true;
  return SKIP_DIR_PREFIXES.some((prefix) => name === prefix || name.startsWith(`${prefix}-`));
}

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (isSkippedDir(entry.name)) continue;
      yield* walk(full);
      continue;
    }
    if (!entry.isFile()) continue;
    const dot = entry.name.lastIndexOf('.');
    if (dot === -1) continue;
    if (!TARGET_EXTS.has(entry.name.slice(dot))) continue;
    yield full;
  }
}

function strip(content) {
  const hits = [];
  const next = content.replace(IMPORT_VERSION_RE, (match, kw, moduleName, gap, version) => {
    hits.push({ match, replaced: `${kw}${moduleName}` });
    return `${kw}${moduleName}`;
  });
  return { next, hits };
}

const checkOnly = process.argv.includes('--check');
const dryRun = process.argv.includes('--dry-run');

let scanned = 0;
let changedFiles = 0;
let totalHits = 0;
const offenders = [];
const moduleTally = new Map();

for (const file of walk(repoRoot)) {
  if (file === selfPath) continue;
  const rel = relative(repoRoot, file).split(sep).join('/');
  const original = readFileSync(file, 'utf8');
  if (!original.includes('import')) continue;
  scanned += 1;

  const { next, hits } = strip(original);
  if (hits.length === 0) continue;

  changedFiles += 1;
  totalHits += hits.length;
  for (const hit of hits) {
    const moduleName = hit.replaced.replace(/^import[ \t]+/, '');
    moduleTally.set(moduleName, (moduleTally.get(moduleName) ?? 0) + 1);
  }
  offenders.push({ rel, count: hits.length });

  if (checkOnly) continue;
  if (dryRun) {
    for (const hit of hits) console.log(`  ${rel}: "${hit.match}" -> "${hit.replaced}"`);
    continue;
  }
  writeFileSync(file, next, 'utf8');
}

const moduleSummary = [...moduleTally.entries()]
  .sort((a, b) => b[1] - a[1])
  .map(([name, count]) => `${name} x${count}`)
  .join(', ');

if (totalHits === 0) {
  console.log(`[strip-qml-imports] OK — no versioned imports remain (${scanned} files scanned).`);
  process.exit(0);
}

if (checkOnly) {
  console.error(
    `[strip-qml-imports] FAIL — ${totalHits} versioned import(s) in ${changedFiles} file(s):`,
  );
  for (const { rel, count } of offenders) console.error(`  ${rel} (${count})`);
  console.error('[strip-qml-imports] Run `pnpm fix:qml-imports` to strip the versions.');
  process.exit(1);
}

console.log(
  `[strip-qml-imports] ${dryRun ? 'Would strip' : 'Stripped'} ${totalHits} versioned import(s) ` +
    `in ${changedFiles} file(s) (${scanned} files scanned).`,
);
if (moduleSummary) console.log(`[strip-qml-imports] Modules: ${moduleSummary}`);
