import { z } from 'zod';

/**
 * Neutral API contract for the Table component.
 * Single source of truth for Table public surfaces across React and Qt Quick.
 */

export const tableColumnAlignSchema = z.enum(['left', 'center', 'right']);

export const tableColumnSchema = z.object({
  key: z.string(),
  title: z.string(),
  width: z.union([z.number(), z.string()]).optional(),
  align: tableColumnAlignSchema.default('left').optional(),
  badge: z.boolean().optional(),
});

export const tableRowSchema = z.record(z.string(), z.any());

export const tableSchema = z.object({
  columns: z.array(tableColumnSchema).optional(),
  rows: z.array(tableRowSchema).optional(),
  caption: z.string().optional(),
});

export const tableHeaderSchema = z.object({});
export const tableBodySchema = z.object({});
export const tableFooterSchema = z.object({});
export const tableRowComponentSchema = z.object({
  selected: z.boolean().default(false).optional(),
});
export const tableHeadSchema = z.object({});
export const tableCellSchema = z.object({});
export const tableCaptionSchema = z.object({});

export type TableColumn = z.infer<typeof tableColumnSchema>;
export type TableColumnAlign = z.infer<typeof tableColumnAlignSchema>;
export type TableRow = z.infer<typeof tableRowSchema>;
export type TableApi = z.infer<typeof tableSchema>;
