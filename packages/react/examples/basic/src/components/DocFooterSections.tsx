import React from 'react';
import { KeyboardShortcutsTable } from './KeyboardShortcutsTable';
import { PropsTable, type PropItem } from './PropsTable';

export interface SubComponentProps {
  title: string;
  description?: string;
  props: PropItem[];
}

export interface DocFooterSectionsProps {
  componentId: string;
  props?: PropItem[];
  subComponents?: SubComponentProps[];
  animations?: React.ReactNode;
}

export function DocFooterSections({
  componentId,
  props,
  subComponents,
  animations,
}: DocFooterSectionsProps) {
  return (
    <div className="flex flex-col gap-10 mt-12 mb-8">
      {/* 1. Animations Section */}
      <section id="animations" className="scroll-mt-20">
        <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">
          Animations
        </h2>
        {animations ? (
          animations
        ) : (
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Motion behavior and timing for interactive states aligned with ChaSet tokens.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground">
              <li>
                State changes (hover, press, focus) animate over{' '}
                <code className="text-xs bg-muted px-1 rounded">duration-quick</code> with the{' '}
                <code className="text-xs bg-muted px-1 rounded">ease-standard</code> curve.
              </li>
              <li>
                Durations and easing resolve from theme tokens, so{' '}
                <code>prefers-reduced-motion</code> zeroes them automatically (Qt: governed by{' '}
                <code>ThemeTokens.animationsEnabled</code>).
              </li>
            </ul>
          </div>
        )}
      </section>

      {/* 2. Keyboard Navigation Section */}
      <section id="keyboard" className="scroll-mt-20">
        <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">
          Keyboard Navigation
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Keyboard shortcuts and interaction patterns for this component.
        </p>
        <KeyboardShortcutsTable componentId={componentId} />
      </section>

      {/* 3. Props Reference Section */}
      <section id="props" className="scroll-mt-20">
        <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">
          Props Reference
        </h2>
        {props && props.length > 0 && (
          <PropsTable props={props} />
        )}

        {subComponents && subComponents.length > 0 && (
          <div className="space-y-6">
            {subComponents.map((sub) => (
              <div key={sub.title}>
                <h3 className="text-sm font-semibold text-foreground mb-1">{sub.title}</h3>
                {sub.description && (
                  <p className="text-xs text-muted-foreground mb-2">{sub.description}</p>
                )}
                <PropsTable props={sub.props} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
