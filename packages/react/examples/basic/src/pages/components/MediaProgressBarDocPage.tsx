import React, { useState } from 'react';
import { MediaProgressBar, type MediaProgressBarTimingMode, type MediaProgressBarTimeFormat, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocFooterSections } from '../../components/DocFooterSections';

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
      description="通用媒体播放进度条组件，支持拖拽擦洗、点击 seek、悬停预览、左下方「位置 / 总长」时间显示、点击翻转正/倒计时与右键格式菜单。"
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold mb-4 text-foreground">{t('desktopComposite.mediaProgressBar.overviewHeading', 'Interactive Overview')}</h2>
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

      <DocFooterSections
        componentId="media-progress-bar"
        props={[
          { name: 'ratio', type: 'number', defaultValue: '0', description: t('components.mediaProgressBar.ratioDesc', 'Playback progress ratio from 0.0 to 1.0.') },
          { name: 'duration', type: 'number', defaultValue: '0', description: t('components.mediaProgressBar.durationDesc', 'Total duration of the media in milliseconds.') },
          { name: 'position', type: 'number', defaultValue: '0', description: t('components.mediaProgressBar.positionDesc', 'Current playback position in milliseconds.') },
          { name: 'frameRate', type: 'number', defaultValue: '30', description: t('components.mediaProgressBar.frameRateDesc', 'Frame rate for frame-based time formatting.') },
          { name: 'timingMode', type: '"elapsed" | "remaining"', defaultValue: '"elapsed"', description: t('components.mediaProgressBar.timingModeDesc', 'Timing mode: elapsed time or remaining countdown.') },
          { name: 'timeFormat', type: '"hms" | "seconds" | "frames"', defaultValue: '"hms"', description: t('components.mediaProgressBar.timeFormatDesc', 'Format to display timestamp.') },
          { name: 'showTime', type: 'boolean', defaultValue: 'true', description: t('components.mediaProgressBar.showTimeDesc', 'Whether to show the time readout underneath.') },
          { name: 'showThumb', type: 'boolean', defaultValue: 'true', description: t('components.mediaProgressBar.showThumbDesc', 'Whether to display the progress thumb handle.') },
          { name: 'interactive', type: 'boolean', defaultValue: 'true', description: t('components.mediaProgressBar.interactiveDesc', 'Whether pointer seek/drag is enabled.') },
          { name: 'disabled', type: 'boolean', defaultValue: 'false', description: t('components.mediaProgressBar.disabledDesc', 'Disabled state.') },
        ]}
      />
    </DocLayout>
  );
}
