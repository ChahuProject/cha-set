import React, { useState } from 'react';
import { RangeSlider, Card, CodeBlock, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentReference } from '../../components/ComponentReference';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';

export function RangeSliderDocPage() {
  const { t } = useChaSetI18n();
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
      category="Forms & Inputs"
      title="Range Slider"
      description={t('components.rangeSlider.description', 'Dual-thumb slider for selecting numeric min-max intervals with collision prevention and keyboard accessibility.')}
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('desktopComposite.rangeSlider.overviewHeading', 'Interactive Overview')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('formsA.rangeSlider.overviewDesc', 'Drag either thumb to adjust minimum and maximum bounds.')}
        </p>

        <ComponentPreview
          qtCode={`ChaSetRangeSlider {
    from: 0
    to: 100
    firstValue: 20
    secondValue: 80
    showTooltip: true
    onValuesChanged: function(f, s) { console.log(f, s) }
}`} title={t('desktopComposite.rangeSlider.sandboxTitle', 'Range Slider Sandbox')} reactCode={reactCode}>
          <div className="w-full max-w-sm flex flex-col gap-4">
            <div className="flex justify-between text-xs text-muted-foreground font-mono">
              <span>{t('formsA.rangeSlider.minLabel', 'Min: {{value}}', { value: range[0] })}</span>
              <span>{t('formsA.rangeSlider.maxLabel', 'Max: {{value}}', { value: range[1] })}</span>
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

      {/* Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { RangeSlider } from '@chahu/cha-set';

<RangeSlider value={[20, 80]} min={0} max={100} onValueChange={(val) => console.log(val)} />`}
        qtCode={`import ChaSet

ChaSetRangeSlider {
    firstValue: 20
    secondValue: 80
    from: 0
    to: 100
}`}
      />



      <section id="variants" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('desktopComposite.rangeSlider.sizesStatesTitle', 'Sizes & States')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('formsA.rangeSlider.sizesAndStatesSubtitle', 'Available in default and sm sizing tiers, with tooltips, read-only, and disabled states.')}
        </p>

        <ComponentPreview
          qtCode={`ChaSetRangeSlider { size: "default"; firstValue: 20; secondValue: 80; showTooltip: true }
ChaSetRangeSlider { size: "sm"; firstValue: 30; secondValue: 70; showTooltip: true }
ChaSetRangeSlider { size: "sm"; firstValue: 25; secondValue: 75; readOnly: true }
ChaSetRangeSlider { size: "sm"; firstValue: 10; secondValue: 90; enabled: false }`}
          title={t('desktopComposite.rangeSlider.sizesStatesTitle', 'Sizes & States')}
          reactCode={`<RangeSlider size="default" defaultValue={[20, 80]} showTooltip />
<RangeSlider size="sm" defaultValue={[30, 70]} showTooltip />
<RangeSlider size="sm" defaultValue={[25, 75]} readOnly />
<RangeSlider size="sm" defaultValue={[10, 90]} disabled />`}
        >
          <div className="w-full max-w-sm flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground">{t('formsA.rangeSlider.defaultWithTooltips', 'Default with Tooltips')}</span>
              <RangeSlider size="default" defaultValue={[20, 80]} showTooltip />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground">{t('formsA.rangeSlider.compactSm', 'Compact sm Tier')}</span>
              <RangeSlider size="sm" defaultValue={[30, 70]} showTooltip />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground">{t('formsA.rangeSlider.readOnly', 'Read Only')}</span>
              <RangeSlider size="sm" defaultValue={[25, 75]} readOnly />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground">{t('formsA.rangeSlider.disabled', 'Disabled')}</span>
              <RangeSlider size="sm" defaultValue={[10, 90]} disabled />
            </div>
          </div>
        </ComponentPreview>
      </section>

            <ComponentReference
        name="RangeSlider"
        componentId="range-slider"
        props={[
            { name: 'value', type: '[number, number]', default: '[0, 100]', description: t('components.rangeSlider.valueDesc', 'Current [min, max] interval value.') },
            { name: 'onValueChange', type: '(val: [number, number]) => void', default: 'undefined', description: t('components.rangeSlider.onValueChangeDesc', 'Callback fired on thumb move.') },
            { name: 'onChange', type: '(val: [number, number]) => void', default: 'undefined', description: t('components.rangeSlider.onChangeDesc', 'Alias for onValueChange.') },
            { name: 'size', type: '"default" | "sm"', default: '"default"', description: t('components.rangeSlider.sizeDesc', 'Density and sizing variant.') },
            { name: 'showTooltip', type: 'boolean', default: 'false', description: t('components.rangeSlider.showTooltipDesc', 'Displays value tooltip bubble on hover, drag, and focus.') },
            { name: 'readOnly', type: 'boolean', default: 'false', description: t('components.rangeSlider.readOnlyDesc', 'Prevents user interaction while preserving contrast.') },
            { name: 'disabled', type: 'boolean', default: 'false', description: t('components.rangeSlider.disabledDesc', 'Disables slider interaction and dims opacity.') },
            { name: 'min', type: 'number', default: '0', description: t('components.rangeSlider.minDesc', 'Minimum allowed value.') },
            { name: 'max', type: 'number', default: '100', description: t('components.rangeSlider.maxDesc', 'Maximum allowed value.') },
            { name: 'step', type: 'number', default: '1', description: t('components.rangeSlider.stepDesc', 'Step increment.') },
            { name: 'minStepsBetweenThumbs', type: 'number', default: '0', description: t('components.rangeSlider.minGapDesc', 'Minimum gap between the two thumbs.') },
          ]}
      />
    </DocLayout>
  );
}
