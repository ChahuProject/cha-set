import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  dialogSchema,
  dialogTriggerSchema,
  dialogContentSchema,
  dialogHeaderSchema,
  dialogTitleSchema,
  dialogDescriptionSchema,
  dialogFooterSchema,
  dialogCloseSchema,
} from '@chahu/spec/dialog';

describe('Dialog conformance (spec contract)', () => {
  it('accepts a props fixture that satisfies the spec contract', () => {
    const rootFixture = {
      open: false,
      title: 'Modal Title',
      description: 'Modal description text',
    } as const;
    expect(() => dialogSchema.parse(rootFixture)).not.toThrow();

    const defaultParsed = dialogSchema.parse({});
    expect(defaultParsed.open).toBe(false);

    const triggerFixture = {
      asChild: false,
      disabled: false,
    } as const;
    expect(() => dialogTriggerSchema.parse(triggerFixture)).not.toThrow();

    const contentFixture = {
      customRadius: 8,
    } as const;
    expect(() => dialogContentSchema.parse(contentFixture)).not.toThrow();

    expect(() => dialogHeaderSchema.parse({})).not.toThrow();
    expect(() => dialogTitleSchema.parse({})).not.toThrow();
    expect(() => dialogDescriptionSchema.parse({})).not.toThrow();
    expect(() => dialogFooterSchema.parse({})).not.toThrow();
    expect(() => dialogCloseSchema.parse({})).not.toThrow();
  });

  it('rejects invalid types per the contract', () => {
    expect(() => dialogSchema.parse({ open: 'not-a-boolean' })).toThrow();
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) {
      console.warn('[conformance] coverage.json not present yet; skipping earned-capability assertions');
      return;
    }
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      dialog?: Record<string, boolean>;
    };
    if (!coverage.dialog) {
      console.warn('[conformance] coverage.json has no dialog entry yet; skipping earned-capability assertions');
      return;
    }
    for (const cap of ['open', 'portal', 'overlay', 'closeButton', 'escapeKey'] as const) {
      expect(coverage.dialog?.[cap], `capability "${cap}" must be earned`).toBe(true);
    }
  });
});
