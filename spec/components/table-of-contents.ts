import { z } from 'zod';

/**
 * Neutral API contract for TableOfContents (TOC) component.
 * Single source of truth for cross-stack outline navigation and tree heading structures.
 */
export const tocItemSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    title: z.string(),
    level: z.number().int().min(1).default(1),
    disabled: z.boolean().default(false),
    children: z.array(tocItemSchema).optional(),
  })
);

export const tableOfContentsVariantSchema = z.enum(['default', 'track', 'flat']);
export const tableOfContentsSizeSchema = z.enum(['default', 'sm']);

export const tableOfContentsSchema = z.object({
  items: z.array(tocItemSchema).default([]),
  activeId: z.string().optional(),
  topOffset: z.number().default(0),
  targetOffset: z.number().default(0),
  variant: tableOfContentsVariantSchema.default('default'),
  size: tableOfContentsSizeSchema.default('default'),
  title: z.string().default('On this page'),
  showTitle: z.boolean().default(true),
  showTrack: z.boolean().default(true),
  collapsible: z.boolean().default(false),
});

export type TocItemApi = z.infer<typeof tocItemSchema>;
export type TableOfContentsApi = z.infer<typeof tableOfContentsSchema>;
export type TableOfContentsVariant = z.infer<typeof tableOfContentsVariantSchema>;
export type TableOfContentsSize = z.infer<typeof tableOfContentsSizeSchema>;
