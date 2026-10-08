import React, { useState } from 'react';
import { PresetNumberInput, CodeBlock, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentReference } from '../../components/ComponentReference';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';

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
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('showcase.interactiveOverview', 'Interactive Overview')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('desktopComposite.presetNumberInput.overviewDesc', 'Focus or click the input field to open the preset numbers list. Click an item to populate the field, or type custom numbers freely.')}
        </p>

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
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('components.presetNumberInput.variantsTitle', 'Variants & Configurations')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('components.presetNumberInput.variantsDesc', 'Configure custom numeric presets, disable the clear option, or place the control in disabled state.')}
        </p>

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

            <ComponentReference
        name="PresetNumberInput"
        componentId="preset-number-input"
        props={[
            { name: 'value', type: 'string', default: "''", description: t('components.presetNumberInput.valueDesc', 'Current numeric value of the input.') },
            { name: 'onChange', type: '(val: string) => void', default: 'undefined', description: t('components.presetNumberInput.onChangeDesc', 'Callback fired when the value changes.') },
            { name: 'presets', type: 'number[]', default: '[64, 128, 256, 512, 1024, 2048, 4096, 8192]', description: t('components.presetNumberInput.presetsDesc', 'List of quick-select preset numbers.') },
            { name: 'placeholder', type: 'string', default: 'undefined', description: t('components.presetNumberInput.placeholderDesc', 'Placeholder text displayed when empty.') },
            { name: 'disabled', type: 'boolean', default: 'false', description: t('components.presetNumberInput.disabledDesc', 'Whether typing and dropdown interactions are disabled.') },
            { name: 'allowClear', type: 'boolean', default: 'true', description: t('components.presetNumberInput.allowClearDesc', 'Whether to display the clear/reset option in dropdown.') },
            { name: 'clearLabel', type: 'string', default: "'None'", description: t('components.presetNumberInput.clearLabelDesc', 'Label text for the clear option.') },
            { name: 'inputClassName', type: 'string', default: 'undefined', description: t('components.presetNumberInput.inputClassNameDesc', 'Custom CSS classes for the inner input.') },
            { name: 'className', type: 'string', default: 'undefined', description: t('components.presetNumberInput.classNameDesc', 'Custom CSS classes for the outer container.') },
          ]}
      />
    </DocLayout>
  );
}
