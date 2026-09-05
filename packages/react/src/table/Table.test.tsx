import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from './Table';

describe('Table component', () => {
  it('renders full table structure with compound elements', () => {
    render(
      <Table data-testid="table-root" containerClassName="custom-container">
        <TableCaption data-testid="table-caption">Recent Invoices</TableCaption>
        <TableHeader data-testid="table-header">
          <TableRow data-testid="table-header-row">
            <TableHead data-testid="table-head-1">Invoice</TableHead>
            <TableHead data-testid="table-head-2">Status</TableHead>
            <TableHead data-testid="table-head-3">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody data-testid="table-body">
          <TableRow data-testid="table-row-1" data-state="selected">
            <TableCell data-testid="table-cell-1">INV001</TableCell>
            <TableCell data-testid="table-cell-2">Paid</TableCell>
            <TableCell data-testid="table-cell-3">$250.00</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter data-testid="table-footer">
          <TableRow data-testid="table-footer-row">
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell>$250.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );

    const table = screen.getByTestId('table-root');
    expect(table).toBeInTheDocument();
    expect(table).toHaveAttribute('data-slot', 'table');
    expect(table.parentElement).toHaveAttribute('data-slot', 'table-container');
    expect(table.parentElement?.className).toContain('custom-container');

    const caption = screen.getByTestId('table-caption');
    expect(caption).toHaveAttribute('data-slot', 'table-caption');
    expect(caption).toHaveTextContent('Recent Invoices');

    const header = screen.getByTestId('table-header');
    expect(header).toHaveAttribute('data-slot', 'table-header');

    const body = screen.getByTestId('table-body');
    expect(body).toHaveAttribute('data-slot', 'table-body');

    const footer = screen.getByTestId('table-footer');
    expect(footer).toHaveAttribute('data-slot', 'table-footer');

    const head1 = screen.getByTestId('table-head-1');
    expect(head1).toHaveAttribute('data-slot', 'table-head');
    expect(head1).toHaveTextContent('Invoice');

    const cell1 = screen.getByTestId('table-cell-1');
    expect(cell1).toHaveAttribute('data-slot', 'table-cell');
    expect(cell1).toHaveTextContent('INV001');

    const row1 = screen.getByTestId('table-row-1');
    expect(row1).toHaveAttribute('data-slot', 'table-row');
    expect(row1).toHaveAttribute('data-state', 'selected');
  });

  it('merges custom classNames across compound components', () => {
    render(
      <Table className="custom-table" data-testid="table">
        <TableHeader className="custom-header">
          <TableRow className="custom-row">
            <TableHead className="custom-head">Header</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="custom-body">
          <TableRow>
            <TableCell className="custom-cell">Data</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter className="custom-footer">
          <TableRow>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableFooter>
        <TableCaption className="custom-caption">Caption</TableCaption>
      </Table>
    );

    expect(screen.getByTestId('table').className).toContain('custom-table');
    expect(screen.getByText('Header').className).toContain('custom-head');
    expect(screen.getByText('Data').className).toContain('custom-cell');
    expect(screen.getByText('Caption').className).toContain('custom-caption');
  });

  it('forwards refs properly to underlying HTML elements', () => {
    const tableRef = React.createRef<HTMLTableElement>();
    const headerRef = React.createRef<HTMLTableSectionElement>();
    const bodyRef = React.createRef<HTMLTableSectionElement>();
    const footerRef = React.createRef<HTMLTableSectionElement>();
    const rowRef = React.createRef<HTMLTableRowElement>();
    const headRef = React.createRef<HTMLTableCellElement>();
    const cellRef = React.createRef<HTMLTableCellElement>();
    const captionRef = React.createRef<HTMLTableCaptionElement>();

    render(
      <Table ref={tableRef}>
        <TableCaption ref={captionRef}>Cap</TableCaption>
        <TableHeader ref={headerRef}>
          <TableRow ref={rowRef}>
            <TableHead ref={headRef}>Col</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody ref={bodyRef}>
          <TableRow>
            <TableCell ref={cellRef}>Val</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter ref={footerRef}>
          <TableRow>
            <TableCell>Sum</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );

    expect(tableRef.current).toBeInstanceOf(HTMLTableElement);
    expect(headerRef.current).toBeInstanceOf(HTMLTableSectionElement);
    expect(bodyRef.current).toBeInstanceOf(HTMLTableSectionElement);
    expect(footerRef.current).toBeInstanceOf(HTMLTableSectionElement);
    expect(rowRef.current).toBeInstanceOf(HTMLTableRowElement);
    expect(headRef.current).toBeInstanceOf(HTMLTableCellElement);
    expect(cellRef.current).toBeInstanceOf(HTMLTableCellElement);
    expect(captionRef.current).toBeInstanceOf(HTMLTableCaptionElement);
  });
});
