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

  it('renders Squircle component with native CSS corner-shape and data attributes', () => {
    const { container } = render(
      <Squircle radius={12} smoothing={0.6} data-testid="sq">
        <span>Content</span>
      </Squircle>
    );
    const el = container.querySelector('[data-corner-shape="squircle"]') as HTMLElement;
    expect(el).not.toBeNull();
    expect(el?.getAttribute('data-corner-smoothing')).toBe('0.6');
    expect((el?.style as any).cornerShape).toBe('squircle');
    expect(el?.style.borderTopLeftRadius).toBe(`${12 * 0.0625}rem`);
  });

  it('renders native CSS styles for dimensions, background, and borders', () => {
    const { container } = render(
      <Squircle
        width={100}
        height={40}
        radius={8}
        smoothing={0.6}
        borderWidth={2}
        borderColor="#3b82f6"
        color="rgba(59, 130, 246, 0.15)"
      >
        <span>Content</span>
      </Squircle>
    );
    const rootEl = container.firstElementChild as HTMLElement;
    expect(rootEl).not.toBeNull();
    expect(rootEl.style.width).toBe(`${100 * 0.0625}rem`);
    expect(rootEl.style.height).toBe(`${40 * 0.0625}rem`);
    expect(rootEl.style.borderWidth).toBe(`${2 * 0.0625}rem`);
    expect(rootEl.style.borderColor).toBe('rgb(59, 130, 246)');
    expect(rootEl.style.borderStyle).toBe('solid');
    expect(rootEl.style.backgroundColor).toBe('rgba(59, 130, 246, 0.15)');
    expect((rootEl.style as any).cornerShape).toBe('squircle');
  });

  it('dynamically maps smoothing factor to native corner-shape values', () => {
    const { container, rerender } = render(
      <Squircle radius={16} smoothing={0.0} data-testid="sq">
        <span>Dynamic</span>
      </Squircle>
    );
    const el = container.querySelector('[data-testid="sq"]') as HTMLElement;
    expect(el?.getAttribute('data-corner-shape')).toBe('round');
    expect((el?.style as any).cornerShape).toBe('round');

    // Rerender with standard iOS 0.6 smoothing
    rerender(
      <Squircle radius={16} smoothing={0.6} data-testid="sq">
        <span>Dynamic</span>
      </Squircle>
    );
    expect(el?.getAttribute('data-corner-shape')).toBe('squircle');
    expect((el?.style as any).cornerShape).toBe('squircle');

    // Rerender with 1.0 (full continuous squircle)
    rerender(
      <Squircle radius={16} smoothing={1.0} data-testid="sq">
        <span>Dynamic</span>
      </Squircle>
    );
    expect(el?.getAttribute('data-corner-shape')).toBe('superellipse(2)');
    expect((el?.style as any).cornerShape).toBe('superellipse(2)');
  });

  it('handles per-corner selective rounding via native border radii', () => {
    const { container } = render(
      <Squircle
        radius={16}
        roundLeft={true}
        roundRight={false}
        topLeftRadius={24}
      >
        <span>Selective</span>
      </Squircle>
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.borderTopLeftRadius).toBe(`${24 * 0.0625}rem`);
    expect(el.style.borderBottomLeftRadius).toBe(`${16 * 0.0625}rem`);
    expect(el.style.borderTopRightRadius).toBe('0rem');
    expect(el.style.borderBottomRightRadius).toBe('0rem');
  });

  it('preserves full smoothing continuous curvature without corner pinching at large radii', () => {
    // When width=192, height=128, cornerRadius=48, cornerSmoothing=1.0:
    // budget is 64. preserveSmoothing preserves G2 continuous curvature.
    const pathPreserved = getSquircleSvgPath({
      width: 192,
      height: 128,
      cornerRadius: 48,
      cornerSmoothing: 1.0,
      preserveSmoothing: true,
    });
    expect(pathPreserved).toContain('M 96 0');
    expect(pathPreserved).toContain('C ');
    expect(pathPreserved).toContain('Z');

    // When preserveSmoothing is false, smoothing is clamped to budget/r - 1 = 64/48 - 1 = 0.333
    const pathClamped = getSquircleSvgPath({
      width: 192,
      height: 128,
      cornerRadius: 48,
      cornerSmoothing: 1.0,
      preserveSmoothing: false,
    });
    expect(pathClamped).not.toBe(pathPreserved);
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
    // Budget: less than 60us per op (5,000 ops < 300ms) with allowance for concurrent test suites
    expect(usPerOp).toBeLessThan(60);
  });
});
