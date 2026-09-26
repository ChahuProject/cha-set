import { z } from 'zod';

/**
 * Neutral API contract for AddressBar component.
 * Explorer and browser-style navigation bar with breadcrumbs and inline path editing.
 */
export const pathSegmentSchema = z.object({
  label: z.string(),
  displayName: z.string().optional(),
  path: z.string(),
  icon: z.string().optional(),
  realPath: z.string().optional(),
  isRoot: z.boolean().optional(),
  isDrive: z.boolean().optional(),
  hasSubfolders: z.boolean().optional(),
});

export const addressBarSchema = z.object({
  path: z.string().default(''),
  defaultValue: z.string().default(''),
  showNavButtons: z.boolean().default(true),
  showRefresh: z.boolean().default(true),
  showSearch: z.boolean().default(false),
  canGoBack: z.boolean().default(false),
  canGoForward: z.boolean().default(false),
  suggestions: z.array(z.string()).default([]),
  history: z.array(z.string()).default([]),
  searchQuery: z.string().default(''),
  searchPlaceholder: z.string().default('搜索...'),
  disabled: z.boolean().default(false),
});

export type PathSegment = z.infer<typeof pathSegmentSchema>;
export type AddressBarApi = z.infer<typeof addressBarSchema>;

