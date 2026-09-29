import { z } from 'zod';

/**
 * Neutral API contract for Kbd (keyboard shortcut & keycap) component.
 * Single source of truth for Kbd public surface across all stacks.
 */
export const kbdVariantSchema = z.enum([
  'subtle',   // Plain mono text, no background/border box, muted foreground (standard for menus)
  'outline',  // Classic bordered keycap with background and subtle shadow
  'solid',    // Solid filled background with pronounced contrast
  'inverted', // Adaptive contrast keycap for dark/contrast tooltip bubbles
]);

export const kbdSizeSchema = z.enum(['xs', 'sm', 'default', 'md']);

export const kbdCompactSchema = z.enum(['auto', 'always', 'never']);

export const kbdOverflowSchema = z.enum(['collapse', 'hide', 'visible']);

export const kbdSchema = z.object({
  variant: kbdVariantSchema.default('outline'),
  size: kbdSizeSchema.default('default'),
  compact: kbdCompactSchema.default('auto'),
  overflow: kbdOverflowSchema.default('collapse'),
  shortcut: z.string().optional(),
  separator: z.string().default('+'),
});

export type KbdApi = z.infer<typeof kbdSchema>;
export type KbdVariant = z.infer<typeof kbdVariantSchema>;
export type KbdSize = z.infer<typeof kbdSizeSchema>;
export type KbdCompact = z.infer<typeof kbdCompactSchema>;
export type KbdOverflow = z.infer<typeof kbdOverflowSchema>;
