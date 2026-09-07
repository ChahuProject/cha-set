import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { sidebarSchema, sidebarProviderSchema } from '@chahu/spec/sidebar';

describe('Sidebar conformance (spec contract)', () => {
  it('accepts a props fixture that satisfies the spec contract', () => {
    const rootFixture = {
      side: 'left',
      variant: 'sidebar',
      collapsible: 'offcanvas',
      className: 'test-sidebar',
    } as const;
    expect(() => sidebarSchema.parse(rootFixture)).not.toThrow();

    const defaultParsed = sidebarSchema.parse({});
    expect(defaultParsed.side).toBe('left');
    expect(defaultParsed.variant).toBe('sidebar');
    expect(defaultParsed.collapsible).toBe('offcanvas');

    const providerFixture = {
      defaultOpen: true,
      open: true,
      className: 'test-provider',
    } as const;
    expect(() => sidebarProviderSchema.parse(providerFixture)).not.toThrow();

    const defaultProviderParsed = sidebarProviderSchema.parse({});
    expect(defaultProviderParsed.defaultOpen).toBe(true);
  });

  it('rejects invalid types per the contract', () => {
    expect(() => sidebarSchema.parse({ side: 'invalid-side' })).toThrow();
    expect(() => sidebarSchema.parse({ variant: 'invalid-variant' })).toThrow();
    expect(() => sidebarSchema.parse({ collapsible: 'invalid-collapsible' })).toThrow();
    expect(() => sidebarProviderSchema.parse({ defaultOpen: 'not-a-boolean' })).toThrow();
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) {
      console.warn('[conformance] coverage.json not present yet; skipping earned-capability assertions');
      return;
    }
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      sidebar?: Record<string, boolean>;
    };
    if (!coverage.sidebar) {
      console.warn('[conformance] coverage.json has no sidebar entry yet; skipping earned-capability assertions');
      return;
    }
    for (const cap of ['providerContext', 'collapsibleVariant', 'resizableRail', 'menuHierarchy'] as const) {
      expect(coverage.sidebar?.[cap], `capability "${cap}" must be earned`).toBe(true);
    }
  });
});
