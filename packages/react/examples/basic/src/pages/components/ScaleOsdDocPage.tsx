import React, { useState } from 'react';
import { ScaleOsd, Card, CodeBlock, Button, Checkbox, Badge, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { DocMarkdown } from '../../components/DocMarkdown';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { DocText } from '../../components/DocText';

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
  debounceMs={500}
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
        <DocText role="h2">{t('desktopComposite.scaleOsd.overviewHeading', 'Interactive Overview')}</DocText>
        <ComponentPreview
          qtCode={`ChaSetScaleOsd {
    value: 1.0
    step: 0.1
    min: 0.2
    max: 3.0
    delayedCommit: ${delayedCommit}
    debounceDuration: 500
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
                debounceMs={500}
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



      <DocMarkdown id="scale-osd" section="animations" />

      <DocMarkdown id="scale-osd" section="keyboard" />

      <DocMarkdown id="scale-osd" section="props" />
    </DocLayout>
  );
}
