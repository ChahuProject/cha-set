import React from 'react';
import { CodeBlock, Badge, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentReference } from '../../components/ComponentReference';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';

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
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('showcase.interactiveOverview', 'Interactive Overview')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('desktopComposite.codeBlock.overviewDesc', 'A syntax-highlighted source viewer with a language label and one-click copy. Highlighting is produced by the shared spec lexer — no third-party highlighter is shipped on either stack.')}
        </p>

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
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('desktopComposite.codeBlock.variantsTitle', 'Variants & Options')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('desktopComposite.codeBlock.variantsDesc', 'Line numbers, soft wrapping, bounded height with vertical scrolling, monochrome mode, and chrome-less embedding for inline prose.')}
        </p>

        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">showLineNumbers</Badge>
              <span className="text-xs text-muted-foreground">{t('desktopComposite.codeBlock.gutterDesc', 'Gutter with right-aligned line numbers')}</span>
            </div>
            <CodeBlock code={TSX_SAMPLE} language="tsx" showLineNumbers maxHeight={220} />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{t('desktopComposite.codeBlock.wrapBadge', 'wrap')}</Badge>
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
              <Badge variant="secondary">highlight={false}</Badge>
              <span className="text-xs text-muted-foreground">{t('desktopComposite.codeBlock.monochromeDesc', 'Monochrome fallback using the same layout')}</span>
            </div>
            <CodeBlock code={TSX_SAMPLE} language="tsx" highlight={false} showLineNumbers />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{t('desktopComposite.codeBlock.embeddedBadge', 'embedded')}</Badge>
              <span className="text-xs text-muted-foreground">{t('desktopComposite.codeBlock.embeddedDesc', 'Drop the card chrome and header for inline embedding')}</span>
            </div>
            <CodeBlock code={`export const VERSION = '1.4.0';`} language="ts" embedded className="rounded-md border border-border" />
          </div>
        </div>
      </section>

      <section id="multi-file" data-toc-title={t('desktopComposite.codeBlock.multiFileTitle', 'Multi-File Tabs')} className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('desktopComposite.codeBlock.multiFileTitle', 'Multi-File Tabs')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('desktopComposite.codeBlock.multiFileDesc', 'Pass a files array to render a tabbed group. Each tab carries its own language, and the copy button always targets the active file.')}
        </p>
        <CodeBlock files={MULTI_FILE_SAMPLE} showLineNumbers />
      </section>

      <section id="animations" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('showcase.animations', 'Animations')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('desktopComposite.codeBlock.animationsDesc', 'Motion behavior and timing for file switching and the header affordances.')}
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground">
          <li>
            {t('desktopComposite.codeBlock.animationsBullet1', 'Switching the active file cross-fades the body in over animate-in fade-in-0 — the duration resolves to the short motion token with the entrance curve.')}
          </li>
          <li>
            {t('desktopComposite.codeBlock.animationsBullet2', 'The header affordances inherit token motion from their primitives: tab triggers interpolate color and border over duration-quick with ease-standard, as do the copy button and the scroll bars.')}
          </li>
          <li>
            {t('desktopComposite.codeBlock.animationsBullet3', 'Durations and easing resolve from theme tokens, so prefers-reduced-motion zeroes them automatically (Qt: governed by ThemeTokens.animationsEnabled).')}
          </li>
        </ul>
      </section>

            <ComponentReference
        name="CodeBlock"
        componentId="code-block"
        props={[
            { name: 'code', type: 'string', default: "''", description: t('components.codeBlock.codeDesc', 'Source text; ignored when `files` is provided.') },
            { name: 'language', type: 'string', default: "'tsx'", description: t('components.codeBlock.languageDesc', 'Language id or alias resolved by the shared lexer.') },
            { name: 'filename', type: 'string', default: 'undefined', description: t('components.codeBlock.filenameDesc', 'Header title override; defaults to the resolved language label.') },
            { name: 'files', type: 'CodeBlockFileProps[]', default: 'undefined', description: t('components.codeBlock.filesDesc', 'Multi-file tab group; when present it replaces the single-file body.') },
            { name: 'highlight', type: 'boolean', default: 'true', description: t('components.codeBlock.highlightDesc', 'Enable spec-driven syntax highlighting.') },
            { name: 'showLineNumbers', type: 'boolean', default: 'false', description: t('components.codeBlock.showLineNumbersDesc', 'Render a line-number gutter.') },
            { name: 'showLanguage', type: 'boolean', default: 'true', description: t('components.codeBlock.showLanguageDesc', 'Render the language / filename label in the header.') },
            { name: 'showCopy', type: 'boolean', default: 'true', description: t('components.codeBlock.showCopyDesc', 'Render the built-in copy button in the header.') },
            { name: 'wrap', type: 'boolean', default: 'false', description: t('components.codeBlock.wrapDesc', 'Wrap long lines instead of scrolling horizontally.') },
            { name: 'maxHeight', type: 'number | string', default: 'undefined', description: t('components.codeBlock.maxHeightDesc', 'Bound the content height (rem-equivalent number, or any CSS length string).') },
            { name: 'embedded', type: 'boolean', default: 'false', description: t('components.codeBlock.embeddedDesc', 'Drop the card chrome (border / background / header) for inline prose embedding.') },
            { name: 'copyLabel', type: 'string', default: 'undefined', description: t('components.codeBlock.copyLabelDesc', 'Accessible label for the copy button.') },
            { name: 'className', type: 'string', default: 'undefined', description: t('components.codeBlock.classNameDesc', 'Additional class names for the outer container.') },
          ]}
      />
    </DocLayout>
  );
}
