import { z } from 'zod';

/**
 * Neutral API contract for KeybindingRecorder component.
 *
 * Behavioral requirements:
 * 1. Space-constrained auto-compaction: when rendered within narrow containers (e.g. w-36),
 *    the embedded Kbd switches to symbol representation (⌃⇧P) using availableWidth to prevent
 *    horizontal layout overflow.
 * 2. Cross-stack tooltips: hovering on the recorder capsule displays a localized two-tier tooltip
 *    indicating current shortcut and click-to-record guidance (or recording state).
 * 3. Clear button: when clearable and populated, renders a dedicated clear button with its own
 *    decoupled tooltip and cursor semantics.
 */
export const keybindingValueSchema = z.object({
  ctrl: z.boolean().default(false),
  alt: z.boolean().default(false),
  shift: z.boolean().default(false),
  meta: z.boolean().default(false),
  code: z.string().default(''),
});

export const keybindingRecorderSchema = z.object({
  value: z.union([keybindingValueSchema, z.string()]),
  disabled: z.boolean().default(false),
  clearable: z.boolean().default(true),
  size: z.enum(['default', 'sm']).default('default'),
  placeholder: z.string().default('No keybinding set'),
  recordingText: z.string().default('Press key combination (Esc to cancel)...'),
  autoRecord: z.boolean().default(false),
});

export type KeybindingValue = z.infer<typeof keybindingValueSchema>;
export type KeybindingRecorderApi = z.infer<typeof keybindingRecorderSchema>;
