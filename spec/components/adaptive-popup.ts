import { z } from 'zod';

/**
 * Neutral API contract for AdaptivePopup component.
 * Content-driven adaptive height popup with zero unnecessary scrollbars.
 */
export const adaptivePopupPlacementSchema = z.enum(['down', 'up']);

export const adaptivePopupSchema = z.object({
  open: z.boolean().default(false),
  onOpenChange: z.function().optional(),
  minHeight: z.union([z.number(), z.string()]).default(120),
  maxHeight: z.union([z.number(), z.string()]).default(-1),
  anchorX: z.number().default(0),
  anchorY: z.number().default(0),
  placement: adaptivePopupPlacementSchema.default('down'),
  edgeMargin: z.number().default(12),
  contentInset: z.number().default(16),
  useFullHostBand: z.boolean().default(true),
  className: z.string().optional(),
});

export type AdaptivePopupApi = z.infer<typeof adaptivePopupSchema>;
