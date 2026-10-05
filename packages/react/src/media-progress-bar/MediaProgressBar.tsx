import * as React from 'react';
import type { MediaProgressBarTimingMode, MediaProgressBarTimeFormat } from '../../../../spec/components/media-progress-bar';

export interface MediaProgressBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  ratio?: number;
  position?: number; // ms
  duration?: number; // ms
  frameRate?: number;
  timingMode?: MediaProgressBarTimingMode;
  timeFormat?: MediaProgressBarTimeFormat;
  showTime?: boolean;
  showThumb?: boolean;
  interactive?: boolean;
  disabled?: boolean;
  framesAvailable?: boolean;
  onSeekRequested?: (ratio: number) => void;
  onTimingModeChanged?: (mode: MediaProgressBarTimingMode) => void;
  onTimeFormatChanged?: (format: MediaProgressBarTimeFormat) => void;
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function formatHms(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) {
    return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
  }
  return `${pad2(m)}:${pad2(s)}`;
}

function formatSeconds(ms: number): string {
  return `${(Math.max(0, ms) / 1000).toFixed(1)}s`;
}

function formatFrames(ms: number, fps: number): string {
  const effectiveFps = fps > 0 ? fps : 30;
  const frame = Math.floor((Math.max(0, ms) / 1000) * effectiveFps);
  return `${frame}f`;
}

export const MediaProgressBar = React.forwardRef<HTMLDivElement, MediaProgressBarProps>(
  (
    {
      ratio = 0,
      position = 0,
      duration = 0,
      frameRate = 30,
      timingMode = 'elapsed',
      timeFormat = 'hms',
      showTime = true,
      showThumb = true,
      interactive = true,
      disabled = false,
      framesAvailable = true,
      onSeekRequested,
      onTimingModeChanged,
      onTimeFormatChanged,
      className = '',
      ...rest
    },
    ref
  ) => {
    const trackRef = React.useRef<HTMLDivElement>(null);
    const [dragging, setDragging] = React.useState(false);
    const [hoverRatio, setHoverRatio] = React.useState(-1);

    const clampedRatio = Math.max(0, Math.min(1, ratio));
    const effectiveFormat: MediaProgressBarTimeFormat =
      timeFormat === 'frames' && !framesAvailable ? 'hms' : timeFormat;

    const currentPos = duration > 0 ? clampedRatio * duration : position;
    const displayPos = timingMode === 'remaining' ? Math.max(0, duration - currentPos) : currentPos;

    const formatTime = (ms: number) => {
      switch (effectiveFormat) {
        case 'seconds':
          return formatSeconds(ms);
        case 'frames':
          return formatFrames(ms, frameRate);
        case 'hms':
        default:
          return formatHms(ms);
      }
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!interactive || disabled || !trackRef.current) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      setDragging(true);

      const rect = trackRef.current.getBoundingClientRect();
      const newRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      onSeekRequested?.(newRatio);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const r = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

      if (dragging) {
        onSeekRequested?.(r);
      } else {
        setHoverRatio(r);
      }
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
      if (dragging) {
        setDragging(false);
        try {
          e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
          // ignore
        }
      }
    };

    const toggleTimingMode = () => {
      if (disabled) return;
      const nextMode = timingMode === 'elapsed' ? 'remaining' : 'elapsed';
      onTimingModeChanged?.(nextMode);
    };

    return (
      <div
        ref={ref}
        className={`flex flex-col gap-1 w-full select-none ${disabled ? 'opacity-45 pointer-events-none' : ''} ${className}`}
        {...rest}
      >
        {/* Track Container */}
        <div
          ref={trackRef}
          className="relative py-2 cursor-pointer group flex items-center"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={() => setHoverRatio(-1)}
        >
          {/* Base Track */}
          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden relative">
            {/* Progress Fill */}
            <div
              className="h-full bg-primary transition-all duration-75"
              style={{ width: `${clampedRatio * 100}%` }}
            />
          </div>

          {/* Hover indicator line */}
          {hoverRatio >= 0 && !dragging && (
            <div
              className="absolute top-1/2 -translate-y-1/2 w-0.5 h-2 bg-white/60 pointer-events-none"
              style={{ left: `${hoverRatio * 100}%` }}
            />
          )}

          {/* Thumb */}
          {showThumb && (
            <div
              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-2.5 rounded-full bg-primary shadow transition-transform ${
                dragging ? 'scale-125 bg-white' : 'group-hover:scale-110'
              }`}
              style={{ left: `${clampedRatio * 100}%` }}
            />
          )}
        </div>

        {/* Time display bottom row */}
        {showTime && (
          <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
            <button
              type="button"
              onClick={toggleTimingMode}
              className="hover:text-foreground transition-colors cursor-pointer bg-transparent border-none p-0 font-mono text-xs"
              title="Click to toggle elapsed / remaining"
            >
              <span className="text-foreground font-medium">{timingMode === 'remaining' ? `-${formatTime(displayPos)}` : formatTime(displayPos)}</span>
              <span className="mx-1">/</span>
              <span>{formatTime(duration)}</span>
            </button>
            <span className="text-[10px] text-muted-foreground uppercase">{timingMode}</span>
          </div>
        )}
      </div>
    );
  }
);

MediaProgressBar.displayName = 'MediaProgressBar';
