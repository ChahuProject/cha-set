import React, { useState } from 'react';
import { DurationInput, CodeBlock, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentReference } from '../../components/ComponentReference';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';

export function DurationInputDocPage() {
  const { t } = useChaSetI18n();
  const [value, setValue] = useState(3665); // 1h 1m 5s
  const [smValue, setSmValue] = useState(300); // 5m
  const [lgValue, setLgValue] = useState(7200); // 2h

  const reactCode = `<DurationInput
  value={value}
  onChange={setValue}
  size="default"
  showPresets
  showLabels
/>`;

  const formatHuman = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return t('components.durationInput.formattedSummary', `${h}h ${m}m ${sec}s (${s}s total)`, { h, m, sec, total: s });
  };

  return (
    <DocLayout
      category="Forms & Inputs"
      title="Duration Input"
      description={t('components.duration-input.description', 'Segmented duration input control for hours, minutes, and seconds with stepper buttons, mouse wheel adjustments, keyboard arrow jumping, and preset menu.')}
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('desktopComposite.durationInput.overviewHeading', 'Interactive Overview')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('desktopComposite.durationInput.overviewDesc', 'Directly type into any segment or use the up/down stepper buttons. Press Left/Right arrow keys to jump between segments, or pick from grouped quick-select presets.')}
        </p>

        <ComponentPreview
          qtCode={`ChaSetDurationInput {
    value: 3665
}`} title={t('desktopComposite.durationInput.sandboxTitle', 'Duration Input Sandbox')} reactCode={reactCode}>
          <div className="w-full max-w-sm flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">{t('components.durationInput.timerDuration', 'Timer Duration')}</label>
              <DurationInput
                value={value}
                onChange={setValue}
                hoursLabel={t('components.durationInput.hours', 'Hours')}
                minutesLabel={t('components.durationInput.minutes', 'Minutes')}
                secondsLabel={t('components.durationInput.seconds', 'Seconds')}
                presetsLabel={t('components.durationInput.presets', 'Presets')}
              />
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              {t('components.durationInput.formatted', 'Formatted:')} <strong className="text-foreground">{formatHuman(value)}</strong>
            </div>
          </div>
        </ComponentPreview>
      </section>

      {/* Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { DurationInput } from '@chahu/cha-set';

<DurationInput value={3600} onChange={(v) => console.log(v)} />`}
        qtCode={`import ChaSet

ChaSetDurationInput {
    value: 3600
    onValueChanged: (v) => console.log(v)
}`}
      />



      <section id="variants" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('components.durationInput.variantsTitle', 'Variants & Configurations')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('components.durationInput.variantsDesc', 'Supports compact and comfortable sizes, disabling presets or labels, and disabled states.')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-lg border border-border bg-card flex flex-col gap-2">
            <span className="text-xs font-semibold text-foreground">{t('components.durationInput.compactTitle', 'Compact Size (sm)')}</span>
            <DurationInput
              size="sm"
              value={smValue}
              onChange={setSmValue}
              hoursLabel={t('components.durationInput.hours', 'Hours')}
              minutesLabel={t('components.durationInput.minutes', 'Minutes')}
              secondsLabel={t('components.durationInput.seconds', 'Seconds')}
              presetsLabel={t('components.durationInput.presets', 'Presets')}
            />
          </div>

          <div className="p-4 rounded-lg border border-border bg-card flex flex-col gap-2">
            <span className="text-xs font-semibold text-foreground">{t('components.durationInput.largeTitle', 'Large Size (lg)')}</span>
            <DurationInput
              size="lg"
              value={lgValue}
              onChange={setLgValue}
              hoursLabel={t('components.durationInput.hours', 'Hours')}
              minutesLabel={t('components.durationInput.minutes', 'Minutes')}
              secondsLabel={t('components.durationInput.seconds', 'Seconds')}
              presetsLabel={t('components.durationInput.presets', 'Presets')}
            />
          </div>

          <div className="p-4 rounded-lg border border-border bg-card flex flex-col gap-2">
            <span className="text-xs font-semibold text-foreground">{t('components.durationInput.disabledTitle', 'Disabled State')}</span>
            <DurationInput
              value={900}
              disabled
              hoursLabel={t('components.durationInput.hours', 'Hours')}
              minutesLabel={t('components.durationInput.minutes', 'Minutes')}
              secondsLabel={t('components.durationInput.seconds', 'Seconds')}
              presetsLabel={t('components.durationInput.presets', 'Presets')}
            />
          </div>
        </div>
      </section>

            <ComponentReference
        name="DurationInput"
        componentId="duration-input"
        props={[
            { name: 'value', type: 'number', default: '0', description: t('components.durationInput.valueDesc', 'Total duration in seconds (controlled mode).') },
            { name: 'defaultValue', type: 'number', default: '0', description: t('components.durationInput.defaultValueDesc', 'Initial duration in seconds (uncontrolled mode).') },
            { name: 'onChange', type: '(seconds: number) => void', default: 'undefined', description: t('components.durationInput.onChangeDesc', 'Callback fired when the duration changes.') },
            { name: 'maxHours', type: 'number', default: '99', description: t('components.durationInput.maxHoursDesc', 'Upper clamp limit for the hours segment.') },
            { name: 'size', type: "'sm' | 'default' | 'lg'", default: "'default'", description: t('components.durationInput.sizeDesc', 'Visual density and size variant.') },
            { name: 'disabled', type: 'boolean', default: 'false', description: t('components.durationInput.disabledDesc', 'Whether the inputs, buttons, and preset dropdown are disabled.') },
            { name: 'showPresets', type: 'boolean', default: 'true', description: t('components.durationInput.showPresetsDesc', 'Whether to display the preset dropdown button.') },
            { name: 'showLabels', type: 'boolean', default: 'true', description: t('components.durationInput.showLabelsDesc', 'Whether to display the segment unit labels underneath.') },
            { name: 'presets', type: 'DurationPresetGroup[]', default: 'defaultDurationPresetGroups', description: t('components.durationInput.presetsDesc', 'Custom grouped duration presets for the dropdown.') },
            { name: 'hoursLabel', type: 'string', default: "'Hours'", description: t('components.durationInput.hoursLabelDesc', 'Label text for hours segment.') },
            { name: 'minutesLabel', type: 'string', default: "'Minutes'", description: t('components.durationInput.minutesLabelDesc', 'Label text for minutes segment.') },
            { name: 'secondsLabel', type: 'string', default: "'Seconds'", description: t('components.durationInput.secondsLabelDesc', 'Label text for seconds segment.') },
            { name: 'presetsLabel', type: 'string', default: "'Presets'", description: t('components.durationInput.presetsLabelDesc', 'Label text for the presets trigger button.') },
            { name: 'className', type: 'string', default: 'undefined', description: t('components.durationInput.classNameDesc', 'Custom CSS classes for outer container.') },
          ]}
      />
    </DocLayout>
  );
}
