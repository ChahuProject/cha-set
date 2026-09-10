import { z } from 'zod';

/**
 * Neutral API contract for the Skeleton component.
 * Single source of truth for Skeleton public surface across all stacks.
 */
export const skeletonRadiusSchema = z.enum(['none', 'sm', 'md', 'lg', 'full']);
export const skeletonAnimationSchema = z.enum(['pulse', 'wave', 'none']);

export const skeletonSchema = z.object({
  animate: z.boolean().default(true),
  animation: skeletonAnimationSchema.default('pulse'),
  rounded: skeletonRadiusSchema.default('md'),
});

export type SkeletonRadius = z.infer<typeof skeletonRadiusSchema>;
export type SkeletonAnimation = z.infer<typeof skeletonAnimationSchema>;
export type SkeletonApi = z.infer<typeof skeletonSchema>;
