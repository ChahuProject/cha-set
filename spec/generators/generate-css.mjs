// generate-css.mjs — dual-flavor CSS emitter from the tiered token spec.
//
// Flavor 1 (library):  packages/react/src/styles/tokens.css
//   --cs-* prefixed semantic tokens, launcher preset, :root (light) + .dark.
// Flavor 2 (compat):   dist/consumers/launcher/generated/tokens.generated.css
//   Unprefixed custom properties reproducing the launcher's hand-written
//   variable layers IN SOURCE CASCADE ORDER:
//     semantic defaults (:root/.dark)          <- replaces shadcn-base.css vars
//     composite surfaces (:root/.dark)         <- replaces app-variables.css
//     window-tint override blocks              <- replaces window-tint.css
//     interface-style override blocks          <- replaces themes.css head
//     accent-theme override blocks             <- replaces themes.css body
// Fails loud (exit 1) on any spec/validation error before writing anything.
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateSpec } from '../validate-tokens.mjs';
import { loadTokensSync } from '../load-tokens.mjs';
import { selectorFor, ORDER } from '../token-helpers.mjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

// Guard raw deltas file: must not contain hardcoded selector (loader would hide it).
const deltasPath = resolve(repoRoot, 'spec', 'tokens', 'themes', 'deltas.json');
if (existsSync(deltasPath)) {
  try {
    const raw = JSON.parse(readFileSync(deltasPath, 'utf8'));
    const arr = raw.themes?.deltas;
    if (Array.isArray(arr)) {
      for (const o of arr) {
        if ('selector' in o) {
          console.error(`[gen:css] deltas must not contain selector (got "${o.selector}")`);
          process.exit(1);
        }
      }
    }
  } catch (e) {
    if (e.message && e.message.includes('deltas must not contain selector')) throw e;
    // parse errors will be caught by validateSpec below
  }
}

const { tokens: spec } = loadTokensSync({ from: 'split' });

const errors = validateSpec(spec);
if (errors.length) {
  console.error(`[gen:css] tokens.json invalid (${errors.length}):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

// Guard: deltas must not contain hardcoded selector (derive via selectorFor).
// For legacy snapshot (themes.overrides) we allow stored selector as fallback.
const themeEntries = spec.themes.deltas ?? spec.themes.overrides ?? [];
if (spec.themes.deltas) {
  for (const o of spec.themes.deltas) {
    if ('selector' in o) {
      console.error(`[gen:css] deltas must not contain selector (got "${o.selector}")`);
      process.exit(1);
    }
  }
}

function resolveSelector(o) {
  // Legacy compat: if overrides carried a selector, honor it; otherwise derive.
  if ('selector' in o && spec.themes.overrides && !spec.themes.deltas) {
    return o.selector;
  }
  try {
    return selectorFor(o);
  } catch (e) {
    console.error(`[gen:css] ${e.message}`);
    process.exit(1);
  }
}

// Dunting-only semantic tokens use dotted namespaces (chrome.icon). The
// launcher preset's original custom property drops the namespace prefix
// (interaction.hover -> --hover); flat keys are identity.
const cssName = (key) => key.split('.').pop();

const decl = (prop, value) => `  ${prop}: ${value};`;

function semanticBlocks(prefix) {
  const light = [];
  const dark = [];
  const orderMap = new Map(ORDER.semantic.map((k, i) => [k, i]));
  const entries = Object.entries(spec.semantic).sort((a, b) => {
    const ia = orderMap.has(a[0]) ? orderMap.get(a[0]) : 1e9;
    const ib = orderMap.has(b[0]) ? orderMap.get(b[0]) : 1e9;
    if (ia !== ib) return ia - ib;
    return a[0].localeCompare(b[0]);
  });
  for (const [key, def] of entries) {
    const presets = def.presets ?? {};
    const l = presets.launcher?.light;
    const d = presets.launcher?.dark;
    if (l === undefined && d === undefined) continue; // dunting-only token
    const prop = `${prefix}${cssName(key)}`;
    if (l !== undefined) light.push(decl(prop, l));
    if (d !== undefined) dark.push(decl(prop, d));
  }
  return { light, dark };
}

function selectorBlock(selector, decls) {
  return `${selector} {\n${decls.join('\n')}\n}`;
}

// ---------------- Flavor 1: library (--cs-*) ----------------
{
  const { light, dark } = semanticBlocks('--cs-');
  const weight = spec.primitives.fontWeight ?? {};
  for (const [k, v] of Object.entries(weight)) light.push(decl(`--cs-font-weight-${k}`, String(v)));
  // keep .dark block aligned (weights are mode-invariant)
  for (const [k, v] of Object.entries(weight)) dark.push(decl(`--cs-font-weight-${k}`, String(v)));

  // Accent themes: [data-theme] overrides let consumers switch accent hue at
  // runtime (document.documentElement.dataset.theme = 'violet'). Values are
  // the launcher preset's accent overrides, verbatim.
  const accentBlocks = [];
  for (const o of themeEntries) {
    if (o.accentTheme === undefined) continue;
    const decls = Object.entries(o.tokens).map(([n, v]) => decl(`--cs-${cssName(n)}`, v));
    accentBlocks.push(selectorBlock(resolveSelector(o), decls));
  }

  const out = [
    '/* GENERATED by spec/generators/generate-css.mjs — DO NOT EDIT.',
    ' * Source: spec/tokens.json (preset: launcher). Regenerate: pnpm gen:css */',
    selectorBlock(':root', light),
    '',
    selectorBlock('.dark', dark),
    '',
    '/* == accent themes (switch via [data-theme] on <html>) == */',
    accentBlocks.join('\n'),
    '',
  ].join('\n');

  const outFile = resolve(repoRoot, 'packages', 'react', 'src', 'styles', 'tokens.css');
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, out, 'utf8');
  console.log(`[gen:css] library flavor -> ${outFile}`);
}

// ---------------- Flavor 2: launcher compat (unprefixed) ----------------
{
  const overrides = themeEntries;
  const byAxis = (axis) => overrides.filter((o) => o[axis] !== undefined);

  const parts = [];
  parts.push('/* GENERATED by spec/generators/generate-css.mjs — DO NOT EDIT.');
  parts.push(' * Source: spec/tokens.json (preset: launcher). Cascade order mirrors the');
  parts.push(' * hand-written files this file replaces: shadcn-base -> app-variables ->');
  parts.push(' * window-tint -> interface-style -> accent-themes. Regenerate: pnpm gen:css */');

  // Layer 1+2: semantic defaults, then composites (:root light / .dark dark)
  const sem = semanticBlocks('--');
  parts.push('');
  parts.push('/* == semantic defaults (was shadcn-base.css var blocks) == */');
  parts.push(selectorBlock(':root', sem.light));
  parts.push('');
  parts.push(selectorBlock('.dark', sem.dark));

  const compLight = [];
  const compDark = [];
  for (const [key, def] of Object.entries(spec.composite.launcher)) {
    if (!def.$platform.includes('css')) continue;
    if (def.light !== undefined) compLight.push(decl(`--${key}`, def.light));
    if (def.dark !== undefined) compDark.push(decl(`--${key}`, def.dark));
  }
  parts.push('');
  parts.push('/* == composite surfaces (was app-variables.css) == */');
  parts.push(selectorBlock(':root', compLight));
  parts.push('');
  parts.push(selectorBlock('.dark', compDark));

  // Layer 3: window tints (source order: 6 light then 6 dark)
  parts.push('');
  parts.push('/* == window tint overrides (was window-tint.css) == */');
  for (const o of byAxis('windowTint')) {
    parts.push('');
    parts.push(selectorBlock(resolveSelector(o), Object.entries(o.tokens).map(([n, v]) => decl(`--${n}`, v))));
  }

  // Layer 4: interface style (themes.css head — BEFORE accent themes, matching source)
  parts.push('');
  parts.push('/* == interface-style overrides (was themes.css head) == */');
  for (const o of byAxis('interfaceStyle')) {
    parts.push('');
    parts.push(selectorBlock(resolveSelector(o), Object.entries(o.tokens).map(([n, v]) => decl(`--${n}`, v))));
  }

  // Layer 5: accent themes (8 light :root[data-theme], then 8 dark)
  parts.push('');
  parts.push('/* == accent theme overrides (was themes.css body) == */');
  for (const o of byAxis('accentTheme')) {
    parts.push('');
    parts.push(selectorBlock(resolveSelector(o), Object.entries(o.tokens).map(([n, v]) => decl(`--${n}`, v))));
  }

  const out = parts.join('\n') + '\n';
  const outFile = resolve(repoRoot, 'dist', 'consumers', 'launcher', 'generated', 'tokens.generated.css');
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, out, 'utf8');
  console.log(`[gen:css] compat flavor   -> ${outFile}`);
}
