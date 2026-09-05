import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  type CardVariant,
  Button,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';

export function CardDocPage() {
  const [variant, setVariant] = useState<CardVariant>('default');

  const heroReactCode = `<Card variant="${variant}" className="w-[350px]">
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
    <Button variant="outline">Cancel</Button>
    <Button>Deploy</Button>
  </CardFooter>
</Card>`;

  const heroQtCode = `ChaSetCard {
    width: 350
    variant: "${variant}"

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
        ChaSetButton { variant: "outline"; text: "Cancel" }
        ChaSetButton { text: "Deploy" }
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
                <span className="text-muted-foreground">Variant:</span>
                <Tabs value={variant} onValueChange={(v) => setVariant(v as CardVariant)}>
                  <TabsList className="h-8">
                    <TabsTrigger value="default" className="h-6 px-2.5 text-xs">Default</TabsTrigger>
                    <TabsTrigger value="secondary" className="h-6 px-2.5 text-xs">Secondary</TabsTrigger>
                    <TabsTrigger value="outline" className="h-6 px-2.5 text-xs">Outline</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          }
        >
          <Card variant={variant} className="w-full max-w-sm">
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
      </section>

      {/* 5. Props Reference */}
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
