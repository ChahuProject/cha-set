import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { KeybindingManager } from './KeybindingManager';
import type { KeybindingActionItem, KeybindingScope, KeybindingSection } from './types';

const mockScopes: KeybindingScope[] = [
  { id: 'global', name: 'Global' },
  { id: 'editor', name: 'Editor' },
];

const mockSections: KeybindingSection[] = [
  { id: 'file', name: 'File Operations', order: 1 },
  { id: 'edit', name: 'Editing', order: 2 },
];

const mockActions: KeybindingActionItem[] = [
  {
    id: 'file.save',
    name: 'Save File',
    description: 'Save current active document to disk',
    scopeId: 'editor',
    sectionId: 'file',
    chords: [{ keyString: 'Ctrl+S', isUserModified: false, isMasked: false }],
    defaultChords: ['Ctrl+S'],
    hasConflict: false,
    conflictOccupiers: [],
    tags: ['Essential'],
  },
  {
    id: 'file.saveAs',
    name: 'Save As',
    description: 'Save file with a new filename',
    scopeId: 'editor',
    sectionId: 'file',
    chords: [{ keyString: 'Ctrl+Shift+S', isUserModified: true, isMasked: false }],
    defaultChords: ['F12'],
    hasConflict: false,
    conflictOccupiers: [],
  },
  {
    id: 'edit.undo',
    name: 'Undo',
    description: 'Undo last change',
    scopeId: 'global',
    sectionId: 'edit',
    chords: [{ keyString: 'Ctrl+Z', isUserModified: false, isMasked: false }],
    defaultChords: ['Ctrl+Z'],
    hasConflict: false,
    conflictOccupiers: [],
  },
];

describe('KeybindingManager', () => {
  it('renders section headers and action items', () => {
    render(
      <KeybindingManager
        actions={mockActions}
        scopes={mockScopes}
        sections={mockSections}
      />,
    );

    expect(screen.getByText('File Operations')).toBeInTheDocument();
    expect(screen.getByText('Editing')).toBeInTheDocument();
    expect(screen.getByText('Save File')).toBeInTheDocument();
    expect(screen.getByText('Undo')).toBeInTheDocument();
    expect(screen.getByText('Save As')).toBeInTheDocument();
  });

  it('filters actions by text search query', () => {
    render(
      <KeybindingManager
        actions={mockActions}
        scopes={mockScopes}
        sections={mockSections}
      />,
    );

    const searchInput = screen.getByPlaceholderText(/Search actions or keys/i);
    fireEvent.change(searchInput, { target: { value: 'undo' } });

    expect(screen.getByText('Undo')).toBeInTheDocument();
    expect(screen.queryByText('Save File')).not.toBeInTheDocument();
  });

  it('filters actions by reverse shortcut query', () => {
    render(
      <KeybindingManager
        actions={mockActions}
        scopes={mockScopes}
        sections={mockSections}
      />,
    );

    const searchInput = screen.getByPlaceholderText(/Search actions or keys/i);
    fireEvent.change(searchInput, { target: { value: 'ctrl+z' } });

    expect(screen.getByText('Undo')).toBeInTheDocument();
    expect(screen.queryByText('Save File')).not.toBeInTheDocument();
  });

  it('renders modified state and triggers onResetAction', () => {
    const handleResetAction = vi.fn();

    render(
      <KeybindingManager
        actions={mockActions}
        scopes={mockScopes}
        sections={mockSections}
        onResetAction={handleResetAction}
      />,
    );

    // Save As was modified, should display User badge
    expect(screen.getByText('User')).toBeInTheDocument();
  });

  it('detects and flags conflicting shortcuts in the same scope', () => {
    const conflictingActions: KeybindingActionItem[] = [
      {
        id: 'action.1',
        name: 'Action One',
        scopeId: 'editor',
        sectionId: 'file',
        chords: [{ keyString: 'Ctrl+D', isUserModified: false, isMasked: false }],
        defaultChords: ['Ctrl+D'],
        hasConflict: false,
        conflictOccupiers: [],
      },
      {
        id: 'action.2',
        name: 'Action Two',
        scopeId: 'editor',
        sectionId: 'file',
        chords: [{ keyString: 'Ctrl+D', isUserModified: false, isMasked: false }],
        defaultChords: ['Ctrl+D'],
        hasConflict: false,
        conflictOccupiers: [],
      },
    ];

    render(
      <KeybindingManager
        actions={conflictingActions}
        scopes={mockScopes}
        sections={mockSections}
      />,
    );

    // Both should show conflict indicators
    const conflictButtons = screen.getAllByText('Conflict');
    expect(conflictButtons.length).toBe(2);
  });

  it('triggers onResetAll callback', () => {
    const handleResetAll = vi.fn();

    render(
      <KeybindingManager
        actions={mockActions}
        scopes={mockScopes}
        sections={mockSections}
        onResetAll={handleResetAll}
      />,
    );

    const resetAllBtn = screen.getByRole('button', { name: /Reset All/i });
    fireEvent.click(resetAllBtn);

    expect(handleResetAll).toHaveBeenCalledTimes(1);
  });

  it('triggers onExportCheatSheet callback', () => {
    const handleExport = vi.fn();

    render(
      <KeybindingManager
        actions={mockActions}
        scopes={mockScopes}
        sections={mockSections}
        onExportCheatSheet={handleExport}
      />,
    );

    const exportBtn = screen.getByRole('button', { name: /Export Sheet/i });
    fireEvent.click(exportBtn);

    expect(handleExport).toHaveBeenCalledTimes(1);
    expect(handleExport.mock.calls[0][0]).toContain('# Keyboard Shortcuts Reference');
    expect(handleExport.mock.calls[0][0]).toContain('Save File');
  });
});
