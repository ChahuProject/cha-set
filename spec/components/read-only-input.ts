import { z } from 'zod';

/**
 * Neutral API contract for ReadOnlyInput component.
 */
export const readOnlyInputColorSchemeSchema = z.enum(['default', 'destructive', 'warning', 'success']);

export const readOnlyInputSchema = z.object({
  value: z.string(),
  placeholder: z.string().optional(),
  showCopy: z.boolean().default(true),
  copyHint: z.string().default('Copy'),
  copiedHint: z.string().default('Copied'),
  masked: z.boolean().default(false),
  maskChar: z.string().default('•'),
  showMaskToggle: z.boolean().default(false),
  colorScheme: readOnlyInputColorSchemeSchema.default('default'),
  size: z.enum(['default', 'sm']).default('default'),
  disabled: z.boolean().default(false),
});

export type ReadOnlyInputColorScheme = z.infer<typeof readOnlyInputColorSchemeSchema>;
export type ReadOnlyInputApi = z.infer<typeof readOnlyInputSchema>;
