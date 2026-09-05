import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { inputSchema } from '@chahu/spec/input';

describe('Input conformance (spec contract)', () => {
  it('accepts a props fixture that satisfies the spec contract', () => {
    const fixture = {
      type: 'text',
      size: 'default',
      disabled: false,
    } as const;
    expect(() => inputSchema.parse(fixture)).not.toThrow();

    for (const t of ['text', 'password', 'email', 'search', 'number', 'tel', 'url'] as const) {
      expect(() => inputSchema.parse({ type: t })).not.toThrow();
    }
    for (const s of ['default', 'sm'] as const) {
      expect(() => inputSchema.parse({ size: s })).not.toThrow();
    }
  });

  it('rejects unknown types per the contract', () => {
    expect(() => inputSchema.parse({ type: 'invalid-type' })).toThrow();
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) {
      console.warn('[conformance] coverage.json not present yet; skipping earned-capability assertions');
      return;
    }
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      input?: Record<string, boolean>;
    };
    for (const cap of ['textInput', 'size', 'disabled', 'placeholder', 'focusRing'] as const) {
      expect(coverage.input?.[cap], `capability "${cap}" must be earned`).toBe(true);
    }
  });
});
