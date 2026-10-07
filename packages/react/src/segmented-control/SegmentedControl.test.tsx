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
      { label: 'Active', value: 'active', icon: <span data-testid="active-icon">ICON</span>, badge: 5 },
      { label: 'Archived', value: 'archived', badge: 'New' },
    ];

    render(<SegmentedControl options={richOptions} defaultValue="active" />);

    expect(screen.getByTestId('active-icon')).toBeInTheDocument();
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

  it('supports equalWidth and itemWidth with label truncation', () => {
    const longOptions = [
      { label: 'Very Long Option Text That Exceeds Segment Boundary', value: 'long' },
      { label: 'Short', value: 'short' },
    ];

    const { container: eqContainer } = render(
      <SegmentedControl options={longOptions} equalWidth />
    );
    const buttons = eqContainer.querySelectorAll('button[role="radio"]');
    expect(buttons[0]).toHaveClass('flex-1', 'min-w-0');
    expect(buttons[0]?.querySelector('span.truncate')).toBeInTheDocument();

    const { container: fixedContainer } = render(
      <SegmentedControl options={longOptions} itemWidth={100} />
    );
    const fixedBtn = fixedContainer.querySelector('button[role="radio"]') as HTMLElement;
    expect(fixedBtn).toHaveStyle({ width: '6.25rem' });
    expect(fixedBtn?.querySelector('span.truncate')).toBeInTheDocument();
  });

  describe('tooltips', () => {
    it('renders string tooltip when option is hovered', () => {
      const optionsWithTooltip = [
        { label: 'Grid', value: 'grid', tooltip: 'View as Grid' },
        { label: 'List', value: 'list' },
      ];

      render(<SegmentedControl options={optionsWithTooltip} tooltipDelayDuration={0} />);

      const gridBtn = screen.getByRole('radio', { name: /grid/i });
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

      fireEvent.mouseEnter(gridBtn);
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveTextContent('View as Grid');

      fireEvent.mouseLeave(gridBtn);
    });

    it('renders rich ReactNode custom tooltip', () => {
      const optionsWithRichTooltip = [
        {
          label: 'Grid',
          value: 'grid',
          tooltip: (
            <div data-testid="custom-rich-tooltip" className="flex flex-col gap-1">
              <span className="font-bold">Grid Layout</span>
              <span className="text-muted-foreground text-xs">Switch to responsive tiles</span>
            </div>
          ),
        },
      ];

      render(<SegmentedControl options={optionsWithRichTooltip} tooltipDelayDuration={0} />);

      const gridBtn = screen.getByRole('radio', { name: /grid/i });
      fireEvent.mouseEnter(gridBtn);

      const customTooltip = screen.getByTestId('custom-rich-tooltip');
      expect(customTooltip).toBeInTheDocument();
      expect(customTooltip).toHaveTextContent('Grid Layout');
      expect(customTooltip).toHaveTextContent('Switch to responsive tiles');
    });

    it('renders configuration object tooltip with shortcut, arrow, and custom side', () => {
      const optionsWithConfig = [
        {
          label: 'List',
          value: 'list',
          tooltip: {
            content: 'List View',
            shortcut: 'Ctrl+2',
            side: 'bottom' as const,
            arrow: true,
          },
        },
      ];

      render(<SegmentedControl options={optionsWithConfig} tooltipDelayDuration={0} />);

      const listBtn = screen.getByRole('radio', { name: /list/i });
      fireEvent.mouseEnter(listBtn);

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveAttribute('data-side', 'bottom');
      expect(tooltip).toHaveTextContent('List View');
      expect(tooltip.querySelector('[data-slot="tooltip-shortcut"]')).toHaveTextContent('Ctrl+2');
      expect(tooltip.querySelector('[data-slot="tooltip-arrow"]')).toBeInTheDocument();
    });

    it('supports function tooltip on option', () => {
      const optionsWithFn = [
        {
          label: 'Gallery',
          value: 'gallery',
          tooltip: (opt: any) => `Switch layout to ${opt.label}`,
        },
      ];

      render(<SegmentedControl options={optionsWithFn} tooltipDelayDuration={0} />);

      const btn = screen.getByRole('radio', { name: /gallery/i });
      fireEvent.mouseEnter(btn);

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveTextContent('Switch layout to Gallery');
    });

    it('supports global renderTooltip prop for custom option tooltips', () => {
      const plainOptions = [
        { label: 'Day', value: 'day' },
        { label: 'Week', value: 'week' },
      ];

      render(
        <SegmentedControl
          options={plainOptions}
          tooltipDelayDuration={0}
          tooltipSide="right"
          renderTooltip={(opt) => ({
            content: `View by ${opt.label}`,
            shortcut: opt.value === 'day' ? '1' : '2',
            side: 'right',
          })}
        />
      );

      const dayBtn = screen.getByRole('radio', { name: /day/i });
      fireEvent.mouseEnter(dayBtn);

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveAttribute('data-side', 'right');
      expect(tooltip).toHaveTextContent('View by Day');
      expect(tooltip.querySelector('[data-slot="tooltip-shortcut"]')).toHaveTextContent('1');
    });

    it('does not display tooltip when tooltip is disabled in config', () => {
      const optionsWithDisabled = [
        {
          label: 'Hidden',
          value: 'hidden',
          tooltip: { content: 'Should not appear', disabled: true },
        },
      ];

      render(<SegmentedControl options={optionsWithDisabled} tooltipDelayDuration={0} />);

      const btn = screen.getByRole('radio', { name: /hidden/i });
      fireEvent.mouseEnter(btn);
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });
});

