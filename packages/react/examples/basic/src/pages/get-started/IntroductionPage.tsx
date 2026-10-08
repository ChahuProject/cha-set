import React from 'react';
import { Card, CardTitle, CardDescription, CodeBlock, Table, type TableColumn, ScrollArea, CheckIcon, ZapIcon, LockIcon, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';

export function IntroductionPage() {
  const { t } = useChaSetI18n();

  const packageColumns: TableColumn[] = [
    { key: 'pkg', title: t('getStarted.intro.packages.colPackage', 'Package'), width: 180, code: true },
    { key: 'target', title: t('getStarted.intro.packages.colTarget', 'Target'), width: 140 },
    { key: 'desc', title: t('getStarted.intro.packages.colDesc', 'Description') },
  ];

  const packageRows = [
    { pkg: '@chahu/cha-set', target: 'React / Web', desc: t('getStarted.intro.packages.pkgReactDesc', 'React component library published to npm.') },
    { pkg: 'QtChaSetDemo', target: 'Qt 6 / C++ / QML', desc: t('getStarted.intro.packages.pkgQtDesc', 'Qt reference implementation with native QML components.') },
    { pkg: '@chahu/spec', target: 'Internal Spec', desc: t('getStarted.intro.packages.pkgSpecDesc', 'Neutral token generator and contract schemas.') },
  ];

  return (
    <DocLayout
      category="Get Started"
      title="Introduction"
      description={t('components.introduction.description', 'ChaSet (Tea Set) is a cross-stack UI component library where a single source of truth powers both React (Web) and Qt/QML (Desktop) implementations.')}
      tocItems={[
        { id: 'philosophy', title: t('showcase.toc.philosophy', 'Design Philosophy') },
        { id: 'architecture', title: t('showcase.toc.architecture', 'How It Works') },
        { id: 'quickstart', title: t('showcase.toc.quickstart', 'Quick Start') },
        { id: 'packages', title: t('showcase.toc.packages', 'Packages & Structure') },
      ]}
    >
      <section id="philosophy" className="my-6">
        <h2 className="text-xl font-bold tracking-tight mb-3">
          {t('getStarted.intro.philosophy.title', 'Design Philosophy')}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {t('getStarted.intro.philosophy.desc', 'ChaSet is part of the ChahuProject ecosystem. In traditional multi-platform apps, Web and Desktop design systems drift apart quickly. ChaSet solves this by establishing a neutral, machine-readable specification and token shard layer that drives both React and Qt simultaneously with pixel-perfect and behavioral parity.')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
          <Card className="p-4 flex flex-col items-start gap-2">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/20">
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="m4.93 4.93 4.24 4.24" />
                <path d="m14.83 9.17 4.24-4.24" />
                <path d="m14.83 14.83 4.24 4.24" />
                <path d="m9.17 14.83-4.24 4.24" />
                <circle cx="12" cy="12" r="4" />
              </svg>
            </div>
            <CardTitle className="font-semibold text-sm">
              {t('getStarted.intro.philosophy.oneSourceTitle', 'One Source of Truth')}
            </CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              {t('getStarted.intro.philosophy.oneSourceDesc', 'Design tokens and API contracts reside in spec/ and emit synchronized tokens for Web & Qt.')}
            </CardDescription>
          </Card>
          <Card className="p-4 flex flex-col items-start gap-2">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/20">
              <ZapIcon className="size-4" />
            </div>
            <CardTitle className="font-semibold text-sm">
              {t('getStarted.intro.philosophy.nativeErgonomicsTitle', 'Native Ergonomics')}
            </CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              {t('getStarted.intro.philosophy.nativeErgonomicsDesc', 'Tailwind CSS v4 & Base UI on React; pure QML Quick Controls on Qt — no electron bloat or foreign wrappers.')}
            </CardDescription>
          </Card>
          <Card className="p-4 flex flex-col items-start gap-2">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/20">
              <LockIcon className="size-4" />
            </div>
            <CardTitle className="font-semibold text-sm">
              {t('getStarted.intro.philosophy.parityGateTitle', 'Automated Parity Gate')}
            </CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              {t('getStarted.intro.philosophy.parityGateDesc', 'CI enforces that all required capabilities and visual rendering match 100% across stacks.')}
            </CardDescription>
          </Card>
        </div>
      </section>

      <section id="architecture" className="my-10">
        <h2 className="text-xl font-bold tracking-tight mb-3">
          {t('getStarted.intro.architecture.title', 'How It Works')}
        </h2>
        <ScrollArea
          showVerticalScrollBar={false}
          showHorizontalScrollBar={true}
          showButtons={false}
          className="rounded-xl border border-border bg-muted/40"
          viewportClassName="p-4 font-mono text-xs leading-relaxed text-foreground/90 whitespace-pre"
        >
{`spec/                     single source of truth
  tokens/**               shards: colors, space, motion, typography
  tokens.json             committed token snapshot
  components/*.ts         component API contracts (zod schemas)
  capabilities.json       capability manifest (must / should)
packages/react/           React implementation (@chahu/cha-set)
qt/                       Qt 6 / QML implementation (QtChaSetDemo)`}
        </ScrollArea>
      </section>

      <section id="quickstart" className="my-10">
        <h2 className="text-xl font-bold tracking-tight mb-3">
          {t('getStarted.intro.quickstart.titleReact', 'Quick Start (React)')}
        </h2>
        <p className="text-xs text-muted-foreground mb-3">
          {t('getStarted.intro.quickstart.installDesc', 'Install the package and peer dependencies:')}
        </p>
        <CodeBlock code="pnpm add @chahu/cha-set" language="bash" />
        <p className="text-xs text-muted-foreground mt-4 mb-2">
          {t('getStarted.intro.quickstart.useReactDesc', 'Use in your React project:')}
        </p>
        <CodeBlock
          code={`import { Button, ScrollArea } from '@chahu/cha-set';
import '@chahu/cha-set/styles.css';

export function MyView() {
  return (
    <ScrollArea className="h-80 w-full border rounded-md">
      <div className="p-4 space-y-3">
        <Button variant="default">${t('getStarted.intro.quickstart.buttonText', 'Launch Workspace')}</Button>
      </div>
    </ScrollArea>
  );
}`}
          language="tsx"
        />
      </section>

      <section id="packages" className="my-10">
        <h2 className="text-xl font-bold tracking-tight mb-3">
          {t('getStarted.intro.packages.title', 'Packages')}
        </h2>
        <Table columns={packageColumns} data={packageRows} bordered containerClassName="w-full max-w-full overflow-x-auto" />
      </section>
    </DocLayout>
  );
}
