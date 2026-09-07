import * as React from 'react';
import { Button } from '../button/Button';
import { Input } from '../input/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select/Select';
import { XIcon } from '../lib/icons';
import { cn } from '../lib/utils';
import {
  type FilterCondition,
  type FilterFieldDefinition,
  type FilterGroup,
  createFilterGroup,
  isFilterGroup,
  newConditionId,
} from './types';

export interface QueryBuilderProps<TRecord = any> {
  fields: FilterFieldDefinition<TRecord>[];
  rootGroup?: FilterGroup;
  /** Alias for rootGroup */
  query?: any;
  onChange?: (nextGroup: FilterGroup) => void;
  /** Alias for onChange */
  onQueryChange?: (nextGroup: any) => void;
  disabled?: boolean;
  className?: string;
}

function normalizeGroup(g: any): FilterGroup {
  if (!g) return createFilterGroup();
  if (g.connector && Array.isArray(g.children)) return g;
  return {
    id: g.id || 'root',
    connector: (g.combinator || g.connector || 'and').toLowerCase() === 'or' ? 'or' : 'and',
    children: (g.rules || g.children || []).map((r: any) => {
      if (r.rules || (r.children && !r.field)) return normalizeGroup(r);
      return {
        id: r.id || newConditionId(),
        field: r.field || '',
        operator: r.operator || 'equals',
        value: r.value ?? '',
      };
    }),
  };
}

function normalizeFields(fields: any[]): FilterFieldDefinition<any>[] {
  return (fields || []).map((f) => {
    const key = f.key || f.id || f.name || '';
    const operators =
      f.operators && f.operators.length > 0
        ? f.operators
        : [
            { key: 'equals', label: 'equals', match: (r: any, v: any) => r == v },
            { key: 'contains', label: 'contains', match: (r: any, v: any) => String(r).includes(String(v)) },
            { key: 'greaterThan', label: '>', match: (r: any, v: any) => Number(r) > Number(v) },
          ];
    return {
      key,
      label: f.label || key,
      operators,
      getValue: f.getValue || ((r: any) => r?.[key]),
      options: f.options,
    };
  });
}

export function QueryBuilder<TRecord>({
  fields = [],
  rootGroup,
  query,
  onChange,
  onQueryChange,
  disabled = false,
  className,
}: QueryBuilderProps<TRecord>) {
  const safeFields = React.useMemo(() => normalizeFields(fields), [fields]);
  const safeGroup = React.useMemo(() => normalizeGroup(rootGroup ?? query), [rootGroup, query]);
  const handleChange = React.useCallback(
    (nextGroup: FilterGroup) => {
      onChange?.(nextGroup);
      onQueryChange?.(nextGroup);
    },
    [onChange, onQueryChange],
  );

  return (
    <div
      data-slot="query-builder"
      className={cn('rounded-lg border border-border/80 bg-card p-4 text-xs shadow-xs', className)}
    >
      <GroupRenderer
        group={safeGroup}
        depth={0}
        fields={safeFields}
        disabled={disabled}
        onChangeGroup={handleChange}
      />
    </div>
  );
}

function GroupRenderer<TRecord>({
  group,
  depth,
  fields,
  disabled,
  onChangeGroup,
  onDeleteGroup,
}: {
  group: FilterGroup;
  depth: number;
  fields: FilterFieldDefinition<TRecord>[];
  disabled?: boolean;
  onChangeGroup: (group: FilterGroup) => void;
  onDeleteGroup?: () => void;
}) {
  if (!group) return null;
  const connector = group.connector || 'and';
  const children = Array.isArray(group.children) ? group.children : [];

  const toggleConnector = () => {
    if (disabled) return;
    onChangeGroup({
      ...group,
      connector: connector === 'and' ? 'or' : 'and',
    });
  };

  const handleAddCondition = () => {
    if (disabled || fields.length === 0) return;
    const firstField = fields[0]!;
    const firstOp = firstField.operators[0]?.key ?? '';
    const newCond: FilterCondition = {
      id: newConditionId(),
      field: firstField.key,
      operator: firstOp,
      value: '',
    };
    onChangeGroup({
      ...group,
      children: [...children, newCond],
    });
  };

  const handleAddSubgroup = () => {
    if (disabled) return;
    const newSubgroup = createFilterGroup(connector === 'and' ? 'or' : 'and');
    onChangeGroup({
      ...group,
      children: [...children, newSubgroup],
    });
  };

  const handleUpdateChild = (idx: number, updatedChild: FilterCondition | FilterGroup) => {
    const nextChildren = [...children];
    nextChildren[idx] = updatedChild;
    onChangeGroup({ ...group, children: nextChildren });
  };

  const handleDeleteChild = (idx: number) => {
    onChangeGroup({
      ...group,
      children: children.filter((_, i) => i !== idx),
    });
  };

  return (
    <div
      data-slot="query-group"
      data-depth={depth}
      className={cn(
        'flex flex-col gap-2 rounded-md transition-colors',
        depth > 0 && 'border border-border/60 bg-muted/20 p-3',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="xs"
            disabled={disabled}
            onClick={toggleConnector}
            className="h-6 font-semibold uppercase tracking-wider"
          >
            {connector}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="xs"
            disabled={disabled || fields.length === 0}
            onClick={handleAddCondition}
            className="h-6 text-muted-foreground hover:text-foreground"
          >
            + Add condition
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="xs"
            disabled={disabled}
            onClick={handleAddSubgroup}
            className="h-6 text-muted-foreground hover:text-foreground"
          >
            + Add group
          </Button>
        </div>

        {onDeleteGroup && (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            disabled={disabled}
            onClick={onDeleteGroup}
            className="size-6 text-muted-foreground hover:text-destructive"
            title="Delete group"
          >
            <XIcon className="size-3" />
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-2 pl-2">
        {children.map((child, idx) => {
          if (!child) return null;
          if (isFilterGroup(child)) {
            return (
              <GroupRenderer
                key={child.id || `group-${idx}`}
                group={child}
                depth={depth + 1}
                fields={fields}
                disabled={disabled}
                onChangeGroup={(updated) => handleUpdateChild(idx, updated)}
                onDeleteGroup={() => handleDeleteChild(idx)}
              />
            );
          }

          return (
            <ConditionRenderer
              key={child.id}
              condition={child}
              fields={fields}
              disabled={disabled}
              onChangeCondition={(updated) => handleUpdateChild(idx, updated)}
              onDelete={() => handleDeleteChild(idx)}
            />
          );
        })}
      </div>
    </div>
  );
}

function ConditionRenderer<TRecord>({
  condition,
  fields,
  disabled,
  onChangeCondition,
  onDelete,
}: {
  condition: FilterCondition;
  fields: FilterFieldDefinition<TRecord>[];
  disabled?: boolean;
  onChangeCondition: (cond: FilterCondition) => void;
  onDelete: () => void;
}) {
  const currentField = fields.find((f) => f.key === condition.field) ?? fields[0];
  const operators = currentField?.operators ?? [];

  const handleFieldChange = (newFieldKey: string) => {
    const fDef = fields.find((f) => f.key === newFieldKey);
    const defaultOp = fDef?.operators[0]?.key ?? '';
    onChangeCondition({
      ...condition,
      field: newFieldKey,
      operator: defaultOp,
      value: '',
    });
  };

  const handleOperatorChange = (newOpKey: string) => {
    onChangeCondition({
      ...condition,
      operator: newOpKey,
    });
  };

  const handleValueChange = (newVal: unknown) => {
    onChangeCondition({
      ...condition,
      value: newVal,
    });
  };

  return (
    <div
      data-slot="query-condition"
      className="flex flex-wrap items-center gap-2 rounded-md bg-background/80 p-1.5 border border-border/40"
    >
      {/* Field selector */}
      <Select
        value={condition.field}
        onValueChange={handleFieldChange}
        disabled={disabled}
      >
        <SelectTrigger className="h-7 w-36 text-xs">
          <SelectValue placeholder="Field" />
        </SelectTrigger>
        <SelectContent>
          {fields.map((f) => (
            <SelectItem key={f.key} value={f.key}>
              {f.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Operator selector */}
      <Select
        value={condition.operator}
        onValueChange={handleOperatorChange}
        disabled={disabled}
      >
        <SelectTrigger className="h-7 w-32 text-xs">
          <SelectValue placeholder="Operator" />
        </SelectTrigger>
        <SelectContent>
          {operators.map((op) => (
            <SelectItem key={op.key} value={op.key}>
              {op.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Value input */}
      {currentField?.options ? (
        <Select
          value={String(condition.value ?? '')}
          onValueChange={(val) => handleValueChange(val)}
          disabled={disabled}
        >
          <SelectTrigger className="h-7 w-36 text-xs">
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            {currentField.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          type="text"
          value={String(condition.value ?? '')}
          onChange={(e) => handleValueChange(e.target.value)}
          disabled={disabled}
          placeholder="Value..."
          className="h-7 w-40 text-xs"
        />
      )}

      {/* Delete button */}
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        disabled={disabled}
        onClick={onDelete}
        className="size-6 text-muted-foreground hover:text-destructive"
        title="Remove condition"
        aria-label="Remove condition"
      >
        <XIcon className="size-3" />
      </Button>
    </div>
  );
}
