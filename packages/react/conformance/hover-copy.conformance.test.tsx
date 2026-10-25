import { describe, expect, it, vi, beforeEach } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { hoverCopySchema, hoverCopyDefaults, hoverCopyRadiusMap } from '@chahu/spec/hover-copy';
import { HoverCopy } from '../src/hover-copy/HoverCopy';

describe('HoverCopy conformance (spec contract)', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('default props match the shared contract defaults', () => {
    const parsed = hoverCopySchema.parse({});
    expect(parsed.text).toBe('');
    expect(parsed.dim).toBe(hoverCopyDefaults.dim);
    expect(parsed.dim).toBe(0.45);
    expect(parsed.radius).toBe(hoverCopyDefaults.radius);
    expect(parsed.radius).toBe('md');
    expect(parsed.resetTime).toBe(hoverCopyDefaults.resetTime);
    expect(parsed.resetTime).toBe(1000);
    expect(parsed.icon).toBe('copy');
    expect(parsed.copiedIcon).toBe('check');
    expect(parsed.disabled).toBe(false);
  });

  it('radius map covers all five semantic radii', () => {
    expect(Object.keys(hoverCopyRadiusMap).sort()).toEqual(['full', 'lg', 'md', 'none', 'sm']);
    expect(hoverCopyRadiusMap.md.web).toBe('rounded-md');
    expect(hoverCopyRadiusMap.full.web).toBe('rounded-full');
  });

  it('earned coverage declares must capabilities', () => {
    const capabilitiesFile = resolve(import.meta.dirname, '..', '..', 'spec', 'capabilities.json');
    if (!existsSync(capabilitiesFile)) return;
    const capabilities = JSON.parse(readFileSync(capabilitiesFile, 'utf8')) as {
      components?: Record<string, Record<string, { requirement?: string }>>;
    };
    const hoverCopy = capabilities.components?.hoverCopy;
    if (!hoverCopy) {
      console.warn('[conformance] spec/capabilities.json has no components.hoverCopy yet; skipping earned-capability assertions');
      return;
    }
    const coverageFile = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(coverageFile)) {
      console.warn('[conformance] coverage.json not present yet; skipping earned-capability assertions');
      return;
    }
    const coverage = JSON.parse(readFileSync(coverageFile, 'utf8')) as {
      hoverCopy?: Record<string, boolean>;
    };
    for (const cap of Object.keys(hoverCopy).filter((k) => hoverCopy[k]?.requirement === 'must')) {
      expect(coverage.hoverCopy?.[cap], `capability "${cap}" must be earned`).toBe(true);
    }
  });

  it('hover reveal is assertable by rendering', () => {
    render(<HoverCopy text="payload">content</HoverCopy>);
    const wrapper = screen.getByText('content').closest('[data-state]');
    expect(wrapper).toHaveAttribute('data-state', 'idle');
    fireEvent.pointerEnter(wrapper as HTMLElement);
    expect(wrapper).toHaveAttribute('data-state', 'hovered');
  });

  it('copy + restore cycle is assertable by rendering', async () => {
    vi.useFakeTimers();
    try {
      const onCopy = vi.fn();
      render(
        <HoverCopy text="payload" resetTime={2000} onCopy={onCopy}>
          content
        </HoverCopy>,
      );
      const wrapper = screen.getByText('content').closest('[data-state]');
      fireEvent.pointerEnter(wrapper as HTMLElement);
      fireEvent.click(screen.getByRole('button', { name: 'Copy to clipboard' }));
      await act(async () => {});
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('payload');
      expect(onCopy).toHaveBeenCalledWith('payload');
      expect(wrapper).toHaveAttribute('data-state', 'copied');
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(wrapper).toHaveAttribute('data-state', 'hovered');
    } finally {
      vi.useRealTimers();
    }
  });

  it('empty text no-op is assertable by rendering', async () => {
    const onCopy = vi.fn();
    render(
      <HoverCopy text="" onCopy={onCopy}>
        content
      </HoverCopy>,
    );
    const wrapper = screen.getByText('content').closest('[data-state]');
    fireEvent.pointerEnter(wrapper as HTMLElement);
    fireEvent.click(screen.getByRole('button', { name: 'Copy to clipboard' }));
    await act(async () => {});
    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
    expect(onCopy).not.toHaveBeenCalled();
    expect(wrapper).toHaveAttribute('data-state', 'hovered');
  });

  it('disabled blocking is assertable by rendering', () => {
    render(
      <HoverCopy text="payload" disabled>
        content
      </HoverCopy>,
    );
    const wrapper = screen.getByText('content').closest('[data-state]');
    fireEvent.pointerEnter(wrapper as HTMLElement);
    expect(wrapper).toHaveAttribute('data-state', 'idle');
    expect(wrapper).toHaveAttribute('aria-disabled', 'true');
  });
});
