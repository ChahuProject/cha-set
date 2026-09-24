import React, { useState } from 'react';
import { SplitButton, DropdownMenuItem, DropdownMenuSeparator } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { DocFooterSections } from '../../components/DocFooterSections';

export function SplitButtonDocPage() {
  const [lastAction, setLastAction] = useState('None');

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
      description="Dual-action button with primary direct click and secondary attached dropdown menu."
      tocItems={[
        { id: 'overview', title: 'Interactive Overview' },
        { id: 'anatomy', title: 'Anatomy' },
        { id: 'animations', title: 'Animations' },
        { id: 'keyboard', title: 'Keyboard Navigation' },
        { id: 'props', title: 'Props Reference' },
      ]}
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Interactive Overview
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Click the main button to trigger the primary action, or click the chevron to open the dropdown menu.
        </p>

        <ComponentPreview
          title="Split Button Sandbox"
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
                label="Save Project"
                onClick={() => setLastAction('Direct Save')}
                menuContent={
                  <>
                    <DropdownMenuItem onSelect={() => setLastAction('Save As...')}>
                      Save As...
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLastAction('Save All')}>
                      Save All
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => setLastAction('Export to Disk')}>
                      Export to Disk
                    </DropdownMenuItem>
                  </>
                }
              />

              <SplitButton
                variant="outline"
                label="Deploy"
                onClick={() => setLastAction('Direct Deploy')}
                menuContent={
                  <>
                    <DropdownMenuItem onSelect={() => setLastAction('Deploy Staging')}>
                      Deploy to Staging
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLastAction('Deploy Canary')}>
                      Deploy to Canary
                    </DropdownMenuItem>
                  </>
                }
              />
            </div>

            <span className="text-xs text-muted-foreground">
              Last Action Dispatched: <strong className="text-foreground">{lastAction}</strong>
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

      <DocFooterSections
        componentId="split-button"
        props={[
          { name: 'label', type: 'ReactNode', default: 'undefined', description: 'Label on the primary action button.' },
          { name: 'onClick', type: '() => void', default: 'undefined', description: 'Callback fired on clicking primary action.' },
          { name: 'menuContent', type: 'ReactNode', default: 'undefined', description: 'Dropdown menu items rendered on chevron click.' },
          { name: 'variant', type: 'ButtonVariant', default: "'default'", description: 'Button stylistic variant.' },
          { name: 'size', type: 'ButtonSize', default: "'default'", description: 'Button size variant.' },
        ]}
      />
    </DocLayout>
  );
}
