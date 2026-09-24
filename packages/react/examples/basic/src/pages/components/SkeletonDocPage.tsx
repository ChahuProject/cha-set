import React, { useState } from 'react';
import { Skeleton, Card, type SkeletonAnimation, CodeBlock } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentReference } from '../../components/ComponentReference';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';

export function SkeletonDocPage() {
  const [animation, setAnimation] = useState<SkeletonAnimation>('pulse');

  const reactCode = `<div className="flex items-center space-x-4">
  <Skeleton animation="${animation}" rounded="full" className="size-12" />
  <div className="space-y-2">
    <Skeleton animation="${animation}" className="h-4 w-64" />
    <Skeleton animation="${animation}" className="h-4 w-48" />
  </div>
</div>`;

  return (
    <DocLayout
      category="Base Primitives"
      title="Skeleton"
      description="Used to show a placeholder while content is loading, with smooth CSS pulse and wave shimmer animations."
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Interactive Overview
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Visual placeholder skeleton cards for progressive loading states. Switch between pulse, wave shimmer, or static modes.
        </p>

        <ComponentPreview
          qtCode={`Row {
    spacing: 12
    ChaSetSkeleton { width: 48; height: 48; rounded: "full"; animation: "${animation}" }
    Column {
        spacing: 8
        ChaSetSkeleton { width: 200; height: 16; rounded: "md"; animation: "${animation}" }
        ChaSetSkeleton { width: 140; height: 16; rounded: "md"; animation: "${animation}" }
    }
}`} title="Skeleton Sandbox" reactCode={reactCode}>
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-muted-foreground">Animation:</span>
              {(['pulse', 'wave', 'none'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setAnimation(mode)}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer capitalize ${
                    animation === mode
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-lg">
              <div className="flex items-center space-x-4 p-4 rounded-xl border border-border bg-card">
                <Skeleton animation={animation} rounded="full" className="size-12 shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton animation={animation} className="h-4 w-3/4" />
                  <Skeleton animation={animation} className="h-3 w-1/2" />
                </div>
              </div>

              <div className="flex flex-col space-y-3 p-4 rounded-xl border border-border bg-card">
                <Skeleton animation={animation} className="h-24 w-full rounded-lg" />
                <div className="space-y-1.5">
                  <Skeleton animation={animation} className="h-4 w-4/5" />
                  <Skeleton animation={animation} className="h-3 w-2/3" />
                </div>
              </div>
            </div>
          </div>
        </ComponentPreview>
      </section>

      {/* Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { Skeleton } from '@chahu/cha-set';

<div className="space-y-2">
  <Skeleton className="h-4 w-48" />
  <Skeleton className="h-4 w-32" />
</div>`}
        qtCode={`import ChaSet

Column {
    spacing: 8
    ChaSetSkeleton { width: 192; height: 16 }
    ChaSetSkeleton { width: 128; height: 16 }
}`}
      />



      <section id="animations" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Animations
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Motion behavior and timing for the skeletographic placeholder effects.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground">
          <li>
            <code className="text-xs bg-muted px-1 rounded">pulse</code> uses the default{' '}
            <code className="text-xs bg-muted px-1 rounded">animate-pulse</code> keyframes.
          </li>
          <li>
            <code className="text-xs bg-muted px-1 rounded">wave</code> uses the custom{' '}
            <code className="text-xs bg-muted px-1 rounded">cs-shimmer</code> keyframes via the{' '}
            <code className="text-xs bg-muted px-1 rounded">animate-shimmer</code> utility.
          </li>
          <li>
            When <code>prefers-reduced-motion</code> is set, animations resolve to{' '}
            <code>animation: none</code> automatically (Qt: governed by{' '}
            <code>ThemeTokens.animationsEnabled</code>).
          </li>
        </ul>
      </section>

            <ComponentReference
        name="Skeleton"
        componentId="skeleton"
        props={[
            { name: 'animation', type: "'pulse' | 'wave' | 'none'", default: "'pulse'", description: 'Animation style for the placeholder loading effect.' },
            { name: 'rounded', type: "'none' | 'sm' | 'md' | 'lg' | 'full'", default: "'md'", description: 'Corner radius preset for the placeholder shape.' },
            { name: 'animate', type: 'boolean', default: 'true', description: 'Convenience boolean flag to toggle animation on or off.' },
            { name: 'className', type: 'string', default: "''", description: 'Custom CSS classes for height, width, and background styling.' },
          ]}
      />
    </DocLayout>
  );
}
