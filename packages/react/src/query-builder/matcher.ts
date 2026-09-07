import {
  type FilterCondition,
  type FilterFieldDefinition,
  type FilterGroup,
  isFilterGroup,
} from './types';

export function matchesCondition<TRecord>(
  record: TRecord,
  condition: FilterCondition,
  fields: FilterFieldDefinition<TRecord>[],
): boolean {
  const fieldDef = fields.find((f) => f.key === condition.field);
  if (!fieldDef) return true;

  const opDef = fieldDef.operators.find((op) => op.key === condition.operator);
  if (!opDef) return true;

  const recordValue = fieldDef.getValue(record);
  const conditionValue = fieldDef.transformValue
    ? fieldDef.transformValue(condition.value)
    : condition.value;

  return opDef.match(recordValue, conditionValue);
}

export function matchesGroup<TRecord>(
  record: TRecord,
  group: FilterGroup,
  fields: FilterFieldDefinition<TRecord>[],
): boolean {
  if (group.children.length === 0) return true;

  const results = group.children.map((child) =>
    isFilterGroup(child)
      ? matchesGroup(record, child, fields)
      : matchesCondition(record, child, fields),
  );

  return group.connector === 'or' ? results.some(Boolean) : results.every(Boolean);
}

export function filterRecords<TRecord>(
  records: TRecord[],
  rootGroup: FilterGroup,
  fields: FilterFieldDefinition<TRecord>[],
): TRecord[] {
  return records.filter((rec) => matchesGroup(rec, rootGroup, fields));
}
