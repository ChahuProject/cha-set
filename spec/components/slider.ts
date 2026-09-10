import { z } from 'zod';

/**
 * Neutral API contract for the Slider component.
 * Single source of truth for Slider public surface across all stacks.
 */
export const sliderOrientationSchema = z.enum(['horizontal', 'vertical']);
export const sliderSizeSchema = z.enum(['default', 'sm']);

export const sliderSchema = z.object({
  value: z.number().optional(),
  defaultValue: z.number().default(0),
  min: z.number().default(0),
  max: z.number().default(100),
  step: z.number().default(1),
  disabled: z.boolean().default(false),
  readOnly: z.boolean().default(false),
  size: sliderSizeSchema.default('default'),
  orientation: sliderOrientationSchema.default('horizontal'),
  showTicks: z.boolean().default(false),
  marks: z.array(z.string()).optional(),
  showTooltip: z.boolean().default(false),
});

export type SliderApi = z.infer<typeof sliderSchema>;
export type SliderOrientation = z.infer<typeof sliderOrientationSchema>;
export type SliderSize = z.infer<typeof sliderSizeSchema>;
