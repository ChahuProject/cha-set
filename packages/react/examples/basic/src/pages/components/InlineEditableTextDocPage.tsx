import React, { useState } from 'react';
import { InlineEditableText, Card, CodeBlock, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { DocMarkdown } from '../../components/DocMarkdown';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { DocText } from '../../components/DocText';

export function InlineEditableTextDocPage() {
  const { t } = useChaSetI18n();
  const [title, setTitle] = useState('My Awesome Project');

  const reactCode = `<InlineEditableText
  value={title}
  onValueChange={setTitle}
  placeholder="Click or double-click to edit..."
/>`;

  return (
    <DocLayout
      category="Forms & Inputs"
      title="Inline Editable Text"
      description={t('components.inline-editable-text.description', 'Text element that switches seamlessly to an input field on double-click or edit trigger, supporting Enter to save and Escape to cancel.')}
    >
      <section id="overview" className="scroll-mt-20">
        <DocText role="h2" className="mb-3">
          {t('showcase.interactiveOverview', 'Interactive Overview')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t('desktopComposite.inlineEditableText.overviewDesc', 'Click or double-click on the text below to modify it. Press Enter to confirm or Esc to cancel.')}
        </DocText>

        <ComponentPreview
          qtCode={`ChaSetInlineEditableText {
    value: "Project Apollo Architecture"
    onSave: function(newVal) { console.log(newVal) }
}`} title={t('desktopComposite.inlineEditableText.sandboxTitle', 'Inline Editable Text Sandbox')} reactCode={reactCode}>
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-lg border border-border bg-card text-foreground text-base">
              <InlineEditableText
                value={title}
                onValueChange={setTitle}
                placeholder={t('components.inlineEditableText.placeholder', 'Type a title...')}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {t('components.inlineEditableText.currentStateValue', 'Current state value:')} <strong className="text-foreground">{title}</strong>
            </span>
          </div>
        </ComponentPreview>
      </section>

      {/* Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { InlineEditableText } from '@chahu/cha-set';

<InlineEditableText value="Project Title" onSave={(val) => console.log(val)} />`}
        qtCode={`import ChaSet

ChaSetInlineEditableText {
    text: "Project Title"
    onAccepted: (val) => console.log(val)
}`}
      />



      <section id="variants" className="scroll-mt-20 my-10">
        <DocText role="h2" className="mb-3">
          {t('components.inlineEditableText.sizesAndTriggers', 'Sizes & Interaction Triggers')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t('components.inlineEditableText.sizesAndTriggersDesc', 'Configure single-click vs double-click activations and high-density sizing tiers.')}
        </DocText>

        <ComponentPreview
          qtCode={`ChaSetInlineEditableText { value: "Project Architecture Doc"; trigger: "click"; size: "default" }
ChaSetInlineEditableText { value: "Database Connection URI"; trigger: "doubleClick"; size: "default" }
ChaSetInlineEditableText { value: "Sprint-42-Review"; size: "sm" }
ChaSetInlineEditableText { value: "System Protected File"; disabled: true }`}
          title={t('components.inlineEditableText.sizesAndTriggers', 'Sizes & Interaction Triggers')}
          reactCode={`<InlineEditableText value="Single Click to Edit" trigger="click" size="default" />
<InlineEditableText value="Double Click to Edit" trigger="doubleClick" size="default" />
<InlineEditableText value="Compact sm Tier Label" size="sm" />
<InlineEditableText value="Read-only Disabled Text" disabled />`}
        >
          <div className="w-full max-w-sm flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-muted-foreground">{t('components.inlineEditableText.singleClickActivation', 'Single Click Activation (Default)')}</span>
              <InlineEditableText value={t('components.inlineEditableText.demoSingleClick', 'Project Architecture Doc')} trigger="click" size="default" />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-muted-foreground">{t('components.inlineEditableText.doubleClickActivation', 'Double Click Activation')}</span>
              <InlineEditableText value={t('components.inlineEditableText.demoDoubleClick', 'Database Connection URI')} trigger="doubleClick" size="default" />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-muted-foreground">{t('components.inlineEditableText.compactSm', 'Compact sm Size')}</span>
              <InlineEditableText value={t('components.inlineEditableText.demoCompact', 'Sprint-42-Review')} size="sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-muted-foreground">{t('components.inlineEditableText.disabledTitle', 'Disabled State')}</span>
              <InlineEditableText value={t('components.inlineEditableText.demoDisabled', 'System Protected File')} disabled />
            </div>
          </div>
        </ComponentPreview>
      </section>

                        <DocMarkdown id="inline-editable-text" section="keyboard" />

            <DocMarkdown id="inline-editable-text" section="props" />
    </DocLayout>
  );
}
