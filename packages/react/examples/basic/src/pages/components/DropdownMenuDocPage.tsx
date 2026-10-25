import React from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, Button, CodeBlock, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { DocMarkdown } from '../../components/DocMarkdown';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { DocText } from '../../components/DocText';

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
      <DropdownMenuItem tooltip="View account profile">
        Profile
        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem tooltip="Manage billing and invoices">
        Billing
        <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem tooltip="View keyboard navigation shortcuts">
        Keyboard shortcuts
        <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive" tooltip="Sign out of current account">
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
        <DocText role="h2" className="mb-3">
          {t('showcase.interactiveOverview', 'Interactive Overview')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t('desktopComposite.dropdownMenu.overviewDesc', 'Click the trigger below to open the dropdown menu. Keyboard navigation and shortcuts are fully supported.')}
        </DocText>

        <ComponentPreview
          qtCode={`ChaSetDropdownMenu {
    open: menuOpen
    items: [
        { id: "profile", label: "Profile", shortcut: "⌘P", tooltip: "View account profile" },
        { id: "billing", label: "Billing", shortcut: "⌘B", tooltip: "Manage billing and invoices" },
        { id: "settings", label: "Settings", shortcut: "⌘S", tooltip: "View keyboard navigation shortcuts" },
        { id: "logout", label: "Log out", destructive: true, tooltip: "Sign out of current account" }
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
                <DropdownMenuItem tooltip={t('overlays.dropdownMenu.profileTooltip', 'View account profile')}>
                  {t('overlays.dropdownMenu.profile', 'Profile')}
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem tooltip={t('overlays.dropdownMenu.billingTooltip', 'Manage billing and invoices')}>
                  {t('overlays.dropdownMenu.billing', 'Billing')}
                  <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem tooltip={t('overlays.dropdownMenu.shortcutsTooltip', 'View keyboard navigation shortcuts')}>
                  {t('overlays.dropdownMenu.shortcuts', 'Keyboard shortcuts')}
                  <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" tooltip={t('overlays.dropdownMenu.logoutTooltip', 'Sign out of current account')}>
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



                        <DocMarkdown id="dropdown-menu" section="keyboard" />

            <DocMarkdown id="dropdown-menu" section="props" />
    </DocLayout>
  );
}
