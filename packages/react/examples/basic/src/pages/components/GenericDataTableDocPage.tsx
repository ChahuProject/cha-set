import React, { useMemo } from 'react';
import { GenericDataTable, Badge, type ColumnDef, CodeBlock } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentReference } from '../../components/ComponentReference';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';

interface UserRecord {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'Pending' | 'Offline';
}

const SAMPLE_USERS: UserRecord[] = [
  { id: '1', name: 'Alice Chen', role: 'Lead Architect', status: 'Active' },
  { id: '2', name: 'Bob Smith', role: 'Frontend Engineer', status: 'Active' },
  { id: '3', name: 'Carol White', role: 'Qt Specialist', status: 'Pending' },
  { id: '4', name: 'David Lee', role: 'DevOps Engineer', status: 'Offline' },
  { id: '5', name: 'Elena Rostova', role: 'Product Manager', status: 'Active' },
];

export function GenericDataTableDocPage() {
  const columns = useMemo<ColumnDef<UserRecord, any>[]>(() => [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'name',
      header: 'User Name',
    },
    {
      accessorKey: 'role',
      header: 'Role',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: { row: any }) => (
        <Badge
          size="sm"
          variant={
            row.original.status === 'Active'
              ? 'default'
              : row.original.status === 'Pending'
              ? 'secondary'
              : 'outline'
          }
        >
          {row.original.status}
        </Badge>
      ),
    },
  ], []);

  const reactCode = `<GenericDataTable
  data={users}
  columns={[
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'User Name' },
    { accessorKey: 'role', header: 'Role' },
    { accessorKey: 'status', header: 'Status' },
  ]}
  enablePagination
  pageSize={5}
/>`;

  const qtCode = `ChaSetGenericDataTable {
    width: ThemeTokens.dp(480)
    height: ThemeTokens.dp(280)
    pageSize: 5
    columns: [
        { key: "id", header: "ID", width: 50 },
        { key: "name", header: "User Name", width: 130 },
        { key: "role", header: "Role", width: 160 },
        { key: "status", header: "Status", width: 90 }
    ]
    rows: users
}`;

  return (
    <DocLayout
      category="Composite Engines"
      title="Generic Data Table"
      description="Full-featured desktop-grade data table powered by TanStack Table, with column sorting, filtering, selection, and pagination."
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Interactive Overview
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Click column headers to sort ascending and descending.
        </p>

        <ComponentPreview
          title="Generic Data Table Sandbox"
          reactCode={reactCode}
          qtCode={qtCode}
        >
          <div className="w-full max-w-xl">
            <GenericDataTable
              data={SAMPLE_USERS}
              columns={columns}
              enablePagination
              pageSize={5}
            />
          </div>
        </ComponentPreview>
      </section>

      {/* Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { GenericDataTable } from '@chahu/cha-set';

<GenericDataTable data={data} columns={columns} pageSize={10} />`}
        qtCode={`import ChaSet

ChaSetGenericDataTable {
    width: ThemeTokens.dp(480)
    height: ThemeTokens.dp(280)
    columns: columns
    pageSize: 10
}`}
      />



            <ComponentReference
        name="DataTable"
        componentId="data-table"
        props={[
            { name: 'data', type: 'TData[]', default: '[]', description: 'Array of data records.' },
            { name: 'columns', type: 'ColumnDef<TData, any>[]', default: '[]', description: 'TanStack Table column definitions.' },
            { name: 'enableSorting', type: 'boolean', default: 'true', description: 'Whether column sorting is enabled.' },
            { name: 'enablePagination', type: 'boolean', default: 'true', description: 'Whether pagination controls are rendered.' },
            { name: 'pageSize', type: 'number', default: '10', description: 'Number of rows per page.' },
          ]}
      />
    </DocLayout>
  );
}
