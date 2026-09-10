import { z } from 'zod';

/**
 * Neutral API contract for the Label component.
 * Single source of truth for Label public surface across all stacks.
 */
export const labelSizeSchema = z.enum(['default', 'sm']);

export const labelSchema = z.object({
  size: labelSizeSchema.default('default'),
  disabled: z.boolean().default(false),
  required: z.boolean().default(false),
  optional: z.boolean().default(false),
  invalid: z.boolean().default(false),
  description: z.string().optional(),
  tooltip: z.string().optional(),
  htmlFor: z.string().optional(),
  className: z.string().optional(),
});

export type LabelApi = z.infer<typeof labelSchema>;
export type LabelSize = z.infer<typeof labelSizeSchema>;
