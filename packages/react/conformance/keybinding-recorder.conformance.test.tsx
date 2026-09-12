import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { keybindingRecorderSchema } from '@chahu/spec/keybinding-recorder';

describe('KeybindingRecorder conformance (spec contract)', () => {
  it('accepts valid fixtures that satisfy spec contract', () => {
    expect(() =>
      keybindingRecorderSchema.parse({
        value: {
          ctrl: true,
          alt: false,
          shift: true,
          meta: false,
          code: 'KeyK',
        },
      }),
    ).not.toThrow();

    const parsed = keybindingRecorderSchema.parse({
      value: { code: 'KeyA' },
    });
    expect(parsed.placeholder).toBe('No keybinding set');
    // `value` accepts either a serialized string or a modifier object.
    if (typeof parsed.value === 'string') throw new Error('expected an object keybinding value');
    expect(parsed.value.ctrl).toBe(false);
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) return;
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      keybindingRecorder?: Record<string, boolean>;
    };
    expect(coverage.keybindingRecorder?.recordMode).toBe(true);
    expect(coverage.keybindingRecorder?.modifierBadges).toBe(true);
    expect(coverage.keybindingRecorder?.clear).toBe(true);
  });
});
