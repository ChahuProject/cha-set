import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import * as React from 'react';
import { getSquircleSvgPath } from './squircle-path';
import { Squircle } from './Squircle';

describe('Squircle mathematical path generator', () => {
  it('generates valid SVG path for basic squircle', () => {
    const path = getSquircleSvgPath({
      width: 100,
      height: 40,
      cornerRadius: 8,
      cornerSmoothing: 0.6,
    });
    expect(path).toContain('M 50 0');
    expect(path).toContain('C ');
    expect(path).toContain('Z');
  });

  it('handles zero radius as rectangular path', () => {
    const path = getSquircleSvgPath({
      width: 100,
      height: 40,
      cornerRadius: 0,
      cornerSmoothing: 0.6,
    });
    expect(path).toBe('M 50 0 L 100 0 L 100 40 L 0 40 L 0 0 Z');
  });

  it('handles per-corner radii and smoothing = 0 (circular arc)', () => {
    const path = getSquircleSvgPath({
      width: 120,
      height: 50,
      topLeftRadius: 10,
      topRightRadius: 0,
      cornerSmoothing: 0.0,
    });
    expect(path).toContain('M 60 0');
    expect(path).toContain('L 120 0'); // Top-Right is sharp
    expect(path).toContain('Z');
  });

  it('renders Squircle component with data attributes and style', () => {
    const { container } = render(
      <Squircle radius={12} smoothing={0.6} data-testid="sq">
        <span>Content</span>
      </Squircle>
    );
    const el = container.querySelector('[data-corner-shape="squircle"]');
    expect(el).not.toBeNull();
    expect(el?.getAttribute('data-corner-smoothing')).toBe('0.6');
  });

  it('renders clipPath SVG defs with computed path', () => {
    const { container } = render(
      <Squircle width={100} height={40} radius={8} smoothing={0.6}>
        <span>Content</span>
      </Squircle>
    );
    const clipPath = container.querySelector('clipPath');
    expect(clipPath).not.toBeNull();
    expect(clipPath?.getAttribute('clipPathUnits')).toBe('userSpaceOnUse');
    const clipId = clipPath?.getAttribute('id');
    expect(clipId).toBeTruthy();

    const pathEl = clipPath?.querySelector('path');
    expect(pathEl).not.toBeNull();
    const d = pathEl?.getAttribute('d');
    expect(d).toContain('M 50 0');
    expect(d).toContain('C ');
    expect(d).toContain('Z');

    const rootEl = container.firstElementChild as HTMLElement;
    expect(rootEl.style.clipPath).toContain(clipId!);
  });

  it('renders border stroke path when borderWidth and borderColor are passed', () => {
    const { container } = render(
      <Squircle
        width={100}
        height={40}
        radius={8}
        borderWidth={2}
        borderColor="#3b82f6"
      >
        <span>Content</span>
      </Squircle>
    );
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBe(2);

    const borderSvg = svgs[1];
    expect(borderSvg).toBeDefined();
    const borderPath = borderSvg?.querySelector('path');
    expect(borderPath).not.toBeNull();
    expect(borderPath?.getAttribute('fill')).toBe('none');
    expect(borderPath?.getAttribute('stroke')).toBe('#3b82f6');
    expect(borderPath?.getAttribute('stroke-width')).toBe('2');
    expect(borderPath?.getAttribute('d')).toContain('M 50 0');
  });

  it('does not render border stroke svg when borderWidth is 0 or borderColor is omitted', () => {
    const { container } = render(
      <Squircle width={100} height={40} radius={8}>
        <span>Content</span>
      </Squircle>
    );
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBe(1);
    const firstSvg = svgs[0];
    expect(firstSvg).toBeDefined();
    expect(firstSvg?.querySelector('clipPath')).not.toBeNull();
  });

  it('dynamically updates path and attributes when smoothing changes', () => {
    const { container, rerender } = render(
      <Squircle width={120} height={60} radius={16} smoothing={0.2} data-testid="sq">
        <span>Dynamic</span>
      </Squircle>
    );
    const el = container.querySelector('[data-corner-shape="squircle"]');
    expect(el?.getAttribute('data-corner-smoothing')).toBe('0.2');

    const path1 = container.querySelector('clipPath path')?.getAttribute('d');
    expect(path1).toBeTruthy();

    // Rerender with different smoothing
    rerender(
      <Squircle width={120} height={60} radius={16} smoothing={0.8} data-testid="sq">
        <span>Dynamic</span>
      </Squircle>
    );
    expect(el?.getAttribute('data-corner-smoothing')).toBe('0.8');

    const path2 = container.querySelector('clipPath path')?.getAttribute('d');
    expect(path2).toBeTruthy();
    expect(path2).not.toBe(path1);
  });

  it('benchmarks mass squircle generation performance (5,000 runs within budget)', () => {
    const start = performance.now();
    const count = 5000;
    for (let i = 0; i < count; ++i) {
      const p = getSquircleSvgPath({
        width: 120 + (i % 20),
        height: 60 + (i % 15),
        cornerRadius: 8 + (i % 8),
        cornerSmoothing: (i % 10) / 10,
      });
      expect(p.length).toBeGreaterThan(0);
    }
    const elapsedMs = performance.now() - start;
    const usPerOp = (elapsedMs * 1000) / count;
    // Budget: less than 20us per op (5,000 ops < 100ms)
    expect(usPerOp).toBeLessThan(20);
  });
});
