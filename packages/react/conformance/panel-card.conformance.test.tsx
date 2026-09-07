import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { panelCardSchema, panelCardHeaderSchema } from '@chahu/spec/panel-card';

describe('PanelCard conformance (spec contract)', () => {
  it('accepts valid fixtures that satisfy spec contract', () => {
    expect(() => panelCardSchema.parse({ size: 'default' })).not.toThrow();
    expect(() => panelCardSchema.parse({ size: 'sm' })).not.toThrow();
    expect(() => panelCardHeaderSchema.parse({ tinted: true })).not.toThrow();
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) return;
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      panelCard?: Record<string, boolean>;
    };
    expect(coverage.panelCard?.container).toBe(true);
    expect(coverage.panelCard?.tintedHeader).toBe(true);
  });
});
