import React from 'react';
import { DocText } from './DocText';

/**
 * SectionHeader — the block-level composition of the doc scale.
 *
 * This is where "composition" belongs. A heading is not a component (it is a
 * role), but *title + optional description + optional actions with the right
 * vertical rhythm* repeats ~180 times across the showcase, and that pattern IS
 * worth naming. Both children route through `DocText`, so the typography still
 * comes from the role table rather than from ad-hoc class strings.
 *
 * Spacing is the only thing this component owns: `mb-3` under the block,
 * `mt-1` between title and description. Everything horizontally is left to the
 * caller's layout.
 */
export interface SectionHeaderProps {
  /** Anchor id used by the table of contents / deep links. */
  id?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Role for the title. `h2` for page sections, `h3` for nested groups. */
  role?: 'h2' | 'h3' | 'h4';
  /** Right-aligned slot: copy button, count badge, mode toggle. */
  actions?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export function SectionHeader({
  id,
  title,
  description,
  role = 'h2',
  actions,
  className = 'mb-3',
  titleClassName,
  descriptionClassName,
}: SectionHeaderProps) {
  const titleNode = (
    <DocText id={id} role={role} className={titleClassName}>
      {title}
    </DocText>
  );

  return (
    <div className={className}>
      {actions ? (
        <div className="flex items-start justify-between gap-4">
          {titleNode}
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        </div>
      ) : (
        titleNode
      )}
      {description ? (
        <DocText role="p" className={`mt-1${descriptionClassName ? ` ${descriptionClassName}` : ''}`}>
          {description}
        </DocText>
      ) : null}
    </div>
  );
}
