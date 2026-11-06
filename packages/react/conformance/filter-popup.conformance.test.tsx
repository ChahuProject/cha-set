import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  filterPopupSchema,
  filterPopupItemSchema,
  filterPopupSearchVisibilitySchema,
  filterPopupLogicModeSchema,
} from '@chahu/spec/filter-popup';

describe('FilterPopup conformance (spec contract)', () => {
  it('accepts a props fixture that satisfies the spec contract', () => {
    const fixture = {
      title: 'Filter',
      icon: 'star',
      items: [
        {
          key: 'jpg',
          label: '.jpg',
          count: 10,
          isChecked: true,
          isExcluded: false,
        },
      ],
      open: false,
      searchEnabled: true,
      searchVisibility: 'autoHidden',
      showLogicToggle: false,
      logicMode: 'and',
      hasActive: false,
    } as const;

    expect(() => filterPopupSchema.parse(fixture)).not.toThrow();
    expect(() =>
      filterPopupItemSchema.parse({
        key: 5,
        stars: 5,
        isChecked: false,
        isExcluded: true,
      }),
    ).not.toThrow();
    expect(() => filterPopupSearchVisibilitySchema.parse('always')).not.toThrow();
    expect(() => filterPopupLogicModeSchema.parse('or')).not.toThrow();
  });

  it('rejects invalid types per the contract', () => {
    expect(() => filterPopupSearchVisibilitySchema.parse('invalid')).toThrow();
    expect(() => filterPopupLogicModeSchema.parse('xor')).toThrow();
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) return;
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      'filter-popup'?: Record<string, boolean>;
    };
    expect(coverage['filter-popup']?.facetFiltering).toBe(true);
    expect(coverage['filter-popup']?.pinyinSearch).toBe(true);
    expect(coverage['filter-popup']?.autoHiddenSearch).toBe(true);
    expect(coverage['filter-popup']?.starRatings).toBe(true);
    expect(coverage['filter-popup']?.shortcutsGuide).toBe(true);
  });
});
