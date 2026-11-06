import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { shortcutBarSchema } from '@chahu/spec/shortcut-bar';

describe('ShortcutBar conformance (spec contract)', () => {
  it('accepts a props fixture that satisfies the spec contract', () => {
    const fixture = {
      preset: 'address-bar',
      compact: 'auto',
      size: 'xs',
      variant: 'outline',
      showOverflowCount: true,
      mode: 'auto',
    } as const;
    expect(() => shortcutBarSchema.parse(fixture)).not.toThrow();

    for (const m of ['auto', 'icon'] as const) {
      expect(() => shortcutBarSchema.parse({ mode: m })).not.toThrow();
    }

    for (const p of ['dropdown', 'dialog', 'tree', 'table', 'address-bar'] as const) {
      expect(() => shortcutBarSchema.parse({ preset: p })).not.toThrow();
    }

    expect(() =>
      shortcutBarSchema.parse({
        items: [{ id: 'test', keys: ['Ctrl', 'K'], label: 'Search' }],
      })
    ).not.toThrow();
  });

  it('rejects unknown mode per the contract', () => {
    expect(() => shortcutBarSchema.parse({ mode: 'invalid-mode' })).toThrow();
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) {
      console.warn('[conformance] coverage.json not present yet; skipping earned-capability assertions');
      return;
    }
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      shortcutBar?: Record<string, boolean>;
    };
    for (const cap of ['responsiveStages', 'iconMode', 'presetShortcuts', 'overflowPopover'] as const) {
      expect(coverage.shortcutBar?.[cap], `capability "${cap}" must be earned`).toBe(true);
    }
  });
});
