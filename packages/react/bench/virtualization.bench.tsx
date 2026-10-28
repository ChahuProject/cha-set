import * as React from 'react';
import { bench, describe } from 'vitest';
import { render } from '@testing-library/react';
import { VirtualList } from '../src/virtual/VirtualList';
import { GenericDataTable } from '../src/data-table/GenericDataTable';

describe('Tier 1: High-Density Virtualization Benchmarks', () => {
  const items1k = Array.from({ length: 1000 }, (_, i) => ({
    id: `id-${i}`,
    label: `Item ${i}`,
    detail: `Telemetry record for index ${i}`,
  }));

  const items10k = Array.from({ length: 10000 }, (_, i) => ({
    id: `id-${i}`,
    label: `Item ${i}`,
    detail: `High density payload index ${i}`,
  }));

  bench('VirtualList mount 1,000 items', () => {
    const { unmount } = render(
      <div style={{ height: 400, width: 300 }}>
        <VirtualList
          items={items1k}
          estimateSize={36}
          renderItem={(item) => (
            <div key={item.id} className="h-9 px-2 flex items-center">
              <span>{item.label}</span>
            </div>
          )}
        />
      </div>
    );
    unmount();
  });

  bench('VirtualList mount 10,000 items', () => {
    const { unmount } = render(
      <div style={{ height: 400, width: 300 }}>
        <VirtualList
          items={items10k}
          estimateSize={36}
          renderItem={(item) => (
            <div key={item.id} className="h-9 px-2 flex items-center">
              <span>{item.label}</span>
            </div>
          )}
        />
      </div>
    );
    unmount();
  });

  const columns = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'cpu', header: 'CPU' },
    { accessorKey: 'mem', header: 'Memory' },
    { accessorKey: 'net', header: 'Network' },
  ];

  const tableData500 = Array.from({ length: 500 }, (_, i) => ({
    id: `ROW-${i}`,
    name: `Worker Process ${i}`,
    status: i % 2 === 0 ? 'running' : 'idle',
    cpu: `${(i % 100) * 0.8}%`,
    mem: `${i * 12}MB`,
    net: '1.2MB/s',
  }));

  bench('GenericDataTable mount 500 rows with 6 columns', () => {
    const { unmount } = render(
      <GenericDataTable
        columns={columns}
        data={tableData500}
        enablePagination={false}
        enableGlobalFilter={false}
      />
    );
    unmount();
  });
});
