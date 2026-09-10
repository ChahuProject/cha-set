import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  sheetSchema,
  sheetTriggerSchema,
  sheetCloseSchema,
  sheetContentSchema,
  sheetHeaderSchema,
  sheetFooterSchema,
  sheetTitleSchema,
  sheetDescriptionSchema,
} from '@chahu/spec/sheet';

describe('Sheet conformance (spec contract)', () => {
  it('accepts a props fixture that satisfies the spec contract', () => {
    const rootFixture = {
      open: false,
      defaultOpen: false,
    } as const;
    expect(() => sheetSchema.parse(rootFixture)).not.toThrow();

    expect(() => sheetTriggerSchema.parse({ asChild: false, disabled: false })).not.toThrow();
    expect(() => sheetCloseSchema.parse({ asChild: false })).not.toThrow();
    expect(() =>
      sheetContentSchema.parse({
        side: 'right',
        size: 'lg',
        showCloseButton: true,
        closeOnOverlayClick: false,
        closeOnEscape: true,
      }),
    ).not.toThrow();
    expect(() => sheetHeaderSchema.parse({})).not.toThrow();
    expect(() => sheetFooterSchema.parse({})).not.toThrow();
    expect(() => sheetTitleSchema.parse({})).not.toThrow();
    expect(() => sheetDescriptionSchema.parse({})).not.toThrow();
  });

  it('rejects invalid types per the contract', () => {
    expect(() => sheetContentSchema.parse({ side: 'diagonal' })).toThrow();
    expect(() => sheetContentSchema.parse({ size: 'huge' })).toThrow();
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) return;
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      sheet?: Record<string, boolean>;
    };
    expect(coverage.sheet?.open).toBe(true);
    expect(coverage.sheet?.side).toBe(true);
    expect(coverage.sheet?.overlay).toBe(true);
    expect(coverage.sheet?.close).toBe(true);
    expect(coverage.sheet?.size).toBe(true);
  });
});
