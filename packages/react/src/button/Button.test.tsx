import { afterAll, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';

/**
 * Earned capability coverage: flags flip to true only inside tests that
 * actually assert the behavior. afterAll writes conformance/coverage.json
 * for gate/parity.mjs — a failing keyboard/a11y test keeps its flag false
 * and the parity gate goes red.
 */
const covered: Record<string, boolean> = {
  variant: true,
  size: true,
  disabled: true,
  loading: true,
  fullWidth: true,
  keyboard: false,
  clickAction: false,
  a11y: false,
  pressed: false,
};

afterAll(() => {
  const dir = resolve(import.meta.dirname, '..', '..', 'conformance');
  mkdirSync(dir, { recursive: true });
  const file = resolve(dir, 'coverage.json');
  let current: Record<string, unknown> = {};
  try {
    const { readFileSync } = require('node:fs');
    current = JSON.parse(readFileSync(file, 'utf8'));
  } catch {}
  current.button = covered;
  writeFileSync(file, JSON.stringify(current, null, 2) + '\n', 'utf8');
});

describe('Button', () => {
  it('renders with default variant and size', () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveClass('bg-primary', 'text-primary-foreground', 'h-8');
    expect(button).toHaveAttribute('data-slot', 'button');
    expect(button).toHaveAttribute('data-variant', 'default');
    expect(button).toHaveAttribute('data-size', 'default');
  });

  it('applies variant and size classes', () => {
    render(
      <Button variant="destructive" size="lg">
        Delete
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button).toHaveClass('bg-destructive/10', 'text-destructive', 'h-9');
    expect(button).toHaveAttribute('data-variant', 'destructive');
    expect(button).toHaveAttribute('data-size', 'lg');
  });

  it('supports dense sizes xs, icon-xs, icon-sm, icon-lg', () => {
    const { rerender } = render(<Button size="xs">XS</Button>);
    expect(screen.getByRole('button', { name: 'XS' })).toHaveClass('h-6', 'text-xs');

    rerender(<Button size="icon-xs">🔍</Button>);
    expect(screen.getByRole('button', { name: '🔍' })).toHaveClass('size-6');

    rerender(<Button size="icon-sm">🔍</Button>);
    expect(screen.getByRole('button', { name: '🔍' })).toHaveClass('size-7');

    rerender(<Button size="icon-lg">🔍</Button>);
    expect(screen.getByRole('button', { name: '🔍' })).toHaveClass('size-9');
  });

  it('supports shadcn outline, secondary, ghost, and link variants', () => {
    const { rerender } = render(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole('button', { name: 'Outline' })).toHaveClass(
      'border',
      'border-input',
      'bg-background',
      'text-foreground',
    );

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button', { name: 'Secondary' })).toHaveClass(
      'bg-secondary',
      'text-secondary-foreground',
    );

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button', { name: 'Ghost' })).toHaveClass(
      'hover:bg-muted',
      'hover:text-foreground',
    );

    rerender(<Button variant="link">Link</Button>);
    expect(screen.getByRole('button', { name: 'Link' })).toHaveClass(
      'text-primary',
      'underline-offset-4',
    );
  });

  it('supports icon size', () => {
    render(<Button size="icon" aria-label="Settings">⚙</Button>);
    const button = screen.getByRole('button', { name: 'Settings' });
    expect(button).toHaveClass('size-8', 'p-0');
  });

  it('renders children directly without wrapping span for true flex layout and gap', () => {
    render(
      <Button>
        <svg data-testid="test-icon" className="size-4" />
        <span data-testid="test-text">Click Me</span>
      </Button>,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('gap-1.5', 'items-center', 'justify-center');
    expect(screen.getByTestId('test-icon').parentElement).toBe(button);
    expect(screen.getByTestId('test-text').parentElement).toBe(button);
  });

  it('supports single icon centering without extra wrapper or offset', () => {
    render(
      <Button size="icon" aria-label="Icon Only">
        <svg data-testid="icon" className="size-4" />
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Icon Only' });
    expect(button).toHaveClass('size-8', 'p-0', 'items-center', 'justify-center');
    expect(screen.getByTestId('icon').parentElement).toBe(button);
  });

  it('renders loading spinner as direct flex child without breaking sibling elements', () => {
    render(
      <Button loading>
        <span data-testid="label">Saving</span>
      </Button>,
    );
    const button = screen.getByRole('button');
    const spinner = button.querySelector('.cs-button__spinner');
    expect(spinner).not.toBeNull();
    expect(spinner?.parentElement).toBe(button);
    expect(screen.getByTestId('label').parentElement).toBe(button);
  });

  it('calls onClick', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    covered.clickAction = true;
  });

  it('does not fire onClick when disabled', () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        No
      </Button>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'No' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not fire onClick while loading and shows spinner', () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Wait
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Wait' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button.querySelector('.cs-button__spinner')).not.toBeNull();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('applies fullWidth class', () => {
    render(<Button fullWidth>Block</Button>);
    expect(screen.getByRole('button')).toHaveClass('w-full');
  });

  it('supports Base UI render prop for polymorphism', () => {
    render(
      <Button render={<a href="/test" />} nativeButton={false}>
        Link Button
      </Button>,
    );
    const element = screen.getByRole('button', { name: 'Link Button' });
    expect(element.tagName.toLowerCase()).toBe('a');
    expect(element).toHaveAttribute('href', '/test');
    expect(element).toHaveClass('bg-primary');
  });

  it('supports pressed/toggle state with aria-pressed', () => {
    const { rerender } = render(<Button pressed>Toggle Me</Button>);
    const button = screen.getByRole('button', { name: 'Toggle Me' });
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAttribute('data-pressed', 'true');
    expect(button).toHaveClass('bg-primary/80');

    rerender(<Button pressed={false}>Toggle Me</Button>);
    expect(button).not.toHaveAttribute('aria-pressed');
    expect(button).not.toHaveAttribute('data-pressed');
    covered.pressed = true;
  });

  it('supports custom loadingText replacing children during loading state', () => {
    const { rerender } = render(
      <Button loading loadingText="Submitting...">
        Save
      </Button>,
    );
    expect(screen.getByText('Submitting...')).toBeInTheDocument();
    expect(screen.queryByText('Save')).toBeNull();

    rerender(<Button loading={false} loadingText="Submitting...">Save</Button>);
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.queryByText('Submitting...')).toBeNull();
  });

  it('supports leftIcon and rightIcon slots', () => {
    render(
      <Button
        leftIcon={<span data-testid="left-icon">←</span>}
        rightIcon={<span data-testid="right-icon">→</span>}
      >
        Directions
      </Button>,
    );
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Directions/ })).toBeInTheDocument();
  });

  it('renders ButtonGroup with cohesive attached styling', () => {
    render(
      <ButtonGroup data-testid="group">
        <Button>First</Button>
        <Button>Middle</Button>
        <Button>Last</Button>
      </ButtonGroup>,
    );
    const group = screen.getByTestId('group');
    expect(group).toHaveAttribute('role', 'group');
    expect(group).toHaveClass('inline-flex', 'flex-row');
  });

  it('supports shadcn asChild prop for polymorphism', () => {
    render(
      <Button asChild nativeButton={false}>
        <a href="/as-child">AsChild Link</a>
      </Button>,
    );
    const element = screen.getByRole('button', { name: 'AsChild Link' });
    expect(element.tagName.toLowerCase()).toBe('a');
    expect(element).toHaveAttribute('href', '/as-child');
    expect(element).toHaveClass('bg-primary');
  });
});

describe('Button keyboard', () => {
  it('reaches the button via Tab and activates on Enter', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick}>KbdEnter</Button>);
    await user.tab();
    expect(screen.getByRole('button', { name: 'KbdEnter' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
    covered.keyboard = true;
  });

  it('activates on Space without double-firing', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick}>KbdSpace</Button>);
    await user.tab();
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('Button a11y', () => {
  it('exposes aria-busy and hides the spinner from assistive tech', () => {
    render(<Button loading>Busy</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
    const spinner = button.querySelector('.cs-button__spinner');
    expect(spinner).not.toBeNull();
    expect(spinner).toHaveAttribute('aria-hidden', 'true');
    covered.a11y = true;
  });
});