import { z } from 'zod';

/**
 * Neutral API contract for Squircle / SmoothRectangle component.
 * Single source of truth for Squircle public surface across all stacks (React & Qt).
 */
export const squircleSchema = z.object({
  radius: z.number().default(8),
  cornerSmoothing: z.number().default(0.6), // 0.0 (circle arc) to 1.0 (full squircle), default 0.6 (Apple iOS standard)
  topLeftRadius: z.number().optional(),
  topRightRadius: z.number().optional(),
  bottomLeftRadius: z.number().optional(),
  bottomRightRadius: z.number().optional(),
  roundLeft: z.boolean().default(true),
  roundRight: z.boolean().default(true),
  roundTop: z.boolean().default(true),
  roundBottom: z.boolean().default(true),
  borderWidth: z.number().default(0),
  borderColor: z.string().optional(),
  color: z.string().optional(),
});

export type SquircleApi = z.infer<typeof squircleSchema>;
