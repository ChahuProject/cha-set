import * as React from 'react';
import type {
  DurationPresetGroup,
  DurationInputSize,
} from '@chahu/spec/duration-input';

export const defaultDurationPresetGroups: DurationPresetGroup[] = [
  {
    label: 'Seconds',
    items: [{ label: '30s', seconds: 30 }],
  },
  {
    label: 'Minutes',
    items: [
      { label: '1m', seconds: 60 },
      { label: '5m', seconds: 300 },
      { label: '15m', seconds: 900 },
      { label: '30m', seconds: 1800 },
    ],
  },
  {
    label: 'Hours',
    items: [
      { label: '1h', seconds: 3600 },
      { label: '2h', seconds: 7200 },
      { label: '6h', seconds: 21600 },
      { label: '12h', seconds: 43200 },
    ],
  },
];




import { Button } from '../button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../dropdown-menu';
import { ChevronDownIcon, ChevronUpIcon, ClockIcon } from '../lib/icons';
import { cn } from '../lib/utils';

export interface DurationInputProps {
  /** Total duration in seconds (controlled) */
  value?: number;
  /** Initial duration in seconds (uncontrolled) */
  defaultValue?: number;
  /** Callback fired when the duration value changes */
  onChange?: (seconds: number) => void;
  /** Maximum hours allowed (default: 99) */
  maxHours?: number;
  /** Size variant */
  size?: DurationInputSize;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether to show the preset dropdown button */
  showPresets?: boolean;
  /** Whether to show segment labels underneath */
  showLabels?: boolean;
  /** Grouped preset options */
  presets?: DurationPresetGroup[];
  /** Label for hours segment */
  hoursLabel?: string;
  /** Label for minutes segment */
  minutesLabel?: string;
  /** Label for seconds segment */
  secondsLabel?: string;
  /** Label for presets trigger */
  presetsLabel?: string;
  /** Additional container CSS class names */
  className?: string;
  /** Force hover appearance for visual regression testing */
  forceHover?: boolean;
  /** Force active appearance for visual regression testing */
  forceActive?: boolean;
  /** Accessibility label */
  'aria-label'?: string;
}

type SegmentKey = 'hours' | 'minutes' | 'seconds';

function splitSeconds(totalSeconds: number): Record<SegmentKey, string> {
  const s = Math.max(0, Math.floor(totalSeconds));
  return {
    hours: Math.floor(s / 3600).toString(),
    minutes: Math.floor((s % 3600) / 60).toString(),
    seconds: (s % 60).toString(),
  };
}

function combineSeconds(segments: Record<SegmentKey, string>): number {
  const h = Number.parseInt(segments.hours, 10) || 0;
  const m = Number.parseInt(segments.minutes, 10) || 0;
  const s = Number.parseInt(segments.seconds, 10) || 0;
  return h * 3600 + m * 60 + s;
}

function normalizeSegment(key: SegmentKey, raw: string, maxHours: number): string {
  const limit = key === 'hours' ? maxHours : 59;
  const n = Math.min(Math.max(Number.parseInt(raw, 10) || 0, 0), limit);
  return n.toString().padStart(2, '0');
}

export function DurationInput({
  value: controlledValue,
  defaultValue = 0,
  onChange,
  maxHours = 99,
  size = 'default',
  disabled = false,
  showPresets = true,
  showLabels = true,
  presets = defaultDurationPresetGroups,
  hoursLabel = 'Hours',
  minutesLabel = 'Minutes',
  secondsLabel = 'Seconds',
  presetsLabel = 'Presets',
  className,
  forceHover = false,
  forceActive = false,
  'aria-label': ariaLabel,
}: DurationInputProps) {
  const isControlled = controlledValue !== undefined;
  const [internalSeconds, setInternalSeconds] = React.useState<number>(defaultValue);
  const currentSeconds = isControlled ? controlledValue : internalSeconds;

  const [segments, setSegments] = React.useState<Record<SegmentKey, string>>(() =>
    splitSeconds(currentSeconds),
  );
  const segmentsSnapshot = React.useRef(segments);
  const isEditing = React.useRef(false);
  const repeatTimer = React.useRef<number | null>(null);
  const inputRefs = React.useRef<Record<SegmentKey, HTMLInputElement | null>>({
    hours: null,
    minutes: null,
    seconds: null,
  });

  React.useEffect(() => {
    segmentsSnapshot.current = segments;
  });

  React.useEffect(() => {
    if (!isEditing.current) {
      setSegments(splitSeconds(currentSeconds));
    }
  }, [currentSeconds]);

  React.useEffect(
    () => () => {
      if (repeatTimer.current !== null) {
        window.clearTimeout(repeatTimer.current);
      }
    },
    [],
  );

  const stopRepeat = () => {
    if (repeatTimer.current !== null) {
      window.clearTimeout(repeatTimer.current);
      repeatTimer.current = null;
    }
  };

  const notifyChange = (newSeconds: number) => {
    if (!isControlled) {
      setInternalSeconds(newSeconds);
    }
    onChange?.(newSeconds);
  };

  const updateSegment = (key: SegmentKey, raw: string) => {
    if (disabled) return;
    isEditing.current = true;
    const filtered = raw.replace(/\D/g, '').slice(0, key === 'hours' && maxHours > 99 ? 3 : 2);
    const next = { ...segments, [key]: filtered };
    setSegments(next);
    notifyChange(combineSeconds(next));
  };

  const handleBlur = (key: SegmentKey) => {
    isEditing.current = false;
    const next = { ...segments, [key]: normalizeSegment(key, segments[key], maxHours) };
    setSegments(next);
    notifyChange(combineSeconds(next));
  };

  const step = (key: SegmentKey, delta: number) => {
    if (disabled) return;
    const prev = segmentsSnapshot.current;
    const limit = key === 'hours' ? maxHours : 59;
    const cur = Number.parseInt(prev[key], 10) || 0;
    const nextVal = Math.min(Math.max(cur + delta, 0), limit);
    const next = { ...prev, [key]: nextVal.toString().padStart(2, '0') };
    setSegments(next);
    notifyChange(combineSeconds(next));
  };

  const startStep = (key: SegmentKey, delta: number) => (e: React.PointerEvent) => {
    if (disabled) return;
    e.preventDefault();
    isEditing.current = true;
    step(key, delta);
    let interval = 400;
    const run = () => {
      repeatTimer.current = window.setTimeout(() => {
        step(key, delta);
        interval = Math.max(30, Math.floor(interval * 0.85));
        run();
      }, interval);
    };
    run();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, key: SegmentKey) => {
    if (disabled) return;
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      step(key, 1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      step(key, -1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const order: SegmentKey[] = ['hours', 'minutes', 'seconds'];
      const idx = order.indexOf(key);
      const target = e.key === 'ArrowLeft' ? order[idx - 1] : order[idx + 1];
      if (target && inputRefs.current[target]) {
        e.preventDefault();
        inputRefs.current[target]?.focus();
      }
    }
  };

  const handlePresetSelect = (seconds: number) => {
    if (disabled) return;
    isEditing.current = false;
    stopRepeat();
    setSegments(splitSeconds(seconds));
    notifyChange(seconds);
  };

  const segmentConfig: { key: SegmentKey; label: string }[] = [
    { key: 'hours', label: hoursLabel },
    { key: 'minutes', label: minutesLabel },
    { key: 'seconds', label: secondsLabel },
  ];

  const sizeClasses = {
    sm: {
      box: 'h-7',
      input: 'w-8 text-xs',
      stepper: 'w-3.5',
      icon: 'size-2.5',
      button: 'h-7 px-1.5 text-xs',
      unit: 'w-12 text-[0.5625rem]',
    },
    default: {
      box: 'h-8',
      input: 'w-10 text-xs',
      stepper: 'w-4',
      icon: 'size-3',
      button: 'h-8 px-2 text-xs',
      unit: 'w-14 text-[0.625rem]',
    },
    lg: {
      box: 'h-9',
      input: 'w-12 text-sm',
      stepper: 'w-4.5',
      icon: 'size-3.5',
      button: 'h-9 px-2.5 text-sm',
      unit: 'w-16 text-xs',
    },
  }[size];

  return (
    <div
      data-slot="duration-input"
      aria-label={ariaLabel}
      aria-disabled={disabled}
      className={cn('inline-flex flex-col space-y-1', className)}
    >
      <div className="flex items-center gap-1.5">
        {segmentConfig.map(({ key, label }, i) => (
          <React.Fragment key={key}>
            {i > 0 && (
              <span className="mx-0.5 text-xs font-semibold text-muted-foreground select-none">
                :
              </span>
            )}
            <div
              className={cn(
                'flex items-stretch overflow-hidden rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow]',
                sizeClasses.box,
                !disabled &&
                  'focus-within:border-ring focus-within:ring-1 focus-within:ring-ring',
                forceHover && 'border-ring',
                forceActive && 'ring-1 ring-ring',
                disabled && 'opacity-50 cursor-not-allowed',
              )}
            >
              <input
                ref={(el) => {
                  inputRefs.current[key] = el;
                }}
                type="text"
                inputMode="numeric"
                aria-label={label}
                disabled={disabled}
                value={segments[key]}
                onChange={(e) => updateSegment(key, e.target.value)}
                onBlur={() => handleBlur(key)}
                onFocus={(e) => e.target.select()}
                onKeyDown={(e) => handleKeyDown(e, key)}
                onWheel={(e) => {
                  if (!disabled && document.activeElement === e.currentTarget) {
                    e.preventDefault();
                    step(key, e.deltaY < 0 ? 1 : -1);
                  }
                }}
                className={cn(
                  'bg-transparent text-center font-mono tabular-nums text-foreground outline-none',
                  sizeClasses.input,
                  disabled && 'cursor-not-allowed',
                )}
              />
              <div
                className={cn(
                  'flex flex-col border-l border-input select-none',
                  sizeClasses.stepper,
                  disabled && 'pointer-events-none opacity-50',
                )}
              >
                <button
                  type="button"
                  tabIndex={-1}
                  disabled={disabled}
                  aria-label={`Increment ${label}`}
                  onPointerDown={startStep(key, 1)}
                  onPointerUp={stopRepeat}
                  onPointerLeave={stopRepeat}
                  onPointerCancel={stopRepeat}
                  className="flex flex-1 cursor-pointer items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed"
                >
                  <ChevronUpIcon className={sizeClasses.icon} />
                </button>
                <div className="border-t border-input" />
                <button
                  type="button"
                  tabIndex={-1}
                  disabled={disabled}
                  aria-label={`Decrement ${label}`}
                  onPointerDown={startStep(key, -1)}
                  onPointerUp={stopRepeat}
                  onPointerLeave={stopRepeat}
                  onPointerCancel={stopRepeat}
                  className="flex flex-1 cursor-pointer items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed"
                >
                  <ChevronDownIcon className={sizeClasses.icon} />
                </button>
              </div>
            </div>
          </React.Fragment>
        ))}

        {showPresets && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size={size === 'lg' ? 'default' : 'sm'}
                disabled={disabled}
                className={cn('gap-1 text-xs', sizeClasses.button)}
                aria-label={presetsLabel}
              >
                <ClockIcon className="size-3.5" />
                <span>{presetsLabel}</span>
                <ChevronDownIcon className="size-3 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-32">
              {presets.map((group, gIdx) => (
                <React.Fragment key={group.label}>
                  {gIdx > 0 && <DropdownMenuSeparator />}
                  <DropdownMenuLabel className="text-[0.6875rem] text-muted-foreground">
                    {group.label}
                  </DropdownMenuLabel>
                  {group.items.map((item) => (
                    <DropdownMenuItem
                      key={item.seconds}
                      onClick={() => handlePresetSelect(item.seconds)}
                    >
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                </React.Fragment>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {showLabels && (
        <div className="flex select-none">
          {segmentConfig.map(({ key, label }, i) => (
            <React.Fragment key={key}>
              {i > 0 && <span className="w-2" />}
              <span
                className={cn(
                  'text-center leading-none text-muted-foreground',
                  sizeClasses.unit,
                )}
              >
                {label}
              </span>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
