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

    const input = screen.getByPlaceholderText(/快速搜索|Quick search/);
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

    const clearBtn = screen.getByText(/清除|Clear/);
    fireEvent.click(clearBtn);
    expect(onClear).toHaveBeenCalled();
  });

  it('validates illegal filename characters when validateFileName is enabled', () => {
    render(
      <FilterPopup
        title="Format Filter"
        items={sampleItems}
        defaultOpen
        searchVisibility="always"
        validateFileName
      />,
    );

    const input = screen.getByPlaceholderText(/快速搜索|Quick search/);
    fireEvent.change(input, { target: { value: 'test*?file' } });

    expect(screen.getByText(/(不支持字符|Invalid characters).*[\\*\\?]/)).toBeInTheDocument();
  });

  it('allows legal filename symbols like #, _, - without warning', () => {
    const symbolItems = [
      { key: 'a_b', label: 'file_name#1-test.jpg', count: 1 },
      { key: 'other', label: 'other.png', count: 2 },
    ];
    render(
      <FilterPopup
        title="Format Filter"
        items={symbolItems}
        defaultOpen
        searchVisibility="always"
        validateFileName
      />,
    );

    const input = screen.getByPlaceholderText(/快速搜索|Quick search/);
    fireEvent.change(input, { target: { value: 'name#1-test' } });

    expect(screen.queryByText(/不支持字符|Invalid characters/)).not.toBeInTheDocument();
    expect(screen.getByText('file_name#1-test.jpg')).toBeInTheDocument();
  });
});
