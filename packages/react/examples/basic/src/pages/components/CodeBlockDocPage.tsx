import React from 'react';
import { CodeBlock, Badge } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

const TSX_SAMPLE = `import { useState } from 'react';

interface CounterProps {
  /** Starting value for the counter. */
  initial?: number;
}

/**
 * A tiny counter with a clamped floor.
 * Demonstrates the shared spec lexer across React and Qt.
 */
export function Counter({ initial = 0 }: CounterProps) {
  const [count, setCount] = useState(initial);
  const bump = () => setCount((c) => Math.max(0, c + 1));

  return (
    <button onClick={bump} data-testid="counter">
      Count: {count}
    </button>
  );
}`;

const MULTI_FILE_SAMPLE = [
  {
    name: 'Button.tsx',
    language: 'tsx',
    code: `export function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className="rounded-md px-3 py-1.5 text-sm">
      {children}
    </button>
  );
}`,
  },
  {
    name: 'theme.css',
    language: 'css',
    code: `:root {
  --primary: oklch(0.62 0.19 260);
  --radius: 0.625rem;
}

.dark {
  --primary: oklch(0.7 0.17 260);
}`,
  },
  {
    name: 'setup.ts',
    language: 'ts',
    code: `export const VERSION = '1.4.0';
const features = ['highlight', 'copy', 'tabs'];

// Resolve the active feature set once at boot.
export function resolve(key: string): boolean {
  return features.includes(key);
}`,
  },
];

export function CodeBlockDocPage() {
  const reactCode = `<CodeBlock
  code={source}
  language="tsx"
  showLineNumbers
  showCopy
/>`;

  return (
    <DocLayout
      category="Composite Engines"
      title="Code Block"
      description="Spec-driven syntax-highlighted code viewer composed from ChaSet scroll, copy, tab, and card primitives over a shared zero-dependency lexer — identical tokenization and colors on React and Qt."
      tocItems={[
        { id: 'overview', title: 'Interactive Overview' },
        { id: 'variants', title: 'Variants & Options' },
        { id: 'multi-file', title: 'Multi-File Tabs' },
        { id: 'installation', title: 'Installation' },
        { id: 'animations', title: 'Animations' },
        { id: 'keyboard', title: 'Keyboard Navigation' },
        { id: 'props', title: 'Props Reference' },
      ]}
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Interactive Overview
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          A syntax-highlighted source viewer with a language label and one-click copy. Highlighting is
          produced by the shared spec lexer — no third-party highlighter is shipped on either stack.
        </p>

        <ComponentPreview title="Code Block Sandbox" reactCode={reactCode}>
          <div className="w-full max-w-2xl">
            <CodeBlock code={TSX_SAMPLE} language="tsx" showLineNumbers />
          </div>
        </ComponentPreview>
      </section>

      <section id="variants" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Variants &amp; Options
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Line numbers, soft wrapping, bounded height with vertical scrolling, monochrome mode, and
          chrome-less embedding for inline prose.
        </p>

        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">showLineNumbers</Badge>
              <span className="text-xs text-muted-foreground">Gutter with right-aligned line numbers</span>
            </div>
            <CodeBlock code={TSX_SAMPLE} language="tsx" showLineNumbers maxHeight={220} />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">wrap</Badge>
              <span className="text-xs text-muted-foreground">Soft-wrap long lines instead of horizontal scroll</span>
            </div>
            <CodeBlock
              code={'const message = "A deliberately long single line that would otherwise require horizontal scrolling to read in full.";'}
              language="ts"
              wrap
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">highlight={false}</Badge>
              <span className="text-xs text-muted-foreground">Monochrome fallback using the same layout</span>
            </div>
            <CodeBlock code={TSX_SAMPLE} language="tsx" highlight={false} showLineNumbers />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">embedded</Badge>
              <span className="text-xs text-muted-foreground">Drop the card chrome and header for inline embedding</span>
            </div>
            <CodeBlock code={`export const VERSION = '1.4.0';`} language="ts" embedded className="rounded-md border border-border" />
          </div>
        </div>
      </section>

      <section id="multi-file" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Multi-File Tabs
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Pass a <code className="font-mono text-xs">files</code> array to render a tabbed group. Each
          tab carries its own language, and the copy button always targets the active file.
        </p>
        <CodeBlock files={MULTI_FILE_SAMPLE} showLineNumbers />
      </section>

      <section id="installation" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Installation
        </h2>
        <CodeBlock code="pnpm add @chahu/cha-set" language="bash" />
      </section>

      <section id="animations" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Animations
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Motion behavior and timing for file switching and the header affordances.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground">
          <li>
            Switching the active file cross-fades the body in over{' '}
            <code className="text-xs bg-muted px-1 rounded">animate-in fade-in-0</code> — the duration
            resolves to the <code className="text-xs bg-muted px-1 rounded">short</code> motion token with
            the <code className="text-xs bg-muted px-1 rounded">entrance</code> curve.
          </li>
          <li>
            The header affordances inherit token motion from their primitives: tab triggers interpolate
            color and border over <code className="text-xs bg-muted px-1 rounded">duration-quick</code> with{' '}
            <code className="text-xs bg-muted px-1 rounded">ease-standard</code>, as do the copy button and
            the scroll bars.
          </li>
          <li>
            Durations and easing resolve from theme tokens, so <code>prefers-reduced-motion</code> zeroes
            them automatically (Qt: governed by <code>ThemeTokens.animationsEnabled</code>).
          </li>
        </ul>
      </section>

      <section id="keyboard" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Keyboard Navigation
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Keyboard shortcuts and interaction patterns for this component.
        </p>
        <KeyboardShortcutsTable componentId="code-block" />
      </section>

      <section id="props" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Props Reference
        </h2>
        <PropsTable
          props={[
            { name: 'code', type: 'string', default: "''", description: 'Source text; ignored when `files` is provided.' },
            { name: 'language', type: 'string', default: "'tsx'", description: 'Language id or alias resolved by the shared lexer.' },
            { name: 'filename', type: 'string', default: 'undefined', description: 'Header title override; defaults to the resolved language label.' },
            { name: 'files', type: 'CodeBlockFileProps[]', default: 'undefined', description: 'Multi-file tab group; when present it replaces the single-file body.' },
            { name: 'highlight', type: 'boolean', default: 'true', description: 'Enable spec-driven syntax highlighting.' },
            { name: 'showLineNumbers', type: 'boolean', default: 'false', description: 'Render a line-number gutter.' },
            { name: 'showLanguage', type: 'boolean', default: 'true', description: 'Render the language / filename label in the header.' },
            { name: 'showCopy', type: 'boolean', default: 'true', description: 'Render the built-in copy button in the header.' },
            { name: 'wrap', type: 'boolean', default: 'false', description: 'Wrap long lines instead of scrolling horizontally.' },
            { name: 'maxHeight', type: 'number | string', default: 'undefined', description: 'Bound the content height (px-equivalent number, or any CSS length string).' },
            { name: 'embedded', type: 'boolean', default: 'false', description: 'Drop the card chrome (border / background / header) for inline prose embedding.' },
            { name: 'copyLabel', type: 'string', default: 'undefined', description: 'Accessible label for the copy button.' },
            { name: 'className', type: 'string', default: 'undefined', description: 'Additional class names for the outer container.' },
          ]}
        />
      </section>
    </DocLayout>
  );
}
