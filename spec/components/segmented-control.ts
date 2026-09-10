import { z } from 'zod';

/**
 * Neutral API contract for the SegmentedControl component.
 * Single source of truth for SegmentedControl across React and Qt.
 */
export const segmentedControlOptionSchema = z.object({
  label: z.string(),
  value: z.union([z.string(), z.number()]),
  icon: z.string().optional(),
  badge: z.union([z.string(), z.number()]).optional(),
  disabled: z.boolean().default(false),
});

export const segmentedControlSizeSchema = z.enum(['sm', 'default', 'lg']);

export const segmentedControlSchema = z.object({
  options: z.array(segmentedControlOptionSchema).min(1),
  value: z.union([z.string(), z.number()]).optional(),
  defaultValue: z.union([z.string(), z.number()]).optional(),
  size: segmentedControlSizeSchema.default('default'),
  disabled: z.boolean().default(false),
  title: z.string().optional(),
  fullWidth: z.boolean().default(false),
});

export type SegmentedControlOption = z.infer<typeof segmentedControlOptionSchema>;
export type SegmentedControlSize = z.infer<typeof segmentedControlSizeSchema>;
export type SegmentedControlApi = z.infer<typeof segmentedControlSchema>;
