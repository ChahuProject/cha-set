import React, { useState } from 'react';
import {
  Separator,
  type SeparatorOrientation,
  type SeparatorVariant,
  type SeparatorLabelPosition,
  Tabs,
  TabsList,
  TabsTrigger,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Checkbox,
} from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function SeparatorDocPage() {
  const [orientation, setOrientation] = useState<SeparatorOrientation>('horizontal');
  const [variant, setVariant] = useState<SeparatorVariant>('solid');
  const [hasLabel, setHasLabel] = useState(false);
  const [labelPosition, setLabelPosition] = useState<SeparatorLabelPosition>('center');
  const [decorative, setDecorative] = useState(true);

  const labelText = hasLabel ? 'Continue with' : undefined;

  const heroReactCode = orientation === 'horizontal'
    ? hasLabel
      ? `<div className="w-full max-w-sm space-y-4">
  <Button className="w-full">Sign in with SSO</Button>
  <Separator
    orientation="horizontal"
    variant="${variant}"
    label="${labelText}"
    labelPosition="${labelPosition}"${decorative ? '' : ' decorative={false}'}
  />
  <Button variant="outline" className="w-full">Sign in with Email</Button>
</div>`
      : `<div className="w-full max-w-sm space-y-4">
  <div className="space-y-1">
    <h4 className="text-sm font-medium leading-none">ChaSet UI</h4>
    <p className="text-sm text-muted-foreground">
      Cross-stack React & Qt Quick Design System.
    </p>
  </div>
  <Separator orientation="horizontal" variant="${variant}"${decorative ? '' : ' decorative={false}'} />
  <div className="flex h-5 items-center space-x-4 text-sm">
    <div>Docs</div>
    <Separator orientation="vertical" variant="${variant}" />
    <div>Source</div>
    <Separator orientation="vertical" variant="${variant}" />
    <div>Changelog</div>
  </div>
</div>`
    : `<div className="flex h-8 items-center space-x-4 text-sm">
  <span>Components</span>
  <Separator orientation="vertical" variant="${variant}"${decorative ? '' : ' decorative={false}'} />
  <span>Tokens</span>
  <Separator orientation="vertical" variant="${variant}" />
  <span>Showcase</span>
</div>`;

  const heroQtCode = orientation === 'horizontal'
    ? hasLabel
      ? `Column {
    width: 280
    spacing: 12
    ChaSetButton { text: "Sign in with SSO"; width: parent.width }
    ChaSetSeparator {
        orientation: "horizontal"
        variant: "${variant}"
        label: "${labelText}"
        labelPosition: "${labelPosition}"
        width: parent.width
    }
    ChaSetButton { variant: "outline"; text: "Sign in with Email"; width: parent.width }
}`
      : `Column {
    width: 280
    spacing: 12

    Column {
        spacing: 4
        Text { text: "ChaSet UI"; font.bold: true; color: ThemeTokens.text }
        Text { text: "Cross-stack React & Qt Quick Design System."; color: ThemeTokens.subduedText; font.pixelSize: 12 }
    }

    ChaSetSeparator { orientation: "horizontal"; variant: "${variant}" }

    Row {
        spacing: 12
        Text { text: "Docs"; color: ThemeTokens.text; font.pixelSize: 12 }
        ChaSetSeparator { orientation: "vertical"; variant: "${variant}"; height: 16 }
        Text { text: "Source"; color: ThemeTokens.text; font.pixelSize: 12 }
        ChaSetSeparator { orientation: "vertical"; variant: "${variant}"; height: 16 }
        Text { text: "Changelog"; color: ThemeTokens.text; font.pixelSize: 12 }
    }
}`
    : `Row {
    spacing: 12
    Text { text: "Components"; color: ThemeTokens.text; font.pixelSize: 13 }
    ChaSetSeparator { orientation: "vertical"; variant: "${variant}"; height: 20 }
    Text { text: "Tokens"; color: ThemeTokens.text; font.pixelSize: 13 }
    ChaSetSeparator { orientation: "vertical"; variant: "${variant}"; height: 20 }
    Text { text: "Showcase"; color: ThemeTokens.text; font.pixelSize: 13 }
}`;

  return (
    <DocLayout
      category="Components"
      title="Separator"
      description="Visually or semantically separates content in a list, form, or section."
      tocItems={[
        { id: 'overview', title: 'Interactive Overview' },
        { id: 'installation', title: 'Installation' },
        { id: 'anatomy', title: 'Anatomy' },
        { id: 'states', title: 'Examples & States' },
        { id: 'keyboard', title: 'Keyboard Navigation' },
        { id: 'props', title: 'Props Reference' },
      ]}
    >
      {/* 1. Interactive Sandbox Preview */}
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Interactive Overview
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Test orientation, dashed/dotted line styles, and labeled section dividers across Web and Desktop.
        </p>

        <ComponentPreview
          title="Separator Sandbox"
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">Orientation:</span>
                <Tabs value={orientation} onValueChange={(v) => setOrientation(v as SeparatorOrientation)}>
                  <TabsList className="h-8">
                    <TabsTrigger value="horizontal" className="h-6 px-2.5 text-xs">Horizontal</TabsTrigger>
                    <TabsTrigger value="vertical" className="h-6 px-2.5 text-xs">Vertical</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">Style:</span>
                <Tabs value={variant} onValueChange={(v) => setVariant(v as SeparatorVariant)}>
                  <TabsList className="h-8">
                    <TabsTrigger value="solid" className="h-6 px-2.5 text-xs">Solid</TabsTrigger>
                    <TabsTrigger value="dashed" className="h-6 px-2.5 text-xs">Dashed</TabsTrigger>
                    <TabsTrigger value="dotted" className="h-6 px-2.5 text-xs">Dotted</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {orientation === 'horizontal' && (
                <>
                  <Checkbox
                    size="sm"
                    checked={hasLabel}
                    onCheckedChange={(val) => setHasLabel(val)}
                    label="Label"
                  />

                  {hasLabel && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs">Position:</span>
                      <Tabs value={labelPosition} onValueChange={(v) => setLabelPosition(v as SeparatorLabelPosition)}>
                        <TabsList className="h-8">
                          <TabsTrigger value="left" className="h-6 px-2.5 text-xs">Left</TabsTrigger>
                          <TabsTrigger value="center" className="h-6 px-2.5 text-xs">Center</TabsTrigger>
                          <TabsTrigger value="right" className="h-6 px-2.5 text-xs">Right</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  )}
                </>
              )}

              <Checkbox
                size="sm"
                checked={decorative}
                onCheckedChange={(val) => setDecorative(val)}
                label={`Decorative (${decorative ? 'role="none"' : 'role="separator"'})`}
              />
            </div>
          }
        >
          <div className="py-6 flex justify-center w-full">
            {orientation === 'horizontal' ? (
              hasLabel ? (
                <div className="w-full max-w-sm space-y-4">
                  <Button className="w-full" size="sm">Sign in with SSO</Button>
                  <Separator
                    orientation="horizontal"
                    variant={variant}
                    label={labelText}
                    labelPosition={labelPosition}
                    decorative={decorative}
                  />
                  <Button variant="outline" className="w-full" size="sm">Sign in with Email</Button>
                </div>
              ) : (
                <div className="w-full max-w-sm space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium leading-none text-foreground">ChaSet UI</h4>
                    <p className="text-sm text-muted-foreground">
                      Cross-stack React & Qt Quick Design System.
                    </p>
                  </div>
                  <Separator orientation="horizontal" variant={variant} decorative={decorative} />
                  <div className="flex h-5 items-center space-x-4 text-sm text-muted-foreground">
                    <span>Docs</span>
                    <Separator orientation="vertical" variant={variant} />
                    <span>Source</span>
                    <Separator orientation="vertical" variant={variant} />
                    <span>Changelog</span>
                  </div>
                </div>
              )
            ) : (
              <div className="flex h-10 items-center space-x-4 text-sm text-foreground">
                <span>Components</span>
                <Separator orientation="vertical" variant={variant} decorative={decorative} />
                <span>Tokens</span>
                <Separator orientation="vertical" variant={variant} />
                <span>Showcase</span>
              </div>
            )}
          </div>
        </ComponentPreview>
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
          Import and place the Separator component horizontally or vertically to segment content, with optional dashed/dotted styles or embedded labels.
        </p>
        <CodeBlock
          code={`import { Separator } from '@chahu/cha-set';

export function SeparatorDemo() {
  return (
    <div className="space-y-4">
      <div>Section Header</div>
      <Separator orientation="horizontal" variant="solid" />
      <div>Content Body</div>
      <Separator orientation="horizontal" variant="dashed" label="OR" />
      <div>Alternative Action</div>
    </div>
  );
}`}
          language="tsx"
        />
      </section>

      {/* 4. Examples & States */}
      <section id="states" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Examples & States
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Common layout patterns using horizontal, vertical, dashed, dotted, and labeled separators.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Content Segmentation */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle>Account Overview</CardTitle>
              <CardDescription>Manage your workspace settings and profile.</CardDescription>
            </CardHeader>
            <Separator orientation="horizontal" />
            <CardContent className="py-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium text-foreground">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-medium text-foreground">Enterprise</span>
              </div>
            </CardContent>
            <Separator orientation="horizontal" />
            <CardFooter className="pt-3 flex justify-end">
              <Button size="sm">Manage</Button>
            </CardFooter>
          </Card>

          {/* Labeled Section & Form Dividers */}
          <Card className="flex flex-col justify-between p-6">
            <div>
              <h3 className="font-semibold text-foreground mb-1">Labeled Dividers</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Embed clear section titles or auth splits with left, center, or right alignment.
              </p>
            </div>
            <div className="space-y-4">
              <Separator label="Section Start" labelPosition="left" />
              <Separator label="OR CONTINUE WITH" labelPosition="center" />
              <Separator label="End of Category" labelPosition="right" />
            </div>
          </Card>

          {/* Border Styles (Solid, Dashed, Dotted) */}
          <Card className="flex flex-col justify-between p-6">
            <div>
              <h3 className="font-semibold text-foreground mb-1">Border Styles</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Choose between solid, dashed, or dotted dividers to distinguish hierarchy.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-xs text-muted-foreground mb-1 block">Solid (Default)</span>
                <Separator orientation="horizontal" variant="solid" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground mb-1 block">Dashed</span>
                <Separator orientation="horizontal" variant="dashed" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground mb-1 block">Dotted</span>
                <Separator orientation="horizontal" variant="dotted" />
              </div>
            </div>
          </Card>

          {/* Inline Navigation & Metadata Bar */}
          <Card className="flex flex-col justify-between p-6">
            <div>
              <h3 className="font-semibold text-foreground mb-1">Navigation Divider</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Vertical dividers between inline list items or metadata tags.
              </p>
            </div>
            <div className="flex h-5 items-center space-x-4 text-xs text-muted-foreground border border-border p-3 rounded-lg bg-muted/20">
              <span className="font-medium text-foreground">v0.2.0</span>
              <Separator orientation="vertical" />
              <span>MIT License</span>
              <Separator orientation="vertical" />
              <span>React 19 & Qt 6</span>
            </div>
          </Card>
        </div>
      </section>

      {/* 5. Props Reference */}
      <section id="keyboard" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Keyboard Navigation
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Keyboard shortcuts and interaction patterns for this component.
        </p>
        <KeyboardShortcutsTable componentId="separator" />
      </section>

      <section id="props" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Props Reference
        </h2>
        <PropsTable
          props={[
            {
              name: 'orientation',
              type: "'horizontal' | 'vertical'",
              default: "'horizontal'",
              description: 'The orientation of the separator line.',
            },
            {
              name: 'variant',
              type: "'solid' | 'dashed' | 'dotted'",
              default: "'solid'",
              description: 'The stroke style of the separator line.',
            },
            {
              name: 'label',
              type: 'ReactNode',
              default: 'undefined',
              description: 'Optional label or annotation text embedded in the divider line.',
            },
            {
              name: 'labelPosition',
              type: "'left' | 'center' | 'right'",
              default: "'center'",
              description: 'Horizontal alignment for the embedded label.',
            },
            {
              name: 'decorative',
              type: 'boolean',
              default: 'true',
              description:
                'Whether the component is purely decorative (role="none") or represents a structural semantic separator (role="separator").',
            },
            {
              name: 'className',
              type: 'string',
              default: "''",
              description: 'Additional CSS classes for custom width, height, margin, or color overrides.',
            },
          ]}
        />
      </section>
    </DocLayout>
  );
}
