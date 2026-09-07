import { z } from 'zod';

/**
 * Neutral API contract for the ContextMenu component.
 * Single source of truth for ContextMenu, ContextMenuTrigger, ContextMenuContent,
 * ContextMenuItem, ContextMenuGroup, ContextMenuLabel, ContextMenuSeparator,
 * ContextMenuCheckboxItem, ContextMenuRadioGroup, ContextMenuRadioItem,
 * ContextMenuShortcut, ContextMenuSub, ContextMenuSubTrigger, and ContextMenuSubContent.
 */
export const contextMenuItemVariantSchema = z.enum(['default', 'destructive']);

export const contextMenuSchema = z.object({
  open: z.boolean().optional(),
  defaultOpen: z.boolean().default(false),
  onOpenChange: z.function().optional(),
  modal: z.boolean().default(true),
});

export const contextMenuTriggerSchema = z.object({
  asChild: z.boolean().default(false),
  disabled: z.boolean().default(false),
});

export const contextMenuContentSchema = z.object({
  alignOffset: z.number().default(0),
  collisionPadding: z.number().default(8),
});

export const contextMenuItemSchema = z.object({
  disabled: z.boolean().default(false),
  variant: contextMenuItemVariantSchema.default('default'),
  inset: z.boolean().default(false),
});

export const contextMenuGroupSchema = z.object({});
export const contextMenuLabelSchema = z.object({
  inset: z.boolean().default(false),
});
export const contextMenuSeparatorSchema = z.object({});
export const contextMenuCheckboxItemSchema = z.object({
  checked: z.union([z.boolean(), z.literal('indeterminate')]).optional(),
  defaultChecked: z.boolean().optional(),
  disabled: z.boolean().default(false),
  inset: z.boolean().default(false),
});
export const contextMenuRadioItemSchema = z.object({
  value: z.string().optional(),
  disabled: z.boolean().default(false),
  inset: z.boolean().default(false),
});
export const contextMenuShortcutSchema = z.object({});
export const contextMenuSubSchema = z.object({
  open: z.boolean().optional(),
  defaultOpen: z.boolean().default(false),
});
export const contextMenuSubTriggerSchema = z.object({
  disabled: z.boolean().default(false),
  inset: z.boolean().default(false),
  showChevron: z.boolean().default(true),
});
export const contextMenuSubContentSchema = z.object({});

export type ContextMenuApi = z.infer<typeof contextMenuSchema>;
export type ContextMenuTriggerApi = z.infer<typeof contextMenuTriggerSchema>;
export type ContextMenuContentApi = z.infer<typeof contextMenuContentSchema>;
export type ContextMenuItemApi = z.infer<typeof contextMenuItemSchema>;
export type ContextMenuGroupApi = z.infer<typeof contextMenuGroupSchema>;
export type ContextMenuLabelApi = z.infer<typeof contextMenuLabelSchema>;
export type ContextMenuSeparatorApi = z.infer<typeof contextMenuSeparatorSchema>;
export type ContextMenuCheckboxItemApi = z.infer<typeof contextMenuCheckboxItemSchema>;
export type ContextMenuRadioItemApi = z.infer<typeof contextMenuRadioItemSchema>;
export type ContextMenuShortcutApi = z.infer<typeof contextMenuShortcutSchema>;
export type ContextMenuSubApi = z.infer<typeof contextMenuSubSchema>;
export type ContextMenuSubTriggerApi = z.infer<typeof contextMenuSubTriggerSchema>;
export type ContextMenuSubContentApi = z.infer<typeof contextMenuSubContentSchema>;
