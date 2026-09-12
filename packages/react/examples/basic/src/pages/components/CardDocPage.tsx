import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, type CardVariant, Button, Badge, Tabs, TabsList, TabsTrigger, CodeBlock } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function CardDocPage() {
  const [variant, setVariant] = useState<CardVariant>('default');
  const [size, setSize] = useState<'default' | 'sm'>('default');
  const [interactive, setInteractive] = useState(false);

  const heroReactCode = `<Card variant="${variant}" size="${size}"${interactive ? ' interactive' : ''} className="w-full max-w-sm">
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>Create project</CardTitle>
      <Badge variant="secondary">Pro</Badge>
    </div>
    <CardDescription>Deploy your new project in one-click.</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-muted-foreground">
      Your project will be deployed to the cloud instantly.
    </p>
  </CardContent>
  <CardFooter className="flex justify-between">
    <Button variant="outline" size="sm">Cancel</Button>
    <Button size="sm">Deploy</Button>
  </CardFooter>
</Card>`;

  const heroQtCode = `ChaSetCard {
    width: 340
    variant: "${variant}"
    size: "${size}"
    interactive: ${interactive}

    ChaSetCardHeader {
        Row {
            width: parent.width
            ChaSetCardTitle { text: "Create project" }
            ChaSetBadge { variant: "secondary"; text: "Pro"; anchors.right: parent.right }
        }
        ChaSetCardDescription { text: "Deploy your new project in one-click." }
    }
    ChaSetCardContent {
        Text { text: "Your project will be deployed to the cloud instantly."; color: ThemeTokens.subduedText }
    }
    ChaSetCardFooter {
        ChaSetButton { variant: "outline"; size: "sm"; text: "Cancel" }
        ChaSetButton { size: "sm"; text: "Deploy" }
    }
}`;

  return (
    <DocLayout
      category="Components"
      title="Card"
      description="Displays a card with header, title, description, content, and footer actions."
      tocItems={[
        { id: 'overview', title: 'Interactive Overview' },
        { id: 'installation', title: 'Installation' },
        { id: 'anatomy', title: 'Anatomy' },
        { id: 'variants', title: 'Variants' },
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
          Test card variants with interactive subcomponents synchronized across Web and Desktop.
        </p>

        <ComponentPreview
          title="Card Sandbox"
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">Variant:</span>
                <Tabs value={variant} onValueChange={(v) => setVariant(v as CardVariant)}>
                  <TabsList className="h-8">
                    <TabsTrigger value="default" className="h-6 px-2.5 text-xs">Default</TabsTrigger>
                    <TabsTrigger value="secondary" className="h-6 px-2.5 text-xs">Secondary</TabsTrigger>
                    <TabsTrigger value="outline" className="h-6 px-2.5 text-xs">Outline</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">Size:</span>
                <Tabs value={size} onValueChange={(v) => setSize(v as 'default' | 'sm')}>
                  <TabsList className="h-8">
                    <TabsTrigger value="default" className="h-6 px-2.5 text-xs">Default</TabsTrigger>
                    <TabsTrigger value="sm" className="h-6 px-2.5 text-xs">Compact (sm)</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={interactive}
                  onChange={(e) => setInteractive(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-ring"
                />
                Interactive Feedback
              </label>
            </div>
          }
        >
          <Card variant={variant} size={size} interactive={interactive} className="w-full max-w-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Create project</CardTitle>
                <Badge variant="secondary">Pro</Badge>
              </div>
              <CardDescription>Deploy your new project in one-click.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Your project will be deployed to the edge network automatically.
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">Cancel</Button>
              <Button size="sm">Deploy</Button>
            </CardFooter>
          </Card>
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
          Card is composed of modular building blocks for flexible layouts.
        </p>
        <CodeBlock
          code={`import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@chahu/cha-set';

export function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Main content area</p>
      </CardContent>
      <CardFooter>
        <p>Footer actions</p>
      </CardFooter>
    </Card>
  );
}`}
          language="tsx"
        />
      </section>

      {/* 4. Variants */}
      <section id="variants" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Variants
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Three semantic variants styled with design tokens for consistent elevation and contrast.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="default">
            <CardHeader>
              <CardTitle className="text-base">Default Card</CardTitle>
              <CardDescription>Elevated surface with panel background</CardDescription>
            </CardHeader>
          </Card>
          <Card variant="secondary">
            <CardHeader>
              <CardTitle className="text-base">Secondary Card</CardTitle>
              <CardDescription>Subtle contrast for grouped secondary items</CardDescription>
            </CardHeader>
          </Card>
          <Card variant="outline">
            <CardHeader>
              <CardTitle className="text-base">Outline Card</CardTitle>
              <CardDescription>Transparent background with crisp border</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <h3 className="text-base font-semibold tracking-tight text-foreground mt-8 mb-3">
          Interactive Feedback & Density
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Enable interactive hover/press elevation feedback, or use compact density for constrained spaces.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card interactive>
            <CardHeader>
              <CardTitle className="text-base">Interactive Card</CardTitle>
              <CardDescription>Hover over me to see cursor and elevation changes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Clickable surface for dashboards and selectable items.</p>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-base">Compact Card (sm)</CardTitle>
              <CardDescription>Reduced padding for tight sidebars and mobile sheets</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Streamlined layout with denser inner padding.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 5. Keyboard Navigation */}
      <section id="keyboard" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Keyboard Navigation
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Keyboard shortcuts and interaction patterns for this component.
        </p>
        <KeyboardShortcutsTable componentId="card" />
      </section>

      <section id="props" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Props Reference
        </h2>
        <PropsTable
          props={[
            {
              name: 'variant',
              type: "'default' | 'secondary' | 'outline'",
              default: "'default'",
              description: 'Visual presentation style of the card container.',
            },
            {
              name: 'size',
              type: "'default' | 'sm'",
              default: "'default'",
              description: 'Density and padding scale of the card and composite containers.',
            },
            {
              name: 'interactive',
              type: 'boolean',
              default: 'false',
              description: 'Whether the card provides hover/active elevation styling and cursor pointer.',
            },
            {
              name: 'className',
              type: 'string',
              default: "''",
              description: 'Additional CSS class names to apply to the container.',
            },
            {
              name: 'children',
              type: 'React.ReactNode',
              default: '—',
              description: 'Card composite subcomponents or custom elements.',
            },
          ]}
        />
      </section>
    </DocLayout>
  );
}
