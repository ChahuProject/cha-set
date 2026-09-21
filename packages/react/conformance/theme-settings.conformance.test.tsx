import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { themeSettingsSchema, themeConfigSchema } from '@chahu/spec/theme-settings';

describe('ThemeSettings conformance (spec contract)', () => {
  it('accepts a props fixture that satisfies the spec contract', () => {
    const fixture = {
      disabled: false,
      showReset: true,
      showExport: true,
      showImport: true,
      showTypography: false,
    } as const;
    expect(() => themeSettingsSchema.parse(fixture)).not.toThrow();
  });

  it('validates canonical ThemeConfig object according to schema', () => {
    const configFixture = {
      version: 1,
      mode: 'dark',
      palette: {
        id: 'blue',
        customHex: '#30a0ff',
      },
      decoration: {
        styleId: 'simple',
        level: 60,
        overrides: {
          radius: 16,
          motion: 20,
        },
      },
      typography: {
        familyId: 'system',
        scaleId: 'default',
      },
      uiScale: 1.0,
    } as const;
    expect(() => themeConfigSchema.parse(configFixture)).not.toThrow();
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) {
      console.warn('[conformance] coverage.json not present yet; skipping earned-capability assertions');
      return;
    }
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      themeSettings?: Record<string, boolean>;
    };
    for (const cap of ['mode', 'palette', 'decoration', 'uiScale', 'reset', 'exportImport'] as const) {
      expect(coverage.themeSettings?.[cap], `capability "${cap}" must be earned`).toBe(true);
    }
  });
});
