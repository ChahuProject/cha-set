import * as React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdaptivePopup } from './AdaptivePopup';

describe('AdaptivePopup', () => {
  let originalInnerHeight: number;
  let originalInnerWidth: number;

  beforeEach(() => {
    originalInnerHeight = window.innerHeight;
    originalInnerWidth = window.innerWidth;

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 800,
    });
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    });
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    vi.restoreAllMocks();
  });

  it('does not render when open is false', () => {
    render(
      <AdaptivePopup open={false}>
        <div>Popup Content</div>
      </AdaptivePopup>,
    );
    expect(screen.queryByText('Popup Content')).toBeNull();
  });

  it('renders content, header, and footer when open is true', () => {
    render(
      <AdaptivePopup
        open={true}
        header={<div>Header Title</div>}
        footer={<div>Footer Action</div>}
      >
        <div>Body Content</div>
      </AdaptivePopup>,
    );
    expect(screen.getByText('Header Title')).toBeTruthy();
    expect(screen.getByText('Body Content')).toBeTruthy();
    expect(screen.getByText('Footer Action')).toBeTruthy();
  });

  it('invokes onOpenChange(false) when Escape is pressed', () => {
    const onOpenChange = vi.fn();
    render(
      <AdaptivePopup open={true} onOpenChange={onOpenChange}>
        <div>Dismissable Content</div>
      </AdaptivePopup>,
    );
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('sets data-slot="adaptive-popup" attribute', () => {
    render(
      <AdaptivePopup open={true}>
        <div>Slot Check</div>
      </AdaptivePopup>,
    );
    const popup = document.querySelector('[data-slot="adaptive-popup"]');
    expect(popup).toBeTruthy();
  });
});
