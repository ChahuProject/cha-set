import { z } from 'zod';

/**
 * Neutral API contract for the Sheet component.
 * Single source of truth for Sheet, SheetTrigger, SheetClose, SheetPortal,
 * SheetOverlay, SheetContent, SheetHeader, SheetFooter, SheetTitle,
 * and SheetDescription across all stacks.
 */
export const sheetSideSchema = z.enum(['top', 'right', 'bottom', 'left']);

export const sheetSchema = z.object({
  open: z.boolean().optional(),
  defaultOpen: z.boolean().default(false),
  onOpenChange: z.function().optional(),
});

export const sheetTriggerSchema = z.object({
  asChild: z.boolean().default(false),
  disabled: z.boolean().default(false),
});

export const sheetCloseSchema = z.object({
  asChild: z.boolean().default(false),
});

export const sheetContentSchema = z.object({
  side: sheetSideSchema.default('right'),
  showCloseButton: z.boolean().default(true),
});

export const sheetHeaderSchema = z.object({});
export const sheetFooterSchema = z.object({});
export const sheetTitleSchema = z.object({});
export const sheetDescriptionSchema = z.object({});

export type SheetSide = z.infer<typeof sheetSideSchema>;
export type SheetApi = z.infer<typeof sheetSchema>;
export type SheetTriggerApi = z.infer<typeof sheetTriggerSchema>;
export type SheetCloseApi = z.infer<typeof sheetCloseSchema>;
export type SheetContentApi = z.infer<typeof sheetContentSchema>;
