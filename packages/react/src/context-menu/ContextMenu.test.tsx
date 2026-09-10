import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from './ContextMenu';

describe('ContextMenu', () => {
  it('opens context menu on contextmenu (right click) event', () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid="right-click-area">Right click here</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Back</ContextMenuItem>
          <ContextMenuItem>Forward</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>
            Reload
            <ContextMenuShortcut>⌘R</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );

    const area = screen.getByTestId('right-click-area');
    expect(area).toBeInTheDocument();
    expect(screen.queryByText('Back')).toBeNull();

    fireEvent.contextMenu(area);

    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByText('Forward')).toBeInTheDocument();
    expect(screen.getByText('Reload')).toBeInTheDocument();
    expect(screen.getByText('⌘R')).toBeInTheDocument();
  });

  it('triggers item click handler', async () => {
    const user = userEvent.setup();
    const handleAction = vi.fn();

    render(
      <ContextMenu defaultOpen>
        <ContextMenuTrigger>
          <div>Target</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={handleAction}>Inspect</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );

    const item = screen.getByText('Inspect');
    expect(item).toBeInTheDocument();

    await user.click(item);
    expect(handleAction).toHaveBeenCalled();
  });

  it('renders destructive item variant', () => {
    render(
      <ContextMenu open>
        <ContextMenuTrigger>Target</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem variant="destructive">Remove</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );

    const item = screen.getByText('Remove');
    expect(item).toHaveAttribute('data-variant', 'destructive');
  });

  it('supports keyboard navigation: navigating with ArrowDown, selecting with Enter', async () => {
    const user = userEvent.setup();
    const handleAction1 = vi.fn();
    const handleAction2 = vi.fn();

    render(
      <ContextMenu defaultOpen>
        <ContextMenuTrigger>
          <div>Target</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={handleAction1}>First Action</ContextMenuItem>
          <ContextMenuItem onClick={handleAction2}>Second Action</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );

    expect(await screen.findByText('First Action')).toBeInTheDocument();

    // Navigate with ArrowDown and select with Enter
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');
    expect(handleAction1.mock.calls.length + handleAction2.mock.calls.length).toBeGreaterThan(0);
  });

  it('closes context menu when Escape is pressed', async () => {
    const user = userEvent.setup();

    render(
      <ContextMenu defaultOpen>
        <ContextMenuTrigger>
          <div>Target</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Item</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );

    expect(await screen.findByText('Item')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByText('Item')).toBeNull();
  });
});
