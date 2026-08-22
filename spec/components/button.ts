import { z } from 'zod';

/**
 * Neutral API contract for the Button component.
 * This is the single source of truth for Button's public surface;
 * each stack implements against it. Hand-written until the
 * generate-types generator lands.
 */
export const buttonVariantSchema = z.enum(['primary', 'secondary', 'ghost', 'danger']);
export const buttonSizeSchema = z.enum(['sm', 'md', 'lg']);

export const buttonSchema = z.object({
  variant: buttonVariantSchema.default('primary'),
  size: buttonSizeSchema.default('md'),
  loading: z.boolean().default(false),
  fullWidth: z.boolean().default(false),
  disabled: z.boolean().default(false),
  type: z.enum(['button', 'submit', 'reset']).default('button'),
});

export type ButtonApi = z.infer<typeof buttonSchema>;