import { z } from 'zod';

/**
 * Action column configuration for ReorderableList.
 */
export const reorderableActionColumnSchema = z.object({
  key: z.string(),
  activeIcon: z.string().optional(),
  inactiveIcon: z.string().optional(),
  tooltip: z.string().optional(),
  shortcut: z.string().optional(),
  activeColor: z.string().optional(),
  inactiveColor: z.string().optional(),
  objectName: z.string().optional(),
});

/**
 * Single item entry in ReorderableList.
 */
export const reorderableListItemSchema = z.object({
  id: z.string(),
  label: z.string().optional(),
  name: z.string().optional(),
  icon: z.string().optional(),
  visible: z.boolean().optional(),
}).passthrough();

/**
 * Neutral API contract for ReorderableList component.
 * Reorderable action list with drag-and-drop ordering, collinear slot indicators, and action toggles.
 */
export const reorderableListSchema = z.object({
  items: z.array(reorderableListItemSchema).default([]),
  rowHeight: z.number().default(30),
  reorderable: z.boolean().default(true),
  actionColumns: z.array(reorderableActionColumnSchema).default([]),
  defaultActionKey: z.string().default('visible'),
});

export type ReorderableActionColumn = z.infer<typeof reorderableActionColumnSchema>;
export type ReorderableListItem = z.infer<typeof reorderableListItemSchema>;
export type ReorderableListApi = z.infer<typeof reorderableListSchema>;
