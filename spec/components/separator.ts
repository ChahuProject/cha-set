import { z } from 'zod';

/**
 * Neutral API contract for the Separator (divider) component.
 * Single source of truth for Separator public surface across all stacks.
 */
export const separatorOrientationSchema = z.enum(['horizontal', 'vertical']);
export const separatorVariantSchema = z.enum(['solid', 'dashed', 'dotted']);
export const separatorLabelPositionSchema = z.enum(['left', 'center', 'right']);

export const separatorSchema = z.object({
  orientation: separatorOrientationSchema.default('horizontal'),
  decorative: z.boolean().default(true),
  variant: separatorVariantSchema.default('solid'),
  label: z.string().optional(),
  labelPosition: separatorLabelPositionSchema.default('center'),
});

export type SeparatorApi = z.infer<typeof separatorSchema>;
export type SeparatorOrientation = z.infer<typeof separatorOrientationSchema>;
export type SeparatorVariant = z.infer<typeof separatorVariantSchema>;
export type SeparatorLabelPosition = z.infer<typeof separatorLabelPositionSchema>;
