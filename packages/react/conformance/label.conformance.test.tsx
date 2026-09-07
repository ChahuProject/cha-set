import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { labelSchema } from '@chahu/spec/label';

describe('Label conformance (spec contract)', () => {
  it('accepts a props fixture that satisfies the spec contract', () => {
    const fixture = {
      size: 'default',
      disabled: false,
      required: false,
    } as const;
    expect(() => labelSchema.parse(fixture)).not.toThrow();

    for (const s of ['default', 'sm'] as const) {
      expect(() => labelSchema.parse({ size: s })).not.toThrow();
    }
  });

  it('rejects unknown sizes per the contract', () => {
    expect(() => labelSchema.parse({ size: 'invalid-size' })).toThrow();
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) {
      console.warn('[conformance] coverage.json not present yet; skipping earned-capability assertions');
      return;
    }
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      label?: Record<string, boolean>;
    };
    for (const cap of ['standard', 'size', 'disabled', 'required', 'styling'] as const) {
      expect(coverage.label?.[cap], `capability "${cap}" must be earned`).toBe(true);
    }
  });
});
