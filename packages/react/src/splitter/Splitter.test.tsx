import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Splitter } from './Splitter';

describe('Splitter', () => {
  it('renders vertical separator role and attributes', () => {
    render(<Splitter initialSize={30} />);
    const sep = screen.getByRole('separator');
    expect(sep).toBeInTheDocument();
    expect(sep).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('resets to initial size on double click', () => {
    const onChange = vi.fn();
    render(<Splitter initialSize={40} size={75} onChange={onChange} />);

    const sep = screen.getByRole('separator');
    fireEvent.doubleClick(sep);

    expect(onChange).toHaveBeenCalledWith(40);
  });
});
