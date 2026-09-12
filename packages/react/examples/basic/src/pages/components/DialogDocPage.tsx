import React, { useState } from 'react';
import { Button, Input, Badge, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, type DialogSizeOption, CodeBlock } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function DialogDocPage() {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [name, setName] = useState('Alex Rivera');
  const [username, setUsername] = useState('@arivera');

  const heroReactCode = `<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button variant="outline">Open Profile Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>
        Make changes to your profile here. Click save when you're done.
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <label className="text-right text-sm font-medium">Name</label>
        <Input className="col-span-3" defaultValue="Alex Rivera" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label className="text-right text-sm font-medium">Username</label>
        <Input className="col-span-3" defaultValue="@arivera" />
      </div>
    </div>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <Button type="submit">Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`;

  const heroQtCode = `ChaSetDialog {
    id: profileDialog
    title: "Edit profile"
    description: "Make changes to your profile here. Click save when you're done."
    dialogWidth: 480
    showCloseButton: true
    showEscBadge: true

    Column {
        width: parent.width
        spacing: 12

        Row {
            spacing: 10
            Text { text: "Name:"; width: 70; color: ThemeTokens.text }
            ChaSetInput { width: 340; text: "Alex Rivera" }
        }
        Row {
            spacing: 10
            Text { text: "Username:"; width: 70; color: ThemeTokens.text }
            ChaSetInput { width: 340; text: "@arivera" }
        }
    }

    Row {
        anchors.right: parent.right
        spacing: 10
        ChaSetButton {
            variant: "outline"
            text: "Cancel"
            onClicked: profileDialog.reject()
        }
        ChaSetButton {
            text: "Save changes"
            onClicked: profileDialog.accept()
        }
    }
}`;

  const desktopSizeOptions: DialogSizeOption[] = [
    { name: '默认', special: 'default' },
    { name: '紧凑', widthRem: 26, heightRem: 20 },
    { name: '全视口', special: 'fullscreen' },
  ];

  return (
    <DocLayout
      category="Components"
      title="Dialog"
      description="A modal window that interrupts the user with critical content and prompts for user action."
      tocItems={[
        { id: 'overview', title: 'Interactive Overview' },
        { id: 'animations', title: 'Animations' },
        { id: 'keyboard', title: 'Keyboard Navigation' },
        { id: 'installation', title: 'Installation' },
        { id: 'anatomy', title: 'Anatomy' },
        { id: 'examples', title: 'Examples & States' },
        { id: 'props', title: 'Props Reference' },
      ]}
    >
      {/* 1. Interactive Overview */}
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Interactive Overview
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Experience full modal behavior with backdrop blur, keyboard ESC dismissal, and focus containment across Web and Desktop.
        </p>

        <ComponentPreview
          title="Dialog Sandbox"
          reactCode={heroReactCode}
          qtCode={heroQtCode}
        >
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Open Profile Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm font-medium text-foreground">
                      Name
                    </label>
                    <Input
                      className="col-span-3"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm font-medium text-foreground">
                      Username
                    </label>
                    <Input
                      className="col-span-3"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="button" onClick={() => setOpen(false)}>
                    Save changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <span className="text-xs text-muted-foreground">
              Current profile: <strong className="text-foreground">{name}</strong> ({username})
            </span>
          </div>
        </ComponentPreview>
      </section>

      {/* Animations */}
      <section id="animations" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Animations
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Motion behavior and timing for the overlay and content on open and close.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground">
          <li>
            The backdrop overlay fades in and out using{' '}
            <code className="text-xs bg-muted px-1 rounded">animate-fade-in</code> /
            <code className="text-xs bg-muted px-1 rounded">animate-fade-out</code>, over{' '}
            <code className="text-xs bg-muted px-1 rounded">duration-short</code> with the{' '}
            <code className="text-xs bg-muted px-1 rounded">ease-entrance</code> curve.
          </li>
          <li>
            The content card cross-fades with opacity only (transform-positioned elements avoid
            scale animation to prevent conflicts), and exit uses
            <code className="text-xs bg-muted px-1 rounded">useExitAnimation</code> to delay
            unmounting.
          </li>
          <li>
            Durations and easing resolve from theme tokens, so{' '}
            <code>prefers-reduced-motion</code> zeroes them automatically (Qt: governed by{' '}
            <code>ThemeTokens.animationsEnabled</code>).
          </li>
        </ul>
      </section>

      {/* Keyboard Navigation */}
      <section id="keyboard" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Keyboard Navigation
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Dialog enforces accessible modal standards: Tab focus cycling is strictly trapped inside the modal, and Escape automatically dismisses the dialog while returning focus to the trigger.
        </p>
        <KeyboardShortcutsTable componentId="dialog" />
      </section>

      {/* 2. Installation */}
      <section id="installation" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Installation
        </h2>
        <CodeBlock code="pnpm add @chahu/cha-set" language="bash" />
      </section>

      {/* 3. Anatomy */}
      <section id="anatomy" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Anatomy
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Dialog is composed of modular compound components following accessible modal standards.
        </p>
        <CodeBlock
          code={`import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@chahu/cha-set';

export function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog Description</DialogDescription>
        </DialogHeader>
        <div>Modal Body Content</div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}`}
          language="tsx"
        />
      </section>

      {/* 4. Examples & States */}
      <section id="examples" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Examples & States
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Common modal dialog patterns: desktop draggable windows, confirmation dialogs, and alert notices.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Desktop Draggable Modal */}
          <div className="flex flex-col gap-2 p-5 rounded-lg border border-border bg-card">
            <span className="text-sm font-medium text-foreground">Desktop Draggable Modal</span>
            <p className="text-xs text-muted-foreground mb-3">
              Draggable modal with size presets, auto-fitting height, ESC badge, and fixed footer.
            </p>
            <Dialog open={desktopOpen} onOpenChange={setDesktopOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Open Draggable Window
                </Button>
              </DialogTrigger>
              <DialogContent
                draggable={true}
                showEscBadge={true}
                defaultWidthRem={32}
                defaultHeightRem={22}
                sizeOptions={desktopSizeOptions}
                sizeMenuTooltip="调整窗口大小"
              >
                <DialogHeader>
                  <DialogTitle>Advanced Desktop Tool</DialogTitle>
                  <DialogDescription>
                    Drag the title bar or window body to reposition. Switch size presets from the top-right button.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-2 text-xs text-muted-foreground">
                  <p>
                    The bottom actions area is extracted as a fixed footer that stays pinned during vertical scrolling.
                  </p>
                </div>
                <DialogFooter showCloseButton>
                  <Button size="sm" onClick={() => setDesktopOpen(false)}>
                    Confirm
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Confirmation / Destructive */}
          <div className="flex flex-col gap-2 p-5 rounded-lg border border-border bg-card">
            <span className="text-sm font-medium text-foreground">Destructive Confirmation</span>
            <p className="text-xs text-muted-foreground mb-3">
              Dialog for destructive operations that require explicit confirmation.
            </p>
            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" size="sm">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setConfirmOpen(false)}
                  >
                    Yes, delete account
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Simple Alert */}
          <div className="flex flex-col gap-2 p-5 rounded-lg border border-border bg-card">
            <span className="text-sm font-medium text-foreground">Informational Notice</span>
            <p className="text-xs text-muted-foreground mb-3">
              Lightweight alert modal for system notifications and messages.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary" size="sm">
                  System Update Notice
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <div className="flex items-center gap-2">
                    <DialogTitle>Scheduled Maintenance</DialogTitle>
                    <Badge variant="secondary">Notice</Badge>
                  </div>
                  <DialogDescription>
                    The cloud service will be undergoing scheduled infrastructure updates tonight at 02:00 UTC.
                  </DialogDescription>
                </DialogHeader>
                <p className="text-xs text-muted-foreground">
                  Expected downtime is under 10 minutes. All data remains encrypted and safe.
                </p>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button size="sm">Understood</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* 5. Props Reference */}
      <section id="props" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Props Reference
        </h2>
        <PropsTable
          props={[
            {
              name: 'open',
              type: 'boolean',
              default: 'false',
              description: 'The controlled open state of the dialog.',
            },
            {
              name: 'defaultOpen',
              type: 'boolean',
              default: 'false',
              description: 'The default open state when uncontrolled.',
            },
            {
              name: 'onOpenChange',
              type: '(open: boolean) => void',
              default: '—',
              description: 'Event handler called when the open state changes.',
            },
            {
              name: 'size',
              type: "'sm' | 'default' | 'lg' | 'xl' | 'full'",
              default: "'default'",
              description: 'Tiered size preset controlling modal card width and containment.',
            },
            {
              name: 'closeOnOverlayClick',
              type: 'boolean',
              default: 'true',
              description: 'Whether clicking the backdrop overlay dismisses the dialog.',
            },
            {
              name: 'closeOnEscape',
              type: 'boolean',
              default: 'true',
              description: 'Whether pressing the Escape key dismisses the dialog.',
            },
            {
              name: 'draggable',
              type: 'boolean',
              default: 'true',
              description: 'Whether the dialog is rendered as a desktop draggable and resizable modal window.',
            },
            {
              name: 'showCloseButton',
              type: 'boolean',
              default: 'true',
              description: 'Whether to render the close button in the top-right controls.',
            },
            {
              name: 'showEscBadge',
              type: 'boolean',
              default: 'true',
              description: 'Whether to render an ESC keyboard shortcut badge in the top-right controls.',
            },
            {
              name: 'defaultWidthRem',
              type: 'number',
              default: '—',
              description: 'Initial modal width in rem units (e.g. 32).',
            },
            {
              name: 'defaultHeightRem',
              type: 'number',
              default: '—',
              description: 'Initial modal height in rem units (e.g. 24).',
            },
            {
              name: 'initialPositionMode',
              type: "'center' | 'top' | '居中' | '顶部靠上'",
              default: "'center'",
              description: 'Initial positioning mode for the modal window.',
            },
            {
              name: 'topMarginRem',
              type: 'number',
              default: '4.5',
              description: 'Top margin in rem when initialPositionMode is top.',
            },
            {
              name: 'autoFitHeight',
              type: 'boolean',
              default: 'true',
              description: 'Automatically adjust modal height to fit inner content.',
            },
            {
              name: 'sizeOptions',
              type: 'DialogSizeOption[]',
              default: '—',
              description: 'Preset sizing options for the top-right size switcher dropdown menu.',
            },
            {
              name: 'sizeMenuTooltip',
              type: 'string',
              default: "'调整弹窗尺寸'",
              description: 'Tooltip text for the size switcher dropdown button.',
            },
            {
              name: 'dragHandleClassName',
              type: 'string',
              default: '—',
              description: 'CSS class selector for the drag handle area (e.g. dialog header).',
            },
            {
              name: 'contentClassName',
              type: 'string',
              default: '—',
              description: 'Custom class name for the scrollable inner content container.',
            },
            {
              name: 'overlayClassName',
              type: 'string',
              default: "''",
              description: 'Additional CSS classes to customize the backdrop overlay.',
            },
          ]}
        />
      </section>
    </DocLayout>
  );
}
