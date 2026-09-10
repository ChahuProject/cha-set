import * as React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VirtualGrid } from './VirtualGrid';

describe('VirtualGrid', () => {
  it('renders cards in a virtualized responsive grid', () => {
    const items = ['Card 1', 'Card 2', 'Card 3'];
    render(
      <VirtualGrid
        items={items}
        minColumnWidthRem={10}
        estimateSize={150}
        renderCard={(item) => <div>{item}</div>}
      />,
    );

    expect(screen.getByText('Card 1')).toBeInTheDocument();
    expect(screen.getByText('Card 2')).toBeInTheDocument();
  });

  it('renders emptyNode when empty', () => {
    render(
      <VirtualGrid
        items={[]}
        renderCard={(item) => <div>{item}</div>}
        emptyNode={<div>No cards available</div>}
      />,
    );

    expect(screen.getByText('No cards available')).toBeInTheDocument();
  });

  it('supports renderItem alias, gapRem, overscan, and ref scrollToIndex', () => {
    const ref = React.createRef<any>();
    render(
      <VirtualGrid
        ref={ref}
        items={['Card A', 'Card B']}
        minColumnWidthRem={8}
        gapRem={1}
        overscan={6}
        renderItem={(item) => <div>{item}</div>}
      />,
    );

    expect(screen.getByText('Card A')).toBeInTheDocument();
    expect(ref.current).toBeDefined();
    expect(typeof ref.current.scrollToIndex).toBe('function');
  });
});
