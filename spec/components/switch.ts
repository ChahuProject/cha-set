import { z } from 'zod';

/**
 * Neutral API contract for the Switch component.
 * Single source of truth for Switch public surface across all stacks.
 */
export const switchSizeSchema = z.enum(['default', 'sm']);

export const switchSchema = z.object({
  checked: z.boolean().default(false),
  defaultChecked: z.boolean().optional(),
  disabled: z.boolean().default(false),
  readOnly: z.boolean().default(false),
  loading: z.boolean().default(false),
  size: switchSizeSchema.default('default'),
  label: z.string().optional(),
  description: z.string().optional(),
  id: z.string().optional(),
  name: z.string().optional(),
});

export type SwitchApi = z.infer<typeof switchSchema>;
export type SwitchSize = z.infer<typeof switchSizeSchema>;
