import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { virtualGridSchema } from '@chahu/spec/virtual-grid';

describe('VirtualGrid conformance (spec contract)', () => {
  it('accepts valid fixtures that satisfy spec contract', () => {
    expect(() => virtualGridSchema.parse({})).not.toThrow();
    const parsed = virtualGridSchema.parse({ minColumnWidthRem: 14 });
    expect(parsed.minColumnWidthRem).toBe(14);
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) return;
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      virtualGrid?: Record<string, boolean>;
    };
    expect(coverage.virtualGrid?.responsiveColumns).toBe(true);
    expect(coverage.virtualGrid?.rowVirtualization).toBe(true);
  });
});
