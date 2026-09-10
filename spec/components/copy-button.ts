import { z } from 'zod';

/**
 * Neutral API contract for CopyButton component.
 */
export const copyButtonSchema = z.object({
  text: z.union([z.string(), z.custom<() => string | Promise<string>>()]),
  timeout: z.number().default(2000),
  variant: z.string().default('ghost'),
  size: z.string().default('icon-xs'),
  title: z.string().default('Copy'),
  copiedTitle: z.string().default('Copied'),
  label: z.string().optional(),
  copiedLabel: z.string().optional(),
  iconClassName: z.string().default('size-3.5'),
});

export type CopyButtonApi = z.infer<typeof copyButtonSchema>;
