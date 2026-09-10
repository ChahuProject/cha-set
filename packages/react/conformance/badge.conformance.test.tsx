import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { badgeSchema } from '@chahu/spec/badge';

describe('Badge conformance (spec contract)', () => {
  it('accepts a props fixture that satisfies the spec contract', () => {
    const fixture = {
      variant: 'default',
      size: 'default',
    } as const;
    expect(() => badgeSchema.parse(fixture)).not.toThrow();

    for (const v of ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'] as const) {
      expect(() => badgeSchema.parse({ variant: v })).not.toThrow();
    }
    for (const s of ['default', 'sm'] as const) {
      expect(() => badgeSchema.parse({ size: s })).not.toThrow();
    }
    expect(() => badgeSchema.parse({ dot: true, removable: true, interactive: true })).not.toThrow();
  });

  it('rejects unknown variants per the contract', () => {
    expect(() => badgeSchema.parse({ variant: 'invalid-var' })).toThrow();
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) {
      console.warn('[conformance] coverage.json not present yet; skipping earned-capability assertions');
      return;
    }
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      badge?: Record<string, boolean>;
    };
    for (const cap of ['variant', 'size', 'styling'] as const) {
      expect(coverage.badge?.[cap], `capability "${cap}" must be earned`).toBe(true);
    }
  });
});
