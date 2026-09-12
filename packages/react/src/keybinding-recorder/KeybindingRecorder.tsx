import * as React from 'react';
import { Badge } from '../badge/Badge';
import { Button } from '../button/Button';
import { KeyboardIcon, XIcon } from '../lib/icons';
import { cn } from '../lib/utils';

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
  className,
}: KeybindingRecorderProps) {
  const [isRecording, setIsRecording] = React.useState(false);
  const parsedValue = React.useMemo(() => parseKeybinding(value), [value]);
  const [draft, setDraft] = React.useState<KeybindingValue>(parsedValue);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setDraft(parseKeybinding(value));
  }, [value]);

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

  const renderBadges = (binding: KeybindingValue) => {
    if (!binding.code && !binding.ctrl && !binding.alt && !binding.shift && !binding.meta) {
      return <span className="text-xs text-muted-foreground">{placeholder}</span>;
    }

    const labels: string[] = [];
    if (binding.ctrl) labels.push('Ctrl');
    if (binding.alt) labels.push('Alt');
    if (binding.shift) labels.push('Shift');
    if (binding.meta) labels.push('Win');

    const primaryKey = binding.code.replace(/^Key/, '').replace(/^Digit/, '');
    if (primaryKey) {
      labels.push(primaryKey);
    }

    return (
      <div className="flex flex-wrap items-center gap-1">
        {labels.map((label, idx) => (
          <Badge
            key={`${label}-${idx}`}
            variant="secondary"
            className={cn(
              'font-mono font-semibold shadow-2xs',
              isSm ? 'px-1.5 py-0 text-[0.6875rem]' : 'px-2 py-0.5 text-xs',
            )}
          >
            {label}
          </Badge>
        ))}
      </div>
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
        'relative flex w-full cursor-pointer select-none items-center justify-between gap-2 rounded-md border border-input bg-background text-foreground transition-colors duration-quick ease-standard',
        isSm ? 'min-h-7 px-2 py-1 text-xs' : 'min-h-9 px-3 py-1.5 text-sm',
        isRecording
          ? 'animate-pulse border-primary bg-primary/5 ring-2 ring-primary/30'
          : 'hover:border-primary/50',
        disabled && 'pointer-events-none cursor-not-allowed opacity-50',
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <KeyboardIcon
          className={cn(
            'shrink-0 text-muted-foreground',
            isSm ? 'size-3.5' : 'size-4',
            isRecording && 'animate-bounce text-primary',
          )}
        />
        {isRecording ? (
          <span className="text-xs font-medium text-primary">{recordingText}</span>
        ) : (
          renderBadges(draft)
        )}
      </div>

      {!isRecording && clearable && (draft.code || draft.ctrl || draft.alt || draft.shift || draft.meta) && !disabled && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={handleClear}
          className="size-5 rounded-full hover:bg-muted"
          title="Clear keybinding"
          aria-label="Clear keybinding"
        >
          <XIcon className="size-3 text-muted-foreground" />
        </Button>
      )}
    </div>
  );
}
