import { z } from 'zod';

/**
 * Neutral API contract for VirtualTree component.
 */
export const virtualTreeSchema = z.object({
  defaultExpandDepth: z.number().default(0),
  estimateSize: z.number().default(32),
  gap: z.number().default(0),
  overscan: z.number().default(10),
});

export type VirtualTreeApi = z.infer<typeof virtualTreeSchema>;
