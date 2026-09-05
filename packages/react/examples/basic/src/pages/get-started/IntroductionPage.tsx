import React from 'react';
import { ScrollArea } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { CodeBlock } from '../../components/CodeBlock';

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
          <div className="p-4 rounded-xl border border-border bg-card">
            <span className="text-2xl mb-2 block">🎯</span>
            <h3 className="font-semibold text-sm mb-1">One Source of Truth</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Design tokens and API contracts reside in <code className="font-mono text-primary">spec/</code> and emit synchronized tokens for Web & Qt.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card">
            <span className="text-2xl mb-2 block">⚡</span>
            <h3 className="font-semibold text-sm mb-1">Native Ergonomics</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tailwind CSS v4 & Base UI on React; pure QML Quick Controls on Qt — no electron bloat or foreign wrappers.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card">
            <span className="text-2xl mb-2 block">🔒</span>
            <h3 className="font-semibold text-sm mb-1">Automated Parity Gate</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              CI enforces that all required capabilities and visual rendering match 100% across stacks.
            </p>
          </div>
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
        <ScrollArea
          showVerticalScrollBar={false}
          showHorizontalScrollBar={true}
          showButtons={false}
          className="rounded-lg border border-border w-full"
        >
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 font-semibold text-muted-foreground uppercase">
                <th className="py-2.5 px-4">Package</th>
                <th className="py-2.5 px-4">Target</th>
                <th className="py-2.5 px-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              <tr>
                <td className="py-3 px-4 font-mono font-medium text-primary">@chahu/cha-set</td>
                <td className="py-3 px-4">React / Web</td>
                <td className="py-3 px-4 text-muted-foreground">React component library published to npm.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono font-medium text-primary">QtChaSetDemo</td>
                <td className="py-3 px-4">Qt 6 / C++ / QML</td>
                <td className="py-3 px-4 text-muted-foreground">Qt reference implementation with native QML components.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono font-medium text-primary">@chahu/spec</td>
                <td className="py-3 px-4">Internal Spec</td>
                <td className="py-3 px-4 text-muted-foreground">Neutral token generator and contract schemas.</td>
              </tr>
            </tbody>
          </table>
        </ScrollArea>
      </section>
    </DocLayout>
  );
}
