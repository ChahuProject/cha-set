import * as React from 'react';
import { cn } from './utils';
// GENERATED FILE - DO NOT EDIT.
// Source: spec/icons/registry.json -> active specification "stroke-monoline"
// Resolved through: chaset.config.json (icons.spec)
// Regenerate with: pnpm gen:icons

export type IconGridId = 'default' | 'chrome';

export interface IconGrid {
  size: number;
  strokeWidth: number;
  linecap: 'round' | 'butt' | 'square';
  linejoin: 'round' | 'miter' | 'bevel';
  safeMargin: number;
  note: string;
}

/**
 * Registry element vocabulary, carried verbatim as data in `ICON_ELEMENTS` and rendered by
 * `renderElement`. Keeping it as data (instead of pre-baked JSX) means the artifact can be
 * diffed, audited and serialized exactly like the compiled path data on the Qt side.
 */
export type IconElement =
  | { t: 'path'; fill?: boolean; [key: string]: unknown }
  | { t: 'circle'; fill?: boolean; [key: string]: unknown }
  | { t: 'ellipse'; fill?: boolean; [key: string]: unknown }
  | { t: 'rect'; fill?: boolean; [key: string]: unknown }
  | { t: 'line'; fill?: boolean; [key: string]: unknown }
  | { t: 'polyline'; fill?: boolean; [key: string]: unknown }
  | { t: 'polygon'; fill?: boolean; [key: string]: unknown };

export interface IconDefinition {
  grid: IconGridId;
  elements: readonly IconElement[];
}

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'name'> {
  className?: string;
  /** Rendered edge length in logical units. Omit it to size the icon with CSS utilities. */
  size?: number;
}

export interface NamedIconProps extends IconProps {
  name: IconName;
}

export interface IconSpecSummary {
  id: string;
  title: string;
  status: 'implemented' | 'planned' | 'deprecated';
  summary: string;
}

export interface IconRule {
  id: string;
  title: string;
  statement: string;
  enforcement: string;
}

export interface IconCategory {
  id: string;
  title: string;
  icons: string[];
}

export interface IconAudit {
  grid: string;
  gridSize: number;
  strokeWidth: number;
  centerX: number;
  centerY: number;
  offsetX: number;
  offsetY: number;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  withinTolerance: boolean;
}

/** Identifier of the specification that produced this file (see spec/icons/registry.json). */
export const ICON_SPEC_ID = 'stroke-monoline';
export const ICON_SPEC_TITLE = "Stroke Monoline";
export const ICON_SPEC_SOURCE = "chaset.config.json (icons.spec)";
export const ICON_METRICS = {
  "grid": 24,
  "liveArea": 20,
  "strokeWidth": 2,
  "linecap": "round",
  "linejoin": "round",
  "fillPolicy": "none-unless-declared",
  "opticalCenterTolerance": 0.75
} as const;
export const ICON_GRIDS: Record<IconGridId, IconGrid> = {
  "default": {
    "size": 24,
    "strokeWidth": 2,
    "linecap": "round",
    "linejoin": "round",
    "safeMargin": 1,
    "note": "Every UI icon. Renders 2 units of stroke at 24 units, 1.33 at 16 units."
  },
  "chrome": {
    "size": 10,
    "strokeWidth": 1,
    "linecap": "round",
    "linejoin": "round",
    "safeMargin": 0.5,
    "note": "Window-caption glyphs. A denser grid keeps the stroke hairline at 10 units instead of 0.8."
  }
};
export const ICON_SIZES = {
  "default": 16,
  "ramp": [
    10,
    12,
    14,
    16,
    18,
    20,
    24
  ],
  "react": "size utilities (size-3.5 / size-4) or the size prop for chrome glyphs",
  "qt": "ThemeTokens.dp(size)"
} as const;
export const ICON_WEIGHTS = [
  {
    "id": "regular",
    "label": "Regular",
    "strokeWidth": 2,
    "usage": "The only weight the specification permits. Emphasis is expressed with colour or size, never with a heavier glyph."
  }
] as const;
export const ICON_COLOR = {
  "policy": "currentColor",
  "note": "Web icons inherit currentColor; Qt icons default to ThemeTokens.text. Never hard-code a colour inside the artwork."
} as const;
export const ICON_RULES: IconRule[] = [
  {
    "id": "geometry-ssot",
    "title": "One geometry source",
    "statement": "Every icon ships from spec/icons/registry.json. React and Qt rasterize the same numbers, so a shape can no longer exist on one stack only.",
    "enforcement": "check-icon-spec: registry & generated sync"
  },
  {
    "id": "monoline-stroke",
    "title": "One weight per control",
    "statement": "All icons in a control draw at the grid stroke width. Mixing a bold glyph with a regular one inside the same control is the defect this specification exists to prevent.",
    "enforcement": "check-icon-spec: stroke uniformity"
  },
  {
    "id": "optical-center",
    "title": "Optical centering is geometry, not margin",
    "statement": "The painted bounding box (artwork plus half the stroke) must be symmetric about the grid centre within 0.75 units. Alignment is never faked with anchors offsets or padding.",
    "enforcement": "check-icon-spec: optical center"
  },
  {
    "id": "live-area",
    "title": "Live area and safe margin",
    "statement": "Artwork stays inside the grid minus its safe margin so strokes never clip at the smallest rendered size.",
    "enforcement": "check-icon-spec: grid conformance"
  },
  {
    "id": "no-text-glyphs",
    "title": "No text glyphs as icons",
    "statement": "Characters such as + (U+002B), U+2212 MINUS SIGN or U+27F3 CLOCKWISE GAPPED CIRCLE ARROW inherit font metrics, weight and baseline from surrounding copy: they are typography, not iconography. Use a registry icon.",
    "enforcement": "check-icon-spec: text glyph ledger"
  },
  {
    "id": "grid-declared",
    "title": "Denser grids are declared, never improvised",
    "statement": "Artwork designed for a tiny physical size declares its own grid in the registry (for example the 10 unit chrome grid) so the rendered stroke stays hairline. Grids are a specification decision, not a per-component hack.",
    "enforcement": "check-icon-spec: grid conformance"
  },
  {
    "id": "color-inherit",
    "title": "Colour inherits from context",
    "statement": "Icons paint with currentColor (web) or ThemeTokens.text (desktop). Colour is always passed in by the consumer.",
    "enforcement": "review"
  },
  {
    "id": "size-scales",
    "title": "Size follows the interface scale",
    "statement": "Web sizes with utilities or the size prop; desktop multiplies by ThemeTokens.dp. Artwork is never scaled by hand.",
    "enforcement": "pnpm check:scaling"
  },
  {
    "id": "no-motion",
    "title": "Icons do not animate",
    "statement": "The only moving icon is the status spinner, and it is gated on the motion tokens. Static icons never animate.",
    "enforcement": "review"
  },
  {
    "id": "no-emoji",
    "title": "Vector only",
    "statement": "Emoji are banned repo-wide; an icon is always vector artwork.",
    "enforcement": "pnpm check:no-emoji"
  }
];
export const ICON_CATEGORIES: IconCategory[] = [
  {
    "id": "navigation",
    "title": "Navigation & Wayfinding",
    "icons": [
      "search",
      "chevron-right",
      "chevron-down",
      "chevron-up",
      "arrow-left",
      "arrow-right",
      "arrow-up",
      "arrow-up-down",
      "home",
      "globe",
      "target"
    ]
  },
  {
    "id": "actions",
    "title": "Actions",
    "icons": [
      "plus",
      "minus",
      "x",
      "copy",
      "pencil",
      "trash",
      "settings",
      "rotate-ccw",
      "download",
      "upload",
      "eye",
      "eye-off",
      "mail",
      "log-out",
      "grip-horizontal",
      "maximize-2"
    ]
  },
  {
    "id": "status",
    "title": "Status & Signals",
    "icons": [
      "check",
      "stop",
      "star",
      "clock",
      "lock",
      "info",
      "zap",
      "rocket"
    ]
  },
  {
    "id": "layout",
    "title": "Layout & Structure",
    "icons": [
      "panel-left",
      "layers",
      "grid",
      "list"
    ]
  },
  {
    "id": "data",
    "title": "Data & Metrics",
    "icons": [
      "table",
      "chart",
      "sliders",
      "tag",
      "credit-card"
    ]
  },
  {
    "id": "files",
    "title": "Files & Containers",
    "icons": [
      "folder",
      "file-text",
      "package"
    ]
  },
  {
    "id": "appearance",
    "title": "Appearance",
    "icons": [
      "sun",
      "moon",
      "monitor",
      "palette"
    ]
  },
  {
    "id": "people",
    "title": "People",
    "icons": [
      "user"
    ]
  },
  {
    "id": "brand",
    "title": "Brand",
    "icons": [
      "chaset"
    ]
  },
  {
    "id": "chrome",
    "title": "Window Chrome",
    "icons": [
      "window-minimize",
      "window-maximize",
      "window-restore",
      "window-close"
    ]
  }
];
export const ICON_SPECS: IconSpecSummary[] = [
  {
    "id": "stroke-monoline",
    "title": "Stroke Monoline",
    "status": "implemented",
    "summary": "One uninterrupted stroke, one weight, round caps and joins, drawn on a 24 unit grid. The default and only implemented ChaSet icon specification."
  },
  {
    "id": "duotone-fill",
    "title": "Duotone Fill",
    "status": "planned",
    "summary": "A two-layer specification (filled silhouette plus a single stroke accent) for dense toolbars where monoline strokes disappear. Registered but deliberately not implemented: activate it by pointing the external configuration at this id once its geometry exists."
  }
];
export const ICON_ADOPTION = {
  "maxInlineSvgSites": 47,
  "inlineSvgSites": [
    {
      "file": "packages/react/examples/basic/src/layout/Header.tsx",
      "count": 0,
      "exempted": 1,
      "reasons": [
        "GitHub brand mark — a filled 24-unit logotype with its own proportions, not a stroke glyph"
      ]
    },
    {
      "file": "packages/react/examples/basic/src/pages/get-started/IntroductionPage.tsx",
      "count": 1,
      "exempted": 0,
      "reasons": []
    },
    {
      "file": "packages/react/src/address-bar/AddressBar.tsx",
      "count": 5,
      "exempted": 0,
      "reasons": []
    },
    {
      "file": "packages/react/src/badge/Badge.tsx",
      "count": 1,
      "exempted": 0,
      "reasons": []
    },
    {
      "file": "packages/react/src/checkbox/Checkbox.tsx",
      "count": 1,
      "exempted": 0,
      "reasons": []
    },
    {
      "file": "packages/react/src/color-picker/ColorPicker.tsx",
      "count": 1,
      "exempted": 1,
      "reasons": [
        "interactive HSV colour field, sized from computed geometry and painted with two generated gradients"
      ]
    },
    {
      "file": "packages/react/src/input/Input.tsx",
      "count": 3,
      "exempted": 0,
      "reasons": []
    },
    {
      "file": "packages/react/src/language-settings/LanguageSettings.tsx",
      "count": 3,
      "exempted": 0,
      "reasons": []
    },
    {
      "file": "packages/react/src/pipeline-view/icons.tsx",
      "count": 10,
      "exempted": 0,
      "reasons": []
    },
    {
      "file": "packages/react/src/read-only-input/ReadOnlyInput.tsx",
      "count": 2,
      "exempted": 0,
      "reasons": []
    },
    {
      "file": "packages/react/src/resizable/Resizable.tsx",
      "count": 1,
      "exempted": 0,
      "reasons": []
    },
    {
      "file": "packages/react/src/scroll-area/ScrollBarButtons.tsx",
      "count": 8,
      "exempted": 0,
      "reasons": []
    },
    {
      "file": "packages/react/src/switch/Switch.tsx",
      "count": 1,
      "exempted": 0,
      "reasons": []
    },
    {
      "file": "packages/react/src/task-hud/TaskHud.tsx",
      "count": 6,
      "exempted": 0,
      "reasons": []
    },
    {
      "file": "packages/react/src/window-title-bar/WindowTitleBar.tsx",
      "count": 4,
      "exempted": 0,
      "reasons": []
    }
  ],
  "exemptionProblemCount": 0,
  "textGlyphSites": []
};
export const ICON_AUDIT: Record<string, IconAudit> = {
  "check": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 11.5,
    "offsetX": 0,
    "offsetY": -0.5,
    "minX": 3,
    "minY": 5,
    "maxX": 21,
    "maxY": 18,
    "withinTolerance": true
  },
  "chevron-right": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 8,
    "minY": 5,
    "maxX": 16,
    "maxY": 19,
    "withinTolerance": true
  },
  "chevron-down": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 5,
    "minY": 8,
    "maxX": 19,
    "maxY": 16,
    "withinTolerance": true
  },
  "chevron-up": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 5,
    "minY": 8,
    "maxX": 19,
    "maxY": 16,
    "withinTolerance": true
  },
  "x": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 5,
    "minY": 5,
    "maxX": 19,
    "maxY": 19,
    "withinTolerance": true
  },
  "grip-horizontal": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 3,
    "minY": 7,
    "maxX": 21,
    "maxY": 17,
    "withinTolerance": true
  },
  "copy": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 1,
    "minY": 1,
    "maxX": 23,
    "maxY": 23,
    "withinTolerance": true
  },
  "pencil": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 11.999,
    "offsetX": 0,
    "offsetY": -0.001,
    "minX": 1,
    "minY": 1,
    "maxX": 23,
    "maxY": 22.999,
    "withinTolerance": true
  },
  "keyboard": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 1,
    "minY": 3,
    "maxX": 23,
    "maxY": 21,
    "withinTolerance": true
  },
  "search": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 2,
    "minY": 2,
    "maxX": 22,
    "maxY": 22,
    "withinTolerance": true
  },
  "arrow-up-down": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 6,
    "minY": 3,
    "maxX": 18,
    "maxY": 21,
    "withinTolerance": true
  },
  "maximize-2": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 2,
    "minY": 2,
    "maxX": 22,
    "maxY": 22,
    "withinTolerance": true
  },
  "panel-left": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 2,
    "minY": 2,
    "maxX": 22,
    "maxY": 22,
    "withinTolerance": true
  },
  "clock": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 1,
    "minY": 1,
    "maxX": 23,
    "maxY": 23,
    "withinTolerance": true
  },
  "sun": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 1,
    "minY": 1,
    "maxX": 23,
    "maxY": 23,
    "withinTolerance": true
  },
  "moon": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 2,
    "minY": 2,
    "maxX": 22,
    "maxY": 22,
    "withinTolerance": true
  },
  "monitor": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 1,
    "minY": 2,
    "maxX": 23,
    "maxY": 22,
    "withinTolerance": true
  },
  "rotate-ccw": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 2,
    "minY": 2,
    "maxX": 22,
    "maxY": 22,
    "withinTolerance": true
  },
  "sliders": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 0,
    "minY": 2,
    "maxX": 24,
    "maxY": 22,
    "withinTolerance": true
  },
  "palette": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 11.996,
    "centerY": 12,
    "offsetX": -0.004,
    "offsetY": 0,
    "minX": 1,
    "minY": 1,
    "maxX": 22.992,
    "maxY": 23,
    "withinTolerance": true
  },
  "download": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 2,
    "minY": 2,
    "maxX": 22,
    "maxY": 22,
    "withinTolerance": true
  },
  "upload": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 2,
    "minY": 2,
    "maxX": 22,
    "maxY": 22,
    "withinTolerance": true
  },
  "settings": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 1.982,
    "minY": 1,
    "maxX": 22.018,
    "maxY": 23,
    "withinTolerance": true
  },
  "eye": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 1,
    "minY": 4,
    "maxX": 23,
    "maxY": 20,
    "withinTolerance": true
  },
  "eye-off": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 1,
    "minY": 1,
    "maxX": 23,
    "maxY": 23,
    "withinTolerance": true
  },
  "info": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 1,
    "minY": 1,
    "maxX": 23,
    "maxY": 23,
    "withinTolerance": true
  },
  "lock": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 2,
    "minY": 1,
    "maxX": 22,
    "maxY": 23,
    "withinTolerance": true
  },
  "globe": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 1,
    "minY": 1,
    "maxX": 23,
    "maxY": 23,
    "withinTolerance": true
  },
  "zap": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 2,
    "minY": 1,
    "maxX": 22,
    "maxY": 23,
    "withinTolerance": true
  },
  "target": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 1,
    "minY": 1,
    "maxX": 23,
    "maxY": 23,
    "withinTolerance": true
  },
  "rocket": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12.25,
    "centerY": 11.75,
    "offsetX": 0.25,
    "offsetY": -0.25,
    "minX": 1.5,
    "minY": 1,
    "maxX": 23,
    "maxY": 22.5,
    "withinTolerance": true
  },
  "trash": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 2,
    "minY": 1,
    "maxX": 22,
    "maxY": 23,
    "withinTolerance": true
  },
  "folder": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 11.5,
    "offsetX": 0,
    "offsetY": -0.5,
    "minX": 1,
    "minY": 2,
    "maxX": 23,
    "maxY": 21,
    "withinTolerance": true
  },
  "home": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 2,
    "minY": 1,
    "maxX": 22,
    "maxY": 23,
    "withinTolerance": true
  },
  "tag": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 11.997,
    "centerY": 11.997,
    "offsetX": -0.003,
    "offsetY": -0.003,
    "minX": 1,
    "minY": 1,
    "maxX": 22.995,
    "maxY": 22.995,
    "withinTolerance": true
  },
  "package": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12.001,
    "offsetX": 0,
    "offsetY": 0.001,
    "minX": 2,
    "minY": 1.002,
    "maxX": 22,
    "maxY": 23,
    "withinTolerance": true
  },
  "stop": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 1,
    "minY": 1,
    "maxX": 23,
    "maxY": 23,
    "withinTolerance": true
  },
  "star": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 11.51,
    "offsetX": 0,
    "offsetY": -0.49,
    "minX": 1,
    "minY": 1,
    "maxX": 23,
    "maxY": 22.02,
    "withinTolerance": true
  },
  "mail": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 1,
    "minY": 3,
    "maxX": 23,
    "maxY": 21,
    "withinTolerance": true
  },
  "table": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 2,
    "minY": 2,
    "maxX": 22,
    "maxY": 22,
    "withinTolerance": true
  },
  "file-text": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 3,
    "minY": 1,
    "maxX": 21,
    "maxY": 23,
    "withinTolerance": true
  },
  "layers": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12.008,
    "centerY": 11.995,
    "offsetX": 0.008,
    "offsetY": -0.005,
    "minX": 1,
    "minY": 1,
    "maxX": 23.017,
    "maxY": 22.99,
    "withinTolerance": true
  },
  "grid": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 2,
    "minY": 2,
    "maxX": 22,
    "maxY": 22,
    "withinTolerance": true
  },
  "list": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 2,
    "minY": 5,
    "maxX": 22,
    "maxY": 19,
    "withinTolerance": true
  },
  "user": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 4,
    "minY": 2,
    "maxX": 20,
    "maxY": 22,
    "withinTolerance": true
  },
  "credit-card": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 1,
    "minY": 4,
    "maxX": 23,
    "maxY": 20,
    "withinTolerance": true
  },
  "log-out": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 2,
    "minY": 2,
    "maxX": 22,
    "maxY": 22,
    "withinTolerance": true
  },
  "chaset": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12.5,
    "centerY": 11.5,
    "offsetX": 0.5,
    "offsetY": -0.5,
    "minX": 2,
    "minY": 1,
    "maxX": 23,
    "maxY": 22,
    "withinTolerance": true
  },
  "plus": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 4,
    "minY": 4,
    "maxX": 20,
    "maxY": 20,
    "withinTolerance": true
  },
  "minus": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 4,
    "minY": 11,
    "maxX": 20,
    "maxY": 13,
    "withinTolerance": true
  },
  "arrow-left": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 4,
    "minY": 4,
    "maxX": 20,
    "maxY": 20,
    "withinTolerance": true
  },
  "arrow-right": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 4,
    "minY": 4,
    "maxX": 20,
    "maxY": 20,
    "withinTolerance": true
  },
  "arrow-up": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 4,
    "minY": 4,
    "maxX": 20,
    "maxY": 20,
    "withinTolerance": true
  },
  "chart": {
    "grid": "default",
    "gridSize": 24,
    "strokeWidth": 2,
    "centerX": 12,
    "centerY": 12.5,
    "offsetX": 0,
    "offsetY": 0.5,
    "minX": 2,
    "minY": 3,
    "maxX": 22,
    "maxY": 22,
    "withinTolerance": true
  },
  "window-minimize": {
    "grid": "chrome",
    "gridSize": 10,
    "strokeWidth": 1,
    "centerX": 5,
    "centerY": 5,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 0,
    "minY": 4.5,
    "maxX": 10,
    "maxY": 5.5,
    "withinTolerance": true
  },
  "window-maximize": {
    "grid": "chrome",
    "gridSize": 10,
    "strokeWidth": 1,
    "centerX": 5,
    "centerY": 5,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 0.5,
    "minY": 0.5,
    "maxX": 9.5,
    "maxY": 9.5,
    "withinTolerance": true
  },
  "window-restore": {
    "grid": "chrome",
    "gridSize": 10,
    "strokeWidth": 1,
    "centerX": 5,
    "centerY": 5,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 0,
    "minY": 0,
    "maxX": 10,
    "maxY": 10,
    "withinTolerance": true
  },
  "window-close": {
    "grid": "chrome",
    "gridSize": 10,
    "strokeWidth": 1,
    "centerX": 5,
    "centerY": 5,
    "offsetX": 0,
    "offsetY": 0,
    "minX": 0,
    "minY": 0,
    "maxX": 10,
    "maxY": 10,
    "withinTolerance": true
  }
};

export type IconName = keyof typeof ICON_ELEMENTS;

export const ICON_ELEMENTS = {
  "check": {
    "grid": "default",
    "elements": [
      {
        "t": "polyline",
        "points": "20 6 9 17 4 12"
      }
    ]
  },
  "chevron-right": {
    "grid": "default",
    "elements": [
      {
        "t": "path",
        "d": "m9 18 6-6-6-6"
      }
    ]
  },
  "chevron-down": {
    "grid": "default",
    "elements": [
      {
        "t": "path",
        "d": "m6 9 6 6 6-6"
      }
    ]
  },
  "chevron-up": {
    "grid": "default",
    "elements": [
      {
        "t": "path",
        "d": "m18 15-6-6-6 6"
      }
    ]
  },
  "x": {
    "grid": "default",
    "elements": [
      {
        "t": "path",
        "d": "M18 6 6 18"
      },
      {
        "t": "path",
        "d": "m6 6 12 12"
      }
    ]
  },
  "grip-horizontal": {
    "grid": "default",
    "elements": [
      {
        "t": "circle",
        "cx": 12,
        "cy": 9,
        "r": 1
      },
      {
        "t": "circle",
        "cx": 19,
        "cy": 9,
        "r": 1
      },
      {
        "t": "circle",
        "cx": 5,
        "cy": 9,
        "r": 1
      },
      {
        "t": "circle",
        "cx": 12,
        "cy": 15,
        "r": 1
      },
      {
        "t": "circle",
        "cx": 19,
        "cy": 15,
        "r": 1
      },
      {
        "t": "circle",
        "cx": 5,
        "cy": 15,
        "r": 1
      }
    ]
  },
  "copy": {
    "grid": "default",
    "elements": [
      {
        "t": "rect",
        "x": 8,
        "y": 8,
        "width": 14,
        "height": 14,
        "rx": 2,
        "ry": 2
      },
      {
        "t": "path",
        "d": "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
      }
    ]
  },
  "pencil": {
    "grid": "default",
    "elements": [
      {
        "t": "path",
        "d": "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
      },
      {
        "t": "path",
        "d": "m15 5 4 4"
      }
    ]
  },
  "keyboard": {
    "grid": "default",
    "elements": [
      {
        "t": "rect",
        "x": 2,
        "y": 4,
        "width": 20,
        "height": 16,
        "rx": 2
      },
      {
        "t": "path",
        "d": "M6 8h.01"
      },
      {
        "t": "path",
        "d": "M10 8h.01"
      },
      {
        "t": "path",
        "d": "M14 8h.01"
      },
      {
        "t": "path",
        "d": "M18 8h.01"
      },
      {
        "t": "path",
        "d": "M6 12h.01"
      },
      {
        "t": "path",
        "d": "M18 12h.01"
      },
      {
        "t": "path",
        "d": "M10 12h4"
      }
    ]
  },
  "search": {
    "grid": "default",
    "elements": [
      {
        "t": "circle",
        "cx": 11,
        "cy": 11,
        "r": 8
      },
      {
        "t": "path",
        "d": "m21 21-4.3-4.3"
      }
    ]
  },
  "arrow-up-down": {
    "grid": "default",
    "elements": [
      {
        "t": "path",
        "d": "m7 15 5 5 5-5"
      },
      {
        "t": "path",
        "d": "m7 9 5-5 5 5"
      }
    ]
  },
  "maximize-2": {
    "grid": "default",
    "elements": [
      {
        "t": "polyline",
        "points": "15 3 21 3 21 9"
      },
      {
        "t": "polyline",
        "points": "9 21 3 21 3 15"
      },
      {
        "t": "line",
        "x1": 21,
        "y1": 3,
        "x2": 14,
        "y2": 10
      },
      {
        "t": "line",
        "x1": 3,
        "y1": 21,
        "x2": 10,
        "y2": 14
      }
    ]
  },
  "panel-left": {
    "grid": "default",
    "elements": [
      {
        "t": "rect",
        "x": 3,
        "y": 3,
        "width": 18,
        "height": 18,
        "rx": 2
      },
      {
        "t": "path",
        "d": "M9 3v18"
      }
    ]
  },
  "clock": {
    "grid": "default",
    "elements": [
      {
        "t": "circle",
        "cx": 12,
        "cy": 12,
        "r": 10
      },
      {
        "t": "polyline",
        "points": "12 6 12 12 16 14"
      }
    ]
  },
  "sun": {
    "grid": "default",
    "elements": [
      {
        "t": "circle",
        "cx": 12,
        "cy": 12,
        "r": 4
      },
      {
        "t": "path",
        "d": "M12 2v2"
      },
      {
        "t": "path",
        "d": "M12 20v2"
      },
      {
        "t": "path",
        "d": "m4.93 4.93 1.41 1.41"
      },
      {
        "t": "path",
        "d": "m17.66 17.66 1.41 1.41"
      },
      {
        "t": "path",
        "d": "M2 12h2"
      },
      {
        "t": "path",
        "d": "M20 12h2"
      },
      {
        "t": "path",
        "d": "m6.34 17.66-1.41 1.41"
      },
      {
        "t": "path",
        "d": "m19.07 4.93-1.41 1.41"
      }
    ]
  },
  "moon": {
    "grid": "default",
    "elements": [
      {
        "t": "path",
        "d": "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
      }
    ]
  },
  "monitor": {
    "grid": "default",
    "elements": [
      {
        "t": "rect",
        "x": 2,
        "y": 3,
        "width": 20,
        "height": 14,
        "rx": 2
      },
      {
        "t": "line",
        "x1": 8,
        "y1": 21,
        "x2": 16,
        "y2": 21
      },
      {
        "t": "line",
        "x1": 12,
        "y1": 17,
        "x2": 12,
        "y2": 21
      }
    ]
  },
  "rotate-ccw": {
    "grid": "default",
    "elements": [
      {
        "t": "path",
        "d": "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
      },
      {
        "t": "path",
        "d": "M3 3v5h5"
      }
    ]
  },
  "sliders": {
    "grid": "default",
    "elements": [
      {
        "t": "line",
        "x1": 4,
        "y1": 21,
        "x2": 4,
        "y2": 14
      },
      {
        "t": "line",
        "x1": 4,
        "y1": 10,
        "x2": 4,
        "y2": 3
      },
      {
        "t": "line",
        "x1": 12,
        "y1": 21,
        "x2": 12,
        "y2": 12
      },
      {
        "t": "line",
        "x1": 12,
        "y1": 8,
        "x2": 12,
        "y2": 3
      },
      {
        "t": "line",
        "x1": 20,
        "y1": 21,
        "x2": 20,
        "y2": 16
      },
      {
        "t": "line",
        "x1": 20,
        "y1": 12,
        "x2": 20,
        "y2": 3
      },
      {
        "t": "line",
        "x1": 1,
        "y1": 14,
        "x2": 7,
        "y2": 14
      },
      {
        "t": "line",
        "x1": 9,
        "y1": 8,
        "x2": 15,
        "y2": 8
      },
      {
        "t": "line",
        "x1": 17,
        "y1": 16,
        "x2": 23,
        "y2": 16
      }
    ]
  },
  "palette": {
    "grid": "default",
    "elements": [
      {
        "t": "circle",
        "cx": 13.5,
        "cy": 6.5,
        "r": 0.5,
        "fill": true
      },
      {
        "t": "circle",
        "cx": 17.5,
        "cy": 10.5,
        "r": 0.5,
        "fill": true
      },
      {
        "t": "circle",
        "cx": 8.5,
        "cy": 7.5,
        "r": 0.5,
        "fill": true
      },
      {
        "t": "circle",
        "cx": 6.5,
        "cy": 12.5,
        "r": 0.5,
        "fill": true
      },
      {
        "t": "path",
        "d": "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"
      }
    ]
  },
  "download": {
    "grid": "default",
    "elements": [
      {
        "t": "path",
        "d": "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
      },
      {
        "t": "polyline",
        "points": "7 10 12 15 17 10"
      },
      {
        "t": "line",
        "x1": 12,
        "y1": 15,
        "x2": 12,
        "y2": 3
      }
    ]
  },
  "upload": {
    "grid": "default",
    "elements": [
      {
        "t": "path",
        "d": "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
      },
      {
        "t": "polyline",
        "points": "17 8 12 3 7 8"
      },
      {
        "t": "line",
        "x1": 12,
        "y1": 3,
        "x2": 12,
        "y2": 15
      }
    ]
  },
  "settings": {
    "grid": "default",
    "elements": [
      {
        "t": "path",
        "d": "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
      },
      {
        "t": "circle",
        "cx": 12,
        "cy": 12,
        "r": 3
      }
    ]
  },
  "eye": {
    "grid": "default",
    "elements": [
      {
        "t": "path",
        "d": "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
      },
      {
        "t": "circle",
        "cx": 12,
        "cy": 12,
        "r": 3
      }
    ]
  },
  "eye-off": {
    "grid": "default",
    "elements": [
      {
        "t": "path",
        "d": "M9.88 9.88a3 3 0 1 0 4.24 4.24"
      },
      {
        "t": "path",
        "d": "M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
      },
      {
        "t": "path",
        "d": "M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
      },
      {
        "t": "line",
        "x1": 2,
        "y1": 2,
        "x2": 22,
        "y2": 22
      }
    ]
  },
  "info": {
    "grid": "default",
    "elements": [
      {
        "t": "circle",
        "cx": 12,
        "cy": 12,
        "r": 10
      },
      {
        "t": "path",
        "d": "M12 16v-4"
      },
      {
        "t": "path",
        "d": "M12 8h.01"
      }
    ]
  },
  "lock": {
    "grid": "default",
    "elements": [
      {
        "t": "rect",
        "x": 3,
        "y": 11,
        "width": 18,
        "height": 11,
        "rx": 2,
        "ry": 2
      },
      {
        "t": "path",
        "d": "M7 11V7a5 5 0 0 1 10 0v4"
      }
    ]
  },
  "globe": {
    "grid": "default",
    "elements": [
      {
        "t": "circle",
        "cx": 12,
        "cy": 12,
        "r": 10
      },
      {
        "t": "path",
        "d": "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"
      },
      {
        "t": "path",
        "d": "M2 12h20"
      }
    ]
  },
  "zap": {
    "grid": "default",
    "elements": [
      {
        "t": "polygon",
        "points": "13 2 3 14 12 14 11 22 21 10 12 10 13 2"
      }
    ]
  },
  "target": {
    "grid": "default",
    "elements": [
      {
        "t": "circle",
        "cx": 12,
        "cy": 12,
        "r": 10
      },
      {
        "t": "circle",
        "cx": 12,
        "cy": 12,
        "r": 6
      },
      {
        "t": "circle",
        "cx": 12,
        "cy": 12,
        "r": 2
      }
    ]
  },
  "rocket": {
    "grid": "default",
    "elements": [
      {
        "t": "path",
        "d": "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"
      },
      {
        "t": "path",
        "d": "m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"
      },
      {
        "t": "path",
        "d": "M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"
      },
      {
        "t": "path",
        "d": "M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"
      }
    ]
  },
  "trash": {
    "grid": "default",
    "elements": [
      {
        "t": "path",
        "d": "M3 6h18"
      },
      {
        "t": "path",
        "d": "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"
      },
      {
        "t": "path",
        "d": "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
      },
      {
        "t": "line",
        "x1": 10,
        "y1": 11,
        "x2": 10,
        "y2": 17
      },
      {
        "t": "line",
        "x1": 14,
        "y1": 11,
        "x2": 14,
        "y2": 17
      }
    ]
  },
  "folder": {
    "grid": "default",
    "elements": [
      {
        "t": "path",
        "d": "M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"
      }
    ]
  },
  "home": {
    "grid": "default",
    "elements": [
      {
        "t": "path",
        "d": "m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
      },
      {
        "t": "polyline",
        "points": "9 22 9 12 15 12 15 22"
      }
    ]
  },
  "tag": {
    "grid": "default",
    "elements": [
      {
        "t": "path",
        "d": "M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"
      },
      {
        "t": "circle",
        "cx": 7,
        "cy": 7,
        "r": 0.5,
        "fill": true
      }
    ]
  },
  "package": {
    "grid": "default",
    "elements": [
      {
        "t": "path",
        "d": "m7.5 4.27 9 5.15"
      },
      {
        "t": "path",
        "d": "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
      },
      {
        "t": "path",
        "d": "m3.3 7 8.7 5 8.7-5"
      },
      {
        "t": "path",
        "d": "M12 22V12"
      }
    ]
  },
  "stop": {
    "grid": "default",
    "elements": [
      {
        "t": "polygon",
        "points": "7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"
      },
      {
        "t": "line",
        "x1": 9,
        "y1": 9,
        "x2": 15,
        "y2": 15
      },
      {
        "t": "line",
        "x1": 15,
        "y1": 9,
        "x2": 9,
        "y2": 15
      }
    ]
  },
  "star": {
    "grid": "default",
    "elements": [
      {
        "t": "polygon",
        "points": "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      }
    ]
  },
  "mail": {
    "grid": "default",
    "elements": [
      {
        "t": "rect",
        "x": 2,
        "y": 4,
        "width": 20,
        "height": 16,
        "rx": 2
      },
      {
        "t": "path",
        "d": "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
      }
    ]
  },
  "table": {
    "grid": "default",
    "elements": [
      {
        "t": "rect",
        "x": 3,
        "y": 3,
        "width": 18,
        "height": 18,
        "rx": 2
      },
      {
        "t": "path",
        "d": "M3 9h18"
      },
      {
        "t": "path",
        "d": "M3 15h18"
      },
      {
        "t": "path",
        "d": "M9 3v18"
      },
      {
        "t": "path",
        "d": "M15 3v18"
      }
    ]
  },
  "file-text": {
    "grid": "default",
    "elements": [
      {
        "t": "path",
        "d": "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
      },
      {
        "t": "polyline",
        "points": "14 2 14 8 20 8"
      },
      {
        "t": "line",
        "x1": 16,
        "y1": 13,
        "x2": 8,
        "y2": 13
      },
      {
        "t": "line",
        "x1": 16,
        "y1": 17,
        "x2": 8,
        "y2": 17
      },
      {
        "t": "line",
        "x1": 10,
        "y1": 9,
        "x2": 8,
        "y2": 9
      }
    ]
  },
  "layers": {
    "grid": "default",
    "elements": [
      {
        "t": "path",
        "d": "m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"
      },
      {
        "t": "path",
        "d": "m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"
      },
      {
        "t": "path",
        "d": "m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"
      }
    ]
  },
  "grid": {
    "grid": "default",
    "elements": [
      {
        "t": "rect",
        "x": 3,
        "y": 3,
        "width": 7,
        "height": 7,
        "rx": 1
      },
      {
        "t": "rect",
        "x": 14,
        "y": 3,
        "width": 7,
        "height": 7,
        "rx": 1
      },
      {
        "t": "rect",
        "x": 14,
        "y": 14,
        "width": 7,
        "height": 7,
        "rx": 1
      },
      {
        "t": "rect",
        "x": 3,
        "y": 14,
        "width": 7,
        "height": 7,
        "rx": 1
      }
    ]
  },
  "list": {
    "grid": "default",
    "elements": [
      {
        "t": "line",
        "x1": 8,
        "y1": 6,
        "x2": 21,
        "y2": 6
      },
      {
        "t": "line",
        "x1": 8,
        "y1": 12,
        "x2": 21,
        "y2": 12
      },
      {
        "t": "line",
        "x1": 8,
        "y1": 18,
        "x2": 21,
        "y2": 18
      },
      {
        "t": "line",
        "x1": 3,
        "y1": 6,
        "x2": 3.01,
        "y2": 6
      },
      {
        "t": "line",
        "x1": 3,
        "y1": 12,
        "x2": 3.01,
        "y2": 12
      },
      {
        "t": "line",
        "x1": 3,
        "y1": 18,
        "x2": 3.01,
        "y2": 18
      }
    ]
  },
  "user": {
    "grid": "default",
    "elements": [
      {
        "t": "path",
        "d": "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"
      },
      {
        "t": "circle",
        "cx": 12,
        "cy": 7,
        "r": 4
      }
    ]
  },
  "credit-card": {
    "grid": "default",
    "elements": [
      {
        "t": "rect",
        "x": 2,
        "y": 5,
        "width": 20,
        "height": 14,
        "rx": 2
      },
      {
        "t": "line",
        "x1": 2,
        "y1": 10,
        "x2": 22,
        "y2": 10
      }
    ]
  },
  "log-out": {
    "grid": "default",
    "elements": [
      {
        "t": "path",
        "d": "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
      },
      {
        "t": "polyline",
        "points": "16 17 21 12 16 7"
      },
      {
        "t": "line",
        "x1": 21,
        "y1": 12,
        "x2": 9,
        "y2": 12
      }
    ]
  },
  "chaset": {
    "grid": "default",
    "elements": [
      {
        "t": "path",
        "d": "M17 8h1a4 4 0 1 1 0 8h-1"
      },
      {
        "t": "path",
        "d": "M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"
      },
      {
        "t": "line",
        "x1": 6,
        "y1": 2,
        "x2": 6,
        "y2": 4
      },
      {
        "t": "line",
        "x1": 10,
        "y1": 2,
        "x2": 10,
        "y2": 4
      },
      {
        "t": "line",
        "x1": 14,
        "y1": 2,
        "x2": 14,
        "y2": 4
      }
    ]
  },
  "plus": {
    "grid": "default",
    "elements": [
      {
        "t": "path",
        "d": "M5 12h14"
      },
      {
        "t": "path",
        "d": "M12 5v14"
      }
    ]
  },
  "minus": {
    "grid": "default",
    "elements": [
      {
        "t": "path",
        "d": "M5 12h14"
      }
    ]
  },
  "arrow-left": {
    "grid": "default",
    "elements": [
      {
        "t": "path",
        "d": "m12 19-7-7 7-7"
      },
      {
        "t": "path",
        "d": "M19 12H5"
      }
    ]
  },
  "arrow-right": {
    "grid": "default",
    "elements": [
      {
        "t": "path",
        "d": "M5 12h14"
      },
      {
        "t": "path",
        "d": "m12 5 7 7-7 7"
      }
    ]
  },
  "arrow-up": {
    "grid": "default",
    "elements": [
      {
        "t": "path",
        "d": "m5 12 7-7 7 7"
      },
      {
        "t": "path",
        "d": "M12 19V5"
      }
    ]
  },
  "chart": {
    "grid": "default",
    "elements": [
      {
        "t": "path",
        "d": "M3 21h18"
      },
      {
        "t": "path",
        "d": "M7 21V8"
      },
      {
        "t": "path",
        "d": "M12 21V4"
      },
      {
        "t": "path",
        "d": "M17 21v-11"
      }
    ]
  },
  "window-minimize": {
    "grid": "chrome",
    "elements": [
      {
        "t": "path",
        "d": "M0.5 5h9"
      }
    ]
  },
  "window-maximize": {
    "grid": "chrome",
    "elements": [
      {
        "t": "rect",
        "x": 1,
        "y": 1,
        "width": 8,
        "height": 8,
        "rx": 0.5,
        "ry": 0.5
      }
    ]
  },
  "window-restore": {
    "grid": "chrome",
    "elements": [
      {
        "t": "rect",
        "x": 2.5,
        "y": 0.5,
        "width": 7,
        "height": 7,
        "rx": 0.5,
        "ry": 0.5
      },
      {
        "t": "rect",
        "x": 0.5,
        "y": 2.5,
        "width": 7,
        "height": 7,
        "rx": 0.5,
        "ry": 0.5
      }
    ]
  },
  "window-close": {
    "grid": "chrome",
    "elements": [
      {
        "t": "path",
        "d": "M0.5 0.5 9.5 9.5"
      },
      {
        "t": "path",
        "d": "M9.5 0.5 0.5 9.5"
      }
    ]
  }
} as const;

export const ICON_NAMES: IconName[] = Object.keys(ICON_ELEMENTS) as IconName[];

/** Legacy desktop names resolved onto their canonical registry icon. */
export const ICON_ALIASES: Record<string, IconName> = {
  "close": "x",
  "gear": "settings",
  "logo": "chaset",
  "language": "globe",
  "system": "monitor",
  "edit": "pencil",
  "delete": "trash",
  "archive": "package",
  "file": "file-text",
  "bar-chart": "chart",
  "lightning": "zap",
  "theme": "palette",
  "refresh": "rotate-ccw",
  "reset": "rotate-ccw",
  "undo": "rotate-ccw",
  "add": "plus",
  "remove": "minus",
  "minimize": "window-minimize",
  "maximize": "window-maximize",
  "restore": "window-restore"
};

export function resolveIconName(name: string | undefined | null): IconName | undefined {
  const key = String(name ?? '').trim().toLowerCase();
  if (key in ICON_ELEMENTS) return key as IconName;
  return ICON_ALIASES[key];
}

function renderElement(el: IconElement, index: number) {
  const key = `el-${index}`;
  const fill = el.fill ? 'currentColor' : undefined;
  switch (el.t) {
    case 'path':
      return <path key={key} d={el.d as string} fill={fill} />;
    case 'circle':
      return <circle key={key} cx={el.cx as number} cy={el.cy as number} r={el.r as number} fill={fill} />;
    case 'ellipse':
      return (
        <ellipse key={key} cx={el.cx as number} cy={el.cy as number} rx={el.rx as number} ry={el.ry as number} fill={fill} />
      );
    case 'rect':
      return (
        <rect
          key={key}
          x={el.x as number}
          y={el.y as number}
          width={el.width as number}
          height={el.height as number}
          rx={(el.rx as number) ?? undefined}
          ry={(el.ry as number) ?? undefined}
          fill={fill}
        />
      );
    case 'line':
      return <line key={key} x1={el.x1 as number} y1={el.y1 as number} x2={el.x2 as number} y2={el.y2 as number} />;
    case 'polyline':
      return <polyline key={key} points={el.points as string} fill={fill} />;
    case 'polygon':
      return <polygon key={key} points={el.points as string} fill={fill} />;
    default:
      return null;
  }
}

/**
 * Specification-driven icon primitive. Geometry, grid and stroke width all come from the
 * active specification, so consumers choose a name and a size and nothing else.
 */
export const Icon = React.forwardRef<SVGSVGElement, NamedIconProps>(function Icon(
  { name, size, className, ...props },
  ref,
) {
  const definition = ICON_ELEMENTS[name] as IconDefinition | undefined;
  if (!definition) return null;
  const grid = ICON_GRIDS[definition.grid];

  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${grid.size} ${grid.size}`}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={grid.strokeWidth}
      strokeLinecap={grid.linecap}
      strokeLinejoin={grid.linejoin}
      className={cn(!size && 'size-4', className)}
      aria-hidden="true"
      {...props}
    >
      {definition.elements.map(renderElement)}
    </svg>
  );
});

function makeIcon(name: IconName, displayName: string) {
  const Component = React.forwardRef<SVGSVGElement, IconProps>(function GeneratedIcon(props, ref) {
    return <Icon ref={ref} name={name} {...props} />;
  });
  Component.displayName = displayName;
  return Component;
}

export const CheckIcon = /*#__PURE__*/ makeIcon('check', 'CheckIcon');
export const ChevronRightIcon = /*#__PURE__*/ makeIcon('chevron-right', 'ChevronRightIcon');
export const ChevronDownIcon = /*#__PURE__*/ makeIcon('chevron-down', 'ChevronDownIcon');
export const ChevronUpIcon = /*#__PURE__*/ makeIcon('chevron-up', 'ChevronUpIcon');
export const XIcon = /*#__PURE__*/ makeIcon('x', 'XIcon');
export const GripHorizontalIcon = /*#__PURE__*/ makeIcon('grip-horizontal', 'GripHorizontalIcon');
export const CopyIcon = /*#__PURE__*/ makeIcon('copy', 'CopyIcon');
export const PencilIcon = /*#__PURE__*/ makeIcon('pencil', 'PencilIcon');
export const KeyboardIcon = /*#__PURE__*/ makeIcon('keyboard', 'KeyboardIcon');
export const SearchIcon = /*#__PURE__*/ makeIcon('search', 'SearchIcon');
export const ArrowUpDownIcon = /*#__PURE__*/ makeIcon('arrow-up-down', 'ArrowUpDownIcon');
export const Maximize2Icon = /*#__PURE__*/ makeIcon('maximize-2', 'Maximize2Icon');
export const PanelLeftIcon = /*#__PURE__*/ makeIcon('panel-left', 'PanelLeftIcon');
export const ClockIcon = /*#__PURE__*/ makeIcon('clock', 'ClockIcon');
export const SunIcon = /*#__PURE__*/ makeIcon('sun', 'SunIcon');
export const MoonIcon = /*#__PURE__*/ makeIcon('moon', 'MoonIcon');
export const MonitorIcon = /*#__PURE__*/ makeIcon('monitor', 'MonitorIcon');
export const RotateCcwIcon = /*#__PURE__*/ makeIcon('rotate-ccw', 'RotateCcwIcon');
export const SlidersIcon = /*#__PURE__*/ makeIcon('sliders', 'SlidersIcon');
export const PaletteIcon = /*#__PURE__*/ makeIcon('palette', 'PaletteIcon');
export const DownloadIcon = /*#__PURE__*/ makeIcon('download', 'DownloadIcon');
export const UploadIcon = /*#__PURE__*/ makeIcon('upload', 'UploadIcon');
export const SettingsIcon = /*#__PURE__*/ makeIcon('settings', 'SettingsIcon');
export const EyeIcon = /*#__PURE__*/ makeIcon('eye', 'EyeIcon');
export const EyeOffIcon = /*#__PURE__*/ makeIcon('eye-off', 'EyeOffIcon');
export const InfoIcon = /*#__PURE__*/ makeIcon('info', 'InfoIcon');
export const LockIcon = /*#__PURE__*/ makeIcon('lock', 'LockIcon');
export const GlobeIcon = /*#__PURE__*/ makeIcon('globe', 'GlobeIcon');
export const ZapIcon = /*#__PURE__*/ makeIcon('zap', 'ZapIcon');
export const TargetIcon = /*#__PURE__*/ makeIcon('target', 'TargetIcon');
export const RocketIcon = /*#__PURE__*/ makeIcon('rocket', 'RocketIcon');
export const TrashIcon = /*#__PURE__*/ makeIcon('trash', 'TrashIcon');
export const FolderIcon = /*#__PURE__*/ makeIcon('folder', 'FolderIcon');
export const HomeIcon = /*#__PURE__*/ makeIcon('home', 'HomeIcon');
export const TagIcon = /*#__PURE__*/ makeIcon('tag', 'TagIcon');
export const PackageIcon = /*#__PURE__*/ makeIcon('package', 'PackageIcon');
export const StopIcon = /*#__PURE__*/ makeIcon('stop', 'StopIcon');
export const StarIcon = /*#__PURE__*/ makeIcon('star', 'StarIcon');
export const MailIcon = /*#__PURE__*/ makeIcon('mail', 'MailIcon');
export const TableIcon = /*#__PURE__*/ makeIcon('table', 'TableIcon');
export const FileTextIcon = /*#__PURE__*/ makeIcon('file-text', 'FileTextIcon');
export const LayersIcon = /*#__PURE__*/ makeIcon('layers', 'LayersIcon');
export const GridIcon = /*#__PURE__*/ makeIcon('grid', 'GridIcon');
export const ListIcon = /*#__PURE__*/ makeIcon('list', 'ListIcon');
export const UserIcon = /*#__PURE__*/ makeIcon('user', 'UserIcon');
export const CreditCardIcon = /*#__PURE__*/ makeIcon('credit-card', 'CreditCardIcon');
export const LogOutIcon = /*#__PURE__*/ makeIcon('log-out', 'LogOutIcon');
export const ChaSetLogoIcon = /*#__PURE__*/ makeIcon('chaset', 'ChaSetLogoIcon');
export const PlusIcon = /*#__PURE__*/ makeIcon('plus', 'PlusIcon');
export const MinusIcon = /*#__PURE__*/ makeIcon('minus', 'MinusIcon');
export const ArrowLeftIcon = /*#__PURE__*/ makeIcon('arrow-left', 'ArrowLeftIcon');
export const ArrowRightIcon = /*#__PURE__*/ makeIcon('arrow-right', 'ArrowRightIcon');
export const ArrowUpIcon = /*#__PURE__*/ makeIcon('arrow-up', 'ArrowUpIcon');
export const ChartIcon = /*#__PURE__*/ makeIcon('chart', 'ChartIcon');
export const WindowMinimizeIcon = /*#__PURE__*/ makeIcon('window-minimize', 'WindowMinimizeIcon');
export const WindowMaximizeIcon = /*#__PURE__*/ makeIcon('window-maximize', 'WindowMaximizeIcon');
export const WindowRestoreIcon = /*#__PURE__*/ makeIcon('window-restore', 'WindowRestoreIcon');
export const WindowCloseIcon = /*#__PURE__*/ makeIcon('window-close', 'WindowCloseIcon');
