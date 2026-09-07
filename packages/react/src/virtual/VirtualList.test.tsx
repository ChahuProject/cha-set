import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VirtualList, type VirtualListHandle } from './VirtualList';

describe('VirtualList', () => {
  it('renders virtual items with renderRow', () => {
    const items = ['Item 1', 'Item 2', 'Item 3'];
    render(
      <VirtualList
        items={items}
        estimateSize={30}
        renderRow={(item) => <div>{item}</div>}
      />,
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });

  it('renders emptyNode when items array is empty', () => {
    render(
      <VirtualList
        items={[]}
        estimateSize={30}
        renderRow={(item) => <div>{item}</div>}
        emptyNode={<div>No items available</div>}
      />,
    );

    expect(screen.getByText('No items available')).toBeInTheDocument();
  });

  it('exposes scrollToIndex via ref handle', () => {
    const ref = React.createRef<VirtualListHandle>();
    render(
      <VirtualList
        ref={ref}
        items={['A', 'B', 'C']}
        estimateSize={30}
        renderRow={(item) => <div>{item}</div>}
      />,
    );

    expect(ref.current).toBeDefined();
    expect(typeof ref.current?.scrollToIndex).toBe('function');
  });
});
