import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Separator } from './Separator';

describe('Separator Component', () => {
  it('renders horizontal separator with default props', () => {
    render(<Separator data-testid="separator" />);
    const separator = screen.getByTestId('separator');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute('data-slot', 'separator');
    expect(separator).toHaveAttribute('data-orientation', 'horizontal');
    expect(separator).toHaveClass('h-[1px]', 'w-full', 'bg-border', 'shrink-0');
  });

  it('renders vertical separator when orientation is vertical', () => {
    render(<Separator orientation="vertical" data-testid="separator" />);
    const separator = screen.getByTestId('separator');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute('data-slot', 'separator');
    expect(separator).toHaveAttribute('data-orientation', 'vertical');
    expect(separator).toHaveClass('h-full', 'w-[1px]', 'bg-border', 'shrink-0');
  });

  it('applies custom className', () => {
    render(<Separator className="my-4 bg-muted" data-testid="separator" />);
    const separator = screen.getByTestId('separator');
    expect(separator).toHaveClass('my-4', 'bg-muted');
  });

  it('renders with decorative accessibility defaults (role="none", no aria-orientation)', () => {
    render(<Separator data-testid="separator" />);
    const separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('role', 'none');
    expect(separator).not.toHaveAttribute('aria-orientation');
  });

  it('renders with semantic separator role and aria-orientation when decorative={false}', () => {
    const { rerender } = render(<Separator decorative={false} data-testid="separator" />);
    let separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('role', 'separator');
    expect(separator).toHaveAttribute('aria-orientation', 'horizontal');

    rerender(<Separator decorative={false} orientation="vertical" data-testid="separator" />);
    separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('role', 'separator');
    expect(separator).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Separator ref={ref} data-testid="separator" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('supports dashed and dotted variants', () => {
    const { rerender } = render(<Separator variant="dashed" data-testid="separator" />);
    let separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('data-variant', 'dashed');
    expect(separator.className).toContain('border-dashed');

    rerender(<Separator variant="dotted" orientation="vertical" data-testid="separator" />);
    separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('data-variant', 'dotted');
    expect(separator.className).toContain('border-dotted');
  });

  it('renders label with center, left, and right positions', () => {
    const { rerender } = render(<Separator label="Continue with" data-testid="separator" />);
    let separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('data-has-label', 'true');
    expect(screen.getByText('Continue with')).toBeInTheDocument();

    rerender(<Separator label="Section Header" labelPosition="left" data-testid="separator" />);
    separator = screen.getByTestId('separator');
    expect(screen.getByText('Section Header')).toBeInTheDocument();

    rerender(<Separator label="End of list" labelPosition="right" data-testid="separator" />);
    separator = screen.getByTestId('separator');
    expect(screen.getByText('End of list')).toBeInTheDocument();
  });

  it('supports children as label content', () => {
    render(<Separator data-testid="separator">Or with email</Separator>);
    expect(screen.getByText('Or with email')).toBeInTheDocument();
  });
});
