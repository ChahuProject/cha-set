import * as React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ShortcutBar } from './ShortcutBar';
import { composeShortcuts } from './composeShortcuts';

describe('composeShortcuts', () => {
  it('loads default dropdown shortcuts when given dropdown preset', () => {
    const list = composeShortcuts('dropdown');
    expect(list.length).toBe(3);
    expect(list.map((i) => i.id)).toEqual(['nav', 'select', 'close']);
  });

  it('appends extra shortcuts at the end', () => {
    const list = composeShortcuts('dropdown', {
      append: [{ id: 'copy', keys: ['Ctrl', 'C'], label: '复制路径', priority: 3 }],
    });
    expect(list.length).toBe(4);
    expect(list[3]?.id).toBe('copy');
    expect(list[3]?.label).toBe('复制路径');
  });


  it('supports overrides on existing preset items', () => {
    const list = composeShortcuts('dropdown', {
      overrides: {
        select: { label: '进入目录' },
      },
    });
    const selectItem = list.find((i) => i.id === 'select');
    expect(selectItem?.label).toBe('进入目录');
  });

  it('filters out excluded shortcuts', () => {
    const list = composeShortcuts('dropdown', {
      exclude: ['close'],
    });
    expect(list.map((i) => i.id)).toEqual(['nav', 'select']);
  });
});

describe('ShortcutBar Component', () => {
  it('renders default dropdown preset items', () => {
    const { container } = render(<ShortcutBar preset="dropdown" />);
    const visibleItems = container.querySelectorAll('[data-slot="shortcut-item"]');
    expect(visibleItems.length).toBe(3);
    expect(container).toHaveTextContent('导航');
    expect(container).toHaveTextContent('选择');
    expect(container).toHaveTextContent('关闭');
  });

  it('renders custom items and handles compact keys', () => {
    const { container } = render(
      <ShortcutBar
        items={[
          { id: 'save', keys: ['Ctrl', 'S'], label: '保存' },
          { id: 'quit', keys: ['Esc'], label: '退出' },
        ]}
        compact="never"
      />,
    );
    const visibleItems = container.querySelectorAll('[data-slot="shortcut-item"]');
    expect(visibleItems.length).toBe(2);
    expect(container).toHaveTextContent('保存');
    expect(container).toHaveTextContent('退出');
    expect(container).toHaveTextContent('Ctrl');
  });

  it('collapses into overflow badge when maxVisibleItems is specified', () => {
    const { container } = render(
      <ShortcutBar
        items={[
          { id: '1', keys: ['A'], label: '一' },
          { id: '2', keys: ['B'], label: '二' },
          { id: '3', keys: ['C'], label: '三' },
        ]}
        maxVisibleItems={1}
      />,
    );
    const visibleItems = container.querySelectorAll('[data-slot="shortcut-item"]');
    expect(visibleItems.length).toBe(1);
    expect(visibleItems[0]).toHaveTextContent('一');
    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('renders with custom className and maintains data-slot', () => {
    const { container } = render(<ShortcutBar className="custom-bar" />);
    const bar = container.querySelector('[data-slot="shortcut-bar"]');
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveClass('custom-bar');
  });

  it('renders overflow items inside a floating portal on hover without truncation in visible items', () => {
    const { container } = render(
      <ShortcutBar
        items={[
          { id: '1', keys: ['Ctrl', 'S'], label: '保存文件' },
          { id: '2', keys: ['Ctrl', 'P'], label: '打印' },
          { id: '3', keys: ['Esc'], label: '退出' },
        ]}
        maxVisibleItems={1}
      />,
    );

    // Strict atomic item check: visible label must not have truncate class
    const visibleLabel = container.querySelector('[data-slot="shortcut-item"] span:last-child');
    expect(visibleLabel).not.toHaveClass('truncate');
    expect(visibleLabel).toHaveClass('whitespace-nowrap');

    // Find +2 badge
    const badge = screen.getByRole('button', { name: /更多 2 个快捷键/i });
    expect(badge).toBeInTheDocument();

    // Hover badge
    fireEvent.mouseEnter(badge);

    // Portal tooltip should now be present in document.body
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent('更多快捷键');
    expect(tooltip).toHaveTextContent('打印');
    expect(tooltip).toHaveTextContent('退出');
  });

  it('renders a focused tooltip when hovering over any visible shortcut item', () => {
    const { container } = render(
      <ShortcutBar
        items={[
          { id: 'nav', keys: ['Up', 'Down'], label: '导航' },
          { id: 'copy', keys: ['Ctrl', 'C'], label: '复制路径' },
        ]}
      />,
    );

    const items = container.querySelectorAll('[data-slot="shortcut-item"]');
    expect(items.length).toBe(2);

    // Hover on the second item ('复制路径')
    fireEvent.mouseEnter(items[1]!);

    // Tooltip should appear with both label and full key names
    const tooltips = screen.getAllByRole('tooltip');
    const activeTooltip = tooltips[tooltips.length - 1];
    expect(activeTooltip).toBeInTheDocument();
    expect(activeTooltip).toHaveTextContent('复制路径');
    expect(activeTooltip).toHaveTextContent('Ctrl');
    expect(activeTooltip).toHaveTextContent('C');

    // Unhover should schedule dismissal
    fireEvent.mouseLeave(items[1]!);
  });
});


