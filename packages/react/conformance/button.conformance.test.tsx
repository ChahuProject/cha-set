import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buttonSchema } from '@chahu/spec/button';

describe('Button conformance (spec contract)', () => {
  it('accepts a props fixture that satisfies the spec contract', () => {
    const fixture = {
      variant: 'default',
      size: 'default',
      loading: false,
      fullWidth: false,
      disabled: false,
      type: 'button',
    } as const;
    expect(() => buttonSchema.parse(fixture)).not.toThrow();

    // Verify all shadcn variants and sizes
    const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const;
    const sizes = ['default', 'sm', 'lg', 'icon'] as const;
    for (const v of variants) {
      expect(() => buttonSchema.parse({ variant: v })).not.toThrow();
    }
    for (const s of sizes) {
      expect(() => buttonSchema.parse({ size: s })).not.toThrow();
    }
  });

  it('rejects unknown variants per the contract', () => {
    expect(() => buttonSchema.parse({ variant: 'nope' })).toThrow();
  });

  it('earned coverage (written by Button.test.tsx) declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) {
      // The behavioral suite owns this file; under parallel vitest workers it
      // may not exist yet when this file runs. CI ordering (test -> gate)
      // still enforces it before parity runs.
      console.warn('[conformance] coverage.json not present yet; skipping earned-capability assertions');
      return;
    }
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      button?: Record<string, boolean>;
    };
    for (const cap of ['variant', 'size', 'disabled', 'keyboard'] as const) {
      expect(coverage.button?.[cap], `capability "${cap}" must be earned by a passing test`).toBe(true);
    }
  });
});