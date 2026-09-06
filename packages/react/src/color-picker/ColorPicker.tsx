import * as React from 'react';
import { cn } from '../lib/utils';
import {
  clamp,
  cmykToRgb,
  getHueFromPointer,
  hexToHsv,
  hsvToHex,
  hsvToRgb,
  hsvToTriangleWeights,
  hsvToWheelCoords,
  isValidHex,
  labToRgb,
  normalizeHex,
  pointToWeights,
  rgbToCmyk,
  rgbToCss,
  rgbToHex,
  rgbToHsv,
  rgbToLab,
  triangleWeightsToHsv,
  weightsToPoint,
  wheelCoordsToHsv,
  DEFAULT_TRIANGLE_WIDTH,
  DEFAULT_TRIANGLE_HEIGHT,
  DEFAULT_TRIANGLE_PURE,
  DEFAULT_TRIANGLE_WHITE,
  DEFAULT_TRIANGLE_BLACK,
  type CmykColor,
  type HsvColor,
  type LabColor,
  type RgbColor,
} from './color-utils';

export type ColorPickerSize = 'default' | 'sm';
export type ColorPickerMode = 'inline' | 'popover';
export type ColorPickerPanel = 'square' | 'circle' | 'triangle' | 'swatches';
export type ColorChannelMode = 'rgb' | 'hsv' | 'cmyk' | 'lab';

export const DEFAULT_PRESET_COLORS = [
  '#18181b',
  '#334155',
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#f43f5e',
  '#14b8a6',
  '#84cc16',
  '#f59e0b',
  '#6366f1',
  '#a855f7',
] as const;

export interface ColorPickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'title'> {
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  showPreview?: boolean;
  showHex?: boolean;
  showSwatches?: boolean;
  size?: ColorPickerSize;
  mode?: ColorPickerMode;
  presetColors?: string[];
  onChange?: (hex: string) => void;
  onValueChange?: (hex: string) => void;
  title?: React.ReactNode;
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

interface HueRingProps {
  hue: number;
  onHueChange: (hue: number) => void;
  ariaLabel: string;
  disabled?: boolean;
  sizePx?: number;
  children: React.ReactNode;
}

function HueRing({
  hue,
  onHueChange,
  ariaLabel,
  disabled = false,
  sizePx = 236,
  children,
}: HueRingProps) {
  const ringRef = React.useRef<HTMLDivElement | null>(null);

  const updateFromCoords = (clientX: number, clientY: number) => {
    if (disabled || !ringRef.current) return;
    onHueChange(getHueFromPointer(ringRef.current, clientX, clientY));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromCoords(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || e.buttons !== 1) return;
    updateFromCoords(e.clientX, e.clientY);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      onHueChange((hue + 359) % 360);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      onHueChange((hue + 1) % 360);
    }
  };

  const thickness = 20;
  const innerSize = sizePx - thickness * 2;
  const handleRadius = (sizePx - thickness) / 2;

  return (
    <div
      ref={ringRef}
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={360}
      aria-valuenow={Math.round(hue)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onKeyDown={handleKeyDown}
      className={cn(
        'relative rounded-full select-none touch-none cursor-crosshair flex items-center justify-center shadow-xs',
        disabled && 'cursor-not-allowed opacity-50',
      )}
      style={{
        width: `${sizePx}px`,
        height: `${sizePx}px`,
        background:
          'conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
      }}
    >
      <div
        className="rounded-full bg-card flex items-center justify-center overflow-hidden border border-border/50 shadow-inner"
        style={{
          width: `${innerSize}px`,
          height: `${innerSize}px`,
        }}
        onPointerDown={(e) => e.stopPropagation()}
        onPointerMove={(e) => e.stopPropagation()}
      >
        {children}
      </div>

      <span
        className="absolute pointer-events-none size-3.5 rounded-full border-2 border-white bg-foreground shadow-md ring-1 ring-black/40"
        style={{
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) rotate(${hue}deg) translateY(-${handleRadius}px)`,
        }}
      />
    </div>
  );
}

interface CircleWheelProps {
  hsva: HsvColor;
  onChange: (hsva: HsvColor) => void;
  disabled?: boolean;
  sizePx?: number;
}

function CircleWheel({
  hsva,
  onChange,
  disabled = false,
  sizePx = 236,
}: CircleWheelProps) {
  const wheelRef = React.useRef<HTMLDivElement | null>(null);
  const radius = sizePx / 2;

  const updateFromCoords = (clientX: number, clientY: number) => {
    if (disabled || !wheelRef.current) return;
    const { h, s } = wheelCoordsToHsv(wheelRef.current, clientX, clientY);
    onChange({
      ...hsva,
      h,
      s,
      v: hsva.v < 5 ? 100 : hsva.v,
    });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromCoords(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || e.buttons !== 1) return;
    updateFromCoords(e.clientX, e.clientY);
  };

  const pointer = hsvToWheelCoords(hsva.h, hsva.s, radius);

  return (
    <div
      ref={wheelRef}
      role="slider"
      aria-label="Color Wheel"
      aria-valuenow={hsva.h}
      tabIndex={disabled ? -1 : 0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      className={cn(
        'relative rounded-full select-none touch-none cursor-crosshair overflow-hidden border border-border/50 shadow-inner',
        disabled && 'cursor-not-allowed opacity-50',
      )}
      style={{
        width: `${sizePx}px`,
        height: `${sizePx}px`,
        background:
          'conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
      }}
    >
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle closest-side, #ffffff 0%, transparent 100%)',
        }}
      />

      <span
        className="absolute pointer-events-none size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md ring-1 ring-black/40"
        style={{
          left: `${pointer.x}px`,
          top: `${pointer.y}px`,
          backgroundColor: hsvToHex(hsva),
        }}
      />
    </div>
  );
}

interface ColorChannelSliderProps {
  label: string;
  labelColor?: string;
  min: number;
  max: number;
  value: number;
  gradient: string;
  disabled?: boolean;
  onChange: (val: number) => void;
}

function ColorChannelSlider({
  label,
  labelColor,
  min,
  max,
  value,
  gradient,
  disabled = false,
  onChange,
}: ColorChannelSliderProps) {
  const rounded = Math.round(value);

  return (
    <div className="grid grid-cols-[1.25rem_1fr_3.5rem] items-center gap-2 text-xs">
      <span
        className="font-mono font-bold text-center select-none"
        style={{ color: labelColor }}
      >
        {label}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={rounded}
        disabled={disabled}
        aria-label={`Color channel ${label}`}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full outline-hidden"
        style={{ background: gradient }}
      />
      <input
        type="number"
        min={min}
        max={max}
        step={1}
        value={rounded}
        disabled={disabled}
        aria-label={`Color channel ${label} value`}
        onChange={(e) => onChange(clamp(Number(e.target.value), min, max))}
        className="h-6 w-full rounded border border-border/80 bg-background px-1.5 font-mono text-[11px] text-foreground text-center outline-hidden focus:border-primary focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}

export const ColorPicker = React.forwardRef<HTMLDivElement, ColorPickerProps>(
  (
    {
      className,
      value,
      defaultValue = '#1d7ae0',
      disabled = false,
      showPreview = true,
      showHex = true,
      showSwatches = true,
      size = 'default',
      mode = 'inline',
      presetColors = DEFAULT_PRESET_COLORS as unknown as string[],
      onChange,
      onValueChange,
      title,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState<string>(defaultValue);
    const activeHex = normalizeHex(isControlled ? value : internalValue);

    const [hsva, setHsva] = React.useState<HsvColor>(() => hexToHsv(activeHex));
    const [hexDraft, setHexDraft] = React.useState<string>(activeHex);
    const [activePanel, setActivePanel] = React.useState<ColorPickerPanel>('square');

    // Independent multi-channel group toggles
    const [showRgbSliders, setShowRgbSliders] = React.useState<boolean>(true);
    const [showHsvSliders, setShowHsvSliders] = React.useState<boolean>(false);
    const [showCmykSliders, setShowCmykSliders] = React.useState<boolean>(false);
    const [showLabSliders, setShowLabSliders] = React.useState<boolean>(false);

    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const [copied, setCopied] = React.useState<boolean>(false);

    const popoverContainerRef = React.useRef<HTMLDivElement | null>(null);
    const squareRef = React.useRef<HTMLDivElement | null>(null);
    const triangleSvgRef = React.useRef<SVGSVGElement | null>(null);

    // Synchronize external value changes
    React.useEffect(() => {
      setHexDraft(activeHex);
      const nextHsv = hexToHsv(activeHex);
      setHsva((prev) => {
        const prevHex = hsvToHex(prev);
        return prevHex.toUpperCase() === activeHex.toUpperCase() ? prev : nextHsv;
      });
    }, [activeHex]);

    // Close popover when clicking outside or pressing Escape
    React.useEffect(() => {
      if (mode !== 'popover' || !isOpen) return;

      const handlePointerDown = (event: PointerEvent) => {
        if (
          popoverContainerRef.current &&
          !popoverContainerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setIsOpen(false);
        }
      };

      document.addEventListener('pointerdown', handlePointerDown);
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('pointerdown', handlePointerDown);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [mode, isOpen]);

    const commitColor = React.useCallback(
      (nextHsv: HsvColor) => {
        const nextHex = hsvToHex(nextHsv);
        setHsva(nextHsv);
        setHexDraft(nextHex);
        if (!isControlled) {
          setInternalValue(nextHex);
        }
        onChange?.(nextHex);
        onValueChange?.(nextHex);
      },
      [isControlled, onChange, onValueChange],
    );

    const commitHex = React.useCallback(
      (newHex: string) => {
        const normalized = normalizeHex(newHex);
        const nextHsv = hexToHsv(normalized);
        setHsva(nextHsv);
        setHexDraft(normalized);
        if (!isControlled) {
          setInternalValue(normalized);
        }
        onChange?.(normalized);
        onValueChange?.(normalized);
      },
      [isControlled, onChange, onValueChange],
    );

    const handleCopy = async () => {
      if (disabled) return;
      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(activeHex);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {
        // Fallback or ignore
      }
    };

    // 2D Square Saturation & Value interaction
    const updateSquareFromCoords = (clientX: number, clientY: number) => {
      if (disabled || !squareRef.current) return;
      const rect = squareRef.current.getBoundingClientRect();
      const xRatio = clamp((clientX - rect.left) / rect.width, 0, 1);
      const yRatio = clamp((clientY - rect.top) / rect.height, 0, 1);

      const s = Math.round(xRatio * 100);
      const v = Math.round((1 - yRatio) * 100);

      commitColor({ ...hsva, s, v });
    };

    const handleSquarePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      if (disabled || e.button !== 0) return;
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      updateSquareFromCoords(e.clientX, e.clientY);
    };

    const handleSquarePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (disabled || e.buttons !== 1) return;
      updateSquareFromCoords(e.clientX, e.clientY);
    };

    // Triangle interaction
    const updateTriangleFromCoords = (clientX: number, clientY: number) => {
      if (disabled || !triangleSvgRef.current) return;
      const rect = triangleSvgRef.current.getBoundingClientRect();
      const point = {
        x: ((clientX - rect.left) / rect.width) * DEFAULT_TRIANGLE_WIDTH,
        y: ((clientY - rect.top) / rect.height) * DEFAULT_TRIANGLE_HEIGHT,
      };
      const weights = pointToWeights(point);
      commitColor(triangleWeightsToHsv(weights, hsva.h));
    };

    const handleTrianglePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
      if (disabled || e.button !== 0) return;
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      updateTriangleFromCoords(e.clientX, e.clientY);
    };

    const handleTrianglePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
      if (disabled || e.buttons !== 1) return;
      updateTriangleFromCoords(e.clientX, e.clientY);
    };

    // Color spaces for channels
    const rgb: RgbColor = React.useMemo(() => hsvToRgb(hsva), [hsva]);
    const cmyk: CmykColor = React.useMemo(() => rgbToCmyk(rgb), [rgb]);
    const lab: LabColor = React.useMemo(() => rgbToLab(rgb), [rgb]);

    // Triangle calculations
    const triangleWeights = React.useMemo(() => hsvToTriangleWeights(hsva), [hsva]);
    const trianglePointer = React.useMemo(
      () => weightsToPoint(triangleWeights),
      [triangleWeights],
    );
    const trianglePoints = `${DEFAULT_TRIANGLE_PURE.x},${DEFAULT_TRIANGLE_PURE.y} ${DEFAULT_TRIANGLE_WHITE.x},${DEFAULT_TRIANGLE_WHITE.y} ${DEFAULT_TRIANGLE_BLACK.x},${DEFAULT_TRIANGLE_BLACK.y}`;
    const pureHueHex = hsvToHex({ h: hsva.h, s: 100, v: 100 });

    const isSm = size === 'sm';
    const stageSize = isSm ? 200 : 236;
    const squareInnerSize = isSm ? 112 : 136;
    const triangleInnerW = isSm ? 150 : 180;
    const triangleInnerH = isSm ? 115 : 140;

    // Channel Gradients
    const redGradient = `linear-gradient(90deg, rgb(0, ${rgb.g}, ${rgb.b}), rgb(255, ${rgb.g}, ${rgb.b}))`;
    const greenGradient = `linear-gradient(90deg, rgb(${rgb.r}, 0, ${rgb.b}), rgb(${rgb.r}, 255, ${rgb.b}))`;
    const blueGradient = `linear-gradient(90deg, rgb(${rgb.r}, ${rgb.g}, 0), rgb(${rgb.r}, ${rgb.g}, 255))`;

    const hueGradient = 'linear-gradient(90deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)';
    const satGradient = `linear-gradient(90deg, ${hsvToHex({ ...hsva, s: 0 })}, ${hsvToHex({ ...hsva, s: 100 })})`;
    const valGradient = `linear-gradient(90deg, #000000, ${hsvToHex({ ...hsva, v: 100 })})`;

    const cyanGradient = `linear-gradient(90deg, ${rgbToCss(cmykToRgb({ ...cmyk, c: 0 }))}, ${rgbToCss(cmykToRgb({ ...cmyk, c: 100 }))})`;
    const magentaGradient = `linear-gradient(90deg, ${rgbToCss(cmykToRgb({ ...cmyk, m: 0 }))}, ${rgbToCss(cmykToRgb({ ...cmyk, m: 100 }))})`;
    const yellowGradient = `linear-gradient(90deg, ${rgbToCss(cmykToRgb({ ...cmyk, y: 0 }))}, ${rgbToCss(cmykToRgb({ ...cmyk, y: 100 }))})`;
    const blackGradient = `linear-gradient(90deg, ${rgbToCss(cmykToRgb({ ...cmyk, k: 0 }))}, ${rgbToCss(cmykToRgb({ ...cmyk, k: 100 }))})`;

    const labLGradient = `linear-gradient(90deg, ${rgbToCss(labToRgb({ ...lab, l: 0 }))}, ${rgbToCss(labToRgb({ ...lab, l: 100 }))})`;
    const labAGradient = `linear-gradient(90deg, ${rgbToCss(labToRgb({ ...lab, a: -128 }))}, ${rgbToCss(labToRgb({ ...lab, a: 127 }))})`;
    const labBGradient = `linear-gradient(90deg, ${rgbToCss(labToRgb({ ...lab, b: -128 }))}, ${rgbToCss(labToRgb({ ...lab, b: 127 }))})`;

    // Core Picker Panel Card
    const panelContent = (
      <div
        className={cn(
          'flex flex-col gap-3 rounded-lg border border-border bg-card p-3.5 text-card-foreground shadow-sm',
          isSm ? 'w-64 text-xs' : 'w-72 text-sm',
          disabled && 'opacity-50 pointer-events-none select-none',
        )}
      >
        {/* 1. Preview Header */}
        {showPreview && (
          <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-2.5">
            <div className="flex items-center gap-2.5">
              <span
                className="size-8 shrink-0 rounded-md border border-border/80 shadow-xs ring-1 ring-border/20"
                style={{ backgroundColor: activeHex }}
              />
              <div className="flex flex-col leading-tight">
                <span className="font-medium text-foreground">
                  {title ?? 'Color'}
                </span>
                <span className="font-mono text-xs text-muted-foreground tracking-wider">
                  {activeHex}
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={disabled}
              onClick={handleCopy}
              title="Copy hex code"
              aria-label="Copy hex code"
              className={cn(
                'flex size-7 items-center justify-center rounded-md border border-border/60 bg-secondary/50 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:scale-95',
                disabled && 'cursor-not-allowed opacity-50',
              )}
            >
              {copied ? (
                <CheckIcon className="size-3.5 text-emerald-500" />
              ) : (
                <CopyIcon className="size-3.5" />
              )}
            </button>
          </div>
        )}

        {/* 2. Visual Selector Panel Tabs */}
        <div className="flex items-center justify-between gap-1 rounded-md bg-muted/70 p-1">
          {(
            [
              { value: 'square', label: 'Square' },
              { value: 'circle', label: 'Circle' },
              { value: 'triangle', label: 'Triangle' },
              { value: 'swatches', label: 'Swatches' },
            ] as const
          ).map((p) => (
            <button
              key={p.value}
              type="button"
              disabled={disabled}
              onClick={() => setActivePanel(p.value)}
              className={cn(
                'flex-1 rounded py-1 text-center font-medium transition-all select-none',
                activePanel === p.value
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
                isSm ? 'text-[11px]' : 'text-xs',
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* 3. Panel Body */}
        <div className="flex items-center justify-center min-h-[200px]">
          {activePanel === 'square' && (
            <HueRing
              hue={hsva.h}
              onHueChange={(h) => commitColor({ ...hsva, h })}
              ariaLabel="Hue ring"
              disabled={disabled}
              sizePx={stageSize}
            >
              <div
                ref={squareRef}
                role="slider"
                aria-label="Color saturation and brightness"
                aria-valuenow={hsva.v}
                tabIndex={disabled ? -1 : 0}
                onPointerDown={handleSquarePointerDown}
                onPointerMove={handleSquarePointerMove}
                className="relative cursor-crosshair overflow-hidden rounded-sm border border-border/60 shadow-inner select-none"
                style={{
                  width: `${squareInnerSize}px`,
                  height: `${squareInnerSize}px`,
                  backgroundColor: `hsl(${hsva.h}, 100%, 50%)`,
                  backgroundImage:
                    'linear-gradient(to top, #000000 0%, transparent 100%), linear-gradient(to right, #ffffff 0%, transparent 100%)',
                }}
              >
                <div
                  className="absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md ring-1 ring-black/40 pointer-events-none"
                  style={{
                    left: `${hsva.s}%`,
                    top: `${100 - hsva.v}%`,
                    backgroundColor: activeHex,
                  }}
                />
              </div>
            </HueRing>
          )}

          {activePanel === 'circle' && (
            <CircleWheel
              hsva={hsva}
              onChange={commitColor}
              disabled={disabled}
              sizePx={stageSize}
            />
          )}

          {activePanel === 'triangle' && (
            <HueRing
              hue={hsva.h}
              onHueChange={(h) => commitColor({ ...hsva, h })}
              ariaLabel="Hue ring"
              disabled={disabled}
              sizePx={stageSize}
            >
              <svg
                ref={triangleSvgRef}
                viewBox={`0 0 ${DEFAULT_TRIANGLE_WIDTH} ${DEFAULT_TRIANGLE_HEIGHT}`}
                role="slider"
                aria-label="Triangle HSV color picker"
                tabIndex={disabled ? -1 : 0}
                onPointerDown={handleTrianglePointerDown}
                onPointerMove={handleTrianglePointerMove}
                className="cursor-crosshair select-none touch-none overflow-visible"
                style={{
                  width: `${triangleInnerW}px`,
                  height: `${triangleInnerH}px`,
                }}
              >
                <defs>
                  <linearGradient
                    id="cha-set-triangle-white"
                    x1={DEFAULT_TRIANGLE_WHITE.x}
                    y1={DEFAULT_TRIANGLE_WHITE.y}
                    x2={DEFAULT_TRIANGLE_PURE.x}
                    y2={DEFAULT_TRIANGLE_PURE.y}
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#ffffff" />
                    <stop offset="1" stopColor={pureHueHex} stopOpacity="0" />
                  </linearGradient>
                  <linearGradient
                    id="cha-set-triangle-black"
                    x1={DEFAULT_TRIANGLE_BLACK.x}
                    y1={DEFAULT_TRIANGLE_BLACK.y}
                    x2={DEFAULT_TRIANGLE_PURE.x}
                    y2={DEFAULT_TRIANGLE_PURE.y}
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#000000" />
                    <stop offset="1" stopColor={pureHueHex} stopOpacity="0" />
                  </linearGradient>
                </defs>

                <polygon points={trianglePoints} fill={pureHueHex} />
                <polygon points={trianglePoints} fill="url(#cha-set-triangle-white)" />
                <polygon points={trianglePoints} fill="url(#cha-set-triangle-black)" />
                <polygon
                  points={trianglePoints}
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity="0.2"
                  strokeWidth="1.5"
                />

                <circle
                  cx={trianglePointer.x}
                  cy={trianglePointer.y}
                  r="6"
                  fill={activeHex}
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="drop-shadow-sm pointer-events-none"
                />
              </svg>
            </HueRing>
          )}

          {activePanel === 'swatches' && (
            <div className="grid grid-cols-8 gap-1.5 py-4 w-full">
              {presetColors.map((color) => {
                const isSelected = color.toUpperCase() === activeHex.toUpperCase();
                return (
                  <button
                    key={color}
                    type="button"
                    disabled={disabled}
                    aria-label={color}
                    title={color}
                    onClick={() => commitHex(color)}
                    className={cn(
                      'group relative size-6 rounded-md border transition-all hover:scale-110 active:scale-95 flex items-center justify-center',
                      isSelected
                        ? 'border-primary ring-2 ring-primary/40 shadow-xs'
                        : 'border-border/60 hover:border-border',
                    )}
                    style={{ backgroundColor: color }}
                  >
                    {isSelected && (
                      <span className="size-2 rounded-full bg-white shadow-xs drop-shadow-sm" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick swatches row when not on swatches tab */}
        {showSwatches && activePanel !== 'swatches' && (
          <div className="flex flex-wrap gap-1.5 border-t border-border/40 pt-2.5">
            {presetColors.slice(0, 16).map((color) => {
              const isSelected = color.toUpperCase() === activeHex.toUpperCase();
              return (
                <button
                  key={color}
                  type="button"
                  disabled={disabled}
                  aria-label={color}
                  title={color}
                  onClick={() => commitHex(color)}
                  className={cn(
                    'size-5 rounded-md border transition-transform hover:scale-115 active:scale-95',
                    isSelected
                      ? 'border-primary ring-1.5 ring-primary'
                      : 'border-border/50',
                  )}
                  style={{ backgroundColor: color }}
                />
              );
            })}
          </div>
        )}

        {/* 4. Hex Input Row with Copy Button */}
        {showHex && (
          <div className="flex items-center gap-2 border-t border-border/40 pt-2.5">
            <span className="w-8 font-mono text-xs font-semibold uppercase text-muted-foreground">
              HEX
            </span>
            <div className="relative flex-1">
              <input
                type="text"
                data-testid="color-hex-input"
                aria-label="HEX color code"
                spellCheck={false}
                disabled={disabled}
                value={hexDraft}
                onChange={(e) => {
                  const draft = e.target.value.toUpperCase();
                  setHexDraft(draft);
                  if (isValidHex(draft) && (draft.length === 4 || draft.length === 7)) {
                    commitHex(draft);
                  }
                }}
                onBlur={() => {
                  if (isValidHex(hexDraft)) {
                    commitHex(hexDraft);
                  } else {
                    setHexDraft(activeHex);
                  }
                }}
                className={cn(
                  'h-8 w-full rounded-md border border-border bg-background px-2.5 pr-8 font-mono text-xs uppercase text-foreground outline-hidden transition-colors focus:border-primary focus:ring-1 focus:ring-primary',
                  disabled && 'cursor-not-allowed opacity-50',
                )}
              />
              <button
                type="button"
                disabled={disabled}
                onClick={handleCopy}
                title="Copy HEX color"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted/50 cursor-pointer"
              >
                {copied ? (
                  <CheckIcon className="size-3 text-emerald-500" />
                ) : (
                  <CopyIcon className="size-3" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* 5. Channel Sliders & Multi-Group Toggles */}
        <div className="flex flex-col gap-2.5 border-t border-border/40 pt-2.5">
          {/* Active Channel Value Sliders */}
          <div className="flex flex-col gap-2">
            {showRgbSliders && (
              <div className="flex flex-col gap-1.5 rounded-md bg-muted/40 p-2" aria-label="RGB channels">
                <ColorChannelSlider
                  label="R"
                  labelColor="#ef4444"
                  min={0}
                  max={255}
                  value={rgb.r}
                  gradient={redGradient}
                  disabled={disabled}
                  onChange={(val) => commitHex(rgbToHex({ ...rgb, r: val }))}
                />
                <ColorChannelSlider
                  label="G"
                  labelColor="#22c55e"
                  min={0}
                  max={255}
                  value={rgb.g}
                  gradient={greenGradient}
                  disabled={disabled}
                  onChange={(val) => commitHex(rgbToHex({ ...rgb, g: val }))}
                />
                <ColorChannelSlider
                  label="B"
                  labelColor="#3b82f6"
                  min={0}
                  max={255}
                  value={rgb.b}
                  gradient={blueGradient}
                  disabled={disabled}
                  onChange={(val) => commitHex(rgbToHex({ ...rgb, b: val }))}
                />
              </div>
            )}

            {showHsvSliders && (
              <div className="flex flex-col gap-1.5 rounded-md bg-muted/40 p-2" aria-label="HSV channels">
                <ColorChannelSlider
                  label="H"
                  min={0}
                  max={360}
                  value={hsva.h}
                  gradient={hueGradient}
                  disabled={disabled}
                  onChange={(val) => commitColor({ ...hsva, h: val })}
                />
                <ColorChannelSlider
                  label="S"
                  min={0}
                  max={100}
                  value={hsva.s}
                  gradient={satGradient}
                  disabled={disabled}
                  onChange={(val) => commitColor({ ...hsva, s: val })}
                />
                <ColorChannelSlider
                  label="V"
                  min={0}
                  max={100}
                  value={hsva.v}
                  gradient={valGradient}
                  disabled={disabled}
                  onChange={(val) => commitColor({ ...hsva, v: val })}
                />
              </div>
            )}

            {showCmykSliders && (
              <div className="flex flex-col gap-1.5 rounded-md bg-muted/40 p-2" aria-label="CMYK channels">
                <ColorChannelSlider
                  label="C"
                  labelColor="#06b6d4"
                  min={0}
                  max={100}
                  value={cmyk.c}
                  gradient={cyanGradient}
                  disabled={disabled}
                  onChange={(val) => commitHex(rgbToHex(cmykToRgb({ ...cmyk, c: val })))}
                />
                <ColorChannelSlider
                  label="M"
                  labelColor="#ec4899"
                  min={0}
                  max={100}
                  value={cmyk.m}
                  gradient={magentaGradient}
                  disabled={disabled}
                  onChange={(val) => commitHex(rgbToHex(cmykToRgb({ ...cmyk, m: val })))}
                />
                <ColorChannelSlider
                  label="Y"
                  labelColor="#eab308"
                  min={0}
                  max={100}
                  value={cmyk.y}
                  gradient={yellowGradient}
                  disabled={disabled}
                  onChange={(val) => commitHex(rgbToHex(cmykToRgb({ ...cmyk, y: val })))}
                />
                <ColorChannelSlider
                  label="K"
                  labelColor="var(--color-foreground)"
                  min={0}
                  max={100}
                  value={cmyk.k}
                  gradient={blackGradient}
                  disabled={disabled}
                  onChange={(val) => commitHex(rgbToHex(cmykToRgb({ ...cmyk, k: val })))}
                />
              </div>
            )}

            {showLabSliders && (
              <div className="flex flex-col gap-1.5 rounded-md bg-muted/40 p-2" aria-label="LAB channels">
                <ColorChannelSlider
                  label="L"
                  min={0}
                  max={100}
                  value={lab.l}
                  gradient={labLGradient}
                  disabled={disabled}
                  onChange={(val) => commitHex(rgbToHex(labToRgb({ ...lab, l: val })))}
                />
                <ColorChannelSlider
                  label="A"
                  min={-128}
                  max={127}
                  value={lab.a}
                  gradient={labAGradient}
                  disabled={disabled}
                  onChange={(val) => commitHex(rgbToHex(labToRgb({ ...lab, a: val })))}
                />
                <ColorChannelSlider
                  label="B"
                  min={-128}
                  max={127}
                  value={lab.b}
                  gradient={labBGradient}
                  disabled={disabled}
                  onChange={(val) => commitHex(rgbToHex(labToRgb({ ...lab, b: val })))}
                />
              </div>
            )}
          </div>

          {/* Independent Multi-Channel Toggle Buttons */}
          <div className="grid grid-cols-4 gap-1 rounded-md bg-muted/60 p-1" role="group" aria-label="Color channel sliders">
            <button
              type="button"
              disabled={disabled}
              aria-pressed={showRgbSliders}
              onClick={() => setShowRgbSliders(!showRgbSliders)}
              className={cn(
                'rounded py-1 text-center font-medium text-xs transition-colors cursor-pointer select-none',
                showRgbSliders
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              RGB
            </button>
            <button
              type="button"
              disabled={disabled}
              aria-pressed={showHsvSliders}
              onClick={() => setShowHsvSliders(!showHsvSliders)}
              className={cn(
                'rounded py-1 text-center font-medium text-xs transition-colors cursor-pointer select-none',
                showHsvSliders
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              HSV
            </button>
            <button
              type="button"
              disabled={disabled}
              aria-pressed={showCmykSliders}
              onClick={() => setShowCmykSliders(!showCmykSliders)}
              className={cn(
                'rounded py-1 text-center font-medium text-xs transition-colors cursor-pointer select-none',
                showCmykSliders
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              CMYK
            </button>
            <button
              type="button"
              disabled={disabled}
              aria-pressed={showLabSliders}
              onClick={() => setShowLabSliders(!showLabSliders)}
              className={cn(
                'rounded py-1 text-center font-medium text-xs transition-colors cursor-pointer select-none',
                showLabSliders
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              LAB
            </button>
          </div>
        </div>
      </div>
    );

    if (mode === 'popover') {
      return (
        <div
          ref={(node) => {
            popoverContainerRef.current = node;
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
            }
          }}
          data-slot="color-picker"
          data-disabled={disabled ? '' : undefined}
          data-mode="popover"
          className={cn('relative inline-block', className)}
          {...props}
        >
          {/* Popover trigger swatch button */}
          <button
            type="button"
            data-testid="color-picker-trigger"
            aria-label="Select color"
            aria-expanded={isOpen}
            disabled={disabled}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className={cn(
              'inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 font-mono shadow-xs transition-colors hover:bg-muted/50 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring select-none cursor-pointer',
              isSm ? 'h-8 text-xs' : 'h-9 text-sm',
              disabled && 'cursor-not-allowed opacity-50 pointer-events-none',
            )}
          >
            <span
              className="size-4 rounded-full border border-border/80 shadow-xs"
              style={{ backgroundColor: activeHex }}
            />
            <span className="text-foreground tracking-wider uppercase">
              {activeHex}
            </span>
            <ChevronDownIcon className="size-3.5 text-muted-foreground ml-0.5" />
          </button>

          {/* Floating dropdown card */}
          {isOpen && (
            <div className="absolute left-0 top-full z-50 mt-1.5 animate-in fade-in-0 zoom-in-95">
              {panelContent}
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        data-slot="color-picker"
        data-disabled={disabled ? '' : undefined}
        data-mode="inline"
        className={cn('inline-block', className)}
        {...props}
      >
        {panelContent}
      </div>
    );
  },
);

ColorPicker.displayName = 'ColorPicker';
