import * as React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Sidebar } from '../../examples/basic/src/layout/Sidebar';
import { NAVIGATION_CONFIG } from '../../examples/basic/src/types/navigation';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '..', '..', '..', '..');
const componentsDir = path.resolve(repoRoot, 'spec', 'components');

describe('React Showcase Sidebar Navigation (Single Source of Truth)', () => {
  it('contains every single component defined in spec/components', () => {
    const specFiles = fs.readdirSync(componentsDir).filter((f: string) => f.endsWith('.ts'));
    const specialMap: Record<string, string> = {
      'scrollbar': 'scroll-area',
      'data-table': 'generic-data-table',
    };

    const rendered = render(<Sidebar currentHash="" />);
    const links = Array.from(rendered.container.querySelectorAll('a')).map(a => a.getAttribute('href'));

    const allNavIds = new Set<string>();
    for (const group of NAVIGATION_CONFIG) {
      for (const item of group.items) {
        allNavIds.add(item.id);
      }
    }

    for (const file of specFiles) {
      const base = file.replace('.ts', '');
      const navId = specialMap[base] || base;

      // Assert that navId is in NAVIGATION_CONFIG
      expect(allNavIds.has(navId)).toBe(true);

      // Assert that navId exists as a rendered link in Sidebar DOM
      const expectedHref = `#/components/${navId}`;
      expect(links).toContain(expectedHref);
    }
  });
});
