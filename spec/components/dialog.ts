import { z } from 'zod';

/**
 * Neutral API contract for the Dialog component.
 * Single source of truth for Dialog, DialogTrigger, DialogContent, DialogHeader,
 * DialogTitle, DialogDescription, DialogFooter, and DialogClose public surfaces across all stacks.
 */
export const dialogSchema = z.object({
  open: z.boolean().default(false),
  onOpenChange: z.function().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
});

export const dialogTriggerSchema = z.object({
  asChild: z.boolean().default(false),
  disabled: z.boolean().default(false),
});

export const dialogContentSchema = z.object({
  customRadius: z.number().optional(),
});

export const dialogHeaderSchema = z.object({});
export const dialogTitleSchema = z.object({});
export const dialogDescriptionSchema = z.object({});
export const dialogFooterSchema = z.object({});
export const dialogCloseSchema = z.object({});

export type DialogApi = z.infer<typeof dialogSchema>;
export type DialogTriggerApi = z.infer<typeof dialogTriggerSchema>;
export type DialogContentApi = z.infer<typeof dialogContentSchema>;
export type DialogHeaderApi = z.infer<typeof dialogHeaderSchema>;
export type DialogTitleApi = z.infer<typeof dialogTitleSchema>;
export type DialogDescriptionApi = z.infer<typeof dialogDescriptionSchema>;
export type DialogFooterApi = z.infer<typeof dialogFooterSchema>;
export type DialogCloseApi = z.infer<typeof dialogCloseSchema>;
