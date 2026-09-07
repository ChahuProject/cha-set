import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DraggableModal } from './DraggableModal';
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
