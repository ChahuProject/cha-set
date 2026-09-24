import React, { useState } from 'react';
import { Badge, type BadgeVariant, type BadgeSize, Tabs, TabsList, TabsTrigger, Checkbox, Card } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { ComponentReference } from "../../components/ComponentReference";

export function BadgeDocPage() {
  const [variant, setVariant] = useState<BadgeVariant>('default');
  const [size, setSize] = useState<BadgeSize>('default');
  const [dot, setDot] = useState(false);
  const [removable, setRemovable] = useState(false);
  const [removed, setRemoved] = useState(false);

  const heroReactCode = `<Badge
  variant="${variant}"
  size="${size}"${dot ? '\n  dot' : ''}${removable ? '\n  removable\n  onRemove={() => console.log("removed")}' : ''}
>
  ${variant.charAt(0).toUpperCase() + variant.slice(1)} Badge
</Badge>`;

  const heroQtCode = `ChaSetBadge {
    variant: "${variant}"
    size: "${size}"
    text: "${variant.charAt(0).toUpperCase() + variant.slice(1)} Badge"${dot ? '\n    dot: true' : ''}${removable ? '\n    removable: true\n    onRemoved: console.log("removed")' : ''}
}`;

  return (
    <DocLayout
      category="Base Primitives"
      title="Badge"
      description="Displays a badge or a component that looks like a badge to highlight status, tags, and counts."
    >
      {/* 1. Interactive Sandbox Preview */}
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Interactive Overview
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Adjust variant, size, and interactive status options in real time with synchronized previews for Web and Desktop.
        </p>

        <ComponentPreview
          title="Badge Sandbox"
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">Variant:</span>
                <Tabs value={variant} onValueChange={(v) => setVariant(v as BadgeVariant)}>
                  <TabsList className="h-8">
                    <TabsTrigger value="default" className="h-6 px-2 text-xs">Default</TabsTrigger>
                    <TabsTrigger value="secondary" className="h-6 px-2 text-xs">Secondary</TabsTrigger>
                    <TabsTrigger value="destructive" className="h-6 px-2 text-xs">Destructive</TabsTrigger>
                    <TabsTrigger value="outline" className="h-6 px-2 text-xs">Outline</TabsTrigger>
                    <TabsTrigger value="ghost" className="h-6 px-2 text-xs">Ghost</TabsTrigger>
                    <TabsTrigger value="link" className="h-6 px-2 text-xs">Link</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">Size:</span>
                <Tabs value={size} onValueChange={(s) => setSize(s as BadgeSize)}>
                  <TabsList className="h-8">
                    <TabsTrigger value="default" className="h-6 px-2.5 text-xs">Default</TabsTrigger>
                    <TabsTrigger value="sm" className="h-6 px-2.5 text-xs">Small (sm)</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <Checkbox
                size="sm"
                checked={dot}
                onCheckedChange={(v) => setDot(v)}
                label="Status Dot"
              />

              <Checkbox
                size="sm"
                checked={removable}
                onCheckedChange={(v) => {
                  setRemovable(v);
                  setRemoved(false);
                }}
                label="Removable"
              />
            </div>
          }
        >
          {removed ? (
            <button
              type="button"
              onClick={() => setRemoved(false)}
              className="text-xs text-primary underline cursor-pointer"
            >
              Reset Removed Badge
            </button>
          ) : (
            <Badge
              variant={variant}
              size={size}
              dot={dot}
              removable={removable}
              onRemove={() => setRemoved(true)}
            >
              {variant.charAt(0).toUpperCase() + variant.slice(1)} Badge
            </Badge>
          )}
        </ComponentPreview>
      </section>

      {/* 2. Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { Badge } from '@chahu/cha-set';\n\n<Badge>Badge</Badge>`}
        qtCode={`import ChaSet\n\nChaSetBadge {\n    text: "Badge"\n}`}
      />

      {/* 3. Variants */}
      <section id="variants" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Variants
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          All six standard semantic variants aligned with the ChaSet design token system.
        </p>
        <Card className="flex flex-wrap items-center gap-3 p-6">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="ghost">Ghost</Badge>
          <Badge variant="link">Link</Badge>
        </Card>
      </section>

      {/* 4. Sizes */}
      <section id="sizes" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Sizes
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Choose between standard pill scale (default) and compact micro badge (sm).
        </p>
        <Card className="flex flex-wrap items-center gap-4 p-6">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Default:</span>
            <Badge size="default">Badge Default</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Small:</span>
            <Badge size="sm">NEW</Badge>
          </div>
        </Card>
      </section>

      {/* 5. Status & Removable Badges */}
      <section id="status-removable-tags" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Status & Removable Tags
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Badges support live status indicator dots and dismissible action buttons for filter tags.
        </p>
        <Card className="flex flex-wrap items-center gap-4 p-6">
          <Badge dot dotColor="bg-emerald-500" variant="outline">Online</Badge>
          <Badge dot dotColor="bg-amber-500" variant="outline">Away</Badge>
          <Badge dot dotColor="bg-rose-500" variant="destructive">Error</Badge>
          <Badge removable onRemove={() => alert('Removed!')}>React Tag</Badge>
          <Badge removable onRemove={() => alert('Removed!')} variant="secondary">Qt Quick</Badge>
        </Card>
      </section>

            {/* Animations */}
      <section id="animations" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">
          Animations
        </h2>
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            Motion behavior and timing for interactive states aligned with ChaSet tokens.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground">
            <li>
              State changes (hover, press, focus) animate over{" "}
              <code className="text-xs bg-muted px-1 rounded">duration-quick</code> with the{" "}
              <code className="text-xs bg-muted px-1 rounded">ease-standard</code> curve.
            </li>
            <li>
              Durations and easing resolve from theme tokens, so{" "}
              <code>prefers-reduced-motion</code> zeroes them automatically (Qt: governed by{" "}
              <code>ThemeTokens.animationsEnabled</code>).
            </li>
          </ul>
        </div>
      </section>

      <ComponentReference
        name="Badge"
        componentId="badge"
        props={[
          {
            name: 'variant',
            type: "'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'",
            default: "'default'",
            description: 'Visual stylistic variant corresponding to core color tokens.',
          },
          {
            name: 'size',
            type: "'default' | 'sm'",
            default: "'default'",
            description: 'Size variant determining pill height, padding, and font metrics scale.',
          },
          {
            name: 'dot',
            type: 'boolean',
            default: 'false',
            description: 'Whether to display a leading status indicator dot.',
          },
          {
            name: 'dotColor',
            type: 'string',
            default: 'undefined',
            description: 'Custom color class for the status dot (e.g. bg-emerald-500).',
          },
          {
            name: 'removable',
            type: 'boolean',
            default: 'false',
            description: 'Whether to display an inline dismiss/remove action button.',
          },
          {
            name: 'onRemove',
            type: '() => void',
            default: 'undefined',
            description: 'Callback fired when the dismiss/remove action is triggered.',
          },
          {
            name: 'interactive',
            type: 'boolean',
            default: 'false',
            description: 'Whether the badge responds with interactive cursor and click effects.',
          },
          {
            name: 'className',
            type: 'string',
            default: "''",
            description: 'Optional additional Tailwind CSS class names.',
          },
        ]}
      />
    </DocLayout>
  );
}
