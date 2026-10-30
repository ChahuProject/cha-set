import type * as React from 'react';
import type {
  KeybindingScope,
  KeybindingSection,
  KeybindingChord,
  KeybindingConflictOccupier,
  KeybindingActionItem,
  KeybindingManagerApi,
} from '@chahu/spec/keybinding-manager';

export type {
  KeybindingScope,
  KeybindingSection,
  KeybindingChord,
  KeybindingConflictOccupier,
  KeybindingActionItem,
  KeybindingManagerApi,
};

export interface KeybindingManagerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Configurable action items list */
  actions: KeybindingActionItem[];
  /** Application scopes list for filtering and conflict checking */
  scopes?: KeybindingScope[];
  /** Section categorizations for grouping actions */
  sections?: KeybindingSection[];
  /** Callback fired when an action shortcut chord is modified or cleared */
  onBindingChange?: (actionId: string, chordIndex: number, newKey: string) => void;
  /** Callback fired when resetting a specific action to its default shortcuts */
  onResetAction?: (actionId: string) => void;
  /** Callback fired when restoring all action shortcuts to their defaults */
  onResetAll?: () => void;
  /** Callback fired when exporting the shortcut reference cheat sheet */
  onExportCheatSheet?: (markdown: string) => void;
  /** Whether to display the top search bar (default: true) */
  searchable?: boolean;
  /** Whether actions can have secondary or multiple keybinding chords (default: true) */
  allowMultiChord?: boolean;
  /** Whether to render the global reset all defaults action button (default: true) */
  allowResetAll?: boolean;
  /** Whether to render the export reference cheat sheet action button (default: true) */
  allowExportCheatSheet?: boolean;
  /** Whether to show the User or Builtin source badge on modified actions (default: true) */
  showSourceBadge?: boolean;
  /** Whether to show the scope category badge on each action row (default: true) */
  showScopeBadge?: boolean;
  /** Layout mode: grouped section cards or flat table (default: 'grouped-list') */
  layout?: 'grouped-list' | 'flat-table';
  /** Whether the entire management interface is disabled (default: false) */
  disabled?: boolean;
  /** Container CSS class name */
  className?: string;
}
