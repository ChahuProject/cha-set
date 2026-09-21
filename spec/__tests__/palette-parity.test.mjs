// spec/__tests__/palette-parity.test.mjs
//
// Locks in the ONE convergence decision that makes a shared accent control possible:
// cha-set's accent palette is byte-identical to the launcher (crd) palette. Before
// this, cha-set listed 8 ids and silently dropped `neutral`; dt had no palette axis
// at all. A shared control cannot exist while three lists disagree.
//
// Invariants:
//   1. themes.axes.accentTheme == theme-controls.json axes.palette.values
//      == the schema's palette enum  (three-way agreement, no drift allowed)
//   2. every id in the axis has BOTH a light and a dark delta block — an id you can
//      select but which produces no styling is a UI dead end
//   3. `neutral` resolves to the shadcn base accent, i.e. its blocks are present and
//      non-empty despite crd shipping no [data-theme="neutral"] rule
//   4. `custom` is var()-driven with fallbacks, never a hard-coded literal — the ramp
//      is derived from the user's hex at runtime
//   5. the palette never leaks into the frozen 33-field Qt colour contract
//      (dt consumes theme_tokens.generated.h; a palette axis must not alter it)
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadTokensSync } from '../load-tokens.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..', '..');

const readJson = (p) => JSON.parse(readFileSync(resolve(repoRoot, p), 'utf8'));

const controls = readJson('spec/theme-controls.json');
const schema = readJson('spec/schemas/theme-config.schema.json');
const axes = readJson('spec/tokens/themes/axes.json');
const deltas = readJson('spec/tokens/themes/deltas.json');
const { tokens: spec } = loadTokensSync({ from: 'split' });

// The canonical launcher palette, transcribed from
// crd-a/launcher/src/lib/主题.ts:6 `主题颜色` — neutral + 8 hues + custom.
const CANONICAL_PALETTE = ['neutral', 'slate', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'rose', 'custom'];

describe('accent palette parity (Stage 1 convergence)', () => {
  it('the token axis is exactly the canonical 10-id launcher palette', () => {
    expect(axes.themes.axes.accentTheme).toEqual(CANONICAL_PALETTE);
  });

  it('theme-controls.json declares the same palette', () => {
    expect(controls.axes.palette.values).toEqual(CANONICAL_PALETTE);
  });

  it('the ThemeConfig schema exposes the same palette enum', () => {
    expect(schema.properties.palette.properties.id.enum).toEqual(CANONICAL_PALETTE);
  });

  it('all three declarations agree element-for-element in order', () => {
    const a = axes.themes.axes.accentTheme;
    const b = controls.axes.palette.values;
    const c = schema.properties.palette.properties.id.enum;
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    expect(JSON.stringify(b)).toBe(JSON.stringify(c));
  });

  it('neutral and custom are not silently dropped', () => {
    expect(axes.themes.axes.accentTheme).toContain('neutral');
    expect(axes.themes.axes.accentTheme).toContain('custom');
  });
});

describe('every selectable palette id has both mode blocks', () => {
  const blocks = deltas.themes.deltas.filter((d) => d.accentTheme !== undefined);
  const byId = new Map();
  for (const b of blocks) {
    if (!byId.has(b.accentTheme)) byId.set(b.accentTheme, new Set());
    byId.get(b.accentTheme).add(b.mode);
  }

  it('there are exactly 20 accent blocks (10 ids x 2 modes)', () => {
    expect(blocks.length).toBe(CANONICAL_PALETTE.length * 2);
  });

  it.each(CANONICAL_PALETTE)('%s has a light and a dark block', (id) => {
    const modes = byId.get(id);
    expect(modes, `no delta block at all for accentTheme="${id}"`).toBeDefined();
    expect(modes.has('light'), `accentTheme="${id}" has no light block`).toBe(true);
    expect(modes.has('dark'), `accentTheme="${id}" has no dark block`).toBe(true);
  });

  it('every block carries at least a primary token', () => {
    for (const b of blocks) {
      expect(Object.keys(b.tokens ?? {}), `accentTheme="${b.accentTheme}" mode=${b.mode}`).toContain('primary');
    }
  });
});

describe('neutral — reset-to-base semantics', () => {
  const blocks = deltas.themes.deltas.filter((d) => d.accentTheme === 'neutral');

  it('is materialised as explicit blocks even though crd ships no neutral rule', () => {
    expect(blocks.length).toBe(2);
    for (const b of blocks) expect(Object.keys(b.tokens).length).toBeGreaterThan(0);
  });

  it('light resolves to the shadcn base accent values', () => {
    const light = blocks.find((b) => b.mode === 'light');
    expect(light.tokens.primary).toBe('oklch(0.205 0 0)');
    expect(light.tokens['primary-foreground']).toBe('oklch(0.985 0 0)');
  });

  it('dark resolves to the shadcn base dark accent values', () => {
    const dark = blocks.find((b) => b.mode === 'dark');
    expect(dark.tokens.primary).toBe('oklch(0.922 0 0)');
    expect(dark.tokens['primary-foreground']).toBe('oklch(0.205 0 0)');
  });
});

describe('custom — derived-ramp semantics', () => {
  const blocks = deltas.themes.deltas.filter((d) => d.accentTheme === 'custom');

  it('is var()-driven, never a hard-coded literal', () => {
    for (const b of blocks) {
      for (const [k, v] of Object.entries(b.tokens)) {
        expect(v, `custom.${b.mode}.${k} must be var()-driven`).toMatch(/^var\(--chaset-custom-accent/);
      }
    }
  });

  it('every var() reference carries a fallback so a host without the derived ramp still renders', () => {
    for (const b of blocks) {
      for (const [k, v] of Object.entries(b.tokens)) {
        // Match var(--name, <fallback>) — the comma inside the parens is required.
        expect(v, `custom.${b.mode}.${k} = "${v}" is missing a var() fallback`).toMatch(/^var\([^,)]+,\s*.+\)$/);
      }
    }
  });
});

describe('the palette axis does not leak into the frozen Qt contract', () => {
  it('qt color field count is still exactly 33', () => {
    expect(Object.keys(spec.qt.colors).length).toBe(33);
  });

  it('no palette id became a Qt colour field', () => {
    const qtFields = Object.keys(spec.qt.colors);
    for (const id of CANONICAL_PALETTE) {
      expect(qtFields, `palette id "${id}" leaked into qt.colors`).not.toContain(id);
    }
  });
});
