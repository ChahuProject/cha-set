import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { presetNumberInputSchema } from '@chahu/spec/preset-number-input';

describe('PresetNumberInput conformance (spec contract)', () => {
  it('accepts valid fixtures that satisfy spec contract', () => {
    expect(() =>
      presetNumberInputSchema.parse({
        value: '1024',
        presets: [128, 256, 512],
        allowClear: true,
        clearLabel: 'Reset',
      }),
    ).not.toThrow();

    const parsed = presetNumberInputSchema.parse({});
    expect(parsed.value).toBe('');
    expect(parsed.disabled).toBe(false);
    expect(parsed.allowClear).toBe(true);
    expect(parsed.clearLabel).toBe('None');
    expect(parsed.presets).toEqual([64, 128, 256, 512, 1024, 2048, 4096, 8192]);
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) return;
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      presetNumberInput?: Record<string, boolean>;
    };
    expect(coverage.presetNumberInput?.standard).toBe(true);
    expect(coverage.presetNumberInput?.presets).toBe(true);
    expect(coverage.presetNumberInput?.clear).toBe(true);
    expect(coverage.presetNumberInput?.disabled).toBe(true);
  });
});
