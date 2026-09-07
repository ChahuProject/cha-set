import { z } from 'zod';

/**
 * Neutral API contract for QueryBuilder component.
 */
export const queryConnectorSchema = z.enum(['and', 'or']);

export const queryConditionSchema = z.object({
  id: z.string(),
  field: z.string(),
  operator: z.string(),
  value: z.unknown(),
});

export const queryGroupSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    connector: queryConnectorSchema.default('and'),
    children: z.array(z.union([queryConditionSchema, queryGroupSchema])),
  }),
);

export const queryBuilderSchema = z.object({
  disabled: z.boolean().default(false),
});

export type QueryConnector = z.infer<typeof queryConnectorSchema>;
export type QueryCondition = z.infer<typeof queryConditionSchema>;
export type QueryGroup = {
  id: string;
  connector: QueryConnector;
  children: (QueryCondition | QueryGroup)[];
};
export type QueryBuilderApi = z.infer<typeof queryBuilderSchema>;
