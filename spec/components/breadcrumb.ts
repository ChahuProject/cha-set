import { z } from 'zod';
import { pathSegmentSchema } from './address-bar';

/**
 * Neutral API contract for Breadcrumb component.
 * Hierarchical path navigation trail with overflow ellipsis and dropdown subfolder browsing.
 */
export const breadcrumbSchema = z.object({
  segments: z.array(pathSegmentSchema).default([]),
  activePath: z.string().optional(),
  disabled: z.boolean().default(false),
  openSegmentIndex: z.number().default(-1),
  maxVisibleItems: z.number().default(5),
});

export type BreadcrumbApi = z.infer<typeof breadcrumbSchema>;
export { pathSegmentSchema };
