import React from 'react';
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuShortcut, CodeBlock } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentReference } from '../../components/ComponentReference';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';

export function ContextMenuDocPage() {
  const reactCode = `<ContextMenu>
  <ContextMenuTrigger className="flex h-36 w-full max-w-xs items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
    Right click here
  </ContextMenuTrigger>
  <ContextMenuContent className="w-64">
    <ContextMenuItem>
      Back
      <ContextMenuShortcut>⌘[</ContextMenuShortcut>
    </ContextMenuItem>
    <ContextMenuItem disabled>
      Forward
      <ContextMenuShortcut>⌘]</ContextMenuShortcut>
    </ContextMenuItem>
    <ContextMenuItem>
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
      description="Displays a menu located at the pointer coordinates on right-click or desktop context gesture."
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Interactive Overview
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Right-click (or long press) inside the dashed container below to reveal the context menu.
        </p>

        <ComponentPreview
          qtCode={`ChaSetContextMenu {
    items: [
        { id: "back", label: "Back", shortcut: "Alt+Left" },
        { id: "forward", label: "Forward", shortcut: "Alt+Right" },
        { id: "reload", label: "Reload", shortcut: "Ctrl+R" },
        { id: "inspect", label: "Inspect Element", shortcut: "F12" }
    ]
    onItemSelected: function(id) { console.log(id) }

    Rectangle {
        // Target canvas to receive right-click
    }
}`} title="Context Menu Sandbox" reactCode={reactCode}>
          <ContextMenu>
            <ContextMenuTrigger className="flex h-36 w-full max-w-xs items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground select-none bg-muted/20 hover:bg-muted/40 transition-colors">
              Right click here
            </ContextMenuTrigger>
            <ContextMenuContent className="w-64">
              <ContextMenuItem>
                Back
                <ContextMenuShortcut>⌘[</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem disabled>
                Forward
                <ContextMenuShortcut>⌘]</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem>
                Reload
                <ContextMenuShortcut>⌘R</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem>Save As...</ContextMenuItem>
              <ContextMenuItem>Inspect</ContextMenuItem>
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



            <ComponentReference
        name="ContextMenu"
        componentId="context-menu"
        props={[
            { name: 'modal', type: 'boolean', default: 'true', description: 'Whether the context menu is modal.' },
            { name: 'onOpenChange', type: '(open: boolean) => void', default: 'undefined', description: 'Callback fired on open state change.' },
          ]}
      />
    </DocLayout>
  );
}
