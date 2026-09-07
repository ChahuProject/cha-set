import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { viewportConstrainedContainerSchema } from '@chahu/spec/viewport-constrained-container';

describe('ViewportConstrainedContainer conformance (spec contract)', () => {
  it('accepts valid fixtures that satisfy spec contract', () => {
    expect(() =>
      viewportConstrainedContainerSchema.parse({
        maxHeight: 400,
        margin: 20,
        overflow: 'scroll',
        className: 'custom-class',
      }),
    ).not.toThrow();

    const parsed = viewportConstrainedContainerSchema.parse({});
    expect(parsed.margin).toBe(16);
    expect(parsed.overflow).toBe('auto');
    expect(parsed.maxHeight).toBeUndefined();
    expect(parsed.className).toBeUndefined();
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) return;
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      viewportConstrainedContainer?: Record<string, boolean>;
    };
    expect(coverage.viewportConstrainedContainer?.viewportMeasure).toBe(true);
    expect(coverage.viewportConstrainedContainer?.maxHeightOverride).toBe(true);
    expect(coverage.viewportConstrainedContainer?.overflowScroll).toBe(true);
  });
});
