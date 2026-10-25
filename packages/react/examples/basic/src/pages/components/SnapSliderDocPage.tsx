import React, { useState } from 'react';
import { SnapSlider, Card, CodeBlock, Button, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { DocMarkdown } from '../../components/DocMarkdown';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { DocText } from '../../components/DocText';

export function SnapSliderDocPage() {
  const { t } = useChaSetI18n();
  const [value, setValue] = useState(1);
  const labels = ['0.5x', '1.0x', '1.5x', '2.0x', '3.0x'];

  const heroReactCode = `<SnapSlider
  count={5}
  labels={["0.5x", "1.0x", "1.5x", "2.0x", "3.0x"]}
  leftLabel="Slow"
  rightLabel="Fast"
  value={value}
  onChange={setValue}
/>`;

  return (
    <DocLayout
      category="Forms & Inputs"
      title="Snap Slider"
      description={t('components.snap-slider.description', 'Stepped discrete slider that snaps to defined stops with ticks and label row.')}
    >
      <section id="overview" className="space-y-4">
        <DocText role="h2">{t('showcase.interactiveOverview', 'Interactive Overview')}</DocText>
        <ComponentPreview
          qtCode={`ChaSetSnapSlider {
    count: 5
    labels: ["0.5x", "1.0x", "1.5x", "2.0x", "3.0x"]
    leftLabel: "Slow"
    rightLabel: "Fast"
    currentIndex: 1
    onIndexChanged: function(idx) { console.log(idx) }
}`}
          title={t('desktopComposite.snapSlider.sandboxTitle', 'Snap Slider Sandbox')}
          reactCode={heroReactCode}
          controls={
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="text-muted-foreground">{t('formsA.snapSlider.presetLabel', 'Preset:')}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setValue(0)}
              >
                {t('formsA.snapSlider.presetMin', '0.5x (Min)')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setValue(1)}
              >
                {t('formsA.snapSlider.presetNormal', '1.0x (Normal)')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setValue(4)}
              >
                {t('formsA.snapSlider.presetMax', '3.0x (Max)')}
              </Button>
            </div>
          }
        >
          <div className="w-full max-w-sm mx-auto py-6">
            <Card className="p-6 bg-card border">
              <SnapSlider
                count={5}
                labels={labels}
                leftLabel={t('formsA.snapSlider.slow', 'Slow')}
                rightLabel={t('formsA.snapSlider.fast', 'Fast')}
                value={value}
                onChange={setValue}
              />
            </Card>
          </div>
        </ComponentPreview>
      </section>

      {/* Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { SnapSlider } from '@chahu/cha-set';

<SnapSlider stops={[0, 25, 50, 75, 100]} value={50} onChange={(v) => console.log(v)} />`}
        qtCode={`import ChaSet

ChaSetSnapSlider {
    stops: [0, 25, 50, 75, 100]
    value: 50
}`}
      />



      <section id="animations" className="space-y-4 pt-6">
        <DocText role="h2">{t('showcase.animations', 'Animations')}</DocText>
        <DocText role="p">
          {t('formsA.snapSlider.animationsDesc', 'Motion tokens and kinematic timing contracts for SnapSlider interaction.')}
        </DocText>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground">
          <li>
            {t('desktopComposite.snapSlider.animationsBullet1', 'Thumb hover and scale micro-interactions animate smoothly over duration-quick (90ms) using ease-standard curve (Qt counterpart: ThemeTokens.motionQuick and ThemeTokens.easeStandard).')}
          </li>
          <li>
            {t('desktopComposite.snapSlider.animationsBullet2', 'Thumb drag kinematics track pointer position in 60fps real-time without un-damped lag.')}
          </li>
          <li>
            {t('desktopComposite.snapSlider.animationsBullet3', 'Respects prefers-reduced-motion on Web and ThemeTokens.animationsEnabled in Qt.')}
          </li>
        </ul>
      </section>

      <DocMarkdown id="snap-slider" section="keyboard" />

      <DocMarkdown id="snap-slider" section="props" />
    </DocLayout>
  );
}
