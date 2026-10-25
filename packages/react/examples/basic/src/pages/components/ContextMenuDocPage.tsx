import React from 'react';
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuShortcut, CodeBlock, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { DocMarkdown } from '../../components/DocMarkdown';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { DocText } from '../../components/DocText';

export function ContextMenuDocPage() {
  const { t } = useChaSetI18n();
  const reactCode = `<ContextMenu>
  <ContextMenuTrigger className="flex h-36 w-full max-w-xs items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
    Right click here
  </ContextMenuTrigger>
  <ContextMenuContent className="w-64">
    <ContextMenuItem tooltip="Navigate back in history">
      Back
      <ContextMenuShortcut>⌘[</ContextMenuShortcut>
    </ContextMenuItem>
    <ContextMenuItem disabled tooltip="No forward history available">
      Forward
      <ContextMenuShortcut>⌘]</ContextMenuShortcut>
    </ContextMenuItem>
    <ContextMenuItem tooltip="Refresh current page content">
      Reload
      <ContextMenuShortcut>⌘R</ContextMenuShortcut>
    </ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem>Save As...</ContextMenuItem>
    <ContextMenuItem>Inspect</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`;

  return (
    <DocLayout
      category="Overlays & Feedback"
      title="Context Menu"
      description={t('components.contextMenu.description', 'Displays a menu located at the pointer coordinates on right-click or desktop context gesture.')}
    >
      <section id="overview" className="scroll-mt-20">
        <DocText role="h2" className="mb-3">
          {t('showcase.interactiveOverview', 'Interactive Overview')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t('desktopComposite.contextMenu.overviewDesc', 'Right-click (or long press) inside the dashed container below to reveal the context menu.')}
        </DocText>

        <ComponentPreview
          qtCode={`ChaSetContextMenu {
    items: [
        { id: "back", label: "Back", shortcut: "Alt+Left", tooltip: "Navigate back in history" },
        { id: "forward", label: "Forward", shortcut: "Alt+Right", disabled: true, tooltip: "No forward history available" },
        { id: "reload", label: "Reload", shortcut: "Ctrl+R", tooltip: "Refresh current page content" },
        { id: "inspect", label: "Inspect Element", shortcut: "F12" }
    ]
    onItemSelected: function(id) { console.log(id) }

    Rectangle {
        // Target canvas to receive right-click
    }
}`} title={t('desktopComposite.contextMenu.sandboxTitle', 'Context Menu Sandbox')} reactCode={reactCode}>
          <ContextMenu>
            <ContextMenuTrigger className="flex h-36 w-full max-w-xs items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground select-none bg-muted/20 hover:bg-muted/40 transition-colors">
              {t('overlays.contextMenu.rightClickHere', 'Right click here')}
            </ContextMenuTrigger>
            <ContextMenuContent className="w-64">
              <ContextMenuItem tooltip={t('overlays.contextMenu.backTooltip', 'Navigate back in history')}>
                {t('overlays.contextMenu.back', 'Back')}
                <ContextMenuShortcut>⌘[</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem disabled tooltip={t('overlays.contextMenu.forwardTooltip', 'No forward history available')}>
                {t('overlays.contextMenu.forward', 'Forward')}
                <ContextMenuShortcut>⌘]</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem tooltip={t('overlays.contextMenu.reloadTooltip', 'Refresh current page content')}>
                {t('overlays.contextMenu.reload', 'Reload')}
                <ContextMenuShortcut>⌘R</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem>{t('overlays.contextMenu.saveAs', 'Save As...')}</ContextMenuItem>
              <ContextMenuItem>{t('overlays.contextMenu.inspect', 'Inspect')}</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </ComponentPreview>
      </section>

      {/* Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from '@chahu/cha-set';

<ContextMenu>
  <ContextMenuTrigger className="p-8 border rounded">
    Right click here
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem onSelect={() => console.log('Back')}>Back</ContextMenuItem>
    <ContextMenuItem onSelect={() => console.log('Forward')}>Forward</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`}
        qtCode={`import ChaSet

ChaSetContextMenu {
    items: [
        { id: "back", label: "Back", shortcut: "Alt+Left" },
        { id: "forward", label: "Forward", shortcut: "Alt+Right" }
    ]
}`}
      />



                        <DocMarkdown id="context-menu" section="keyboard" />

            <DocMarkdown id="context-menu" section="props" />
    </DocLayout>
  );
}
