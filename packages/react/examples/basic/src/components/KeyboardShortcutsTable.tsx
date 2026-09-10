import React from 'react';
import {
  ScrollArea,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@chahu/cha-set';
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
  const items: KeyboardShortcutItem[] =
    shortcuts ?? (componentId ? KEYBOARD_SHORTCUTS_DATA[componentId] ?? [] : []);

  if (!items || items.length === 0) {
    return null;
  }

  // Parse a shortcut string like "Ctrl + B / ⌘ + B" into formatted kbd tags
  const renderKeyCombo = (keyStr: string) => {
    const parts = keyStr.split(' / ');
    return (
      <div className="flex flex-wrap items-center gap-1.5">
        {parts.map((combo, idx) => {
          const keys = combo.split(' + ');
          return (
            <React.Fragment key={combo}>
              {idx > 0 && <span className="text-muted-foreground text-xs font-normal">or</span>}
              <span className="inline-flex items-center gap-1">
                {keys.map((k) => (
                  <kbd
                    key={k}
                    className="inline-flex items-center justify-center px-1.5 py-0.5 text-[0.6875rem] font-mono font-semibold rounded border border-border bg-muted/60 text-foreground shadow-xs"
                  >
                    {k}
                  </kbd>
                ))}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="my-6">
      {title && <h3 className="text-base font-semibold mb-3 tracking-tight text-foreground">{title}</h3>}
      <ScrollArea
        showVerticalScrollBar={false}
        showHorizontalScrollBar={true}
        showButtons={false}
        className="rounded-lg border border-border w-full"
      >
        <Table className="w-full text-left text-sm border-collapse">
          <TableHeader>
            <TableRow className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <TableHead className="py-2.5 px-4 w-64">Key Shortcut</TableHead>
              <TableHead className="py-2.5 px-4">Action / Navigation Behavior</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border/60">
            {items.map((item, index) => (
              <TableRow key={index} className="hover:bg-muted/20 transition-colors">
                <TableCell className="py-3 px-4 whitespace-nowrap">
                  {renderKeyCombo(item.key)}
                </TableCell>
                <TableCell className="py-3 px-4 text-xs text-muted-foreground leading-relaxed">
                  {item.action}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
