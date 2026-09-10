import { z } from 'zod';

/**
 * Neutral API contract for InlineEditableText component.
 */
export const inlineEditableTextSchema = z.object({
  value: z.string(),
  placeholder: z.string().optional(),
  disabled: z.boolean().default(false),
  hint: z.string().optional(),
  size: z.enum(['default', 'sm']).default('default'),
  trigger: z.enum(['click', 'doubleClick']).default('click'),
});

export type InlineEditableTextApi = z.infer<typeof inlineEditableTextSchema>;
