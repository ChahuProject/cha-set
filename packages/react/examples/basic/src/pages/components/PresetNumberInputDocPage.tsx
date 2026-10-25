import React, { useState } from 'react';
import { PresetNumberInput, CodeBlock, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { DocMarkdown } from '../../components/DocMarkdown';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { DocText } from '../../components/DocText';

export function PresetNumberInputDocPage() {
  const { t } = useChaSetI18n();
  const [value, setValue] = useState('1024');
  const [smallPresetValue, setSmallPresetValue] = useState('64');
  const [noClearValue, setNoClearValue] = useState('256');

  const reactCode = `<PresetNumberInput
  value={value}
  onChange={setValue}
  placeholder="Enter size..."
  allowClear
  clearLabel="None"
/>`;

  return (
    <DocLayout
      category="Forms & Inputs"
      title="Preset Number Input"
      description={t('components.preset-number-input.description', 'High-density numeric input field with a quick-select dropdown panel for common dimension presets, unit tags, and optional clear action.')}
    >
      <section id="overview" className="scroll-mt-20">
        <DocText role="h2" className="mb-3">
          {t('showcase.interactiveOverview', 'Interactive Overview')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t('desktopComposite.presetNumberInput.overviewDesc', 'Focus or click the input field to open the preset numbers list. Click an item to populate the field, or type custom numbers freely.')}
        </DocText>

        <ComponentPreview
          qtCode={`ChaSetPresetNumberInput {
    value: "1024"
}`} title={t('desktopComposite.presetNumberInput.sandboxTitle', 'Preset Number Input Sandbox')} reactCode={reactCode}>
          <div className="w-full max-w-xs flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">{t('components.presetNumberInput.textureDimension', 'Texture Dimension')}</label>
              <PresetNumberInput
                value={value}
                onChange={setValue}
                placeholder={t('components.presetNumberInput.placeholder', 'Width / Height')}
              />
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              {t('components.presetNumberInput.currentValue', 'Current value:')} <strong className="text-foreground">{value || t('components.presetNumberInput.empty', '(empty)')}</strong>
            </div>
          </div>
        </ComponentPreview>
      </section>

      {/* Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { PresetNumberInput } from '@chahu/cha-set';

<PresetNumberInput value={100} presets={[50, 100, 200]} onChange={(v) => console.log(v)} />`}
        qtCode={`import ChaSet

ChaSetPresetNumberInput {
    value: 100
    presets: [50, 100, 200]
}`}
      />



      <section id="variants" className="scroll-mt-20 my-10">
        <DocText role="h2" className="mb-3">
          {t('components.presetNumberInput.variantsTitle', 'Variants & Configurations')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t('components.presetNumberInput.variantsDesc', 'Configure custom numeric presets, disable the clear option, or place the control in disabled state.')}
        </DocText>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-lg border border-border bg-card flex flex-col gap-2">
            <span className="text-xs font-semibold text-foreground">{t('components.presetNumberInput.customPresetsSmall', 'Custom Presets (Small)')}</span>
            <PresetNumberInput
              value={smallPresetValue}
              onChange={setSmallPresetValue}
              presets={[8, 16, 32, 64, 128]}
              clearLabel={t('components.presetNumberInput.auto', 'Auto')}
            />
          </div>

          <div className="p-4 rounded-lg border border-border bg-card flex flex-col gap-2">
            <span className="text-xs font-semibold text-foreground">{t('components.presetNumberInput.disallowClear', 'Disallow Clear (Mandatory)')}</span>
            <PresetNumberInput
              value={noClearValue}
              onChange={setNoClearValue}
              allowClear={false}
            />
          </div>

          <div className="p-4 rounded-lg border border-border bg-card flex flex-col gap-2">
            <span className="text-xs font-semibold text-foreground">{t('components.presetNumberInput.disabledTitle', 'Disabled State')}</span>
            <PresetNumberInput
              value="2048"
              disabled
            />
          </div>
        </div>
      </section>

                        <DocMarkdown id="preset-number-input" section="keyboard" />

            <DocMarkdown id="preset-number-input" section="props" />
    </DocLayout>
  );
}
