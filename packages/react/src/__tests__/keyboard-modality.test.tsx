import * as React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KeyboardShortcutsTable } from '../../examples/basic/src/components/KeyboardShortcutsTable';
import { KEYBOARD_SHORTCUTS_DATA } from '../../examples/basic/src/data/showcaseData.generated';

describe('Keyboard Navigation & Input Modality Standards', () => {
  it('has valid keyboard specifications registered for all critical components', () => {
    const requiredComponents = [
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

    for (const comp of requiredComponents) {
      const shortcuts = KEYBOARD_SHORTCUTS_DATA[comp];
      expect(shortcuts, `Component ${comp} must have keyboard shortcuts registered`).toBeDefined();
      if (!shortcuts) continue;
      expect(shortcuts.length).toBeGreaterThan(0);
      for (const item of shortcuts) {
        expect(item.key).toBeTruthy();
        expect(item.action).toBeTruthy();
      }
    }
  });

  it('renders KeyboardShortcutsTable component with styled kbd badges and action text', () => {
    const { container } = render(
      <KeyboardShortcutsTable componentId="dropdown-menu" />
    );

    // Verify section title is present
    expect(screen.getByText('Keyboard Navigation & Shortcuts')).toBeInTheDocument();

    // Verify key badges are rendered
    const kbdElements = container.querySelectorAll('kbd');
    expect(kbdElements.length).toBeGreaterThan(0);

    // Verify table structure
    expect(screen.getByText('Key Shortcut')).toBeInTheDocument();
    expect(screen.getByText('Action / Navigation Behavior')).toBeInTheDocument();

    // Verify item action text from spec
    const dropdownShortcuts = KEYBOARD_SHORTCUTS_DATA['dropdown-menu'];
    expect(dropdownShortcuts).toBeDefined();
    if (dropdownShortcuts && dropdownShortcuts[0]) {
      expect(screen.getByText(dropdownShortcuts[0].action)).toBeInTheDocument();
    }
  });

  it('renders custom shortcuts table when custom shortcuts array is passed', () => {
    const custom = [
      { key: 'Ctrl + K', action: 'Open command palette' },
      { key: 'Escape', action: 'Close command palette' },
    ];

    const { container } = render(
      <KeyboardShortcutsTable title="Custom Shortcuts" shortcuts={custom} />
    );

    expect(screen.getByText('Custom Shortcuts')).toBeInTheDocument();
    expect(screen.getByText('Open command palette')).toBeInTheDocument();
    expect(screen.getByText('Close command palette')).toBeInTheDocument();
    const kbds = container.querySelectorAll('kbd');
    expect(kbds.length).toBe(3); // Ctrl, K, Escape
  });
});
