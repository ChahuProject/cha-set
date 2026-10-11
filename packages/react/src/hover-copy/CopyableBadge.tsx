import * as React from 'react';
import { Badge } from '../badge/Badge';
import { HoverCopy } from './HoverCopy';

export interface CopyableBadgeProps {
  /** Payload to copy. Displayed when no children are given. */
  text: string;
  /** Displayed content; defaults to text. */
  children?: React.ReactNode;
  /** Blocks reveal + copy; forwarded to HoverCopy. @default false */
  disabled?: boolean;
  /** Fired with the payload on successful copy. */
  onCopy?: (text: string) => void;
  /** Fired when the clipboard write fails. */
  onError?: (error: unknown) => void;
  className?: string;
}

/**
 * Thin preset: Badge (secondary, default size) wrapped in HoverCopy with pill
 * radius. Forwards everything to HoverCopy — no copy logic, timing, or state
 * of its own. See docs/architecture/hover-copy.md section 7.
 */
export function CopyableBadge({
  text,
  children,
  disabled = false,
  onCopy,
  onError,
  className,
}: CopyableBadgeProps) {
  return (
    <HoverCopy
      text={text}
      radius="full"
      disabled={disabled}
      onCopy={onCopy}
      onError={onError}
      className={className}
    >
      <Badge variant="secondary" size="default">
        {children ?? text}
      </Badge>
    </HoverCopy>
  );
}
