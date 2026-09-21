import { z } from 'zod';

/**
 * Neutral API contract for ThemeSettings and ThemeConfig.
 * Single source of truth for theme configuration across React and Qt.
 * See docs/design/chaset-theme-control.md and spec/schemas/theme-config.schema.json.
 */

export const themeModeSchema = z.enum(['light', 'dark', 'system']);
export type ThemeMode = z.infer<typeof themeModeSchema>;

export const paletteIdSchema = z.enum([
  'neutral',
  'slate',
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'violet',
  'rose',
  'custom',
]);
export type PaletteId = z.infer<typeof paletteIdSchema>;

export const themePaletteSchema = z.object({
  id: paletteIdSchema.default('neutral'),
  customHex: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
});
export type ThemePalette = z.infer<typeof themePaletteSchema>;

export const decorationStyleIdSchema = z.enum(['simple', 'expressive']);
export type DecorationStyleId = z.infer<typeof decorationStyleIdSchema>;

export const decorationOverridesSchema = z.object({
  radius: z.number().int().min(0).max(100).optional(),
  shadow: z.number().int().min(0).max(100).optional(),
  motion: z.number().int().min(0).max(100).optional(),
});
export type DecorationOverrides = z.infer<typeof decorationOverridesSchema>;

export const themeDecorationSchema = z.object({
  styleId: decorationStyleIdSchema.default('simple'),
  level: z.number().int().min(0).max(100).default(50),
  overrides: decorationOverridesSchema.default({}),
});
export type ThemeDecoration = z.infer<typeof themeDecorationSchema>;

export const typographyFamilyIdSchema = z.enum(['system', 'sans', 'serif', 'mono']);
export type TypographyFamilyId = z.infer<typeof typographyFamilyIdSchema>;

export const typographyScaleIdSchema = z.enum(['default', 'compact', 'comfortable']);
export type TypographyScaleId = z.infer<typeof typographyScaleIdSchema>;

export const themeTypographySchema = z.object({
  familyId: typographyFamilyIdSchema.default('system'),
  scaleId: typographyScaleIdSchema.default('default'),
});
export type ThemeTypography = z.infer<typeof themeTypographySchema>;

export const themeConfigSchema = z.object({
  version: z.literal(1).default(1),
  mode: themeModeSchema.default('system'),
  palette: themePaletteSchema.default({ id: 'neutral' }),
  decoration: themeDecorationSchema.default({ styleId: 'simple', level: 50, overrides: {} }),
  typography: themeTypographySchema.default({ familyId: 'system', scaleId: 'default' }),
  uiScale: z.number().min(0.75).max(2.0).default(1.0),
});
export type ThemeConfig = z.infer<typeof themeConfigSchema>;

export const themeSettingsSchema = z.object({
  disabled: z.boolean().default(false),
  showReset: z.boolean().default(true),
  showExport: z.boolean().default(true),
  showImport: z.boolean().default(true),
  showTypography: z.boolean().default(false),
});
export type ThemeSettingsApi = z.infer<typeof themeSettingsSchema>;
