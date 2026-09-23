import { z } from 'zod';

/**
 * Neutral API contract for VirtualTree component.
 */
export const virtualTreeSchema = z.object({
  defaultExpandDepth: z.number().default(0),
  estimateSize: z.number().default(32),
  gap: z.number().default(0),
  overscan: z.number().default(10),
  selectionMode: z.enum(['single', 'multiple', 'none']).default('single'),
  enableDnd: z.boolean().default(false),
});

export type VirtualTreeApi = z.infer<typeof virtualTreeSchema>;
