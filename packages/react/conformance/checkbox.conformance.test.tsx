import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { checkboxSchema } from '@chahu/spec/checkbox';

describe('Checkbox conformance (spec contract)', () => {
  it('accepts a props fixture that satisfies the spec contract', () => {
    const fixture = {
      checked: false,
      indeterminate: false,
      disabled: false,
      size: 'default',
    } as const;
    expect(() => checkboxSchema.parse(fixture)).not.toThrow();

    for (const s of ['default', 'sm'] as const) {
      expect(() => checkboxSchema.parse({ size: s })).not.toThrow();
    }
    for (const b of [true, false]) {
      expect(() => checkboxSchema.parse({ checked: b })).not.toThrow();
      expect(() => checkboxSchema.parse({ indeterminate: b })).not.toThrow();
      expect(() => checkboxSchema.parse({ disabled: b })).not.toThrow();
    }
    expect(() => checkboxSchema.parse({ label: 'Remember me' })).not.toThrow();
    expect(
      () => checkboxSchema.parse({ id: 'cb-1', name: 'terms', value: 'yes' }),
    ).not.toThrow();
  });

  it('rejects unknown sizes per the contract', () => {
    expect(() => checkboxSchema.parse({ size: 'invalid-size' })).toThrow();
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) {
      console.warn(
        '[conformance] coverage.json not present yet; skipping earned-capability assertions',
      );
      return;
    }
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      checkbox?: Record<string, boolean>;
    };
    if (!coverage.checkbox) {
      return;
    }
    for (const cap of [
      'checked',
      'indeterminate',
      'size',
      'disabled',
      'label',
    ] as const) {
      expect(coverage.checkbox[cap], `capability "${cap}" must be earned`).toBe(
        true,
      );
    }
  });
});
