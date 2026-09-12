import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { codeBlockSchema, codeBlockFileSchema } from '@chahu/spec/code-block';

describe('CodeBlock conformance (spec contract)', () => {
  it('accepts a minimal fixture and applies documented defaults', () => {
    expect(() => codeBlockSchema.parse({ code: 'const x = 1' })).not.toThrow();

    const parsed = codeBlockSchema.parse({ code: 'const x = 1' });
    expect(parsed.language).toBe('tsx');
    expect(parsed.highlight).toBe(true);
    expect(parsed.showLineNumbers).toBe(false);
    expect(parsed.showLanguage).toBe(true);
    expect(parsed.showCopy).toBe(true);
    expect(parsed.wrap).toBe(false);
    expect(parsed.embedded).toBe(false);
    expect(parsed.maxHeight).toBeUndefined();
    expect(parsed.files).toBeUndefined();
  });

  it('defaults code to empty string when omitted', () => {
    expect(codeBlockSchema.parse({}).code).toBe('');
  });

  it('accepts multi-file tab groups with per-file language overrides', () => {
    const fixture = {
      files: [
        { name: 'Button.tsx', code: 'export const Button = () => null;' },
        { name: 'helper.js', code: 'export const noop = () => {};', language: 'js' },
      ],
      showLineNumbers: true,
      maxHeight: 400,
    };
    const parsed = codeBlockSchema.parse(fixture);
    expect(parsed.files).toHaveLength(2);
    expect(parsed.files?.[1]?.language).toBe('js');
    expect(parsed.showLineNumbers).toBe(true);
    expect(parsed.maxHeight).toBe(400);
  });

  it('accepts both numeric and string maxHeight', () => {
    expect(codeBlockSchema.parse({ code: '', maxHeight: 320 }).maxHeight).toBe(320);
    expect(codeBlockSchema.parse({ code: '', maxHeight: '24rem' }).maxHeight).toBe('24rem');
  });

  it('rejects a malformed file entry', () => {
    expect(() => codeBlockFileSchema.parse({ name: 'a.ts' })).toThrow();
    expect(() => codeBlockSchema.parse({ code: '', files: [{ name: 'a.ts' }] })).toThrow();
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) return;
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      codeBlock?: Record<string, boolean>;
    };
    expect(coverage.codeBlock?.code).toBe(true);
    expect(coverage.codeBlock?.syntaxHighlight).toBe(true);
    expect(coverage.codeBlock?.copy).toBe(true);
    expect(coverage.codeBlock?.languageLabel).toBe(true);
  });
});
