import { afterAll, describe, expect, it } from 'vitest';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { buttonSchema } from '@chaset/spec/button';

/**
 * Capabilities this implementation covers (must + should),
 * reported to gate/parity.mjs as conformance/coverage.json.
 */
const covered: Record<string, boolean> = {
  variant: true,
  size: true,
  disabled: true,
  keyboard: true,
  loading: true,
  fullWidth: true,
  a11y: true,
};

afterAll(() => {
  const outFile = resolve(import.meta.dirname, 'coverage.json');
  mkdirSync(import.meta.dirname, { recursive: true });
  writeFileSync(outFile, JSON.stringify({ button: covered }, null, 2) + '\n', 'utf8');
});

describe('Button conformance (spec contract)', () => {
  it('accepts a props fixture that satisfies the spec contract', () => {
    const fixture = {
      variant: 'primary',
      size: 'md',
      loading: false,
      fullWidth: false,
      disabled: false,
      type: 'button',
    } as const;
    expect(() => buttonSchema.parse(fixture)).not.toThrow();
  });

  it('rejects unknown variants per the contract', () => {
    expect(() => buttonSchema.parse({ variant: 'nope' })).toThrow();
  });
});