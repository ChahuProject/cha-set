import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GenericDataTable } from './GenericDataTable';
import type { ColumnDef } from '@tanstack/react-table';

interface UserData {
  id: string;
  name: string;
  role: string;
}

describe('GenericDataTable', () => {
  const columns: ColumnDef<UserData, any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: (info) => info.getValue(),
    },
  ];

  const data: UserData[] = [
    { id: '1', name: 'Alice', role: 'Admin' },
    { id: '2', name: 'Bob', role: 'Editor' },
    { id: '3', name: 'Charlie', role: 'Viewer' },
  ];

  it('renders table columns and data rows', () => {
    render(<GenericDataTable data={data} columns={columns} />);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  it('filters data rows using global search input', () => {
    render(<GenericDataTable data={data} columns={columns} enableGlobalFilter />);

    const searchInput = screen.getByPlaceholderText('Search records...');
    fireEvent.change(searchInput, { target: { value: 'Alice' } });

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();
    expect(screen.queryByText('Charlie')).not.toBeInTheDocument();
  });

  it('supports row selection in single mode', () => {
    const onRowClick = vi.fn();
    render(
      <GenericDataTable
        data={data}
        columns={columns}
        selectionMode="single"
        onRowClick={onRowClick}
      />,
    );

    const rowAlice = screen.getByText('Alice').closest('tr');
    fireEvent.click(rowAlice!);

    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(rowAlice).toHaveAttribute('data-state', 'selected');
  });

  it('supports pagination controls', () => {
    render(
      <GenericDataTable
        data={data}
        columns={columns}
        enablePagination
        pageSize={2}
      />,
    );

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.queryByText('Charlie')).not.toBeInTheDocument();

    const nextBtn = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(nextBtn);

    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });
});
