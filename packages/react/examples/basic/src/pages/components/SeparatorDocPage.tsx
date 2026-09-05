import React, { useState } from 'react';
import {
  Separator,
  type SeparatorOrientation,
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

export function SeparatorDocPage() {
  const [orientation, setOrientation] = useState<SeparatorOrientation>('horizontal');
  const [decorative, setDecorative] = useState(true);

  const heroReactCode = orientation === 'horizontal'
    ? `<div className="w-full max-w-sm space-y-4">
  <div className="space-y-1">
    <h4 className="text-sm font-medium leading-none">ChaSet UI</h4>
    <p className="text-sm text-muted-foreground">
      Cross-stack React & Qt Quick Design System.
    </p>
  </div>
  <Separator orientation="horizontal"${decorative ? '' : ' decorative={false}'} />
  <div className="flex h-5 items-center space-x-4 text-sm">
    <div>Docs</div>
    <Separator orientation="vertical" />
    <div>Source</div>
    <Separator orientation="vertical" />
    <div>Changelog</div>
  </div>
</div>`
    : `<div className="flex h-8 items-center space-x-4 text-sm">
  <span>Components</span>
  <Separator orientation="vertical"${decorative ? '' : ' decorative={false}'} />
  <span>Tokens</span>
  <Separator orientation="vertical" />
  <span>Showcase</span>
</div>`;

  const heroQtCode = orientation === 'horizontal'
    ? `Column {
    width: 280
    spacing: 12

    Column {
        spacing: 4
        Text { text: "ChaSet UI"; font.bold: true; color: ThemeTokens.text }
        Text { text: "Cross-stack React & Qt Quick Design System."; color: ThemeTokens.subduedText; font.pixelSize: 12 }
    }

    ChaSetSeparator { orientation: "horizontal" }

    Row {
        spacing: 12
        Text { text: "Docs"; color: ThemeTokens.text; font.pixelSize: 12 }
        ChaSetSeparator { orientation: "vertical"; height: 16 }
        Text { text: "Source"; color: ThemeTokens.text; font.pixelSize: 12 }
        ChaSetSeparator { orientation: "vertical"; height: 16 }
        Text { text: "Changelog"; color: ThemeTokens.text; font.pixelSize: 12 }
    }
}`
    : `Row {
    spacing: 12
    Text { text: "Components"; color: ThemeTokens.text; font.pixelSize: 13 }
    ChaSetSeparator { orientation: "vertical"; height: 20 }
    Text { text: "Tokens"; color: ThemeTokens.text; font.pixelSize: 13 }
    ChaSetSeparator { orientation: "vertical"; height: 20 }
    Text { text: "Showcase"; color: ThemeTokens.text; font.pixelSize: 13 }
}`;

  return (
    <DocLayout
      category="Components"
      title="Separator"
      description="Visually or semantically separates content in a list or section."
      tocItems={[
        { id: 'overview', title: 'Interactive Overview' },
        { id: 'installation', title: 'Installation' },
        { id: 'anatomy', title: 'Anatomy' },
        { id: 'states', title: 'Examples & States' },
        { id: 'props', title: 'Props Reference' },
      ]}
    >
      {/* 1. Interactive Sandbox Preview */}
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Interactive Overview
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Test orientation and accessibility semantics with synchronized previews across Web and Desktop.
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
              <div className="w-full max-w-sm space-y-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium leading-none text-foreground">ChaSet UI</h4>
                  <p className="text-sm text-muted-foreground">
                    Cross-stack React & Qt Quick Design System.
                  </p>
                </div>
                <Separator orientation="horizontal" decorative={decorative} />
                <div className="flex h-5 items-center space-x-4 text-sm text-muted-foreground">
                  <span>Docs</span>
                  <Separator orientation="vertical" />
                  <span>Source</span>
                  <Separator orientation="vertical" />
                  <span>Changelog</span>
                </div>
              </div>
            ) : (
              <div className="flex h-10 items-center space-x-4 text-sm text-foreground">
                <span>Components</span>
                <Separator orientation="vertical" decorative={decorative} />
                <span>Tokens</span>
                <Separator orientation="vertical" />
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
          Import and place the Separator component horizontally or vertically to segment content.
        </p>
        <CodeBlock
          code={`import { Separator } from '@chahu/cha-set';

export function SeparatorDemo() {
  return (
    <div>
      <div>Header Content</div>
      <Separator orientation="horizontal" />
      <div>Body Content</div>
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
          Common layout patterns using horizontal and vertical separators.
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
