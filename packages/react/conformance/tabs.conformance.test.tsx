import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { tabsSchema, tabsTriggerSchema } from '@chahu/spec/tabs';

describe('Tabs conformance (spec contract)', () => {
  it('accepts a props fixture that satisfies the spec contract', () => {
    const rootFixture = {
      defaultValue: 'tab1',
      orientation: 'horizontal',
      variant: 'default',
      size: 'default',
    } as const;
    expect(() => tabsSchema.parse(rootFixture)).not.toThrow();

    for (const v of ['default', 'line'] as const) {
      expect(() => tabsSchema.parse({ variant: v })).not.toThrow();
    }
    for (const s of ['default', 'sm'] as const) {
      expect(() => tabsSchema.parse({ size: s })).not.toThrow();
    }

    const triggerFixture = {
      value: 'tab1',
      disabled: false,
      variant: 'line',
      size: 'sm',
      badge: '3',
    } as const;
    expect(() => tabsTriggerSchema.parse(triggerFixture)).not.toThrow();
  });

  it('rejects unknown orientation per the contract', () => {
    expect(() => tabsSchema.parse({ orientation: 'diagonal' })).toThrow();
  });

  it('rejects unknown variant per the contract', () => {
    expect(() => tabsSchema.parse({ variant: 'invalid-variant' })).toThrow();
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) {
      console.warn('[conformance] coverage.json not present yet; skipping earned-capability assertions');
      return;
    }
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      tabs?: Record<string, boolean>;
    };
    for (const cap of ['selection', 'orientation', 'keyboard', 'disabled', 'styling'] as const) {
      expect(coverage.tabs?.[cap], `capability "${cap}" must be earned`).toBe(true);
    }
  });
});
