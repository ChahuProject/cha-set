import type { ReactNode } from 'react';

export interface ReorderableActionColumn {
  key: string;
  activeIcon?: string;
  inactiveIcon?: string;
  tooltip?: string;
  shortcut?: string;
  activeColor?: string;
  inactiveColor?: string;
  objectName?: string;
}

export interface ReorderableListItem {
  id: string;
  label?: string;
  name?: string;
  icon?: string | ReactNode;
  visible?: boolean;
  [key: string]: any;
}
