import React, { useMemo } from 'react';
import { Table, type TableColumn, useChaSetI18n } from '@chahu/cha-set';
import { KEYBOARD_SHORTCUTS_DATA, type KeyboardShortcutItem } from '../data/showcaseData.generated';

export interface KeyboardShortcutsTableProps {
  title?: string;
  componentId?: string;
  shortcuts?: KeyboardShortcutItem[];
}

export function KeyboardShortcutsTable({
  title = 'Keyboard Navigation & Shortcuts',
  componentId,
  shortcuts,
}: KeyboardShortcutsTableProps) {
  const { t } = useChaSetI18n();

  const items: KeyboardShortcutItem[] =
    shortcuts ?? (componentId ? KEYBOARD_SHORTCUTS_DATA[componentId] ?? [] : []);

  const localizedItems = useMemo(() => {
    return items.map((item) => ({
      ...item,
      action: t('keyboard.actions.' + item.action, item.action),
    }));
  }, [items, t]);

  const columns: TableColumn<KeyboardShortcutItem>[] = useMemo(
    () => [
      { key: 'key', title: t('showcase.keyShortcut', 'Key Shortcut'), width: 256, kbd: true },
      { key: 'action', title: t('showcase.actionBehavior', 'Action / Navigation Behavior') },
    ],
    [t]
  );

  if (!items || items.length === 0) {
    return null;
  }

  const localizedTitle = title === 'Keyboard Navigation & Shortcuts'
    ? t('showcase.keyboardShortcuts', 'Keyboard Navigation & Shortcuts')
    : title;

  return (
    <div className="my-6">
      {localizedTitle && <h3 className="text-base font-semibold mb-3 tracking-tight text-foreground">{localizedTitle}</h3>}
      <Table
        columns={columns}
        data={localizedItems}
        bordered
      />
    </div>
  );
}

