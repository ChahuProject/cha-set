import { z } from 'zod';

/**
 * Neutral API contract for the DropdownMenu component.
 * Single source of truth for DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
 * DropdownMenuItem, DropdownMenuGroup, DropdownMenuCheckboxItem, DropdownMenuRadioGroup,
 * DropdownMenuRadioItem, DropdownMenuSub, and related public surfaces across all stacks.
 */
export const dropdownMenuAlignSchema = z.enum(['start', 'center', 'end']);
export const dropdownMenuSideSchema = z.enum(['top', 'bottom', 'left', 'right']);
export const dropdownMenuItemVariantSchema = z.enum(['default', 'destructive']);

export const dropdownMenuSchema = z.object({
  open: z.boolean().optional(),
  defaultOpen: z.boolean().default(false),
  onOpenChange: z.function().optional(),
  modal: z.boolean().default(true),
});

export const dropdownMenuTriggerSchema = z.object({
  asChild: z.boolean().default(false),
  disabled: z.boolean().default(false),
});

export const dropdownMenuContentSchema = z.object({
  align: dropdownMenuAlignSchema.default('start'),
  side: dropdownMenuSideSchema.default('bottom'),
  sideOffset: z.number().default(4),
  alignOffset: z.number().default(0),
  collisionPadding: z.number().optional(),
});

export const dropdownMenuItemSchema = z.object({
  disabled: z.boolean().default(false),
  variant: dropdownMenuItemVariantSchema.default('default'),
  inset: z.boolean().default(false),
});

export const dropdownMenuCheckboxItemSchema = z.object({
  checked: z.union([z.boolean(), z.literal('indeterminate')]).optional(),
  defaultChecked: z.boolean().optional(),
  disabled: z.boolean().default(false),
  inset: z.boolean().default(false),
});

export const dropdownMenuRadioItemSchema = z.object({
  value: z.string().optional(),
  disabled: z.boolean().default(false),
  inset: z.boolean().default(false),
});

export const dropdownMenuGroupSchema = z.object({});
export const dropdownMenuLabelSchema = z.object({
  inset: z.boolean().default(false),
});
export const dropdownMenuSeparatorSchema = z.object({});
export const dropdownMenuShortcutSchema = z.object({});
export const dropdownMenuSubSchema = z.object({
  open: z.boolean().optional(),
  defaultOpen: z.boolean().default(false),
});
export const dropdownMenuSubTriggerSchema = z.object({
  disabled: z.boolean().default(false),
  inset: z.boolean().default(false),
  showChevron: z.boolean().default(true),
});
export const dropdownMenuSubContentSchema = z.object({
  alignOffset: z.number().default(0),
  sideOffset: z.number().default(0),
});

export type DropdownMenuApi = z.infer<typeof dropdownMenuSchema>;
export type DropdownMenuTriggerApi = z.infer<typeof dropdownMenuTriggerSchema>;
export type DropdownMenuContentApi = z.infer<typeof dropdownMenuContentSchema>;
export type DropdownMenuItemApi = z.infer<typeof dropdownMenuItemSchema>;
export type DropdownMenuCheckboxItemApi = z.infer<typeof dropdownMenuCheckboxItemSchema>;
export type DropdownMenuRadioItemApi = z.infer<typeof dropdownMenuRadioItemSchema>;
export type DropdownMenuGroupApi = z.infer<typeof dropdownMenuGroupSchema>;
export type DropdownMenuLabelApi = z.infer<typeof dropdownMenuLabelSchema>;
export type DropdownMenuSeparatorApi = z.infer<typeof dropdownMenuSeparatorSchema>;
export type DropdownMenuShortcutApi = z.infer<typeof dropdownMenuShortcutSchema>;
export type DropdownMenuSubApi = z.infer<typeof dropdownMenuSubSchema>;
export type DropdownMenuSubTriggerApi = z.infer<typeof dropdownMenuSubTriggerSchema>;
export type DropdownMenuSubContentApi = z.infer<typeof dropdownMenuSubContentSchema>;
