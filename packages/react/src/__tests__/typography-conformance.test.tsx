import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import * as React from 'react';
import { render } from '@testing-library/react';

import { Button } from '../button';
import { Badge } from '../badge';
import { Tabs, TabsList, TabsTrigger } from '../tabs';
import { SegmentedControl } from '../segmented-control';
import { defaultSansFontStack, defaultMonoFontStack } from '../typography';

const repoRoot = resolve(__dirname, '../../../../');
const tokensCssPath = resolve(repoRoot, 'packages/react/src/styles/tokens.css');
const themeCssPath = resolve(repoRoot, 'packages/react/src/styles/theme.css');
const specTypographyPath = resolve(repoRoot, 'spec/tokens/primitives/typography.json');
const specFontWeightPath = resolve(repoRoot, 'spec/tokens/primitives/font-weight.json');

describe('Typography Conformance & Token Parity', () => {
  it('tokens.css contains all required font families, sizes, weights, and leading tokens', () => {
    expect(existsSync(tokensCssPath)).toBe(true);
    const css = readFileSync(tokensCssPath, 'utf8');

    // Font family tokens
    expect(css).toContain('--cs-font-sans:');
    expect(css).toContain('--cs-font-mono:');
    expect(css).toContain('Consolas');
    expect(css).toContain('Segoe UI');
    expect(css).toContain('Microsoft YaHei');
    expect(css).toContain('PingFang SC');

    // Key scale sizes
    expect(css).toContain('--cs-text-display:');
    expect(css).toContain('--cs-text-title:');
    expect(css).toContain('--cs-text-heading:');
    expect(css).toContain('--cs-text-body:');
    expect(css).toContain('--cs-text-small:');
    expect(css).toContain('--cs-text-caption:');

    // Line heights
    expect(css).toContain('--cs-leading-normal:');
    expect(css).toContain('--cs-leading-code:');
    expect(css).toContain('--cs-leading-tight:');

    // Font weights
    expect(css).toContain('--cs-font-weight-regular: 400');
    expect(css).toContain('--cs-font-weight-medium: 500');
    expect(css).toContain('--cs-font-weight-semibold: 600');
    expect(css).toContain('--cs-font-weight-bold: 700');
  });

  it('theme.css applies antialiased font smoothing and fallback variables', () => {
    expect(existsSync(themeCssPath)).toBe(true);
    const css = readFileSync(themeCssPath, 'utf8');

    expect(css).toContain('-webkit-font-smoothing: antialiased');
    expect(css).toContain('-moz-osx-font-smoothing: grayscale');
    expect(css).toContain('--font-sans: var(--font-sans, var(--cs-font-sans));');
    expect(css).toContain('--font-mono: var(--font-mono, var(--cs-font-mono));');
  });

  it('spec/tokens primitives define expected typography scales', () => {
    if (existsSync(specTypographyPath)) {
      const typo = JSON.parse(readFileSync(specTypographyPath, 'utf8'));
      expect(typo.fontSize.display).toBe(36);
      expect(typo.fontSize.heading).toBe(16);
      expect(typo.fontSize.body).toBe(14);
      expect(typo.fontSize.small).toBe(12);
      expect(typo.fontSize.caption).toBe(11);
    }
    if (existsSync(specFontWeightPath)) {
      const weights = JSON.parse(readFileSync(specFontWeightPath, 'utf8'));
      expect(weights.regular).toBe(400);
      expect(weights.medium).toBe(500);
      expect(weights.semibold).toBe(600);
      expect(weights.bold).toBe(700);
    }
  });

  it('Button renders with proper typographic classes', () => {
    const { container } = render(<Button>Click me</Button>);
    const btn = container.querySelector('button');
    expect(btn).toBeTruthy();
    // Button default size uses text-sm font-medium
    expect(btn?.className).toMatch(/text-sm|text-xs/);
    expect(btn?.className).toContain('font-medium');
  });

  it('Badge renders with proper typographic classes', () => {
    const { container } = render(<Badge>Status</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toBeTruthy();
    // Badge default size uses text-xs font-medium
    expect(badge?.className).toContain('text-xs');
    expect(badge?.className).toContain('font-medium');
  });

  it('TabsTrigger renders with proper typographic classes', () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    const trigger = container.querySelector('button');
    expect(trigger).toBeTruthy();
    expect(trigger?.className).toMatch(/text-sm|text-xs/);
    expect(trigger?.className).toContain('font-medium');
  });

  it('SegmentedControl renders with proper typographic classes', () => {
    const options = [
      { label: 'Option A', value: 'a' },
      { label: 'Option B', value: 'b' },
    ];
    const { container } = render(<SegmentedControl options={options} value="a" onValueChange={() => {}} />);
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(2);
    expect(buttons[0]?.className).toMatch(/text-sm|text-xs/);
  });

  it('exports defaultSansFontStack and defaultMonoFontStack with CJK fallback', () => {
    expect(defaultSansFontStack).toContain('Microsoft YaHei');
    expect(defaultSansFontStack).toContain('PingFang SC');
    expect(defaultMonoFontStack).toContain('Microsoft YaHei');
    expect(defaultMonoFontStack).toContain('PingFang SC');
  });
});
