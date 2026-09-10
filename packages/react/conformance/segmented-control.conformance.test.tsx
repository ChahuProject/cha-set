import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { segmentedControlSchema } from '@chahu/spec/segmented-control';

describe('SegmentedControl conformance (spec contract)', () => {
  it('accepts a props fixture that satisfies the spec contract', () => {
    const fixture = {
      options: [
        { label: 'Option 1', value: 'opt1' },
        { label: 'Option 2', value: 'opt2', disabled: true },
      ],
      value: 'opt1',
      size: 'default',
      disabled: false,
    } as const;
    expect(() => segmentedControlSchema.parse(fixture)).not.toThrow();
  });

  it('rejects empty options per the contract', () => {
    expect(() => segmentedControlSchema.parse({ options: [] })).toThrow();
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) {
      console.warn('[conformance] coverage.json not present yet; skipping earned-capability assertions');
      return;
    }
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      segmentedControl?: Record<string, boolean>;
    };
    for (const cap of ['selection', 'size', 'disabled', 'keyboard', 'styling'] as const) {
      expect(coverage.segmentedControl?.[cap], `capability "${cap}" must be earned`).toBe(true);
    }
  });
});
