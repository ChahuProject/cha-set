import React, { useState } from 'react';
import { Badge, type BadgeVariant, type BadgeSize, Tabs, TabsList, TabsTrigger } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';

export function BadgeDocPage() {
  const [variant, setVariant] = useState<BadgeVariant>('default');
  const [size, setSize] = useState<BadgeSize>('default');

  const heroReactCode = `<Badge variant="${variant}" size="${size}">
  ${variant.charAt(0).toUpperCase() + variant.slice(1)} Badge
</Badge>`;

  const heroQtCode = `ChaSetBadge {
    variant: "${variant}"
    size: "${size}"
    text: "${variant.charAt(0).toUpperCase() + variant.slice(1)} Badge"
}`;

  return (
    <DocLayout
      category="Components"
      title="Badge"
      description="Displays a badge or a component that looks like a badge to highlight status, tags, and counts."
      tocItems={[
        { id: 'overview', title: 'Interactive Overview' },
        { id: 'installation', title: 'Installation' },
        { id: 'variants', title: 'Variants' },
        { id: 'sizes', title: 'Sizes' },
        { id: 'props', title: 'Props Reference' },
      ]}
    >
      {/* 1. Interactive Sandbox Preview */}
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Interactive Overview
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Adjust variant and size in real time with synchronized previews for Web and Desktop.
        </p>

        <ComponentPreview
          title="Badge Sandbox"
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Variant:</span>
                <Tabs value={variant} onValueChange={(v) => setVariant(v as BadgeVariant)}>
                  <TabsList className="h-8">
                    <TabsTrigger value="default" className="h-6 px-2.5 text-xs">Default</TabsTrigger>
                    <TabsTrigger value="secondary" className="h-6 px-2.5 text-xs">Secondary</TabsTrigger>
                    <TabsTrigger value="destructive" className="h-6 px-2.5 text-xs">Destructive</TabsTrigger>
                    <TabsTrigger value="outline" className="h-6 px-2.5 text-xs">Outline</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Size:</span>
                <Tabs value={size} onValueChange={(s) => setSize(s as BadgeSize)}>
                  <TabsList className="h-8">
                    <TabsTrigger value="default" className="h-6 px-2.5 text-xs">Default</TabsTrigger>
                    <TabsTrigger value="sm" className="h-6 px-2.5 text-xs">Small (sm)</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          }
        >
          <Badge variant={variant} size={size}>
            {variant.charAt(0).toUpperCase() + variant.slice(1)} Badge
          </Badge>
        </ComponentPreview>
      </section>

      {/* 2. Installation */}
      <section id="installation" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Installation
        </h2>
        <CodeBlock code="pnpm add @chahu/cha-set" language="bash" />
      </section>

      {/* 3. Variants */}
      <section id="variants" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Variants
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Four standard semantic variants aligned with the ChaSet design token system.
        </p>
        <div className="flex flex-wrap items-center gap-3 p-6 border rounded-xl bg-card">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </section>

      {/* 4. Sizes */}
      <section id="sizes" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Sizes
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Choose between standard pill height (22px) and compact micro badge (16px).
        </p>
        <div className="flex flex-wrap items-center gap-4 p-6 border rounded-xl bg-card">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Default:</span>
            <Badge size="default">Badge Default</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Small:</span>
            <Badge size="sm">NEW</Badge>
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
              name: 'variant',
              type: "'default' | 'secondary' | 'destructive' | 'outline'",
              default: "'default'",
              description: 'Visual stylistic variant corresponding to core color tokens.',
            },
            {
              name: 'size',
              type: "'default' | 'sm'",
              default: "'default'",
              description: 'Size variant determining pill height, padding, and font metrics.',
            },
            {
              name: 'className',
              type: 'string',
              default: "''",
              description: 'Optional additional Tailwind CSS class names.',
            },
          ]}
        />
      </section>
    </DocLayout>
  );
}
