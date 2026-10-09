import React, { useState } from 'react';
import { ScaleOsd, Card, CodeBlock, Button, Checkbox, Badge, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentReference } from '../../components/ComponentReference';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';
import { PropsTable } from '../../components/PropsTable';

export function ScaleOsdDocPage() {
  const { t } = useChaSetI18n();
  const [scale, setScale] = useState(1.0);
  const [pendingScale, setPendingScale] = useState(1.0);
  const [visible, setVisible] = useState(true);
  const [delayedCommit, setDelayedCommit] = useState(true);
  const [autoHideEnabled, setAutoHideEnabled] = useState(true);

  const heroReactCode = `<ScaleOsd
  value={scale}
  step={0.1}
  min={0.2}
  max={3.0}
  visible={visible}
  contained={true}
  delayedCommit={${delayedCommit}}
  debounceMs={1500}
  autoHideDuration={${autoHideEnabled ? 2000 : 0}}
  onChange={setScale}
/>`;

  return (
    <DocLayout
      category="Overlays & Feedback"
      title="Scale OSD"
      description={t('components.scaleOsd.description', 'Floating on-screen display pill for canvas zoom and scale adjustments with auto-hide.')}
    >
      <section id="overview" className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">{t('desktopComposite.scaleOsd.overviewHeading', 'Interactive Overview')}</h2>
        <ComponentPreview
          qtCode={`ChaSetScaleOsd {
    value: 1.0
    step: 0.1
    min: 0.2
    max: 3.0
    delayedCommit: ${delayedCommit}
    debounceDuration: 1500
    autoHideDuration: ${autoHideEnabled ? 2000 : 0}
    onChangeCommitted: function(val) { console.log(val) }
}`}
          title={t('desktopComposite.scaleOsd.sandboxTitle', 'Scale OSD Sandbox')}
          reactCode={heroReactCode}
          controls={
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="text-muted-foreground">{t('overlays.scaleOsd.quickZoom', 'Quick Zoom:')}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setScale(0.5);
                  setPendingScale(0.5);
                  setVisible(true);
                }}
              >
                50%
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setScale(1.0);
                  setPendingScale(1.0);
                  setVisible(true);
                }}
              >
                100%
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setScale(2.0);
                  setPendingScale(2.0);
                  setVisible(true);
                }}
              >
                200%
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setVisible((v) => !v)}
              >
                {visible ? t('overlays.scaleOsd.hideOsd', 'Hide OSD') : t('overlays.scaleOsd.showOsd', 'Show OSD')}
              </Button>
              <Checkbox
                checked={delayedCommit}
                onCheckedChange={(checked) => setDelayedCommit(Boolean(checked))}
                label={t('overlays.scaleOsd.delayedCommitLabel', 'Delayed Commit (1.5s)')}
              />
              <Checkbox
                checked={autoHideEnabled}
                onCheckedChange={(checked) => setAutoHideEnabled(Boolean(checked))}
                label={t('overlays.scaleOsd.autoHideLabel', 'Auto-hide (2s)')}
              />
            </div>
          }
        >
          <div className="w-full max-w-md mx-auto py-12 flex flex-col items-center justify-center relative min-h-[16rem]">
            <Card className="w-full p-8 bg-card border flex flex-col items-center justify-center gap-4 relative overflow-hidden min-h-[16rem]">
              <div className="flex flex-col items-center gap-2 mb-2">
                <Badge
                  variant={delayedCommit && Math.abs(pendingScale - scale) > 0.001 ? "secondary" : "outline"}
                  className="tabular-nums"
                >
                  {delayedCommit && Math.abs(pendingScale - scale) > 0.001
                    ? t('overlays.scaleOsd.pendingStatus', 'Debouncing commit... (Pending: {{percent}}%)', { percent: Math.round(pendingScale * 100) })
                    : t('overlays.scaleOsd.appliedStatus', 'Applied: {{percent}}%', { percent: Math.round(scale * 100) })}
                </Badge>
              </div>
              <div
                className="w-24 h-24 rounded-lg bg-primary/20 border border-primary flex items-center justify-center text-xs font-semibold text-primary transition-transform duration-short ease-standard mb-8"
                style={{ transform: `scale(${scale})` }}
              >
                {t('overlays.scaleOsd.previewBox', 'Preview Box')}
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                {t('overlays.scaleOsd.hoverPauseHint', 'Hover over the floating OSD below to pause auto-hide countdown.')}
              </p>
              <ScaleOsd
                value={scale}
                step={0.1}
                min={0.2}
                max={3.0}
                visible={visible}
                contained={true}
                delayedCommit={delayedCommit}
                debounceMs={1500}
                autoHideDuration={autoHideEnabled ? 2000 : 0}
                placement="bottom-center"
                onImmediateChange={(val) => setPendingScale(val)}
                onChange={(val) => {
                  setScale(val);
                  setPendingScale(val);
                }}
                onVisibilityChange={setVisible}
              />
            </Card>
          </div>
        </ComponentPreview>
      </section>

      {/* Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { ScaleOsd } from '@chahu/cha-set';

<ScaleOsd scale={100} onZoomIn={() => {}} onZoomOut={() => {}} onReset={() => {}} />`}
        qtCode={`import ChaSet

ChaSetScaleOsd {
    scale: 100
}`}
      />



      <section id="animations" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">{t('showcase.animations', 'Animations')}</h2>
        <p className="text-sm text-muted-foreground">
          {t('desktopComposite.scaleOsd.animationsDesc', 'OSD enter and exit transitions run over duration-short (120ms) with the ease-standard curve (Qt: ThemeTokens.motionShort / ThemeTokens.easeStandard). The 1400ms auto-hide countdown pauses deterministically on hover.')}
        </p>
      </section>

      <section id="keyboard" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">{t('showcase.keyboardNavigation', 'Keyboard Navigation')}</h2>
        <p className="text-sm text-muted-foreground">
          {t('showcase.keyboardDesc', 'Keyboard shortcuts and interaction patterns for this component.')}
        </p>
        <KeyboardShortcutsTable componentId="scale-osd" />
      </section>

      <section id="props" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">{t('showcase.propsReference', 'Props Reference')}</h2>
        <PropsTable
          items={[
            {
              name: 'value',
              type: 'number',
              default: '1.0',
              description: t('components.scaleOsd.valueDesc', 'Current scale ratio (e.g. 1.0 represents 100%).'),
            },
            {
              name: 'defaultValue',
              type: 'number',
              default: '1.0',
              description: t('components.scaleOsd.defaultValueDesc', 'Initial scale ratio in uncontrolled mode.'),
            },
            {
              name: 'step',
              type: 'number',
              default: '0.1',
              description: t('components.scaleOsd.stepDesc', 'Step increment applied on +/- button click.'),
            },
            {
              name: 'min',
              type: 'number',
              default: '0.2',
              description: t('components.scaleOsd.minDesc', 'Minimum allowed zoom scale ratio.'),
            },
            {
              name: 'max',
              type: 'number',
              default: '3.0',
              description: t('components.scaleOsd.maxDesc', 'Maximum allowed zoom scale ratio.'),
            },
            {
              name: 'steps',
              type: 'number[]',
              default: 'undefined',
              description: t('components.scaleOsd.stepsDesc', 'Discrete scale steps array (e.g. CANONICAL_SCALE_STEPS).'),
            },
            {
              name: 'size',
              type: '"default" | "lg"',
              default: '"default"',
              description: t('components.scaleOsd.sizeDesc', 'Visual scale variant (desktop launcher 42px or standard 40px).'),
            },
            {
              name: 'ignoreUiScale',
              type: 'boolean',
              default: 'true',
              description: t('components.scaleOsd.ignoreUiScaleDesc', 'Locks physical pixel size and renders invariant regardless of interface scaling.'),
            },
            {
              name: 'visible',
              type: 'boolean',
              default: 'undefined',
              description: t('components.scaleOsd.visibleDesc', 'Controlled visibility state.'),
            },
            {
              name: 'autoHideDuration',
              type: 'number',
              default: '1400',
              description: t('components.scaleOsd.autoHideDurationDesc', 'Duration in ms before auto-hiding (pauses on hover).'),
            },
            {
              name: 'showControls',
              type: 'boolean',
              default: 'true',
              description: t('components.scaleOsd.showControlsDesc', 'Whether to display +/- and reset buttons.'),
            },
            {
              name: 'showTooltips',
              type: 'boolean',
              default: 'true',
              description: t('components.scaleOsd.showTooltipsDesc', 'Whether to display hover tooltip hints for control buttons.'),
            },
            {
              name: 'placement',
              type: '"bottom-center" | "top-center" | "bottom-right" | "top-right"',
              default: '"bottom-center"',
              description: t('components.scaleOsd.placementDesc', 'Fixed viewport anchor position.'),
            },
            {
              name: 'contained',
              type: 'boolean',
              default: 'false',
              description: t('components.scaleOsd.containedDesc', 'Whether to position OSD absolutely within its parent container instead of fixed to the global viewport.'),
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: t('components.scaleOsd.disabledDesc', 'Disables all controls and user interaction.'),
            },
            {
              name: 'delayedCommit',
              type: 'boolean',
              default: 'false',
              description: t('components.scaleOsd.delayedCommitDesc', 'Whether to enable debounced delayed commit, firing callbacks only after user interaction pauses.'),
            },
            {
              name: 'debounceMs',
              type: 'number',
              default: '1500',
              description: t('components.scaleOsd.debounceMsDesc', 'Debounce delay in milliseconds before committing when delayedCommit is enabled.'),
            },
            {
              name: 'onChange',
              type: '(value: number) => void',
              default: 'undefined',
              description: t('components.scaleOsd.onChangeDesc', 'Callback fired when scale value changes.'),
            },
            {
              name: 'onImmediateChange',
              type: '(value: number) => void',
              default: 'undefined',
              description: t('components.scaleOsd.onImmediateChangeDesc', 'Callback fired immediately during adjustments before debounced commit.'),
            },
            {
              name: 'onCommit',
              type: '(value: number) => void',
              default: 'undefined',
              description: t('components.scaleOsd.onCommitDesc', 'Callback fired when the debounced scale change is committed.'),
            },
            {
              name: 'onStep',
              type: '(delta: number) => void',
              default: 'undefined',
              description: t('components.scaleOsd.onStepDesc', 'Callback fired on step adjustments.'),
            },
            {
              name: 'onReset',
              type: '() => void',
              default: 'undefined',
              description: t('components.scaleOsd.onResetDesc', 'Callback fired when resetting to 100%.'),
            },
          ]}
        />
      </section>
    </DocLayout>
  );
}
