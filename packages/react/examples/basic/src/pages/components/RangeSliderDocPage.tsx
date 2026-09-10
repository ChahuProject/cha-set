import React, { useState } from 'react';
import { RangeSlider, Card } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function RangeSliderDocPage() {
  const [range, setRange] = useState<[number, number]>([20, 80]);

  const reactCode = `<RangeSlider
  min={0}
  max={100}
  step={1}
  value={range}
  onValueChange={setRange}
/>`;

  return (
    <DocLayout
      category="Interactive Controls"
      title="Range Slider"
      description="Dual-thumb slider for selecting numeric min-max intervals with collision prevention and keyboard accessibility."
      tocItems={[
        { id: 'overview', title: 'Interactive Overview' },
        { id: 'variants', title: 'Sizes & Tooltips' },
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
          Drag either thumb to adjust minimum and maximum bounds.
        </p>

        <ComponentPreview title="Range Slider Sandbox" reactCode={reactCode}>
          <div className="w-full max-w-sm flex flex-col gap-4">
            <div className="flex justify-between text-xs text-muted-foreground font-mono">
              <span>Min: {range[0]}</span>
              <span>Max: {range[1]}</span>
            </div>
            <RangeSlider
              min={0}
              max={100}
              step={1}
              value={range}
              onValueChange={setRange}
              showTooltip
            />
          </div>
        </ComponentPreview>
      </section>

      <section id="variants" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Sizes & States
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Available in default and sm sizing tiers, with tooltips, read-only, and disabled states.
        </p>

        <ComponentPreview
          title="Sizes & States Preview"
          reactCode={`<RangeSlider size="default" value={[20, 80]} showTooltip />
<RangeSlider size="sm" value={[30, 70]} showTooltip />
<RangeSlider size="sm" value={[25, 75]} readOnly />
<RangeSlider size="sm" value={[10, 90]} disabled />`}
        >
          <div className="w-full max-w-sm flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground">Default with Tooltips</span>
              <RangeSlider size="default" value={[20, 80]} showTooltip />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground">Compact sm Tier</span>
              <RangeSlider size="sm" value={[30, 70]} showTooltip />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground">Read Only</span>
              <RangeSlider size="sm" value={[25, 75]} readOnly />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground">Disabled</span>
              <RangeSlider size="sm" value={[10, 90]} disabled />
            </div>
          </div>
        </ComponentPreview>
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
        <KeyboardShortcutsTable componentId="range-slider" />
      </section>

      <section id="props" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Props Reference
        </h2>
        <PropsTable
          props={[
            { name: 'value', type: '[number, number]', default: '[0, 100]', description: 'Current [min, max] interval value.' },
            { name: 'onValueChange', type: '(val: [number, number]) => void', default: 'undefined', description: 'Callback fired on thumb move.' },
            { name: 'onChange', type: '(val: [number, number]) => void', default: 'undefined', description: 'Alias for onValueChange.' },
            { name: 'size', type: '"default" | "sm"', default: '"default"', description: 'Density and sizing variant.' },
            { name: 'showTooltip', type: 'boolean', default: 'false', description: 'Displays value tooltip bubble on hover, drag, and focus.' },
            { name: 'readOnly', type: 'boolean', default: 'false', description: 'Prevents user interaction while preserving contrast.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables slider interaction and dims opacity.' },
            { name: 'min', type: 'number', default: '0', description: 'Minimum allowed value.' },
            { name: 'max', type: 'number', default: '100', description: 'Maximum allowed value.' },
            { name: 'step', type: 'number', default: '1', description: 'Step increment.' },
            { name: 'minStepsBetweenThumbs', type: 'number', default: '0', description: 'Minimum gap between the two thumbs.' },
          ]}
        />
      </section>
    </DocLayout>
  );
}
