import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { inlineEditableTextSchema } from '@chahu/spec/inline-editable-text';

describe('InlineEditableText conformance (spec contract)', () => {
  it('accepts valid fixtures that satisfy spec contract', () => {
    expect(() =>
      inlineEditableTextSchema.parse({
        value: 'Title',
        placeholder: 'Enter title',
      }),
    ).not.toThrow();
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) return;
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      inlineEditableText?: Record<string, boolean>;
    };
    expect(coverage.inlineEditableText?.displayMode).toBe(true);
    expect(coverage.inlineEditableText?.editMode).toBe(true);
    expect(coverage.inlineEditableText?.cancel).toBe(true);
  });
});
