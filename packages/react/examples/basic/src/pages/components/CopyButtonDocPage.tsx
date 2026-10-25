import React from 'react';
import { CopyButton, Card, CodeBlock, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { DocMarkdown } from '../../components/DocMarkdown';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { DocText } from '../../components/DocText';

export function CopyButtonDocPage() {
  const { t } = useChaSetI18n();
  const reactCode = `<div className="flex items-center gap-4">
  <CopyButton text="pnpm add @chahu/cha-set" />
  <CopyButton text="https://chahu.design" label="Copy URL" />
</div>`;

  return (
    <DocLayout
      category="Base Primitives"
      title="Copy Button"
      description={t('components.copy-button.description', 'One-click clipboard copy button with transient success checkmark feedback and customizable timeout.')}
    >
      <section id="overview" className="scroll-mt-20">
        <DocText role="h2" className="mb-3">
          {t('showcase.interactiveOverview', 'Interactive Overview')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t('components.copy-button.overviewDesc', 'Click either copy button below to copy the target string to your system clipboard.')}
        </DocText>

        <ComponentPreview
          qtCode={`Row {\n    spacing: 12\n    ChaSetCopyButton {\n        text: "pnpm add @chahu/cha-set"\n        onCopiedToClipboard: function(txt) { console.log("Copied: " + txt) }\n    }\n    ChaSetCopyButton {\n        text: "https://chahu.design"\n        label: "Copy Link"\n        variant: "outline"\n    }\n    ChaSetCopyButton {\n        text: "export const SECRET = 'sk_live_948271';"\n        label: "Copy Secret"\n        variant: "default"\n    }\n}`} title={t('desktopComposite.copyButton.sandboxTitle', 'Copy Button Sandbox')} reactCode={reactCode}>
          <div className="flex flex-wrap items-center gap-4">
            <CopyButton text="pnpm add @chahu/cha-set" />
            <CopyButton text="https://chahu.design" label={t('components.copy-button.copyLink', 'Copy Link')} />
            <CopyButton text="export const SECRET = 'sk_live_948271';" variant="default" label={t('components.copy-button.copySecret', 'Copy Secret')} />
          </div>
        </ComponentPreview>
      </section>

      {/* Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { CopyButton } from '@chahu/cha-set';

<CopyButton text="pnpm add @chahu/cha-set" label="Copy Command" />`}
        qtCode={`import ChaSet

ChaSetCopyButton {
    text: "pnpm add @chahu/cha-set"
    label: "Copy Command"
    onCopiedToClipboard: (txt) => console.log("Copied:", txt)
}`}
      />



                        <DocMarkdown id="copy-button" section="keyboard" />

            <DocMarkdown id="copy-button" section="props" />
    </DocLayout>
  );
}
