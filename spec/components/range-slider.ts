import { z } from 'zod';

/**
 * Neutral API contract for RangeSlider component.
 */
export const rangeSliderSchema = z.object({
  min: z.number().default(0),
  max: z.number().default(100),
  step: z.number().optional(),
  disabled: z.boolean().default(false),
  ariaLabel: z.string().optional(),
});

export type RangeSliderApi = z.infer<typeof rangeSliderSchema>;
