import React, { useState } from 'react';
import { Skeleton, Card, type SkeletonAnimation } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

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
      tocItems={[
        { id: 'overview', title: 'Interactive Overview' },
        { id: 'installation', title: 'Installation' },
        { id: 'keyboard', title: 'Keyboard Navigation' },
        { id: 'props', title: 'Props Reference' },
      ]}
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Interactive Overview
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Visual placeholder skeleton cards for progressive loading states. Switch between pulse, wave shimmer, or static modes.
        </p>

        <ComponentPreview title="Skeleton Sandbox" reactCode={reactCode}>
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

      <section id="installation" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Installation
        </h2>
        <CodeBlock code="pnpm add @chahu/cha-set" language="bash" />
      </section>

      <section id="keyboard" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Keyboard Navigation
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Keyboard shortcuts and interaction patterns for this component.
        </p>
        <KeyboardShortcutsTable componentId="skeleton" />
      </section>

      <section id="props" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Props Reference
        </h2>
        <PropsTable
          props={[
            { name: 'animation', type: "'pulse' | 'wave' | 'none'", default: "'pulse'", description: 'Animation style for the placeholder loading effect.' },
            { name: 'rounded', type: "'none' | 'sm' | 'md' | 'lg' | 'full'", default: "'md'", description: 'Corner radius preset for the placeholder shape.' },
            { name: 'animate', type: 'boolean', default: 'true', description: 'Convenience boolean flag to toggle animation on or off.' },
            { name: 'className', type: 'string', default: "''", description: 'Custom CSS classes for height, width, and background styling.' },
          ]}
        />
      </section>
    </DocLayout>
  );
}
