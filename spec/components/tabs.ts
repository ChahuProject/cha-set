import { z } from 'zod';

/**
 * Neutral API contract for the Tabs component.
 * Single source of truth for Tabs, TabsList, TabsTrigger, and TabsContent public surfaces across all stacks.
 */
export const tabsOrientationSchema = z.enum(['horizontal', 'vertical']);
export const tabsVariantSchema = z.enum(['default', 'line']);
export const tabsSizeSchema = z.enum(['default', 'sm']);

export const tabsSchema = z.object({
  defaultValue: z.string().optional(),
  value: z.string().optional(),
  orientation: tabsOrientationSchema.default('horizontal'),
  variant: tabsVariantSchema.default('default'),
  size: tabsSizeSchema.default('default'),
});

export const tabsListSchema = z.object({
  loop: z.boolean().default(true),
  variant: tabsVariantSchema.optional(),
  size: tabsSizeSchema.optional(),
});

export const tabsTriggerSchema = z.object({
  value: z.string(),
  disabled: z.boolean().default(false),
  variant: tabsVariantSchema.optional(),
  size: tabsSizeSchema.optional(),
  badge: z.string().optional(),
});

export const tabsContentSchema = z.object({
  value: z.string(),
});

export type TabsApi = z.infer<typeof tabsSchema>;
export type TabsListApi = z.infer<typeof tabsListSchema>;
export type TabsTriggerApi = z.infer<typeof tabsTriggerSchema>;
export type TabsContentApi = z.infer<typeof tabsContentSchema>;
export type TabsVariant = z.infer<typeof tabsVariantSchema>;
export type TabsSize = z.infer<typeof tabsSizeSchema>;

