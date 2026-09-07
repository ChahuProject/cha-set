import { z } from 'zod';

/**
 * Neutral API contract for the Popover component.
 * Single source of truth for Popover, PopoverTrigger, PopoverAnchor,
 * PopoverContent, and PopoverClose public surfaces across all stacks.
 */
export const popoverAlignSchema = z.enum(['start', 'center', 'end']);
export const popoverSideSchema = z.enum(['top', 'bottom', 'left', 'right']);

export const popoverSchema = z.object({
  open: z.boolean().optional(),
  defaultOpen: z.boolean().default(false),
  onOpenChange: z.function().optional(),
  modal: z.boolean().default(false),
});

export const popoverTriggerSchema = z.object({
  asChild: z.boolean().default(false),
  disabled: z.boolean().default(false),
});

export const popoverAnchorSchema = z.object({});

export const popoverContentSchema = z.object({
  align: popoverAlignSchema.default('start'),
  side: popoverSideSchema.default('bottom'),
  sideOffset: z.number().default(8),
  movable: z.boolean().default(false),
  moveLabel: z.string().default('Drag to move'),
});

export const popoverCloseSchema = z.object({});

export type PopoverApi = z.infer<typeof popoverSchema>;
export type PopoverTriggerApi = z.infer<typeof popoverTriggerSchema>;
export type PopoverAnchorApi = z.infer<typeof popoverAnchorSchema>;
export type PopoverContentApi = z.infer<typeof popoverContentSchema>;
export type PopoverCloseApi = z.infer<typeof popoverCloseSchema>;
