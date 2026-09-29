import {
  SHORTCUT_PRESETS,
  type ShortcutItem,
  type ShortcutPresetName,
} from '@chahu/spec/kbd';

export interface ComposeShortcutsOptions {
  /** Additional shortcuts to append at the end */
  append?: ShortcutItem[];
  /** Shortcuts to prepend at the beginning */
  prepend?: ShortcutItem[];
  /** Partial field overrides indexed by shortcut item id */
  overrides?: Record<string, Partial<ShortcutItem>>;
  /** IDs of shortcuts to exclude */
  exclude?: string[];
}

/**
 * Merges, filters, overrides and composes shortcut items based on presets or custom lists.
 */
export function composeShortcuts(
  base: ShortcutPresetName | ShortcutItem[] = 'dropdown',
  options?: ComposeShortcutsOptions,
): ShortcutItem[] {
  const baseItems: ShortcutItem[] =
    typeof base === 'string'
      ? (SHORTCUT_PRESETS[base] ?? SHORTCUT_PRESETS.dropdown)
      : (base ?? []);

  let result = [...baseItems];

  // 1. Exclude
  if (options?.exclude && options.exclude.length > 0) {
    const excludeSet = new Set(options.exclude);
    result = result.filter((item) => !excludeSet.has(item.id));
  }

  // 2. Overrides
  if (options?.overrides) {
    result = result.map((item) => {
      const patch = options.overrides?.[item.id];
      return patch ? { ...item, ...patch } : item;
    });
  }

  // 3. Prepend
  if (options?.prepend && options.prepend.length > 0) {
    result = [...options.prepend, ...result];
  }

  // 4. Append
  if (options?.append && options.append.length > 0) {
    result = [...result, ...options.append];
  }

  // 5. Deduplicate by id if duplicates were introduced, preserving latest
  const seen = new Set<string>();
  const deduplicated: ShortcutItem[] = [];
  for (let i = result.length - 1; i >= 0; i--) {
    const item = result[i];
    if (item && !seen.has(item.id)) {
      seen.add(item.id);
      deduplicated.unshift(item);
    }
  }


  return deduplicated;
}
