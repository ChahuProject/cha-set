import * as React from 'react';
import { cn } from '../lib/utils';
import { Button } from '../button';
import { Badge } from '../badge';
import { Input } from '../input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../select';
import { KeybindingRecorder } from '../keybinding-recorder';
import { ScrollArea } from '../scroll-area';
import { Tooltip } from '../tooltip';
import {
  SearchIcon,
  RotateCcwIcon,
  DownloadIcon,
  AlertTriangleIcon,
  PlusIcon,
  XIcon,
} from '../lib/icons';
import { useChaSetI18n } from '../i18n';
import type {
  KeybindingManagerProps,
  KeybindingActionItem,
  KeybindingConflictOccupier,
} from './types';
import { KeybindingConflictDialog } from './KeybindingConflictDialog';

export function KeybindingManager({
  actions,
  scopes = [],
  sections = [],
  onBindingChange,
  onResetAction,
  onResetAll,
  onExportCheatSheet,
  searchable = true,
  allowMultiChord = true,
  allowResetAll = true,
  allowExportCheatSheet = true,
  showSourceBadge = true,
  showScopeBadge = true,
  layout = 'grouped-list',
  disabled = false,
  maxHeight,
  className,
  style,
  ...props
}: KeybindingManagerProps) {
  const { t } = useChaSetI18n();

  // Internal filter states
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedScope, setSelectedScope] = React.useState<string>('all');
  const [sameChordFilter, setSameChordFilter] = React.useState<string>('');

  // Conflict modal state
  const [conflictAction, setConflictAction] = React.useState<KeybindingActionItem | null>(null);
  const [conflictChord, setConflictChord] = React.useState<string>('');
  const [conflictOccupiers, setConflictOccupiers] = React.useState<KeybindingConflictOccupier[]>([]);
  const [conflictDialogOpen, setConflictDialogOpen] = React.useState<boolean>(false);

  // Dynamic conflict detection map: scopeId -> { keyString -> actionId[] }
  const computedConflicts = React.useMemo(() => {
    const map: Record<string, Record<string, string[]>> = {};

    for (const action of actions) {
      const scope = action.scopeId || 'global';
      if (!map[scope]) map[scope] = {};

      for (const chord of action.chords || []) {
        if (!chord || !chord.keyString || chord.isMasked) continue;
        const k = chord.keyString.trim().toLowerCase();
        if (!map[scope][k]) map[scope][k] = [];
        if (!map[scope][k].includes(action.id)) {
          map[scope][k].push(action.id);
        }
      }
    }

    const conflictSet = new Set<string>(); // "scopeId:actionId"
    for (const [scope, chordMap] of Object.entries(map)) {
      for (const [, actionIds] of Object.entries(chordMap)) {
        if (actionIds.length > 1) {
          for (const aId of actionIds) {
            conflictSet.add(`${scope}:${aId}`);
          }
        }
      }
    }

    return { map, conflictSet };
  }, [actions]);

  // Check if an action is modified from default
  const isActionModified = React.useCallback((action: KeybindingActionItem): boolean => {
    if (action.chords.some((c) => c.isUserModified)) return true;
    const currentKeys = action.chords.filter((c) => !c.isMasked).map((c) => c.keyString).sort().join('|');
    const defaultKeys = (action.defaultChords || []).slice().sort().join('|');
    return currentKeys !== defaultKeys;
  }, []);

  // Filter actions based on query, scope, and sameChordFilter
  const filteredActions = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const isReverseKeySearch = q.includes('+') || /^(ctrl|alt|shift|meta|cmd|win)/.test(q);

    return actions.filter((action) => {
      // Scope filter
      if (selectedScope !== 'all' && action.scopeId !== selectedScope) {
        return false;
      }

      // Same chord filter
      if (sameChordFilter) {
        const matchesChord = action.chords.some(
          (c) => !c.isMasked && c.keyString.toLowerCase() === sameChordFilter.toLowerCase(),
        );
        if (!matchesChord) return false;
      }

      // Query filter
      if (!q) return true;

      if (isReverseKeySearch) {
        return action.chords.some(
          (c) => !c.isMasked && c.keyString.toLowerCase().includes(q),
        );
      }

      return (
        action.name.toLowerCase().includes(q) ||
        action.id.toLowerCase().includes(q) ||
        (action.description && action.description.toLowerCase().includes(q))
      );
    });
  }, [actions, selectedScope, sameChordFilter, searchQuery]);

  // Group actions by section
  const groupedSections = React.useMemo(() => {
    if (layout === 'flat-table') {
      return [{ id: 'all', name: '', actions: filteredActions }];
    }

    const sectionMap = new Map<string, { id: string; name: string; order: number; actions: KeybindingActionItem[] }>();

    // Register all declared sections
    for (const sec of sections) {
      sectionMap.set(sec.id, {
        id: sec.id,
        name: sec.name,
        order: sec.order ?? 0,
        actions: [],
      });
    }

    // Default catch-all section
    if (!sectionMap.has('common')) {
      sectionMap.set('common', {
        id: 'common',
        name: t('components.keybindingManager.defaultSection', 'General Actions'),
        order: 999,
        actions: [],
      });
    }

    // Place filtered actions into sections
    for (const act of filteredActions) {
      const secId = act.sectionId || 'common';
      let entry = sectionMap.get(secId);
      if (!entry) {
        entry = { id: secId, name: secId, order: 50, actions: [] };
        sectionMap.set(secId, entry);
      }
      entry.actions.push(act);
    }

    // Filter out empty sections and sort by order
    return Array.from(sectionMap.values())
      .filter((s) => s.actions.length > 0)
      .sort((a, b) => a.order - b.order);
  }, [filteredActions, layout, sections, t]);

  // Open conflict dialog
  const handleOpenConflict = React.useCallback(
    (action: KeybindingActionItem) => {
      const scope = action.scopeId || 'global';
      let confKey = '';
      const occupiersList: KeybindingConflictOccupier[] = [];

      for (const chord of action.chords) {
        if (!chord || !chord.keyString || chord.isMasked) continue;
        const norm = chord.keyString.trim().toLowerCase();
        const conflictingIds = computedConflicts.map[scope]?.[norm] || [];
        if (conflictingIds.length > 1) {
          confKey = chord.keyString;
          for (const aId of conflictingIds) {
            const targetAct = actions.find((a) => a.id === aId);
            occupiersList.push({
              actionId: aId,
              actionName: targetAct ? targetAct.name : aId,
              scopeId: scope,
              isResolver: aId === action.id,
            });
          }
          break;
        }
      }

      setConflictAction(action);
      setConflictChord(confKey || action.chords[0]?.keyString || '');
      setConflictOccupiers(occupiersList);
      setConflictDialogOpen(true);
    },
    [actions, computedConflicts],
  );

  // Generate cheat sheet Markdown string
  const handleExport = React.useCallback(() => {
    let md = `# Keyboard Shortcuts Reference\n\n`;
    md += `*Exported on ${new Date().toLocaleDateString()}*\n\n`;

    const grouped = new Map<string, KeybindingActionItem[]>();
    for (const act of actions) {
      const secName = sections.find((s) => s.id === act.sectionId)?.name || act.sectionId || 'General';
      if (!grouped.has(secName)) grouped.set(secName, []);
      grouped.get(secName)!.push(act);
    }

    for (const [secName, acts] of grouped.entries()) {
      md += `## ${secName}\n\n`;
      md += `| Action | Shortcut | Scope | Description |\n`;
      md += `| :--- | :--- | :--- | :--- |\n`;
      for (const a of acts) {
        const keys = a.chords.filter((c) => !c.isMasked).map((c) => `\`${c.keyString}\``).join(' / ') || '*(None)*';
        const scName = scopes.find((s) => s.id === a.scopeId)?.name || a.scopeId;
        md += `| **${a.name}** | ${keys} | ${scName} | ${a.description || ''} |\n`;
      }
      md += `\n`;
    }

    if (onExportCheatSheet) {
      onExportCheatSheet(md);
    } else {
      // Browser fallback: download markdown file
      try {
        const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'shortcuts.md';
        a.click();
        URL.revokeObjectURL(url);
      } catch (e) {
        console.warn('Failed to trigger download:', e);
      }
    }
  }, [actions, onExportCheatSheet, scopes, sections]);

  return (
    <div
      data-slot="keybinding-manager"
      className={cn(
        'flex w-full flex-col gap-4 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-2xs transition-colors duration-quick ease-standard',
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
      style={{
        maxHeight: typeof maxHeight === 'number' ? `${maxHeight * 0.0625}rem` : maxHeight,
        ...style,
      }}
      {...props}
    >
      {/* Top Header Controls: Search, Scope Filter, Actions */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {searchable && (
            <div className="relative w-64 max-w-full">
              <SearchIcon className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('components.keybindingManager.searchPlaceholder', 'Search actions or keys (e.g. Ctrl+)...')}
                className="h-8 pl-8 text-xs"
              />
            </div>
          )}

          {scopes.length > 0 && (
            <Select value={selectedScope} onValueChange={setSelectedScope}>
              <SelectTrigger className="h-8 w-36 text-xs">
                <SelectValue placeholder={t('components.keybindingManager.allScopes', 'All Scopes')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('components.keybindingManager.allScopes', 'All Scopes')}</SelectItem>
                {scopes.map((sc) => (
                  <SelectItem key={sc.id} value={sc.id}>
                    {sc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {sameChordFilter && (
            <div className="flex items-center gap-1 rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-xs text-foreground">
              <span>{t('components.keybindingManager.sameChord', 'Same Chord:')}</span>
              <span className="font-mono font-semibold text-primary">{sameChordFilter}</span>
              <button
                type="button"
                onClick={() => setSameChordFilter('')}
                className="ml-1 cursor-pointer text-muted-foreground hover:text-foreground"
                aria-label={t('common.clear', 'Clear')}
              >
                <XIcon className="size-3" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {allowExportCheatSheet && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="h-8 gap-1.5 text-xs"
              title={t('components.keybindingManager.exportTitle', 'Export Markdown reference cheat sheet')}
            >
              <DownloadIcon className="size-3.5" />
              <span>{t('components.keybindingManager.export', 'Export Sheet')}</span>
            </Button>
          )}

          {allowResetAll && onResetAll && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onResetAll}
              className="h-8 gap-1.5 text-xs hover:border-destructive/60 hover:text-destructive"
              title={t('components.keybindingManager.resetAllTitle', 'Revert all shortcuts to defaults')}
            >
              <RotateCcwIcon className="size-3.5" />
              <span>{t('components.keybindingManager.resetAll', 'Reset All')}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Main List Area */}
      <ScrollArea className="flex-1 min-h-0 w-full">
        <div className="flex flex-col gap-6 pr-3">
          {groupedSections.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground">
            <SearchIcon className="size-8 opacity-30" />
            <p className="text-sm font-medium">
              {t('components.keybindingManager.noMatches', 'No matching actions found')}
            </p>
            <p className="text-xs text-muted-foreground/80">
              {t('components.keybindingManager.noMatchesHint', 'Try adjusting your search query or scope filter.')}
            </p>
          </div>
        ) : (
          groupedSections.map((section) => (
            <div key={section.id} className="flex flex-col gap-2">
              {section.name && (
                <div className="flex items-center gap-2 px-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {section.name}
                  </h3>
                  <div className="h-px flex-1 bg-border/60" />
                  <span className="text-caption font-mono text-muted-foreground">
                    {section.actions.length}
                  </span>
                </div>
              )}

              <div className="flex flex-col gap-1.5 text-foreground">
                {section.actions.map((action) => {
                  const isModified = isActionModified(action);
                  const scopeId = action.scopeId || 'global';
                  const hasConflict =
                    action.hasConflict || computedConflicts.conflictSet.has(`${scopeId}:${action.id}`);
                  const scopeName = scopes.find((s) => s.id === scopeId)?.name || scopeId;

                  return (
                    <div
                      key={action.id}
                      className={cn(
                        'flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-card/60 p-3 text-card-foreground transition-colors duration-quick ease-standard hover:bg-muted/30',
                        hasConflict && 'border-amber-500/60 bg-amber-500/5',
                      )}
                    >
                      {/* Left: Action Title & Description (constrained width, matches Qt 200dp) */}
                      <div className="flex w-52 shrink-0 flex-col gap-0.5 min-w-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="truncate text-xs font-semibold text-foreground" title={action.name}>
                            {action.name}
                          </span>
                          {action.tags && action.tags.length > 0 && (
                            <div className="flex shrink-0 items-center gap-1">
                              {action.tags.map((tg) => (
                                <Badge key={tg} variant="secondary" className="px-1.5 py-0 text-[0.625rem]">
                                  {tg}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        {action.description && (
                          <p className="truncate text-caption text-muted-foreground" title={action.description}>
                            {action.description}
                          </p>
                        )}
                      </div>

                      {/* Middle: Shortcut Capsules */}
                      <div className="flex items-center gap-2 shrink-0">
                        {action.chords.length === 0 ? (
                          <KeybindingRecorder
                            value=""
                            size="sm"
                            clearable={false}
                            placeholder={t('components.keybindingManager.unassigned', 'Unassigned')}
                            onChange={(_, str) => onBindingChange?.(action.id, 0, str)}
                            className="w-36 text-caption"
                            disabled={action.disabled}
                          />
                        ) : (
                          action.chords.map((chord, idx) => (
                            <div key={`${chord.keyString}-${idx}`} className="flex items-center gap-1">
                              <KeybindingRecorder
                                value={chord.isMasked ? '' : chord.keyString}
                                size="sm"
                                clearable={true}
                                autoRecord={!chord.keyString && chord.isUserModified}
                                placeholder={t('components.keybindingManager.unassigned', 'Unassigned')}
                                onChange={(_, str) => onBindingChange?.(action.id, idx, str)}
                                className={cn('w-36 text-caption', chord.isMasked && 'line-through opacity-60')}
                                disabled={action.disabled}
                              />
                            </div>
                          ))
                        )}

                        {allowMultiChord && action.chords.length === 1 && !action.disabled && (
                          <Tooltip content={t('components.keybindingManager.addAlternative', 'Add alternative shortcut')}>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => onBindingChange?.(action.id, action.chords.length, '')}
                              className="size-7 rounded-md border border-dashed border-border hover:border-primary/50"
                            >
                              <PlusIcon className="size-3 text-muted-foreground" />
                            </Button>
                          </Tooltip>
                        )}
                      </div>

                      {/* Right: Badges & Row Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {showScopeBadge && (
                          <Badge variant="outline" className="px-2 py-0.5 text-caption font-normal text-muted-foreground">
                            {scopeName}
                          </Badge>
                        )}

                        {showSourceBadge && (
                          <Badge
                            variant={isModified ? 'secondary' : 'outline'}
                            className={cn(
                              'px-2 py-0.5 text-caption font-semibold',
                              isModified
                                ? 'bg-primary/10 text-primary border-primary/20'
                                : 'text-muted-foreground',
                            )}
                          >
                            {isModified
                              ? t('components.keybindingManager.userModified', 'User')
                              : t('components.keybindingManager.defaultSource', 'Built-in')}
                          </Badge>
                        )}

                        {hasConflict && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenConflict(action)}
                            className="h-6 gap-1 border-amber-500/40 bg-amber-500/10 px-2 text-caption font-semibold text-amber-700 hover:bg-amber-500/20 dark:text-amber-400"
                          >
                            <AlertTriangleIcon className="size-3" />
                            <span>{t('components.keybindingManager.conflict', 'Conflict')}</span>
                          </Button>
                        )}

                        {isModified && onResetAction && !action.disabled && (
                          <Tooltip content={t('components.keybindingManager.resetAction', 'Reset to factory default')}>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => onResetAction(action.id)}
                              className="size-7 text-muted-foreground hover:text-foreground"
                            >
                              <RotateCcwIcon className="size-3" />
                            </Button>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
        </div>
      </ScrollArea>

      {/* Conflict Details Dialog */}
      <KeybindingConflictDialog
        open={conflictDialogOpen}
        onOpenChange={setConflictDialogOpen}
        action={conflictAction}
        chordString={conflictChord}
        occupiers={conflictOccupiers}
      />
    </div>
  );
}
