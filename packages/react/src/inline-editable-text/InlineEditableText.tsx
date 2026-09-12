import * as React from 'react';
import { CheckIcon, PencilIcon } from '../lib/icons';
import { cn } from '../lib/utils';

export type InlineEditableTextSize = 'default' | 'sm';
export type InlineEditableTextTrigger = 'click' | 'doubleClick';

export interface InlineEditableTextProps {
  /** Current display value */
  value: string;
  /** Save callback. Return false to indicate validation failure and keep editing */
  onSave?: (newValue: string) => void | boolean | Promise<void | boolean>;
  /** Alias for save callback */
  onValueChange?: (newValue: string) => void;
  /** Alias for save callback */
  onChange?: (newValue: string) => void;
  /** Placeholder text when value is empty */
  placeholder?: string;
  /** Hover tooltip hint (e.g. "Click to edit") */
  hint?: string;
  /** Interaction trigger to enter edit mode (default: "click") */
  trigger?: InlineEditableTextTrigger;
  /** Sizing variant ('default' | 'sm') */
  size?: InlineEditableTextSize;
  /** Typography classes for the text / input (default: "text-base font-medium") */
  textClassName?: string;
  /** Container class name */
  className?: string;
  /** Whether editing is disabled */
  disabled?: boolean;
}

export function InlineEditableText({
  value,
  onSave,
  onValueChange,
  onChange,
  placeholder,
  hint,
  trigger = 'click',
  size = 'default',
  textClassName,
  className,
  disabled = false,
}: InlineEditableTextProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const enterEditingTimeRef = React.useRef(0);

  React.useEffect(() => {
    if (isEditing) {
      setDraft(value);
      requestAnimationFrame(() => inputRef.current?.select());
    }
  }, [isEditing, value]);

  const handleSubmit = async () => {
    const trimmed = draft.trim();
    if (!trimmed || trimmed === value) {
      setIsEditing(false);
      return;
    }
    const result = await onSave?.(trimmed);
    if (result !== false) {
      onValueChange?.(trimmed);
      onChange?.(trimmed);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setDraft(value);
    setIsEditing(false);
  };

  const handleBlur = (e: React.FocusEvent) => {
    // If focus moved to one of the edit action buttons, don't submit yet
    if (e.relatedTarget && (e.currentTarget.parentElement?.contains(e.relatedTarget as Node))) {
      return;
    }
    // Ignore blur if it happened immediately upon clicking into edit mode
    if (Date.now() - enterEditingTimeRef.current < 200) {
      inputRef.current?.focus();
      return;
    }
    void handleSubmit();
  };

  const isSm = size === 'sm';
  const defaultTextClass = isSm ? 'text-xs font-medium' : 'text-base font-medium';

  const startEditing = (e: React.SyntheticEvent) => {
    if (disabled) return;
    e.stopPropagation();
    enterEditingTimeRef.current = Date.now();
    setIsEditing(true);
  };

  if (isEditing && !disabled) {
    return (
      <span
        data-slot="inline-editable-text"
        data-state="editing"
        className={cn(
          'flex min-w-0 max-w-full items-center gap-1.5 rounded-md px-1 py-0',
          className,
        )}
      >
        <input
          ref={inputRef}
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              void handleSubmit();
            } else if (e.key === 'Escape') {
              e.preventDefault();
              handleCancel();
            }
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            'min-w-0 rounded-none border-0 border-b border-primary/60 bg-transparent px-0 py-0 outline-none focus-visible:border-primary',
            textClassName ?? defaultTextClass,
          )}
        />
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            tabIndex={-1}
            aria-label="Confirm edit"
            onClick={(e) => {
              e.stopPropagation();
              void handleSubmit();
            }}
            className="flex size-5 cursor-pointer items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <CheckIcon className={isSm ? 'size-3' : 'size-3.5'} />
          </button>
          <button
            type="button"
            tabIndex={-1}
            aria-label="Cancel edit"
            onClick={(e) => {
              e.stopPropagation();
              handleCancel();
            }}
            className="flex size-5 cursor-pointer items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <span className="text-xs leading-none font-semibold">✕</span>
          </button>
        </div>
      </span>
    );
  }

  return (
    <button
      type="button"
      data-slot="inline-editable-text"
      data-state="display"
      disabled={disabled}
      title={hint}
      onClick={trigger === 'click' ? startEditing : undefined}
      onDoubleClick={trigger === 'doubleClick' ? startEditing : undefined}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          startEditing(e);
        }
      }}
      onPointerDown={disabled ? undefined : (e) => e.stopPropagation()}
      className={cn(
        'group/editable-text flex min-w-0 max-w-full items-center gap-1.5 rounded-md px-1 text-left transition-colors duration-quick ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
        !disabled && 'cursor-text hover:bg-muted/60',
        className,
      )}
    >
      <span className={cn('truncate', textClassName ?? defaultTextClass)}>
        {value || placeholder}
      </span>
      {!disabled && (
        <PencilIcon
          className={cn(
            'shrink-0 text-muted-foreground/0 transition-colors duration-quick ease-standard group-hover/editable-text:text-muted-foreground/70',
            isSm ? 'size-3' : 'size-3.5',
          )}
        />
      )}
    </button>
  );
}
