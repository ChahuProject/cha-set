import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { resizableSchema } from '@chahu/spec/resizable';

describe('Resizable conformance (spec contract)', () => {
  it('accepts valid fixtures that satisfy spec contract', () => {
    expect(() => resizableSchema.parse({})).not.toThrow();
    const parsed = resizableSchema.parse({
      direction: 'vertical',
      withHandle: true,
      className: 'custom-class',
    });
    expect(parsed.direction).toBe('vertical');
    expect(parsed.withHandle).toBe(true);
    expect(parsed.className).toBe('custom-class');
  });

  it('uses default values for optional/defaulted fields', () => {
    const parsed = resizableSchema.parse({});
    expect(parsed.direction).toBe('horizontal');
    expect(parsed.withHandle).toBe(false);
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) return;
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      resizable?: Record<string, boolean>;
    };
    expect(coverage.resizable?.panelGroup).toBe(true);
    expect(coverage.resizable?.panelResize).toBe(true);
    expect(coverage.resizable?.handleDrag).toBe(true);
    expect(coverage.resizable?.collapsible).toBe(true);
  });
});
