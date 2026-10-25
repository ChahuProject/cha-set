import React, { useMemo } from 'react';
import { GenericDataTable, Badge, type ColumnDef, CodeBlock, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { DocMarkdown } from '../../components/DocMarkdown';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { DocText } from '../../components/DocText';

interface UserRecord {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'Pending' | 'Offline';
}

export function GenericDataTableDocPage() {
  const { t } = useChaSetI18n();

  const sampleUsers = useMemo<UserRecord[]>(() => [
    { id: '1', name: 'Alice Chen', role: t('desktopComposite.genericDataTable.roleArchitect', 'Lead Architect'), status: 'Active' },
    { id: '2', name: 'Bob Smith', role: t('desktopComposite.genericDataTable.roleFrontend', 'Frontend Engineer'), status: 'Active' },
    { id: '3', name: 'Carol White', role: t('desktopComposite.genericDataTable.roleQt', 'Qt Specialist'), status: 'Pending' },
    { id: '4', name: 'David Lee', role: t('desktopComposite.genericDataTable.roleDevOps', 'DevOps Engineer'), status: 'Offline' },
    { id: '5', name: 'Elena Rostova', role: t('desktopComposite.genericDataTable.roleProduct', 'Product Manager'), status: 'Active' },
  ], [t]);

  const columns = useMemo<ColumnDef<UserRecord, any>[]>(() => [
    {
      accessorKey: 'id',
      header: t('desktopComposite.genericDataTable.colId', 'ID'),
    },
    {
      accessorKey: 'name',
      header: t('desktopComposite.genericDataTable.colName', 'User Name'),
    },
    {
      accessorKey: 'role',
      header: t('desktopComposite.genericDataTable.colRole', 'Role'),
    },
    {
      accessorKey: 'status',
      header: t('common.status', 'Status'),
      cell: ({ row }: { row: any }) => {
        const rawStatus = row.original.status;
        const localizedStatus =
          rawStatus === 'Active'
            ? t('common.active', 'Active')
            : rawStatus === 'Pending'
            ? t('desktopComposite.genericDataTable.statusPending', 'Pending')
            : t('desktopComposite.genericDataTable.statusOffline', 'Offline');
        return (
          <Badge
            size="sm"
            variant={
              rawStatus === 'Active'
                ? 'default'
                : rawStatus === 'Pending'
                ? 'secondary'
                : 'outline'
            }
          >
            {localizedStatus}
          </Badge>
        );
      },
    },
  ], [t]);

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
      description={t('components.genericDataTable.description', 'Full-featured desktop-grade data table powered by TanStack Table, with column sorting, filtering, selection, and pagination.')}
    >
      <section id="overview" className="scroll-mt-20">
        <DocText role="h2" className="mb-3">
          {t('showcase.interactiveOverview', 'Interactive Overview')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t('desktopComposite.genericDataTable.overviewDesc', 'Click column headers to sort ascending and descending.')}
        </DocText>

        <ComponentPreview
          title={t('desktopComposite.genericDataTable.sandboxTitle', 'Generic Data Table Sandbox')}
          reactCode={reactCode}
          qtCode={qtCode}
        >
          <div className="w-full max-w-xl">
            <GenericDataTable
              data={sampleUsers}
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



                        <DocMarkdown id="generic-data-table" section="keyboard" />

            <DocMarkdown id="generic-data-table" section="props" />
    </DocLayout>
  );
}
