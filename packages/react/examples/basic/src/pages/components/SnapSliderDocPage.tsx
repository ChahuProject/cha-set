import React, { useState } from 'react';
import { SnapSlider, Card, CodeBlock, Button, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentReference } from '../../components/ComponentReference';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';
import { PropsTable } from '../../components/PropsTable';

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
        <h2 className="text-xl font-semibold text-foreground">{t('showcase.interactiveOverview', 'Interactive Overview')}</h2>
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
        <h2 className="text-xl font-semibold text-foreground">{t('showcase.animations', 'Animations')}</h2>
        <p className="text-sm text-muted-foreground">
          {t('formsA.snapSlider.animationsDesc', 'Motion tokens and kinematic timing contracts for SnapSlider interaction.')}
        </p>
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

      <section id="keyboard" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">{t('showcase.keyboardNavigation', 'Keyboard Navigation')}</h2>
        <p className="text-sm text-muted-foreground">
          {t('desktopComposite.snapSlider.keyboardDesc', 'Keyboard shortcuts and discrete step navigation patterns.')}
        </p>
        <KeyboardShortcutsTable componentId="snap-slider" />
      </section>

      <section id="props" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">{t('showcase.propsReference', 'Props Reference')}</h2>
        <PropsTable
          items={[
            {
              name: 'value',
              type: 'number',
              default: '0',
              description: t('components.snapSlider.valueDesc', 'Controlled current snap stop index.'),
            },
            {
              name: 'defaultValue',
              type: 'number',
              default: '0',
              description: t('components.snapSlider.defaultValueDesc', 'Default initial snap stop index in uncontrolled mode.'),
            },
            {
              name: 'count',
              type: 'number',
              default: '5',
              description: t('components.snapSlider.countDesc', 'Total number of discrete stops (defaults to labels.length if provided).'),
            },
            {
              name: 'labels',
              type: 'string[]',
              default: '[]',
              description: t('components.snapSlider.labelsDesc', 'Array of labels for each stop shown at the active center position.'),
            },
            {
              name: 'leftLabel',
              type: 'string',
              default: '""',
              description: t('components.snapSlider.leftLabelDesc', 'Boundary label on the bottom-left edge.'),
            },
            {
              name: 'rightLabel',
              type: 'string',
              default: '""',
              description: t('components.snapSlider.rightLabelDesc', 'Boundary label on the bottom-right edge.'),
            },
            {
              name: 'showTicks',
              type: 'boolean',
              default: 'true',
              description: t('components.snapSlider.showTicksDesc', 'Whether to display tick marks on the slider track.'),
            },
            {
              name: 'size',
              type: '"default" | "sm"',
              default: '"default"',
              description: t('components.snapSlider.sizeDesc', 'Visual sizing variant.'),
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: t('components.snapSlider.disabledDesc', 'Whether the slider is disabled.'),
            },
            {
              name: 'readOnly',
              type: 'boolean',
              default: 'false',
              description: t('components.snapSlider.readOnlyDesc', 'Whether the slider is read-only.'),
            },
            {
              name: 'onChange',
              type: '(index: number) => void',
              default: 'undefined',
              description: t('components.snapSlider.onChangeDesc', 'Callback fired when the selected stop index changes.'),
            },
          ]}
        />
      </section>
    </DocLayout>
  );
}
