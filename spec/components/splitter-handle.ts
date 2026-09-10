import { z } from 'zod';

/**
 * Neutral API contract for the SplitterHandle component.
 * Single source of truth for edge resize handles with reference item coordinate stabilization.
 */
export const splitterEdgeSchema = z.enum(['left', 'right', 'top', 'bottom']);

export const splitterHandleSchema = z.object({
  edge: splitterEdgeSchema.default('left'),
  targetSize: z.number().default(200),
  minSize: z.number().default(100),
  maxSize: z.number().default(1000),
  defaultSize: z.number().optional(),
  liveUpdate: z.boolean().default(true),
  hitThickness: z.number().default(6),
  visualThickness: z.number().default(1),
  activeVisualThickness: z.number().default(2),
  disabled: z.boolean().default(false),
});

export type SplitterEdge = z.infer<typeof splitterEdgeSchema>;
export type SplitterHandleApi = z.infer<typeof splitterHandleSchema>;
