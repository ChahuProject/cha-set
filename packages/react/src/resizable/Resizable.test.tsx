import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from './Resizable';

describe('Resizable Component Group', () => {
  it('renders horizontal panel group by default with data-slot and layout styling', () => {
    const { container } = render(
      <ResizablePanelGroup>
        <ResizablePanel defaultSize={50}>
          <div>Panel 1</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <div>Panel 2</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    );

    const group = container.querySelector('[data-slot="resizable-panel-group"]');
    expect(group).toBeInTheDocument();
    expect(group).toHaveAttribute('data-slot', 'resizable-panel-group');
    expect(group).toHaveAttribute('aria-orientation', 'horizontal');
    expect(group).toHaveClass('flex', 'h-full', 'w-full');

    const panels = container.querySelectorAll('[data-slot="resizable-panel"]');
    expect(panels).toHaveLength(2);

    const handle = screen.getByRole('separator');
    expect(handle).toHaveAttribute('data-slot', 'resizable-handle');
  });

  it('renders vertical panel group when direction="vertical"', () => {
    const { container } = render(
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={40}>
          <div>Top Panel</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={60}>
          <div>Bottom Panel</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    );

    const group = container.querySelector('[data-slot="resizable-panel-group"]');
    expect(group).toHaveAttribute('aria-orientation', 'vertical');

    const handle = screen.getByRole('separator');
    expect(handle).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('supports orientation prop directly', () => {
    const { container } = render(
      <ResizablePanelGroup orientation="vertical">
        <ResizablePanel defaultSize={50}>
          <div>Upper</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <div>Lower</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    );

    const group = container.querySelector('[data-slot="resizable-panel-group"]');
    expect(group).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('renders ResizablePanel with custom props and constraints', () => {
    const { container } = render(
      <ResizablePanelGroup>
        <ResizablePanel
          defaultSize={30}
          minSize={20}
          maxSize={80}
          collapsible
        >
          <div>Constrained Panel</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={70}>
          <div>Remaining</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    );

    const panel = container.querySelector('[data-slot="resizable-panel"]');
    expect(panel).toBeInTheDocument();
    expect(panel).toHaveAttribute('data-slot', 'resizable-panel');
  });

  it('applies custom className on all components', () => {
    const { container } = render(
      <ResizablePanelGroup className="custom-group-class">
        <ResizablePanel className="custom-panel-class">
          <div>Content</div>
        </ResizablePanel>
        <ResizableHandle className="custom-handle-class" />
      </ResizablePanelGroup>
    );

    const group = container.querySelector('[data-slot="resizable-panel-group"]');
    expect(group).toHaveClass('custom-group-class');

    const handle = screen.getByRole('separator');
    expect(handle).toHaveClass('custom-handle-class');
  });

  it('renders ResizableHandle with withHandle={true} showing the grip icon', () => {
    render(
      <ResizablePanelGroup>
        <ResizablePanel defaultSize={50}>
          <div>Left</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <div>Right</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    );

    const handle = screen.getByRole('separator');
    const grip = handle.querySelector('[data-slot="resizable-handle-grip"]');
    expect(grip).toBeInTheDocument();
    expect(handle.querySelector('svg')).toBeInTheDocument();
  });

  it('renders ResizableHandle without withHandle not rendering grip', () => {
    render(
      <ResizablePanelGroup>
        <ResizablePanel defaultSize={50}>
          <div>Left</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <div>Right</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    );

    const handle = screen.getByRole('separator');
    const grip = handle.querySelector('[data-slot="resizable-handle-grip"]');
    expect(grip).toBeNull();
  });

  it('stops event propagation on pointerDown and click on ResizableHandle', () => {
    const parentClick = vi.fn();
    const handlePointerDown = vi.fn();
    const handleClick = vi.fn();

    render(
      <div onClick={parentClick}>
        <ResizablePanelGroup>
          <ResizablePanel defaultSize={50}>
            <div>A</div>
          </ResizablePanel>
          <ResizableHandle
            onPointerDown={handlePointerDown}
            onClick={handleClick}
          />
          <ResizablePanel defaultSize={50}>
            <div>B</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    );

    const handle = screen.getByRole('separator');
    fireEvent.pointerDown(handle);
    expect(handlePointerDown).toHaveBeenCalled();

    fireEvent.click(handle);
    expect(handleClick).toHaveBeenCalled();
    expect(parentClick).not.toHaveBeenCalled();
  });
});
