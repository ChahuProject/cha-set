// spec/validate-tokens.mjs — structural validator for the tiered token spec.
// Usage: node spec/validate-tokens.mjs [path-to-tokens.json]
// Exit 0 = valid; exit 1 = invalid (prints every violation).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export function validateSpec(spec) {
  const errors = [];
  const fail = (msg) => errors.push(msg);

// meta
if (spec.meta?.schemaVersion !== 1) fail('meta.schemaVersion must be 1');
if (!spec.meta?.sources || typeof spec.meta.sources !== 'object') fail('meta.sources missing');

// top-level keys
for (const k of ['meta', 'primitives', 'semantic', 'composite', 'themes', 'qt']) {
  if (!(k in spec)) fail(`missing top-level key "${k}"`);
}

// semantic entries
const HEX8 = /^#[0-9a-fA-F]{8}$/;
for (const [name, def] of Object.entries(spec.semantic ?? {})) {
  if (!def.$type) fail(`semantic.${name}: missing $type`);
  if (!def.presets || typeof def.presets !== 'object') { fail(`semantic.${name}: missing presets`); continue; }
  for (const [preset, modes] of Object.entries(def.presets)) {
    if (!['launcher', 'dunting'].includes(preset)) fail(`semantic.${name}: unknown preset "${preset}"`);
    if (typeof modes !== 'object' || !('light' in modes) || !('dark' in modes)) {
      fail(`semantic.${name}.presets.${preset}: needs both light and dark`);
    }
  }
  if (!def.presets.launcher && !def.presets.dunting) fail(`semantic.${name}: no preset at all`);
}

// composite.launcher
for (const [name, def] of Object.entries(spec.composite?.launcher ?? {})) {
  if (!Array.isArray(def.$platform) || !def.$platform.includes('css')) {
    fail(`composite.launcher.${name}: $platform must include "css"`);
  }
  if (!('light' in def) && !('dark' in def)) fail(`composite.launcher.${name}: no light/dark value`);
}

// themes axes + overrides
const axes = spec.themes?.axes ?? {};
if ((axes.accentTheme ?? []).length !== 8) fail('themes.axes.accentTheme must list 8 ids');
if ((axes.windowTint ?? []).length !== 6) fail('themes.axes.windowTint must list 6 ids');
if ((axes.interfaceStyle ?? []).length !== 2) fail('themes.axes.interfaceStyle must list 2 ids');
const overrides = spec.themes?.overrides ?? [];
if (overrides.length !== 30) fail(`themes.overrides must have 30 blocks (16 accent + 12 tint + 2 interface-style), got ${overrides.length}`);
for (const o of overrides) {
  if (!o.selector || !o.selector.startsWith(':root') && !o.selector.startsWith('.dark')) {
    fail(`themes.overrides: bad selector "${o.selector}"`);
  }
  if (o.preset !== 'launcher') fail(`themes.overrides[${o.selector}]: preset must be launcher`);
  if (!o.tokens || typeof o.tokens !== 'object' || Object.keys(o.tokens).length === 0) {
    fail(`themes.overrides[${o.selector}]: empty tokens`);
  }
}

// qt tables
const EXPECT_COLORS = [
  'chrome','background','panel','panelRaised','border','accent','nestAccent','pendingAccent',
  'blocked','text','subduedText','conflict','onAccent','selection','hover','pressed',
  'disabled','disabledText','focus','overlayScrim','danger','dangerHover','infoBar',
  'canvasMarquee','canvasMarqueeBorder','canvasLoadingBackdrop','canvasLoadingBorder',
  'canvasLoadingText','canvasGrid','canvasGridMajor','chromeIcon','chromeHover','chromeDown'
];
const colors = spec.qt?.colors ?? {};
for (const f of EXPECT_COLORS) {
  const c = colors[f];
  if (!c) { fail(`qt.colors.${f}: missing`); continue; }
  for (const mode of ['dark', 'light']) {
    if (!HEX8.test(c[mode] ?? '')) fail(`qt.colors.${f}.${mode}: "${c[mode]}" is not #RRGGBBAA`);
  }
}
  if (Object.keys(colors).length !== 33) fail(`qt.colors must have exactly 33 fields, got ${Object.keys(colors).length}`);
  const rgbf = spec.qt?.rgbf ?? {};
  for (const f of EXPECT_COLORS) {
    const r = rgbf[f];
    if (!r) { fail(`qt.rgbf.${f}: missing`); continue; }
    for (const mode of ['dark', 'light']) {
      const a = r[mode];
      if (!Array.isArray(a) || a.length !== 4 || a.some((x) => typeof x !== 'number' || x < 0 || x > 1)) {
        fail(`qt.rgbf.${f}.${mode}: must be [r,g,b,a] numbers in [0,1]`);
      }
    }
  }
  if (Object.keys(rgbf).length !== 33) fail(`qt.rgbf must have exactly 33 fields, got ${Object.keys(rgbf).length}`);
for (const [grp, n] of [['space', 7], ['motion', 3], ['size', 21]]) {
  const got = Object.keys(spec.qt?.[grp] ?? {}).length;
  if (got !== n) fail(`qt.${grp} must have ${n} fields, got ${got}`);
}

  return errors;
}

function main() {
  const file = process.argv[2] ?? join(dirname(fileURLToPath(import.meta.url)), 'tokens.json');
  let spec;
  try {
    spec = JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    console.error(`[validate-tokens] JSON parse error: ${e.message}`);
    process.exit(1);
  }
  const errors = validateSpec(spec);
  if (errors.length) {
    console.error(`[validate-tokens] FAILED (${errors.length}):`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  console.log(`[validate-tokens] OK — ${Object.keys(spec.semantic).length} semantic tokens, ${
    Object.keys(spec.composite.launcher).length} composites, ${(spec.themes?.overrides ?? []).length} theme overrides, 33 qt colors`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
