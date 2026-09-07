import { z } from 'zod';

/**
 * Neutral API contract for the Select component.
 * Single source of truth for Select, SelectTrigger, SelectValue, SelectContent,
 * SelectItem, SelectGroup, SelectLabel, SelectSeparator, SelectScrollUpButton,
 * and SelectScrollDownButton public surfaces across all stacks.
 */
export const selectSizeSchema = z.enum(['default', 'sm']);
export const selectPositionSchema = z.enum(['item-aligned', 'popper']);
export const selectAlignSchema = z.enum(['start', 'center', 'end']);

export const selectSchema = z.object({
  value: z.string().nullable().optional(),
  defaultValue: z.string().nullable().optional(),
  open: z.boolean().optional(),
  defaultOpen: z.boolean().default(false),
  disabled: z.boolean().default(false),
  required: z.boolean().default(false),
  name: z.string().optional(),
  modal: z.boolean().default(false),
});

export const selectTriggerSchema = z.object({
  size: selectSizeSchema.default('default'),
  disabled: z.boolean().default(false),
});

export const selectValueSchema = z.object({
  placeholder: z.string().optional(),
});

export const selectContentSchema = z.object({
  position: selectPositionSchema.default('item-aligned'),
  align: selectAlignSchema.default('center'),
  sideOffset: z.number().default(4),
});

export const selectItemSchema = z.object({
  value: z.string(),
  disabled: z.boolean().default(false),
});

export const selectGroupSchema = z.object({});
export const selectLabelSchema = z.object({});
export const selectSeparatorSchema = z.object({});
export const selectScrollUpButtonSchema = z.object({});
export const selectScrollDownButtonSchema = z.object({});

export type SelectApi = z.infer<typeof selectSchema>;
export type SelectTriggerApi = z.infer<typeof selectTriggerSchema>;
export type SelectValueApi = z.infer<typeof selectValueSchema>;
export type SelectContentApi = z.infer<typeof selectContentSchema>;
export type SelectItemApi = z.infer<typeof selectItemSchema>;
export type SelectGroupApi = z.infer<typeof selectGroupSchema>;
export type SelectLabelApi = z.infer<typeof selectLabelSchema>;
export type SelectSeparatorApi = z.infer<typeof selectSeparatorSchema>;
export type SelectScrollUpButtonApi = z.infer<typeof selectScrollUpButtonSchema>;
export type SelectScrollDownButtonApi = z.infer<typeof selectScrollDownButtonSchema>;
