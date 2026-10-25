#!/usr/bin/env node
// check-showcase-palette.mjs — the showcase demos must render one palette.
//
// The Qt demo reads `ThemeTokens` (compiled from spec/tokens.json, preset "dunting").
// The React demo cannot: there is no CSS emit for that preset, only for "launcher", so
// packages/react/examples/basic/src/styles.css carries the same semantic values by hand.
// That copy is what made every screenshot comparison a comparison of two palettes: the Qt
// page rendered #e6f0fa body text over #a0b2c6 muted text while the React page rendered
// #f8fafc over #94a3b8, so the Qt side read as "lighter and flatter" even though both were
// internally consistent.
//
// A hand-maintained copy drifts the moment a preset is retuned, so this gate pins it. The
// canvas (`background`) is deliberately excluded: both demos pin it to the same #020817 /
// #ffffff outside the token layer, and it is the one surface neither side derives.
//
// Regenerate the copy by running `pnpm gen:qt` and copying the mapped values into styles.css.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

const QML_TOKENS = resolve(root, 'qt/src/ThemeTokens.generated.qml');
const DEMO_CSS = resolve(root, 'packages/react/examples/basic/src/styles.css');

/// ThemeTokens role -> the CSS custom properties that must carry the same colour.
/// Several CSS names collapse onto one role because shadcn-style surfaces reuse a value.
const PAIRS = [
  ['text', ['foreground', 'card-foreground', 'popover-foreground', 'secondary-foreground', 'accent-foreground']],
  ['subduedText', ['muted-foreground']],
  ['panel', ['card', 'popover']],
  ['panelRaised', ['secondary', 'muted', 'accent']],
  ['border', ['border', 'input']],
  ['accent', ['primary', 'ring']],
];

/// Split the generated singleton into its dark and light halves and read every
/// `case "<role>": return Qt.rgba(r, g, b, a)` into 0-255 integers.
export function parseQtTokens(source) {
  const darkStart = source.indexOf('if (dark) {');
  const elseStart = source.indexOf('} else {', darkStart);
  if (darkStart < 0 || elseStart < 0) throw new Error('ThemeTokens no longer has an if (dark) / else split');

  const read = (chunk) => {
    const out = new Map();
    const re = /case "([A-Za-z]+)":\s*\n\s*return Qt\.rgba\(([^)]+)\)/g;
    let match;
    while ((match = re.exec(chunk)) !== null) {
      const channels = match[2].split(',').map((part) => {
        const expr = part.trim();
        // Two shapes appear in the generator output: "230.0 / 255.0" and "0.72".
        const division = /^([\d.]+)\s*\/\s*([\d.]+)$/.exec(expr);
        const value = division ? Number(division[1]) / Number(division[2]) : Number(expr);
        return Math.round(value * 255);
      });
      out.set(match[1], channels.slice(0, 3));
    }
    return out;
  };

  return {
    dark: read(source.slice(darkStart, elseStart)),
    light: read(source.slice(elseStart)),
  };
}

/// Read the `:root` and `.dark` blocks of the demo stylesheet into name -> [r,g,b].
export function parseDemoCss(source) {
  const block = (selector) => {
    const start = source.indexOf(selector + ' {');
    if (start < 0) return new Map();
    const end = source.indexOf('\n}', start);
    if (end < 0) return new Map();
    const out = new Map();
    const re = /--([a-z-]+):\s*#([0-9a-fA-F]{6})\b/g;
    let match;
    while ((match = re.exec(source.slice(start, end))) !== null) {
      const hex = match[2];
      out.set(match[1], [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16),
      ]);
    }
    return out;
  };
  return { light: block(':root'), dark: block('.dark') };
}

export function verifyShowcasePalette(options = {}) {
  const qml = parseQtTokens(readFileSync(QML_TOKENS, 'utf8'));
  const css = parseDemoCss(readFileSync(DEMO_CSS, 'utf8'));
  return comparePalettes(qml, css, options);
}

/// Pure comparison, so the self-test can feed deliberately broken data.
export function comparePalettes(qml, css, { quiet = false } = {}) {
  const errors = [];
  let checked = 0;

  for (const mode of ['dark', 'light']) {
    for (const [role, cssNames] of PAIRS) {
      const expected = qml[mode].get(role);
      if (!expected) {
        errors.push(`ThemeTokens.${mode} has no "${role}" — the role was renamed or removed`);
        continue;
      }
      for (const name of cssNames) {
        const actual = css[mode].get(name);
        if (!actual) {
          errors.push(`styles.css ${mode === 'dark' ? '.dark' : ':root'} is missing --${name}`);
          continue;
        }
        checked += 1;
        if (actual.join(',') !== expected.join(',')) {
          const hex = (c) => '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
          errors.push(
            `${mode} --${name} is ${hex(actual)} but ThemeTokens.${role} is ${hex(expected)}`
          );
        }
      }
    }
  }

  if (!quiet) {
    if (errors.length) {
      console.error('[showcase-palette] FAIL — the demos are rendering two palettes:');
      for (const error of errors) console.error('  - ' + error);
    } else {
      console.log(`[showcase-palette] OK — ${checked} semantic colours match ThemeTokens across light and dark`);
    }
  }
  return { ok: errors.length === 0, errors, checked };
}

/// A guard that cannot fail is not a guard: feed it a palette that is one shade off and
/// require it to notice, plus a clean palette it must accept.
export function selfTest() {
  const errors = [];
  const clean = { dark: new Map(), light: new Map() };
  for (const mode of ['dark', 'light']) {
    for (const [role] of PAIRS) clean[mode].set(role, [10, 20, 30]);
  }
  const cssClean = { dark: new Map(), light: new Map() };
  for (const mode of ['dark', 'light']) {
    for (const [, names] of PAIRS) for (const name of names) cssClean[mode].set(name, [10, 20, 30]);
  }
  if (!comparePalettes(clean, cssClean, { quiet: true }).ok) {
    errors.push('accepted an identical palette as matching, but reported drift');
  }

  const cssDrifted = { dark: new Map(cssClean.dark), light: new Map(cssClean.light) };
  cssDrifted.dark.set('foreground', [10, 20, 31]);
  const drift = comparePalettes(clean, cssDrifted, { quiet: true });
  if (drift.ok) errors.push('missed a one-step drift in --foreground');

  const cssMissing = { dark: new Map(cssClean.dark), light: new Map(cssClean.light) };
  cssMissing.dark.delete('border');
  if (comparePalettes(clean, cssMissing, { quiet: true }).ok) {
    errors.push('missed a removed --border');
  }

  return { ok: errors.length === 0, errors };
}

const invokedDirectly = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (invokedDirectly) {
  const test = selfTest();
  if (!test.ok) {
    console.error('[showcase-palette] FAIL: detector self-test failed');
    for (const error of test.errors) console.error('  - ' + error);
    process.exit(1);
  }
  const result = verifyShowcasePalette();
  if (!result.ok) process.exit(1);
}
