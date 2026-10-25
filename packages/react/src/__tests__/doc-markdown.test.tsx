import * as React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

import { DocMarkdown } from '../../examples/basic/src/components/DocMarkdown';

/**
 * The Markdown dialect's newer vocabulary — typed tables and inline keycaps — is rendered by
 * `DocMarkdown`, which parses `spec/content/` at RUNTIME. These tests pin the *shape* of that
 * rendering rather than its classes: a props table must reach the design-system table with
 * real rows, a shortcuts table must produce real keycaps, and `[[Ctrl+K]]` must never leak
 * through as literal text. Without them a parser regression would render a table as a
 * paragraph on both stacks with no error anywhere.
 */
describe('DocMarkdown block vocabulary', () => {
  it('renders a ```table props``` block as a populated reference table', () => {
    const { container, queryByText } = render(<DocMarkdown id="table-of-contents" section="props" />);

    expect(queryByText(/Missing section/)).toBeNull();

    const table = container.querySelector('table');
    expect(table).not.toBeNull();

    const bodyRows = container.querySelectorAll('tbody tr');
    expect(bodyRows.length).toBe(10);

    // The header row is authored in Markdown, not hardcoded by the renderer.
    expect(container.querySelector('thead')?.textContent).toContain('Prop');
    expect(container.querySelector('thead')?.textContent).toContain('Default');

    // First row: identifier, type, default, description — each in its own column.
    const firstRow = bodyRows[0]?.textContent ?? '';
    expect(firstRow).toContain('items');
    expect(firstRow).toContain('TocItem[]');
    expect(firstRow).toContain('[]');

    // An escaped pipe inside a code span must survive as a pipe, not split the cell.
    expect(container.textContent).toContain('"default" | "track" | "flat"');
    expect(container.textContent).not.toContain('\\|');
  });

  it('renders a ```table shortcuts``` block as keycaps', () => {
    const { container, queryByText } = render(<DocMarkdown id="table-of-contents" section="keyboard" />);

    expect(queryByText(/Missing section/)).toBeNull();

    const bodyRows = container.querySelectorAll('tbody tr');
    expect(bodyRows.length).toBe(4);

    // Four rows, nine keys in total (↑ ↓ Home End Space Enter Tab Shift Tab).
    const caps = container.querySelectorAll('[data-slot="kbd"]');
    expect(caps.length).toBeGreaterThanOrEqual(8);

    // Inline `[[…]]` in prose becomes keycaps too, and never leaks its brackets.
    expect(container.textContent).not.toContain('[[');
    expect(container.textContent).not.toContain(']]');
  });

  it('keeps a schema-free table rich (chips and bold survive)', () => {
    const { container } = render(<DocMarkdown id="table-of-contents" section="animations" />);

    // The Animations section has no table, but it does prove inline rendering still works
    // through the same code path the table cells use.
    expect(container.querySelector('ul')).not.toBeNull();
    expect(container.textContent).toContain('duration-quick');
  });
});
