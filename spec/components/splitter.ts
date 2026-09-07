import { z } from 'zod';

/**
 * Neutral API contract for Splitter component.
 */
export const splitterSchema = z.object({
  initialSize: z.number().default(50),
  minSize: z.number().default(0),
  maxSize: z.number().default(100),
  orientation: z.enum(['horizontal', 'vertical']).default('vertical'),
});

export type SplitterApi = z.infer<typeof splitterSchema>;
