import * as React from 'react';
import { cn } from '../lib/utils';
import {
  clamp,
  cmykToRgb,
  hexToHsv,
  hsvToHex,
  hsvToRgb,
  hsvToTriangleWeights,
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
export type ColorPickerPanel = 'square' | 'triangle' | 'swatches';
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
    const [channelMode, setChannelMode] = React.useState<ColorChannelMode>('rgb');
    const [showChannels, setShowChannels] = React.useState<boolean>(false);
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
          <button
            type="button"
            disabled={disabled}
            onClick={() => setActivePanel('square')}
            className={cn(
              'flex-1 rounded py-1 text-center font-medium transition-all select-none',
              activePanel === 'square'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
              isSm ? 'text-[11px]' : 'text-xs',
            )}
          >
            Square
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => setActivePanel('triangle')}
            className={cn(
              'flex-1 rounded py-1 text-center font-medium transition-all select-none',
              activePanel === 'triangle'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
              isSm ? 'text-[11px]' : 'text-xs',
            )}
          >
            Triangle
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => setActivePanel('swatches')}
            className={cn(
              'flex-1 rounded py-1 text-center font-medium transition-all select-none',
              activePanel === 'swatches'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
              isSm ? 'text-[11px]' : 'text-xs',
            )}
          >
            Swatches
          </button>
        </div>

        {/* 3. Panel Body */}
        {activePanel === 'square' && (
          <div className="flex flex-col gap-2.5">
            {/* 2D Saturation / Value Canvas */}
            <div
              ref={squareRef}
              role="slider"
              aria-label="Color saturation and brightness"
              aria-valuenow={hsva.v}
              tabIndex={disabled ? -1 : 0}
              onPointerDown={handleSquarePointerDown}
              onPointerMove={handleSquarePointerMove}
              className={cn(
                'relative w-full cursor-crosshair overflow-hidden rounded-md border border-border/60 shadow-inner select-none',
                isSm ? 'h-32' : 'h-36',
              )}
              style={{
                backgroundColor: `hsl(${hsva.h}, 100%, 50%)`,
                backgroundImage:
                  'linear-gradient(to top, #000000 0%, transparent 100%), linear-gradient(to right, #ffffff 0%, transparent 100%)',
              }}
            >
              {/* Draggable thumb */}
              <div
                className="absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md ring-1 ring-black/40 pointer-events-none transition-transform"
                style={{
                  left: `${hsva.s}%`,
                  top: `${100 - hsva.v}%`,
                  backgroundColor: activeHex,
                }}
              />
            </div>

            {/* Horizontal Hue Slider */}
            <div className="flex flex-col gap-1">
              <input
                type="range"
                min={0}
                max={360}
                step={1}
                disabled={disabled}
                value={hsva.h}
                aria-label="Color hue"
                onChange={(e) =>
                  commitColor({ ...hsva, h: Number(e.target.value) })
                }
                className="h-3 w-full cursor-pointer appearance-none rounded-full outline-hidden"
                style={{
                  background:
                    'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
                }}
              />
            </div>
          </div>
        )}

        {activePanel === 'triangle' && (
          <div className="flex flex-col items-center gap-2.5">
            <svg
              ref={triangleSvgRef}
              viewBox={`0 0 ${DEFAULT_TRIANGLE_WIDTH} ${DEFAULT_TRIANGLE_HEIGHT}`}
              role="slider"
              aria-label="Triangle HSV color picker"
              tabIndex={disabled ? -1 : 0}
              onPointerDown={handleTrianglePointerDown}
              onPointerMove={handleTrianglePointerMove}
              className={cn(
                'cursor-crosshair select-none touch-none',
                isSm ? 'h-32 w-48' : 'h-36 w-56',
              )}
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

              {/* Polygons */}
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

              {/* Draggable Circle Pointer */}
              <circle
                cx={trianglePointer.x}
                cy={trianglePointer.y}
                r="7"
                fill={activeHex}
                stroke="#ffffff"
                strokeWidth="2"
                className="drop-shadow-sm pointer-events-none"
              />
            </svg>

            {/* Horizontal Hue Slider */}
            <input
              type="range"
              min={0}
              max={360}
              step={1}
              disabled={disabled}
              value={hsva.h}
              aria-label="Color hue"
              onChange={(e) =>
                commitColor({ ...hsva, h: Number(e.target.value) })
              }
              className="h-3 w-full cursor-pointer appearance-none rounded-full outline-hidden"
              style={{
                background:
                  'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
              }}
            />
          </div>
        )}

        {activePanel === 'swatches' && (
          <div className="grid grid-cols-8 gap-1.5 py-1">
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

        {/* 4. Hex Input Row */}
        {showHex && (
          <div className="flex items-center gap-2 border-t border-border/40 pt-2.5">
            <span className="text-xs font-semibold uppercase text-muted-foreground w-8">
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
                title="Copy HEX"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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

        {/* 5. Channel Sliders Toggle Section */}
        <div className="flex flex-col gap-2 border-t border-border/40 pt-2">
          <div className="flex items-center justify-between">
            <button
              type="button"
              disabled={disabled}
              onClick={() => setShowChannels(!showChannels)}
              className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Color Channels</span>
              <ChevronDownIcon
                className={cn('size-3 transition-transform', showChannels && 'rotate-180')}
              />
            </button>

            {showChannels && (
              <div className="flex items-center gap-1">
                {(['rgb', 'hsv', 'cmyk', 'lab'] as const).map((modeKey) => (
                  <button
                    key={modeKey}
                    type="button"
                    disabled={disabled}
                    onClick={() => setChannelMode(modeKey)}
                    className={cn(
                      'rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase transition-colors',
                      channelMode === modeKey
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {modeKey}
                  </button>
                ))}
              </div>
            )}
          </div>

          {showChannels && (
            <div className="flex flex-col gap-2 rounded-md bg-muted/40 p-2 text-xs">
              {channelMode === 'rgb' && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="w-3 font-mono font-semibold text-muted-foreground">R</span>
                    <input
                      type="range"
                      min={0}
                      max={255}
                      value={rgb.r}
                      disabled={disabled}
                      onChange={(e) =>
                        commitHex(rgbToHex({ ...rgb, r: Number(e.target.value) }))
                      }
                      className="h-2 flex-1 cursor-pointer appearance-none rounded-full"
                      style={{
                        background: `linear-gradient(to right, rgb(0, ${rgb.g}, ${rgb.b}), rgb(255, ${rgb.g}, ${rgb.b}))`,
                      }}
                    />
                    <span className="w-7 text-right font-mono text-[11px]">{rgb.r}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 font-mono font-semibold text-muted-foreground">G</span>
                    <input
                      type="range"
                      min={0}
                      max={255}
                      value={rgb.g}
                      disabled={disabled}
                      onChange={(e) =>
                        commitHex(rgbToHex({ ...rgb, g: Number(e.target.value) }))
                      }
                      className="h-2 flex-1 cursor-pointer appearance-none rounded-full"
                      style={{
                        background: `linear-gradient(to right, rgb(${rgb.r}, 0, ${rgb.b}), rgb(${rgb.r}, 255, ${rgb.b}))`,
                      }}
                    />
                    <span className="w-7 text-right font-mono text-[11px]">{rgb.g}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 font-mono font-semibold text-muted-foreground">B</span>
                    <input
                      type="range"
                      min={0}
                      max={255}
                      value={rgb.b}
                      disabled={disabled}
                      onChange={(e) =>
                        commitHex(rgbToHex({ ...rgb, b: Number(e.target.value) }))
                      }
                      className="h-2 flex-1 cursor-pointer appearance-none rounded-full"
                      style={{
                        background: `linear-gradient(to right, rgb(${rgb.r}, ${rgb.g}, 0), rgb(${rgb.r}, ${rgb.g}, 255))`,
                      }}
                    />
                    <span className="w-7 text-right font-mono text-[11px]">{rgb.b}</span>
                  </div>
                </>
              )}

              {channelMode === 'hsv' && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="w-3 font-mono font-semibold text-muted-foreground">H</span>
                    <input
                      type="range"
                      min={0}
                      max={360}
                      value={hsva.h}
                      disabled={disabled}
                      onChange={(e) =>
                        commitColor({ ...hsva, h: Number(e.target.value) })
                      }
                      className="h-2 flex-1 cursor-pointer appearance-none rounded-full"
                      style={{
                        background:
                          'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)',
                      }}
                    />
                    <span className="w-7 text-right font-mono text-[11px]">{hsva.h}°</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 font-mono font-semibold text-muted-foreground">S</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={hsva.s}
                      disabled={disabled}
                      onChange={(e) =>
                        commitColor({ ...hsva, s: Number(e.target.value) })
                      }
                      className="h-2 flex-1 cursor-pointer appearance-none rounded-full"
                      style={{
                        background: `linear-gradient(to right, ${hsvToHex({ ...hsva, s: 0 })}, ${hsvToHex({ ...hsva, s: 100 })})`,
                      }}
                    />
                    <span className="w-7 text-right font-mono text-[11px]">{hsva.s}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 font-mono font-semibold text-muted-foreground">V</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={hsva.v}
                      disabled={disabled}
                      onChange={(e) =>
                        commitColor({ ...hsva, v: Number(e.target.value) })
                      }
                      className="h-2 flex-1 cursor-pointer appearance-none rounded-full"
                      style={{
                        background: `linear-gradient(to right, #000000, ${hsvToHex({ ...hsva, v: 100 })})`,
                      }}
                    />
                    <span className="w-7 text-right font-mono text-[11px]">{hsva.v}%</span>
                  </div>
                </>
              )}

              {channelMode === 'cmyk' && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="w-3 font-mono font-semibold text-muted-foreground">C</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={Math.round(cmyk.c)}
                      disabled={disabled}
                      onChange={(e) =>
                        commitHex(
                          rgbToHex(cmykToRgb({ ...cmyk, c: Number(e.target.value) })),
                        )
                      }
                      className="h-2 flex-1 cursor-pointer appearance-none rounded-full"
                    />
                    <span className="w-7 text-right font-mono text-[11px]">{Math.round(cmyk.c)}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 font-mono font-semibold text-muted-foreground">M</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={Math.round(cmyk.m)}
                      disabled={disabled}
                      onChange={(e) =>
                        commitHex(
                          rgbToHex(cmykToRgb({ ...cmyk, m: Number(e.target.value) })),
                        )
                      }
                      className="h-2 flex-1 cursor-pointer appearance-none rounded-full"
                    />
                    <span className="w-7 text-right font-mono text-[11px]">{Math.round(cmyk.m)}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 font-mono font-semibold text-muted-foreground">Y</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={Math.round(cmyk.y)}
                      disabled={disabled}
                      onChange={(e) =>
                        commitHex(
                          rgbToHex(cmykToRgb({ ...cmyk, y: Number(e.target.value) })),
                        )
                      }
                      className="h-2 flex-1 cursor-pointer appearance-none rounded-full"
                    />
                    <span className="w-7 text-right font-mono text-[11px]">{Math.round(cmyk.y)}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 font-mono font-semibold text-muted-foreground">K</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={Math.round(cmyk.k)}
                      disabled={disabled}
                      onChange={(e) =>
                        commitHex(
                          rgbToHex(cmykToRgb({ ...cmyk, k: Number(e.target.value) })),
                        )
                      }
                      className="h-2 flex-1 cursor-pointer appearance-none rounded-full"
                    />
                    <span className="w-7 text-right font-mono text-[11px]">{Math.round(cmyk.k)}%</span>
                  </div>
                </>
              )}

              {channelMode === 'lab' && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="w-3 font-mono font-semibold text-muted-foreground">L</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={Math.round(lab.l)}
                      disabled={disabled}
                      onChange={(e) =>
                        commitHex(
                          rgbToHex(labToRgb({ ...lab, l: Number(e.target.value) })),
                        )
                      }
                      className="h-2 flex-1 cursor-pointer appearance-none rounded-full"
                    />
                    <span className="w-7 text-right font-mono text-[11px]">{Math.round(lab.l)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 font-mono font-semibold text-muted-foreground">A</span>
                    <input
                      type="range"
                      min={-128}
                      max={127}
                      value={Math.round(lab.a)}
                      disabled={disabled}
                      onChange={(e) =>
                        commitHex(
                          rgbToHex(labToRgb({ ...lab, a: Number(e.target.value) })),
                        )
                      }
                      className="h-2 flex-1 cursor-pointer appearance-none rounded-full"
                    />
                    <span className="w-7 text-right font-mono text-[11px]">{Math.round(lab.a)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 font-mono font-semibold text-muted-foreground">B</span>
                    <input
                      type="range"
                      min={-128}
                      max={127}
                      value={Math.round(lab.b)}
                      disabled={disabled}
                      onChange={(e) =>
                        commitHex(
                          rgbToHex(labToRgb({ ...lab, b: Number(e.target.value) })),
                        )
                      }
                      className="h-2 flex-1 cursor-pointer appearance-none rounded-full"
                    />
                    <span className="w-7 text-right font-mono text-[11px]">{Math.round(lab.b)}</span>
                  </div>
                </>
              )}
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
