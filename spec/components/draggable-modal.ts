import { z } from 'zod';

/**
 * Neutral API contract for DraggableModal component.
 */
export const draggableModalSchema = z.object({
  defaultWidth: z.number().default(500),
  defaultHeight: z.number().default(400),
  minWidth: z.number().default(300),
  minHeight: z.number().default(200),
  showEscBadge: z.boolean().default(false),
  autoFitHeight: z.boolean().default(true),
});

export type DraggableModalApi = z.infer<typeof draggableModalSchema>;
