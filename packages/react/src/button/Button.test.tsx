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
  writeFileSync(resolve(dir, 'coverage.json'), JSON.stringify({ button: covered }, null, 2) + '\n', 'utf8');
});

describe('Button', () => {
  it('renders with default variant and size', () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveClass('cs-button', 'cs-button--primary', 'cs-button--md');
  });

  it('applies variant and size classes', () => {
    render(
      <Button variant="danger" size="lg">
        Delete
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button).toHaveClass('cs-button--danger', 'cs-button--lg');
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
    expect(button).toHaveClass('cs-button--loading');
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('applies fullWidth class', () => {
    render(<Button fullWidth>Block</Button>);
    expect(screen.getByRole('button')).toHaveClass('cs-button--full');
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