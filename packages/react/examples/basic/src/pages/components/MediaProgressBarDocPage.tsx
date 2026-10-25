import React, { useState } from 'react';
import { MediaProgressBar, type MediaProgressBarTimingMode, type MediaProgressBarTimeFormat, CopyableBadge, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { DocMarkdown } from '../../components/DocMarkdown';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocText } from '../../components/DocText';

export function MediaProgressBarDocPage() {
  const { t } = useChaSetI18n();
  const [ratio, setRatio] = useState(0.35);
  const [duration] = useState(120000); // 2 minutes
  const [frameRate] = useState(30);
  const [timingMode, setTimingMode] = useState<MediaProgressBarTimingMode>('elapsed');
  const [timeFormat, setTimeFormat] = useState<MediaProgressBarTimeFormat>('hms');
  const [showTime, setShowTime] = useState(true);

  const heroReactCode = `<MediaProgressBar
  ratio={${ratio.toFixed(2)}}
  duration={${duration}}
  frameRate={${frameRate}}
  timingMode="${timingMode}"
  timeFormat="${timeFormat}"
  showTime={${showTime}}
  onSeekRequested={setRatio}
  onTimingModeChanged={setTimingMode}
/>`;

  const heroQtCode = `ChaSetMediaProgressBar {
    width: parent.width
    ratio: ${ratio.toFixed(2)}
    duration: ${duration}
    frameRate: ${frameRate}
    timingMode: "${timingMode}"
    timeFormat: "${timeFormat}"
    showTime: ${showTime}
    onSeekRequested: (r) => root.demoRatio = r
}`;

  return (
    <DocLayout
      category="Forms & Inputs"
      title="MediaProgressBar"
      description={t('components.mediaProgressBar.description', 'Universal media playback progress bar supporting drag-scrubbing, click-to-seek, hover preview, elapsed/remaining time display, click to toggle countdown, and context format menu.')}
    >
      <section id="overview" className="scroll-mt-20">
        <DocText role="h2" className="mb-4">{t('desktopComposite.mediaProgressBar.overviewHeading', 'Interactive Overview')}</DocText>
        <ComponentPreview
          title={t('desktopComposite.mediaProgressBar.sandboxTitle', 'MediaProgressBar Sandbox')}
          reactCode={heroReactCode}
          qtCode={heroQtCode}
        >
          <div className="w-full max-w-md py-6 flex flex-col gap-4">
            <MediaProgressBar
              ratio={ratio}
              duration={duration}
              frameRate={frameRate}
              timingMode={timingMode}
              timeFormat={timeFormat}
              showTime={showTime}
              onSeekRequested={setRatio}
              onTimingModeChanged={setTimingMode}
              onTimeFormatChanged={setTimeFormat}
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{t('components.mediaProgressBar.playbackStatus', 'Playback Progress')}: <strong className="text-foreground font-mono">{Math.round(ratio * 100)}%</strong></span>
              <span>{t('components.mediaProgressBar.timingModeLabel', 'Timing Mode')}: <strong className="text-foreground font-mono">{timingMode}</strong></span>
            </div>
          </div>
        </ComponentPreview>
      </section>

      <DocMarkdown id="media-progress-bar" section="animations" />

      <DocMarkdown id="media-progress-bar" section="keyboard" />

      <DocMarkdown id="media-progress-bar" section="props" />
    </DocLayout>
  );
}
