import { z } from 'zod';

/**
 * Neutral API contract for the SegmentedControl component.
 * Single source of truth for SegmentedControl across React and Qt.
 */
export const segmentedControlOptionTooltipSchema = z.object({
  content: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  shortcut: z.string().optional(),
  side: z.enum(['top', 'bottom', 'left', 'right']).optional(),
  align: z.enum(['start', 'center', 'end']).optional(),
  sideOffset: z.number().optional(),
  arrow: z.boolean().optional(),
  delayDuration: z.number().optional(),
  disabled: z.boolean().optional(),
  className: z.string().optional(),
});

export const segmentedControlOptionSchema = z.object({
  label: z.string(),
  value: z.union([z.string(), z.number()]),
  icon: z.string().optional(),
  badge: z.union([z.string(), z.number()]).optional(),
  disabled: z.boolean().default(false),
  tooltip: z.union([z.string(), segmentedControlOptionTooltipSchema]).optional(),
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
  equalWidth: z.boolean().default(false),
  itemWidth: z.number().optional(),
  tooltipSide: z.enum(['top', 'bottom', 'left', 'right']).optional(),
  tooltipDelayDuration: z.number().optional(),
});

export type SegmentedControlOptionTooltip = z.infer<typeof segmentedControlOptionTooltipSchema>;
export type SegmentedControlOption = z.infer<typeof segmentedControlOptionSchema>;
export type SegmentedControlSize = z.infer<typeof segmentedControlSizeSchema>;
export type SegmentedControlApi = z.infer<typeof segmentedControlSchema>;

