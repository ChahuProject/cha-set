---
id: virtual-tree
component: virtual-tree
category: Desktop & Virtualization
title: Virtual Tree
description: Virtualized hierarchical tree view with node expansion, selection, and keyboard navigation.
---

## Keyboard Navigation {#keyboard}

Keyboard operations supported by this component, matching its behaviour without a pointer.

```table shortcuts
| Key | Behavior |
| --- | --- |
| ↑ / ↓ | Navigate virtual focus across visible tree nodes |
| Shift + ↑ / ↓ | Extend multiple selection range across tree nodes |
| → | Expand collapsed folder node or move into first child |
| ← | Collapse expanded folder node or jump to parent node |
| Space | Toggle selection state of currently focused node |
| Enter | Toggle expand/collapse of folder or activate leaf node |
| Ctrl + C | Copy selected node(s) with persistent highlighting |
| Ctrl + X | Cut selected node(s) with dashed dimmed highlighting |
| Ctrl + V | Paste copied or cut nodes into selected folder |
| Escape | Cancel active cut or copy clipboard state |
| Delete | Delete selected node(s) from the virtual tree hierarchy |
| Home / End | Jump directly to the first / last node in the virtual tree |
```

## Props {#props}

Names and semantics are identical on both stacks; `Type` gives the TypeScript signature.

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `rootNodes` | `readonly T[]` | `[]` | Array of top-level hierarchy nodes. |
| `nodes` | `readonly T[]` | `[]` | Alias for rootNodes. |
| `getChildren` | `(node: T) => readonly T[]` | `(node) => node.children` | Accessor returning child nodes of a node. |
| `getNodeKey` | `(node: T) => string` | `(node) => node.id` | Unique identifier accessor for a node. |
| `selectionMode` | `'single' \| 'multiple' \| 'none'` | `'single'` | Active selection interaction mode. |
| `selectedId` | `string \| null` | `null` | Identifier of the currently selected node (single mode). |
| `selectedIds` | `readonly string[]` | `[]` | Array of selected node identifiers (multiple mode). |
| `dimmedIds` | `readonly string[]` | `[]` | Array of node IDs rendered in dimmed/cut state. |
| `stickyItems` | `readonly VirtualTreeStickyItem[]` | `[]` | Expanded ancestor chain of the open node, pinned above the scroll area so parents stay visible. |
| `onStickySelect` | `(item: VirtualTreeStickyItem) => void` | `undefined` | Callback fired when a pinned row is clicked (navigate only, never toggles expansion). |
| `onStickyToggle` | `(item: VirtualTreeStickyItem) => void` | `undefined` | Callback fired when the chevron of a pinned row is activated. |
| `enableDnd` | `boolean` | `false` | Enables drag-and-drop reordering and folder nesting. |
| `onSelectionChange` | `(ids: string[], nodes: T[]) => void` | `undefined` | Callback fired when selected nodes change. |
| `onDropNode` | `(evt: VirtualTreeDropEvent<T>) => void` | `undefined` | Callback fired when nodes are dropped. |
| `onCut` | `(nodes: T[], ids: string[]) => void` | `undefined` | Callback fired on Ctrl+X cut shortcut. |
| `onPaste` | `(target: T \| null, pos: string) => void` | `undefined` | Callback fired on Ctrl+V paste shortcut. |
| `defaultExpandDepth` | `number` | `0` | Default level of expansion for child branches. |
| `estimateSize` | `number` | `32` | Estimated row height for virtual calculation. |
| `gap` | `number` | `0` | Spacing between adjacent rows. |
| `overscan` | `number` | `10` | Buffer nodes rendered outside visible bounds. |
| `renderRow` | `(context: VirtualTreeRowContext<T>) => ReactNode` | `undefined` | Custom row rendering function. |
| `emptyNode` | `ReactNode` | `null` | Content shown when tree is empty. |
| `ref` | `Ref<VirtualTreeHandle>` | `undefined` | Handle exposing expandAll(), collapseAll(), selectAll(), scrollToIndex(). |
```
