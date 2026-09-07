import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { dataTableSchema } from '@chahu/spec/data-table';

describe('DataTable conformance (spec contract)', () => {
  it('accepts valid fixtures that satisfy spec contract', () => {
    expect(() => dataTableSchema.parse({})).not.toThrow();
    const parsed = dataTableSchema.parse({ enableGlobalFilter: true, selectionMode: 'multiple' });
    expect(parsed.enableGlobalFilter).toBe(true);
    expect(parsed.selectionMode).toBe('multiple');
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) return;
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      dataTable?: Record<string, boolean>;
    };
    expect(coverage.dataTable?.coreTable).toBe(true);
    expect(coverage.dataTable?.sorting).toBe(true);
    expect(coverage.dataTable?.globalFilter).toBe(true);
  });
});
