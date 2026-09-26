import { z } from 'zod';
import { activityPlacementSchema } from '../shared/placement';

/**
 * Neutral API contract for the NotificationStack component.
 *
 * A viewport-anchored stack of transient, severity-coded notifications. It
 * shares the stack mechanics of `task-hud` (placement, overflow, auto-hide,
 * keyboard traversal) but its items carry an inline action row and a
 * self-expiring duration instead of progress.
 */
export const notificationLevelSchema = z.enum(['info', 'success', 'warning', 'error']);

/**
 * One inline action. `variant` reuses the Button contract's vocabulary so a
 * host never has to translate a notification's own button taxonomy onto
 * ChaSet's.
 */
export const notificationActionSchema = z.object({
  id: z.string(),
  label: z.string(),
  variant: z.enum(['default', 'outline', 'ghost', 'destructive']).default('outline'),
});

/**
 * One notification.
 *
 * `duration` is milliseconds until auto-dismiss; `0` means sticky. The stack's
 * `defaultDuration` fills the blank, so a caller that wants one notification to
 * stay put writes `duration: 0` rather than duplicating the stack default on
 * every sibling.
 */
export const notificationItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  level: notificationLevelSchema.default('info'),
  duration: z.number().optional(),
  dismissible: z.boolean().default(true),
  actions: z.array(notificationActionSchema).default([]),
});

export const notificationStackSchema = z.object({
  notifications: z.array(notificationItemSchema).default([]),
  placement: activityPlacementSchema.default('bottom-right'),
  /** Inset from the anchored viewport edges, in logical units. */
  offset: z.number().default(16),
  /** Cards rendered before the stack overflows into its "show all" pill. */
  maxVisible: z.number().default(4),
  /** Fallback lifetime for items that do not state their own `duration`. */
  defaultDuration: z.number().default(5000),
  /** Hovering a card suspends its remaining lifetime. */
  pauseOnHover: z.boolean().default(true),
});

export type NotificationLevel = z.infer<typeof notificationLevelSchema>;
export type NotificationAction = z.input<typeof notificationActionSchema>;
export type ResolvedNotificationAction = z.output<typeof notificationActionSchema>;
/**
 * Caller-facing shape. Fields carrying a `.default()` are optional, so a host
 * writes `{ id, title, level: 'error' }` and inherits the rest from the schema.
 */
export type NotificationItem = z.input<typeof notificationItemSchema>;
/** Post-parse shape, with every default materialised. */
export type ResolvedNotificationItem = z.output<typeof notificationItemSchema>;
export type NotificationStackPlacement = z.infer<typeof activityPlacementSchema>;
export type NotificationStackApi = z.input<typeof notificationStackSchema>;
export type ResolvedNotificationStackApi = z.output<typeof notificationStackSchema>;
