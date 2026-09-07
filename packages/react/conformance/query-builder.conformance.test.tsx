import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { queryBuilderSchema, queryConditionSchema, queryGroupSchema } from '@chahu/spec/query-builder';

describe('QueryBuilder conformance (spec contract)', () => {
  it('accepts valid fixtures that satisfy spec contract', () => {
    expect(() => queryBuilderSchema.parse({})).not.toThrow();
    expect(() =>
      queryConditionSchema.parse({
        id: 'c1',
        field: 'title',
        operator: 'equals',
        value: 'test',
      }),
    ).not.toThrow();

    expect(() =>
      queryGroupSchema.parse({
        id: 'g1',
        connector: 'and',
        children: [],
      }),
    ).not.toThrow();
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) return;
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      queryBuilder?: Record<string, boolean>;
    };
    expect(coverage.queryBuilder?.conditionTree).toBe(true);
    expect(coverage.queryBuilder?.operatorMatching).toBe(true);
  });
});
