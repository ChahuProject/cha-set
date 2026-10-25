import React from 'react';
import {
  docToneColor,
  resolveDocRole,
  type DocRole,
  type DocRoleTag,
  type DocTone,
} from './docRoles.generated';

/**
 * DocText — the single typography primitive for ChaSet Living Documentation.
 *
 * Mirrors `qt/src/DocText.qml` 1:1. Roles are DATA (`docRoles.generated.ts`,
 * emitted from `spec/doc-roles.json`): H1…H4 / p / lead / overline / caption /
 * micro / code / quote are NOT separate components. Splitting them into one
 * component per level would multiply files, DocPages, routes and gate
 * obligations while leaving the same role→style switch somewhere else — and it
 * would freeze today's accidental 6-way divergence of `<h4>` class strings into
 * six "components".
 *
 * What a role carries: font size, weight, leading, tracking, family, the
 * semantic tag and a default tone. What it does NOT carry: margins / layout.
 * Spacing belongs to the block (or to `SectionHeader`), because Qt resolves it
 * through `Column.spacing` while the web resolves it through utilities — a role
 * with a built-in margin would drift between the stacks the moment either side
 * changes.
 *
 * Deliberately not exported from the library: this is doc scaffolding, not
 * product API. Product components keep using ThemeTokens / typography tokens.
 */
export interface DocTextProps extends Omit<React.HTMLAttributes<HTMLElement>, 'color' | 'role'> {
  /** Typography role. Unknown values fall back to `p` instead of throwing. */
  role?: DocRole;
  /** Override the semantic tag a role renders as (e.g. `as="span"` in a flex row). */
  as?: DocRoleTag;
  /** Color tone. Defaults to the role's declared tone (`p` is muted, headings are not). */
  tone?: DocTone;
  /** Force the mono family (inline tokens, identifiers, measured values). */
  mono?: boolean;
  /** Force no wrapping. Defaults to the role's `wrap` flag. */
  nowrap?: boolean;
  /** Extra utilities. Layout only — typography must come from the role. */
  className?: string;
  children?: React.ReactNode;
}

export const DocText = React.forwardRef<HTMLElement, DocTextProps>(function DocText(
  { role, as, tone, mono, nowrap, className, style, children, ...rest },
  ref,
) {
  const resolved = resolveDocRole(role);
  const Tag = (as ?? resolved.tag) as React.ElementType;
  const noWrap = nowrap ?? !resolved.wrap;

  // Every typographic property is a CSS-variable reference, never a literal:
  // the variables are the token layer, so the role table and the scale can
  // never drift. Cast is needed because React's CSSProperties types reject
  // `var(...)` for numeric properties (fontWeight).
  const roleStyle = {
    fontSize: resolved.sizeVar,
    lineHeight: resolved.leadingVar,
    letterSpacing: resolved.trackingVar,
    fontWeight: resolved.weightVar,
    fontFamily: mono ? 'var(--cs-font-mono)' : resolved.familyVar,
    color: docToneColor[tone ?? resolved.tone],
    textTransform: resolved.uppercase && !mono ? 'uppercase' : undefined,
    whiteSpace: noWrap ? 'nowrap' : undefined,
  } as unknown as React.CSSProperties;

  return (
    <Tag ref={ref} className={className} style={{ ...roleStyle, ...style }} {...rest}>
      {children}
    </Tag>
  );
});
