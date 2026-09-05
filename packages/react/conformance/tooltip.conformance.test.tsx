import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { tooltipSchema, tooltipSideSchema } from '@chahu/spec/tooltip';

describe('Tooltip conformance (spec contract)', () => {
  it('accepts a props fixture that satisfies the spec contract', () => {
    const fixture = {
      content: 'Help text',
      side: 'top',
      delayDuration: 200,
      disabled: false,
    } as const;
    expect(() => tooltipSchema.parse(fixture)).not.toThrow();

    const defaultParsed = tooltipSchema.parse({});
    expect(defaultParsed.side).toBe('top');
    expect(defaultParsed.delayDuration).toBe(200);
    expect(defaultParsed.disabled).toBe(false);
    expect(defaultParsed.content).toBe('');

    for (const s of ['top', 'bottom', 'left', 'right'] as const) {
      expect(() => tooltipSchema.parse({ side: s })).not.toThrow();
      expect(() => tooltipSideSchema.parse(s)).not.toThrow();
    }
    for (const d of [true, false] as const) {
      expect(() => tooltipSchema.parse({ disabled: d })).not.toThrow();
    }
  });

  it('rejects unknown side per the contract', () => {
    expect(() => tooltipSchema.parse({ side: 'invalid-side' })).toThrow();
  });

  it('rejects invalid delayDuration types', () => {
    expect(() => tooltipSchema.parse({ delayDuration: 'fast' as any })).toThrow();
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) {
      console.warn('[conformance] coverage.json not present yet; skipping earned-capability assertions');
      return;
    }
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      tooltip?: Record<string, boolean>;
    };
    if (!coverage.tooltip) {
      console.warn('[conformance] coverage.json has no tooltip entry yet; skipping earned-capability assertions');
      return;
    }
    for (const cap of ['content', 'side', 'delay', 'hoverTrigger'] as const) {
      expect(coverage.tooltip?.[cap], `capability "${cap}" must be earned`).toBe(true);
    }
  });
});
