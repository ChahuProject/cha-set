import { z } from 'zod';

/**
 * Neutral API contract for the SettingRow component.
 * Single source of truth for settings rows across React and Qt.
 */
export const settingRowSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  highlightId: z.string().optional(),
  highlightTarget: z.string().optional(),
  highlight: z.boolean().default(false),
  disabled: z.boolean().default(false),
});

export type SettingRowApi = z.infer<typeof settingRowSchema>;
