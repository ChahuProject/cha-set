import React, { useState } from 'react';
import { DurationInput, CodeBlock } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function DurationInputDocPage() {
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
    return `${h}h ${m}m ${sec}s (${s}s total)`;
  };

  return (
    <DocLayout
      category="Interactive Controls"
      title="Duration Input"
      description="Segmented duration input control for hours, minutes, and seconds with stepper buttons, mouse wheel adjustments, keyboard arrow jumping, and preset menu."
      tocItems={[
        { id: 'overview', title: 'Interactive Overview' },
        { id: 'variants', title: 'Variants & Configurations' },
        { id: 'installation', title: 'Installation' },
        { id: 'keyboard', title: 'Keyboard Navigation' },
        { id: 'props', title: 'Props Reference' },
      ]}
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Interactive Overview
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Directly type into any segment or use the up/down stepper buttons. Press Left/Right arrow keys to jump between segments, or pick from grouped quick-select presets.
        </p>

        <ComponentPreview title="Duration Input Sandbox" reactCode={reactCode}>
          <div className="w-full max-w-sm flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Timer Duration</label>
              <DurationInput
                value={value}
                onChange={setValue}
              />
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              Formatted: <strong className="text-foreground">{formatHuman(value)}</strong>
            </div>
          </div>
        </ComponentPreview>
      </section>

      <section id="variants" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Variants & Configurations
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Supports compact and comfortable sizes, disabling presets or labels, and disabled states.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-lg border border-border bg-card flex flex-col gap-2">
            <span className="text-xs font-semibold text-foreground">Compact Size (sm)</span>
            <DurationInput
              size="sm"
              value={smValue}
              onChange={setSmValue}
            />
          </div>

          <div className="p-4 rounded-lg border border-border bg-card flex flex-col gap-2">
            <span className="text-xs font-semibold text-foreground">Large Size (lg)</span>
            <DurationInput
              size="lg"
              value={lgValue}
              onChange={setLgValue}
            />
          </div>

          <div className="p-4 rounded-lg border border-border bg-card flex flex-col gap-2">
            <span className="text-xs font-semibold text-foreground">Disabled State</span>
            <DurationInput
              value={900}
              disabled
            />
          </div>
        </div>
      </section>

      <section id="installation" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Installation
        </h2>
        <CodeBlock code="pnpm add @chahu/cha-set" language="bash" />
      </section>

      <section id="keyboard" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Keyboard Navigation
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Keyboard shortcuts and interaction patterns for time segment editing.
        </p>
        <KeyboardShortcutsTable componentId="duration-input" />
      </section>

      <section id="props" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Props Reference
        </h2>
        <PropsTable
          props={[
            { name: 'value', type: 'number', default: '0', description: 'Total duration in seconds (controlled mode).' },
            { name: 'defaultValue', type: 'number', default: '0', description: 'Initial duration in seconds (uncontrolled mode).' },
            { name: 'onChange', type: '(seconds: number) => void', default: 'undefined', description: 'Callback fired when the duration changes.' },
            { name: 'maxHours', type: 'number', default: '99', description: 'Upper clamp limit for the hours segment.' },
            { name: 'size', type: "'sm' | 'default' | 'lg'", default: "'default'", description: 'Visual density and size variant.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether the inputs, buttons, and preset dropdown are disabled.' },
            { name: 'showPresets', type: 'boolean', default: 'true', description: 'Whether to display the preset dropdown button.' },
            { name: 'showLabels', type: 'boolean', default: 'true', description: 'Whether to display the segment unit labels underneath.' },
            { name: 'presets', type: 'DurationPresetGroup[]', default: 'defaultDurationPresetGroups', description: 'Custom grouped duration presets for the dropdown.' },
            { name: 'hoursLabel', type: 'string', default: "'Hours'", description: 'Label text for hours segment.' },
            { name: 'minutesLabel', type: 'string', default: "'Minutes'", description: 'Label text for minutes segment.' },
            { name: 'secondsLabel', type: 'string', default: "'Seconds'", description: 'Label text for seconds segment.' },
            { name: 'presetsLabel', type: 'string', default: "'Presets'", description: 'Label text for the presets trigger button.' },
            { name: 'className', type: 'string', default: 'undefined', description: 'Custom CSS classes for outer container.' },
          ]}
        />
      </section>
    </DocLayout>
  );
}
