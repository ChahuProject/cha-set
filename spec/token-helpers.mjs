// spec/token-helpers.mjs — shared pure helpers for the token aggregation layer.
import { createHash } from 'node:crypto';

// ---------------------------------------------------------------------------
// Regexes
// ---------------------------------------------------------------------------
export const HEX8 = /^#[0-9a-fA-F]{8}$/;

// oklch syntax: oklch( <lightness> <chroma> <hue> [/ <alpha>] )
// Allows "from <color>" prefix, "none" keywords, percent forms, hue units.
export const OKLCH_RE =
  /^oklch\(\s*(?:from\s+\S+\s+)?(?:none|\d*\.?\d+%?)\s+(?:none|\d*\.?\d+%?)\s+(?:none|\d*\.?\d+(?:deg|rad|grad|turn)?)\s*(?:\/\s*(?:none|\d*\.?\d+%?)\s*)?\)$/i;

export const COLOR_MIX_RE =
  /^color-mix\(\s*in\s+(?:srgb|srgb-linear|lab|oklab|lch|oklch|hsl|hwb|xyz(?:-d50|-d65)?)\s*,\s*.+\)$/i;

export const VAR_RE = /^var\(--[^)]+\)$/;

// ---------------------------------------------------------------------------
// Canonical key order — deterministic JSON.stringify via stringifySorted
// ---------------------------------------------------------------------------
export const COLOR_ORDER = [
  'chrome','background','panel','panelRaised','border','accent','nestAccent','pendingAccent',
  'blocked','text','subduedText','conflict','onAccent','selection','hover','pressed',
  'disabled','disabledText','focus','overlayScrim','danger','dangerHover','infoBar',
  'canvasMarquee','canvasMarqueeBorder','canvasLoadingBackdrop','canvasLoadingBorder',
  'canvasLoadingText','canvasGrid','canvasGridMajor','chromeIcon','chromeHover','chromeDown'
];

export const SPACE_ORDER = ['space0','space1','space2','space3','space4','space5','space6'];
export const MOTION_ORDER = ['motionQuick','motionShort','motionMedium'];
export const SIZE_ORDER = [
  'radiusSmall','controlHeight','gap','pageInset','dockInset','dividerThickness',
  'minimumPaneExtent','panelRadius','rowRadius','radiusLarge','radiusXl','separatorHeight',
  'separatorLine','checkCol','iconCol','cascadeGap','chevronW',
  'fontSizeTitle','fontSizeHeading','fontSizeBody','fontSizeSmall'
];

export const ORDER = {
  top: ['meta','primitives','semantic','composite','themes','qt'],
  meta: ['schemaVersion','description','sources','conventions'],
  primitives: ['space','motion','size','fontWeight'],
  primitives_space: [...SPACE_ORDER],
  primitives_motion: ['quick','short','medium'],
  primitives_size: [...SIZE_ORDER],
  primitives_fontWeight: ['medium','semibold'],
  // semantic alphabetical grouping (W3C DTCG inspired, deterministic)
  semantic: [
    'accent','accent-foreground','accent.blocked','accent.conflict','accent.nest','accent.pending',
    'background','border','canvas.grid','canvas.grid-major','canvas.loading-backdrop','canvas.loading-border',
    'canvas.loading-text','canvas.marquee','canvas.marquee-border','card','card-foreground',
    'chart-1','chart-2','chart-3','chart-4','chart-5','chrome.down','chrome.hover','chrome.icon','chrome.surface',
    'destructive','destructive-foreground','foreground','input','interaction.disabled','interaction.disabled-text',
    'interaction.hover','interaction.pressed','muted','muted-foreground','overlay.info-bar','overlay.scrim',
    'popover','popover-foreground','primary','primary-foreground','radius','ring','secondary','secondary-foreground',
    'sidebar','sidebar-accent','sidebar-accent-foreground','sidebar-border','sidebar-foreground','sidebar-primary',
    'sidebar-primary-foreground','sidebar-ring','sidebar-selected','sidebar-selected-foreground'
  ],
  composite: ['launcher'],
  composite_launcher: [
    'app-material-strength','app-material-card-alpha','app-material-panel-alpha','app-material-surface-alpha','app-material-menu-alpha',
    'app-material-modal-alpha','app-material-overlay-alpha','app-material-blur-radius','app-material-menu-blur-radius',
    'app-radius-card','app-radius-panel','app-radius-control','app-shadow-strength','app-motion-scale','app-motion-fast','app-motion-normal',
    'app-window-tint','app-window-tint-foreground','app-window-background','app-window-tint-overlay','app-shell-background','app-content-background',
    'app-sidebar-background','app-sidebar-backdrop-filter','app-card-background','app-card-backdrop-filter','app-panel-background','app-panel-border',
    'app-panel-backdrop-filter','app-card-shadow','app-card-shadow-hover','app-modal-overlay-background','app-modal-background','app-modal-footer-background',
    'app-modal-border','app-modal-shadow','app-modal-backdrop-filter','app-modal-overlay-backdrop-filter','app-menu-background','app-menu-texture',
    'app-menu-border','app-menu-shadow','app-menu-backdrop-filter','app-menu-item-background','app-menu-item-foreground','app-menu-item-danger-background',
    'app-hero-background','app-surface-strong','app-status-success','app-status-warning','app-status-error'
  ],
  themes: ['axes','overrides','deltas'],
  themes_axes: ['mode','accentTheme','windowTint','interfaceStyle'],
  qt: ['note','colors','space','motion','size','rgbf'],
  qt_colors: [...COLOR_ORDER],
  qt_space: [...SPACE_ORDER],
  qt_motion: [...MOTION_ORDER],
  qt_size: [...SIZE_ORDER],
};

// ---------------------------------------------------------------------------
// hex helpers
// ---------------------------------------------------------------------------
export function hexToRgbf(hex) {
  if (!HEX8.test(hex)) throw new Error(`hexToRgbf: not #RRGGBBAA "${hex}"`);
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const a = parseInt(hex.slice(7, 9), 16) / 255;
  return [r, g, b, a];
}

// integer byte form (0-255) — handy for transform checks
export function hexToRgba(hex) {
  if (!HEX8.test(hex)) throw new Error(`hexToRgba: not #RRGGBBAA "${hex}"`);
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
    parseInt(hex.slice(7, 9), 16),
  ];
}

// ---------------------------------------------------------------------------
// fmtChannel — MUST stay identical to spec/generators/generate-qt.mjs:42-45
// ---------------------------------------------------------------------------
export const fmtChannel = (v) => {
  const b = v * 255;
  return Math.abs(b - Math.round(b)) < 1e-9 ? `${Math.round(b)}.0 / 255.0` : String(v);
};

// ---------------------------------------------------------------------------
// selectorFor — exhaustive switch over axes, derived selector synthesis
// ---------------------------------------------------------------------------
export function selectorFor({ mode, accentTheme, windowTint, interfaceStyle }) {
  if (mode !== 'light' && mode !== 'dark') {
    throw new Error(`selectorFor: mode must be "light" | "dark", got "${mode}"`);
  }
  const hasAccent = accentTheme !== undefined;
  const hasTint = windowTint !== undefined;
  const hasStyle = interfaceStyle !== undefined;
  const count = Number(hasAccent) + Number(hasTint) + Number(hasStyle);
  if (count !== 1) {
    throw new Error(`selectorFor: exactly one of accentTheme|windowTint|interfaceStyle must be set (got accentTheme=${accentTheme} windowTint=${windowTint} interfaceStyle=${interfaceStyle})`);
  }
  const base = mode === 'dark' ? '.dark' : ':root';
  if (hasAccent) return `${base}[data-theme="${accentTheme}"]`;
  if (hasTint) return `${base}[data-window-tint="${windowTint}"]`;
  return `${base}[data-interface-style="${interfaceStyle}"]`;
}

// ---------------------------------------------------------------------------
// sha256 helper
// ---------------------------------------------------------------------------
export function sha256Hex(str) {
  return createHash('sha256').update(str, 'utf8').digest('hex');
}

// ---------------------------------------------------------------------------
// stringifySorted — deterministic JSON.stringify replacer using ORDER
// ---------------------------------------------------------------------------
function orderForKey(key, value) {
  if (key === '') return ORDER.top;
  if (key === 'meta') return ORDER.meta;
  if (key === 'primitives') return ORDER.primitives;
  if (key === 'semantic') return ORDER.semantic;
  if (key === 'composite') return ORDER.composite;
  if (key === 'launcher' && value && typeof value === 'object' && 'app-material-strength' in value) return ORDER.composite_launcher;
  if (key === 'themes') return ORDER.themes;
  if (key === 'axes') return ORDER.themes_axes;
  if (key === 'qt') return ORDER.qt;
  if (key === 'colors' || key === 'rgbf') return ORDER.qt_colors;
  // disambiguate space/motion/size under primitives vs qt: both share same order subsets
  if (key === 'space') {
    // both primitives.space and qt.space use space0..space6
    if (value && typeof value === 'object' && 'space0' in value) return ORDER.qt_space;
  }
  if (key === 'motion') {
    if (value && typeof value === 'object' && 'motionQuick' in value) return ORDER.qt_motion;
    if (value && typeof value === 'object' && 'quick' in value) return ORDER.primitives_motion;
  }
  if (key === 'size') {
    if (value && typeof value === 'object' && 'radiusSmall' in value) return ORDER.qt_size;
  }
  if (key === 'fontWeight') return ORDER.primitives_fontWeight;
  return null;
}

export function stringifySorted(key, value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const order = orderForKey(key, value);
    const keys = Object.keys(value);
    let sorted;
    if (order) {
      const idx = new Map(order.map((k, i) => [k, i]));
      sorted = [...keys].sort((a, b) => {
        const ia = idx.has(a) ? idx.get(a) : 1e9;
        const ib = idx.has(b) ? idx.get(b) : 1e9;
        if (ia !== ib) return ia - ib;
        return a.localeCompare(b);
      });
    } else {
      // fallback alphabetical for open-ended maps (e.g. meta.sources, semantic token keys beyond ORDER)
      // but prefer ORDER.semantic when the parent is semantic and value is a token map handled above.
      sorted = [...keys].sort((a, b) => a.localeCompare(b));
    }
    const out = {};
    for (const k of sorted) out[k] = value[k];
    return out;
  }
  return value;
}
