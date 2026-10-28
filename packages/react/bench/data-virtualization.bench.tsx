import * as React from 'react';
import { bench, describe } from 'vitest';
import { render } from '@testing-library/react';
import {
  VirtualList,
  VirtualGrid,
  VirtualTree,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  GenericDataTable,
  ScrollArea,
} from '../src';

describe('Performance Suite: Data & Virtualization (7 Components)', () => {
  const items1k = Array.from({ length: 1000 }, (_, i) => ({ id: `id-${i}`, label: `Item ${i}` }));
  const items10k = Array.from({ length: 10000 }, (_, i) => ({ id: `id-${i}`, label: `Item ${i}` }));

  bench('VirtualList (1,000 items mount)', () => {
    const { unmount } = render(
      <div style={{ height: 400, width: 300 }}>
        <VirtualList
          items={items1k}
          estimateSize={36}
          renderItem={(item) => <div>{item.label}</div>}
        />
      </div>
    );
    unmount();
  });

  bench('VirtualList (10,000 items mount)', () => {
    const { unmount } = render(
      <div style={{ height: 400, width: 300 }}>
        <VirtualList
          items={items10k}
          estimateSize={36}
          renderItem={(item) => <div>{item.label}</div>}
        />
      </div>
    );
    unmount();
  });

  bench('VirtualGrid (1,000 items mount)', () => {
    const { unmount } = render(
      <div style={{ height: 400, width: 600 }}>
        <VirtualGrid
          items={items1k}
          estimateSize={120}
          renderCard={(item) => <div>{item.label}</div>}
        />
      </div>
    );
    unmount();
  });

  const treeNodes = Array.from({ length: 100 }, (_, i) => ({
    id: `node-${i}`,
    label: `Folder ${i}`,
    children: Array.from({ length: 10 }, (_, j) => ({
      id: `node-${i}-${j}`,
      label: `Child File ${i}-${j}`,
    })),
  }));

  bench('VirtualTree (1,000 tree nodes mount)', () => {
    const { unmount } = render(
      <div style={{ height: 400, width: 300 }}>
        <VirtualTree nodes={treeNodes} />
      </div>
    );
    unmount();
  });

  bench('Table (100 rows mount)', () => {
    const { unmount } = render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 100 }, (_, i) => (
            <TableRow key={i}>
              <TableCell>{i}</TableCell>
              <TableCell>Row {i}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
    unmount();
  });

  const tableCols = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'status', header: 'Status' },
  ];

  bench('GenericDataTable (500 rows mount)', () => {
    const { unmount } = render(
      <GenericDataTable
        columns={tableCols}
        data={items1k.slice(0, 500)}
        enablePagination={false}
        enableGlobalFilter={false}
      />
    );
    unmount();
  });

  bench('ScrollArea (50x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 50 }, (_, i) => (
          <ScrollArea key={i} className="h-24 w-40">
            <div>Scrollable Content {i}</div>
          </ScrollArea>
        ))}
      </div>
    );
    unmount();
  });

  bench('SmoothWheelHandler (10,000 continuous tick calculations)', () => {
    let currentPos = 0;
    let targetPos = 0;
    const maxScroll = 50000;
    const duration = 200;
    const startTime = 1000;

    for (let i = 0; i < 10000; i++) {
      const delta = (i % 2 === 0 ? 120 : -120) * 1.2;
      const base = targetPos;
      targetPos = Math.max(0, Math.min(maxScroll, base + delta));

      const now = startTime + (i % 200);
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = 1 - Math.pow(1 - progress, 3);
      currentPos = currentPos + (targetPos - currentPos) * ease;
    }
  });
});
