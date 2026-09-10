import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { sliderSchema, sliderOrientationSchema } from '@chahu/spec/slider';

describe('Slider conformance (spec contract)', () => {
  it('accepts a props fixture that satisfies the spec contract', () => {
    const fixture = {
      value: 50,
      defaultValue: 0,
      min: 0,
      max: 100,
      step: 1,
      disabled: false,
      orientation: 'horizontal',
    } as const;
    expect(() => sliderSchema.parse(fixture)).not.toThrow();

    const defaultParsed = sliderSchema.parse({});
    expect(defaultParsed.defaultValue).toBe(0);
    expect(defaultParsed.min).toBe(0);
    expect(defaultParsed.max).toBe(100);
    expect(defaultParsed.step).toBe(1);
    expect(defaultParsed.disabled).toBe(false);
    expect(defaultParsed.readOnly).toBe(false);
    expect(defaultParsed.size).toBe('default');
    expect(defaultParsed.showTooltip).toBe(false);
    expect(defaultParsed.orientation).toBe('horizontal');

    for (const o of ['horizontal', 'vertical'] as const) {
      expect(() => sliderSchema.parse({ orientation: o })).not.toThrow();
      expect(() => sliderOrientationSchema.parse(o)).not.toThrow();
    }
    for (const d of [true, false] as const) {
      expect(() => sliderSchema.parse({ disabled: d })).not.toThrow();
      expect(() => sliderSchema.parse({ readOnly: d })).not.toThrow();
      expect(() => sliderSchema.parse({ showTooltip: d })).not.toThrow();
    }
    for (const s of ['default', 'sm'] as const) {
      expect(() => sliderSchema.parse({ size: s })).not.toThrow();
    }
    for (const v of [0, 25, 50, 75, 100]) {
      expect(() => sliderSchema.parse({ value: v })).not.toThrow();
    }
  });

  it('rejects unknown orientation and size per the contract', () => {
    expect(() =>
      sliderSchema.parse({
        orientation: 'diagonal',
      }),
    ).toThrow();
    expect(() =>
      sliderSchema.parse({
        size: 'huge',
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
      slider?: Record<string, boolean>;
    };
    if (!coverage.slider) {
      console.warn(
        '[conformance] coverage.json has no slider entry yet; skipping earned-capability assertions',
      );
      return;
    }
    for (const cap of ['valueBounds', 'step', 'disabled', 'thumbDrag', 'focusRing'] as const) {
      expect(coverage.slider?.[cap], `capability "${cap}" must be earned`).toBe(true);
    }
  });
});
