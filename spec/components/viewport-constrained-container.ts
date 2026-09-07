import { z } from 'zod';

/**
 * Neutral API contract for ViewportConstrainedContainer component.
 */
export const viewportConstrainedContainerSchema = z.object({
  maxHeight: z.union([z.number(), z.string()]).optional(),
  margin: z.number().default(16),
  overflow: z.enum(['auto', 'scroll']).default('auto'),
  className: z.string().optional(),
});

export type ViewportConstrainedContainerApi = z.infer<typeof viewportConstrainedContainerSchema>;
