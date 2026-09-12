import * as React from 'react';
import {
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
  type FilterFn,
  type RowData,
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

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    searchText?: string | ((row: TData) => string);
    copyText?: string | ((row: TData) => string);
  }
}

/**
 * Intelligent default global filter:
 * 1. Honors column meta.searchText;
 * 2. Honors column meta.copyText;
 * 3. Honors column-specific custom filterFn;
 * 4. Supports hex number / hash matching when query starts with 0x or is hex;
 * 5. Falls back to string inclusion.
 */
export const defaultGlobalFilterFn: FilterFn<any> & ((row: any, columnId: string, filterValue: any, addMeta?: any) => boolean) = (
  row,
  columnId,
  filterValue,
  _addMeta,
) => {
  if (filterValue == null || filterValue === '') return true;
  const col = row.getAllCells().find((c: any) => c.column.id === columnId)?.column;
  const meta = col?.columnDef?.meta as any;
  const searchStr = String(filterValue).trim().toLowerCase();

  if (meta?.searchText) {
    const text = typeof meta.searchText === 'function' ? meta.searchText(row.original) : String(meta.searchText);
    return text.toLowerCase().includes(searchStr);
  }
  if (meta?.copyText) {
    const text = typeof meta.copyText === 'function' ? meta.copyText(row.original) : String(meta.copyText);
    return text.toLowerCase().includes(searchStr);
  }
  const customFilter = col?.columnDef?.filterFn;
  if (typeof customFilter === 'function') {
    return customFilter(row, columnId, filterValue, () => {});
  }
  const value = row.getValue(columnId);
  if (value == null) return false;
  const strVal = String(value).toLowerCase();
  if (strVal.includes(searchStr)) return true;
  if (
    (typeof value === 'number' || typeof value === 'bigint') &&
    (searchStr.startsWith('0x') || /^[0-9a-f]+$/i.test(searchStr))
  ) {
    try {
      const hex = `0x${BigInt(value).toString(16).toLowerCase()}`;
      const target = searchStr.replace(/^0x/i, '');
      return hex.includes(searchStr) || hex.replace(/^0x/, '').includes(target);
    } catch {
      // ignore parse errors
    }
  }
  return false;
};

export interface GenericDataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  enableGlobalFilter?: boolean;
  globalFilterPlaceholder?: string;
  globalFilterFn?: FilterFn<TData>;
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
  globalFilterFn,
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
    const processed = columns.map((col) => {
      if (col.enableGlobalFilter === undefined) {
        return { ...col, enableGlobalFilter: true };
      }
      return col;
    });
    if (selectionMode === 'multiple') {
      return [selectionColumn, ...processed];
    }
    return processed;
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
    globalFilterFn: globalFilterFn ?? defaultGlobalFilterFn,
    getColumnCanGlobalFilter: (column) => (column.columnDef.enableGlobalFilter !== undefined ? column.columnDef.enableGlobalFilter : true),
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
                            'flex items-center gap-1.5 select-none transition-colors duration-quick ease-standard',
                            canSort && 'cursor-pointer hover:text-foreground',
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <span className="truncate">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </span>
                          {canSort && (
                            <span className="shrink-0 text-muted-foreground transition-colors duration-quick ease-standard">
                              {sorted === 'asc' ? (
                                <ChevronUpIcon className="size-3.5 text-primary" />
                              ) : sorted === 'desc' ? (
                                <ChevronDownIcon className="size-3.5 text-primary" />
                              ) : (
                                <ArrowUpDownIcon className="size-3 opacity-40 transition-opacity duration-quick ease-standard hover:opacity-100" />
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
                <tr style={{ height: `${(virtualizer.getVirtualItems()[0]?.start ?? 0) * 0.0625}rem` }} />
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
                      (virtualizer.getTotalSize() -
                      (virtualizer.getVirtualItems()[virtualizer.getVirtualItems().length - 1]?.end ?? 0)) * 0.0625
                    }rem`,
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
