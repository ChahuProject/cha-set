import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { virtualTreeSchema } from '@chahu/spec/virtual-tree';

describe('VirtualTree conformance (spec contract)', () => {
  it('accepts valid fixtures that satisfy spec contract', () => {
    expect(() => virtualTreeSchema.parse({})).not.toThrow();
    const parsed = virtualTreeSchema.parse({ defaultExpandDepth: 1 });
    expect(parsed.defaultExpandDepth).toBe(1);
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) return;
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      virtualTree?: Record<string, boolean>;
    };
    expect(coverage.virtualTree?.hierarchicalFlattening).toBe(true);
    expect(coverage.virtualTree?.toggleExpand).toBe(true);
  });
});
