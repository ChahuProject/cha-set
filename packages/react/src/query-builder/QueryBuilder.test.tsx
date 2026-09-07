import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryBuilder } from './QueryBuilder';
import {
  type FilterFieldDefinition,
  type FilterGroup,
  contains,
  createFilterGroup,
  equals,
} from './types';
import { filterRecords, matchesGroup } from './matcher';

interface Item {
  title: string;
  status: string;
}

describe('QueryBuilder', () => {
  const fields: FilterFieldDefinition<Item>[] = [
    {
      key: 'title',
      label: 'Title',
      operators: [contains('contains'), equals('equals')],
      getValue: (item) => item.title,
    },
    {
      key: 'status',
      label: 'Status',
      operators: [equals('equals')],
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
      ],
      getValue: (item) => item.status,
    },
  ];

  it('renders connector and adds condition upon clicking + Add condition', () => {
    const onChange = vi.fn();
    const rootGroup: FilterGroup = createFilterGroup('and');

    render(
      <QueryBuilder
        fields={fields}
        rootGroup={rootGroup}
        onChange={onChange}
      />,
    );

    expect(screen.getByText('and')).toBeInTheDocument();

    const addConditionBtn = screen.getByText('+ Add condition');
    fireEvent.click(addConditionBtn);

    expect(onChange).toHaveBeenCalledTimes(1);
    const updated = onChange.mock.calls[0]?.[0] as FilterGroup | undefined;
    expect(updated?.children).toHaveLength(1);
  });

  it('matches records correctly using matcher utilities', () => {
    const records: Item[] = [
      { title: 'Project Alpha', status: 'active' },
      { title: 'Beta App', status: 'inactive' },
    ];

    const group: FilterGroup = {
      id: 'g1',
      connector: 'and',
      children: [
        {
          id: 'c1',
          field: 'title',
          operator: 'contains',
          value: 'alpha',
        },
      ],
    };

    const matched = filterRecords(records, group, fields);
    expect(matched).toHaveLength(1);
    expect(matched[0]!.title).toBe('Project Alpha');
  });
});
