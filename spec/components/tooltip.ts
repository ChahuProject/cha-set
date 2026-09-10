import { z } from 'zod';

/**
 * Neutral API contract for the Tooltip component.
 * Single source of truth for Tooltip public surface across all stacks.
 */
export const tooltipSideSchema = z.enum(['top', 'bottom', 'left', 'right']);
export const tooltipAlignSchema = z.enum(['start', 'center', 'end']);

export const tooltipSchema = z.object({
  content: z.string().default(''),
  side: tooltipSideSchema.default('top'),
  align: tooltipAlignSchema.default('center'),
  sideOffset: z.number().default(4),
  delayDuration: z.number().default(200),
  disabled: z.boolean().default(false),
  shortcut: z.string().optional(),
  arrow: z.boolean().default(false),
});

export type TooltipApi = z.infer<typeof tooltipSchema>;
export type TooltipSide = z.infer<typeof tooltipSideSchema>;
export type TooltipAlign = z.infer<typeof tooltipAlignSchema>;
