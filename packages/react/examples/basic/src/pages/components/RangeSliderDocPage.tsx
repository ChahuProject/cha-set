import React, { useState } from 'react';
import { RangeSlider, Card, CodeBlock, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { DocMarkdown } from '../../components/DocMarkdown';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { DocText } from '../../components/DocText';

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
        <DocText role="h2" className="mb-3">
          {t('desktopComposite.rangeSlider.overviewHeading', 'Interactive Overview')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t('formsA.rangeSlider.overviewDesc', 'Drag either thumb to adjust minimum and maximum bounds.')}
        </DocText>

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
        <DocText role="h2" className="mb-3">
          {t('desktopComposite.rangeSlider.sizesStatesTitle', 'Sizes & States')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t('formsA.rangeSlider.sizesAndStatesSubtitle', 'Available in default and sm sizing tiers, with tooltips, read-only, and disabled states.')}
        </DocText>

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

                        <DocMarkdown id="range-slider" section="keyboard" />

            <DocMarkdown id="range-slider" section="props" />
    </DocLayout>
  );
}
