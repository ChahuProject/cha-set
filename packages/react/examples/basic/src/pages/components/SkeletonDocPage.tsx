import React, { useState } from 'react';
import { Skeleton, Card, type SkeletonAnimation, CodeBlock, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentReference } from '../../components/ComponentReference';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';

export function SkeletonDocPage() {
  const { t } = useChaSetI18n();
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
      description={t('components.skeleton.description', 'Used to show a placeholder while content is loading, with smooth CSS pulse and wave shimmer animations.')}
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('showcase.interactiveOverview', 'Interactive Overview')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('components.skeleton.overviewDesc', 'Visual placeholder skeleton cards for progressive loading states. Switch between pulse, wave shimmer, or static modes.')}
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
}`} title={t('desktopComposite.skeleton.sandboxTitle', 'Skeleton Sandbox')} reactCode={reactCode}>
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-muted-foreground">{t('common.animation', 'Animation:')}</span>
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
                  {t(`components.skeleton.${mode}`, mode)}
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
          {t('showcase.animations', 'Animations')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('desktopComposite.skeleton.animationsDesc', 'Motion behavior and timing for the placeholder loading effects.')}
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground">
          <li>
            {t('desktopComposite.skeleton.animationsBullet1', 'pulse uses the default animate-pulse keyframes for a soft opacity fade.')}
          </li>
          <li>
            {t('desktopComposite.skeleton.animationsBullet2', 'wave uses the custom cs-shimmer keyframes via the animate-shimmer utility for a sweeping highlight.')}
          </li>
          <li>
            {t('desktopComposite.skeleton.animationsBullet3', 'When prefers-reduced-motion is set, animations resolve to animation: none automatically (Qt: governed by ThemeTokens.animationsEnabled).')}
          </li>
        </ul>
      </section>

            <ComponentReference
        name="Skeleton"
        componentId="skeleton"
        props={[
            { name: 'animation', type: "'pulse' | 'wave' | 'none'", default: "'pulse'", description: t('components.skeleton.animationDesc', 'Animation style for the placeholder loading effect.') },
            { name: 'rounded', type: "'none' | 'sm' | 'md' | 'lg' | 'full'", default: "'md'", description: t('components.skeleton.roundedDesc', 'Corner radius preset for the placeholder shape.') },
            { name: 'animate', type: 'boolean', default: 'true', description: t('components.skeleton.animateDesc', 'Convenience boolean flag to toggle animation on or off.') },
            { name: 'className', type: 'string', default: "''", description: t('components.skeleton.classNameDesc', 'Custom CSS classes for height, width, and background styling.') },
          ]}
      />
    </DocLayout>
  );
}
