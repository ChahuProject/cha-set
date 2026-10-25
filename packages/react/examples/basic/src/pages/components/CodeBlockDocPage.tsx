import React from 'react';
import { CodeBlock, CopyableBadge, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { DocMarkdown } from '../../components/DocMarkdown';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { DocText } from '../../components/DocText';

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
  const { t } = useChaSetI18n();
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
      description={t('components.code-block.description', 'Spec-driven syntax-highlighted code viewer composed from ChaSet scroll, copy, tab, and card primitives over a shared zero-dependency lexer — identical tokenization and colors on React and Qt.')}
    >
      <section id="overview" className="scroll-mt-20">
        <DocText role="h2" className="mb-3">
          {t('showcase.interactiveOverview', 'Interactive Overview')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t('desktopComposite.codeBlock.overviewDesc', 'A syntax-highlighted source viewer with a language label and one-click copy. Highlighting is produced by the shared spec lexer — no third-party highlighter is shipped on either stack.')}
        </DocText>

        <ComponentPreview
          qtCode={`ChaSetCodeBlock {\n    language: "tsx"\n    showLineNumbers: true\n    code: source\n}`} title={t('desktopComposite.codeBlock.sandboxTitle', 'Code Block Sandbox')} reactCode={reactCode}>
          <div className="w-full max-w-2xl">
            <CodeBlock code={TSX_SAMPLE} language="tsx" showLineNumbers />
          </div>
        </ComponentPreview>
      </section>

      {/* Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { CodeBlock } from '@chahu/cha-set';

<CodeBlock
  code="const greeting = 'Hello, world!';" 
  language="tsx"
  showLineNumbers
  showCopy
/>`}
        qtCode={`import ChaSet

ChaSetCodeBlock {
    width: parent.width
    code: "const greeting = 'Hello, world!';"
    language: "tsx"
    showLineNumbers: true
}`}
      />



      <section id="variants" data-toc-title={t('desktopComposite.codeBlock.variantsTitle', 'Variants & Options')} className="scroll-mt-20 my-10">
        <DocText role="h2" className="mb-3">
          {t('desktopComposite.codeBlock.variantsTitle', 'Variants & Options')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t('desktopComposite.codeBlock.variantsDesc', 'Line numbers, soft wrapping, bounded height with vertical scrolling, monochrome mode, and chrome-less embedding for inline prose.')}
        </DocText>

        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CopyableBadge size="sm" text="showLineNumbers" />
              <span className="text-xs text-muted-foreground">{t('desktopComposite.codeBlock.gutterDesc', 'Gutter with right-aligned line numbers')}</span>
            </div>
            <CodeBlock code={TSX_SAMPLE} language="tsx" showLineNumbers maxHeight={220} />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <CopyableBadge size="sm" text="wrap">{t('desktopComposite.codeBlock.wrapBadge', 'wrap')}</CopyableBadge>
              <span className="text-xs text-muted-foreground">{t('desktopComposite.codeBlock.wrapDesc', 'Soft-wrap long lines instead of horizontal scroll')}</span>
            </div>
            <CodeBlock
              code={'const message = "A deliberately long single line that would otherwise require horizontal scrolling to read in full.";'}
              language="ts"
              wrap
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <CopyableBadge size="sm" text="highlight={false}" />
              <span className="text-xs text-muted-foreground">{t('desktopComposite.codeBlock.monochromeDesc', 'Monochrome fallback using the same layout')}</span>
            </div>
            <CodeBlock code={TSX_SAMPLE} language="tsx" highlight={false} showLineNumbers />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <CopyableBadge size="sm" text="embedded">{t('desktopComposite.codeBlock.embeddedBadge', 'embedded')}</CopyableBadge>
              <span className="text-xs text-muted-foreground">{t('desktopComposite.codeBlock.embeddedDesc', 'Drop the card chrome and header for inline embedding')}</span>
            </div>
            <CodeBlock code={`export const VERSION = '1.4.0';`} language="ts" embedded className="rounded-md border border-border" />
          </div>
        </div>
      </section>

      <section id="multi-file" data-toc-title={t('desktopComposite.codeBlock.multiFileTitle', 'Multi-File Tabs')} className="scroll-mt-20 my-10">
        <DocText role="h2" className="mb-3">
          {t('desktopComposite.codeBlock.multiFileTitle', 'Multi-File Tabs')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t('desktopComposite.codeBlock.multiFileDesc', 'Pass a files array to render a tabbed group. Each tab carries its own language, and the copy button always targets the active file.')}
        </DocText>
        <CodeBlock files={MULTI_FILE_SAMPLE} showLineNumbers />
      </section>

      <DocMarkdown id="code-block" section="animations" />

                        <DocMarkdown id="code-block" section="keyboard" />

            <DocMarkdown id="code-block" section="props" />
    </DocLayout>
  );
}
