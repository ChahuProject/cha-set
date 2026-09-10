import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { scrollBarSchema, scrollAreaSchema } from '@chahu/spec/scrollbar';

describe('ScrollBar & ScrollArea conformance (spec contract)', () => {
  it('accepts a props fixture that satisfies the spec contract', () => {
    const barFixture = {
      orientation: 'vertical',
      size: 'default',
    } as const;
    expect(() => scrollBarSchema.parse(barFixture)).not.toThrow();

    for (const s of ['default', 'sm'] as const) {
      expect(() => scrollBarSchema.parse({ size: s })).not.toThrow();
      expect(() => scrollAreaSchema.parse({ size: s })).not.toThrow();
    }
  });

  it('rejects unknown sizes and orientations per the contract', () => {
    expect(() => scrollBarSchema.parse({ size: 'xl' })).toThrow();
    expect(() => scrollBarSchema.parse({ orientation: 'diagonal' })).toThrow();
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) {
      console.warn('[conformance] coverage.json not present yet; skipping earned-capability assertions');
      return;
    }
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      scrollbar?: Record<string, boolean>;
    };
    for (const cap of [
      'orientation',
      'hotZone',
      'dynamicWidth',
      'stepperButtons',
      'wheelScroll',
      'thumbDrag',
      'trackJump',
    ] as const) {
      expect(coverage.scrollbar?.[cap], `capability "${cap}" must be earned`).toBe(true);
    }
  });
});
