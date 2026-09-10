import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuShortcut,
} from './DropdownMenu';

describe('DropdownMenu', () => {
  it('renders trigger and opens menu when clicked', async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuItem>Item 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const trigger = screen.getByRole('button', { name: 'Open Menu' });
    expect(trigger).toBeInTheDocument();
    expect(screen.queryByText('Item 1')).toBeNull();

    fireEvent.click(trigger);
    expect(await screen.findByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('triggers item onSelect or click handler', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleClick}>Action 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const item = screen.getByText('Action 1');
    expect(item).toBeInTheDocument();

    await user.click(item);
    expect(handleClick).toHaveBeenCalled();
  });

  it('renders labels, separators, and shortcuts', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Group Header</DropdownMenuLabel>
            <DropdownMenuItem>
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    expect(screen.getByText('Group Header')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('⇧⌘P')).toBeInTheDocument();
    const deleteItem = screen.getByText('Delete');
    expect(deleteItem).toHaveAttribute('data-variant', 'destructive');
  });

  it('renders checkbox and radio items', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Options</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked={true}>Show Grid</DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value="dark">
            <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    expect(screen.getByText('Show Grid')).toBeInTheDocument();
    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
  });

  it('supports asChild pattern on trigger', async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" className="custom-btn">Custom Trigger</button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Nested Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const trigger = screen.getByRole('button', { name: 'Custom Trigger' });
    expect(trigger).toHaveClass('custom-btn');

    fireEvent.click(trigger);
    expect(await screen.findByText('Nested Item')).toBeInTheDocument();
  });

  it('supports keyboard navigation: opening with Enter/Space, navigating with ArrowDown, selecting with Enter', async () => {
    const user = userEvent.setup();
    const handleAction1 = vi.fn();
    const handleAction2 = vi.fn();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleAction1}>Action 1</DropdownMenuItem>
          <DropdownMenuItem onClick={handleAction2}>Action 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const trigger = screen.getByRole('button', { name: 'Menu' });
    trigger.focus();

    // Open with Enter
    await user.keyboard('{Enter}');
    expect(await screen.findByText('Action 1')).toBeInTheDocument();

    // When opened with Enter, first item is focused; ArrowDown navigates to second item
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');
    expect(handleAction2).toHaveBeenCalled();
  });

  it('supports opening with Space and closing with Escape', async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Action 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const trigger = screen.getByRole('button', { name: 'Menu' });
    trigger.focus();

    // Open with Space
    await user.keyboard(' ');
    expect(await screen.findByText('Action 1')).toBeInTheDocument();

    // Close with Escape
    await user.keyboard('{Escape}');
    expect(screen.queryByText('Action 1')).toBeNull();
  });
});
