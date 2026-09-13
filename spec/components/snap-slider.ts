import { z } from 'zod';

/**
 * Neutral API contract for the SnapSlider component.
 * Single source of truth for SnapSlider public surface across all stacks.
 */
export const snapSliderSizeSchema = z.enum(['default', 'sm']);

export const snapSliderSchema = z.object({
  value: z.number().optional(),
  defaultValue: z.number().default(0),
  count: z.number().default(5),
  labels: z.array(z.string()).default([]),
  leftLabel: z.string().default(''),
  rightLabel: z.string().default(''),
  showTicks: z.boolean().default(true),
  disabled: z.boolean().default(false),
  readOnly: z.boolean().default(false),
  size: snapSliderSizeSchema.default('default'),
});

export type SnapSliderApi = z.infer<typeof snapSliderSchema>;
export type SnapSliderSize = z.infer<typeof snapSliderSizeSchema>;
