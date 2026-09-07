import { z } from 'zod';

/**
 * Neutral API contract for PanelCard component.
 */
export const panelCardSizeSchema = z.enum(['default', 'sm']);

export const panelCardSchema = z.object({
  size: panelCardSizeSchema.default('default'),
});

export const panelCardHeaderSchema = z.object({
  tinted: z.boolean().default(true),
});

export const panelCardContentSchema = z.object({});
export const panelCardFooterSchema = z.object({});

export type PanelCardApi = z.infer<typeof panelCardSchema>;
export type PanelCardHeaderApi = z.infer<typeof panelCardHeaderSchema>;
