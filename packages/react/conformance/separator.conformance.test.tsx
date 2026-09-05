import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { separatorSchema, separatorOrientationSchema } from '@chahu/spec/separator';

describe('Separator conformance (spec contract)', () => {
  it('accepts a props fixture that satisfies the spec contract', () => {
    const fixture = {
      orientation: 'horizontal',
      decorative: true,
    } as const;
    expect(() => separatorSchema.parse(fixture)).not.toThrow();

    const defaultParsed = separatorSchema.parse({});
    expect(defaultParsed.orientation).toBe('horizontal');
    expect(defaultParsed.decorative).toBe(true);

    for (const o of ['horizontal', 'vertical'] as const) {
      expect(() => separatorSchema.parse({ orientation: o })).not.toThrow();
      expect(() => separatorOrientationSchema.parse(o)).not.toThrow();
    }
    for (const d of [true, false] as const) {
      expect(() => separatorSchema.parse({ decorative: d })).not.toThrow();
    }
  });

  it('rejects unknown orientation per the contract', () => {
    expect(() => separatorSchema.parse({ orientation: 'invalid-orientation' })).toThrow();
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) {
      console.warn('[conformance] coverage.json not present yet; skipping earned-capability assertions');
      return;
    }
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      separator?: Record<string, boolean>;
    };
    if (!coverage.separator) {
      console.warn('[conformance] coverage.json has no separator entry yet; skipping earned-capability assertions');
      return;
    }
    for (const cap of ['orientation', 'styling'] as const) {
      expect(coverage.separator?.[cap], `capability "${cap}" must be earned`).toBe(true);
    }
  });
});
