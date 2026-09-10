import { z } from 'zod';

/**
 * Neutral API contract for the SmoothWheelHandler component.
 * Single source of truth for smooth kinematic wheel handling across React and Qt.
 */
export const scrollOrientationSchema = z.enum(['vertical', 'horizontal']);

export const smoothWheelHandlerSchema = z.object({
  scrollOrientation: scrollOrientationSchema.default('vertical'),
  mapVerticalToHorizontal: z.boolean().default(false),
  speedMultiplier: z.number().default(1.2),
  duration: z.number().default(200),
  fixedStepSize: z.number().default(0),
  consumeEvent: z.boolean().default(true),
  easingType: z.enum(['out-cubic', 'out-quad', 'linear']).default('out-cubic'),
});

export type ScrollOrientation = z.infer<typeof scrollOrientationSchema>;
export type SmoothWheelHandlerApi = z.infer<typeof smoothWheelHandlerSchema>;
