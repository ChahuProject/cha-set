import React, { useState } from 'react';
import { RangeSlider, Card } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';

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
        { id: 'installation', title: 'Installation' },
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
            />
          </div>
        </ComponentPreview>
      </section>

      <section id="installation" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Installation
        </h2>
        <CodeBlock code="pnpm add @chahu/cha-set" language="bash" />
      </section>

      <section id="props" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Props Reference
        </h2>
        <PropsTable
          props={[
            { name: 'value', type: '[number, number]', default: '[0, 100]', description: 'Current [min, max] interval value.' },
            { name: 'onValueChange', type: '(val: [number, number]) => void', default: 'undefined', description: 'Callback fired on thumb move.' },
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
