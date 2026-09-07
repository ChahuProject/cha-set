import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './Collapsible';

describe('Collapsible Component', () => {
  it('renders trigger and expands/collapses content on click (standard capability)', async () => {
    const user = userEvent.setup();
    render(
      <Collapsible>
        <CollapsibleTrigger>Toggle Details</CollapsibleTrigger>
        <CollapsibleContent data-testid="panel">
          <div>Collapsible Secret Content</div>
        </CollapsibleContent>
      </Collapsible>,
    );

    const trigger = screen.getByRole('button', { name: 'Toggle Details' });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('data-slot', 'collapsible-trigger');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    // Closed by default: panel is unmounted or hidden
    expect(screen.queryByText('Collapsible Secret Content')).toBeNull();

    // Click to open
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const panel = screen.getByTestId('panel');
    expect(panel).toHaveAttribute('data-slot', 'collapsible-content');
    expect(screen.getByText('Collapsible Secret Content')).toBeVisible();

    // Click to close
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Collapsible Secret Content')).toBeNull();
  });

  it('renders initially open when defaultOpen is true (defaultOpen capability)', () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent data-testid="panel">
          <div>Initially Open Content</div>
        </CollapsibleContent>
      </Collapsible>,
    );

    const trigger = screen.getByRole('button', { name: 'Toggle' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    const panel = screen.getByTestId('panel');
    expect(screen.getByText('Initially Open Content')).toBeVisible();
  });

  it('supports controlled open and triggers onOpenChange', async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    function ControlledWrapper() {
      const [open, setOpen] = React.useState(false);
      return (
        <Collapsible
          open={open}
          onOpenChange={(nextOpen) => {
            setOpen(nextOpen);
            handleOpenChange(nextOpen);
          }}
        >
          <CollapsibleTrigger>Controlled Trigger</CollapsibleTrigger>
          <CollapsibleContent data-testid="panel">
            <div>Controlled Panel Content</div>
          </CollapsibleContent>
        </Collapsible>
      );
    }

    render(<ControlledWrapper />);

    const trigger = screen.getByRole('button', { name: 'Controlled Trigger' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Controlled Panel Content')).toBeNull();

    await user.click(trigger);
    expect(handleOpenChange).toHaveBeenCalledWith(true);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Controlled Panel Content')).toBeVisible();
  });

  it('blocks interaction when disabled (disabled capability)', async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    render(
      <Collapsible disabled onOpenChange={handleOpenChange}>
        <CollapsibleTrigger>Disabled Trigger</CollapsibleTrigger>
        <CollapsibleContent data-testid="panel">
          <div>Disabled Content</div>
        </CollapsibleContent>
      </Collapsible>,
    );

    const trigger = screen.getByRole('button', { name: 'Disabled Trigger' });
    expect(trigger).toHaveAttribute('aria-disabled', 'true');
    expect(trigger).toHaveAttribute('data-disabled');

    await user.click(trigger);
    expect(handleOpenChange).not.toHaveBeenCalled();
    expect(screen.queryByText('Disabled Content')).toBeNull();
  });

  it('supports asChild pattern on trigger', async () => {
    const user = userEvent.setup();
    render(
      <Collapsible>
        <CollapsibleTrigger asChild>
          <div role="button" tabIndex={0} data-testid="custom-trigger">
            Custom Child Trigger
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent data-testid="panel">
          <div>Child Trigger Content</div>
        </CollapsibleContent>
      </Collapsible>,
    );

    const trigger = screen.getByTestId('custom-trigger');
    expect(trigger).toBeInTheDocument();
    expect(trigger.tagName.toLowerCase()).toBe('div');
    expect(trigger).toHaveAttribute('data-slot', 'collapsible-trigger');

    await user.click(trigger);
    expect(screen.getByTestId('panel')).toBeInTheDocument();
    expect(screen.getByText('Child Trigger Content')).toBeVisible();
  });

  it('applies custom className to elements', () => {
    render(
      <Collapsible defaultOpen className="custom-root">
        <CollapsibleTrigger className="custom-trigger">Trigger</CollapsibleTrigger>
        <CollapsibleContent className="custom-content" data-testid="panel">
          Content
        </CollapsibleContent>
      </Collapsible>,
    );

    const root = screen.getByRole('button', { name: 'Trigger' }).closest('[data-slot="collapsible"]');
    expect(root).toHaveClass('custom-root');
    expect(screen.getByRole('button', { name: 'Trigger' })).toHaveClass('custom-trigger');
    expect(screen.getByTestId('panel')).toHaveClass('custom-content');
  });
});
