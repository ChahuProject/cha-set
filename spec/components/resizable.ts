import { z } from 'zod';

/**
 * Neutral API contract for Resizable component group.
 */
export const resizableSchema = z.object({
  direction: z.enum(['horizontal', 'vertical']).default('horizontal'),
  withHandle: z.boolean().default(false),
  className: z.string().optional(),
});

export type ResizableApi = z.infer<typeof resizableSchema>;

/**
 * Backward-compatible schemas for components merged into Resizable.
 */
export const splitterSchema = resizableSchema;
export type SplitterApi = ResizableApi;

export const splitterEdgeSchema = z.enum(['left', 'right', 'top', 'bottom']).default('right');
export type SplitterEdge = z.infer<typeof splitterEdgeSchema>;

export const splitterHandleSchema = resizableSchema;
export type SplitterHandleApi = ResizableApi;

export type SplitterEdge = 'left' | 'right' | 'top' | 'bottom';
