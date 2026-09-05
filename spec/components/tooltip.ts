import { z } from 'zod';

/**
 * Neutral API contract for the Tooltip component.
 * Single source of truth for Tooltip public surface across all stacks.
 */
export const tooltipSideSchema = z.enum(['top', 'bottom', 'left', 'right']);

export const tooltipSchema = z.object({
  content: z.string().default(''),
  side: tooltipSideSchema.default('top'),
  delayDuration: z.number().default(200),
  disabled: z.boolean().default(false),
});

export type TooltipApi = z.infer<typeof tooltipSchema>;
export type TooltipSide = z.infer<typeof tooltipSideSchema>;
