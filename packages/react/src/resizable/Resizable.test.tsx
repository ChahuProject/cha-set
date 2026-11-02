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

  it('renders clean ResizableHandle without grip icon', () => {
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

  it('renders decorative grip when withHandle is true', () => {
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
  });

  it('renders visual line with hairline and hover/active wider styling classes', () => {
    render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50}>Left</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>Right</ResizablePanel>
      </ResizablePanelGroup>
    );

    const handle = screen.getByRole('separator');
    expect(handle).toHaveClass('w-4', '-mx-[0.46875rem]', 'cursor-col-resize');

    const line = handle.querySelector('[data-slot="resizable-handle-line"]');
    expect(line).toBeInTheDocument();
    expect(line).toHaveClass('w-[0.0625rem]', 'group-hover:w-[0.1875rem]', 'bg-border');
  });

  it('renders horizontal splitter handle with wider styling classes when direction="vertical"', () => {
    render(
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={50}>Top</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>Bottom</ResizablePanel>
      </ResizablePanelGroup>
    );

    const handle = screen.getByRole('separator');
    expect(handle).toHaveClass('h-4', '-my-[0.46875rem]', 'cursor-row-resize');

    const line = handle.querySelector('[data-slot="resizable-handle-line"]');
    expect(line).toBeInTheDocument();
    expect(line).toHaveClass('h-[0.0625rem]', 'group-hover:h-[0.1875rem]', 'bg-border');
  });

  it('allows pointerDown and click handlers on ResizableHandle', () => {
    const handlePointerDown = vi.fn();
    const handleClick = vi.fn();

    render(
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
    );

    const handle = screen.getByRole('separator');
    fireEvent.pointerDown(handle);
    expect(handlePointerDown).toHaveBeenCalled();

    fireEvent.click(handle);
    expect(handleClick).toHaveBeenCalled();
  });
});
