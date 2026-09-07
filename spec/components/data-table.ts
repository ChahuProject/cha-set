import { z } from 'zod';

/**
 * Neutral API contract for GenericDataTable component.
 */
export const dataTableSchema = z.object({
  enableGlobalFilter: z.boolean().default(true),
  enableColumnFilter: z.boolean().default(false),
  enableFooter: z.boolean().default(false),
  enablePagination: z.boolean().default(false),
  enableVirtualization: z.boolean().default(false),
  virtualContainerHeight: z.string().default('20rem'),
  selectionMode: z.enum(['single', 'multiple']).optional(),
  emptyText: z.string().default('No records found'),
});

export type DataTableApi = z.infer<typeof dataTableSchema>;
