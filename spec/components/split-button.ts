import { z } from 'zod';

/**
 * Neutral API contract for SplitButton component.
 */
export const splitButtonItemSchema = z.object({
  key: z.string(),
  label: z.union([z.string(), z.any()]),
  disabled: z.boolean().default(false),
  title: z.string().optional(),
  separator: z.boolean().default(false),
});

export const splitButtonSchema = z.object({
  disabled: z.boolean().default(false),
  size: z.enum(['default', 'sm', 'xs', 'lg']).default('default'),
  variant: z.enum(['default', 'outline', 'ghost', 'destructive', 'secondary']).default('default'),
  title: z.string().optional(),
  chevronAriaLabel: z.string().default('Show more options'),
});

export type SplitButtonItemApi = z.infer<typeof splitButtonItemSchema>;
export type SplitButtonApi = z.infer<typeof splitButtonSchema>;
