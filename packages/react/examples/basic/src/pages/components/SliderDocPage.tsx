import React, { useState } from 'react';
import { Slider, type SliderOrientation, type SliderSize, SegmentedControl, Checkbox, Card, CodeBlock, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentReference } from '../../components/ComponentReference';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';

export function SliderDocPage() {
  const { t } = useChaSetI18n();
  const [value, setValue] = useState(50);
  const [step, setStep] = useState(1);
  const [min] = useState(0);
  const [max] = useState(100);
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [size, setSize] = useState<SliderSize>('default');
  const [showTooltip, setShowTooltip] = useState(true);
  const [showTicks, setShowTicks] = useState(false);
  const [orientation, setOrientation] = useState<SliderOrientation>('horizontal');

  const heroReactCode = `<div className="w-full max-w-xs flex flex-col gap-2">
  <div className="flex justify-between text-xs text-muted-foreground">
    <span>Value</span>
    <span className="font-mono font-medium text-foreground">{value}</span>
  </div>
  <Slider
    value={${value}}
    min={${min}}
    max={${max}}
    step={${step}}
    size="${size}"
    disabled={${disabled}}
    readOnly={${readOnly}}
    showTooltip={${showTooltip}}
    showTicks={${showTicks}}
    orientation="${orientation}"
    onValueChange={setValue}
  />
</div>`;

  const heroQtCode = `ChaSetSlider {
    width: 240
    value: ${value}
    min: ${min}
    max: ${max}
    step: ${step}
    size: "${size}"
    disabled: ${disabled}
    readOnly: ${readOnly}
    showTooltip: ${showTooltip}
    showTicks: ${showTicks}
    orientation: "${orientation}"
    onValueMoved: function(val) {
        // handle slider value update
    }
}`;

  return (
    <DocLayout
      category="Forms & Inputs"
      title="Slider"
      description="An interactive control that allows the user to select a numeric value along a track."
    >
      {/* 1. Interactive Sandbox Preview */}
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Interactive Overview
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('formsA.slider.overviewDesc', 'Explore interactive slider behaviors, sizes, steps, orientations, tooltips, and states across Web and Qt Desktop.')}
        </p>

        <ComponentPreview
          title="Slider Sandbox"
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-6">
              {/* Value display */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">{t('formsA.slider.valueLabel', 'Value:')}</span>
                <span className="font-mono text-xs font-semibold text-foreground px-2 py-0.5 rounded bg-muted">
                  {value}
                </span>
              </div>

              {/* Size selector */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">{t('showcase.size', 'Size:')}</span>
                <SegmentedControl
                  size="sm"
                  value={size}
                  onChange={(v) => setSize(v as SliderSize)}
                  options={[
                    { label: t('formsA.slider.sizeDefault', 'Default'), value: 'default' },
                    { label: t('formsA.slider.sizeSm', 'Small (sm)'), value: 'sm' },
                  ]}
                />
              </div>

              {/* Step selector */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">{t('formsA.slider.stepLabel', 'Step:')}</span>
                <SegmentedControl
                  size="sm"
                  value={String(step)}
                  onChange={(v) => setStep(Number(v))}
                  options={[
                    { label: '1', value: '1' },
                    { label: '5', value: '5' },
                    { label: '10', value: '10' },
                    { label: '25', value: '25' },
                  ]}
                />
              </div>

              {/* Orientation selector */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">{t('formsA.slider.orientationLabel', 'Orientation:')}</span>
                <SegmentedControl
                  size="sm"
                  value={orientation}
                  onChange={(v) => setOrientation(v as SliderOrientation)}
                  options={[
                    { label: t('formsA.slider.horizontal', 'Horizontal'), value: 'horizontal' },
                    { label: t('formsA.slider.vertical', 'Vertical'), value: 'vertical' },
                  ]}
                />
              </div>

              {/* Toggles */}
              <Checkbox
                size="sm"
                checked={disabled}
                onCheckedChange={(val) => setDisabled(Boolean(val))}
                label={t('common.disabled', 'Disabled')}
              />

              <Checkbox
                size="sm"
                checked={readOnly}
                onCheckedChange={(val) => setReadOnly(Boolean(val))}
                label={t('formsA.slider.readOnly', 'Read-Only')}
              />

              <Checkbox
                size="sm"
                checked={showTooltip}
                onCheckedChange={(val) => setShowTooltip(Boolean(val))}
                label={t('formsA.slider.tooltip', 'Tooltip')}
              />

              <Checkbox
                size="sm"
                checked={showTicks}
                onCheckedChange={(val) => setShowTicks(Boolean(val))}
                label={t('formsA.slider.ticks', 'Ticks')}
              />
            </div>
          }
        >
          <div className="w-full flex items-center justify-center p-8">
            <div
              className={
                orientation === 'horizontal'
                  ? 'w-72 max-w-xs flex flex-col gap-3'
                  : 'h-48 flex flex-col items-center justify-center'
              }
            >
              {orientation === 'horizontal' && (
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Value</span>
                  <span className="font-mono font-medium text-foreground">{value}</span>
                </div>
              )}
              <Slider
                value={value}
                min={min}
                max={max}
                step={step}
                size={size}
                disabled={disabled}
                readOnly={readOnly}
                showTooltip={showTooltip}
                showTicks={showTicks}
                orientation={orientation}
                onValueChange={setValue}
              />
              {orientation === 'vertical' && (
                <span className="font-mono text-xs font-medium text-foreground mt-2">{value}</span>
              )}
            </div>
          </div>
        </ComponentPreview>
      </section>

      {/* 2. Installation */}
      {/* 3. Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { Slider } from '@chahu/cha-set';\n\n<Slider\n  value={volume}\n  min={0}\n  max={100}\n  step={1}\n  showTooltip\n  formatValue={(v) => v + '%'}\n  onValueChange={setVolume}\n/>`}
        qtCode={`import ChaSet\n\nChaSetSlider {\n    value: 50\n    min: 0\n    max: 100\n    step: 1\n    showTooltip: true\n    onValueMoved: volume = value\n}`}
      />

      {/* 4. Examples & States */}
      <section id="states" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Examples & States
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('formsA.slider.examplesSubtitle', 'Visual matrix of common slider configurations, size scales, tooltips, and interactive states.')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="flex flex-col gap-3 p-5">
            <span className="text-xs font-medium text-foreground">{t('formsA.slider.floatingTooltipTitle', 'Floating Value Tooltip')}</span>
            <span className="text-xs text-muted-foreground">{t('formsA.slider.floatingTooltipDesc', 'Interactive formatted indicator on thumb drag and hover')}</span>
            <div className="pt-6 pb-2">
              <Slider defaultValue={75} showTooltip formatValue={(v) => `${v}%`} />
            </div>
          </Card>

          <Card className="flex flex-col gap-3 p-5">
            <span className="text-xs font-medium text-foreground">{t('formsA.slider.compactTitle', 'Compact Size (sm)')}</span>
            <span className="text-xs text-muted-foreground">{t('formsA.slider.compactDesc', 'Reduced track thickness and thumb size for toolbars')}</span>
            <div className="pt-6 pb-2">
              <Slider size="sm" defaultValue={40} />
            </div>
          </Card>

          <Card className="flex flex-col gap-3 p-5">
            <span className="text-xs font-medium text-foreground">{t('formsA.slider.readOnlyTitle', 'Read-Only State')}</span>
            <span className="text-xs text-muted-foreground">{t('formsA.slider.readOnlyDesc', 'Locked value without dimmed 50% opacity')}</span>
            <div className="pt-6 pb-2">
              <Slider readOnly defaultValue={60} />
            </div>
          </Card>

          <Card className="flex flex-col gap-3 p-5">
            <span className="text-xs font-medium text-foreground">{t('formsA.slider.ticksTitle', 'Discrete Stops with Ticks')}</span>
            <span className="text-xs text-muted-foreground">{t('formsA.slider.ticksDesc', 'Quantized stops with tick indicators and label marks')}</span>
            <div className="pt-6 pb-4">
              <Slider defaultValue={50} min={0} max={100} step={25} showTicks marks={['0%', '25%', '50%', '75%', '100%']} />
            </div>
          </Card>

          <Card className="flex flex-col gap-3 p-5">
            <span className="text-xs font-medium text-foreground">{t('formsA.slider.disabledTitle', 'Disabled State')}</span>
            <span className="text-xs text-muted-foreground">{t('formsA.slider.disabledDesc', 'Non-interactive with dimmed opacity for disabled controls')}</span>
            <div className="pt-6 pb-2">
              <Slider disabled defaultValue={45} min={0} max={100} />
            </div>
          </Card>

          <Card className="flex flex-col gap-3 p-5">
            <span className="text-xs font-medium text-foreground">{t('formsA.slider.customRangeTitle', 'Custom Range (20 to 80)')}</span>
            <span className="text-xs text-muted-foreground">{t('formsA.slider.customRangeDesc', 'Bounded custom minimum and maximum limits with step=5')}</span>
            <div className="pt-6 pb-2">
              <Slider defaultValue={50} min={20} max={80} step={5} />
            </div>
          </Card>
        </div>
      </section>

      {/* 5. Props Reference */}
            <ComponentReference
        name="Slider"
        componentId="slider"
        props={[
            {
              name: 'value',
              type: 'number',
              default: '—',
              description: 'The controlled numeric value of the slider.',
            },
            {
              name: 'defaultValue',
              type: 'number',
              default: '0',
              description: 'The default value for uncontrolled slider usage.',
            },
            {
              name: 'min',
              type: 'number',
              default: '0',
              description: 'The minimum allowable value.',
            },
            {
              name: 'max',
              type: 'number',
              default: '100',
              description: 'The maximum allowable value.',
            },
            {
              name: 'step',
              type: 'number',
              default: '1',
              description: 'The stepping granularity interval.',
            },
            {
              name: 'size',
              type: "'default' | 'sm'",
              default: "'default'",
              description: 'The size scale of the slider track and thumb.',
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: 'When true, prevents user interaction and applies muted opacity.',
            },
            {
              name: 'readOnly',
              type: 'boolean',
              default: 'false',
              description: 'When true, prevents value changes while maintaining full visual opacity.',
            },
            {
              name: 'showTooltip',
              type: 'boolean',
              default: 'false',
              description: 'When true, shows an interactive floating value tooltip over the thumb on drag and hover.',
            },
            {
              name: 'formatValue',
              type: '(value: number) => string',
              default: '—',
              description: 'Optional formatter function for the floating tooltip text.',
            },
            {
              name: 'showTicks',
              type: 'boolean',
              default: 'false',
              description: 'Displays tick mark indicators along the slider track.',
            },
            {
              name: 'marks',
              type: 'string[]',
              default: '—',
              description: 'Optional array of label strings corresponding to discrete stop positions.',
            },
            {
              name: 'orientation',
              type: "'horizontal' | 'vertical'",
              default: "'horizontal'",
              description: 'The orientation of the slider track.',
            },
            {
              name: 'onValueChange',
              type: '(value: number) => void',
              default: '—',
              description: 'Event handler called when the slider value changes.',
            },
            {
              name: 'onChange',
              type: '(value: number) => void',
              default: '—',
              description: 'Standard event handler called when the slider value changes.',
            },
            {
              name: 'name',
              type: 'string',
              default: '—',
              description: 'Form submission name for an underlying hidden input.',
            },
            {
              name: 'forceHover',
              type: 'boolean',
              default: 'false',
              description: 'Visual testing aid to programmatically force hover styling.',
            },
            {
              name: 'forceFocus',
              type: 'boolean',
              default: 'false',
              description: 'Visual testing aid to programmatically force focus ring styling.',
            },
            {
              name: 'className',
              type: 'string',
              default: "''",
              description: 'Additional CSS class names to apply to the slider root element.',
            },
          ]}
      />
    </DocLayout>
  );
}
