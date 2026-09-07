import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { rangeSliderSchema } from '@chahu/spec/range-slider';

describe('RangeSlider conformance (spec contract)', () => {
  it('accepts valid fixtures that satisfy spec contract', () => {
    expect(() =>
      rangeSliderSchema.parse({
        min: 0,
        max: 100,
        step: 5,
      }),
    ).not.toThrow();

    const parsed = rangeSliderSchema.parse({});
    expect(parsed.min).toBe(0);
    expect(parsed.max).toBe(100);
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) return;
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      rangeSlider?: Record<string, boolean>;
    };
    expect(coverage.rangeSlider?.dualThumbs).toBe(true);
    expect(coverage.rangeSlider?.dragInteraction).toBe(true);
    expect(coverage.rangeSlider?.trackClick).toBe(true);
  });
});
