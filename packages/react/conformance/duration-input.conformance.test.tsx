import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { durationInputSchema } from '@chahu/spec/duration-input';

describe('DurationInput conformance (spec contract)', () => {
  it('accepts valid fixtures that satisfy spec contract', () => {
    expect(() =>
      durationInputSchema.parse({
        value: 3600,
        maxHours: 48,
        size: 'sm',
        disabled: false,
        showPresets: true,
        showLabels: true,
        hoursLabel: 'Hours',
        minutesLabel: 'Minutes',
        secondsLabel: 'Seconds',
        presetsLabel: 'Presets',
      }),
    ).not.toThrow();

    const parsed = durationInputSchema.parse({});
    expect(parsed.value).toBe(0);
    expect(parsed.maxHours).toBe(99);
    expect(parsed.size).toBe('default');
    expect(parsed.disabled).toBe(false);
    expect(parsed.showPresets).toBe(true);
    expect(parsed.showLabels).toBe(true);
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) return;
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      durationInput?: Record<string, boolean>;
    };
    expect(coverage.durationInput?.timeSegments).toBe(true);
    expect(coverage.durationInput?.presets).toBe(true);
  });
});
