import React, { useState } from 'react';
import {
  Slider,
  type SliderOrientation,
  Tabs,
  TabsList,
  TabsTrigger,
  Checkbox,
  Card,
} from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';

export function SliderDocPage() {
  const [value, setValue] = useState(50);
  const [step, setStep] = useState(1);
  const [min] = useState(0);
  const [max] = useState(100);
  const [disabled, setDisabled] = useState(false);
  const [orientation, setOrientation] = useState<SliderOrientation>('horizontal');

  const heroReactCode = `<div className="w-full max-w-xs flex flex-col gap-2">
  <div className="flex justify-between text-xs text-muted-foreground">
    <span>Value</span>
    <span className="font-mono font-medium text-foreground">${value}</span>
  </div>
  <Slider
    value={${value}}
    min={${min}}
    max={${max}}
    step={${step}}
    disabled={${disabled}}
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
    disabled: ${disabled}
    orientation: "${orientation}"
    onValueMoved: function(val) {
        // handle slider value update
    }
}`;

  return (
    <DocLayout
      category="Components"
      title="Slider"
      description="An interactive control that allows the user to select a numeric value along a track."
      tocItems={[
        { id: 'overview', title: 'Interactive Overview' },
        { id: 'installation', title: 'Installation' },
        { id: 'anatomy', title: 'Anatomy' },
        { id: 'states', title: 'Examples & States' },
        { id: 'props', title: 'Props Reference' },
      ]}
    >
      {/* 1. Interactive Sandbox Preview */}
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Interactive Overview
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Explore interactive slider behaviors, steps, orientations, and states across Web and Qt Desktop.
        </p>

        <ComponentPreview
          title="Slider Sandbox"
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-6">
              {/* Value display */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">Value:</span>
                <span className="font-mono text-xs font-semibold text-foreground px-2 py-0.5 rounded bg-muted">
                  {value}
                </span>
              </div>

              {/* Step selector */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">Step:</span>
                <Tabs value={String(step)} onValueChange={(v) => setStep(Number(v))}>
                  <TabsList className="h-8">
                    <TabsTrigger value="1" className="h-6 px-2.5 text-xs">1</TabsTrigger>
                    <TabsTrigger value="5" className="h-6 px-2.5 text-xs">5</TabsTrigger>
                    <TabsTrigger value="10" className="h-6 px-2.5 text-xs">10</TabsTrigger>
                    <TabsTrigger value="25" className="h-6 px-2.5 text-xs">25</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Orientation selector */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">Orientation:</span>
                <Tabs
                  value={orientation}
                  onValueChange={(v) => setOrientation(v as SliderOrientation)}
                >
                  <TabsList className="h-8">
                    <TabsTrigger value="horizontal" className="h-6 px-2.5 text-xs">Horizontal</TabsTrigger>
                    <TabsTrigger value="vertical" className="h-6 px-2.5 text-xs">Vertical</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Disabled toggle */}
              <Checkbox
                size="sm"
                checked={disabled}
                onCheckedChange={(val) => setDisabled(val)}
                label="Disabled"
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
                disabled={disabled}
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
      <section id="installation" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Installation
        </h2>
        <CodeBlock code="pnpm add @chahu/cha-set" language="bash" />
      </section>

      {/* 3. Anatomy */}
      <section id="anatomy" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Anatomy
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Import and render Slider controlled or uncontrolled in your React JSX or Qt QML tree.
        </p>
        <CodeBlock
          code={`import { Slider } from '@chahu/cha-set';

export function SliderDemo() {
  const [volume, setVolume] = React.useState(50);

  return (
    <div className="flex flex-col gap-2 max-w-xs">
      <label className="text-sm font-medium">Volume: {volume}%</label>
      <Slider
        value={volume}
        min={0}
        max={100}
        step={1}
        onValueChange={setVolume}
      />
    </div>
  );
}`}
          language="tsx"
        />
      </section>

      {/* 4. Examples & States */}
      <section id="states" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Examples & States
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Visual matrix of common slider configurations and interactive states.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="flex flex-col gap-3 p-5">
            <span className="text-xs font-medium text-foreground">Default Continuous Slider</span>
            <span className="text-xs text-muted-foreground">Smooth continuous 0 to 100 with unit step</span>
            <div className="pt-2">
              <Slider defaultValue={45} min={0} max={100} step={1} />
            </div>
          </Card>

          <Card className="flex flex-col gap-3 p-5">
            <span className="text-xs font-medium text-foreground">Stepped Increments (step=25)</span>
            <span className="text-xs text-muted-foreground">Quantized stops for discrete selection</span>
            <div className="pt-2">
              <Slider defaultValue={50} min={0} max={100} step={25} />
            </div>
          </Card>

          <Card className="flex flex-col gap-3 p-5">
            <span className="text-xs font-medium text-foreground">Disabled State</span>
            <span className="text-xs text-muted-foreground">Non-interactive with 50% opacity for locked values</span>
            <div className="pt-2">
              <Slider disabled defaultValue={60} min={0} max={100} />
            </div>
          </Card>

          <Card className="flex flex-col gap-3 p-5">
            <span className="text-xs font-medium text-foreground">Custom Range (20 to 80)</span>
            <span className="text-xs text-muted-foreground">Bounded custom min and max values</span>
            <div className="pt-2">
              <Slider defaultValue={50} min={20} max={80} step={5} />
            </div>
          </Card>
        </div>
      </section>

      {/* 5. Props Reference */}
      <section id="props" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Props Reference
        </h2>
        <PropsTable
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
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: 'When true, prevents user interaction and applies muted opacity.',
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
      </section>
    </DocLayout>
  );
}
