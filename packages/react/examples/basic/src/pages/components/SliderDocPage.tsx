import React, { useState } from 'react';
import {
  Slider,
  type SliderOrientation,
  type SliderSize,
  SegmentedControl,
  Checkbox,
  Card,
  useChaSetI18n,
} from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { DocMarkdown } from '../../components/DocMarkdown';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { DocText } from '../../components/DocText';

export function SliderDocPage() {
  const { t } = useChaSetI18n();

  // Mode: single, range, snap
  const [mode, setMode] = useState<'single' | 'range' | 'snap'>('single');

  // Single slider state
  const [singleValue, setSingleValue] = useState(50);
  const [committedSingle, setCommittedSingle] = useState(50);

  // Range slider state
  const [rangeValue, setRangeValue] = useState<[number, number]>([25, 75]);
  const [committedRange, setCommittedRange] = useState<[number, number]>([25, 75]);

  // Snap slider state
  const [snapIndex, setSnapIndex] = useState(2);
  const [committedSnap, setCommittedSnap] = useState(2);
  const snapLabels = ['0.5x', '1.0x', '1.5x', '2.0x', '3.0x'];

  // Controls state
  const [step, setStep] = useState(1);
  const [min] = useState(0);
  const [max] = useState(100);
  const [size, setSize] = useState<SliderSize>('default');
  const [orientation, setOrientation] = useState<SliderOrientation>('horizontal');
  const [commitOnRelease, setCommitOnRelease] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [showTicks, setShowTicks] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

  // Commit demo card states
  const [cardCommitLive, setCardCommitLive] = useState(60);
  const [cardCommitted, setCardCommitted] = useState(60);

  const heroReactCode = mode === 'range'
    ? `<div className="w-full max-w-md flex flex-col gap-2">
  <div className="flex justify-between text-xs text-muted-foreground">
    <span>${commitOnRelease ? 'Live Drag' : 'Range'}</span>
    <span className="font-mono font-medium text-foreground">
      ${commitOnRelease ? `[${rangeValue[0]}, ${rangeValue[1]}]` : `[${rangeValue[0]}, ${rangeValue[1]}]`}
    </span>
    ${commitOnRelease ? `<span className="text-muted-foreground">Committed: <strong className="font-mono text-foreground">[${committedRange[0]}, ${committedRange[1]}]</strong></span>` : ''}
  </div>
  <Slider
    range
    value={[${rangeValue[0]}, ${rangeValue[1]}]}
    min={${min}}
    max={${max}}
    step={${step}}
    size="${size}"
    commitOnRelease={${commitOnRelease}}
    disabled={${disabled}}
    readOnly={${readOnly}}
    showTooltip={${showTooltip}}
    showTicks={${showTicks}}
    orientation="${orientation}"
    onValueChange={(val) => setRangeValue(val)}
    onValueCommit={(val) => setCommittedRange(val)}
  />
</div>`
    : mode === 'snap'
    ? `<div className="w-full max-w-md flex flex-col gap-2">
  <Slider
    count={5}
    value={${snapIndex}}
    labels={['0.5x', '1.0x', '1.5x', '2.0x', '3.0x']}
    leftLabel="${t('formsA.snapSlider.slow', 'Slow')}"
    rightLabel="${t('formsA.snapSlider.fast', 'Fast')}"
    showTicks
    size="${size}"
    commitOnRelease={${commitOnRelease}}
    disabled={${disabled}}
    readOnly={${readOnly}}
    onValueChange={setSnapIndex}
  />
</div>`
    : `<div className="w-full max-w-md flex flex-col gap-2">
  <div className="flex justify-between text-xs text-muted-foreground">
    <span>${commitOnRelease ? 'Live Drag' : 'Value'}</span>
    <span className="font-mono font-medium text-foreground">${singleValue}</span>
    ${commitOnRelease ? `<span className="text-muted-foreground">Committed: <strong className="font-mono text-foreground">${committedSingle}</strong></span>` : ''}
  </div>
  <Slider
    value={${singleValue}}
    min={${min}}
    max={${max}}
    step={${step}}
    size="${size}"
    commitOnRelease={${commitOnRelease}}
    disabled={${disabled}}
    readOnly={${readOnly}}
    showTooltip={${showTooltip}}
    showTicks={${showTicks}}
    orientation="${orientation}"
    onValueChange={setSingleValue}
    onValueCommit={setCommittedSingle}
  />
</div>`;

  const heroQtCode = mode === 'range'
    ? `ChaSetSlider {
    width: 420
    range: true
    firstValue: ${rangeValue[0]}
    secondValue: ${rangeValue[1]}
    min: ${min}
    max: ${max}
    step: ${step}
    size: "${size}"
    commitOnRelease: ${commitOnRelease}
    disabled: ${disabled}
    readOnly: ${readOnly}
    showTooltip: ${showTooltip}
    showTicks: ${showTicks}
    orientation: "${orientation}"
    onValuesChanged: function(low, high) {
        // live or committed range update
    }
    onValuesCommitted: function(low, high) {
        // release commit
    }
}`
    : mode === 'snap'
    ? `ChaSetSlider {
    width: 420
    count: 5
    value: ${snapIndex}
    labels: ["0.5x", "1.0x", "1.5x", "2.0x", "3.0x"]
    leftLabel: "${t('formsA.snapSlider.slow', 'Slow')}"
    rightLabel: "${t('formsA.snapSlider.fast', 'Fast')}"
    showTicks: true
    size: "${size}"
    commitOnRelease: ${commitOnRelease}
    disabled: ${disabled}
    readOnly: ${readOnly}
    onValueMoved: function(idx) {
        // snapped index moved
    }
}`
    : `ChaSetSlider {
    width: 420
    value: ${singleValue}
    min: ${min}
    max: ${max}
    step: ${step}
    size: "${size}"
    commitOnRelease: ${commitOnRelease}
    disabled: ${disabled}
    readOnly: ${readOnly}
    showTooltip: ${showTooltip}
    showTicks: ${showTicks}
    orientation: "${orientation}"
    onValueMoved: function(val) {
        // slider value update
    }
    onValueCommitted: function(val) {
        // committed on release
    }
}`;

  return (
    <DocLayout
      category="Forms & Inputs"
      title="Slider"
      description={t(
        'components.slider.description',
        'An interactive control for selecting single numeric values, min-max ranges, or discrete presets along a track.',
      )}
    >
      {/* 1. Interactive Sandbox Preview */}
      <section id="overview" className="scroll-mt-20">
        <DocText role="h2" className="mb-3">
          {t('showcase.interactiveOverview', 'Interactive Overview')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t(
            'formsA.slider.overviewDesc',
            'Explore interactive slider behaviors, sizes, steps, orientations, tooltips, and states across Web and Qt Desktop.',
          )}
        </DocText>

        <ComponentPreview
          title={t('desktopComposite.slider.sandboxTitle', 'Slider Sandbox')}
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-6">
              {/* Mode selector */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs font-medium">
                  {t('formsA.slider.modeLabel', 'Mode:')}
                </span>
                <SegmentedControl
                  size="sm"
                  value={mode}
                  onChange={(v) => setMode(v as 'single' | 'range' | 'snap')}
                  options={[
                    { label: t('formsA.slider.modeSingle', 'Single'), value: 'single' },
                    { label: t('formsA.slider.modeRange', 'Range'), value: 'range' },
                    { label: t('formsA.slider.modeSnap', 'Snap'), value: 'snap' },
                  ]}
                />
              </div>

              {/* Size selector */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs font-medium">
                  {t('showcase.size', 'Size:')}
                </span>
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

              {/* Orientation selector */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs font-medium">
                  {t('formsA.slider.orientationLabel', 'Orientation:')}
                </span>
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

              {/* Step selector */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs font-medium">
                  {t('formsA.slider.stepLabel', 'Step:')}
                </span>
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

              {/* Commit on Release toggle */}
              <Checkbox
                size="sm"
                checked={commitOnRelease}
                onCheckedChange={(val) => setCommitOnRelease(Boolean(val))}
                label={t('formsA.slider.commitOnRelease', 'Commit on Release')}
              />

              {/* Other Toggles */}
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

              <Checkbox
                size="sm"
                checked={readOnly}
                onCheckedChange={(val) => setReadOnly(Boolean(val))}
                label={t('formsA.slider.readOnly', 'Read-Only')}
              />

              <Checkbox
                size="sm"
                checked={disabled}
                onCheckedChange={(val) => setDisabled(Boolean(val))}
                label={t('common.disabled', 'Disabled')}
              />
            </div>
          }
        >
          <div className="w-full flex items-center justify-center p-8">
            <div
              className={
                orientation === 'horizontal'
                  ? 'w-full max-w-md flex flex-col gap-3'
                  : 'h-52 flex flex-col items-center justify-center'
              }
            >
              {/* Telemetry Header */}
              {orientation === 'horizontal' && (
                <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                  {mode === 'range' ? (
                    <>
                      <span>
                        {t('formsA.slider.rangeLabel', 'Range: {{min}} - {{max}}', {
                          min: rangeValue[0],
                          max: rangeValue[1],
                        })}
                      </span>
                      {commitOnRelease && (
                        <span>
                          {t('formsA.slider.committed', 'Committed: {{value}}', {
                            value: `[${committedRange[0]}, ${committedRange[1]}]`,
                          })}
                        </span>
                      )}
                    </>
                  ) : mode === 'snap' ? (
                    <>
                      <span>
                        {t('formsA.snapSlider.presetLabel', 'Preset:')}{' '}
                        <strong className="text-foreground">{snapLabels[snapIndex]}</strong>
                      </span>
                      {commitOnRelease && (
                        <span>
                          {t('formsA.slider.committed', 'Committed: {{value}}', {
                            value: snapLabels[committedSnap] ?? '',
                          })}
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <span>
                        {commitOnRelease
                          ? t('formsA.slider.liveDrag', 'Live Drag: {{value}}', {
                              value: singleValue,
                            })
                          : t('formsA.slider.valueLabel', 'Value:')}
                      </span>
                      {commitOnRelease ? (
                        <span className="font-mono text-foreground font-semibold">
                          {t('formsA.slider.committed', 'Committed: {{value}}', {
                            value: committedSingle,
                          })}
                        </span>
                      ) : (
                        <span className="font-mono font-medium text-foreground">{singleValue}</span>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Slider Instance */}
              {mode === 'range' ? (
                <Slider
                  range
                  value={rangeValue}
                  min={min}
                  max={max}
                  step={step}
                  size={size}
                  orientation={orientation}
                  commitOnRelease={commitOnRelease}
                  disabled={disabled}
                  readOnly={readOnly}
                  showTooltip={showTooltip}
                  showTicks={showTicks}
                  onValueChange={(val: [number, number]) => setRangeValue(val)}
                  onValueCommit={(val: [number, number]) => setCommittedRange(val)}
                />
              ) : mode === 'snap' ? (
                <Slider
                  count={5}
                  value={snapIndex}
                  labels={snapLabels}
                  leftLabel={t('formsA.snapSlider.slow', 'Slow')}
                  rightLabel={t('formsA.snapSlider.fast', 'Fast')}
                  showTicks={showTicks || true}
                  size={size}
                  orientation={orientation}
                  commitOnRelease={commitOnRelease}
                  disabled={disabled}
                  readOnly={readOnly}
                  onValueChange={(val: number) => setSnapIndex(val)}
                  onValueCommit={(val: number) => setCommittedSnap(val)}
                />
              ) : (
                <Slider
                  value={singleValue}
                  min={min}
                  max={max}
                  step={step}
                  size={size}
                  orientation={orientation}
                  commitOnRelease={commitOnRelease}
                  disabled={disabled}
                  readOnly={readOnly}
                  showTooltip={showTooltip}
                  showTicks={showTicks}
                  onValueChange={(val: number) => setSingleValue(val)}
                  onValueCommit={(val: number) => setCommittedSingle(val)}
                />
              )}

              {orientation === 'vertical' && (
                <span className="font-mono text-xs font-medium text-foreground mt-2">
                  {mode === 'range'
                    ? `${rangeValue[0]} - ${rangeValue[1]}`
                    : mode === 'snap'
                    ? snapLabels[snapIndex]
                    : singleValue}
                </span>
              )}
            </div>
          </div>
        </ComponentPreview>
      </section>

      {/* 2. Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { Slider } from '@chahu/cha-set';

// Single Value Slider
<Slider value={50} min={0} max={100} step={1} showTooltip onValueChange={setValue} />

// Range Interval Slider
<Slider range value={[20, 80]} min={0} max={100} onValueChange={setRange} />

// Snap Preset Slider
<Slider count={5} labels={['1x', '2x', '3x', '4x', '5x']} showTicks />`}
        qtCode={`import ChaSet

// Single Value Slider
ChaSetSlider {
    width: 320
    value: 50
    min: 0
    max: 100
    step: 1
    showTooltip: true
    onValueMoved: volume = value
}

// Range Interval Slider
ChaSetSlider {
    width: 320
    range: true
    firstValue: 20
    secondValue: 80
    onValuesChanged: function(low, high) { /* ... */ }
}`}
      />

      {/* 3. Examples & States */}
      <section id="states" className="scroll-mt-20 my-10">
        <DocText role="h2" className="mb-3">
          {t('desktopComposite.slider.examplesTitle', 'Examples & States')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t(
            'formsA.slider.examplesSubtitle',
            'Visual matrix of common slider configurations, size scales, tooltips, and interactive states.',
          )}
        </DocText>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Floating Value Tooltip */}
          <Card className="flex flex-col gap-3 p-5">
            <span className="text-xs font-medium text-foreground">
              {t('formsA.slider.floatingTooltipTitle', 'Floating Value Tooltip')}
            </span>
            <span className="text-xs text-muted-foreground">
              {t(
                'formsA.slider.floatingTooltipDesc',
                'Interactive formatted indicator on thumb drag and hover',
              )}
            </span>
            <div className="pt-6 pb-2">
              <Slider defaultValue={75} showTooltip formatValue={(v) => `${v}%`} />
            </div>
          </Card>

          {/* 2. Commit on Release (拖动撒手生效) */}
          <Card className="flex flex-col gap-3 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground">
                {t('formsA.slider.commitOnReleaseTitle', 'Commit on Release')}
              </span>
              <span className="font-mono text-xs text-primary font-semibold">
                {t('formsA.slider.committed', 'Committed: {{value}}', { value: cardCommitted })}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {t(
                'formsA.slider.commitOnReleaseDesc',
                'Dragging updates live feedback while values only commit upon pointer release',
              )}
            </span>
            <div className="pt-4 pb-2">
              <div className="text-micro text-muted-foreground mb-2">
                {t('formsA.slider.liveDrag', 'Live Drag: {{value}}', { value: cardCommitLive })}
              </div>
              <Slider
                commitOnRelease
                defaultValue={60}
                showTooltip
                onValueChange={(val) => setCardCommitLive(val as number)}
                onValueCommit={(val) => setCardCommitted(val as number)}
              />
            </div>
          </Card>

          {/* 3. Dual-Thumb Range Slider */}
          <Card className="flex flex-col gap-3 p-5">
            <span className="text-xs font-medium text-foreground">
              {t('formsA.slider.rangeTitle', 'Dual-Thumb Range Slider')}
            </span>
            <span className="text-xs text-muted-foreground">
              {t(
                'formsA.slider.rangeDesc',
                'Select min-max numerical intervals with collision prevention and active span fill',
              )}
            </span>
            <div className="pt-6 pb-2">
              <Slider range defaultValue={[20, 80]} showTooltip minStepsBetweenThumbs={5} />
            </div>
          </Card>

          {/* 4. Discrete Snap Slider with Presets */}
          <Card className="flex flex-col gap-3 p-5">
            <span className="text-xs font-medium text-foreground">
              {t('formsA.slider.snapTitle', 'Discrete Snap Slider with Presets')}
            </span>
            <span className="text-xs text-muted-foreground">
              {t(
                'formsA.slider.snapDesc',
                'Snap to discrete stops with preset labels and step marks',
              )}
            </span>
            <div className="pt-2 pb-2">
              <Slider
                count={5}
                defaultValue={1}
                labels={['0.5x', '1.0x', '1.5x', '2.0x', '3.0x']}
                leftLabel={t('formsA.snapSlider.slow', 'Slow')}
                rightLabel={t('formsA.snapSlider.fast', 'Fast')}
                showTicks
              />
            </div>
          </Card>

          {/* 5. Compact Size (sm) */}
          <Card className="flex flex-col gap-3 p-5">
            <span className="text-xs font-medium text-foreground">
              {t('formsA.slider.compactTitle', 'Compact Size (sm)')}
            </span>
            <span className="text-xs text-muted-foreground">
              {t('formsA.slider.compactDesc', 'Reduced track thickness and thumb size for toolbars')}
            </span>
            <div className="pt-6 pb-2">
              <Slider size="sm" defaultValue={40} />
            </div>
          </Card>

          {/* 6. Discrete Stops with Ticks */}
          <Card className="flex flex-col gap-3 p-5">
            <span className="text-xs font-medium text-foreground">
              {t('formsA.slider.ticksTitle', 'Discrete Stops with Ticks')}
            </span>
            <span className="text-xs text-muted-foreground">
              {t(
                'formsA.slider.ticksDesc',
                'Quantized stops with tick indicators and label marks',
              )}
            </span>
            <div className="pt-6 pb-4">
              <Slider
                defaultValue={50}
                min={0}
                max={100}
                step={25}
                showTicks
                marks={['0%', '25%', '50%', '75%', '100%']}
              />
            </div>
          </Card>

          {/* 7. Read-Only State */}
          <Card className="flex flex-col gap-3 p-5">
            <span className="text-xs font-medium text-foreground">
              {t('formsA.slider.readOnlyTitle', 'Read-Only State')}
            </span>
            <span className="text-xs text-muted-foreground">
              {t('formsA.slider.readOnlyDesc', 'Locked value without dimmed 50% opacity')}
            </span>
            <div className="pt-6 pb-2">
              <Slider readOnly defaultValue={60} />
            </div>
          </Card>

          {/* 8. Disabled State */}
          <Card className="flex flex-col gap-3 p-5">
            <span className="text-xs font-medium text-foreground">
              {t('formsA.slider.disabledTitle', 'Disabled State')}
            </span>
            <span className="text-xs text-muted-foreground">
              {t(
                'formsA.slider.disabledDesc',
                'Non-interactive with dimmed opacity for disabled controls',
              )}
            </span>
            <div className="pt-6 pb-2">
              <Slider disabled defaultValue={45} min={0} max={100} />
            </div>
          </Card>
        </div>
      </section>

      {/* 4. Keyboard Navigation */}
      <DocMarkdown id="slider" section="keyboard" />

      {/* 5. Props Reference */}
      <DocMarkdown id="slider" section="props" />
    </DocLayout>
  );
}
