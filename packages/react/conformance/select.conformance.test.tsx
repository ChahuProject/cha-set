import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  selectSchema,
  selectTriggerSchema,
  selectValueSchema,
  selectContentSchema,
  selectItemSchema,
  selectGroupSchema,
  selectLabelSchema,
  selectSeparatorSchema,
  selectScrollUpButtonSchema,
  selectScrollDownButtonSchema,
} from '@chahu/spec/select';

describe('Select conformance (spec contract)', () => {
  it('accepts a props fixture that satisfies the spec contract', () => {
    const rootFixture = {
      value: 'banana',
      defaultValue: 'apple',
      open: false,
      defaultOpen: false,
      disabled: false,
    } as const;
    expect(() => selectSchema.parse(rootFixture)).not.toThrow();

    expect(() => selectTriggerSchema.parse({ size: 'default', disabled: false })).not.toThrow();
    expect(() => selectValueSchema.parse({ placeholder: 'Select fruit' })).not.toThrow();
    expect(() => selectContentSchema.parse({ position: 'item-aligned', align: 'center', sideOffset: 4 })).not.toThrow();
    expect(() => selectItemSchema.parse({ value: 'opt1', disabled: false })).not.toThrow();
    expect(() => selectGroupSchema.parse({})).not.toThrow();
    expect(() => selectLabelSchema.parse({})).not.toThrow();
    expect(() => selectSeparatorSchema.parse({})).not.toThrow();
    expect(() => selectScrollUpButtonSchema.parse({})).not.toThrow();
    expect(() => selectScrollDownButtonSchema.parse({})).not.toThrow();
  });

  it('rejects invalid types per the contract', () => {
    expect(() => selectTriggerSchema.parse({ size: 'huge' })).toThrow();
    expect(() => selectContentSchema.parse({ position: 'unsupported' })).toThrow();
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) return;
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      select?: Record<string, boolean>;
    };
    expect(coverage.select?.value).toBe(true);
    expect(coverage.select?.trigger).toBe(true);
    expect(coverage.select?.popup).toBe(true);
    expect(coverage.select?.disabled).toBe(true);
  });
});
