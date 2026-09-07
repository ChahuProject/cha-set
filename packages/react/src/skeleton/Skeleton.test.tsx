import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('renders skeleton with pulse animation by default', () => {
    const { container } = render(<Skeleton className="w-32 h-4" />);
    const el = container.querySelector('[data-slot="skeleton"]');
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('animate-pulse');
    expect(el).toHaveClass('w-32');
    expect(el).toHaveClass('h-4');
  });

  it('supports disabling pulse animation', () => {
    const { container } = render(<Skeleton animate={false} />);
    const el = container.querySelector('[data-slot="skeleton"]');
    expect(el).not.toHaveClass('animate-pulse');
  });

  it('supports rounded variants', () => {
    const { container: c1 } = render(<Skeleton rounded="full" />);
    expect(c1.querySelector('[data-slot="skeleton"]')).toHaveClass('rounded-full');

    const { container: c2 } = render(<Skeleton rounded="none" />);
    expect(c2.querySelector('[data-slot="skeleton"]')).toHaveClass('rounded-none');
  });
});
