import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { windowTitleBarSchema } from '@chahu/spec/window-title-bar';

describe('WindowTitleBar conformance (spec contract)', () => {
  it('accepts valid fixtures that satisfy spec contract', () => {
    expect(() => windowTitleBarSchema.parse({})).not.toThrow();
    const parsed = windowTitleBarSchema.parse({ title: 'ChaSet' });
    expect(parsed.title).toBe('ChaSet');
    expect(parsed.isMaximized).toBe(false);
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) return;
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      windowTitleBar?: Record<string, boolean>;
    };
    expect(coverage.windowTitleBar?.captionButtons).toBe(true);
    expect(coverage.windowTitleBar?.doubleClickMaximize).toBe(true);
  });
});
