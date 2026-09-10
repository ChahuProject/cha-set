import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { cardSchema } from '@chahu/spec/card';

describe('Card conformance (spec contract)', () => {
  it('accepts a props fixture that satisfies the spec contract', () => {
    const fixture = {
      variant: 'default',
    } as const;
    expect(() => cardSchema.parse(fixture)).not.toThrow();

    for (const v of ['default', 'secondary', 'outline'] as const) {
      expect(() => cardSchema.parse({ variant: v })).not.toThrow();
    }
    for (const s of ['default', 'sm'] as const) {
      expect(() => cardSchema.parse({ size: s })).not.toThrow();
    }
    expect(() => cardSchema.parse({ interactive: true })).not.toThrow();
  });

  it('rejects unknown variants per the contract', () => {
    expect(() => cardSchema.parse({ variant: 'invalid-var' })).toThrow();
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) {
      console.warn('[conformance] coverage.json not present yet; skipping earned-capability assertions');
      return;
    }
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      card?: Record<string, boolean>;
    };
    for (const cap of ['structure', 'variant', 'styling'] as const) {
      expect(coverage.card?.[cap], `capability "${cap}" must be earned`).toBe(true);
    }
  });
});
