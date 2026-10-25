import { z } from 'zod';

/**
 * Neutral API contract + shared behavior configuration for HoverCopy.
 *
 * This file is the single source of truth for the dual-stack behavior spec
 * (see docs/architecture/hover-copy.md). The React implementation
 * (packages/react/src/hover-copy/HoverCopy.tsx) and the Qt implementation
 * (qt/src/ChaSetHoverCopy.qml) MUST mirror these defaults, the radius map and
 * the icon map bit-for-bit. Drift is mechanically rejected by
 * spec/__tests__/hover-copy-parity.test.ts.
 */

/** Radius scale shared by both stacks: React maps to a CSS class, Qt to a numeric radius. */
export const hoverCopyRadiusSchema = z.enum(['none', 'sm', 'md', 'lg', 'full']);
export type HoverCopyRadius = z.infer<typeof hoverCopyRadiusSchema>;

/** Semantic icon names shared by both stacks (React icons.tsx / Qt ChaSetIcon registry). */
export const hoverCopyIconSchema = z.enum(['copy', 'check']);
export type HoverCopyIcon = z.infer<typeof hoverCopyIconSchema>;

/**
 * Semantic radius -> per-stack geometry mapping.
 * `qt: 'pill'` means "radius = height / 2" (computed at runtime).
 */
export const hoverCopyRadiusMap: Record<HoverCopyRadius, { web: string; qt: number | 'pill' }> = {
  none: { web: 'rounded-none', qt: 0 },
  sm: { web: 'rounded', qt: 2 },
  md: { web: 'rounded-md', qt: 6 },
  lg: { web: 'rounded-lg', qt: 8 },
  full: { web: 'rounded-full', qt: 'pill' },
};

/**
 * Behavior defaults (timing + visual). Identical on both stacks.
 * `dim` is a theme-independent black scrim alpha (same approach as dialog
 * scrims) so the hover feedback reads as "darkened" in light AND dark themes.
 * `resetTime` is a logic timer, NOT a motion token: reduced-motion never
 * shortens it.
 */
export const hoverCopyDefaults = {
  text: '',
  dim: 0.45,
  radius: 'md' as HoverCopyRadius,
  icon: 'copy' as HoverCopyIcon,
  copiedIcon: 'check' as HoverCopyIcon,
  resetTime: 1000,
};

/** State machine states, shared vocabulary for both stacks and tests. */
export const hoverCopyStateSchema = z.enum(['idle', 'hovered', 'copied']);
export type HoverCopyState = z.infer<typeof hoverCopyStateSchema>;

export const hoverCopySchema = z.object({
  text: z.string().default(hoverCopyDefaults.text),
  dim: z.number().min(0).max(1).default(hoverCopyDefaults.dim),
  radius: hoverCopyRadiusSchema.default(hoverCopyDefaults.radius),
  icon: hoverCopyIconSchema.default(hoverCopyDefaults.icon),
  copiedIcon: hoverCopyIconSchema.default(hoverCopyDefaults.copiedIcon),
  resetTime: z.number().int().positive().default(hoverCopyDefaults.resetTime),
  disabled: z.boolean().default(false),
});

export type HoverCopyApi = z.infer<typeof hoverCopySchema>;
