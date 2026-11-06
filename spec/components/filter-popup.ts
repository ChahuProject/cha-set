import { z } from 'zod';

/**
 * Neutral API contract for FilterPopup component.
 * Multi-dimensional facet filtering popup with search, exclusions, ratings and shortcuts.
 */
export const filterPopupItemSchema = z.object({
  key: z.union([z.string(), z.number()]),
  label: z.string().optional(),
  count: z.number().optional(),
  stars: z.number().optional(),
  color: z.string().optional(),
  isChecked: z.boolean().default(false),
  isExcluded: z.boolean().default(false),
});

export const filterPopupSearchVisibilitySchema = z.enum(['autoHidden', 'always']);
export const filterPopupLogicModeSchema = z.enum(['and', 'or']);

export const filterPopupSchema = z.object({
  title: z.string().default(''),
  icon: z.string().default(''),
  items: z.array(filterPopupItemSchema).default([]),
  open: z.boolean().default(false),
  onOpenChange: z.function().optional(),
  searchEnabled: z.boolean().default(true),
  searchVisibility: filterPopupSearchVisibilitySchema.default('autoHidden'),
  validateFileName: z.boolean().default(false),
  showLogicToggle: z.boolean().default(false),
  logicMode: filterPopupLogicModeSchema.default('and'),
  onLogicModeChange: z.function().optional(),
  hasActive: z.boolean().default(false),
  onClear: z.function().optional(),
  onItemIncludeToggle: z.function().optional(),
  onItemExcludeToggle: z.function().optional(),
  className: z.string().optional(),
});

export type FilterPopupItem = z.infer<typeof filterPopupItemSchema>;
export type FilterPopupSearchVisibility = z.infer<typeof filterPopupSearchVisibilitySchema>;
export type FilterPopupLogicMode = z.infer<typeof filterPopupLogicModeSchema>;
export type FilterPopupApi = z.infer<typeof filterPopupSchema>;
