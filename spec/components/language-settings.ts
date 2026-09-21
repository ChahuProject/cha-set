import { z } from 'zod';

/**
 * Neutral API contract for LanguageSettings.
 * Single source of truth for language preference configuration across React and Qt.
 */

export const languagePreferenceSchema = z.string().default('system');
export type LanguagePreference = z.infer<typeof languagePreferenceSchema>;

export const languageSettingsSchema = z.object({
  preference: languagePreferenceSchema,
  showFollowSystem: z.boolean().default(true),
  variant: z.enum(['card', 'embedded']).default('card'),
  disabled: z.boolean().default(false),
  title: z.string().optional(),
  description: z.string().optional(),
});
export type LanguageSettingsApi = z.infer<typeof languageSettingsSchema>;
