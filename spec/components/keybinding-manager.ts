import { z } from 'zod';

/**
 * Scope item representing an isolated application region or modality.
 */
export const keybindingScopeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
});

/**
 * Section item representing a logical grouping of actions.
 */
export const keybindingSectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  order: z.number().default(0),
});

/**
 * Single chord representation within an action.
 */
export const keybindingChordSchema = z.object({
  keyString: z.string(),
  isUserModified: z.boolean().default(false),
  isMasked: z.boolean().default(false),
});

/**
 * Occupier details for conflict analysis.
 */
export const keybindingConflictOccupierSchema = z.object({
  actionId: z.string(),
  actionName: z.string(),
  scopeId: z.string().optional(),
  isResolver: z.boolean().default(false),
});

/**
 * Action item representing a configurable command.
 */
export const keybindingActionItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  scopeId: z.string().default('global'),
  sectionId: z.string().default('common'),
  chords: z.array(keybindingChordSchema).default([]),
  defaultChords: z.array(z.string()).default([]),
  hasConflict: z.boolean().default(false),
  conflictOccupiers: z.array(keybindingConflictOccupierSchema).default([]),
  disabled: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

/**
 * Neutral API contract for KeybindingManager component.
 *
 * Behavioral requirements:
 * 1. Comprehensive tooltips: all interactive and informational controls (search input, scope
 *    filter select, cheat sheet export, reset all, action titles/descriptions, keybinding capsules,
 *    alternative chord addition, scope badges, user-modified status badges, conflict warnings,
 *    and action reset buttons) MUST provide localized ChaSet tooltips across both React and Qt.
 * 2. Two-tier action tooltips: action title and description tooltips display bold action names
 *    with subdued descriptive captions (matching ChaSetTooltip text and description properties).
 * 3. Search placeholder ellipsis: when the search box placeholder text overflows, it is truncated
 *    with an ellipsis ('...'), and hovering reveals the full placeholder query guide in a tooltip.
 * 4. Modified badge semantics: only custom modified bindings display a 'User' status badge;
 *    unmodified actions represent factory built-ins by omission to maintain visual cleanliness.
 */
export const keybindingManagerSchema = z.object({
  actions: z.array(keybindingActionItemSchema),
  scopes: z.array(keybindingScopeSchema).default([]),
  sections: z.array(keybindingSectionSchema).default([]),
  searchable: z.boolean().default(true),
  allowMultiChord: z.boolean().default(true),
  allowExportCheatSheet: z.boolean().default(true),
  allowResetAll: z.boolean().default(true),
  showSourceBadge: z.boolean().default(true),
  showScopeBadge: z.boolean().default(true),
  layout: z.enum(['grouped-list', 'flat-table']).default('grouped-list'),
});

export type KeybindingScope = z.infer<typeof keybindingScopeSchema>;
export type KeybindingSection = z.infer<typeof keybindingSectionSchema>;
export type KeybindingChord = z.infer<typeof keybindingChordSchema>;
export type KeybindingConflictOccupier = z.infer<typeof keybindingConflictOccupierSchema>;
export type KeybindingActionItem = z.infer<typeof keybindingActionItemSchema>;
export type KeybindingManagerApi = z.infer<typeof keybindingManagerSchema>;
