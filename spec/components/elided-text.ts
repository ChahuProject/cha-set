import { z } from 'zod';

/**
 * Neutral API contract for the ElidedText component.
 * Single source of truth for truncation detection and conditional tooltip reveal.
 */
export const tooltipPlacementSchema = z.enum(['top', 'bottom', 'left', 'right', 'auto']);

export const elidedTextSchema = z.object({
  text: z.string(),
  tooltipText: z.string().optional(),
  tooltipPlacement: tooltipPlacementSchema.default('top'),
  tooltipDelay: z.number().default(400),
  alwaysShowTooltip: z.boolean().default(false),
  showTooltipWhenElided: z.boolean().default(true),
  maxLines: z.number().default(1),
});

export type TooltipPlacement = z.infer<typeof tooltipPlacementSchema>;
export type ElidedTextApi = z.infer<typeof elidedTextSchema>;
