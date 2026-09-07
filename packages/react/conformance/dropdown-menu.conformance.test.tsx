import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  dropdownMenuSchema,
  dropdownMenuTriggerSchema,
  dropdownMenuContentSchema,
  dropdownMenuItemSchema,
  dropdownMenuCheckboxItemSchema,
  dropdownMenuRadioItemSchema,
  dropdownMenuGroupSchema,
  dropdownMenuLabelSchema,
  dropdownMenuSeparatorSchema,
  dropdownMenuShortcutSchema,
  dropdownMenuSubSchema,
  dropdownMenuSubTriggerSchema,
  dropdownMenuSubContentSchema,
} from '@chahu/spec/dropdown-menu';

describe('DropdownMenu conformance (spec contract)', () => {
  it('accepts a props fixture that satisfies the spec contract', () => {
    const rootFixture = {
      open: false,
      defaultOpen: false,
      modal: true,
    } as const;
    expect(() => dropdownMenuSchema.parse(rootFixture)).not.toThrow();

    expect(() => dropdownMenuTriggerSchema.parse({ asChild: false, disabled: false })).not.toThrow();
    expect(() => dropdownMenuContentSchema.parse({ align: 'start', side: 'bottom', sideOffset: 4 })).not.toThrow();
    expect(() => dropdownMenuItemSchema.parse({ disabled: false, variant: 'default', inset: false })).not.toThrow();
    expect(() => dropdownMenuCheckboxItemSchema.parse({ checked: true, disabled: false, inset: false })).not.toThrow();
    expect(() => dropdownMenuRadioItemSchema.parse({ value: 'opt1', disabled: false, inset: false })).not.toThrow();
    expect(() => dropdownMenuGroupSchema.parse({})).not.toThrow();
    expect(() => dropdownMenuLabelSchema.parse({ inset: false })).not.toThrow();
    expect(() => dropdownMenuSeparatorSchema.parse({})).not.toThrow();
    expect(() => dropdownMenuShortcutSchema.parse({})).not.toThrow();
    expect(() => dropdownMenuSubSchema.parse({ defaultOpen: false })).not.toThrow();
    expect(() => dropdownMenuSubTriggerSchema.parse({ disabled: false, inset: false, showChevron: true })).not.toThrow();
    expect(() => dropdownMenuSubContentSchema.parse({ alignOffset: 0, sideOffset: 0 })).not.toThrow();
  });

  it('rejects invalid types per the contract', () => {
    expect(() => dropdownMenuContentSchema.parse({ align: 'invalid-align' })).toThrow();
    expect(() => dropdownMenuItemSchema.parse({ variant: 'invalid-variant' })).toThrow();
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) return;
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      dropdownMenu?: Record<string, boolean>;
    };
    expect(coverage.dropdownMenu?.open).toBe(true);
    expect(coverage.dropdownMenu?.items).toBe(true);
    expect(coverage.dropdownMenu?.submenus).toBe(true);
  });
});
