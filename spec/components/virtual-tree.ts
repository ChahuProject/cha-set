import { z } from 'zod';

/**
 * Neutral API contract for VirtualTree component.
 *
 * Three cross-stack interaction contracts are shared by React and Qt:
 *
 * 1. Occurrence keys — `VirtualTreeGetNodeKey` (React `getNodeKey`, Qt
 *    `nodeKeyProvider`). Default: `node.id`.
 * 2. Lazy loading — `VirtualTreeNodeState` plus the expand request
 *    (React `onExpandRequest`, Qt `nodeExpandRequested`). Chevron visibility is
 *    always driven by `hasChildren`, never by `children.length`.
 * 3. Row content slot — `VirtualTreeRowContext` (React `renderRow`, Qt
 *    `rowDelegate`). Default: built-in row renderer.
 */
export const virtualTreeSchema = z.object({
  defaultExpandDepth: z.number().default(0),
  estimateSize: z.number().default(32),
  gap: z.number().default(0),
  overscan: z.number().default(10),
  selectionMode: z.enum(['single', 'multiple', 'none']).default('single'),
  enableDnd: z.boolean().default(false),
  showBadges: z.boolean().default(true),
  /**
   * Multi-level frozen ancestors: the host passes the ancestor chain of the
   * currently open node (outermost -> innermost, already filtered down to the
   * levels that are actually expanded). The component pins those rows above the
   * scroll area so parents stay visible while scrolling the subtree.
   */
  stickyItems: z
    .array(
      z.object({
        id: z.string(),
        label: z.string().default(''),
        depth: z.number().default(0),
        hasChildren: z.boolean().default(false),
        isExpanded: z.boolean().default(false),
      }),
    )
    .default([]),
});

/**
 * Lazy-loading node state (optional fields on every tree node).
 *
 * - `isLoaded` default `true`: the node's children array is authoritative.
 * - `isLoading` default `false`: the host is fetching children.
 * - `isLoaded: false` means the component must not render children for that
 *   node, even if a stale `children` array is still present; once the host
 *   flips the flag the already-recorded expansion state takes effect.
 * - Chevron visibility is always driven by `hasChildren`, so an unloaded node
 *   that is known to contain children still offers an expand affordance.
 * - Expanding (`toggleExpand`) a node with `isLoaded: false` fires the expand
 *   request (`onExpandRequest` / `nodeExpandRequested`) exactly once per toggle.
 */
export const virtualTreeNodeStateSchema = z.object({
  hasChildren: z.boolean().optional(),
  isLoaded: z.boolean().default(true),
  isLoading: z.boolean().default(false),
});

export type VirtualTreeNodeState = z.infer<typeof virtualTreeNodeStateSchema>;

/**
 * Occurrence key provider.
 *
 * The key identifies a *displayed occurrence*, not a logical entity. When the
 * same entity is mounted at several positions (e.g. the same folder reachable
 * from both "This PC" and its drive path), the host returns a position-qualified
 * key so expansion/selection/drag identity never leaks across occurrences.
 *
 * Default: `node.id`.
 *
 * React: `getNodeKey` prop. Qt: `nodeKeyProvider` property (a function).
 */
export type VirtualTreeGetNodeKey<T = unknown> = (node: T) => string;

/**
 * Fired when the user opens a node whose `isLoaded` flag is false.
 *
 * React: `onExpandRequest(node, key)`. Qt: `nodeExpandRequested(key)` signal.
 * The component records the expansion state optimistically; the host loads the
 * children, sets `isLoaded: true`, and they render under the already-open node.
 */
export type VirtualTreeExpandRequestHandler<T = unknown> = (
  node: T,
  key: string,
) => void;

/**
 * Context handed to the row content slot. Mirrors the React `renderRow`
 * argument; Qt exposes the same fields through `rowDelegate.root.rowContext`.
 */
export interface VirtualTreeRowContext<T = unknown> {
  node: T;
  /** Logical node id (`node.id`), independent of the occurrence key. */
  id: string;
  /** Occurrence key resolved from the node (defaults to `id`). */
  key: string;
  depth: number;
  hasChildren: boolean;
  isExpanded: boolean;
  isSelected: boolean;
  isDimmed: boolean;
  isCopied: boolean;
  isLoaded: boolean;
  isLoading: boolean;
  childCount: number;
  toggleExpand: () => void;
  selectNode: (event?: unknown) => void;
}

/**
 * Row content slot.
 *
 * React: `renderRow(context)`. Qt: `rowDelegate` Component whose root declares
 * `property var rowContext`. The slot replaces the built-in row content
 * (chevron / bullet / icon / label / badge); the component keeps ownership of
 * the row shell (background, selection, drop indicators, click/drag plumbing).
 *
 * Default: `undefined` -> built-in row renderer.
 */
export type VirtualTreeRenderRow<T = unknown> = (
  context: VirtualTreeRowContext<T>,
) => unknown;

export type VirtualTreeApi = z.infer<typeof virtualTreeSchema>;
