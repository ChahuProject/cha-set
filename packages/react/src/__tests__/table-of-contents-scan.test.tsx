import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TableOfContents, scanDocSections, slugToTitle } from '../../examples/basic/src/layout/TableOfContents';
import { DocLayout } from '../../examples/basic/src/layout/DocLayout';

describe('TableOfContents Auto-Scanning Engine (React)', () => {
  it('converts slug ids to capitalized readable titles correctly', () => {
    expect(slugToTitle('status-and-tags')).toBe('Status And Tags');
    expect(slugToTitle('multi-file')).toBe('Multi File');
    expect(slugToTitle('slider-ticks')).toBe('Slider Ticks');
  });

  it('scans DOM container and accurately extracts sections and real heading titles', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <section id="overview">
        <div data-testid="sandbox">Sandbox Content</div>
      </section>
      <section id="installation">
        <h2>Installation</h2>
        <pre><code>pnpm add @chahu/cha-set</code></pre>
      </section>
      <section id="status-and-tags">
        <h2>Status & Removable Tags</h2>
        <div>Badge items</div>
      </section>
      <section id="keyboard">
        <h2>Keyboard Navigation</h2>
      </section>
      <section id="props">
        <h2>Props Reference</h2>
      </section>
    `;

    const items = scanDocSections(container);
    expect(items).toEqual([
      { id: 'overview', title: 'Interactive Overview' },
      { id: 'installation', title: 'Installation' },
      { id: 'status-and-tags', title: 'Status & Removable Tags' },
      { id: 'keyboard', title: 'Keyboard Navigation' },
      { id: 'props', title: 'Props Reference' },
    ]);
  });

  it('honors data-toc-title when explicitly provided on section elements', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <section id="custom-demo" data-toc-title="Custom Visual Gallery">
        <h2>Hidden Technical Heading</h2>
      </section>
    `;

    const items = scanDocSections(container);
    expect(items).toEqual([
      { id: 'custom-demo', title: 'Custom Visual Gallery' },
    ]);
  });

  it('automatically populates TableOfContents when used with DocLayout without explicit tocItems', () => {
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn();

    let container: HTMLElement;
    React.act(() => {
      const res = render(
        <DocLayout
          category="Test Category"
          title="Test Component"
          description="Testing auto-scanning TOC"
        >
          <section id="overview">
            <div>Overview Stage</div>
          </section>
          <section id="installation">
            <h2>Installation</h2>
          </section>
          <section id="interactive-features">
            <h2>Advanced Interactive Features</h2>
          </section>
          <section id="props">
            <h2>Props Reference</h2>
          </section>
        </DocLayout>
      );
      container = res.container;
    });

    // Verify "On this page" renders
    expect(screen.getByText('On this page')).toBeDefined();

    const nav = container!.querySelector('nav')!;
    expect(nav).toBeDefined();

    // Verify all auto-scanned titles are rendered in the navigation
    const links = Array.from(nav.querySelectorAll('a'));
    expect(links.map((l) => l.textContent?.trim())).toEqual([
      'Interactive Overview',
      'Installation',
      'Advanced Interactive Features',
      'Props Reference',
    ]);

    // Click on a link and verify scroll
    const link = links.find((l) => l.textContent?.trim() === 'Advanced Interactive Features')!;
    React.act(() => {
      fireEvent.click(link);
    });
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  });

  it('preserves backward compatibility when explicit tocItems are provided', () => {
    let container: HTMLElement;
    React.act(() => {
      const res = render(
        <DocLayout
          category="Test Category"
          title="Test Component"
          description="Testing manual override"
          tocItems={[
            { id: 'overview', title: 'Manual Overview' },
            { id: 'manual-section', title: 'Manual Title' },
          ]}
        >
          <section id="ignored-section">
            <h2>Should Be Overridden</h2>
          </section>
        </DocLayout>
      );
      container = res.container;
    });

    const nav = container!.querySelector('nav')!;
    const links = Array.from(nav.querySelectorAll('a')).map((l) => l.textContent?.trim());
    expect(links).toEqual(['Manual Overview', 'Manual Title']);
  });
});
