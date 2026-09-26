import { z } from 'zod';

/**
 * Neutral API contract for VirtualTree component.
 */
export const virtualTreeSchema = z.object({
  defaultExpandDepth: z.number().default(0),
  estimateSize: z.number().default(32),
  gap: z.number().default(0),
  overscan: z.number().default(10),
  selectionMode: z.enum(['single', 'multiple', 'none']).default('single'),
  enableDnd: z.boolean().default(false),
  showBadges: z.boolean().default(true),
  /**
   * Multi-level frozen ancestors: the host passes the ancestor chain of the
   * currently open node (outermost -> innermost, already filtered down to the
   * levels that are actually expanded). The component pins those rows above the
   * scroll area so parents stay visible while scrolling the subtree.
   */
  stickyItems: z
    .array(
      z.object({
        id: z.string(),
        label: z.string().default(''),
        depth: z.number().default(0),
        hasChildren: z.boolean().default(false),
        isExpanded: z.boolean().default(false),
      }),
    )
    .default([]),
});

export type VirtualTreeApi = z.infer<typeof virtualTreeSchema>;
