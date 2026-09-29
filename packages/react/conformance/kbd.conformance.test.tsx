import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { kbdSchema } from '@chahu/spec/kbd';

describe('Kbd conformance (spec contract)', () => {
  it('accepts a props fixture that satisfies the spec contract', () => {
    const fixture = {
      variant: 'outline',
      size: 'default',
      compact: 'auto',
      overflow: 'collapse',
    } as const;
    expect(() => kbdSchema.parse(fixture)).not.toThrow();

    for (const v of ['subtle', 'outline', 'solid', 'inverted'] as const) {
      expect(() => kbdSchema.parse({ variant: v })).not.toThrow();
    }
    for (const s of ['xs', 'sm', 'default', 'md'] as const) {
      expect(() => kbdSchema.parse({ size: s })).not.toThrow();
    }
    for (const c of ['auto', 'always', 'never'] as const) {
      expect(() => kbdSchema.parse({ compact: c })).not.toThrow();
    }
    for (const o of ['collapse', 'hide', 'visible'] as const) {
      expect(() => kbdSchema.parse({ overflow: o })).not.toThrow();
    }
    expect(() => kbdSchema.parse({ shortcut: 'Ctrl+Shift+P', separator: '+' })).not.toThrow();
  });

  it('rejects unknown variants per the contract', () => {
    expect(() => kbdSchema.parse({ variant: 'invalid-var' })).toThrow();
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) {
      console.warn('[conformance] coverage.json not present yet; skipping earned-capability assertions');
      return;
    }
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      kbd?: Record<string, boolean>;
    };
    for (const cap of ['variant', 'size', 'shortcutParsing', 'compactSymbols', 'styling'] as const) {
      expect(coverage.kbd?.[cap], `capability "${cap}" must be earned`).toBe(true);
    }
  });
});
