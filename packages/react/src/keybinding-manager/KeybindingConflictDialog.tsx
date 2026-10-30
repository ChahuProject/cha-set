import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../dialog';
import { Button } from '../button';
import { Badge } from '../badge';
import { AlertTriangleIcon } from '../lib/icons';
import { cn } from '../lib/utils';
import { useChaSetI18n } from '../i18n';
import type { KeybindingActionItem, KeybindingConflictOccupier } from './types';

export interface KeybindingConflictDialogProps {
  action: KeybindingActionItem | null;
  chordString: string;
  occupiers: KeybindingConflictOccupier[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResolveWithAction?: (actionId: string) => void;
}

export function KeybindingConflictDialog({
  action,
  chordString,
  occupiers,
  open,
  onOpenChange,
}: KeybindingConflictDialogProps) {
  const { t } = useChaSetI18n();

  if (!action) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <AlertTriangleIcon className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-sm font-semibold">
                {t('components.keybindingManager.conflictTitle', 'Shortcut Key Conflict')}
              </DialogTitle>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="text-caption text-muted-foreground">
                  {t('components.keybindingManager.conflictingChord', 'Conflicting shortcut:')}
                </span>
                <Badge variant="outline" className="font-mono text-caption font-bold text-amber-600 dark:text-amber-400">
                  {chordString}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <p className="text-xs text-muted-foreground">
            {t(
              'components.keybindingManager.conflictExplanation',
              'The shortcut key is assigned to multiple actions in the same scope. At runtime, the last-registered binding takes precedence.',
            )}
          </p>

          <div className="flex max-h-56 flex-col divide-y divide-border/60 overflow-y-auto rounded-md border border-border bg-card">
            {occupiers.length === 0 ? (
              <div className="p-3 text-center text-xs text-muted-foreground">
                {t('components.keybindingManager.noOtherOccupiers', 'No conflicting actions found.')}
              </div>
            ) : (
              occupiers.map((occ) => (
                <div
                  key={occ.actionId}
                  className={cn(
                    'flex items-center justify-between gap-2 p-2.5 text-xs transition-colors',
                    occ.isResolver && 'bg-primary/5 font-medium',
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-semibold text-foreground">
                        {occ.actionName || occ.actionId}
                      </span>
                      {occ.isResolver && (
                        <Badge variant="secondary" className="text-[0.625rem] font-bold text-primary">
                          {t('components.keybindingManager.activeResolver', 'Active Resolver')}
                        </Badge>
                      )}
                    </div>
                    <span className="text-caption font-mono text-muted-foreground">{occ.actionId}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            {t('common.close', 'Close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
