import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SegmentedControl } from './SegmentedControl';

describe('SegmentedControl', () => {
  const defaultOptions = [
    { label: 'Grid', value: 'grid' },
    { label: 'List', value: 'list' },
    { label: 'Gallery', value: 'gallery', disabled: true },
  ];

  it('renders all options and selects the default or first value', () => {
    render(<SegmentedControl options={defaultOptions} />);

    expect(screen.getByRole('radio', { name: /grid/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /list/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /gallery/i })).toBeInTheDocument();

    expect(screen.getByRole('radio', { name: /grid/i })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: /list/i })).toHaveAttribute('aria-checked', 'false');
  });

  it('handles uncontrolled click selection and onValueChange callback', () => {
    const handleValueChange = vi.fn();
    const handleChange = vi.fn();
    render(
      <SegmentedControl
        options={defaultOptions}
        onValueChange={handleValueChange}
        onChange={handleChange}
      />
    );

    fireEvent.click(screen.getByRole('radio', { name: /list/i }));
    expect(handleValueChange).toHaveBeenCalledWith('list');
    expect(handleChange).toHaveBeenCalledWith('list');
    expect(screen.getByRole('radio', { name: /list/i })).toHaveAttribute('aria-checked', 'true');
  });

  it('does not select disabled options on click', () => {
    const handleValueChange = vi.fn();
    render(<SegmentedControl options={defaultOptions} onValueChange={handleValueChange} />);

    fireEvent.click(screen.getByRole('radio', { name: /gallery/i }));
    expect(handleValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole('radio', { name: /grid/i })).toHaveAttribute('aria-checked', 'true');
  });

  it('supports controlled value updates', () => {
    const { rerender } = render(<SegmentedControl options={defaultOptions} value="grid" />);
    expect(screen.getByRole('radio', { name: /grid/i })).toHaveAttribute('aria-checked', 'true');

    rerender(<SegmentedControl options={defaultOptions} value="list" />);
    expect(screen.getByRole('radio', { name: /list/i })).toHaveAttribute('aria-checked', 'true');
  });

  it('navigates with keyboard arrow keys, skipping disabled items', () => {
    const handleValueChange = vi.fn();
    render(<SegmentedControl options={defaultOptions} onValueChange={handleValueChange} />);

    const radiogroup = screen.getByRole('radiogroup');
    radiogroup.focus();

    // ArrowRight moves from grid to list
    fireEvent.keyDown(radiogroup, { key: 'ArrowRight' });
    expect(handleValueChange).toHaveBeenCalledWith('list');

    // ArrowRight again skips disabled gallery and loops back to grid
    fireEvent.keyDown(radiogroup, { key: 'ArrowRight' });
    expect(handleValueChange).toHaveBeenCalledWith('grid');

    // ArrowLeft loops backwards
    fireEvent.keyDown(radiogroup, { key: 'ArrowLeft' });
    expect(handleValueChange).toHaveBeenCalledWith('list');

    // Home key goes to first enabled option
    fireEvent.keyDown(radiogroup, { key: 'Home' });
    expect(handleValueChange).toHaveBeenCalledWith('grid');

    // End key goes to last enabled option
    fireEvent.keyDown(radiogroup, { key: 'End' });
    expect(handleValueChange).toHaveBeenCalledWith('list');
  });

  it('renders icons and badges when provided in options', () => {
    const richOptions = [
      { label: 'Active', value: 'active', icon: '★', badge: 5 },
      { label: 'Archived', value: 'archived', badge: 'New' },
    ];

    render(<SegmentedControl options={richOptions} defaultValue="active" />);

    expect(screen.getByText('★')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('renders title prefix when provided', () => {
    render(<SegmentedControl options={defaultOptions} title="Layout View:" />);
    expect(screen.getByText('Layout View:')).toBeInTheDocument();
  });

  it('supports size variants sm, default, and lg', () => {
    const { container: smContainer } = render(<SegmentedControl options={defaultOptions} size="sm" />);
    expect(smContainer.querySelector('[role="radiogroup"]')).toHaveClass('h-[1.375rem]');

    const { container: lgContainer } = render(<SegmentedControl options={defaultOptions} size="lg" />);
    expect(lgContainer.querySelector('[role="radiogroup"]')).toHaveClass('h-9');
  });

  it('disables entire control when disabled prop is true', () => {
    const handleValueChange = vi.fn();
    render(<SegmentedControl options={defaultOptions} disabled onValueChange={handleValueChange} />);

    const radiogroup = screen.getByRole('radiogroup');
    expect(radiogroup).toHaveAttribute('aria-disabled', 'true');

    fireEvent.click(screen.getByRole('radio', { name: /list/i }));
    expect(handleValueChange).not.toHaveBeenCalled();
  });
});
