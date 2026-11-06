import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FilterPopup } from './FilterPopup';

describe('FilterPopup (React)', () => {
  const sampleItems = [
    { key: 'jpg', label: '.jpg', count: 12 },
    { key: 'png', label: '.png', count: 8 },
    { key: 'exe', label: '.exe', count: 2, isExcluded: true },
    { key: 'doc', label: '.doc', count: 5, isChecked: true },
  ];

  it('renders trigger button with title', () => {
    render(<FilterPopup title="Format Filter" items={sampleItems} />);
    expect(screen.getByText('Format Filter')).toBeInTheDocument();
  });

  it('opens popup when defaultOpen is true', () => {
    render(<FilterPopup title="Format Filter" items={sampleItems} defaultOpen />);
    expect(screen.getByText('.jpg')).toBeInTheDocument();
    expect(screen.getByText('.png')).toBeInTheDocument();
    expect(screen.getByText('.exe')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('handles item inclusion and exclusion callbacks', () => {
    const onInclude = vi.fn();
    const onExclude = vi.fn();

    render(
      <FilterPopup
        title="Format Filter"
        items={sampleItems}
        defaultOpen
        onItemIncludeToggle={onInclude}
        onItemExcludeToggle={onExclude}
      />,
    );

    const jpgItem = screen.getByText('.jpg');
    fireEvent.click(jpgItem);
    expect(onInclude).toHaveBeenCalledWith('jpg');

    fireEvent.contextMenu(jpgItem);
    expect(onExclude).toHaveBeenCalledWith('jpg');
  });

  it('filters items by query including pinyin and stars', () => {
    const starItems = [
      { key: 0, stars: 0, count: 5 },
      { key: 1, stars: 1, count: 2 },
      { key: 5, stars: 5, count: 9 },
    ];

    render(
      <FilterPopup
        title="Rating Filter"
        items={starItems}
        defaultOpen
        searchVisibility="always"
      />,
    );

    const input = screen.getByPlaceholderText('快速搜索...');
    fireEvent.change(input, { target: { value: '5' } });

    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.queryByText('2')).not.toBeInTheDocument();
  });

  it('supports clear button when hasActive is true', () => {
    const onClear = vi.fn();
    render(
      <FilterPopup
        title="Active Filter"
        items={sampleItems}
        defaultOpen
        hasActive
        onClear={onClear}
      />,
    );

    const clearBtn = screen.getByText('清除');
    fireEvent.click(clearBtn);
    expect(onClear).toHaveBeenCalled();
  });
});
