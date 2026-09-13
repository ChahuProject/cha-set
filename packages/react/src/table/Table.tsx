import React from 'react';
import { Badge } from '../badge/Badge';
import { cn } from '../lib/utils';

export type TableColumnAlign = 'left' | 'center' | 'right';

export interface TableColumn<T = any> {
  key: string;
  title: string;
  width?: number | string;
  align?: TableColumnAlign;
  badge?: boolean;
  kbd?: boolean;
  code?: boolean;
  render?: (value: any, row: T, index: number) => React.ReactNode;
}

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  containerClassName?: string;
  columns?: TableColumn[];
  data?: any[];
  rows?: any[];
  caption?: string;
  bordered?: boolean;
  interactive?: boolean;
  onRowClick?: (row: any, index: number) => void;
  selectedIndex?: number;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (
    {
      className,
      containerClassName,
      columns,
      data,
      rows,
      caption,
      bordered = false,
      interactive = false,
      onRowClick,
      selectedIndex = -1,
      children,
      ...props
    },
    ref
  ) => {
    const effectiveRows = data ?? rows;

    if (columns && effectiveRows) {
      const renderKeyCombo = (rawKey: string) => {
        const parts = String(rawKey).split(' / ');
        return (
          <div className="flex flex-wrap items-center gap-1.5">
            {parts.map((combo, idx) => {
              const keys = combo.split(' + ');
              return (
                <React.Fragment key={combo}>
                  {idx > 0 && <span className="text-muted-foreground text-xs font-normal">or</span>}
                  <span className="inline-flex items-center gap-1">
                    {keys.map((k) => (
                      <kbd
                        key={k}
                        className="inline-flex items-center justify-center px-1.5 py-0.5 text-caption font-mono font-semibold rounded border border-border bg-muted/60 text-foreground shadow-xs"
                      >
                        {k}
                      </kbd>
                    ))}
                  </span>
                </React.Fragment>
              );
            })}
          </div>
        );
      };

      return (
        <div
          data-slot="table-container"
          className={cn(
            'relative w-full overflow-auto',
            bordered && 'rounded-lg border border-border bg-card text-card-foreground',
            containerClassName
          )}
        >
          <table
            ref={ref}
            data-slot="table"
            className={cn('w-full caption-bottom text-sm border-collapse', className)}
            {...props}
          >
            {caption && <TableCaption>{caption}</TableCaption>}
            <TableHeader>
              <TableRow className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {columns.map((col) => {
                  const alignClass =
                    col.align === 'center'
                      ? 'text-center'
                      : col.align === 'right'
                        ? 'text-right'
                        : 'text-left';
                  const style = col.width
                    ? { width: typeof col.width === 'number' ? `${col.width * 0.0625}rem` : col.width }
                    : undefined;
                  return (
                    <TableHead key={col.key} className={cn('py-2.5 px-4', alignClass)} style={style}>
                      {col.title}
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border/60">
              {effectiveRows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center py-6 text-muted-foreground text-xs"
                  >
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                effectiveRows.map((row, rowIdx) => {
                  const isSelected = selectedIndex === rowIdx;
                  return (
                    <TableRow
                      key={row.id ?? rowIdx}
                      data-state={isSelected ? 'selected' : undefined}
                      onClick={() => onRowClick?.(row, rowIdx)}
                      className={cn(
                        interactive && 'cursor-pointer hover:bg-muted/20 transition-colors',
                        isSelected && 'bg-muted/30'
                      )}
                    >
                      {columns.map((col) => {
                        const val = row[col.key];
                        const alignClass =
                          col.align === 'center'
                            ? 'text-center'
                            : col.align === 'right'
                              ? 'text-right'
                              : 'text-left';

                        let content: React.ReactNode = null;
                        if (col.render) {
                          content = col.render(val, row, rowIdx);
                        } else if (col.kbd) {
                          content = renderKeyCombo(String(val ?? ''));
                        } else if (col.badge) {
                          const str = String(val ?? '');
                          const lower = str.toLowerCase();
                          const variant =
                            lower === 'paid' ||
                            lower === 'complete' ||
                            lower === 'active' ||
                            lower === 'healthy'
                              ? 'default'
                              : lower === 'pending' ||
                                lower === 'in review' ||
                                lower === 'planned'
                                ? 'secondary'
                                : 'outline';
                          content = <Badge variant={variant as any} size="sm">{str}</Badge>;
                        } else if (col.code) {
                          content = (
                            <span className="font-mono font-medium text-primary text-xs">
                              {val}
                            </span>
                          );
                        } else {
                          content = val;
                        }

                        return (
                          <TableCell key={col.key} className={cn('py-3 px-4 text-xs', alignClass)}>
                            {content}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </table>
        </div>
      );
    }

    return (
      <div
        data-slot="table-container"
        className={cn('relative w-full overflow-auto', containerClassName)}
      >
        <table
          ref={ref}
          data-slot="table"
          className={cn('w-full caption-bottom text-sm', className)}
          {...props}
        >
          {children}
        </table>
      </div>
    );
  }
);
Table.displayName = 'Table';

export type TableHeaderProps = React.HTMLAttributes<HTMLTableSectionElement>;

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  TableHeaderProps
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    data-slot="table-header"
    className={cn('[&_tr]:border-b border-border', className)}
    {...props}
  />
));
TableHeader.displayName = 'TableHeader';

export type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement>;

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  TableBodyProps
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    data-slot="table-body"
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
));
TableBody.displayName = 'TableBody';

export type TableFooterProps = React.HTMLAttributes<HTMLTableSectionElement>;

export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  TableFooterProps
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    data-slot="table-footer"
    className={cn(
      'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0',
      className
    )}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

export type TableRowProps = React.HTMLAttributes<HTMLTableRowElement>;

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      data-slot="table-row"
      className={cn(
        'border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = 'TableRow';

export type TableHeadProps = React.ThHTMLAttributes<HTMLTableCellElement>;

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      data-slot="table-head"
      className={cn(
        'h-8 px-2 text-left align-middle font-medium text-muted-foreground whitespace-nowrap [&:has([role=checkbox])]:pr-0 text-xs',
        className
      )}
      {...props}
    />
  )
);
TableHead.displayName = 'TableHead';

export type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement>;

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      data-slot="table-cell"
      className={cn(
        'p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 text-foreground text-xs',
        className
      )}
      {...props}
    />
  )
);
TableCell.displayName = 'TableCell';

export type TableCaptionProps = React.HTMLAttributes<HTMLTableCaptionElement>;

export const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  TableCaptionProps
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    data-slot="table-caption"
    className={cn('mt-4 text-xs text-muted-foreground', className)}
    {...props}
  />
));
TableCaption.displayName = 'TableCaption';
