import { z } from 'zod';

/**
 * Neutral API contract for the Tooltip component.
 * Single source of truth for Tooltip public surface across all stacks.
 *
 * Placement Policy (default `side` by host category):
 * - Dense vertical lists (dropdown-menu / context-menu / select options,
 *   sidebar nav, virtual-tree/list rows, reorderable / table row actions,
 *   nav drawer): `right` (align center). Top/bottom would cover the
 *   prev/next sibling item; right keeps siblings visible. Keep
 *   `avoidCollisions: true` so near-right-edge anchors flip to left.
 * - Top-docked chrome (address-bar, breadcrumb, topbar actions,
 *   window-title-bar): `bottom` (falls into content, never off-screen).
 * - Modal chrome (dialog / sheet / draggable-modal close + size menu):
 *   `bottom` with collisions enabled (falls into the modal body).
 * - Bottom-docked chrome (media-progress time pill, bottom bars): `top`.
 * - Left rail (sidebar collapsed icons): `right`; right-docked rail
 *   mirrors to `left` (or relies on collision flip).
 * - Everything else (isolated buttons, inputs, badges, cards,
 *   segmented-control options, elided-text): `top` (schema default).
 *   ElidedText inside a dense vertical list MUST override to `right`.
 */
export const tooltipSideSchema = z.enum(['top', 'bottom', 'left', 'right']);
export const tooltipAlignSchema = z.enum(['start', 'center', 'end']);

export const tooltipSchema = z.object({
  content: z.string().default(''),
  side: tooltipSideSchema.default('top'),
  align: tooltipAlignSchema.default('center'),
  sideOffset: z.number().default(4),
  avoidCollisions: z.boolean().default(true),
  delayDuration: z.number().default(200),
  disabled: z.boolean().default(false),
  shortcut: z.string().optional(),
  arrow: z.boolean().default(false),
  warm: z.boolean().default(true),
});

export type TooltipApi = z.infer<typeof tooltipSchema>;
export type TooltipSide = z.infer<typeof tooltipSideSchema>;
export type TooltipAlign = z.infer<typeof tooltipAlignSchema>;
