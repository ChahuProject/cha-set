import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DraggableModal, type DraggableModalSizeOption } from './DraggableModal';
import { FloatingWindow } from './FloatingWindow';

describe('DraggableModal and FloatingWindow', () => {
  it('renders draggable modal content and esc badge', () => {
    render(
      <DraggableModal showEscBadge defaultWidth={400} defaultHeight={300}>
        <div>Modal Content</div>
      </DraggableModal>,
    );

    expect(screen.getByText('Modal Content')).toBeInTheDocument();
    expect(screen.getByText('ESC')).toBeInTheDocument();
  });

  it('renders with top initialPositionMode without error', () => {
    render(
      <DraggableModal
        initialPositionMode="top"
        topMarginRem={5}
        defaultWidthRem={30}
        defaultHeightRem={20}
      >
        <div>Top Mode Content</div>
      </DraggableModal>,
    );

    expect(screen.getByText('Top Mode Content')).toBeInTheDocument();
  });

  it('renders fixedFooter when provided', () => {
    render(
      <DraggableModal
        fixedFooter={<button type="button">Confirm Action</button>}
      >
        <div>Content with Footer</div>
      </DraggableModal>,
    );

    expect(screen.getByText('Content with Footer')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm Action' })).toBeInTheDocument();
  });

  it('renders topControls when provided', () => {
    render(
      <DraggableModal
        topControls={<button type="button">Custom Close</button>}
      >
        <div>Content with Top Controls</div>
      </DraggableModal>,
    );

    expect(screen.getByText('Content with Top Controls')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Custom Close' })).toBeInTheDocument();
  });

  it('renders rootExtra when provided', () => {
    render(
      <DraggableModal
        rootExtra={<div data-testid="root-extra">Root Extra Element</div>}
      >
        <div>Content with Extra</div>
      </DraggableModal>,
    );

    expect(screen.getByText('Content with Extra')).toBeInTheDocument();
    expect(screen.getByTestId('root-extra')).toBeInTheDocument();
  });

  it('renders sizeOptions dropdown trigger and opens options menu on click', async () => {
    const sizeOptions: DraggableModalSizeOption[] = [
      { name: '默认', special: 'default' },
      { name: '大尺寸', widthRem: 40, heightRem: 30 },
      { name: '全窗口', special: 'fullscreen' },
    ];

    render(
      <DraggableModal
        sizeOptions={sizeOptions}
        sizeMenuTooltip="切换窗口尺寸"
      >
        <div>Content with Size Menu</div>
      </DraggableModal>,
    );

    expect(screen.getByText('Content with Size Menu')).toBeInTheDocument();

    const triggerBtn = screen.getByRole('button', { name: '切换窗口尺寸' });
    expect(triggerBtn).toBeInTheDocument();

    fireEvent.click(triggerBtn);

    const defaultOpt = await screen.findByText('默认');
    expect(defaultOpt).toBeInTheDocument();
    expect(screen.getByText('大尺寸')).toBeInTheDocument();
    expect(screen.getByText('全窗口')).toBeInTheDocument();

    fireEvent.click(defaultOpt);
  });

  it('renders floating window when open and triggers onOpenChange on close', () => {
    const onOpenChange = vi.fn();
    render(
      <FloatingWindow
        open={true}
        onOpenChange={onOpenChange}
        title="Floating Tool"
      >
        <div>Window Body</div>
      </FloatingWindow>,
    );

    expect(screen.getByText('Floating Tool')).toBeInTheDocument();
    expect(screen.getByText('Window Body')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: 'Close floating window' });
    fireEvent.click(closeBtn);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

