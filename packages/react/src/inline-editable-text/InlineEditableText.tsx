import * as React from 'react';
import { PencilIcon } from '../lib/icons';
import { cn } from '../lib/utils';

export interface InlineEditableTextProps {
  /** Current display value */
  value: string;
  /** Save callback. Return false to indicate validation failure and keep editing */
  onSave: (newValue: string) => void | boolean | Promise<void | boolean>;
  /** Placeholder text when value is empty */
  placeholder?: string;
  /** Hover tooltip hint (e.g. "Click to edit") */
  hint?: string;
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
  placeholder,
  hint,
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
    const result = await onSave(trimmed);
    if (result !== false) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setDraft(value);
    setIsEditing(false);
  };

  const handleBlur = () => {
    // Ignore blur if it happened immediately upon clicking into edit mode
    if (Date.now() - enterEditingTimeRef.current < 200) {
      inputRef.current?.focus();
      return;
    }
    void handleSubmit();
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
            textClassName ?? 'text-base font-medium',
          )}
        />
        <PencilIcon className="size-3.5 shrink-0 text-muted-foreground/40" />
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
      onClick={(e) => {
        if (disabled) return;
        e.stopPropagation();
        enterEditingTimeRef.current = Date.now();
        setIsEditing(true);
      }}
      onPointerDown={disabled ? undefined : (e) => e.stopPropagation()}
      className={cn(
        'group/editable-text flex min-w-0 max-w-full items-center gap-1.5 rounded-md px-1 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
        !disabled && 'cursor-text hover:bg-muted/60',
        className,
      )}
    >
      <span className={cn('truncate', textClassName ?? 'text-base font-medium')}>
        {value || placeholder}
      </span>
      {!disabled && (
        <PencilIcon className="size-3.5 shrink-0 text-muted-foreground/0 transition-colors group-hover/editable-text:text-muted-foreground/70" />
      )}
    </button>
  );
}
