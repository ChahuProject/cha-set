import { z } from 'zod';

/**
 * Neutral API contract for VirtualList component.
 */
export const virtualListSchema = z.object({
  estimateSize: z.number().default(36),
  gap: z.number().default(0),
  overscan: z.number().default(8),
});

export type VirtualListApi = z.infer<typeof virtualListSchema>;
