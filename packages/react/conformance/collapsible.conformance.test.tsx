import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  collapsibleSchema,
  collapsibleTriggerSchema,
  collapsibleContentSchema,
} from '@chahu/spec/collapsible';

describe('Collapsible conformance (spec contract)', () => {
  it('accepts a props fixture that satisfies the spec contract', () => {
    const rootFixture = {
      open: false,
      defaultOpen: false,
      disabled: false,
      className: 'test-root',
    } as const;
    expect(() => collapsibleSchema.parse(rootFixture)).not.toThrow();

    const defaultParsed = collapsibleSchema.parse({});
    expect(defaultParsed.defaultOpen).toBe(false);
    expect(defaultParsed.disabled).toBe(false);

    const triggerFixture = {
      asChild: false,
      disabled: false,
      className: 'test-trigger',
    } as const;
    expect(() => collapsibleTriggerSchema.parse(triggerFixture)).not.toThrow();

    const contentFixture = {
      className: 'test-content',
    } as const;
    expect(() => collapsibleContentSchema.parse(contentFixture)).not.toThrow();
  });

  it('rejects invalid types per the contract', () => {
    expect(() => collapsibleSchema.parse({ defaultOpen: 'not-a-boolean' })).toThrow();
    expect(() => collapsibleSchema.parse({ disabled: 'not-a-boolean' })).toThrow();
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) {
      console.warn('[conformance] coverage.json not present yet; skipping earned-capability assertions');
      return;
    }
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      collapsible?: Record<string, boolean>;
    };
    if (!coverage.collapsible) {
      console.warn('[conformance] coverage.json has no collapsible entry yet; skipping earned-capability assertions');
      return;
    }
    for (const cap of ['standard', 'defaultOpen', 'disabled'] as const) {
      expect(coverage.collapsible?.[cap], `capability "${cap}" must be earned`).toBe(true);
    }
  });
});
