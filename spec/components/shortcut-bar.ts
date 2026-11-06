import { z } from 'zod';
import {
  kbdVariantSchema,
  kbdSizeSchema,
  kbdCompactSchema,
  shortcutItemSchema,
  shortcutPresetNameSchema,
  SHORTCUT_PRESETS,
} from './kbd';

/**
 * Neutral API contract for ShortcutBar (multi-stage responsive shortcut bar).
 * Single source of truth across React and Qt stacks.
 */
export const shortcutBarModeSchema = z.enum(['auto', 'icon']);

export const shortcutBarSchema = z.object({
  items: z.array(shortcutItemSchema).optional(),
  preset: shortcutPresetNameSchema.optional(),
  additionalShortcuts: z.array(shortcutItemSchema).optional(),
  compact: kbdCompactSchema.default('auto'),
  size: kbdSizeSchema.default('xs'),
  variant: kbdVariantSchema.default('outline'),
  showOverflowCount: z.boolean().default(true),
  mode: shortcutBarModeSchema.default('auto'),
});

export type ShortcutBarMode = z.infer<typeof shortcutBarModeSchema>;
export type ShortcutBarApi = z.infer<typeof shortcutBarSchema>;

export {
  shortcutItemSchema,
  shortcutPresetNameSchema,
  SHORTCUT_PRESETS,
};
