import * as React from 'react';
import { Badge } from '../badge/Badge';
import { Button } from '../button/Button';
import { useChaSetI18n } from '../i18n';
import { Kbd } from '../kbd/Kbd';
import { KeyboardIcon, XIcon } from '../lib/icons';
import { cn } from '../lib/utils';
import { Tooltip } from '../tooltip/Tooltip';

export interface KeybindingValue {
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
  meta: boolean;
  code: string;
}

export type KeybindingRecorderSize = 'default' | 'sm';

export function parseKeybinding(input: string | KeybindingValue): KeybindingValue {
  if (!input) {
    return { ctrl: false, alt: false, shift: false, meta: false, code: '' };
  }
  if (typeof input !== 'string') {
    return {
      ctrl: Boolean(input.ctrl),
      alt: Boolean(input.alt),
      shift: Boolean(input.shift),
      meta: Boolean(input.meta),
      code: input.code || '',
    };
  }
  const parts = input.split('+').map((s) => s.trim().toLowerCase());
  const ctrl = parts.includes('ctrl') || parts.includes('control');
  const alt = parts.includes('alt');
  const shift = parts.includes('shift');
  const meta = parts.includes('meta') || parts.includes('cmd') || parts.includes('win');
  const nonMod = parts.filter(
    (s) => !['ctrl', 'control', 'alt', 'shift', 'meta', 'cmd', 'win'].includes(s),
  );
  const rawKey = nonMod[0] || '';
  const code = rawKey.length === 1 ? `Key${rawKey.toUpperCase()}` : rawKey;
  return { ctrl, alt, shift, meta, code };
}

export function formatKeybinding(binding: KeybindingValue): string {
  const parts: string[] = [];
  if (binding.ctrl) parts.push('Ctrl');
  if (binding.alt) parts.push('Alt');
  if (binding.shift) parts.push('Shift');
  if (binding.meta) parts.push('Win');

  const primaryKey = binding.code.replace(/^Key/, '').replace(/^Digit/, '');
  if (primaryKey) {
    parts.push(primaryKey);
  }
  return parts.join('+');
}

export interface KeybindingRecorderProps {
  /** Current key combination value (as structured object or shortcut string like 'Ctrl+K') */
  value: KeybindingValue | string;
  /** Callback fired when keybinding changes */
  onChange?: (value: KeybindingValue, stringValue: string) => void;
  /** Alias for onChange, receives string if value was string, or KeybindingValue if value was object */
  onValueChange?: (value: KeybindingValue | string) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Whether to show clear button when a shortcut is set (default: true) */
  clearable?: boolean;
  /** Sizing variant ('default' | 'sm') */
  size?: KeybindingRecorderSize;
  /** Text when no keybinding is configured */
  placeholder?: string;
  /** Prompt displayed during active recording */
  recordingText?: string;
  /** Auto start recording on mount */
  autoRecord?: boolean;
  /** Container class name */
  className?: string;
}

export function KeybindingRecorder({
  value,
  onChange,
  onValueChange,
  disabled = false,
  clearable = true,
  size = 'default',
  placeholder = 'No keybinding set',
  recordingText = 'Press key combination (Esc to cancel)...',
  autoRecord = false,
  className,
}: KeybindingRecorderProps) {
  const { t } = useChaSetI18n();
  const [isRecording, setIsRecording] = React.useState(autoRecord);
  const parsedValue = React.useMemo(() => parseKeybinding(value), [value]);
  const [draft, setDraft] = React.useState<KeybindingValue>(parsedValue);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [recorderWidth, setRecorderWidth] = React.useState<number | null>(null);

  React.useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      setRecorderWidth(el.clientWidth);
    };
    measure();

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, []);

  React.useEffect(() => {
    setDraft(parseKeybinding(value));
  }, [value]);

  React.useEffect(() => {
    if (autoRecord && !disabled) {
      setIsRecording(true);
      containerRef.current?.focus();
    }
  }, [autoRecord, disabled]);

  const startRecording = React.useCallback(() => {
    if (disabled) return;
    setIsRecording(true);
  }, [disabled]);

  const stopRecording = React.useCallback(() => {
    setIsRecording(false);
  }, []);

  const notifyChange = React.useCallback(
    (nextValue: KeybindingValue) => {
      const str = formatKeybinding(nextValue);
      onChange?.(nextValue, str);
      onValueChange?.(typeof value === 'string' ? str : nextValue);
    },
    [onChange, onValueChange, value],
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (!isRecording || disabled) return;

      e.preventDefault();
      e.stopPropagation();

      const key = e.key;
      const code = e.code;

      if (['Control', 'Alt', 'Shift', 'Meta'].includes(key)) {
        return;
      }

      if (code === 'Escape') {
        stopRecording();
        return;
      }

      const nextValue: KeybindingValue = {
        ctrl: e.ctrlKey,
        alt: e.altKey,
        shift: e.shiftKey,
        meta: e.metaKey,
        code,
      };

      setDraft(nextValue);
      notifyChange(nextValue);
      stopRecording();
    },
    [isRecording, disabled, stopRecording, notifyChange],
  );

  const handleClear = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const emptyValue: KeybindingValue = {
        ctrl: false,
        alt: false,
        shift: false,
        meta: false,
        code: '',
      };
      setDraft(emptyValue);
      notifyChange(emptyValue);
    },
    [notifyChange],
  );

  const isSm = size === 'sm';
  const hasValue = Boolean(draft.code || draft.ctrl || draft.alt || draft.shift || draft.meta);
  const showClear = !isRecording && clearable && hasValue && !disabled;
  const shortcutStr = formatKeybinding(draft);

  const availableBadgeWidth = React.useMemo(() => {
    if (recorderWidth === null || recorderWidth <= 0) return undefined;
    const pad = isSm ? 16 : 24;
    const iconW = isSm ? 22 : 24;
    const clearW = showClear ? 28 : 0;
    return Math.max(20, recorderWidth - pad - iconW - clearW);
  }, [recorderWidth, isSm, showClear]);

  const tooltipTitle = isRecording
    ? t('components.keybindingRecorder.recordingPrompt', 'Recording key combination (Esc to cancel)')
    : hasValue
      ? `${t('components.keybindingRecorder.currentBinding', 'Current shortcut: ')}${shortcutStr}`
      : t('components.keybindingRecorder.noBinding', 'No keybinding set');

  const tooltipDesc = !isRecording
    ? t('components.keybindingRecorder.clickToRecordHint', 'Click to record shortcut')
    : undefined;

  const recorderTooltipContent = (
    <div className="flex flex-col gap-0.5">
      <span className="font-semibold text-xs text-popover-foreground">{tooltipTitle}</span>
      {tooltipDesc && <span className="text-caption text-muted-foreground">{tooltipDesc}</span>}
    </div>
  );

  const renderBadges = (binding: KeybindingValue) => {
    if (!binding.code && !binding.ctrl && !binding.alt && !binding.shift && !binding.meta) {
      return <span className="truncate text-xs text-muted-foreground">{placeholder}</span>;
    }

    return (
      <Kbd
        shortcut={shortcutStr}
        size={isSm ? 'sm' : 'default'}
        compact="auto"
        availableWidth={availableBadgeWidth}
        variant="outline"
      />
    );
  };

  return (
    <div
      ref={containerRef}
      role="button"
      tabIndex={disabled ? -1 : 0}
      data-slot="keybinding-recorder"
      data-state={isRecording ? 'recording' : 'idle'}
      onClick={startRecording}
      onBlur={stopRecording}
      onKeyDown={handleKeyDown}
      className={cn(
        'relative flex w-full cursor-pointer select-none items-center justify-between gap-2 rounded-md border border-input bg-muted/40 text-foreground transition-colors duration-quick ease-standard',
        isSm ? 'min-h-7 px-2 py-1 text-xs' : 'min-h-9 px-3 py-1.5 text-sm',
        isRecording
          ? 'animate-pulse border-primary bg-primary/10 ring-2 ring-primary/30'
          : 'hover:border-primary/50 hover:bg-muted/60',
        disabled && 'pointer-events-none cursor-not-allowed opacity-50',
        className,
      )}
    >
      <Tooltip
        content={recorderTooltipContent}
        side="top"
        delayDuration={250}
        disabled={disabled}
        className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden"
      >
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
          <KeyboardIcon
            className={cn(
              'shrink-0 text-muted-foreground',
              isSm ? 'size-3.5' : 'size-4',
              isRecording && 'animate-bounce text-primary',
            )}
          />
          {isRecording ? (
            <span className="truncate text-xs font-medium text-primary">{recordingText}</span>
          ) : (
            renderBadges(draft)
          )}
        </div>
      </Tooltip>

      {showClear && (
        <Tooltip
          content={t('components.keybindingRecorder.clearShortcut', 'Clear keybinding')}
          side="top"
          delayDuration={250}
        >
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={handleClear}
            className="size-5 rounded-full hover:bg-muted shrink-0"
            aria-label={t('components.keybindingRecorder.clearShortcut', 'Clear keybinding')}
          >
            <XIcon className="size-3 text-muted-foreground" />
          </Button>
        </Tooltip>
      )}
    </div>
  );
}
