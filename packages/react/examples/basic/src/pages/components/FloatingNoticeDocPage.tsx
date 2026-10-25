import React, { useState } from 'react';
import {
  FloatingNotice,
  type FloatingNoticeItem,
  type FloatingNoticeLevel,
  type FloatingNoticePlacement,
  Button,
  SegmentedControl,
  useChaSetI18n,
} from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { DocMarkdown } from '../../components/DocMarkdown';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { DocText } from '../../components/DocText';

export function FloatingNoticeDocPage() {
  const { t } = useChaSetI18n();

  const [placement, setPlacement] = useState<FloatingNoticePlacement>('top');
  const [gapMode, setGapMode] = useState<string>('auto');
  const selectedGap = gapMode === 'auto' ? undefined : Number(gapMode);
  const [notices, setNotices] = useState<FloatingNoticeItem[]>([
    {
      id: 'n-1',
      title: t('overlays.floatingNotice.copiedTitle', 'File path copied to clipboard'),
      description: 'dunting-qt/qml/Main.qml',
      level: 'default',
      duration: 5000,
      closable: true,
      priority: 0,
    },
    {
      id: 'n-2',
      title: t('overlays.floatingNotice.ratingTitle', 'Rated 5 stars'),
      description: t('overlays.floatingNotice.demoFileDesc', 'Image 001.png'),
      level: 'info',
      duration: 5000,
      closable: true,
      priority: 10,
    },
    {
      id: 'n-3',
      title: t('overlays.floatingNotice.warningTitle', 'Disk storage low'),
      description: t('overlays.floatingNotice.demoStorageDesc', 'Under 10% remaining'),
      level: 'warning',
      duration: 5000,
      closable: true,
      priority: 20,
    },
  ]);

  const addNotice = (level: FloatingNoticeLevel, title: string, priority?: number) => {
    const id = `notice-${Date.now()}`;
    setNotices((prev) => [
      ...prev,
      {
        id,
        title,
        level,
        priority,
        duration: 5000,
        closable: true,
      },
    ]);
  };

  const resetNotices = () => {
    setNotices([
      {
        id: 'r-1',
        title: t('overlays.floatingNotice.copiedTitle', 'File path copied to clipboard'),
        level: 'default',
        duration: 5000,
      },
      {
        id: 'r-2',
        title: t('overlays.floatingNotice.ratingTitle', 'Rated 5 stars'),
        level: 'info',
        duration: 5000,
        priority: 10,
      },
    ]);
  };

  const handleDismiss = (id: string) => {
    setNotices((prev) => prev.filter((item) => item.id !== id));
  };



  return (
    <DocLayout
      title="Floating Notice"
      category="Overlays & Feedback"
      description={t(
        'components.floatingNotice.description',
        'Floating stacked notice pill anchored to top or bottom with priority queueing, card-stack cycling, and extensible content.'
      )}
    >
      <section id="overview" className="space-y-4">
        <DocText role="h2">
          {t('showcase.toc.overview', 'Interactive Overview')}
        </DocText>
        <DocText role="p">
          {t(
            'overlays.floatingNotice.overviewLead',
            'Floating notice stacks multiple transient messages, showing highest-priority card in front with queued cards peeking behind. Hovering pauses expiry and smoothly zooms for enhanced visibility.'
          )}
        </DocText>

        <ComponentPreview
          title={t('overlays.floatingNotice.previewTitle', 'Floating Notice Stack')}
          reactCode={`<FloatingNotice
  notices={notices}
  placement="${placement}"${selectedGap !== undefined ? `\n  gap={${selectedGap}}` : ''}
  onDismiss={handleDismiss}
  pauseOnHover={true}
  zoomOnHover={true}
/>`}
          qtCode={`ChaSetFloatingNotice {
    placement: "${placement}"${selectedGap !== undefined ? `\n    gap: ${selectedGap}` : ''}
    notices: demoNotices
    pauseOnHover: true
    zoomOnHover: true
    onDismissed: function(id) { removeNotice(id) }
}`}
        >
          <div className="relative w-full h-64 border border-border rounded-xl bg-muted/20 flex flex-col justify-between p-4 overflow-hidden">
            {/* Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 z-10">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addNotice('default', 'Copied 3 files')}
                >
                  {t('overlays.floatingNotice.addCopy', '+ Copy Notice')}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addNotice('info', 'Rated 5 stars', 10)}
                >
                  {t('overlays.floatingNotice.addRating', '+ Rating Notice')}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addNotice('error', 'Operation failed', 30)}
                >
                  {t('overlays.floatingNotice.addError', '+ Error Alert')}
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span>{t('overlays.floatingNotice.gap', 'Spacing:')}</span>
                  <SegmentedControl
                    value={gapMode}
                    onChange={(v) => setGapMode(String(v))}
                    options={[
                      { label: t('overlays.floatingNotice.gapAuto', 'Auto'), value: 'auto' },
                      { label: t('overlays.floatingNotice.gapCompact', 'Compact (7dp)'), value: '7' },
                      { label: t('overlays.floatingNotice.gapRelaxed', 'Relaxed (12dp)'), value: '12' },
                      { label: t('overlays.floatingNotice.gapSpacious', 'Spacious (16dp)'), value: '16' },
                    ]}
                  />
                </div>
                <SegmentedControl
                  value={placement}
                  onChange={(v) => setPlacement(v as FloatingNoticePlacement)}
                  options={[
                    { label: t('overlays.floatingNotice.placementTop', 'Top'), value: 'top' },
                    { label: t('overlays.floatingNotice.placementBottom', 'Bottom'), value: 'bottom' },
                  ]}
                />
                <Button size="sm" variant="ghost" onClick={resetNotices}>
                  {t('overlays.floatingNotice.reset', 'Reset')}
                </Button>
              </div>
            </div>

            {/* FloatingNotice Instance inside sandbox */}
            <FloatingNotice
              notices={notices}
              placement={placement}
              offset={12}
              gap={selectedGap}
              onDismiss={handleDismiss}
            />

            <div className="text-center text-xs text-muted-foreground pb-2">
              {t(
                'overlays.floatingNotice.sandboxHint',
                'Hover over the notice to pause expiry and zoom the stack, or hover a peeking card behind to raise it to the top in place.'
              )}
            </div>
          </div>
        </ComponentPreview>
      </section>

      <DocAnatomy
        id="anatomy"
        reactCode={`import { FloatingNotice } from '@chahu/cha-set';

<FloatingNotice
  notices={[
    { id: "1", title: "Copied path", level: "default" },
    { id: "2", title: "Rated 5 stars", level: "info", priority: 10 }
  ]}
  placement="top"
  pauseOnHover={true}
  zoomOnHover={true}
/>`}
        qtCode={`import ChaSet

ChaSetFloatingNotice {
    placement: "top"
    pauseOnHover: true
    zoomOnHover: true
    notices: [
        { id: "1", title: ChaSetI18n.tr("overlays.floatingNotice.copiedTitle", "File path copied to clipboard"), level: "default" },
        { id: "2", title: ChaSetI18n.tr("overlays.floatingNotice.ratingTitle", "Rated 5 stars"), level: "info", priority: 10 }
    ]
}`}
      />

      <section id="animations" className="space-y-4">
        <DocText role="h2">
          {t('showcase.toc.animations', 'Animations')}
        </DocText>
        <DocText role="p">
          {t(
            'overlays.floatingNotice.animationsDesc',
            'Floating Notice utilizes shared motion tokens for micro-interactions: zoom-on-hover utilizes duration-short (120ms) ease-standard; notice cycling and indicator dots use duration-quick (90ms); dismiss transitions fade and slide out smoothly.'
          )}
        </DocText>
      </section>

      <DocMarkdown id="floating-notice" section="keyboard" />

      <DocMarkdown id="floating-notice" section="props" />
    </DocLayout>
  );
}
