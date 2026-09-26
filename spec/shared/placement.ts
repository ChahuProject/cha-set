import { z } from 'zod';

/**
 * Viewport anchoring contract shared by ChaSet's floating activity surfaces
 * (`task-hud`, `notification-stack`).
 *
 * The eight placements are the corners, the edge midpoints and the two centre
 * anchors of the viewport rectangle. They are declared once here rather than
 * repeated in each component contract, because a host application that anchors
 * its task stack bottom-right expects its notification stack to accept exactly
 * the same vocabulary — two independently maintained enums is how one of them
 * quietly loses `top-center`.
 *
 * `-center` anchors are named by the edge they sit on (`left-center`,
 * `right-center`) or their axis (`top-center`, `bottom-center`) rather than by
 * a generic `center`, so a reader never has to guess which edge grew the gap
 * that pushes the surface off-centre.
 */
export const activityPlacementSchema = z.enum([
  'top-left',
  'top-center',
  'top-right',
  'left-center',
  'right-center',
  'bottom-left',
  'bottom-center',
  'bottom-right',
]);

export type ActivityPlacement = z.infer<typeof activityPlacementSchema>;

/** Every placement, in reading order. Useful for playground selectors on both stacks. */
export const ACTIVITY_PLACEMENTS = activityPlacementSchema.options;
