import { z } from 'zod';

/**
 * Neutral API contract for WindowTitleBar component.
 */
export const windowTitleBarSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  isMaximized: z.boolean().default(false),
  isFocused: z.boolean().default(true),
  showControls: z.boolean().default(true),
  dragRegion: z.boolean().default(true).optional(),
});

export type WindowTitleBarApi = z.infer<typeof windowTitleBarSchema>;
