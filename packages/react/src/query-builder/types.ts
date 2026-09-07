import * as React from 'react';

export interface FilterOperator<TRecord = unknown> {
  key: string;
  label: string;
  match: (recordValue: unknown, conditionValue: unknown) => boolean;
}

export interface FilterFieldDefinition<TRecord = unknown> {
  key: string;
  label: string;
  operators: FilterOperator<TRecord>[];
  options?: { value: string; label: string }[];
  renderValue?: (value: unknown, onChange: (val: unknown) => void) => React.ReactNode;
  transformValue?: (value: unknown) => unknown;
  getValue: (record: TRecord) => unknown;
}

export interface FilterCondition {
  id: string;
  field: string;
  operator: string;
  value: unknown;
}

export type QueryConnector = 'and' | 'or';

export interface FilterGroup {
  id: string;
  connector: QueryConnector;
  children: (FilterCondition | FilterGroup)[];
}

export function isFilterGroup(item: FilterCondition | FilterGroup): item is FilterGroup {
  return 'connector' in item && 'children' in item;
}

let seq = 0;
export function newConditionId(): string {
  seq++;
  return `cond-${Date.now()}-${seq}`;
}

export function newGroupId(): string {
  seq++;
  return `group-${Date.now()}-${seq}`;
}

export function createFilterGroup(connector: QueryConnector = 'and'): FilterGroup {
  return {
    id: newGroupId(),
    connector,
    children: [],
  };
}

// Built-in operator factories
export function equals<T>(label = 'equals'): FilterOperator<T> {
  return {
    key: 'equals',
    label,
    match: (recordVal, condVal) => recordVal === condVal,
  };
}

export function notEquals<T>(label = 'does not equal'): FilterOperator<T> {
  return {
    key: 'notEquals',
    label,
    match: (recordVal, condVal) => recordVal !== condVal,
  };
}

export function contains<T>(label = 'contains'): FilterOperator<T> {
  return {
    key: 'contains',
    label,
    match: (recordVal, condVal) => {
      if (typeof recordVal !== 'string' || typeof condVal !== 'string') return false;
      return recordVal.toLowerCase().includes(condVal.toLowerCase());
    },
  };
}

export function startsWith<T>(label = 'starts with'): FilterOperator<T> {
  return {
    key: 'startsWith',
    label,
    match: (recordVal, condVal) => {
      if (typeof recordVal !== 'string' || typeof condVal !== 'string') return false;
      return recordVal.toLowerCase().startsWith(condVal.toLowerCase());
    },
  };
}

export function greaterThan<T>(label = 'greater than'): FilterOperator<T> {
  return {
    key: 'greaterThan',
    label,
    match: (recordVal, condVal) => {
      if (typeof recordVal !== 'number' || typeof condVal !== 'number') return false;
      return recordVal > condVal;
    },
  };
}

export function lessThan<T>(label = 'less than'): FilterOperator<T> {
  return {
    key: 'lessThan',
    label,
    match: (recordVal, condVal) => {
      if (typeof recordVal !== 'number' || typeof condVal !== 'number') return false;
      return recordVal < condVal;
    },
  };
}
