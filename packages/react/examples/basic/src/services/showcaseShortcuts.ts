import { SHORTCUTS_DATA as defaultShortcutsData } from '../data/showcaseData.generated';
import type { KeybindingActionItem, KeybindingScope, KeybindingSection } from '@chahu/cha-set';

const STORAGE_KEY = 'chaset_showcase_shortcuts_v1';

export interface ShowcaseShortcutsState {
  scopes: KeybindingScope[];
  sections: KeybindingSection[];
  actions: KeybindingActionItem[];
}

function loadInitialShortcuts(): ShowcaseShortcutsState {
  const defaults: ShowcaseShortcutsState = {
    scopes: defaultShortcutsData.scopes as KeybindingScope[],
    sections: defaultShortcutsData.sections as KeybindingSection[],
    actions: defaultShortcutsData.actions as KeybindingActionItem[],
  };

  if (typeof window === 'undefined') return defaults;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Record<string, string[]>;

    // Merge saved custom chords into actions
    const mergedActions = defaults.actions.map((act) => {
      if (parsed[act.id]) {
        const customChords = parsed[act.id].map((keyStr) => ({
          keyString: keyStr,
          isUserModified: true,
          isMasked: false,
        }));
        return {
          ...act,
          chords: customChords,
        };
      }
      return act;
    });

    return {
      ...defaults,
      actions: mergedActions,
    };
  } catch (err) {
    console.warn('Failed to load showcase shortcuts from localStorage:', err);
    return defaults;
  }
}

class ShowcaseShortcutsManager {
  private state: ShowcaseShortcutsState = loadInitialShortcuts();
  private listeners: Set<() => void> = new Set();

  getState(): ShowcaseShortcutsState {
    return this.state;
  }

  getShortcutFor(actionId: string): string[] {
    const act = this.state.actions.find((a) => a.id === actionId);
    if (!act || !act.chords) return [];
    return act.chords.filter((c) => !c.isMasked && c.keyString).map((c) => c.keyString);
  }

  setBinding(actionId: string, chordIndex: number, newKey: string): void {
    const newActions = this.state.actions.map((act) => {
      if (act.id !== actionId) return act;

      const chords = [...act.chords];
      if (chordIndex >= chords.length) {
        chords.push({ keyString: newKey || '', isUserModified: true, isMasked: false });
      } else if (!newKey && chordIndex > 0) {
        chords.splice(chordIndex, 1);
      } else if (!newKey && chordIndex === 0) {
        chords[0] = { keyString: '', isUserModified: true, isMasked: false };
      } else {
        chords[chordIndex] = { keyString: newKey, isUserModified: true, isMasked: false };
      }

      return {
        ...act,
        chords,
      };
    });

    this.state = { ...this.state, actions: newActions };
    this.persist();
    this.notify();
  }

  resetAction(actionId: string): void {
    const newActions = this.state.actions.map((act) => {
      if (act.id !== actionId) return act;
      const defaultChords = (act.defaultChords || []).map((k) => ({
        keyString: k,
        isUserModified: false,
        isMasked: false,
      }));
      return {
        ...act,
        chords: defaultChords,
      };
    });

    this.state = { ...this.state, actions: newActions };
    this.persist();
    this.notify();
  }

  resetAll(): void {
    const newActions = this.state.actions.map((act) => ({
      ...act,
      chords: (act.defaultChords || []).map((k) => ({
        keyString: k,
        isUserModified: false,
        isMasked: false,
      })),
    }));

    this.state = { ...this.state, actions: newActions };
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (err) {
        console.warn('Failed to clear storage:', err);
      }
    }
    this.notify();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private persist(): void {
    if (typeof window === 'undefined') return;
    try {
      const overrides: Record<string, string[]> = {};
      for (const act of this.state.actions) {
        const keys = act.chords.filter((c) => !c.isMasked).map((c) => c.keyString);
        const defKeys = (act.defaultChords || []).slice();
        if (keys.sort().join('|') !== defKeys.sort().join('|')) {
          overrides[act.id] = keys;
        }
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    } catch (err) {
      console.warn('Failed to persist showcase shortcuts:', err);
    }
  }

  private notify(): void {
    for (const fn of this.listeners) {
      fn();
    }
  }
}

export const showcaseShortcuts = new ShowcaseShortcutsManager();
