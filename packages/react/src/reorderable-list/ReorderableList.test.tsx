import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReorderableList, type ReorderableListItem } from './ReorderableList';

describe('ReorderableList (React)', () => {
  const sampleItems: ReorderableListItem[] = [
    { id: 'name', label: 'File Name', visible: true },
    { id: 'size', label: 'File Size', visible: true },
    { id: 'type', label: 'Item Type', visible: false },
    { id: 'date', label: 'Modified Date', visible: true },
  ];

  it('renders all item labels', () => {
    render(<ReorderableList items={sampleItems} />);

    expect(screen.getByText('File Name')).toBeInTheDocument();
    expect(screen.getByText('File Size')).toBeInTheDocument();
    expect(screen.getByText('Item Type')).toBeInTheDocument();
    expect(screen.getByText('Modified Date')).toBeInTheDocument();
  });

  it('renders drag grip handles when reorderable is true', () => {
    const { container } = render(<ReorderableList items={sampleItems} reorderable={true} />);
    const grips = container.querySelectorAll('[data-slot="reorderable-grip"]');
    expect(grips.length).toBe(4);
  });

  it('does not render drag grip handles when reorderable is false', () => {
    const { container } = render(<ReorderableList items={sampleItems} reorderable={false} />);
    const grips = container.querySelectorAll('[data-slot="reorderable-grip"]');
    expect(grips.length).toBe(0);
  });

  it('toggles visibility on normal click', () => {
    const onEdited = vi.fn();
    const onTriggered = vi.fn();

    render(
      <ReorderableList
        items={sampleItems}
        onItemsEdited={onEdited}
        onActionTriggered={onTriggered}
      />,
    );

    const actionBtns = screen.getAllByRole('button');
    // Click first item (visible: true -> false)
    expect(actionBtns[0]).toBeDefined();
    fireEvent.click(actionBtns[0]!);

    expect(onTriggered).toHaveBeenCalledWith(0, 'visible', false);
    expect(onEdited).toHaveBeenCalledTimes(1);
    expect(onEdited.mock.calls[0]![0][0].visible).toBe(false);
  });

  it('handles Alt+Click solo isolation and invert behavior', () => {
    const onEdited = vi.fn();
    const onTriggered = vi.fn();

    const { rerender } = render(
      <ReorderableList
        items={sampleItems}
        onItemsEdited={onEdited}
        onActionTriggered={onTriggered}
      />,
    );

    const actionBtns = screen.getAllByRole('button');

    // 1. Alt+Click on item index 1 (File Size): solo mode (only index 1 is true)
    expect(actionBtns[1]).toBeDefined();
    fireEvent.click(actionBtns[1]!, { altKey: true });
    expect(onTriggered).toHaveBeenCalledWith(1, 'visible', true);
    const soloItems = onEdited.mock.calls[0]![0];
    expect(soloItems[0].visible).toBe(false);
    expect(soloItems[1].visible).toBe(true);
    expect(soloItems[2].visible).toBe(false);
    expect(soloItems[3].visible).toBe(false);

    // 2. Alt+Click again when already solo: inverts (all others true, index 1 false)
    rerender(
      <ReorderableList
        items={soloItems}
        onItemsEdited={onEdited}
        onActionTriggered={onTriggered}
      />,
    );

    const updatedBtns = screen.getAllByRole('button');
    expect(updatedBtns[1]).toBeDefined();
    fireEvent.click(updatedBtns[1]!, { altKey: true });
    expect(onTriggered).toHaveBeenCalledWith(1, 'visible', false);
    const invertedItems = onEdited.mock.calls[1]![0];
    expect(invertedItems[0].visible).toBe(true);
    expect(invertedItems[1].visible).toBe(false);
    expect(invertedItems[2].visible).toBe(true);
    expect(invertedItems[3].visible).toBe(true);
  });

  it('supports custom actionColumns configuration', () => {
    const onTriggered = vi.fn();
    const customItems = [
      { id: 'col1', label: 'Column 1', pinned: true, locked: false },
    ];

    render(
      <ReorderableList
        items={customItems}
        actionColumns={[
          { key: 'pinned', tooltip: 'Pin Column' },
          { key: 'locked', tooltip: 'Lock Column' },
        ]}
        onActionTriggered={onTriggered}
      />,
    );

    const btns = screen.getAllByRole('button');
    expect(btns.length).toBe(2);

    expect(btns[1]).toBeDefined();
    fireEvent.click(btns[1]!); // toggle locked
    expect(onTriggered).toHaveBeenCalledWith(0, 'locked', true);
  });
});
