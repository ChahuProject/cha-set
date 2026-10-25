import * as React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

import { buildDocAst, inlineText } from '../../../../spec/shared/docAst.mjs';
import { DocMarkdown } from '../../examples/basic/src/components/DocMarkdown';

/**
 * The Markdown is loaded the same way the pages load it — a Vite glob — so the test
 * reads the very bytes the renderer sees, with no second path convention to drift.
 */
const CONTENT_FILES = import.meta.glob('../../../../spec/content/*/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

/**
 * Keyboard navigation used to be checked against spec/showcase/keyboard-shortcuts.json,
 * a second copy of the data that lived next to the prose. Every component now documents
 * its shortcuts in spec/content/<id>/<locale>.md as a `table shortcuts` block, so this
 * test reads that file — the one the pages actually render — instead of a generated
 * export. A shortcut row that existed in the JSON but never reached a page would pass
 * the old check; a row that reaches the page but was dropped from the Markdown fails
 * this one.
 */
const CRITICAL_COMPONENTS = [
  'button',
  'dropdown-menu',
  'select',
  'context-menu',
  'dialog',
  'tabs',
  'slider',
  'scroll-area',
  'table',
  'virtual-list',
  'virtual-tree',
];

function readContent(docId: string, locale = 'en-US'): string {
  const suffix = `/spec/content/${docId}/${locale}.md`;
  const entry = Object.entries(CONTENT_FILES).find(([path]) => path.endsWith(suffix));
  if (!entry) throw new Error(`No Markdown found for ${docId} (${locale})`);
  return entry[1];
}

/** The `table shortcuts` block of a component's keyboard section, or null when absent. */
function shortcutsTable(docId: string) {
  const parsed = buildDocAst(readContent(docId));
  const section = parsed.page?.sections.find((entry) => entry.id === 'keyboard');
  for (const block of section?.blocks ?? []) {
    if (block.t === 'table' && block.schema === 'shortcuts') return block;
  }
  return null;
}

describe('Keyboard Navigation & Input Modality Standards', () => {
  it('documents keyboard shortcuts for all critical components', () => {
    for (const comp of CRITICAL_COMPONENTS) {
      const parsed = buildDocAst(readContent(comp));
      expect(parsed.errors, `Component ${comp} Markdown must parse cleanly`).toEqual([]);

      const table = shortcutsTable(comp);
      expect(table, `Component ${comp} must document its shortcuts as a shortcuts table`).toBeTruthy();
      if (!table) continue;

      expect(table.rows.length, `Component ${comp} must document at least one shortcut`).toBeGreaterThan(0);

      for (const row of table.rows) {
        expect(row.length, `Component ${comp} shortcut rows have a key and an action`).toBe(2);
        expect(inlineText(row[0] ?? []).length, `Component ${comp} shortcut row has a key`).toBeGreaterThan(0);
        expect(inlineText(row[1] ?? []).length, `Component ${comp} shortcut row has an action`).toBeGreaterThan(0);
      }
    }
  });

  it('renders documented shortcuts as keycaps instead of literal brackets', () => {
    const { container, queryByText } = render(<DocMarkdown id="dropdown-menu" section="keyboard" />);

    expect(queryByText(/Missing section/)).toBeNull();

    const bodyRows = container.querySelectorAll('tbody tr');
    expect(bodyRows.length).toBeGreaterThan(0);

    // The key column becomes real keycaps; the brackets never leak through as text.
    const caps = container.querySelectorAll('[data-slot="kbd"]');
    expect(caps.length).toBeGreaterThan(0);
    expect(container.textContent).not.toContain('[[');
    expect(container.textContent).not.toContain(']]');
  });

  it('keeps the action text next to its keycap', () => {
    const table = shortcutsTable('dropdown-menu');
    expect(table).toBeTruthy();
    if (!table) return;

    const action = inlineText(table.rows[0]?.[1] ?? []);
    const { container } = render(<DocMarkdown id="dropdown-menu" section="keyboard" />);

    expect(container.textContent).toContain(action);
  });
});
