import { z } from 'zod';

/**
 * Neutral API contract for the ScrollBar and ScrollArea component.
 * Single source of truth for ScrollBar public surface across all stacks.
 */
export const scrollBarOrientationSchema = z.enum(['vertical', 'horizontal']);
export const scrollBarVisibilitySchema = z.enum(['hover', 'always', 'scroll']);

export const scrollBarSchema = z.object({
  orientation: scrollBarOrientationSchema.default('vertical'),
  showButtons: z.boolean().default(true),
  hitSize: z.number().default(16),
  collapsedSize: z.number().default(6),
  expandedSize: z.number().default(12),
  pageStepRatio: z.number().default(0.85),
  smoothScroll: z.boolean().default(true),
  visibilityMode: scrollBarVisibilitySchema.default('hover'),
  autoHideDelay: z.number().default(1000),
});

export const scrollAreaSchema = z.object({
  type: scrollBarVisibilitySchema.default('hover'),
  scrollHideDelay: z.number().default(600),
  showVerticalScrollBar: z.boolean().default(true),
  showHorizontalScrollBar: z.boolean().default(false),
  showButtons: z.boolean().default(true),
});

export type ScrollBarApi = z.infer<typeof scrollBarSchema>;
export type ScrollAreaApi = z.infer<typeof scrollAreaSchema>;
