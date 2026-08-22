import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Button } from './Button';

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
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('applies fullWidth class', () => {
    render(<Button fullWidth>Block</Button>);
    expect(screen.getByRole('button')).toHaveClass('cs-button--full');
  });
});