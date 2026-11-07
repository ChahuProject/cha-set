import { z } from 'zod';

/**
 * Neutral API contract for DocumentTabs & TabItem components.
 * Single source of truth for desktop document tab bar container and tab items across all stacks.
 */
export const tabWidthModeSchema = z.enum(['content', 'fixed']);

export const tabItemSchema = z.object({
  id: z.string().optional(),
  text: z.string(),
  selected: z.boolean().default(false),
  canClose: z.boolean().default(true),
  useShellChrome: z.boolean().default(false),
  tabWidthMode: tabWidthModeSchema.default('content'),
  tabMinWidth: z.number().optional(),
  tabMaxWidth: z.number().optional(),
  tooltipText: z.string().optional(),
  tooltipDescription: z.string().optional(),
  disabled: z.boolean().default(false),
});

export const documentTabsSchema = z.object({
  useShellChrome: z.boolean().default(false),
  leftPadding: z.number().optional(),
  rightPadding: z.number().optional(),
});

export type TabWidthMode = z.infer<typeof tabWidthModeSchema>;
export type TabItemApi = z.infer<typeof tabItemSchema>;
export type DocumentTabsApi = z.infer<typeof documentTabsSchema>;
