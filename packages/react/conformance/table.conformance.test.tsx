import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  tableSchema,
  tableColumnSchema,
  tableColumnAlignSchema,
} from '@chahu/spec/table';

describe('Table conformance (spec contract)', () => {
  it('accepts a props fixture that satisfies the spec contract', () => {
    const fixture = {
      columns: [
        { key: 'invoice', title: 'Invoice', width: 100, align: 'left' },
        { key: 'status', title: 'Status', align: 'center' },
        { key: 'amount', title: 'Amount', width: 120, align: 'right' },
      ],
      rows: [
        { invoice: 'INV-001', status: 'Paid', amount: '$250.00' },
        { invoice: 'INV-002', status: 'Pending', amount: '$150.00' },
      ],
      caption: 'A list of your recent invoices.',
    } as const;

    expect(() => tableSchema.parse(fixture)).not.toThrow();

    const parsed = tableSchema.parse(fixture);
    expect(parsed.columns).toHaveLength(3);
    expect(parsed.rows).toHaveLength(2);
    expect(parsed.caption).toBe('A list of your recent invoices.');
  });

  it('accepts minimal table configurations and defaults', () => {
    expect(() => tableSchema.parse({})).not.toThrow();
    expect(() => tableSchema.parse({ columns: [], rows: [] })).not.toThrow();
  });

  it('validates column schemas and alignments', () => {
    for (const align of ['left', 'center', 'right'] as const) {
      expect(() => tableColumnAlignSchema.parse(align)).not.toThrow();
      expect(() =>
        tableColumnSchema.parse({
          key: 'test',
          title: 'Test',
          align,
        })
      ).not.toThrow();
    }

    expect(() =>
      tableColumnSchema.parse({
        key: 'invalid',
        title: 'Invalid Align',
        align: 'justified',
      })
    ).toThrow();
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) {
      console.warn('[conformance] coverage.json not present yet; skipping earned-capability assertions');
      return;
    }
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      table?: Record<string, boolean>;
    };
    if (!coverage.table) {
      console.warn('[conformance] coverage.json has no table entry yet; skipping earned-capability assertions');
      return;
    }
    for (const cap of ['header', 'body', 'row', 'cell', 'alignment'] as const) {
      expect(coverage.table?.[cap], `capability "${cap}" must be earned`).toBe(true);
    }
  });
});
