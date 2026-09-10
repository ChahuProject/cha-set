import { z } from 'zod';

/**
 * Neutral API contract for the Badge component.
 * Single source of truth for Badge public surface across all stacks.
 */
export const badgeVariantSchema = z.enum([
  'default',
  'secondary',
  'destructive',
  'outline',
  'ghost',
  'link',
]);

export const badgeSizeSchema = z.enum(['default', 'sm']);

export const badgeSchema = z.object({
  variant: badgeVariantSchema.default('default'),
  size: badgeSizeSchema.default('default'),
  dot: z.boolean().default(false),
  removable: z.boolean().default(false),
  interactive: z.boolean().default(false),
});

export type BadgeApi = z.infer<typeof badgeSchema>;
export type BadgeVariant = z.infer<typeof badgeVariantSchema>;
export type BadgeSize = z.infer<typeof badgeSizeSchema>;
