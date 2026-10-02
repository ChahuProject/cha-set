import { z } from 'zod';

/**
 * Neutral API contract for MediaProgressBar component.
 * Single source of truth for MediaProgressBar public surface across all stacks.
 */
export const mediaProgressBarTimingModeSchema = z.enum(['elapsed', 'remaining']);
export const mediaProgressBarTimeFormatSchema = z.enum(['hms', 'seconds', 'frames']);

export const mediaProgressBarSchema = z.object({
  ratio: z.number().default(0),
  position: z.number().default(0),
  duration: z.number().default(0),
  frameRate: z.number().default(30),
  timingMode: mediaProgressBarTimingModeSchema.default('elapsed'),
  timeFormat: mediaProgressBarTimeFormatSchema.default('hms'),
  showTime: z.boolean().default(true),
  showThumb: z.boolean().default(true),
  interactive: z.boolean().default(true),
  disabled: z.boolean().default(false),
  dragging: z.boolean().default(false),
  hoverActive: z.boolean().default(false),
  hoverRatio: z.number().default(-1),
});

export type MediaProgressBarApi = z.infer<typeof mediaProgressBarSchema>;
export type MediaProgressBarTimingMode = z.infer<typeof mediaProgressBarTimingModeSchema>;
export type MediaProgressBarTimeFormat = z.infer<typeof mediaProgressBarTimeFormatSchema>;
