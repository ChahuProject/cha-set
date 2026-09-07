import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { splitterSchema } from '@chahu/spec/splitter';

describe('Splitter conformance (spec contract)', () => {
  it('accepts valid fixtures that satisfy spec contract', () => {
    expect(() => splitterSchema.parse({})).not.toThrow();
    const parsed = splitterSchema.parse({ initialSize: 60 });
    expect(parsed.initialSize).toBe(60);
    expect(parsed.orientation).toBe('vertical');
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) return;
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      splitter?: Record<string, boolean>;
    };
    expect(coverage.splitter?.dragResize).toBe(true);
    expect(coverage.splitter?.doubleClickReset).toBe(true);
  });
});
