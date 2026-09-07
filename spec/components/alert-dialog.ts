import { z } from 'zod';

/**
 * Neutral API contract for the AlertDialog component.
 * Single source of truth for AlertDialog, AlertDialogTrigger, AlertDialogPortal,
 * AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogFooter,
 * AlertDialogTitle, AlertDialogDescription, AlertDialogAction, and AlertDialogCancel.
 */
export const alertDialogSchema = z.object({
  open: z.boolean().optional(),
  defaultOpen: z.boolean().default(false),
  onOpenChange: z.function().optional(),
});

export const alertDialogTriggerSchema = z.object({
  asChild: z.boolean().default(false),
  disabled: z.boolean().default(false),
});

export const alertDialogPortalSchema = z.object({});
export const alertDialogOverlaySchema = z.object({});

export const alertDialogContentSchema = z.object({
  customRadius: z.number().optional(),
});

export const alertDialogHeaderSchema = z.object({});
export const alertDialogFooterSchema = z.object({});
export const alertDialogTitleSchema = z.object({});
export const alertDialogDescriptionSchema = z.object({});
export const alertDialogActionSchema = z.object({
  disabled: z.boolean().default(false),
});
export const alertDialogCancelSchema = z.object({
  disabled: z.boolean().default(false),
});

export type AlertDialogApi = z.infer<typeof alertDialogSchema>;
export type AlertDialogTriggerApi = z.infer<typeof alertDialogTriggerSchema>;
export type AlertDialogContentApi = z.infer<typeof alertDialogContentSchema>;
export type AlertDialogActionApi = z.infer<typeof alertDialogActionSchema>;
export type AlertDialogCancelApi = z.infer<typeof alertDialogCancelSchema>;
