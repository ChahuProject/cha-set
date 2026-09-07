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
});
