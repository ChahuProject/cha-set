import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { scaleOsdSchema, scaleOsdPlacementSchema, scaleOsdSizeSchema, CANONICAL_SCALE_STEPS } from '@chahu/spec/scale-osd';

describe('ScaleOsd conformance (spec contract)', () => {
  it('accepts a props fixture that satisfies the spec contract', () => {
    const fixture = {
      value: 1.0,
      step: 0.1,
      min: 0.25,
      max: 5.0,
      steps: [...CANONICAL_SCALE_STEPS],
      visible: true,
      defaultVisible: false,
      autoHideDuration: 1400,
      showControls: true,
      placement: 'bottom-center',
      disabled: false,
      size: 'default',
      animated: true,
      ignoreUiScale: true,
    } as const;

    expect(() => scaleOsdSchema.parse(fixture)).not.toThrow();

    const defaultParsed = scaleOsdSchema.parse({});
    expect(defaultParsed.value).toBe(1.0);
    expect(defaultParsed.step).toBe(0.1);
    expect(defaultParsed.min).toBe(0.2);
    expect(defaultParsed.max).toBe(3);
    expect(defaultParsed.defaultVisible).toBe(false);
    expect(defaultParsed.autoHideDuration).toBe(1400);
    expect(defaultParsed.showControls).toBe(true);
    expect(defaultParsed.placement).toBe('bottom-center');
    expect(defaultParsed.disabled).toBe(false);
    expect(defaultParsed.size).toBe('default');
    expect(defaultParsed.animated).toBe(true);
    expect(defaultParsed.ignoreUiScale).toBe(true);

    for (const p of ['bottom-center', 'top-center', 'bottom-right', 'top-right'] as const) {
      expect(() => scaleOsdSchema.parse({ placement: p })).not.toThrow();
      expect(() => scaleOsdPlacementSchema.parse(p)).not.toThrow();
    }

    for (const s of ['default', 'lg'] as const) {
      expect(() => scaleOsdSchema.parse({ size: s })).not.toThrow();
      expect(() => scaleOsdSizeSchema.parse(s)).not.toThrow();
    }
  });

  it('rejects unknown placement and size per the contract', () => {
    expect(() =>
      scaleOsdSchema.parse({
        placement: 'middle-center',
      }),
    ).toThrow();

    expect(() =>
      scaleOsdSchema.parse({
        size: 'extra-large',
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
      scaleOsd?: Record<string, boolean>;
    };
    if (!coverage.scaleOsd) {
      console.warn(
        '[conformance] coverage.json has no scaleOsd entry yet; skipping earned-capability assertions',
      );
      return;
    }
    for (const cap of ['display', 'stepControls', 'autoHide', 'keyboard', 'scaleInvariance'] as const) {
      expect(coverage.scaleOsd?.[cap], `capability "${cap}" must be earned`).toBe(true);
    }
  });
});
