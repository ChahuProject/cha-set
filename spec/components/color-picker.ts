import { z } from 'zod';

/**
 * Neutral API contract for the ColorPicker component.
 * Single source of truth for ColorPicker public surface across all stacks.
 */
export const colorPickerSizeSchema = z.enum(['default', 'sm']);
export const colorPickerModeSchema = z.enum(['inline', 'popover']);
export const colorPickerPanelSchema = z.enum(['square', 'circle', 'triangle', 'swatches']);
export const colorChannelModeSchema = z.enum(['rgb', 'hsv', 'cmyk', 'lab']);

export const defaultPresetColors = [
  '#18181b',
  '#334155',
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#f43f5e',
  '#14b8a6',
  '#84cc16',
  '#f59e0b',
  '#6366f1',
  '#a855f7',
] as const;

export const colorPickerSchema = z.object({
  value: z.string().optional(),
  defaultValue: z.string().default('#1d7ae0'),
  disabled: z.boolean().default(false),
  showPreview: z.boolean().default(true),
  showHex: z.boolean().default(true),
  showSwatches: z.boolean().default(true),
  size: colorPickerSizeSchema.default('default'),
  mode: colorPickerModeSchema.default('inline'),
  presetColors: z.array(z.string()).optional(),
});

export type ColorPickerApi = z.infer<typeof colorPickerSchema>;
export type ColorPickerSize = z.infer<typeof colorPickerSizeSchema>;
export type ColorPickerMode = z.infer<typeof colorPickerModeSchema>;
export type ColorPickerPanel = z.infer<typeof colorPickerPanelSchema>;
export type ColorChannelMode = z.infer<typeof colorChannelModeSchema>;
