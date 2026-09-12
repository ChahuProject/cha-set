// spec/__tests__/code-palette.test.mjs
// Locks in the invariants that make the syntax palette safe:
//   1. every non-plain token type declared by the lexer has a `code-<type>` token,
//   2. the launcher preset is the exact oklch() form of the dunting hex, so React
//      (launcher) and Qt (dunting) render the same color — preset-independent,
//   3. the palette never leaks into the frozen 33-field qt color contract
//      (theme_tokens.generated.h / dt-a ThemeManager::Tokens),
//   4. the generated Qt singleton carries a case for every token type.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadTokensSync } from '../load-tokens.mjs';
import { hexToOklch } from '../tools/hex-to-oklch.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..', '..');

const languages = JSON.parse(readFileSync(resolve(repoRoot, 'spec', 'highlight', 'languages.json'), 'utf8'));
const { tokens: spec } = loadTokensSync({ from: 'split' });
const allTypes = languages.tokenTypes ?? [];
const nonPlain = allTypes.filter((t) => t !== 'plain');

const EXPECTED_TYPES = [
  'keyword', 'constant', 'type', 'string', 'number', 'comment', 'function',
  'property', 'operator', 'punctuation', 'variable', 'tag', 'attribute',
];

describe('code palette (Task2) — syntax token <-> semantic token contract', () => {
  it('lexer declares every non-plain token type the palette covers', () => {
    for (const t of EXPECTED_TYPES) expect(nonPlain, `tokenTypes missing "${t}"`).toContain(t);
    expect(nonPlain.length).toBe(EXPECTED_TYPES.length);
  });

  it('each non-plain token type has a code-<type> token with dunting hex + launcher oklch', () => {
    for (const t of nonPlain) {
      const def = spec.semantic[`code-${t}`];
      expect(def, `missing semantic token code-${t}`).toBeDefined();
      expect(def.presets.dunting.light, `code-${t}.dunting.light`).toMatch(/^#[0-9a-fA-F]{8}$/);
      expect(def.presets.dunting.dark, `code-${t}.dunting.dark`).toMatch(/^#[0-9a-fA-F]{8}$/);
      expect(def.presets.launcher.light, `code-${t}.launcher.light`).toMatch(/^oklch\(/);
      expect(def.presets.launcher.dark, `code-${t}.launcher.dark`).toMatch(/^oklch\(/);
    }
  });

  it('launcher oklch is the exact oklch form of the dunting hex (preset-independent by construction)', () => {
    for (const t of nonPlain) {
      const def = spec.semantic[`code-${t}`];
      for (const mode of ['light', 'dark']) {
        expect(hexToOklch(def.presets.dunting[mode]), `code-${t}.${mode}`).toBe(def.presets.launcher[mode]);
      }
    }
  });

  it('palette is fully opaque (spans must not stack alpha over the surface)', () => {
    for (const t of nonPlain) {
      const def = spec.semantic[`code-${t}`];
      for (const mode of ['light', 'dark']) expect(def.presets.dunting[mode].slice(7).toLowerCase()).toBe('ff');
    }
  });

  it('does not leak into the frozen 33-field qt color contract', () => {
    expect(Object.keys(spec.qt.colors).length).toBe(33);
    expect(Object.keys(spec.qt.rgbf).length).toBe(33);
    for (const k of Object.keys(spec.qt.colors)) expect(k.startsWith('code-')).toBe(false);

    const mapping = JSON.parse(readFileSync(resolve(repoRoot, 'spec', 'qt-mapping.json'), 'utf8'));
    for (const entry of Object.values(mapping.colors)) {
      const token = typeof entry === 'string' ? entry : entry.token;
      expect(token.startsWith('code-')).toBe(false);
    }
  });

  it('generated Qt singleton carries a case for every token type', () => {
    const qml = readFileSync(resolve(repoRoot, 'qt', 'src', 'CodeTokens.generated.qml'), 'utf8');
    expect(qml).toContain('pragma Singleton');
    for (const t of nonPlain) expect(qml, `CodeTokens.generated.qml missing case "${t}"`).toContain(`case "${t}":`);
  });

  it('generated React tokenizer exposes the same token types', async () => {
    const mod = await import('../../packages/react/src/code-block/tokenize.generated.ts');
    expect(typeof mod.tokenize).toBe('function');
    const tokens = mod.tokenize('const x = 1', 'ts');
    expect(tokens.length).toBeGreaterThan(0);
    for (const tk of tokens) expect(allTypes).toContain(tk.t);
  });
});
