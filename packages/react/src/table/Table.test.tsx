import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  type TableColumn,
} from './Table';

describe('Table Component', () => {
  it('renders compound table structure correctly', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Col 1</TableHead>
            <TableHead>Col 2</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Val 1</TableCell>
            <TableCell>Val 2</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByText('Col 1')).toBeInTheDocument();
    expect(screen.getByText('Val 1')).toBeInTheDocument();
  });

  it('renders data-driven simple table mode with columns and rows', () => {
    const columns: TableColumn[] = [
      { key: 'name', title: 'Name' },
      { key: 'role', title: 'Role', align: 'center' },
      { key: 'status', title: 'Status', badge: true },
      { key: 'code', title: 'Key', kbd: true },
      { key: 'commit', title: 'Commit', code: true },
    ];

    const data = [
      {
        id: '1',
        name: 'Alice',
        role: 'Admin',
        status: 'Active',
        code: 'Ctrl + S',
        commit: 'a1b2c3d',
      },
    ];

    render(<Table columns={columns} data={data} bordered />);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Ctrl')).toBeInTheDocument();
    expect(screen.getByText('S')).toBeInTheDocument();
    expect(screen.getByText('a1b2c3d')).toBeInTheDocument();
  });

  it('supports interactive rows and onRowClick callback', () => {
    const onRowClick = vi.fn();
    const columns: TableColumn[] = [{ key: 'name', title: 'Name' }];
    const data = [{ id: '1', name: 'Bob' }];

    render(
      <Table
        columns={columns}
        data={data}
        interactive
        onRowClick={onRowClick}
      />
    );

    fireEvent.click(screen.getByText('Bob'));
    expect(onRowClick).toHaveBeenCalledWith({ id: '1', name: 'Bob' }, 0);
  });

  it('renders empty state when rows is empty', () => {
    const columns: TableColumn[] = [{ key: 'name', title: 'Name' }];
    render(<Table columns={columns} data={[]} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });
});
