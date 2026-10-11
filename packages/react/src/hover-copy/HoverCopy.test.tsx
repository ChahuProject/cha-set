import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HoverCopy } from './HoverCopy';
import { CopyableBadge } from './CopyableBadge';

let writeText: ReturnType<typeof vi.fn>;

function mockClipboard() {
  writeText = vi.fn().mockResolvedValue(undefined);
  // user-event's setup() replaces navigator.clipboard with a getter-only stub,
  // which makes a plain Object.assign throw on later tests. Delete first so a
  // fresh own data property can shadow it; fall back to defineProperty.
  try {
    delete (navigator as { clipboard?: unknown }).clipboard;
  } catch {
    /* property absent or already removed */
  }
  try {
    Object.assign(navigator, { clipboard: { writeText } });
  } catch {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
  }
}

function wrapperOf(content: string): HTMLElement {
  const el = screen.getByText(content).closest('[data-state]');
  if (!(el instanceof HTMLElement)) throw new Error('HoverCopy wrapper not found');
  return el;
}

describe('HoverCopy', () => {
  beforeEach(() => {
    mockClipboard();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders idle with no visible overlay', () => {
    const { container } = render(<HoverCopy text="abc">content</HoverCopy>);
    const wrapper = container.querySelector('[data-state]');
    expect(wrapper).toHaveAttribute('data-state', 'idle');
    const scrim = wrapper?.querySelector('div[aria-hidden="true"]');
    expect(scrim).toHaveClass('opacity-0');
    expect(scrim).toHaveClass('pointer-events-none');
    const button = screen.getByRole('button', { name: 'Copy to clipboard' });
    expect(button).toHaveClass('pointer-events-none');
    expect(button).toHaveClass('opacity-0');
  });

  it('pointer enter reveals the overlay (idle -> hovered)', () => {
    render(<HoverCopy text="abc">content</HoverCopy>);
    const wrapper = wrapperOf('content');
    fireEvent.pointerEnter(wrapper);
    expect(wrapper).toHaveAttribute('data-state', 'hovered');
    const button = screen.getByRole('button', { name: 'Copy to clipboard' });
    expect(button).toHaveClass('pointer-events-auto');
    expect(button).toHaveClass('opacity-100');
  });

  it('pointer leave conceals the overlay (hovered -> idle)', () => {
    render(<HoverCopy text="abc">content</HoverCopy>);
    const wrapper = wrapperOf('content');
    fireEvent.pointerEnter(wrapper);
    expect(wrapper).toHaveAttribute('data-state', 'hovered');
    fireEvent.pointerLeave(wrapper);
    expect(wrapper).toHaveAttribute('data-state', 'idle');
  });

  it('click copies, fires onCopy, enters copied with the check icon', async () => {
    const onCopy = vi.fn();
    const { container } = render(
      <HoverCopy text="copy me" onCopy={onCopy}>
        content
      </HoverCopy>,
    );
    const wrapper = wrapperOf('content');
    fireEvent.pointerEnter(wrapper);
    fireEvent.click(screen.getByRole('button', { name: 'Copy to clipboard' }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith('copy me');
      expect(onCopy).toHaveBeenCalledWith('copy me');
    });
    expect(wrapper).toHaveAttribute('data-state', 'copied');
    const icon = container.querySelector('button svg');
    expect(icon).toHaveClass('animate-in');
  });

  it('trigger is a background-free full-overlay layer with an auto-fit glyph', () => {
    const { container } = render(<HoverCopy text="abc">content</HoverCopy>);
    const button = screen.getByRole('button', { name: 'Copy to clipboard' });
    // Fills the overlay so the whole layer reads as one big button...
    expect(button).toHaveClass('inset-0');
    // ...with no button chrome (no surface, border, or shadow).
    expect(button).not.toHaveClass('bg-popover');
    expect(button.className).not.toMatch(/border/);
    expect(button).not.toHaveClass('shadow-sm');
    // Glyph auto-fits inside the wrapped content and never overflows it.
    const icon = container.querySelector('button svg');
    expect(icon).toHaveClass('h-[min(1.5rem,55%)]');
  });

  it('clicking anywhere on the revealed overlay copies (whole-overlay trigger)', async () => {
    const onCopy = vi.fn();
    render(
      <HoverCopy text="overlay copy" onCopy={onCopy}>
        content
      </HoverCopy>,
    );
    const wrapper = wrapperOf('content');
    fireEvent.pointerEnter(wrapper);
    expect(wrapper).toHaveAttribute('data-state', 'hovered');
    // Click on the wrapper itself (scrim/content area), not the button.
    fireEvent.click(wrapper);

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith('overlay copy');
      expect(onCopy).toHaveBeenCalledWith('overlay copy');
    });
    expect(wrapper).toHaveAttribute('data-state', 'copied');
  });

  it('restore timer returns to hovered while the pointer stays inside', async () => {
    vi.useFakeTimers();
    render(
      <HoverCopy text="abc" resetTime={2000}>
        content
      </HoverCopy>,
    );
    const wrapper = wrapperOf('content');
    fireEvent.pointerEnter(wrapper);
    fireEvent.click(screen.getByRole('button', { name: 'Copy to clipboard' }));
    await act(async () => {});
    expect(wrapper).toHaveAttribute('data-state', 'copied');

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(wrapper).toHaveAttribute('data-state', 'hovered');
    expect(screen.getByRole('button', { name: 'Copy to clipboard' })).toHaveClass('opacity-100');
  });

  it('restore timer returns to idle when the pointer left before the timer', async () => {
    vi.useFakeTimers();
    render(
      <HoverCopy text="abc" resetTime={2000}>
        content
      </HoverCopy>,
    );
    const wrapper = wrapperOf('content');
    fireEvent.pointerEnter(wrapper);
    fireEvent.click(screen.getByRole('button', { name: 'Copy to clipboard' }));
    await act(async () => {});
    expect(wrapper).toHaveAttribute('data-state', 'copied');

    // Pointer-leave during copied is ignored (never truncates success feedback).
    fireEvent.pointerLeave(wrapper);
    expect(wrapper).toHaveAttribute('data-state', 'copied');

    // Timer fires with nothing engaged -> idle. pointerInside was cleared by
    // the leave above, so the restore path resolves to idle.
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(wrapper).toHaveAttribute('data-state', 'idle');
  });

  it('pointer leave during copied does not change state', async () => {
    render(<HoverCopy text="abc">content</HoverCopy>);
    const wrapper = wrapperOf('content');
    fireEvent.pointerEnter(wrapper);
    fireEvent.click(screen.getByRole('button', { name: 'Copy to clipboard' }));
    await waitFor(() => expect(wrapper).toHaveAttribute('data-state', 'copied'));
    fireEvent.pointerLeave(wrapper);
    expect(wrapper).toHaveAttribute('data-state', 'copied');
  });

  it('re-copy during copied restarts the timer', async () => {
    vi.useFakeTimers();
    const onCopy = vi.fn();
    render(
      <HoverCopy text="abc" resetTime={2000} onCopy={onCopy}>
        content
      </HoverCopy>,
    );
    const wrapper = wrapperOf('content');
    fireEvent.pointerEnter(wrapper);
    const button = screen.getByRole('button', { name: 'Copy to clipboard' });
    fireEvent.click(button);
    await act(async () => {});
    expect(wrapper).toHaveAttribute('data-state', 'copied');

    act(() => {
      vi.advanceTimersByTime(1500);
    });
    fireEvent.click(button);
    await act(async () => {});
    expect(onCopy).toHaveBeenCalledTimes(2);
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(wrapper).toHaveAttribute('data-state', 'copied');
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(wrapper).toHaveAttribute('data-state', 'hovered');
  });

  it('empty text activation is a complete no-op', async () => {
    const onCopy = vi.fn();
    const onError = vi.fn();
    render(
      <HoverCopy text="" onCopy={onCopy} onError={onError}>
        content
      </HoverCopy>,
    );
    const wrapper = wrapperOf('content');
    fireEvent.pointerEnter(wrapper);
    expect(wrapper).toHaveAttribute('data-state', 'hovered');
    fireEvent.click(screen.getByRole('button', { name: 'Copy to clipboard' }));
    await act(async () => {});
    expect(writeText).not.toHaveBeenCalled();
    expect(onCopy).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
    expect(wrapper).toHaveAttribute('data-state', 'hovered');
  });

  it('clipboard failure stays hovered and fires onError', async () => {
    const onError = vi.fn();
    try {
      delete (navigator as { clipboard?: unknown }).clipboard;
    } catch {
      /* property absent or already removed */
    }
    writeText = vi.fn().mockRejectedValue(new Error('denied'));
    Object.assign(navigator, { clipboard: { writeText } });
    render(
      <HoverCopy text="abc" onError={onError}>
        content
      </HoverCopy>,
    );
    const wrapper = wrapperOf('content');
    fireEvent.pointerEnter(wrapper);
    fireEvent.click(screen.getByRole('button', { name: 'Copy to clipboard' }));
    await waitFor(() => expect(onError).toHaveBeenCalled());
    expect(wrapper).toHaveAttribute('data-state', 'hovered');
  });

  it('disabled blocks reveal and copy', () => {
    const onCopy = vi.fn();
    render(
      <HoverCopy text="abc" disabled onCopy={onCopy}>
        content
      </HoverCopy>,
    );
    const wrapper = wrapperOf('content');
    expect(wrapper).toHaveAttribute('aria-disabled', 'true');
    fireEvent.pointerEnter(wrapper);
    expect(wrapper).toHaveAttribute('data-state', 'idle');
    const button = screen.getByRole('button', { name: 'Copy to clipboard' });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('cursor-not-allowed');
    fireEvent.click(button);
    expect(writeText).not.toHaveBeenCalled();
    expect(onCopy).not.toHaveBeenCalled();
  });

  it('touch pointerdown pins the overlay open', () => {
    render(<HoverCopy text="abc">content</HoverCopy>);
    const wrapper = wrapperOf('content');
    fireEvent.pointerDown(wrapper, { pointerType: 'touch' });
    expect(wrapper).toHaveAttribute('data-state', 'hovered');
    // Pinned overlay survives pointer-leave until copy or mouse takeover.
    fireEvent.pointerLeave(wrapper);
    expect(wrapper).toHaveAttribute('data-state', 'hovered');
  });

  it('keyboard: tab reveals, Enter triggers copy', async () => {
    const user = userEvent.setup();
    mockClipboard();
    const onCopy = vi.fn();
    render(
      <HoverCopy text="keyboard" onCopy={onCopy}>
        content
      </HoverCopy>,
    );
    const wrapper = wrapperOf('content');
    await user.tab();
    expect(screen.getByRole('button', { name: 'Copy to clipboard' })).toHaveFocus();
    expect(wrapper).toHaveAttribute('data-state', 'hovered');
    await user.keyboard('{Enter}');
    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith('keyboard');
      expect(onCopy).toHaveBeenCalledWith('keyboard');
    });
    expect(wrapper).toHaveAttribute('data-state', 'copied');
  });

  it('unmount clears the restore timer without warnings', async () => {
    vi.useFakeTimers();
    const { unmount } = render(<HoverCopy text="abc">content</HoverCopy>);
    const wrapper = wrapperOf('content');
    fireEvent.pointerEnter(wrapper);
    fireEvent.click(screen.getByRole('button', { name: 'Copy to clipboard' }));
    await act(async () => {});
    expect(wrapper).toHaveAttribute('data-state', 'copied');
    unmount();
    act(() => {
      vi.advanceTimersByTime(5000);
    });
  });

  it('forceHover forces the overlay visible while idle', () => {
    render(
      <HoverCopy text="abc" forceHover>
        content
      </HoverCopy>,
    );
    const wrapper = wrapperOf('content');
    expect(wrapper).toHaveAttribute('data-state', 'idle');
    expect(screen.getByRole('button', { name: 'Copy to clipboard' })).toHaveClass('opacity-100');
  });
});

describe('CopyableBadge', () => {
  beforeEach(() => {
    mockClipboard();
  });

  it('renders a secondary badge wrapped in HoverCopy and copies text', async () => {
    const onCopy = vi.fn();
    render(
      <CopyableBadge text="ORDER-1024" onCopy={onCopy}>
        ORDER-1024
      </CopyableBadge>,
    );
    const badge = screen.getByText('ORDER-1024');
    expect(badge).toHaveAttribute('data-variant', 'secondary');
    const wrapper = badge.closest('[data-state]');
    expect(wrapper).toHaveClass('rounded-full');

    fireEvent.pointerEnter(wrapper as HTMLElement);
    expect(wrapper).toHaveAttribute('data-state', 'hovered');
    fireEvent.click(screen.getByRole('button', { name: 'Copy to clipboard' }));
    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith('ORDER-1024');
      expect(onCopy).toHaveBeenCalledWith('ORDER-1024');
    });
    expect(wrapper).toHaveAttribute('data-state', 'copied');
  });

  it('displays text when no children are given and forwards disabled', () => {
    render(<CopyableBadge text="PAYLOAD" disabled />);
    expect(screen.getByText('PAYLOAD')).toBeInTheDocument();
    const wrapper = screen.getByText('PAYLOAD').closest('[data-state]');
    expect(wrapper).toHaveAttribute('aria-disabled', 'true');
    fireEvent.pointerEnter(wrapper as HTMLElement);
    expect(wrapper).toHaveAttribute('data-state', 'idle');
  });
});
