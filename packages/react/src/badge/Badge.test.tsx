import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge Component', () => {
  it('renders with default props as a span with h-5 and rounded-4xl', () => {
    render(<Badge>Default Badge</Badge>);
    const badge = screen.getByText('Default Badge');
    expect(badge).toBeInTheDocument();
    expect(badge.tagName.toLowerCase()).toBe('span');
    expect(badge).toHaveAttribute('data-variant', 'default');
    expect(badge).toHaveAttribute('data-size', 'default');
    expect(badge.className).toContain('h-5');
    expect(badge.className).toContain('rounded-4xl');
  });

  it('renders all variants correctly', () => {
    const { rerender } = render(<Badge variant="secondary">Secondary</Badge>);
    expect(screen.getByText('Secondary')).toHaveAttribute('data-variant', 'secondary');

    rerender(<Badge variant="destructive">Destructive</Badge>);
    expect(screen.getByText('Destructive')).toHaveAttribute('data-variant', 'destructive');

    rerender(<Badge variant="outline">Outline</Badge>);
    expect(screen.getByText('Outline')).toHaveAttribute('data-variant', 'outline');

    rerender(<Badge variant="ghost">Ghost</Badge>);
    expect(screen.getByText('Ghost')).toHaveAttribute('data-variant', 'ghost');

    rerender(<Badge variant="link">Link</Badge>);
    expect(screen.getByText('Link')).toHaveAttribute('data-variant', 'link');
  });

  it('renders sm size correctly', () => {
    render(<Badge size="sm">Small</Badge>);
    expect(screen.getByText('Small')).toHaveAttribute('data-size', 'sm');
  });

  it('applies custom className', () => {
    render(<Badge className="custom-test-class">Custom</Badge>);
    expect(screen.getByText('Custom')).toHaveClass('custom-test-class');
  });

  it('supports forced hover and active testing hooks', () => {
    const { rerender } = render(<Badge variant="default" forceHover>Hovered</Badge>);
    expect(screen.getByText('Hovered')).toBeInTheDocument();

    rerender(<Badge variant="default" forceActive>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });
});
