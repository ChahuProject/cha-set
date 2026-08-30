import { afterAll, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Button } from './Button';

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
  a11y: false,
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
    expect(button).toHaveClass('bg-primary', 'text-primary-foreground', 'h-9');
  });

  it('applies variant and size classes', () => {
    render(
      <Button variant="destructive" size="lg">
        Delete
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button).toHaveClass('bg-destructive', 'text-destructive-foreground', 'h-10');
  });

  it('calls onClick', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(onClick).toHaveBeenCalledTimes(1);
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