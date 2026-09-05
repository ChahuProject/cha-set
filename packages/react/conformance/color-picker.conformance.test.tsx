import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  colorPickerSchema,
  colorPickerSizeSchema,
  colorPickerModeSchema,
} from '../../../spec/components/color-picker';

describe('ColorPicker conformance (spec contract)', () => {
  it('accepts a props fixture that satisfies the spec contract', () => {
    const fixture = {
      value: '#1d7ae0',
      defaultValue: '#1d7ae0',
      disabled: false,
      showPreview: true,
      showHex: true,
      showSwatches: true,
      size: 'default',
      mode: 'inline',
      presetColors: ['#18181b', '#ef4444', '#22c55e'],
    } as const;
    expect(() => colorPickerSchema.parse(fixture)).not.toThrow();

    const defaultParsed = colorPickerSchema.parse({});
    expect(defaultParsed.defaultValue).toBe('#1d7ae0');
    expect(defaultParsed.disabled).toBe(false);
    expect(defaultParsed.showPreview).toBe(true);
    expect(defaultParsed.showHex).toBe(true);
    expect(defaultParsed.showSwatches).toBe(true);
    expect(defaultParsed.size).toBe('default');
    expect(defaultParsed.mode).toBe('inline');

    for (const s of ['default', 'sm'] as const) {
      expect(() => colorPickerSchema.parse({ size: s })).not.toThrow();
      expect(() => colorPickerSizeSchema.parse(s)).not.toThrow();
    }
    for (const m of ['inline', 'popover'] as const) {
      expect(() => colorPickerSchema.parse({ mode: m })).not.toThrow();
      expect(() => colorPickerModeSchema.parse(m)).not.toThrow();
    }
    for (const d of [true, false] as const) {
      expect(() => colorPickerSchema.parse({ disabled: d })).not.toThrow();
    }
  });

  it('rejects unknown size or mode per the contract', () => {
    expect(() =>
      colorPickerSchema.parse({
        // @ts-expect-error - testing invalid size
        size: 'huge',
      }),
    ).toThrow();

    expect(() =>
      colorPickerSchema.parse({
        // @ts-expect-error - testing invalid mode
        mode: 'modal',
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
      'color-picker'?: Record<string, boolean>;
      colorPicker?: Record<string, boolean>;
    };
    const entry = coverage.colorPicker ?? coverage['color-picker'];
    if (!entry) {
      console.warn(
        '[conformance] coverage.json has no color-picker entry yet; skipping earned-capability assertions',
      );
      return;
    }
    for (const cap of ['colorValue', 'hexInput', 'swatches', 'hueSlider', 'disabled'] as const) {
      expect(entry[cap], `capability "${cap}" must be earned`).toBe(true);
    }
  });
});
