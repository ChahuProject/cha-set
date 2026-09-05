import { z } from 'zod';

/**
 * Neutral API contract for the Checkbox component.
 * Single source of truth for Checkbox public surface across all stacks.
 */
export const checkboxSizeSchema = z.enum(['default', 'sm']);

export const checkboxSchema = z.object({
  checked: z.boolean().default(false),
  indeterminate: z.boolean().default(false),
  disabled: z.boolean().default(false),
  size: checkboxSizeSchema.default('default'),
  label: z.string().optional(),
  id: z.string().optional(),
  name: z.string().optional(),
  value: z.string().optional(),
});

export type CheckboxApi = z.infer<typeof checkboxSchema>;
export type CheckboxSize = z.infer<typeof checkboxSizeSchema>;
