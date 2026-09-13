import React from 'react';
import { Table, type TableColumn } from '@chahu/cha-set';
import { KEYBOARD_SHORTCUTS_DATA, type KeyboardShortcutItem } from '../data/showcaseData.generated';

export interface KeyboardShortcutsTableProps {
  title?: string;
  componentId?: string;
  shortcuts?: KeyboardShortcutItem[];
}

const SHORTCUT_COLUMNS: TableColumn<KeyboardShortcutItem>[] = [
  { key: 'key', title: 'Key Shortcut', width: 256, kbd: true },
  { key: 'action', title: 'Action / Navigation Behavior' },
];

export function KeyboardShortcutsTable({
  title = 'Keyboard Navigation & Shortcuts',
  componentId,
  shortcuts,
}: KeyboardShortcutsTableProps) {
  const items: KeyboardShortcutItem[] =
    shortcuts ?? (componentId ? KEYBOARD_SHORTCUTS_DATA[componentId] ?? [] : []);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="my-6">
      {title && <h3 className="text-base font-semibold mb-3 tracking-tight text-foreground">{title}</h3>}
      <Table
        columns={SHORTCUT_COLUMNS}
        data={items}
        bordered
      />
    </div>
  );
}

