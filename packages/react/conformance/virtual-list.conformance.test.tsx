import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { virtualListSchema } from '@chahu/spec/virtual-list';

describe('VirtualList conformance (spec contract)', () => {
  it('accepts valid fixtures that satisfy spec contract', () => {
    expect(() => virtualListSchema.parse({})).not.toThrow();
    const parsed = virtualListSchema.parse({ estimateSize: 40 });
    expect(parsed.estimateSize).toBe(40);
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) return;
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      virtualList?: Record<string, boolean>;
    };
    expect(coverage.virtualList?.virtualWindow).toBe(true);
    expect(coverage.virtualList?.scrollToIndex).toBe(true);
  });
});
