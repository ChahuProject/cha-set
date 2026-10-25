/**
 * GENERATED FILE - DO NOT EDIT.
 * Source: spec/doc-roles.json + spec/tokens/primitives.json (schemaVersion 1)
 *         via spec/generators/generate-doc-roles.mjs
 * Refresh: `pnpm gen:roles` regenerates this file in place.
 *
 * Doc roles are DATA, not components. A role names a slot in the typography
 * scale plus the semantic tag and default tone; `<DocText role="h2">` is the
 * only primitive that consumes it. The Qt counterpart
 * (qt/src/DocRoles.generated.qml) is emitted from the SAME table, so both
 * stacks resolve identical sizes, weights, leading, tracking and tones.
 *
 * Sizes/leading/tracking are emitted as CSS-variable references, never as
 * literals: the variables are the token layer (packages/react/src/styles/
 * tokens.css) which is itself generated from primitives.json.
 */

export type DocRole =
  | 'base'
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'p'
  | 'lead'
  | 'overline'
  | 'caption'
  | 'micro'
  | 'code'
  | 'quote';

export type DocTone =
  | 'default'
  | 'muted'
  | 'danger';

export type DocRoleTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'code' | 'blockquote' | 'div';

export interface DocRoleStyle {
  /** Semantic element a role renders as when `as` is not overridden. */
  readonly tag: DocRoleTag;
  readonly sizeVar: string;
  readonly leadingVar: string;
  readonly trackingVar: string;
  readonly weightVar: string;
  readonly familyVar: string;
  /** Tone applied when the caller does not pass one. */
  readonly tone: DocTone;
  /** True when the role is a text block that should wrap. */
  readonly wrap: boolean;
  readonly uppercase: boolean;
  /** Resolved px at the 16px root — for docs/tables, not for styling. */
  readonly sizePx: number;
  readonly weight: number;
}

export const docRoles: Record<DocRole, DocRoleStyle> = {
  base: {
    tag: 'span',
    sizeVar: 'var(--cs-text-small)',
    leadingVar: 'var(--cs-leading-small)',
    trackingVar: 'var(--cs-tracking-normal)',
    weightVar: 'var(--cs-font-weight-regular)',
    familyVar: 'var(--cs-font-sans)',
    tone: 'default',
    wrap: false,
    uppercase: false,
    sizePx: 12,
    weight: 400,
  },
  display: {
    tag: 'h1',
    sizeVar: 'var(--cs-text-display)',
    leadingVar: 'var(--cs-leading-display)',
    trackingVar: 'var(--cs-tracking-tighter)',
    weightVar: 'var(--cs-font-weight-bold)',
    familyVar: 'var(--cs-font-sans)',
    tone: 'default',
    wrap: true,
    uppercase: false,
    sizePx: 36,
    weight: 700,
  },
  h1: {
    tag: 'h1',
    sizeVar: 'var(--cs-text-title)',
    leadingVar: 'var(--cs-leading-title)',
    trackingVar: 'var(--cs-tracking-tight)',
    weightVar: 'var(--cs-font-weight-bold)',
    familyVar: 'var(--cs-font-sans)',
    tone: 'default',
    wrap: true,
    uppercase: false,
    sizePx: 28,
    weight: 700,
  },
  h2: {
    tag: 'h2',
    sizeVar: 'var(--cs-text-title-sm)',
    leadingVar: 'var(--cs-leading-title-sm)',
    trackingVar: 'var(--cs-tracking-tight)',
    weightVar: 'var(--cs-font-weight-semibold)',
    familyVar: 'var(--cs-font-sans)',
    tone: 'default',
    wrap: true,
    uppercase: false,
    sizePx: 20,
    weight: 600,
  },
  h3: {
    tag: 'h3',
    sizeVar: 'var(--cs-text-heading)',
    leadingVar: 'var(--cs-leading-heading)',
    trackingVar: 'var(--cs-tracking-tight)',
    weightVar: 'var(--cs-font-weight-semibold)',
    familyVar: 'var(--cs-font-sans)',
    tone: 'default',
    wrap: true,
    uppercase: false,
    sizePx: 16,
    weight: 600,
  },
  h4: {
    tag: 'h4',
    sizeVar: 'var(--cs-text-body)',
    leadingVar: 'var(--cs-leading-body)',
    trackingVar: 'var(--cs-tracking-normal)',
    weightVar: 'var(--cs-font-weight-semibold)',
    familyVar: 'var(--cs-font-sans)',
    tone: 'default',
    wrap: true,
    uppercase: false,
    sizePx: 14,
    weight: 600,
  },
  p: {
    tag: 'p',
    sizeVar: 'var(--cs-text-body)',
    leadingVar: 'var(--cs-leading-body)',
    trackingVar: 'var(--cs-tracking-normal)',
    weightVar: 'var(--cs-font-weight-regular)',
    familyVar: 'var(--cs-font-sans)',
    tone: 'muted',
    wrap: true,
    uppercase: false,
    sizePx: 14,
    weight: 400,
  },
  lead: {
    tag: 'p',
    sizeVar: 'var(--cs-text-subheading)',
    leadingVar: 'var(--cs-leading-subheading)',
    trackingVar: 'var(--cs-tracking-normal)',
    weightVar: 'var(--cs-font-weight-regular)',
    familyVar: 'var(--cs-font-sans)',
    tone: 'muted',
    wrap: true,
    uppercase: false,
    sizePx: 18,
    weight: 400,
  },
  overline: {
    tag: 'span',
    sizeVar: 'var(--cs-text-small)',
    leadingVar: 'var(--cs-leading-small)',
    trackingVar: 'var(--cs-tracking-wider)',
    weightVar: 'var(--cs-font-weight-semibold)',
    familyVar: 'var(--cs-font-sans)',
    tone: 'muted',
    wrap: false,
    uppercase: true,
    sizePx: 12,
    weight: 600,
  },
  caption: {
    tag: 'span',
    sizeVar: 'var(--cs-text-caption)',
    leadingVar: 'var(--cs-leading-caption)',
    trackingVar: 'var(--cs-tracking-normal)',
    weightVar: 'var(--cs-font-weight-regular)',
    familyVar: 'var(--cs-font-sans)',
    tone: 'muted',
    wrap: true,
    uppercase: false,
    sizePx: 11,
    weight: 400,
  },
  micro: {
    tag: 'span',
    sizeVar: 'var(--cs-text-micro)',
    leadingVar: 'var(--cs-leading-micro)',
    trackingVar: 'var(--cs-tracking-normal)',
    weightVar: 'var(--cs-font-weight-medium)',
    familyVar: 'var(--cs-font-sans)',
    tone: 'muted',
    wrap: false,
    uppercase: false,
    sizePx: 10,
    weight: 500,
  },
  code: {
    tag: 'code',
    sizeVar: 'var(--cs-text-small)',
    leadingVar: 'var(--cs-leading-code)',
    trackingVar: 'var(--cs-tracking-normal)',
    weightVar: 'var(--cs-font-weight-medium)',
    familyVar: 'var(--cs-font-mono)',
    tone: 'default',
    wrap: false,
    uppercase: false,
    sizePx: 12,
    weight: 500,
  },
  quote: {
    tag: 'blockquote',
    sizeVar: 'var(--cs-text-body)',
    leadingVar: 'var(--cs-leading-relaxed)',
    trackingVar: 'var(--cs-tracking-normal)',
    weightVar: 'var(--cs-font-weight-regular)',
    familyVar: 'var(--cs-font-sans)',
    tone: 'muted',
    wrap: true,
    uppercase: false,
    sizePx: 14,
    weight: 400,
  },
};

/** Default tone → CSS variable. */
export const docToneColor: Record<DocTone, string> = {
  default: 'var(--color-foreground)',
  muted: 'var(--color-muted-foreground)',
  danger: 'var(--color-destructive)',
};

/** Every role name, in table order (docs, playgrounds, tests). */
export const docRoleNames: DocRole[] = ['base', 'display', 'h1', 'h2', 'h3', 'h4', 'p', 'lead', 'overline', 'caption', 'micro', 'code', 'quote'];

/** Role used when `role` is omitted or unknown. */
export const defaultDocRole: DocRole = 'p';

/** Resolve a role, falling back to the declared default instead of throwing. */
export function resolveDocRole(role?: string | null): DocRoleStyle {
  const key = (role ?? '') as DocRole;
  return docRoles[key] ?? docRoles[defaultDocRole];
}
