import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  alertDialogSchema,
  alertDialogTriggerSchema,
  alertDialogPortalSchema,
  alertDialogOverlaySchema,
  alertDialogContentSchema,
  alertDialogHeaderSchema,
  alertDialogFooterSchema,
  alertDialogTitleSchema,
  alertDialogDescriptionSchema,
  alertDialogActionSchema,
  alertDialogCancelSchema,
} from '@chahu/spec/alert-dialog';

describe('AlertDialog conformance (spec contract)', () => {
  it('accepts a props fixture that satisfies the spec contract', () => {
    const rootFixture = {
      open: false,
      defaultOpen: false,
    } as const;
    expect(() => alertDialogSchema.parse(rootFixture)).not.toThrow();

    expect(() => alertDialogTriggerSchema.parse({ asChild: false, disabled: false })).not.toThrow();
    expect(() => alertDialogPortalSchema.parse({})).not.toThrow();
    expect(() => alertDialogOverlaySchema.parse({})).not.toThrow();
    expect(() =>
      alertDialogContentSchema.parse({
        customRadius: 12,
        size: 'lg',
        closeOnOverlayClick: false,
      }),
    ).not.toThrow();
    expect(() => alertDialogHeaderSchema.parse({})).not.toThrow();
    expect(() => alertDialogFooterSchema.parse({})).not.toThrow();
    expect(() => alertDialogTitleSchema.parse({})).not.toThrow();
    expect(() => alertDialogDescriptionSchema.parse({})).not.toThrow();
    expect(() => alertDialogActionSchema.parse({ disabled: false, variant: 'destructive' })).not.toThrow();
    expect(() => alertDialogCancelSchema.parse({ disabled: false })).not.toThrow();
  });

  it('rejects invalid types per the contract', () => {
    expect(() => alertDialogActionSchema.parse({ disabled: 'invalid' })).toThrow();
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) return;
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      alertDialog?: Record<string, boolean>;
    };
    expect(coverage.alertDialog?.open).toBe(true);
    expect(coverage.alertDialog?.action).toBe(true);
    expect(coverage.alertDialog?.cancel).toBe(true);
    expect(coverage.alertDialog?.overlay).toBe(true);
    expect(coverage.alertDialog?.destructive).toBe(true);
  });
});
