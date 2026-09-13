#!/usr/bin/env node
// check-typography-parity.mjs — cross-stack typography drift gate.
//
// React (Web) and Qt (Desktop) must resolve the same font family, size, weight,
// line height and letter spacing for every text role. The values live once, in
// spec/tokens/primitives.json -> primitives.typography / primitives.fontWeight,
// and are fanned out by pnpm gen:all into:
//
//   packages/react/src/styles/tokens.css   (custom properties, rem/ratio/em)
//   qt/src/Typography.generated.qml        (singleton Typography, px/int/real)
//
// This gate re-derives the expected strings from the spec using the SAME
// formatters the generators use (spec/token-helpers.mjs) and fails if either
// artifact disagrees — i.e. if anyone hand-edited a generated file or let a
// generator drift. It also rejects the two shapes that cannot be unified:
//
//   ERROR  qt/**/*.qml   font.family with a comma-separated list (Qt resolves
//                        one family; the fallback stack would be silently lost)
//   ERROR  React source  a raw `leading-[…]` literal (no Qt counterpart exists,
//                        which is exactly how the Code Block line-height broke)
//   WARN   React source  still-arbitrary `text-[…]` sizes (migrate to a token)
//
// Usage: node scripts/check-typography-parity.mjs [--quiet]
// Exit 0 = in sync; exit 1 = drift (every violation printed).
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadTokensSync } from '../spec/load-tokens.mjs';
import {
  pxToRem,
  ratioValue,
  emValue,
  camelProp,
  FONT_FAMILY_ORDER,
  FONT_SIZE_ORDER,
  LINE_HEIGHT_ORDER,
  LETTER_SPACING_ORDER,
} from '../spec/token-helpers.mjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const CSS_PATH = resolve(repoRoot, 'packages/react/src/styles/tokens.css');
const QML_PATH = resolve(repoRoot, 'qt/src/Typography.generated.qml');
const ALLOWLIST_PATH = resolve(repoRoot, 'scripts/typography-allowlist.json');

function walk(dir, filter, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'build' || entry.name.startsWith('.')) continue;
      walk(full, filter, out);
    } else if (filter(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

/** Parse `--name: value;` declarations from a CSS file. First wins (the :root block). */
function parseCssVars(text) {
  const map = new Map();
  for (const m of text.matchAll(/(--[a-zA-Z0-9-]+)\s*:\s*([^;]+);/g)) {
    if (!map.has(m[1])) map.set(m[1], m[2].trim());
  }
  return map;
}

/** Parse `readonly property <type> <name>: <value>` lines from the QML singleton. */
function parseQmlProps(text) {
  const map = new Map();
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*readonly\s+property\s+(?:string|int|real)\s+(\w+)\s*:\s*(.+?)\s*$/);
    if (!m) continue;
    let value = m[2];
    const comment = value.indexOf('//');
    if (comment !== -1) value = value.slice(0, comment);
    value = value.trim().replace(/^"|"$/g, '');
    if (!map.has(m[1])) map.set(m[1], value);
  }
  return map;
}

export function verifyTypographyParity({ quiet = false } = {}) {
  const errors = [];
  const warnings = [];
  let checked = 0;

  const { tokens: spec, source } = loadTokensSync({ from: 'split' });
  const typo = spec.primitives?.typography;
  const weights = spec.primitives?.fontWeight ?? {};
  if (!typo) {
    return { ok: false, errors: ['spec primitives.typography is missing'], warnings, checkedCount: 0, source };
  }

  // ---- expected values, derived through the shared formatters -------------
  const expectedCss = new Map();
  const expectedQml = new Map();

  for (const fam of FONT_FAMILY_ORDER) {
    const def = typo.fontFamily?.[fam];
    if (!def) continue;
    expectedCss.set(`--cs-font-${fam}`, def.css);
    expectedQml.set(`family${camelProp(fam)}`, def.qt);
  }
  for (const [k, v] of Object.entries(weights)) {
    expectedCss.set(`--cs-font-weight-${k}`, String(v));
    expectedQml.set(`weight${camelProp(k)}`, String(v));
  }
  for (const [k, v] of Object.entries(typo.fontSize ?? {})) {
    expectedCss.set(`--cs-text-${k}`, pxToRem(v));
    expectedQml.set(`size${camelProp(k)}`, String(v));
  }
  for (const [k, v] of Object.entries(typo.lineHeight ?? {})) {
    expectedCss.set(`--cs-leading-${k}`, ratioValue(v));
    expectedQml.set(`leading${camelProp(k)}`, String(v));
  }
  for (const [k, v] of Object.entries(typo.letterSpacing ?? {})) {
    expectedCss.set(`--cs-tracking-${k}`, emValue(v));
    expectedQml.set(`tracking${camelProp(k)}`, String(v));
  }

  // ---- artifact presence + value agreement -------------------------------
  if (!existsSync(CSS_PATH)) {
    errors.push(`missing ${relative(repoRoot, CSS_PATH)} — run "pnpm gen:all"`);
  } else {
    const vars = parseCssVars(readFileSync(CSS_PATH, 'utf8'));
    for (const [name, want] of expectedCss) {
      checked += 1;
      const got = vars.get(name);
      if (got === undefined) errors.push(`${relative(repoRoot, CSS_PATH)}: ${name} is missing (expected ${want})`);
      else if (got !== want) errors.push(`${relative(repoRoot, CSS_PATH)}: ${name} is "${got}" but the spec says "${want}"`);
    }
  }

  if (!existsSync(QML_PATH)) {
    errors.push(`missing ${relative(repoRoot, QML_PATH)} — run "pnpm gen:all"`);
  } else {
    const props = parseQmlProps(readFileSync(QML_PATH, 'utf8'));
    for (const [name, want] of expectedQml) {
      checked += 1;
      const got = props.get(name);
      if (got === undefined) errors.push(`${relative(repoRoot, QML_PATH)}: property ${name} is missing (expected ${want})`);
      else if (got !== want) errors.push(`${relative(repoRoot, QML_PATH)}: property ${name} is "${got}" but the spec says "${want}"`);
    }
  }

  // ---- Qt: font.family must be a single family ----------------------------
  const qtFiles = walk(resolve(repoRoot, 'qt/src'), (n) => n.endsWith('.qml'));
  for (const file of qtFiles) {
    const rel = relative(repoRoot, file).replace(/\\/g, '/');
    const lines = readFileSync(file, 'utf8').split(/\r?\n/);
    lines.forEach((line, i) => {
      const m = line.match(/font\.family\s*:\s*"([^"]*)"/);
      if (!m) return;
      checked += 1;
      if (m[1].includes(',')) {
        errors.push(
          `${rel}:${i + 1}: font.family "${m[1]}" is a comma-separated list — Qt resolves a single family, so the fallback is silently dropped. Use Typography.familySans / Typography.familyMono.`,
        );
      }
    });
  }

  // ---- React: no raw leading-[…] literal ---------------------------------
  const reactFiles = walk(resolve(repoRoot, 'packages/react/src'), (n) => /\.(ts|tsx)$/.test(n) && !n.endsWith('.d.ts'));
  const arbitraryText = [];
  for (const file of reactFiles) {
    const rel = relative(repoRoot, file).replace(/\\/g, '/');
    const lines = readFileSync(file, 'utf8').split(/\r?\n/);
    lines.forEach((line, i) => {
      for (const m of line.matchAll(/leading-\[([^\]]+)\]/g)) {
        checked += 1;
        if (m[1].startsWith('var(')) continue; // explicitly references a token
        errors.push(
          `${rel}:${i + 1}: raw line-height literal "leading-[${m[1]}]" has no Qt counterpart. Use a leading token (leading-code, leading-normal, …) or a role utility (cs-code).`,
        );
      }
      for (const m of line.matchAll(/text-\[([^\]]+)\]/g)) {
        // `text-[#0f172a]` / `text-[var(--x)]` are COLORS, not sizes — only a
        // bare length bypasses the typographic scale.
        if (!/^[0-9.]+(px|rem|em)$/.test(m[1])) continue;
        arbitraryText.push(`${rel}:${i + 1}: text-[${m[1]}]`);
      }
    });
  }
  if (arbitraryText.length) {
    warnings.push(
      `${arbitraryText.length} arbitrary font-size literal(s) remain in React source — they bypass the token scale and cannot be mirrored on Qt. Migrate to text-nano/micro/caption/small/body/heading/subheading/title.`,
    );
    if (!quiet) for (const entry of arbitraryText.slice(0, 12)) warnings.push(`  ${entry}`);
    if (arbitraryText.length > 12) warnings.push(`  … ${arbitraryText.length - 12} more`);
  }

  // ---- Qt library components: no bare numeric font size -------------------
  // A raw number here is a value Qt can never learn from the shared scale, which
  // is how the Code Block line-height and the 13px-vs-14px body drifted apart.
  const allow = JSON.parse(readFileSync(ALLOWLIST_PATH, 'utf8')).qtFontSizeLiterals ?? [];
  const isAllowed = (rel, line) => allow.some((a) => a.file === rel && line.includes(a.contains));
  const qtLibrary = walk(resolve(repoRoot, 'qt/src'), (n) => n.startsWith('ChaSet') && n.endsWith('.qml'));
  for (const file of qtLibrary) {
    const rel = relative(repoRoot, file).replace(/\\/g, '/');
    const lines = readFileSync(file, 'utf8').split(/\r?\n/);
    lines.forEach((line, i) => {
      const isFontSize =
        /font\.pixelSize\s*:/.test(line) ||
        /readonly\s+property\s+int\s+(fontSize|labelFontSize|sliderLabelFontSize|itemFontSize|pixelSize)\s*:/.test(line);
      if (!isFontSize) return;
      if (line.includes('Typography.')) return;
      if (!/(^|[^\w.])\d/.test(line)) return;
      if (isAllowed(rel, line)) return;
      checked += 1;
      errors.push(
        `${rel}:${i + 1}: bare numeric font size — "${line.trim()}". Use a Typography.size* token (or add a justified entry to scripts/typography-allowlist.json).`,
      );
    });
  }

  return { ok: errors.length === 0, errors, warnings, checkedCount: checked, source };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const quiet = process.argv.includes('--quiet');
  const result = verifyTypographyParity({ quiet });
  for (const w of result.warnings) console.warn(`[typography-parity] WARN ${w}`);
  if (!result.ok) {
    console.error(`[typography-parity] FAIL — ${result.errors.length} drift(s) across ${result.checkedCount} checked values (source: ${result.source}):`);
    for (const e of result.errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  console.log(`[typography-parity] OK — ${result.checkedCount} typography values agree across tokens.css and Typography.generated.qml (source: ${result.source})`);
}
