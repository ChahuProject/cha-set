import { z } from 'zod';

/**
 * Neutral API contract for the Input component.
 * Single source of truth for Input public surface across all stacks.
 */
export const inputTypeSchema = z.enum([
  'text',
  'password',
  'email',
  'search',
  'number',
  'tel',
  'url',
]);

export const inputSizeSchema = z.enum(['default', 'sm']);

export const inputSchema = z.object({
  type: inputTypeSchema.default('text'),
  size: inputSizeSchema.default('default'),
  disabled: z.boolean().default(false),
  readOnly: z.boolean().default(false),
  placeholder: z.string().optional(),
  value: z.string().optional(),
  defaultValue: z.string().optional(),
});

export type InputApi = z.infer<typeof inputSchema>;
export type InputType = z.infer<typeof inputTypeSchema>;
export type InputSize = z.infer<typeof inputSizeSchema>;
