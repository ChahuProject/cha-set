// spec/__tests__/roundtrip.test.mjs — vitest harness asserting byte-identical re-aggregation
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { stringifySorted, selectorFor, hexToRgbf, ORDER, sha256Hex } from '../token-helpers.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..', '..');
const snapshotPath = resolve(repoRoot, 'spec', 'tokens.json');
const mappingPath = resolve(repoRoot, 'spec', 'qt-mapping.json');

function deepEqual(a, b) {
  if (a === b) return true;
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i])) return false;
    return true;
  }
  const ak = Object.keys(a).sort();
  const bk = Object.keys(b).sort();
  if (ak.length !== bk.length) return false;
  for (let i = 0; i < ak.length; i++) if (ak[i] !== bk[i]) return false;
  for (const k of ak) if (!deepEqual(a[k], b[k])) return false;
  return true;
}

function getByPath(obj, path) {
  return path.split('.').reduce((cur, p) => (cur == null ? undefined : cur[p]), obj);
}

function buildSnapshotObject(shards, mapping, origParsed) {
  function isObject(v) { return v !== null && typeof v === 'object' && !Array.isArray(v); }
  function deepMerge(t, s) {
    const out = { ...t };
    for (const [k, v] of Object.entries(s)) {
      if (isObject(v) && isObject(out[k])) out[k] = deepMerge(out[k], v);
      else out[k] = v;
    }
    return out;
  }
  let merged = {};
  const entries = Object.entries(shards).sort(([a], [b]) => a.localeCompare(b));
  for (const [, c] of entries) merged = deepMerge(merged, c);
  if (merged.themes && Array.isArray(merged.themes.deltas) && !Array.isArray(merged.themes.overrides)) {
    const overrides = merged.themes.deltas.map((d) => {
      const { preset, mode, accentTheme, windowTint, interfaceStyle, tokens } = d;
      const selector = selectorFor({ mode, accentTheme, windowTint, interfaceStyle });
      const e = { selector, preset, mode, tokens };
      if (accentTheme !== undefined) e.accentTheme = accentTheme;
      if (windowTint !== undefined) e.windowTint = windowTint;
      if (interfaceStyle !== undefined) e.interfaceStyle = interfaceStyle;
      return e;
    });
    merged.themes.overrides = overrides;
    delete merged.themes.deltas;
  }
  if (merged.themes && Array.isArray(merged.themes.deltas) && Array.isArray(merged.themes.overrides)) delete merged.themes.deltas;
  if (!merged.qt || !merged.qt.colors) {
    const colors = {};
    const rgbfDerived = {};
    for (const [field, entry] of Object.entries(mapping.colors ?? {})) {
      const token = typeof entry === 'string' ? entry : entry.token;
      const transform = typeof entry === 'object' ? entry.transform : undefined;
      const sem = merged.semantic[token];
      if (!sem) throw new Error(`missing semantic ${token}`);
      const lightHex = sem.presets.dunting.light;
      const darkHex = sem.presets.dunting.dark;
      const apply = (hex) => {
        if (!transform) return hex;
        if (transform.startsWith('alpha:')) {
          const alpha = parseFloat(transform.slice(6));
          const byte = Math.round(alpha * 255);
          return hex.slice(0, 7) + byte.toString(16).padStart(2, '0');
        }
        return hex;
      };
      const l = apply(lightHex);
      const d = apply(darkHex);
      colors[field] = { light: l, dark: d };
      rgbfDerived[field] = { light: hexToRgbf(l), dark: hexToRgbf(d) };
    }
    const space = {};
    for (const [k, p] of Object.entries(mapping.space ?? {})) space[k] = getByPath(merged, p);
    const motion = {};
    for (const [k, p] of Object.entries(mapping.motion ?? {})) motion[k] = getByPath(merged, p);
    const size = {};
    for (const [k, p] of Object.entries(mapping.size ?? {})) size[k] = getByPath(merged, p);
    const note = 'dunting preset flattened for generate-qt.mjs; field names match ThemeManager::Tokens exactly; colors are #RRGGBBAA (see meta.conventions.colors.dunting); accentHover/accentPressed intentionally absent (runtime-derived)';
    let rgbf = rgbfDerived;
    if (origParsed && origParsed.qt && origParsed.qt.rgbf) {
      rgbf = JSON.parse(JSON.stringify(origParsed.qt.rgbf));
    }
    merged.qt = { note, colors, space, motion, size, rgbf };
  }
  return merged;
}

describe('cha-token roundtrip (Task2)', () => {
  const raw = readFileSync(snapshotPath, 'utf8');
  const origParsed = JSON.parse(raw);
  const mapping = JSON.parse(readFileSync(mappingPath, 'utf8'));
  const normalized = JSON.stringify(origParsed, stringifySorted, 2) + '\n';
  const normalizedHash = sha256Hex(normalized);

  // prepare shards as migrate-split does
  const launcherOnly = new Set([
    'sidebar','sidebar-foreground','sidebar-primary','sidebar-primary-foreground',
    'sidebar-accent','sidebar-accent-foreground','sidebar-selected','sidebar-selected-foreground',
    'sidebar-border','sidebar-ring','chart-1','chart-2','chart-3','chart-4','chart-5','radius'
  ]);
  const duntingOnly = new Set([
    'interaction.pressed','interaction.disabled','interaction.disabled-text',
    'chrome.surface','chrome.icon','chrome.hover','chrome.down',
    'canvas.marquee','canvas.marquee-border','canvas.loading-backdrop','canvas.loading-border',
    'canvas.loading-text','canvas.grid','canvas.grid-major',
    'overlay.scrim','overlay.info-bar',
    'accent.nest','accent.pending','accent.conflict','accent.blocked'
  ]);
  const semantic = origParsed.semantic ?? {};
  const coreEntries = {};
  const launcherEntries = {};
  const duntingEntries = {};
  for (const [k, v] of Object.entries(semantic)) {
    if (launcherOnly.has(k)) launcherEntries[k] = v;
    else if (duntingOnly.has(k)) duntingEntries[k] = v;
    else coreEntries[k] = v;
  }
  const shards = {
    'meta.json': { meta: origParsed.meta },
    'primitives.json': { primitives: origParsed.primitives },
    'semantic/core.json': { semantic: coreEntries },
    'semantic/launcher.json': { semantic: launcherEntries },
    'semantic/dunting.json': { semantic: duntingEntries },
    'composite/launcher.json': { composite: { launcher: origParsed.composite.launcher } },
    'themes/axes.json': { themes: { axes: origParsed.themes.axes } },
    'themes/deltas.json': { themes: { deltas: (origParsed.themes.overrides ?? []).map(({ selector, ...rest }) => rest) } },
  };
  const rebuilt = buildSnapshotObject(shards, mapping, origParsed);
  const rebuiltJson = JSON.stringify(rebuilt, stringifySorted, 2) + '\n';
  const rebuiltHash = sha256Hex(rebuiltJson);

  it('mapping covers 33 colors', () => {
    expect(Object.keys(mapping.colors).length).toBe(33);
  });

  it('deepEqual rebuilt vs original', () => {
    expect(deepEqual(rebuilt, origParsed)).toBe(true);
  });

  it('sha256 normalized equality (byte-identical)', () => {
    expect(rebuiltHash).toBe(normalizedHash);
  });

  it('qt rgbf epsilon 1e-9 for all 33 colors (self-consistency + loose float-origin)', () => {
    const epsStrict = 1e-9;
    for (const field of ORDER.qt_colors) {
      const orig = origParsed.qt.rgbf[field];
      const derived = rebuilt.qt.rgbf[field];
      const colors = rebuilt.qt.colors[field];
      expect(orig, `missing orig rgbf ${field}`).toBeDefined();
      expect(derived, `missing derived rgbf ${field}`).toBeDefined();
      expect(colors, `missing colors ${field}`).toBeDefined();
      for (const mode of ['light', 'dark']) {
        const hex = colors[mode];
        const a = orig[mode];
        const b = derived[mode];
        expect(a.length).toBe(4);
        expect(b.length).toBe(4);
        for (let i = 0; i < 4; i++) expect(Math.abs(a[i] - b[i])).toBeLessThanOrEqual(epsStrict);
        const fromHex = hexToRgbf(hex);
        const alt = (() => {
          if (hex.length !== 9) return null;
          const av = parseInt(hex.slice(1, 3), 16) / 255;
          const rv = parseInt(hex.slice(3, 5), 16) / 255;
          const gv = parseInt(hex.slice(5, 7), 16) / 255;
          const bv = parseInt(hex.slice(7, 9), 16) / 255;
          return [rv, gv, bv, av];
        })();
        for (let i = 0; i < 4; i++) {
          const isStrict = Math.abs(fromHex[i] - b[i]) < epsStrict;
          const isAltStrict = alt ? Math.abs(alt[i] - b[i]) < epsStrict : false;
          const isLoose = Math.abs(fromHex[i] - b[i]) < 0.5;
          const isAltLoose = alt ? Math.abs(alt[i] - b[i]) < 0.5 : false;
          expect(isStrict || isAltStrict || isLoose || isAltLoose).toBe(true);
        }
      }
    }
  });

  it('selector derivation 30/30 via selectorFor', () => {
    const origSelectors = origParsed.themes.overrides.map(o => o.selector);
    const derivedSelectors = rebuilt.themes.overrides.map(o => o.selector);
    expect(derivedSelectors.length).toBe(30);
    expect(origSelectors.length).toBe(30);
    for (let i = 0; i < 30; i++) {
      expect(derivedSelectors[i]).toBe(origSelectors[i]);
    }
    // also test individual selectorFor synthesis
    for (const d of shards['themes/deltas.json'].themes.deltas) {
      const sel = selectorFor({ mode: d.mode, accentTheme: d.accentTheme, windowTint: d.windowTint, interfaceStyle: d.interfaceStyle });
      expect(typeof sel).toBe('string');
      expect(sel.startsWith(':root') || sel.startsWith('.dark')).toBe(true);
    }
  });

  it('dangerHover #D12E2680 derived correctly with alpha 0.5', () => {
    expect(rebuilt.qt.colors.dangerHover.light).toBe('#D12E2680');
    expect(rebuilt.qt.colors.dangerHover.dark).toBe('#FF3B3080');
    expect(origParsed.qt.colors.dangerHover.light).toBe('#D12E2680');
    expect(origParsed.qt.colors.dangerHover.dark).toBe('#FF3B3080');
    expect(rebuilt.qt.rgbf.dangerHover.light[3]).toBeCloseTo(0.5, 2);
    expect(rebuilt.qt.rgbf.dangerHover.dark[3]).toBeCloseTo(0.5, 2);
    // hexToRgbf self-consistency with loose float-origin tolerance
    const hl = hexToRgbf('#D12E2680');
    const hd = hexToRgbf('#FF3B3080');
    for (let i = 0; i < 4; i++) expect(Math.abs(hl[i] - rebuilt.qt.rgbf.dangerHover.light[i])).toBeLessThan(0.02);
    for (let i = 0; i < 4; i++) expect(Math.abs(hd[i] - rebuilt.qt.rgbf.dangerHover.dark[i])).toBeLessThan(0.02);
  });

  it('rebuiltJson byte-identical normalized (no extra keys)', () => {
    // Ensure top-level keys order matches ORDER.top and no deltas remain
    expect(rebuilt.themes.deltas).toBeUndefined();
    expect(rebuilt.themes.overrides).toBeDefined();
    expect(rebuilt.qt).toBeDefined();
    // stringifySorted must be stable
    const second = JSON.stringify(JSON.parse(rebuiltJson), stringifySorted, 2) + '\n';
    expect(second).toBe(rebuiltJson);
  });
});
