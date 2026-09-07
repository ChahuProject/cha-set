import * as React from 'react';
import {
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Button } from '../button/Button';
import { Checkbox } from '../checkbox/Checkbox';
import { Input } from '../input/Input';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../table/Table';
import {
  ArrowUpDownIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SearchIcon,
} from '../lib/icons';
import { cn } from '../lib/utils';

export interface GenericDataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  enableGlobalFilter?: boolean;
  globalFilterPlaceholder?: string;
  enableSorting?: boolean;
  enableFooter?: boolean;
  enablePagination?: boolean;
  pageSize?: number;
  enableVirtualization?: boolean;
  virtualContainerHeight?: string;
  emptyText?: string;
  emptyNode?: React.ReactNode;
  selectionMode?: 'single' | 'multiple';
  selectedRows?: TData[];
  onSelectedRowsChange?: (rows: TData[]) => void;
  getRowId?: (row: TData, index: number) => string;
  getRowClassName?: (row: TData) => string;
  onRowClick?: (row: TData, e: React.MouseEvent) => void;
  onRowContextMenu?: (row: TData, e: React.MouseEvent) => void;
  onSortingChange?: (sorting: SortingState) => void;
  className?: string;
}

export function GenericDataTable<TData>({
  data,
  columns,
  enableGlobalFilter = true,
  globalFilterPlaceholder = 'Search records...',
  enableSorting = true,
  enableFooter = false,
  enablePagination = false,
  pageSize = 10,
  enableVirtualization = false,
  virtualContainerHeight = '20rem',
  emptyText = 'No records found',
  emptyNode,
  selectionMode,
  selectedRows,
  onSelectedRowsChange,
  getRowId = (_row, index) => String(index),
  getRowClassName,
  onRowClick,
  onRowContextMenu,
  onSortingChange: onSortingChangeProp,
  className,
}: GenericDataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [internalSelection, setInternalSelection] = React.useState<RowSelectionState>({});

  const isControlledSelection = selectedRows !== undefined;
  const rowSelection = React.useMemo<RowSelectionState>(() => {
    if (!isControlledSelection) return internalSelection;
    return Object.fromEntries(selectedRows.map((row, idx) => [getRowId(row, idx), true]));
  }, [isControlledSelection, selectedRows, internalSelection, getRowId]);

  const selectionColumn = React.useMemo<ColumnDef<TData, any>>(() => ({
    id: 'select',
    size: 40,
    enableSorting: false,
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected()
              ? true
              : table.getIsSomePageRowsSelected()
                ? 'indeterminate'
                : false
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          onClick={(e) => e.stopPropagation()}
          aria-label="Select row"
        />
      </div>
    ),
  }), []);

  const displayColumns = React.useMemo(() => {
    if (selectionMode === 'multiple') {
      return [selectionColumn, ...columns];
    }
    return columns;
  }, [selectionMode, selectionColumn, columns]);

  const handleSortingChange = React.useCallback(
    (updater: any) => {
      const nextSorting = typeof updater === 'function' ? updater(sorting) : updater;
      setSorting(nextSorting);
      onSortingChangeProp?.(nextSorting);
    },
    [sorting, onSortingChangeProp],
  );

  const handleRowSelectionChange = React.useCallback(
    (updater: any) => {
      const nextSelection = typeof updater === 'function' ? updater(rowSelection) : updater;
      if (!isControlledSelection) {
        setInternalSelection(nextSelection);
      }
      if (onSelectedRowsChange) {
        const selected = data.filter((row, idx) => nextSelection[getRowId(row, idx)]);
        onSelectedRowsChange(selected);
      }
    },
    [rowSelection, isControlledSelection, data, getRowId, onSelectedRowsChange],
  );

  const table = useReactTable({
    data,
    columns: displayColumns,
    state: {
      sorting,
      globalFilter,
      rowSelection,
    },
    getRowId: (row, idx) => getRowId(row, idx),
    enableRowSelection: !!selectionMode,
    enableSorting,
    onSortingChange: handleSortingChange,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: handleRowSelectionChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(enablePagination ? { getPaginationRowModel: getPaginationRowModel() } : {}),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const { rows } = table.getRowModel();

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 36,
    overscan: 10,
    enabled: enableVirtualization,
  });

  return (
    <div data-slot="generic-data-table" className={cn('flex flex-col gap-3 w-full', className)}>
      {enableGlobalFilter && (
        <div className="relative max-w-sm">
          <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={globalFilterPlaceholder}
            className="pl-8 h-8 text-xs"
          />
        </div>
      )}

      <div
        ref={tableContainerRef}
        className={cn(
          'rounded-md border border-border overflow-auto',
          enableVirtualization ? 'relative' : '',
        )}
        style={enableVirtualization ? { height: virtualContainerHeight } : undefined}
      >
        <Table>
          <TableHeader className="sticky top-0 z-20 bg-muted/80 backdrop-blur-xs">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();

                  return (
                    <TableHead key={header.id} style={{ width: header.getSize() }}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={cn(
                            'flex items-center gap-1.5 select-none',
                            canSort && 'cursor-pointer hover:text-foreground',
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <span className="truncate">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </span>
                          {canSort && (
                            <span className="shrink-0 text-muted-foreground">
                              {sorted === 'asc' ? (
                                <ChevronUpIcon className="size-3.5 text-primary" />
                              ) : sorted === 'desc' ? (
                                <ChevronDownIcon className="size-3.5 text-primary" />
                              ) : (
                                <ArrowUpDownIcon className="size-3 opacity-40 hover:opacity-100" />
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={displayColumns.length}
                  className="h-24 text-center text-xs text-muted-foreground"
                >
                  {emptyNode ?? emptyText}
                </TableCell>
              </TableRow>
            ) : enableVirtualization ? (
              <>
                <tr style={{ height: `${virtualizer.getVirtualItems()[0]?.start ?? 0}px` }} />
                {virtualizer.getVirtualItems().map((virtualRow) => {
                  const row = rows[virtualRow.index]!;
                  const isSelected = row.getIsSelected();

                  return (
                    <TableRow
                      key={row.id}
                      data-index={virtualRow.index}
                      ref={virtualizer.measureElement}
                      data-state={isSelected ? 'selected' : undefined}
                      className={cn(
                        selectionMode === 'single' && 'cursor-pointer',
                        isSelected && 'bg-muted/50',
                        getRowClassName?.(row.original),
                      )}
                      onClick={(e) => {
                        if (selectionMode === 'single') {
                          table.setRowSelection({ [row.id]: !isSelected });
                        }
                        onRowClick?.(row.original, e);
                      }}
                      onContextMenu={(e) => onRowContextMenu?.(row.original, e)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
                <tr
                  style={{
                    height: `${
                      virtualizer.getTotalSize() -
                      (virtualizer.getVirtualItems()[virtualizer.getVirtualItems().length - 1]?.end ?? 0)
                    }px`,
                  }}
                />
              </>
            ) : (
              rows.map((row) => {
                const isSelected = row.getIsSelected();

                return (
                  <TableRow
                    key={row.id}
                    data-state={isSelected ? 'selected' : undefined}
                    className={cn(
                      selectionMode === 'single' && 'cursor-pointer',
                      isSelected && 'bg-muted/50',
                      getRowClassName?.(row.original),
                    )}
                    onClick={(e) => {
                      if (selectionMode === 'single') {
                        table.setRowSelection({ [row.id]: !isSelected });
                      }
                      onRowClick?.(row.original, e);
                    }}
                    onContextMenu={(e) => onRowContextMenu?.(row.original, e)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>

          {enableFooter && (
            <TableFooter>
              {table.getFooterGroups().map((footerGroup) => (
                <TableRow key={footerGroup.id}>
                  {footerGroup.headers.map((header) => (
                    <TableCell key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.footer, header.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableFooter>
          )}
        </Table>
      </div>

      {enablePagination && (
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <div>
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex items-center gap-2">
            <span>
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="xs"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="xs"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
