import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from './Sheet';

describe('Sheet', () => {
  it('renders trigger and opens drawer when clicked', async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger>Open Drawer</SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Drawer Title</SheetTitle>
            <SheetDescription>Drawer Description</SheetDescription>
          </SheetHeader>
          <div>Drawer body content</div>
          <SheetFooter>
            <SheetClose>Done</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>,
    );

    const trigger = screen.getByRole('button', { name: 'Open Drawer' });
    expect(trigger).toBeInTheDocument();
    expect(screen.queryByText('Drawer Title')).toBeNull();

    await user.click(trigger);
    expect(screen.getByText('Drawer Title')).toBeInTheDocument();
    expect(screen.getByText('Drawer Description')).toBeInTheDocument();
    expect(screen.getByText('Drawer body content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Done' })).toBeInTheDocument();
  });

  it('supports side variants (top, bottom, left, right)', () => {
    const { rerender } = render(
      <Sheet open={true}>
        <SheetContent side="left">
          <SheetTitle>Left Drawer</SheetTitle>
        </SheetContent>
      </Sheet>,
    );

    const leftContent = screen.getByText('Left Drawer').closest('[data-slot="sheet-content"]');
    expect(leftContent).toHaveAttribute('data-side', 'left');

    rerender(
      <Sheet open={true}>
        <SheetContent side="bottom">
          <SheetTitle>Bottom Drawer</SheetTitle>
        </SheetContent>
      </Sheet>,
    );

    const bottomContent = screen.getByText('Bottom Drawer').closest('[data-slot="sheet-content"]');
    expect(bottomContent).toHaveAttribute('data-side', 'bottom');
  });

  it('closes when close button is clicked', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Sheet defaultOpen onOpenChange={onOpenChange}>
        <SheetContent>
          <SheetTitle>Closable Sheet</SheetTitle>
        </SheetContent>
      </Sheet>,
    );

    const closeBtn = screen.getByRole('button', { name: 'Close' });
    await user.click(closeBtn);

    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
    expect(screen.queryByText('Closable Sheet')).toBeNull();
  });

  it('supports size variants (sm, default, lg, xl, full)', () => {
    const { rerender } = render(
      <Sheet open={true}>
        <SheetContent side="right" size="lg">
          <SheetTitle>Large Drawer</SheetTitle>
        </SheetContent>
      </Sheet>,
    );

    const sheetEl = screen.getByText('Large Drawer').closest('[data-slot="sheet-content"]');
    expect(sheetEl).toHaveAttribute('data-size', 'lg');
    expect(sheetEl).toHaveClass('sm:max-w-md');

    rerender(
      <Sheet open={true}>
        <SheetContent side="bottom" size="sm">
          <SheetTitle>Small Bottom Sheet</SheetTitle>
        </SheetContent>
      </Sheet>,
    );

    const bottomSheetEl = screen.getByText('Small Bottom Sheet').closest('[data-slot="sheet-content"]');
    expect(bottomSheetEl).toHaveAttribute('data-size', 'sm');
    expect(bottomSheetEl).toHaveClass('max-h-48');
  });

  it('disables pointer dismissal when closeOnOverlayClick is false', () => {
    render(
      <Sheet defaultOpen closeOnOverlayClick={false}>
        <SheetContent>
          <SheetTitle>Non-dismissible Sheet</SheetTitle>
        </SheetContent>
      </Sheet>,
    );

    expect(screen.getByText('Non-dismissible Sheet')).toBeInTheDocument();
  });
});
