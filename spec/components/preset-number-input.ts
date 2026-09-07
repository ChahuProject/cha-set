import { z } from 'zod';

/**
 * Neutral API contract for PresetNumberInput component.
 */
export const presetNumberInputSchema = z.object({
  value: z.string().default(''),
  placeholder: z.string().optional(),
  disabled: z.boolean().default(false),
  presets: z.array(z.number()).default([64, 128, 256, 512, 1024, 2048, 4096, 8192]),
  allowClear: z.boolean().default(true),
  clearLabel: z.string().default('None'),
  inputClassName: z.string().optional(),
  className: z.string().optional(),
});

export type PresetNumberInputApi = z.infer<typeof presetNumberInputSchema>;
