import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as React from 'react';
import { TableOfContents, flattenTocItems, type TocItem } from './TableOfContents';

describe('TableOfContents', () => {
  const sampleItems: TocItem[] = [
    {
      id: 'section-1',
      title: 'Introduction',
      level: 1,
      children: [
        { id: 'section-1-1', title: 'Background', level: 2 },
        { id: 'section-1-2', title: 'Motivation', level: 2 },
      ],
    },
    {
      id: 'section-2',
      title: 'Architecture',
      level: 1,
      children: [
        {
          id: 'section-2-1',
          title: 'Data Flow',
          level: 2,
          children: [{ id: 'section-2-1-1', title: 'Signals', level: 3 }],
        },
      ],
    },
    {
      id: 'section-3',
      title: 'Disabled Section',
      disabled: true,
    },
  ];

  describe('flattenTocItems helper', () => {
    it('flattens nested tree and computes depths', () => {
      const flat = flattenTocItems(sampleItems);
      expect(flat.length).toBe(7);
      expect(flat[0]!.id).toBe('section-1');
      expect(flat[0]!.depth).toBe(1);
      expect(flat[1]!.id).toBe('section-1-1');
      expect(flat[1]!.depth).toBe(2);
      expect(flat[5]!.id).toBe('section-2-1-1');
      expect(flat[5]!.depth).toBe(3);
    });
  });

  describe('Tree Rendering & Indentation', () => {
    it('renders all tree items with appropriate level indentation', () => {
      render(<TableOfContents items={sampleItems} title="Page Content" />);

      expect(screen.getByText('Page Content')).toBeInTheDocument();
      expect(screen.getByText('Introduction')).toBeInTheDocument();
      expect(screen.getByText('Background')).toBeInTheDocument();
      expect(screen.getByText('Signals')).toBeInTheDocument();

      const bgLink = screen.getByText('Background').closest('a');
      expect(bgLink).toHaveStyle({ paddingLeft: '1.375rem' }); // depth 2: (2-1)*0.75 + 0.625 = 1.375rem

      const signalsLink = screen.getByText('Signals').closest('a');
      expect(signalsLink).toHaveStyle({ paddingLeft: '2.125rem' }); // depth 3: (3-1)*0.75 + 0.625 = 2.125rem
    });

    it('renders visual track and active indicator', () => {
      render(<TableOfContents items={sampleItems} activeId="section-1-1" showTrack={true} />);

      const activeLink = screen.getByText('Background').closest('a');
      expect(activeLink).toHaveAttribute('aria-current', 'true');
      expect(activeLink).toHaveClass('text-primary');

      const inactiveLink = screen.getByText('Introduction').closest('a');
      expect(inactiveLink).not.toHaveAttribute('aria-current');
      expect(inactiveLink).toHaveClass('text-muted-foreground');
    });
  });

  describe('Banner & Top Offset Accommodation', () => {
    it('applies topOffset correctly to aside style', () => {
      const { container } = render(
        <TableOfContents items={sampleItems} topOffset={48} />
      );

      const aside = container.querySelector('aside');
      expect(aside).toHaveStyle({ top: '3rem' }); // 48 * 0.0625 = 3rem
    });
  });

  describe('Interactions & Callbacks', () => {
    it('calls onSelect when an item is clicked', () => {
      const handleSelect = vi.fn();
      render(<TableOfContents items={sampleItems} onSelect={handleSelect} />);

      fireEvent.click(screen.getByText('Motivation'));
      expect(handleSelect).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'section-1-2', title: 'Motivation' }),
        expect.anything()
      );
    });

    it('does not call onSelect when a disabled item is clicked', () => {
      const handleSelect = vi.fn();
      render(<TableOfContents items={sampleItems} onSelect={handleSelect} />);

      fireEvent.click(screen.getByText('Disabled Section'));
      expect(handleSelect).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports arrow key navigation and Enter activation', () => {
      const handleSelect = vi.fn();
      render(<TableOfContents items={sampleItems} onSelect={handleSelect} />);

      const nav = screen.getByRole('navigation');

      // ArrowDown to first item
      fireEvent.keyDown(nav, { key: 'ArrowDown' });
      // ArrowDown to second item
      fireEvent.keyDown(nav, { key: 'ArrowDown' });
      // Press Enter
      fireEvent.keyDown(nav, { key: 'Enter' });

      expect(handleSelect).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'section-1-1', title: 'Background' }),
        expect.anything()
      );
    });

    it('supports Home and End keys', () => {
      const handleSelect = vi.fn();
      render(<TableOfContents items={sampleItems} onSelect={handleSelect} />);

      const nav = screen.getByRole('navigation');

      // End to last non-disabled item
      fireEvent.keyDown(nav, { key: 'End' });
      fireEvent.keyDown(nav, { key: 'Enter' });

      expect(handleSelect).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'section-2-1-1', title: 'Signals' }),
        expect.anything()
      );

      // Home to first item
      fireEvent.keyDown(nav, { key: 'Home' });
      fireEvent.keyDown(nav, { key: 'Enter' });

      expect(handleSelect).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'section-1', title: 'Introduction' }),
        expect.anything()
      );
    });
  });
});
