import React from 'react';
import { useChaSetI18n } from '@chahu/cha-set';
import { KeyboardShortcutsTable } from './KeyboardShortcutsTable';
import { PropsTable, type PropItem } from './PropsTable';
import { KEYBOARD_SHORTCUTS_DATA, type KeyboardShortcutItem } from '../data/showcaseData.generated';

export interface ComponentReferenceProps {
  name: string;
  componentId?: string;
  shortcuts?: KeyboardShortcutItem[];
  props?: PropItem[];
  items?: PropItem[];
  description?: string;
  className?: string;
  isSubComponent?: boolean;
}

export function ComponentReference({
  name,
  componentId,
  shortcuts,
  props,
  items,
  description,
  className = '',
  isSubComponent = false,
}: ComponentReferenceProps) {
  const propList = props ?? items ?? [];
  const { t } = useChaSetI18n();
  const resolvedShortcuts =
    shortcuts ?? (componentId ? KEYBOARD_SHORTCUTS_DATA[componentId] ?? [] : []);
  const hasShortcuts = resolvedShortcuts.length > 0;

  const kbTitle = isSubComponent
    ? `${name} ${t('showcase.keyboardSectionTitle', 'Keyboard Navigation & Shortcuts')}`
    : t('showcase.keyboardNavigation', 'Keyboard Navigation');
  const propsTitle = `${name} ${t('showcase.propertiesTitle', 'Properties')}`;

  const kbSectionId = isSubComponent
    ? `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-keyboard`
    : 'keyboard';
  const propsSectionId = isSubComponent
    ? `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-props`
    : 'props';

  return (
    <div className={`space-y-10 my-10 ${className}`} data-component-reference={name}>
      {/* 1. Keyboard Navigation Section (Top) */}
      {hasShortcuts && (
        <section id={kbSectionId} data-toc-title={kbTitle} className="scroll-mt-20">
          <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
            {kbTitle}
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            {t('showcase.keyboardDesc', 'Keyboard shortcuts and interaction patterns for this component.')}
          </p>
          <KeyboardShortcutsTable
            title=""
            componentId={componentId}
            shortcuts={resolvedShortcuts}
          />
        </section>
      )}

      {/* 2. Component Properties Section (Bottom) */}
      <section
        id={propsSectionId}
        data-toc-title={isSubComponent ? propsTitle : 'Props Reference'}
        className="scroll-mt-20"
      >
        {!isSubComponent && (
          <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
            {t('showcase.propsReference', 'Props Reference')}
          </h2>
        )}
        {description && (
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
        )}
        <PropsTable
          title={propsTitle}
          props={propList}
        />
      </section>
    </div>
  );
}
