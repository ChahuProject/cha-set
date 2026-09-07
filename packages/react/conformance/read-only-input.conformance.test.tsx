import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { readOnlyInputSchema } from '@chahu/spec/read-only-input';

describe('ReadOnlyInput conformance (spec contract)', () => {
  it('accepts valid fixtures that satisfy spec contract', () => {
    expect(() =>
      readOnlyInputSchema.parse({
        value: 'text to copy',
        colorScheme: 'warning',
      }),
    ).not.toThrow();

    const parsed = readOnlyInputSchema.parse({ value: 'val' });
    expect(parsed.copyHint).toBe('Copy');
    expect(parsed.colorScheme).toBe('default');
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) return;
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      readOnlyInput?: Record<string, boolean>;
    };
    expect(coverage.readOnlyInput?.readOnlyValue).toBe(true);
    expect(coverage.readOnlyInput?.copyTrigger).toBe(true);
  });
});
