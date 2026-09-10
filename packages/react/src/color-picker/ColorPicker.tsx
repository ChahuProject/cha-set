import * as React from 'react';
import { CopyButton } from '../copy-button/CopyButton';
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
  /** Alias for `value` for compatibility with common color picker props */
  color?: string;
  defaultValue?: string;
  disabled?: boolean;
  showPreview?: boolean;
  showHex?: boolean;
  showSwatches?: boolean;
  size?: ColorPickerSize;
  mode?: ColorPickerMode;
  movable?: boolean;
  presetColors?: string[];
  onChange?: (hex: string) => void;
  onValueChange?: (hex: string) => void;
  title?: React.ReactNode;
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
  thickness?: number;
  children: React.ReactNode;
}

function HueRing({
  hue,
  onHueChange,
  ariaLabel,
  disabled = false,
  sizePx = 236,
  thickness = 20,
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
        'relative rounded-full select-none touch-none cursor-crosshair flex items-center justify-center',
        disabled && 'cursor-not-allowed opacity-50',
      )}
      style={{
        width: `${sizePx}px`,
        height: `${sizePx}px`,
        background:
          'conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
        boxShadow:
          'inset 0 0 0 1px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.14)',
      }}
    >
      {/* Clean inner circular card mask */}
      <div
        className="absolute rounded-full bg-card pointer-events-none"
        style={{
          inset: `${thickness}px`,
          boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.12)',
        }}
      />

      {/* Content wrapper with pointer containment */}
      <div
        className="relative z-10 flex items-center justify-center pointer-events-none"
        style={{
          width: `${innerSize}px`,
          height: `${innerSize}px`,
        }}
      >
        <div
          className="pointer-events-auto flex items-center justify-center"
          onPointerDown={(e) => e.stopPropagation()}
          onPointerMove={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>

      {/* Orbiting ring handle */}
      <span
        className="absolute pointer-events-none size-3.5 rounded-full border-2 border-white bg-foreground shadow-md ring-1 ring-black/40 z-20"
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
        'relative rounded-full select-none touch-none cursor-crosshair overflow-hidden',
        disabled && 'cursor-not-allowed opacity-50',
      )}
      style={{
        width: `${sizePx}px`,
        height: `${sizePx}px`,
        boxShadow:
          'inset 0 0 0 1px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.14)',
      }}
    >
      {/* 1. Conic hue base */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
        }}
      />
      {/* 2. Radial saturation fade to white at center */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle closest-side, #ffffff 0%, transparent 100%)',
        }}
      />
      {/* 3. Dark overlay for value (brightness) */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none bg-black transition-opacity"
        style={{
          opacity: 1 - hsva.v / 100,
        }}
      />

      {/* Pointer handle */}
      <span
        className="absolute pointer-events-none size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md ring-1 ring-black/40 z-10"
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
  density?: 'spacious' | 'compact' | 'dense';
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
  density = 'spacious',
  disabled = false,
  onChange,
}: ColorChannelSliderProps) {
  const rounded = Math.round(value);

  const trackHeightClass =
    density === 'dense' ? 'h-1' : density === 'compact' ? 'h-1.5' : 'h-2';
  const rowGapClass = density === 'dense' ? 'gap-1' : 'gap-1.5';
  const inputHeightClass =
    density === 'dense'
      ? 'h-4.5 text-[0.6rem] px-1'
      : density === 'compact'
        ? 'h-5 text-[0.625rem] px-1'
        : 'h-6 text-[0.6875rem] px-1.5';
  const labelTextClass =
    density === 'dense'
      ? 'text-[0.625rem]'
      : density === 'compact'
        ? 'text-[0.6875rem]'
        : 'text-xs';

  return (
    <div className={cn('grid grid-cols-[1.25rem_1fr_3.25rem] items-center', rowGapClass)}>
      <span
        className={cn('font-mono font-bold text-center select-none', labelTextClass)}
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
        className={cn('w-full cursor-pointer appearance-none rounded-full outline-hidden', trackHeightClass)}
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
        className={cn(
          'w-full rounded border border-border/80 bg-background font-mono text-foreground text-center outline-hidden focus:border-primary focus:ring-1 focus:ring-primary',
          inputHeightClass,
        )}
      />
    </div>
  );
}

export const ColorPicker = React.forwardRef<HTMLDivElement, ColorPickerProps>(
  (
    {
      className,
      value,
      color,
      defaultValue = '#1d7ae0',
      disabled = false,
      showPreview = true,
      showHex = true,
      showSwatches = true,
      size = 'default',
      mode = 'inline',
      movable = false,
      presetColors = DEFAULT_PRESET_COLORS as unknown as string[],
      onChange,
      onValueChange,
      title,
      ...props
    },
    ref,
  ) => {
    const effectiveValue = value !== undefined ? value : color;
    const isControlled = effectiveValue !== undefined;
    const [internalValue, setInternalValue] = React.useState<string>(defaultValue);
    const activeHex = normalizeHex(isControlled ? effectiveValue! : internalValue);

    const [hsva, setHsva] = React.useState<HsvColor>(() => hexToHsv(activeHex));
    const [hexDraft, setHexDraft] = React.useState<string>(activeHex);
    const [activePanel, setActivePanel] = React.useState<ColorPickerPanel>('square');

    // Independent multi-channel group toggles
    const [showRgbSliders, setShowRgbSliders] = React.useState<boolean>(true);
    const [showHsvSliders, setShowHsvSliders] = React.useState<boolean>(false);
    const [showCmykSliders, setShowCmykSliders] = React.useState<boolean>(false);
    const [showLabSliders, setShowLabSliders] = React.useState<boolean>(false);

    const [isOpen, setIsOpen] = React.useState<boolean>(false);

    // Movable drag displacement
    const [dragOffset, setDragOffset] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const dragStartRef = React.useRef<{
      startX: number;
      startY: number;
      initialX: number;
      initialY: number;
    } | null>(null);

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

    const handleTrianglePointerDown = (e: React.PointerEvent<SVGPolygonElement>) => {
      if (disabled || e.button !== 0) return;
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      updateTriangleFromCoords(e.clientX, e.clientY);
    };

    const handleTrianglePointerMove = (e: React.PointerEvent<SVGPolygonElement>) => {
      if (disabled || e.buttons !== 1) return;
      updateTriangleFromCoords(e.clientX, e.clientY);
    };

    // Blank-area dragging handlers
    const handleCardPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!movable || disabled) return;
      const target = e.target as HTMLElement | null;
      if (
        target?.closest(
          'input, button, select, textarea, [role="slider"], [role="button"], [role="tab"]',
        )
      ) {
        return;
      }
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // jsdom or unsupported browser
      }
      dragStartRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        initialX: dragOffset.x,
        initialY: dragOffset.y,
      };
    };

    const handleCardPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragStartRef.current) return;
      const dx = e.clientX - dragStartRef.current.startX;
      const dy = e.clientY - dragStartRef.current.startY;
      setDragOffset({
        x: dragStartRef.current.initialX + dx,
        y: dragStartRef.current.initialY + dy,
      });
    };

    const handleCardPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
      if (dragStartRef.current) {
        dragStartRef.current = null;
        try {
          e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
          // ignore
        }
      }
    };

    const handleCardDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!movable || disabled) return;
      const target = e.target as HTMLElement | null;
      if (
        target?.closest(
          'input, button, select, textarea, [role="slider"], [role="button"], [role="tab"]',
        )
      ) {
        return;
      }
      setDragOffset({ x: 0, y: 0 });
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
    const ringThickness = isSm ? 16 : 20;
    const innerSize = stageSize - ringThickness * 2;
    const squareInnerSize = Math.round(innerSize / Math.SQRT2);

    // Dynamic Slider Gradients reflecting current selected color
    const redGradient = `linear-gradient(90deg, rgb(0 ${Math.round(rgb.g)} ${Math.round(rgb.b)}), rgb(255 ${Math.round(rgb.g)} ${Math.round(rgb.b)}))`;
    const greenGradient = `linear-gradient(90deg, rgb(${Math.round(rgb.r)} 0 ${Math.round(rgb.b)}), rgb(${Math.round(rgb.r)} 255 ${Math.round(rgb.b)}))`;
    const blueGradient = `linear-gradient(90deg, rgb(${Math.round(rgb.r)} ${Math.round(rgb.g)} 0), rgb(${Math.round(rgb.r)} ${Math.round(rgb.g)} 255))`;

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

    // Density calculation based on active slider count
    const activeSliderCount =
      (showRgbSliders ? 3 : 0) +
      (showHsvSliders ? 3 : 0) +
      (showCmykSliders ? 4 : 0) +
      (showLabSliders ? 3 : 0);

    const sliderDensity: 'spacious' | 'compact' | 'dense' =
      activeSliderCount <= 4 ? 'spacious' : activeSliderCount <= 7 ? 'compact' : 'dense';

    // Core Picker Panel Card
    const panelContent = (
      <div
        onPointerDown={handleCardPointerDown}
        onPointerMove={handleCardPointerMove}
        onPointerUp={handleCardPointerUp}
        onDoubleClick={handleCardDoubleClick}
        style={{
          transform:
            dragOffset.x !== 0 || dragOffset.y !== 0
              ? `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0)`
              : undefined,
        }}
        className={cn(
          'flex flex-col gap-3 rounded-lg border border-border bg-card p-3.5 text-card-foreground shadow-sm transition-shadow',
          isSm ? 'w-64 text-xs' : 'w-72 text-sm',
          movable && 'cursor-grab active:cursor-grabbing',
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

            <CopyButton
              text={activeHex}
              variant="ghost"
              size="icon-xs"
              title="Copy hex code"
              aria-label="Copy hex code"
              disabled={disabled}
              className="border border-border/60 bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
            />
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
                isSm ? 'text-[0.6875rem]' : 'text-xs',
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* 3. Panel Body */}
        <div className="flex items-center justify-center min-h-52">
          {activePanel === 'square' && (
            <HueRing
              hue={hsva.h}
              onHueChange={(h) => commitColor({ ...hsva, h })}
              ariaLabel="Hue ring"
              disabled={disabled}
              sizePx={stageSize}
              thickness={ringThickness}
            >
              <div
                ref={squareRef}
                role="slider"
                aria-label="Color saturation and brightness"
                aria-valuenow={hsva.v}
                tabIndex={disabled ? -1 : 0}
                onPointerDown={handleSquarePointerDown}
                onPointerMove={handleSquarePointerMove}
                className="relative cursor-crosshair overflow-hidden select-none"
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
              thickness={ringThickness}
            >
              <svg
                ref={triangleSvgRef}
                viewBox={`0 0 ${DEFAULT_TRIANGLE_WIDTH} ${DEFAULT_TRIANGLE_HEIGHT}`}
                role="slider"
                aria-label="Triangle HSV color picker"
                tabIndex={disabled ? -1 : 0}
                className="cursor-crosshair select-none touch-none overflow-hidden"
                style={{
                  width: `${innerSize}px`,
                  height: `${innerSize}px`,
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
                  stroke="rgba(0, 0, 0, 0.15)"
                  strokeWidth="1"
                />

                <circle
                  cx={trianglePointer.x}
                  cy={trianglePointer.y}
                  r="7"
                  fill="transparent"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  className="drop-shadow-sm pointer-events-none"
                />

                <polygon
                  points={trianglePoints}
                  fill="transparent"
                  className="cursor-crosshair pointer-events-auto"
                  onPointerDown={handleTrianglePointerDown}
                  onPointerMove={handleTrianglePointerMove}
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
              <CopyButton
                text={activeHex}
                variant="ghost"
                size="icon-xs"
                title="Copy HEX color"
                aria-label="Copy HEX color"
                disabled={disabled}
                className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              />
            </div>
          </div>
        )}

        {/* 5. Channel Selector Toggle Bar (PLACED AT TOP OF SLIDERS) */}
        <div className="flex items-center justify-between gap-1 border-t border-border/40 pt-2.5">
          {[
            { id: 'rgb', label: 'RGB', active: showRgbSliders, toggle: () => setShowRgbSliders((v) => !v) },
            { id: 'hsv', label: 'HSV', active: showHsvSliders, toggle: () => setShowHsvSliders((v) => !v) },
            { id: 'cmyk', label: 'CMYK', active: showCmykSliders, toggle: () => setShowCmykSliders((v) => !v) },
            { id: 'lab', label: 'LAB', active: showLabSliders, toggle: () => setShowLabSliders((v) => !v) },
          ].map((ch) => (
            <button
              key={ch.id}
              type="button"
              disabled={disabled}
              onClick={ch.toggle}
              aria-pressed={ch.active}
              className={cn(
                'flex-1 rounded py-1 text-center font-semibold text-[0.6875rem] transition-all select-none border',
                ch.active
                  ? 'border-primary/40 bg-primary/10 text-primary shadow-2xs font-bold'
                  : 'border-transparent text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {ch.label}
            </button>
          ))}
        </div>

        {/* 6. Dynamic Sliders List */}
        <div className="flex flex-col gap-2">
          {/* RGB Sliders */}
          {showRgbSliders && (
            <div className="flex flex-col gap-1.5 rounded-md bg-muted/40 p-2" aria-label="RGB channels">
              <ColorChannelSlider
                label="R"
                labelColor="#ef4444"
                min={0}
                max={255}
                value={rgb.r}
                gradient={redGradient}
                density={sliderDensity}
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
                density={sliderDensity}
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
                density={sliderDensity}
                disabled={disabled}
                onChange={(val) => commitHex(rgbToHex({ ...rgb, b: val }))}
              />
            </div>
          )}

          {/* HSV Sliders */}
          {showHsvSliders && (
            <div className="flex flex-col gap-1.5 rounded-md bg-muted/40 p-2" aria-label="HSV channels">
              <ColorChannelSlider
                label="H"
                labelColor="#eab308"
                min={0}
                max={360}
                value={hsva.h}
                gradient={hueGradient}
                density={sliderDensity}
                disabled={disabled}
                onChange={(val) => commitColor({ ...hsva, h: val })}
              />
              <ColorChannelSlider
                label="S"
                labelColor="#ec4899"
                min={0}
                max={100}
                value={hsva.s}
                gradient={satGradient}
                density={sliderDensity}
                disabled={disabled}
                onChange={(val) => commitColor({ ...hsva, s: val })}
              />
              <ColorChannelSlider
                label="V"
                labelColor="#8b5cf6"
                min={0}
                max={100}
                value={hsva.v}
                gradient={valGradient}
                density={sliderDensity}
                disabled={disabled}
                onChange={(val) => commitColor({ ...hsva, v: val })}
              />
            </div>
          )}

          {/* CMYK Sliders */}
          {showCmykSliders && (
            <div className="flex flex-col gap-1.5 rounded-md bg-muted/40 p-2" aria-label="CMYK channels">
              <ColorChannelSlider
                label="C"
                labelColor="#06b6d4"
                min={0}
                max={100}
                value={cmyk.c}
                gradient={cyanGradient}
                density={sliderDensity}
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
                density={sliderDensity}
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
                density={sliderDensity}
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
                density={sliderDensity}
                disabled={disabled}
                onChange={(val) => commitHex(rgbToHex(cmykToRgb({ ...cmyk, k: val })))}
              />
            </div>
          )}

          {/* CIELAB Sliders */}
          {showLabSliders && (
            <div className="flex flex-col gap-1.5 rounded-md bg-muted/40 p-2" aria-label="LAB channels">
              <ColorChannelSlider
                label="L"
                labelColor="#a1a1aa"
                min={0}
                max={100}
                value={lab.l}
                gradient={labLGradient}
                density={sliderDensity}
                disabled={disabled}
                onChange={(val) => commitHex(rgbToHex(labToRgb({ ...lab, l: val })))}
              />
              <ColorChannelSlider
                label="A"
                labelColor="#f43f5e"
                min={-128}
                max={127}
                value={lab.a}
                gradient={labAGradient}
                density={sliderDensity}
                disabled={disabled}
                onChange={(val) => commitHex(rgbToHex(labToRgb({ ...lab, a: val })))}
              />
              <ColorChannelSlider
                label="B"
                labelColor="#3b82f6"
                min={-128}
                max={127}
                value={lab.b}
                gradient={labBGradient}
                density={sliderDensity}
                disabled={disabled}
                onChange={(val) => commitHex(rgbToHex(labToRgb({ ...lab, b: val })))}
              />
            </div>
          )}
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
              'inline-flex items-center gap-2 rounded-md border border-border bg-background text-foreground px-3 font-mono shadow-xs transition-colors hover:bg-muted/50 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring select-none cursor-pointer',
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
