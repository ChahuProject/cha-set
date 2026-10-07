import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, type CardVariant, Button, Badge, SegmentedControl, CodeBlock, Checkbox, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentReference } from '../../components/ComponentReference';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';

export function CardDocPage() {
  const { t } = useChaSetI18n();
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
      category="Surfaces & Layout"
      title="Card"
      description="Displays a card with header, title, description, content, and footer actions."
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
                <span className="text-muted-foreground text-sm">{t('showcase.variant', 'Variant:')}</span>
                <SegmentedControl
                  size="sm"
                  value={variant}
                  onChange={(v) => setVariant(v as CardVariant)}
                  options={[
                    { label: t('common.default', 'Default'), value: 'default' },
                    { label: t('common.secondary', 'Secondary'), value: 'secondary' },
                    { label: t('common.outline', 'Outline'), value: 'outline' },
                  ]}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">{t('showcase.size', 'Size:')}</span>
                <SegmentedControl
                  size="sm"
                  value={size}
                  onChange={(v) => setSize(v as 'default' | 'sm')}
                  options={[
                    { label: t('common.default', 'Default'), value: 'default' },
                    { label: t('surfaces.card.compact', 'Compact (sm)'), value: 'sm' },
                  ]}
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-foreground">
                <Checkbox
                  checked={interactive}
                  onCheckedChange={(val) => setInteractive(Boolean(val))}
                />
                {t('surfaces.card.interactiveFeedback', 'Interactive Feedback')}
              </label>
            </div>
          }
        >
          <Card variant={variant} size={size} interactive={interactive} className="w-full max-w-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('surfaces.card.heroTitle', 'Create project')}</CardTitle>
                <Badge variant="secondary">{t('surfaces.card.heroBadge', 'Pro')}</Badge>
              </div>
              <CardDescription>{t('surfaces.card.heroDescription', 'Deploy your new project in one-click.')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t('surfaces.card.heroContent', 'Your project will be deployed to the edge network automatically.')}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">{t('common.cancel', 'Cancel')}</Button>
              <Button size="sm">{t('surfaces.card.deploy', 'Deploy')}</Button>
            </CardFooter>
          </Card>
        </ComponentPreview>
      </section>

      {/* 2. Installation */}
      {/* 3. Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@chahu/cha-set';\n\n<Card>\n  <CardHeader>\n    <CardTitle>Card Title</CardTitle>\n    <CardDescription>Card Description</CardDescription>\n  </CardHeader>\n  <CardContent>Main content area</CardContent>\n  <CardFooter>Footer actions</CardFooter>\n</Card>`}
        qtCode={`import ChaSet\n\nChaSetCard {\n    variant: "default"\n    ChaSetCardHeader {\n        ChaSetCardTitle { text: "Card Title" }\n        ChaSetCardDescription { text: "Card Description" }\n    }\n    ChaSetCardContent {\n        ChaSetLabel { text: "Main content area" }\n    }\n    ChaSetCardFooter {\n        ChaSetButton { size: "sm"; text: "Footer action" }\n    }\n}`}
      />

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
              <CardTitle className="text-base">{t('surfaces.card.defaultCardTitle', 'Default Card')}</CardTitle>
              <CardDescription>{t('surfaces.card.defaultCardDesc', 'Elevated surface with panel background')}</CardDescription>
            </CardHeader>
          </Card>
          <Card variant="secondary">
            <CardHeader>
              <CardTitle className="text-base">{t('surfaces.card.secondaryCardTitle', 'Secondary Card')}</CardTitle>
              <CardDescription>{t('surfaces.card.secondaryCardDesc', 'Subtle contrast for grouped secondary items')}</CardDescription>
            </CardHeader>
          </Card>
          <Card variant="outline">
            <CardHeader>
              <CardTitle className="text-base">{t('surfaces.card.outlineCardTitle', 'Outline Card')}</CardTitle>
              <CardDescription>{t('surfaces.card.outlineCardDesc', 'Transparent background with crisp border')}</CardDescription>
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
              <CardTitle className="text-base">{t('surfaces.card.interactiveCardTitle', 'Interactive Card')}</CardTitle>
              <CardDescription>{t('surfaces.card.interactiveCardDesc', 'Hover over me to see cursor and elevation changes')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{t('surfaces.card.interactiveCardContent', 'Clickable surface for dashboards and selectable items.')}</p>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-base">{t('surfaces.card.compactCardTitle', 'Compact Card (sm)')}</CardTitle>
              <CardDescription>{t('surfaces.card.compactCardDesc', 'Reduced padding for tight sidebars and mobile sheets')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{t('surfaces.card.compactCardContent', 'Streamlined layout with denser inner padding.')}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 5. Keyboard Navigation */}
            <ComponentReference
        name="Card"
        componentId="card"
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
    </DocLayout>
  );
}
