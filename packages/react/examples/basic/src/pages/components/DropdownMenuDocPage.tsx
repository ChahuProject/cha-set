import React from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, Button, CodeBlock, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentReference } from '../../components/ComponentReference';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';

export function DropdownMenuDocPage() {
  const { t } = useChaSetI18n();
  const reactCode = `<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Options ▾</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-56">
    <DropdownMenuGroup>
      <DropdownMenuLabel>Account Settings</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        Profile
        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem>
        Billing
        <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem>
        Keyboard shortcuts
        <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">
      Log out
      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`;

  return (
    <DocLayout
      category="Overlays & Feedback"
      title="Dropdown Menu"
      description={t('components.dropdownMenu.description', 'Displays a menu to the user triggered by a button, supporting items, labels, separators, shortcuts, and destructive actions.')}
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('showcase.interactiveOverview', 'Interactive Overview')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('desktopComposite.dropdownMenu.overviewDesc', 'Click the trigger below to open the dropdown menu. Keyboard navigation and shortcuts are fully supported.')}
        </p>

        <ComponentPreview
          qtCode={`ChaSetDropdownMenu {
    open: menuOpen
    items: [
        { id: "profile", label: "Profile", shortcut: "⌘P" },
        { id: "settings", label: "Settings", shortcut: "⌘S" },
        { id: "delete", label: "Delete", destructive: true }
    ]
    onItemSelected: function(id) { console.log(id) }

    ChaSetButton {
        text: "Options ▾"
        variant: "outline"
        onClicked: parent.open = !parent.open
    }
}`} title={t('desktopComposite.dropdownMenu.sandboxTitle', 'Dropdown Menu Sandbox')} reactCode={reactCode}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{t('overlays.dropdownMenu.options', 'Options ▾')}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>{t('overlays.dropdownMenu.accountSettings', 'Account Settings')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  {t('overlays.dropdownMenu.profile', 'Profile')}
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {t('overlays.dropdownMenu.billing', 'Billing')}
                  <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {t('overlays.dropdownMenu.shortcuts', 'Keyboard shortcuts')}
                  <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                {t('overlays.dropdownMenu.logout', 'Log out')}
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ComponentPreview>
      </section>

      {/* Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, Button } from '@chahu/cha-set';

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Options</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onSelect={() => {}}>Profile</DropdownMenuItem>
    <DropdownMenuItem onSelect={() => {}}>Settings</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`}
        qtCode={`import ChaSet

ChaSetDropdownMenu {
    items: [
        { id: "profile", label: "Profile", shortcut: "⌘P" },
        { id: "settings", label: "Settings", shortcut: "⌘," }
    ]
}`}
      />



            <ComponentReference
        name="DropdownMenu"
        componentId="dropdown-menu"
        props={[
            { name: 'open', type: 'boolean', default: 'undefined', description: t('components.dropdownMenu.openDesc', 'Controlled open state of the dropdown menu.') },
            { name: 'onOpenChange', type: '(open: boolean) => void', default: 'undefined', description: t('components.dropdownMenu.onOpenChangeDesc', 'Event handler called when open state changes.') },
            { name: 'modal', type: 'boolean', default: 'true', description: t('components.dropdownMenu.modalDesc', 'Whether to render as a modal trapping focus.') },
            { name: 'sideOffset', type: 'number', default: '4', description: t('components.dropdownMenu.sideOffsetDesc', 'Distance offset from trigger to floating content.') },
            { name: 'align', type: "'start' | 'center' | 'end'", default: "'start'", description: t('components.dropdownMenu.alignDesc', 'Alignment along trigger edge.') },
          ]}
      />
    </DocLayout>
  );
}
