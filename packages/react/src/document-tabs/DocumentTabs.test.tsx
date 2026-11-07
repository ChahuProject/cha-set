import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DocumentTabs } from './DocumentTabs';
import { TabItem } from './TabItem';

describe('DocumentTabs & TabItem', () => {
  it('renders tab strip and active tab item correctly', () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();

    render(
      <DocumentTabs>
        <TabItem text="Main.qml" selected onClick={onSelect} onClose={onClose} />
        <TabItem text="README.md" canClose={false} />
      </DocumentTabs>,
    );

    expect(screen.getByText('Main.qml')).toBeInTheDocument();
    expect(screen.getByText('README.md')).toBeInTheDocument();

    const mainTab = screen.getByRole('tab', { name: /Main\.qml/i });
    expect(mainTab).toHaveAttribute('aria-selected', 'true');

    fireEvent.click(mainTab);
    expect(onSelect).toHaveBeenCalledTimes(1);

    const closeBtn = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('handles middle click to close tab', () => {
    const onMiddleClick = vi.fn();

    render(
      <DocumentTabs>
        <TabItem text="Doc.tsx" onMiddleClick={onMiddleClick} />
      </DocumentTabs>,
    );

    const tab = screen.getByRole('tab', { name: /Doc\.tsx/i });
    fireEvent.mouseDown(tab, { button: 1 });
    expect(onMiddleClick).toHaveBeenCalledTimes(1);
  });

  it('respects width modes (content vs fixed)', () => {
    const { rerender } = render(
      <TabItem text="Short" tabWidthMode="content" />,
    );
    const contentTab = screen.getByRole('tab', { name: /Short/i });
    expect(contentTab.className).toContain('max-w-[15rem]');

    rerender(<TabItem text="FixedTab" tabWidthMode="fixed" />);
    const fixedTab = screen.getByRole('tab', { name: /FixedTab/i });
    expect(fixedTab.className).toContain('w-44');
  });

  it('supports shell chrome mode and trailing actions', () => {
    const onAdd = vi.fn();
    render(
      <DocumentTabs useShellChrome trailing={<button onClick={onAdd}>+ Add</button>}>
        <TabItem text="App.tsx" useShellChrome />
      </DocumentTabs>,
    );

    expect(screen.getByRole('tablist')).toHaveAttribute('data-shell-chrome', 'true');
    const addBtn = screen.getByText('+ Add');
    fireEvent.click(addBtn);
    expect(onAdd).toHaveBeenCalledTimes(1);
  });
});
