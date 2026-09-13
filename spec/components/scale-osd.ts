import { z } from 'zod';

/**
 * Neutral API contract for ScaleOsd component.
 * Floating On-Screen Display (OSD) pill for canvas/viewport scale and zoom level indicator.
 */
export const scaleOsdPlacementSchema = z.enum([
  'bottom-center',
  'top-center',
  'bottom-right',
  'top-right',
]);

export const scaleOsdSchema = z.object({
  value: z.number().default(1),
  step: z.number().default(0.1),
  min: z.number().default(0.2),
  max: z.number().default(3),
  visible: z.boolean().optional(),
  autoHideDuration: z.number().default(1400),
  showControls: z.boolean().default(true),
  placement: scaleOsdPlacementSchema.default('bottom-center'),
  disabled: z.boolean().default(false),
});

export type ScaleOsdApi = z.infer<typeof scaleOsdSchema>;
export type ScaleOsdPlacement = z.infer<typeof scaleOsdPlacementSchema>;
