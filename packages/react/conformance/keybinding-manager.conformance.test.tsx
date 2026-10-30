import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { keybindingManagerSchema, keybindingActionItemSchema } from '@chahu/spec/keybinding-manager';

describe('KeybindingManager conformance (spec contract)', () => {
  it('accepts a valid action item fixture that satisfies schema', () => {
    const actionFixture = {
      id: 'app.save',
      name: 'Save',
      description: 'Save document',
      scopeId: 'editor',
      sectionId: 'file',
      chords: [{ keyString: 'Ctrl+S', isUserModified: false, isMasked: false }],
      defaultChords: ['Ctrl+S'],
      hasConflict: false,
      conflictOccupiers: [],
      disabled: false,
      tags: ['Hot'],
    };
    expect(() => keybindingActionItemSchema.parse(actionFixture)).not.toThrow();
  });

  it('accepts a KeybindingManager props fixture that satisfies schema', () => {
    const managerFixture = {
      actions: [
        {
          id: 'app.search',
          name: 'Search',
          scopeId: 'global',
          sectionId: 'nav',
          chords: [{ keyString: 'Ctrl+K', isUserModified: false, isMasked: false }],
          defaultChords: ['Ctrl+K'],
          hasConflict: false,
          conflictOccupiers: [],
          disabled: false,
          tags: [],
        },
      ],
      scopes: [{ id: 'global', name: 'Global' }],
      sections: [{ id: 'nav', name: 'Navigation', order: 1 }],
      searchable: true,
      allowMultiChord: true,
      allowExportCheatSheet: true,
      allowResetAll: true,
      showSourceBadge: true,
      showScopeBadge: true,
      layout: 'grouped-list',
    } as const;
    expect(() => keybindingManagerSchema.parse(managerFixture)).not.toThrow();
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) {
      console.warn('[conformance] coverage.json not present yet; skipping earned-capability assertions');
      return;
    }
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      keybindingManager?: Record<string, boolean>;
    };
    for (const cap of [
      'rendersActions',
      'searchAndFilter',
      'recordBinding',
      'conflictDetection',
      'conflictResolution',
      'resetAction',
      'resetAll',
    ] as const) {
      expect(coverage.keybindingManager?.[cap], `capability "${cap}" must be earned`).toBe(true);
    }
  });
});
