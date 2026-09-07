import { z } from 'zod';
import { draggableModalSizeOptionSchema } from './draggable-modal';

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
  draggable: z.boolean().default(true),
  showCloseButton: z.boolean().default(true),
  showEscBadge: z.boolean().default(true),
  defaultWidthRem: z.number().optional(),
  defaultHeightRem: z.number().optional(),
  minWidthRem: z.number().optional(),
  minHeightRem: z.number().optional(),
  initialPositionMode: z.enum(['center', 'top', '居中', '顶部靠上']).optional(),
  topMarginRem: z.number().optional(),
  autoFitHeight: z.boolean().optional(),
  sizeOptions: z.array(draggableModalSizeOptionSchema).optional(),
  sizeMenuTooltip: z.string().optional(),
  dragHandleClassName: z.string().optional(),
  contentClassName: z.string().optional(),
  内容类名: z.string().optional(),
});

export const dialogHeaderSchema = z.object({});
export const dialogTitleSchema = z.object({});
export const dialogDescriptionSchema = z.object({});
export const dialogFooterSchema = z.object({
  showCloseButton: z.boolean().default(false),
});
export const dialogCloseSchema = z.object({
  asChild: z.boolean().default(false),
});

export type DialogApi = z.infer<typeof dialogSchema>;
export type DialogTriggerApi = z.infer<typeof dialogTriggerSchema>;
export type DialogContentApi = z.infer<typeof dialogContentSchema>;
export type DialogHeaderApi = z.infer<typeof dialogHeaderSchema>;
export type DialogTitleApi = z.infer<typeof dialogTitleSchema>;
export type DialogDescriptionApi = z.infer<typeof dialogDescriptionSchema>;
export type DialogFooterApi = z.infer<typeof dialogFooterSchema>;
export type DialogCloseApi = z.infer<typeof dialogCloseSchema>;
