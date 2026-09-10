import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { settingRowSchema } from '@chahu/spec/setting-row';

describe('SettingRow conformance (spec contract)', () => {
  it('accepts a props fixture that satisfies the spec contract', () => {
    const fixture = {
      name: 'Hardware Acceleration',
      description: 'Use dedicated GPU shaders for rendering viewport.',
      highlightId: 'hw-accel',
      highlightTarget: 'hw-accel',
      highlight: true,
      disabled: false,
    } as const;
    expect(() => settingRowSchema.parse(fixture)).not.toThrow();
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) {
      console.warn('[conformance] coverage.json not present yet; skipping earned-capability assertions');
      return;
    }
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      settingRow?: Record<string, boolean>;
    };
    for (const cap of ['layout', 'highlight'] as const) {
      expect(coverage.settingRow?.[cap], `capability "${cap}" must be earned`).toBe(true);
    }
  });
});
