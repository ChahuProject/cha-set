import { z } from 'zod';
import { activityPlacementSchema } from '../shared/placement';

/**
 * Accent vocabulary shared by every activity card.
 * A card's tone drives the border, the top rail hairline and the progress fill.
 */
export const activityToneSchema = z.enum(['neutral', 'success', 'warning', 'danger']);

/**
 * Presentational shell contract for one entry of an activity stack.
 */
export const activityCardSchema = z.object({
  itemId: z.string(),
  tone: activityToneSchema.default('neutral'),
  title: z.string(),
  detail: z.string().optional(),
  meta: z.string().optional(),
  progress: z.number().default(-1),
  indeterminate: z.boolean().default(false),
  dismissible: z.boolean().default(false),
  dismissLabel: z.string().optional(),
});

/**
 * Neutral API contract for ActivityStack component.
 * Viewport-anchored floating host managing cards, placement, overflow, and collapse.
 */
export const activityStackSchema = z.object({
  placement: activityPlacementSchema.default('bottom-right'),
  offset: z.number().default(16),
  maxVisible: z.number().default(3),
  collapsible: z.boolean().default(true),
  defaultCollapsed: z.boolean().default(false),
  label: z.string().default('Activity Stack'),
  summaryLabel: z.string().optional(),
});

export type ActivityTone = z.infer<typeof activityToneSchema>;
export type ActivityCardApi = z.infer<typeof activityCardSchema>;
export type ActivityStackApi = z.infer<typeof activityStackSchema>;
