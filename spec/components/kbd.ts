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

export const shortcutItemSchema = z.object({
  id: z.string(),
  keys: z.array(z.string()),
  label: z.string(),
  shortLabel: z.string().optional(),
  priority: z.number().optional(),
  disabled: z.boolean().optional(),
});


export const shortcutPresetNameSchema = z.enum([
  'dropdown',
  'dialog',
  'tree',
  'table',
  'address-bar',
]);

export const SHORTCUT_PRESETS: Record<
  z.infer<typeof shortcutPresetNameSchema>,
  z.infer<typeof shortcutItemSchema>[]
> = {
  dropdown: [
    { id: 'nav', keys: ['Up', 'Down'], label: '导航', priority: 1 },
    { id: 'select', keys: ['Enter'], label: '选择', priority: 1 },
    { id: 'close', keys: ['Esc'], label: '关闭', priority: 2 },
  ],
  dialog: [
    { id: 'confirm', keys: ['Enter'], label: '确认', priority: 1 },
    { id: 'cancel', keys: ['Esc'], label: '取消', priority: 1 },
  ],
  tree: [
    { id: 'nav', keys: ['Up', 'Down'], label: '导航', priority: 1 },
    { id: 'toggle', keys: ['Left', 'Right'], label: '折叠/展开', priority: 2 },
    { id: 'select', keys: ['Enter'], label: '选择', priority: 1 },
    { id: 'close', keys: ['Esc'], label: '取消', priority: 3 },
  ],
  table: [
    { id: 'nav', keys: ['Up', 'Down'], label: '移动', priority: 1 },
    { id: 'select', keys: ['Space'], label: '选中', priority: 2 },
  ],
  'address-bar': [
    { id: 'nav', keys: ['Up', 'Down'], label: '导航', priority: 1 },
    { id: 'open', keys: ['Enter'], label: '打开', priority: 1 },
    { id: 'close', keys: ['Esc'], label: '关闭', priority: 2 },
  ],
};

export const shortcutBarSchema = z.object({
  items: z.array(shortcutItemSchema).optional(),
  preset: shortcutPresetNameSchema.optional(),
  additionalShortcuts: z.array(shortcutItemSchema).optional(),
  compact: kbdCompactSchema.default('auto'),
  size: kbdSizeSchema.default('xs'),
  variant: kbdVariantSchema.default('outline'),
  showOverflowCount: z.boolean().default(true),
});

export type KbdApi = z.infer<typeof kbdSchema>;
export type KbdVariant = z.infer<typeof kbdVariantSchema>;
export type KbdSize = z.infer<typeof kbdSizeSchema>;
export type KbdCompact = z.infer<typeof kbdCompactSchema>;
export type KbdOverflow = z.infer<typeof kbdOverflowSchema>;
export type ShortcutItem = z.infer<typeof shortcutItemSchema>;
export type ShortcutPresetName = z.infer<typeof shortcutPresetNameSchema>;
export type ShortcutBarApi = z.infer<typeof shortcutBarSchema>;

