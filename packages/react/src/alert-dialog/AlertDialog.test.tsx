import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from './AlertDialog';

describe('AlertDialog', () => {
  it('renders trigger and opens dialog when clicked', async () => {
    const user = userEvent.setup();
    render(
      <AlertDialog>
        <AlertDialogTrigger>Delete Account</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    );

    const trigger = screen.getByRole('button', { name: 'Delete Account' });
    expect(trigger).toBeInTheDocument();
    expect(screen.queryByText('Are you absolutely sure?')).toBeNull();

    await user.click(trigger);
    expect(screen.getByText('Are you absolutely sure?')).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
  });

  it('closes dialog when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    render(
      <AlertDialog defaultOpen onOpenChange={handleOpenChange}>
        <AlertDialogContent>
          <AlertDialogTitle>Confirm Action</AlertDialogTitle>
          <AlertDialogFooter>
            <AlertDialogCancel>Abort</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    );

    const abortButton = screen.getByRole('button', { name: 'Abort' });
    await user.click(abortButton);

    expect(handleOpenChange).toHaveBeenCalledWith(false, expect.anything());
    expect(screen.queryByText('Confirm Action')).toBeNull();
  });

  it('closes dialog when action button is clicked', async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    render(
      <AlertDialog defaultOpen onOpenChange={handleOpenChange}>
        <AlertDialogContent>
          <AlertDialogTitle>Confirm Action</AlertDialogTitle>
          <AlertDialogFooter>
            <AlertDialogAction>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    );

    const confirmButton = screen.getByRole('button', { name: 'Confirm' });
    await user.click(confirmButton);

    expect(handleOpenChange).toHaveBeenCalledWith(false, expect.anything());
    expect(screen.queryByText('Confirm Action')).toBeNull();
  });

  it('closes dialog when Escape key is pressed', async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    render(
      <AlertDialog defaultOpen onOpenChange={handleOpenChange}>
        <AlertDialogContent>
          <AlertDialogTitle>Confirm Action</AlertDialogTitle>
          <AlertDialogFooter>
            <AlertDialogCancel>Abort</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    );

    expect(screen.getByText('Confirm Action')).toBeInTheDocument();

    (document.activeElement as HTMLElement)?.blur();
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    expect(handleOpenChange).toHaveBeenCalledWith(false, expect.anything());
    expect(screen.queryByText('Confirm Action')).toBeNull();
  });

  it('renders with size variant classes on content', () => {
    const { rerender } = render(
      <AlertDialog defaultOpen>
        <AlertDialogContent size="sm">
          <AlertDialogTitle>Small Dialog</AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialog>,
    );

    expect(screen.getByRole('alertdialog')).toHaveClass('max-w-md');

    rerender(
      <AlertDialog defaultOpen>
        <AlertDialogContent size="lg">
          <AlertDialogTitle>Large Dialog</AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialog>,
    );

    expect(screen.getByRole('alertdialog')).toHaveClass('max-w-xl');
  });

  it('renders action with destructive variant', () => {
    render(
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
          <AlertDialogFooter>
            <AlertDialogAction variant="destructive">Delete Item</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    );

    const actionBtn = screen.getByRole('button', { name: 'Delete Item' });
    expect(actionBtn).toHaveClass('text-destructive');
  });

  it('respects closeOnOverlayClick setting', async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    // Default: closeOnOverlayClick is false
    const { rerender } = render(
      <AlertDialog defaultOpen onOpenChange={handleOpenChange}>
        <AlertDialogContent closeOnOverlayClick={false}>
          <AlertDialogTitle>Overlay Test</AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialog>,
    );

    const overlay = document.querySelector('[data-slot="alert-dialog-overlay"]') as HTMLElement;
    expect(overlay).toBeInTheDocument();
    await user.click(overlay);
    expect(handleOpenChange).not.toHaveBeenCalled();

    // When closeOnOverlayClick is true
    rerender(
      <AlertDialog defaultOpen onOpenChange={handleOpenChange}>
        <AlertDialogContent closeOnOverlayClick={true}>
          <AlertDialogTitle>Overlay Test</AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialog>,
    );

    const activeOverlay = document.querySelector('[data-slot="alert-dialog-overlay"]') as HTMLElement;
    await user.click(activeOverlay);
    expect(handleOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });
});
