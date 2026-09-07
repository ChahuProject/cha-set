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
