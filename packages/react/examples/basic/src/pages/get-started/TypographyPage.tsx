import React from 'react';
import { Badge } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { TYPOGRAPHY_RAMP_DATA } from '../../data/showcaseData.generated';

/**
 * Tailwind can only generate classes it can see literally, so the token step
 * names from spec/showcase/typography-ramp.json are mapped to their utility
 * here instead of being assembled at runtime.
 */
const STEP_UTILITY: Record<string, string> = {
  nano: 'text-nano',
  micro: 'text-micro',
  caption: 'text-caption',
  small: 'text-small',
  body: 'text-body',
  heading: 'text-heading',
  subheading: 'text-subheading',
  'title-sm': 'text-title-sm',
  'title-md': 'text-title-md',
  title: 'text-title',
  display: 'text-display',
};

const WEB_INVARIANTS = [
  { id: 'rasterizer', label: 'Rasterizer', value: 'Grayscale alpha antialiasing' },
  { id: 'smoothing', label: 'Font smoothing', value: 'antialiased · grayscale' },
  { id: 'hinting', label: 'Outline fitting', value: 'None — text shaper follows the outline' },
  { id: 'scale', label: 'Interface scale', value: 'Root font size multiplier' },
];

const QT_INVARIANTS = [
  { id: 'rasterizer', label: 'Rasterizer', value: 'Selected by CHASET_TEXT_RENDER' },
  { id: 'policies', label: 'Policies', value: 'qt (default) · native · curve' },
  { id: 'subpixel', label: 'Subpixel AA', value: 'Disabled — grayscale only' },
  { id: 'hinting', label: 'Hinting', value: 'Vertical only' },
  { id: 'scale', label: 'Interface scale', value: 'uiScale multiplier on every size token' },
];

export function TypographyPage() {
  const { scaleSteps, quotes } = TYPOGRAPHY_RAMP_DATA;

  return (
    <DocLayout
      category="Get Started"
      title="Typography Rendering"
      description="Global text rasterizer policy and a five-script size ramp previewing every type scale step."
      tocItems={[
        { id: 'rasterizer', title: 'Rasterization Path' },
        { id: 'ramp', title: 'Cross-Script Size Ramp' },
      ]}
    >
      <div className="space-y-12">
        <section className="block" id="rasterizer">
          <h2>Rasterization Path</h2>
          <p className="desc">
            The two stacks reach the same glyph outlines through different rasterizers. Web asks
            Chromium for grayscale antialiasing with no grid fitting; Desktop resolves one policy
            for the whole process before the first window exists.
          </p>

          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-4 text-card-foreground">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-body font-semibold text-foreground">Web · Chromium</span>
                <Badge variant="secondary">React</Badge>
              </div>
              <dl className="space-y-2">
                {WEB_INVARIANTS.map((row) => (
                  <div key={row.id} className="flex items-baseline gap-4">
                    <dt className="w-32 shrink-0 text-micro text-muted-foreground">{row.label}</dt>
                    <dd className="min-w-0 flex-1 text-small text-foreground">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-lg border border-border bg-card p-4 text-card-foreground">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-body font-semibold text-foreground">Desktop · Qt Quick</span>
                <Badge variant="secondary">Qt</Badge>
              </div>
              <dl className="space-y-2">
                {QT_INVARIANTS.map((row) => (
                  <div key={row.id} className="flex items-baseline gap-4">
                    <dt className="w-32 shrink-0 text-micro text-muted-foreground">{row.label}</dt>
                    <dd className="min-w-0 flex-1 text-small text-foreground">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section className="block" id="ramp">
          <h2>Cross-Script Size Ramp</h2>
          <p className="desc">
            Five script portals, each rendered once per type scale step. The passage never changes
            inside a block, so strokes can be compared across the whole ramp — including the
            rounded CJK and Hangul curves that reveal grid fitting first. Sizes follow the type
            scale and the interface scale, so they are named by token instead of by unit.
          </p>

          <div className="space-y-6">
            {quotes.map((quote) => (
              <div
                key={quote.id}
                className="rounded-lg border border-border bg-card p-4 text-card-foreground md:p-5"
              >
                <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border pb-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-body font-semibold text-foreground">{quote.label}</span>
                    <span className="text-caption text-muted-foreground">{quote.native}</span>
                  </div>
                  <span className="text-caption font-mono text-muted-foreground">
                    {quote.attribution}
                  </span>
                </div>

                <div className="space-y-3">
                  {scaleSteps.map((step) => (
                    <div key={step} className="flex items-baseline gap-4">
                      <span className="w-24 shrink-0 font-mono text-micro text-muted-foreground">
                        {step}
                      </span>
                      <p
                        className={`min-w-0 flex-1 text-foreground ${STEP_UTILITY[step] ?? 'text-body'}`}
                      >
                        {quote.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DocLayout>
  );
}