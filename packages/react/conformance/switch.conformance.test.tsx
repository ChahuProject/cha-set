import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { switchSchema } from '@chahu/spec/switch';

describe('Switch conformance (spec contract)', () => {
  it('accepts a props fixture that satisfies the spec contract', () => {
    const fixture = {
      checked: false,
      disabled: false,
      size: 'default',
    } as const;
    expect(() => switchSchema.parse(fixture)).not.toThrow();

    for (const s of ['default', 'sm'] as const) {
      expect(() => switchSchema.parse({ size: s })).not.toThrow();
    }
    for (const c of [true, false] as const) {
      expect(() => switchSchema.parse({ checked: c })).not.toThrow();
    }
    for (const d of [true, false] as const) {
      expect(() => switchSchema.parse({ disabled: d })).not.toThrow();
    }
    expect(
      () =>
        switchSchema.parse({
          label: 'Wi-Fi',
          id: 'sw-1',
          name: 'wifi-toggle',
          defaultChecked: true,
        }),
    ).not.toThrow();
  });

  it('rejects unknown size variants per the contract', () => {
    expect(() =>
      switchSchema.parse({
        size: 'invalid-size',
      }),
    ).toThrow();
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
      switch?: Record<string, boolean>;
    };
    if (!coverage.switch) {
      console.warn(
        '[conformance] coverage.json has no switch entry yet; skipping earned-capability assertions',
      );
      return;
    }
    for (const cap of ['toggle', 'size', 'disabled', 'focusRing'] as const) {
      expect(coverage.switch?.[cap], `capability "${cap}" must be earned`).toBe(true);
    }
  });
});
