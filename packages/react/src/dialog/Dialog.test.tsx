import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from './Dialog';

describe('Dialog', () => {
  it('renders nothing when closed by default', () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Hello</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument();
  });

  it('renders content when open is true (controlled)', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle>Controlled Dialog</DialogTitle>
          <DialogDescription>Description text</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText('Controlled Dialog')).toBeInTheDocument();
    expect(screen.getByText('Description text')).toBeInTheDocument();
  });

  it('opens dialog when trigger is clicked (uncontrolled)', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Uncontrolled Title</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.queryByRole('dialog')).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Uncontrolled Title')).toBeInTheDocument();
  });

  it('closes dialog when top-right close button is clicked', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Dialog defaultOpen onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogTitle>Close Me</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: 'Close' });
    await user.click(closeButton);

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('closes dialog when backdrop overlay is clicked', () => {
    const onOpenChange = vi.fn();

    render(
      <Dialog defaultOpen onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogTitle>Backdrop Test</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    const overlay = document.querySelector('[data-slot="dialog-overlay"]');
    expect(overlay).not.toBeNull();

    fireEvent.click(overlay!);

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('does not close dialog when clicking inside content card', () => {
    const onOpenChange = vi.fn();

    render(
      <Dialog defaultOpen onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogTitle>Card Content</DialogTitle>
          <p>Internal message</p>
        </DialogContent>
      </Dialog>,
    );

    const contentCard = screen.getByRole('dialog');
    fireEvent.click(contentCard);

    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes dialog when Escape key is pressed', () => {
    const onOpenChange = vi.fn();

    render(
      <Dialog defaultOpen onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogTitle>Escape Test</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders title and description with correct accessibility relationships', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>A11y Dialog Title</DialogTitle>
            <DialogDescription>A11y Dialog Description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    );

    const dialog = screen.getByRole('dialog');
    const title = screen.getByText('A11y Dialog Title');
    const desc = screen.getByText('A11y Dialog Description');

    expect(dialog).toHaveAttribute('aria-labelledby', title.id);
    expect(dialog).toHaveAttribute('aria-describedby', desc.id);
  });

  it('supports full subcomponents hierarchy and DialogClose action', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Dialog defaultOpen onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Flow</DialogTitle>
            <DialogDescription>Testing subcomponent hierarchy</DialogDescription>
          </DialogHeader>
          <div data-testid="custom-body">Form body content</div>
          <DialogFooter>
            <DialogClose>Cancel</DialogClose>
            <button type="button">Submit</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByTestId('custom-body')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('supports asChild pattern on DialogTrigger and DialogClose', async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger asChild>
          <a href="#open-modal">Custom Anchor Trigger</a>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>AsChild Dialog</DialogTitle>
          <DialogFooter>
            <DialogClose asChild>
              <button type="button" className="custom-close-btn">
                Close via asChild
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    const customTrigger = screen.getByText('Custom Anchor Trigger');
    expect(customTrigger.tagName.toLowerCase()).toBe('a');

    await user.click(customTrigger);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const customClose = screen.getByRole('button', { name: 'Close via asChild' });
    expect(customClose).toHaveClass('custom-close-btn');

    await user.click(customClose);
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
