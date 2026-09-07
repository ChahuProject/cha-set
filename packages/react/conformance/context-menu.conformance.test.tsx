import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  contextMenuSchema,
  contextMenuTriggerSchema,
  contextMenuContentSchema,
  contextMenuItemSchema,
  contextMenuGroupSchema,
  contextMenuLabelSchema,
  contextMenuSeparatorSchema,
  contextMenuCheckboxItemSchema,
  contextMenuRadioItemSchema,
  contextMenuShortcutSchema,
  contextMenuSubSchema,
  contextMenuSubTriggerSchema,
  contextMenuSubContentSchema,
} from '@chahu/spec/context-menu';

describe('ContextMenu conformance (spec contract)', () => {
  it('accepts a props fixture that satisfies the spec contract', () => {
    const rootFixture = {
      open: false,
      defaultOpen: false,
      modal: true,
    } as const;
    expect(() => contextMenuSchema.parse(rootFixture)).not.toThrow();

    expect(() => contextMenuTriggerSchema.parse({ asChild: false, disabled: false })).not.toThrow();
    expect(() => contextMenuContentSchema.parse({ alignOffset: 0, collisionPadding: 8 })).not.toThrow();
    expect(() => contextMenuItemSchema.parse({ disabled: false, variant: 'default', inset: false })).not.toThrow();
    expect(() => contextMenuGroupSchema.parse({})).not.toThrow();
    expect(() => contextMenuLabelSchema.parse({ inset: false })).not.toThrow();
    expect(() => contextMenuSeparatorSchema.parse({})).not.toThrow();
    expect(() => contextMenuCheckboxItemSchema.parse({ checked: false, disabled: false, inset: false })).not.toThrow();
    expect(() => contextMenuRadioItemSchema.parse({ value: 'v1', disabled: false, inset: false })).not.toThrow();
    expect(() => contextMenuShortcutSchema.parse({})).not.toThrow();
    expect(() => contextMenuSubSchema.parse({ defaultOpen: false })).not.toThrow();
    expect(() => contextMenuSubTriggerSchema.parse({ disabled: false, inset: false, showChevron: true })).not.toThrow();
    expect(() => contextMenuSubContentSchema.parse({})).not.toThrow();
  });

  it('rejects invalid types per the contract', () => {
    expect(() => contextMenuItemSchema.parse({ variant: 'warn' })).toThrow();
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) return;
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      contextMenu?: Record<string, boolean>;
    };
    expect(coverage.contextMenu?.trigger).toBe(true);
    expect(coverage.contextMenu?.items).toBe(true);
  });
});
