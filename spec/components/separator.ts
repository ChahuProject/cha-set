import { z } from 'zod';

/**
 * Neutral API contract for the Separator (divider) component.
 * Single source of truth for Separator public surface across all stacks.
 */
export const separatorOrientationSchema = z.enum(['horizontal', 'vertical']);

export const separatorSchema = z.object({
  orientation: separatorOrientationSchema.default('horizontal'),
  decorative: z.boolean().default(true),
});

export type SeparatorApi = z.infer<typeof separatorSchema>;
export type SeparatorOrientation = z.infer<typeof separatorOrientationSchema>;
