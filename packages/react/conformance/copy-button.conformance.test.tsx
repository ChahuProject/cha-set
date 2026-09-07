import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { copyButtonSchema } from '@chahu/spec/copy-button';

describe('CopyButton conformance (spec contract)', () => {
  it('accepts valid fixtures that satisfy spec contract', () => {
    const fixture = {
      text: 'hello',
      timeout: 2000,
    };
    expect(() => copyButtonSchema.parse(fixture)).not.toThrow();

    const parsed = copyButtonSchema.parse({ text: 'test' });
    expect(parsed.timeout).toBe(2000);
    expect(parsed.variant).toBe('ghost');
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) return;
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      copyButton?: Record<string, boolean>;
    };
    expect(coverage.copyButton?.copyText).toBe(true);
    expect(coverage.copyButton?.feedbackState).toBe(true);
  });
});
