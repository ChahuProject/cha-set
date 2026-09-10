import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { elidedTextSchema } from '@chahu/spec/elided-text';

describe('ElidedText conformance (spec contract)', () => {
  it('accepts a props fixture that satisfies the spec contract', () => {
    const fixture = {
      text: 'Very long text that gets truncated when overflowing its container boundary.',
      tooltipText: 'Full custom tooltip description',
      tooltipPlacement: 'top',
      tooltipDelay: 300,
      alwaysShowTooltip: false,
      showTooltipWhenElided: true,
      maxLines: 1,
    } as const;
    expect(() => elidedTextSchema.parse(fixture)).not.toThrow();
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) {
      console.warn('[conformance] coverage.json not present yet; skipping earned-capability assertions');
      return;
    }
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      elidedText?: Record<string, boolean>;
    };
    for (const cap of ['truncation', 'tooltip'] as const) {
      expect(coverage.elidedText?.[cap], `capability "${cap}" must be earned`).toBe(true);
    }
  });
});
