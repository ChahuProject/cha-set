import { z } from 'zod';

/**
 * Neutral API contract for InlineEditableText component.
 */
export const inlineEditableTextSchema = z.object({
  value: z.string(),
  placeholder: z.string().optional(),
  disabled: z.boolean().default(false),
  hint: z.string().optional(),
});

export type InlineEditableTextApi = z.infer<typeof inlineEditableTextSchema>;
