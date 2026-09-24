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

export const scaleOsdSizeSchema = z.enum(['default', 'lg']);

/**
 * Canonical 17-step discrete scale ladder matching Chrome / Chromium page zoom:
 * 25% 33% 50% 67% 75% 80% 90% 100% 110% 125% 150% 175% 200% 250% 300% 400% 500%
 */
export const CANONICAL_SCALE_STEPS: readonly number[] = [
  0.25, 0.33, 0.5, 0.67, 0.75, 0.8, 0.9, 1.0, 1.1, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0, 4.0, 5.0,
] as const;

export const scaleOsdSchema = z.object({
  value: z.number().default(1),
  step: z.number().default(0.1),
  min: z.number().default(0.2),
  max: z.number().default(3),
  steps: z.array(z.number()).optional(),
  visible: z.boolean().optional(),
  defaultVisible: z.boolean().default(false),
  autoHideDuration: z.number().default(1400),
  showControls: z.boolean().default(true),
  placement: scaleOsdPlacementSchema.default('bottom-center'),
  disabled: z.boolean().default(false),
  size: scaleOsdSizeSchema.default('default'),
  animated: z.boolean().default(true),
  ignoreUiScale: z.boolean().default(true),
  showTooltips: z.boolean().default(true),
});

export type ScaleOsdApi = z.infer<typeof scaleOsdSchema>;
export type ScaleOsdPlacement = z.infer<typeof scaleOsdPlacementSchema>;
export type ScaleOsdSize = z.infer<typeof scaleOsdSizeSchema>;
