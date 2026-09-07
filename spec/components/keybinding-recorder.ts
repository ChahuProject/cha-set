import { z } from 'zod';

/**
 * Neutral API contract for KeybindingRecorder component.
 */
export const keybindingValueSchema = z.object({
  ctrl: z.boolean().default(false),
  alt: z.boolean().default(false),
  shift: z.boolean().default(false),
  meta: z.boolean().default(false),
  code: z.string().default(''),
});

export const keybindingRecorderSchema = z.object({
  value: keybindingValueSchema,
  disabled: z.boolean().default(false),
  placeholder: z.string().default('No keybinding set'),
  recordingText: z.string().default('Press key combination (Esc to cancel)...'),
});

export type KeybindingValue = z.infer<typeof keybindingValueSchema>;
export type KeybindingRecorderApi = z.infer<typeof keybindingRecorderSchema>;
