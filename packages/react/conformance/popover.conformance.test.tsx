import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  popoverSchema,
  popoverTriggerSchema,
  popoverAnchorSchema,
  popoverContentSchema,
  popoverCloseSchema,
} from '@chahu/spec/popover';

describe('Popover conformance (spec contract)', () => {
  it('accepts a props fixture that satisfies the spec contract', () => {
    const rootFixture = {
      open: false,
      defaultOpen: false,
      modal: false,
    } as const;
    expect(() => popoverSchema.parse(rootFixture)).not.toThrow();

    expect(() => popoverTriggerSchema.parse({ asChild: false, disabled: false })).not.toThrow();
    expect(() => popoverAnchorSchema.parse({})).not.toThrow();
    expect(() =>
      popoverContentSchema.parse({
        align: 'start',
        side: 'bottom',
        sideOffset: 8,
        alignOffset: 0,
        movable: false,
        moveLabel: 'Drag',
        arrow: true,
      }),
    ).not.toThrow();
    expect(() => popoverCloseSchema.parse({})).not.toThrow();
  });

  it('rejects invalid types per the contract', () => {
    expect(() => popoverContentSchema.parse({ align: 'diagonal' })).toThrow();
    expect(() => popoverContentSchema.parse({ side: 'center' })).toThrow();
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) return;
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      popover?: Record<string, boolean>;
    };
    expect(coverage.popover?.open).toBe(true);
    expect(coverage.popover?.positioning).toBe(true);
    expect(coverage.popover?.movable).toBe(true);
    expect(coverage.popover?.arrow).toBe(true);
  });
});
