import { z } from 'zod';

/**
 * Neutral API contract for the Collapsible component.
 * Single source of truth for Collapsible, CollapsibleTrigger, and CollapsibleContent across all stacks.
 */
export const collapsibleSchema = z.object({
  open: z.boolean().optional(),
  defaultOpen: z.boolean().default(false),
  disabled: z.boolean().default(false),
  onOpenChange: z.function().optional(),
  className: z.string().optional(),
});

export const collapsibleTriggerSchema = z.object({
  asChild: z.boolean().default(false),
  disabled: z.boolean().default(false),
  className: z.string().optional(),
});

export const collapsibleContentSchema = z.object({
  className: z.string().optional(),
});

export type CollapsibleApi = z.infer<typeof collapsibleSchema>;
export type CollapsibleTriggerApi = z.infer<typeof collapsibleTriggerSchema>;
export type CollapsibleContentApi = z.infer<typeof collapsibleContentSchema>;
