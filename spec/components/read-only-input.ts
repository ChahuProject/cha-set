import { z } from 'zod';

/**
 * Neutral API contract for ReadOnlyInput component.
 */
export const readOnlyInputColorSchemeSchema = z.enum(['default', 'destructive', 'warning', 'success']);

export const readOnlyInputSchema = z.object({
  value: z.string(),
  placeholder: z.string().optional(),
  copyHint: z.string().default('Copy'),
  copiedHint: z.string().default('Copied'),
  colorScheme: readOnlyInputColorSchemeSchema.default('default'),
});

export type ReadOnlyInputColorScheme = z.infer<typeof readOnlyInputColorSchemeSchema>;
export type ReadOnlyInputApi = z.infer<typeof readOnlyInputSchema>;
