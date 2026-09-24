import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { tableOfContentsSchema, tocItemSchema } from '@chahu/spec/table-of-contents';

describe('TableOfContents conformance (spec contract)', () => {
  it('accepts a props fixture that satisfies the spec contract', () => {
    const fixture = {
      items: [
        {
          id: 'intro',
          title: 'Introduction',
          level: 1,
          children: [
            { id: 'background', title: 'Background', level: 2 },
            { id: 'goals', title: 'Goals', level: 2 },
          ],
        },
        { id: 'conclusion', title: 'Conclusion', level: 1 },
      ],
      activeId: 'background',
      topOffset: 48,
      targetOffset: 64,
      variant: 'default',
      size: 'default',
      title: 'On this page',
      showTitle: true,
      showTrack: true,
      collapsible: false,
    } as const;

    expect(() => tableOfContentsSchema.parse(fixture)).not.toThrow();
  });

  it('validates recursive TocItem schema', () => {
    const item = {
      id: 'parent',
      title: 'Parent Section',
      level: 2,
      children: [
        {
          id: 'child',
          title: 'Child Section',
          level: 3,
        },
      ],
    };
    expect(() => tocItemSchema.parse(item)).not.toThrow();
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) {
      console.warn('[conformance] coverage.json not present yet; skipping earned-capability assertions');
      return;
    }
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      tableOfContents?: Record<string, boolean>;
    };
    for (const cap of ['rendersTree', 'activeIndicator', 'bannerOffset', 'selection', 'keyboard'] as const) {
      expect(coverage.tableOfContents?.[cap], `capability "${cap}" must be earned`).toBe(true);
    }
  });
});
