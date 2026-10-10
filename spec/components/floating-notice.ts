import { z } from 'zod';

/**
 * Neutral API contract for the FloatingNotice component.
 *
 * A compact, floating notice pill anchored to the top or bottom edge of the viewport.
 * Features a multi-card queue sorted by priority and insertion time, card-stack
 * cycling with indicator dots, hover suspension, smooth hover zoom, and
 * extensible shell content slots.
 */
export const floatingNoticeLevelSchema = z.enum(['default', 'info', 'warning', 'error']);

export const floatingNoticePlacementSchema = z.enum(['top', 'bottom']);

export const floatingNoticeItemSchema = z.object({
  id: z.string(),
  title: z.string().default(''),
  description: z.string().optional(),
  level: floatingNoticeLevelSchema.default('default'),
  /** Numeric priority: higher number renders first. Defaults to 0. */
  priority: z.number().optional(),
  /** Milliseconds until auto-dismiss/cycle. 0 marks a sticky notice. */
  duration: z.number().optional(),
  /** Whether the item renders a dismiss 'x' button on hover. */
  closable: z.boolean().default(true),
  /** Vector icon name (e.g. 'star', 'copy', 'info', 'check', etc.). */
  icon: z.string().optional(),
});

export const floatingNoticeSchema = z.object({
  notices: z.array(floatingNoticeItemSchema).default([]),
  placement: floatingNoticePlacementSchema.default('top'),
  /** Inset from the anchored viewport edge in logical units (dp). */
  offset: z.number().default(16),
  /** Fallback lifetime in ms for items that do not state their own duration. */
  defaultDuration: z.number().default(3000),
  /** Hovering the notice container suspends cycling and expiry countdowns. */
  pauseOnHover: z.boolean().default(true),
  /** Mild scale zoom on hover (1.05x) to enhance readability. */
  zoomOnHover: z.boolean().default(true),
  /** Global default for displaying close controls. */
  closable: z.boolean().default(true),
});

export type FloatingNoticeLevel = z.infer<typeof floatingNoticeLevelSchema>;
export type FloatingNoticePlacement = z.infer<typeof floatingNoticePlacementSchema>;
export type FloatingNoticeItem = z.input<typeof floatingNoticeItemSchema>;
export type ResolvedFloatingNoticeItem = z.output<typeof floatingNoticeItemSchema>;
export type FloatingNoticeApi = z.input<typeof floatingNoticeSchema>;
export type ResolvedFloatingNoticeApi = z.output<typeof floatingNoticeSchema>;
