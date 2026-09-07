import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { splitButtonSchema } from '@chahu/spec/split-button';

describe('SplitButton conformance (spec contract)', () => {
  it('accepts valid fixtures that satisfy spec contract', () => {
    expect(() => splitButtonSchema.parse({})).not.toThrow();
    const parsed = splitButtonSchema.parse({ size: 'sm', variant: 'outline' });
    expect(parsed.size).toBe('sm');
    expect(parsed.variant).toBe('outline');
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) return;
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      splitButton?: Record<string, boolean>;
    };
    expect(coverage.splitButton?.mainAction).toBe(true);
    expect(coverage.splitButton?.dropdownMenu).toBe(true);
    expect(coverage.splitButton?.separator).toBe(true);
  });
});
