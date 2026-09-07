import { z } from 'zod';

/**
 * Neutral API contract for VirtualGrid component.
 */
export const virtualGridSchema = z.object({
  minColumnWidthRem: z.number().default(12),
  gapRem: z.number().default(0.75),
  estimateSize: z.number().default(180),
  overscan: z.number().default(4),
});

export type VirtualGridApi = z.infer<typeof virtualGridSchema>;
