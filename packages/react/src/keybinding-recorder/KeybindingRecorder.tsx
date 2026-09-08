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

export interface KeybindingRecorderProps {
  /** Current key combination value */
  value: KeybindingValue;
  /** Callback fired when keybinding changes */
  onChange: (value: KeybindingValue) => void;
  /** Disabled state */
  disabled?: boolean;
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
  disabled = false,
  placeholder = 'No keybinding set',
  recordingText = 'Press key combination (Esc to cancel)...',
  className,
}: KeybindingRecorderProps) {
  const [isRecording, setIsRecording] = React.useState(false);
  const [draft, setDraft] = React.useState<KeybindingValue>(value);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setDraft(value);
  }, [value]);

  const startRecording = React.useCallback(() => {
    if (disabled) return;
    setIsRecording(true);
  }, [disabled]);

  const stopRecording = React.useCallback(() => {
    setIsRecording(false);
  }, []);

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
      onChange(nextValue);
      stopRecording();
    },
    [isRecording, disabled, stopRecording, onChange],
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
      onChange(emptyValue);
    },
    [onChange],
  );

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
            className="px-2 py-0.5 font-mono text-xs font-semibold shadow-2xs"
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
        'relative flex min-h-9 w-full cursor-pointer select-none items-center justify-between gap-2 rounded-md border border-input bg-background text-foreground px-3 py-1.5 text-sm transition-colors',
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
            'size-4 shrink-0 text-muted-foreground',
            isRecording && 'animate-bounce text-primary',
          )}
        />
        {isRecording ? (
          <span className="text-xs font-medium text-primary">{recordingText}</span>
        ) : (
          renderBadges(draft)
        )}
      </div>

      {!isRecording && draft.code && !disabled && (
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
