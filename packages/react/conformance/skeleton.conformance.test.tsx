import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { skeletonSchema } from '@chahu/spec/skeleton';

describe('Skeleton conformance (spec contract)', () => {
  it('accepts a props fixture that satisfies the spec contract', () => {
    const fixture = {
      animate: true,
      animation: 'wave',
      rounded: 'md',
    } as const;
    expect(() => skeletonSchema.parse(fixture)).not.toThrow();

    const defaultParsed = skeletonSchema.parse({});
    expect(defaultParsed.animate).toBe(true);
    expect(defaultParsed.animation).toBe('pulse');
    expect(defaultParsed.rounded).toBe('md');
  });

  it('rejects invalid types per the contract', () => {
    expect(() => skeletonSchema.parse({ rounded: 'huge' })).toThrow();
    expect(() => skeletonSchema.parse({ animation: 'bounce' })).toThrow();
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) return;
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      skeleton?: Record<string, boolean>;
    };
    expect(coverage.skeleton?.pulse).toBe(true);
    expect(coverage.skeleton?.wave).toBe(true);
    expect(coverage.skeleton?.customClass).toBe(true);
  });
});
