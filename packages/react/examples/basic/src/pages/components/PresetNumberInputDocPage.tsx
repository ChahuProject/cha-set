import React, { useState } from 'react';
import { PresetNumberInput } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function PresetNumberInputDocPage() {
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
      category="Interactive Controls"
      title="Preset Number Input"
      description="High-density numeric input field with a quick-select dropdown panel for common dimension presets, unit tags, and optional clear action."
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
          Focus or click the input field to open the preset numbers list. Click an item to populate the field, or type custom numbers freely.
        </p>

        <ComponentPreview title="Preset Number Input Sandbox" reactCode={reactCode}>
          <div className="w-full max-w-xs flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Texture Dimension (px)</label>
              <PresetNumberInput
                value={value}
                onChange={setValue}
                placeholder="Width / Height"
              />
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              Current value: <strong className="text-foreground">{value || '(empty)'}</strong>
            </div>
          </div>
        </ComponentPreview>
      </section>

      <section id="variants" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Variants & Configurations
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Configure custom numeric presets, disable the clear option, or place the control in disabled state.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-lg border border-border bg-card flex flex-col gap-2">
            <span className="text-xs font-semibold text-foreground">Custom Presets (Small)</span>
            <PresetNumberInput
              value={smallPresetValue}
              onChange={setSmallPresetValue}
              presets={[8, 16, 32, 64, 128]}
              clearLabel="Auto"
            />
          </div>

          <div className="p-4 rounded-lg border border-border bg-card flex flex-col gap-2">
            <span className="text-xs font-semibold text-foreground">Disallow Clear (Mandatory)</span>
            <PresetNumberInput
              value={noClearValue}
              onChange={setNoClearValue}
              allowClear={false}
            />
          </div>

          <div className="p-4 rounded-lg border border-border bg-card flex flex-col gap-2">
            <span className="text-xs font-semibold text-foreground">Disabled State</span>
            <PresetNumberInput
              value="2048"
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
          Keyboard shortcuts and interaction patterns for this component.
        </p>
        <KeyboardShortcutsTable componentId="preset-number-input" />
      </section>

      <section id="props" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Props Reference
        </h2>
        <PropsTable
          props={[
            { name: 'value', type: 'string', default: "''", description: 'Current numeric value of the input.' },
            { name: 'onChange', type: '(val: string) => void', default: 'undefined', description: 'Callback fired when the value changes.' },
            { name: 'presets', type: 'number[]', default: '[64, 128, 256, 512, 1024, 2048, 4096, 8192]', description: 'List of quick-select preset numbers.' },
            { name: 'placeholder', type: 'string', default: 'undefined', description: 'Placeholder text displayed when empty.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether typing and dropdown interactions are disabled.' },
            { name: 'allowClear', type: 'boolean', default: 'true', description: 'Whether to display the clear/reset option in dropdown.' },
            { name: 'clearLabel', type: 'string', default: "'None'", description: 'Label text for the clear option.' },
            { name: 'inputClassName', type: 'string', default: 'undefined', description: 'Custom CSS classes for the inner input.' },
            { name: 'className', type: 'string', default: 'undefined', description: 'Custom CSS classes for the outer container.' },
          ]}
        />
      </section>
    </DocLayout>
  );
}
