import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { splitterHandleSchema } from '@chahu/spec/splitter-handle';

describe('SplitterHandle conformance (spec contract)', () => {
  it('accepts a props fixture that satisfies the spec contract', () => {
    const fixture = {
      edge: 'left',
      targetSize: 250,
      minSize: 120,
      maxSize: 600,
      defaultSize: 200,
      liveUpdate: true,
      hitThickness: 8,
      visualThickness: 1,
      activeVisualThickness: 2,
      disabled: false,
    } as const;
    expect(() => splitterHandleSchema.parse(fixture)).not.toThrow();
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) {
      console.warn('[conformance] coverage.json not present yet; skipping earned-capability assertions');
      return;
    }
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      splitterHandle?: Record<string, boolean>;
    };
    for (const cap of ['resize', 'edgeOrientation'] as const) {
      expect(coverage.splitterHandle?.[cap], `capability "${cap}" must be earned`).toBe(true);
    }
  });
});
