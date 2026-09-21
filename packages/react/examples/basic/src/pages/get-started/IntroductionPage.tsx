import React from 'react';
import { Card, CardTitle, CardDescription, CodeBlock, Table, type TableColumn, ScrollArea, CheckIcon } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';

const PACKAGE_COLUMNS: TableColumn[] = [
  { key: 'pkg', title: 'Package', width: 180, code: true },
  { key: 'target', title: 'Target', width: 140 },
  { key: 'desc', title: 'Description' },
];

const PACKAGE_ROWS = [
  { pkg: '@chahu/cha-set', target: 'React / Web', desc: 'React component library published to npm.' },
  { pkg: 'QtChaSetDemo', target: 'Qt 6 / C++ / QML', desc: 'Qt reference implementation with native QML components.' },
  { pkg: '@chahu/spec', target: 'Internal Spec', desc: 'Neutral token generator and contract schemas.' },
];

export function IntroductionPage() {
  return (
    <DocLayout
      category="Get Started"
      title="Introduction"
      description="ChaSet (Tea Set) is a cross-stack UI component library where a single source of truth powers both React (Web) and Qt/QML (Desktop) implementations."
      tocItems={[
        { id: 'philosophy', title: 'Design Philosophy' },
        { id: 'architecture', title: 'How It Works' },
        { id: 'quickstart', title: 'Quick Start' },
        { id: 'packages', title: 'Packages & Structure' },
      ]}
    >
      <section id="philosophy" className="my-6">
        <h2 className="text-xl font-bold tracking-tight mb-3">Design Philosophy</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          ChaSet is part of the <strong>ChahuProject</strong> ecosystem. In traditional multi-platform apps, Web and Desktop design systems drift apart quickly. ChaSet solves this by establishing a neutral, machine-readable specification and token shard layer that drives both React and Qt simultaneously with pixel-perfect and behavioral parity.
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
            <CardTitle className="font-semibold text-sm">One Source of Truth</CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              Design tokens and API contracts reside in <code className="font-mono text-primary">spec/</code> and emit synchronized tokens for Web & Qt.
            </CardDescription>
          </Card>
          <Card className="p-4 flex flex-col items-start gap-2">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/20">
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <CardTitle className="font-semibold text-sm">Native Ergonomics</CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              Tailwind CSS v4 & Base UI on React; pure QML Quick Controls on Qt — no electron bloat or foreign wrappers.
            </CardDescription>
          </Card>
          <Card className="p-4 flex flex-col items-start gap-2">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/20">
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <CardTitle className="font-semibold text-sm">Automated Parity Gate</CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              CI enforces that all required capabilities and visual rendering match 100% across stacks.
            </CardDescription>
          </Card>
        </div>
      </section>

      <section id="architecture" className="my-10">
        <h2 className="text-xl font-bold tracking-tight mb-3">How It Works</h2>
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
        <h2 className="text-xl font-bold tracking-tight mb-3">Quick Start (React)</h2>
        <p className="text-xs text-muted-foreground mb-3">
          Install the package and peer dependencies:
        </p>
        <CodeBlock code="pnpm add @chahu/cha-set" language="bash" />
        <p className="text-xs text-muted-foreground mt-4 mb-2">Use in your React project:</p>
        <CodeBlock
          code={`import { Button, ScrollArea } from '@chahu/cha-set';
import '@chahu/cha-set/styles.css';

export function MyView() {
  return (
    <ScrollArea className="h-80 w-full border rounded-md">
      <div className="p-4 space-y-3">
        <Button variant="default">Launch Workspace</Button>
      </div>
    </ScrollArea>
  );
}`}
          language="tsx"
        />
      </section>

      <section id="packages" className="my-10">
        <h2 className="text-xl font-bold tracking-tight mb-3">Packages</h2>
        <Table columns={PACKAGE_COLUMNS} data={PACKAGE_ROWS} bordered />
      </section>
    </DocLayout>
  );
}
