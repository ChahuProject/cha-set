import React, { useState } from 'react';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose, Button, Input, Checkbox, type SheetSide, type SheetSize, CodeBlock, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentReference } from '../../components/ComponentReference';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';

export function SheetDocPage() {
  const { t } = useChaSetI18n();
  const [side, setSide] = useState<SheetSide>('right');
  const [size, setSize] = useState<SheetSize>('default');
  const [closeOnOverlay, setCloseOnOverlay] = useState(true);

  const sideLabels: Record<SheetSide, string> = {
    top: t('overlays.sheet.sideTop', 'Top'),
    right: t('overlays.sheet.sideRight', 'Right'),
    bottom: t('overlays.sheet.sideBottom', 'Bottom'),
    left: t('overlays.sheet.sideLeft', 'Left'),
  };

  const reactCode = `<Sheet closeOnOverlayClick={${closeOnOverlay}}>
  <SheetTrigger asChild>
    <Button variant="outline">Open ${side} Drawer</Button>
  </SheetTrigger>
  <SheetContent side="${side}" size="${size}">
    <SheetHeader>
      <SheetTitle>Edit profile</SheetTitle>
      <SheetDescription>
        Make changes to your profile here. Click save when you're done.
      </SheetDescription>
    </SheetHeader>
    <div className="grid gap-4 py-4 px-6">
      <div className="grid grid-cols-4 items-center gap-4">
        <span className="text-right text-xs text-muted-foreground">Name</span>
        <Input defaultValue="Pedro Duarte" className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <span className="text-right text-xs text-muted-foreground">Username</span>
        <Input defaultValue="@peduarte" className="col-span-3" />
      </div>
    </div>
    <SheetFooter>
      <SheetClose asChild>
        <Button variant="default">Save changes</Button>
      </SheetClose>
    </SheetFooter>
  </SheetContent>
</Sheet>`;

  return (
    <DocLayout
      category="Overlays & Feedback"
      title="Sheet"
      description={t('components.sheet.description', 'Extends the dialog component to display content that slides in from any screen edge (top, right, bottom, left).')}
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('showcase.interactiveOverview', 'Interactive Overview')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('desktopComposite.sheet.overviewDesc', 'Choose a slide edge and size preset, then trigger the drawer modal.')}
        </p>

        <ComponentPreview
          qtCode={`ChaSetButton {
    text: "Open Sheet"
    variant: "outline"
    onClicked: sheet.open = true
}

ChaSetSheet {
    id: sheet
    side: "right"
    size: "default"
    title: "Edit profile"
    description: "Make changes to your profile here."
    // ...content...
}`} title={t('desktopComposite.sheet.sandboxTitle', 'Sheet Sandbox')} reactCode={reactCode}>
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
              <span className="font-medium text-muted-foreground">{t('overlays.sheet.side', 'Side:')}</span>
              {(['top', 'right', 'bottom', 'left'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSide(s)}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    side === s
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {sideLabels[s]}
                </button>
              ))}

              <span className="mx-2 text-border">|</span>

              <span className="font-medium text-muted-foreground">{t('showcase.size', 'Size:')}</span>
              {(['sm', 'default', 'lg', 'xl', 'full'] as const).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSize(sz)}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    size === sz
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {sz}
                </button>
              ))}

              <span className="mx-2 text-border">|</span>

              <label className="flex items-center gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground text-xs">
                <Checkbox
                  checked={closeOnOverlay}
                  onCheckedChange={(val) => setCloseOnOverlay(Boolean(val))}
                />
                <span>{t('overlays.sheet.closeOnOverlay', 'Close on overlay')}</span>
              </label>
            </div>

            <Sheet closeOnOverlayClick={closeOnOverlay}>
              <SheetTrigger asChild>
                <Button variant="outline">
                  {t('overlays.sheet.openSheet', 'Open {{side}} Drawer ({{size}})', { side: sideLabels[side], size })}
                </Button>
              </SheetTrigger>
              <SheetContent side={side} size={size}>
                <SheetHeader>
                  <SheetTitle>{t('overlays.sheet.editProfileTitle', 'Edit profile')}</SheetTitle>
                  <SheetDescription>
                    {t('overlays.sheet.editProfileDesc', "Make changes to your profile here. Click save when you're done.")}
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4 px-6">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <span className="text-right text-xs text-muted-foreground">{t('overlays.sheet.name', 'Name')}</span>
                    <Input defaultValue="Pedro Duarte" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <span className="text-right text-xs text-muted-foreground">{t('overlays.sheet.username', 'Username')}</span>
                    <Input defaultValue="@peduarte" className="col-span-3" />
                  </div>
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button variant="default">{t('common.saveChanges', 'Save changes')}</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </ComponentPreview>
      </section>

      {/* Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, Button } from '@chahu/cha-set';

<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Open Sheet</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Sheet Title</SheetTitle>
      <SheetDescription>Drawer content description.</SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>`}
        qtCode={`import ChaSet

ChaSetSheet {
    side: "right"
    title: "Sheet Title"
    description: "Drawer content description."
}`}
      />



      <section id="animations" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('showcase.animations', 'Animations')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('desktopComposite.sheet.animationsDesc', 'Motion behavior and timing for the backdrop and sliding panel.')}
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground">
          <li>
            {t('desktopComposite.sheet.animationsBullet1', 'The backdrop overlay cross-fades with animate-fade-in / animate-fade-out.')}
          </li>
          <li>
            {t('desktopComposite.sheet.animationsBullet2', 'The panel slides in and out from its edge using slide-in-from-{side}-10 and slide-out-to-{side}-10, animated over duration-medium with the ease-emphasized curve.')}
          </li>
          <li>
            {t('desktopComposite.sheet.animationsBullet3', 'Durations and easing resolve from theme tokens, so prefers-reduced-motion zeroes them automatically (Qt: governed by ThemeTokens.animationsEnabled).')}
          </li>
        </ul>
      </section>

            <ComponentReference
        name="Sheet"
        componentId="sheet"
        props={[
            { name: 'open', type: 'boolean', default: 'undefined', description: t('components.sheet.openDesc', 'Controlled open state.') },
            { name: 'defaultOpen', type: 'boolean', default: 'false', description: t('components.sheet.defaultOpenDesc', 'Default open state for uncontrolled usage.') },
            { name: 'onOpenChange', type: '(open: boolean) => void', default: 'undefined', description: t('components.sheet.onOpenChangeDesc', 'Callback fired when open state changes.') },
            { name: 'side', type: "'top' | 'right' | 'bottom' | 'left'", default: "'right'", description: t('components.sheet.sideDesc', 'Edge of the viewport that the drawer slides in from.') },
            { name: 'size', type: "'sm' | 'default' | 'lg' | 'xl' | 'full'", default: "'default'", description: t('components.sheet.sizeDesc', 'Preset drawer dimension sizing (width for left/right, height for top/bottom).') },
            { name: 'showCloseButton', type: 'boolean', default: 'true', description: t('components.sheet.showCloseButtonDesc', 'Whether the top-right close icon button is rendered inside the drawer.') },
            { name: 'closeOnOverlayClick', type: 'boolean', default: 'true', description: t('components.sheet.closeOnOverlayClickDesc', 'Whether clicking the backdrop automatically dismisses the sheet.') },
          ]}
      />
    </DocLayout>
  );
}
