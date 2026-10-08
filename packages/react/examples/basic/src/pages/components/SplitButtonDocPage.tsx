import React, { useState } from 'react';
import { SplitButton, DropdownMenuItem, DropdownMenuSeparator, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { ComponentReference } from "../../components/ComponentReference";

export function SplitButtonDocPage() {
  const { t } = useChaSetI18n();
  const [lastAction, setLastAction] = useState(t('components.split-button.none', 'None'));

  const reactCode = `<SplitButton
  label="Save Project"
  onClick={() => console.log('Saved!')}
  menuContent={
    <>
      <DropdownMenuItem onSelect={() => console.log('Save As')}>
        Save As...
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={() => console.log('Save All')}>
        Save All
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onSelect={() => console.log('Export')}>
        Export to Disk
      </DropdownMenuItem>
    </>
  }
/>`;

  return (
    <DocLayout
      category="Base Primitives"
      title="Split Button"
      description={t('components.split-button.description', 'Dual-action button with primary direct click and secondary attached dropdown menu.')}
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('desktopComposite.splitButton.overviewHeading', 'Interactive Overview')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('components.split-button.overviewDesc', 'Click the main button to trigger the primary action, or click the chevron to open the dropdown menu.')}
        </p>

        <ComponentPreview
          title={t('desktopComposite.splitButton.sandboxTitle', 'Split Button Sandbox')}
          reactCode={reactCode}
          qtCode={`ChaSetSplitButton {
    text: "Deploy"
    variant: "default"
    menuItems: [
        { id: "staging", label: "Deploy to Staging" },
        { id: "canary", label: "Deploy Canary" }
    ]
}`}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap gap-4">
              <SplitButton
                label={t('components.split-button.saveProject', 'Save Project')}
                onClick={() => setLastAction(t('components.split-button.saveProject', 'Save Project'))}
                menuContent={
                  <>
                    <DropdownMenuItem onSelect={() => setLastAction(t('components.split-button.saveAs', 'Save As...'))}>
                      {t('components.split-button.saveAs', 'Save As...')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLastAction(t('components.split-button.saveAll', 'Save All'))}>
                      {t('components.split-button.saveAll', 'Save All')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => setLastAction(t('components.split-button.exportToDisk', 'Export to Disk'))}>
                      {t('components.split-button.exportToDisk', 'Export to Disk')}
                    </DropdownMenuItem>
                  </>
                }
              />

              <SplitButton
                variant="outline"
                label={t('components.split-button.deploy', 'Deploy')}
                onClick={() => setLastAction(t('components.split-button.deploy', 'Deploy'))}
                menuContent={
                  <>
                    <DropdownMenuItem onSelect={() => setLastAction(t('components.split-button.deployStaging', 'Deploy to Staging'))}>
                      {t('components.split-button.deployStaging', 'Deploy to Staging')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLastAction(t('components.split-button.deployCanary', 'Deploy Canary'))}>
                      {t('components.split-button.deployCanary', 'Deploy Canary')}
                    </DropdownMenuItem>
                  </>
                }
              />
            </div>

            <span className="text-xs text-muted-foreground">
              {t('components.split-button.lastAction', 'Last Action Dispatched: {{action}}', { action: lastAction })}
            </span>
          </div>
        </ComponentPreview>
      </section>

      {/* 2. Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { SplitButton, DropdownMenuItem } from '@chahu/cha-set';\n\n<SplitButton\n  label="Save"\n  onClick={() => {}}\n  menuContent={<DropdownMenuItem onSelect={() => {}}>Save As</DropdownMenuItem>}\n/>`}
        qtCode={`import ChaSet\n\nChaSetSplitButton {\n    text: "Deploy"\n    variant: "default"\n    menuItems: [\n        { id: "staging", label: "Deploy to Staging" }\n    ]\n}`}
      />

            {/* Animations */}
      <section id="animations" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">
          {t('showcase.animations', 'Animations')}
        </h2>
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            {t('showcase.animationsDesc', 'Motion behavior and timing for interactive states aligned with ChaSet tokens.')}
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground">
            <li>
              {t('showcase.animationsItem1', 'State changes (hover, press, focus) animate over duration-quick with the ease-standard curve.')}
            </li>
            <li>
              {t('showcase.animationsItem2', 'Durations and easing resolve from theme tokens, so prefers-reduced-motion zeroes them automatically (Qt: governed by ThemeTokens.animationsEnabled).')}
            </li>
          </ul>
        </div>
      </section>

      <ComponentReference
        name="SplitButton"
        componentId="split-button"
        props={[
          { name: 'label', type: 'ReactNode', default: 'undefined', description: t('components.splitButton.labelDesc', 'Label on the primary action button.') },
          { name: 'onClick', type: '() => void', default: 'undefined', description: t('components.splitButton.onClickDesc', 'Callback fired on clicking primary action.') },
          { name: 'menuContent', type: 'ReactNode', default: 'undefined', description: t('components.splitButton.menuContentDesc', 'Dropdown menu items rendered on chevron click.') },
          { name: 'variant', type: 'ButtonVariant', default: "'default'", description: t('components.splitButton.variantDesc', 'Button stylistic variant.') },
          { name: 'size', type: 'ButtonSize', default: "'default'", description: t('components.splitButton.sizeDesc', 'Button size variant.') },
        ]}
      />
    </DocLayout>
  );
}
